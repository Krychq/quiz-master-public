'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { quiz, question, result, userAnswer } from '@/db/schema'
import { eq, sql, asc } from 'drizzle-orm'
import he from 'he'
import { quizSchema } from '@/lib/schemas/quiz'
import type { ActionState } from '@/types'

export interface QuizPayload {
  title: string
  description: string
  visibility: 'PUBLIC' | 'PRIVATE' | 'WITH_LINK'
  questions: Array<{
    content: string
    correctAnswer: string
    incorrectAnswers: string[]
    imageUrl: string | null
  }>
}

export async function getPublicQuizzes() {
  try {
    const rows = await db
      .select({
        id: quiz.id,
        title: quiz.title,
        userId: quiz.userId,
        createdAt: quiz.createdAt,
        questionCount: sql<number>`(
          SELECT COUNT(*)::int FROM question WHERE question.quiz_id = quiz.id
        )`,
        authorNickname: sql<string | null>`(
          SELECT raw_user_meta_data->>'nickname'
          FROM auth.users
          WHERE auth.users.id = quiz.user_id
        )`,
        authorAvatarUrl: sql<string | null>`(
          SELECT raw_user_meta_data->>'avatar_url'
          FROM auth.users
          WHERE auth.users.id = quiz.user_id
        )`,
      })
      .from(quiz)
      .where(eq(quiz.visibility, 'PUBLIC'))
      .orderBy(asc(quiz.createdAt))
      .limit(8)

    return { success: true, data: rows }
  } catch (err: unknown) {
    console.error('Failed to fetch public quizzes', err)
    return { success: false, data: [] as never[] }
  }
}

export async function createQuiz(quizData: QuizPayload): Promise<ActionState & { quizId?: string }> {
  const parsed = quizSchema.safeParse(quizData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  try {
    const { title, description, visibility, questions } = parsed.data

    const [newQuiz] = await db.insert(quiz).values({
      title,
      description: description || null,
      visibility,
      userId: user.id,
    }).returning({ id: quiz.id })

    const questionsToInsert = questions.map((q) => ({
      quizId: newQuiz.id,
      content: q.content,
      correctAnswer: q.correctAnswer,
      incorrectAnswers: q.incorrectAnswers,
      imageUrl: q.imageUrl ?? null,
    }))

    if (questionsToInsert.length > 0) {
      await db.insert(question).values(questionsToInsert)
    }

    revalidatePath('/', 'page')
    revalidatePath(`/profile/${user.id}`, 'page')
    return { success: true, quizId: newQuiz.id }

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred'
    console.error('Failed to create quiz', err)
    return { success: false, error: message }
  }
}

export async function getQuizResultDetails(resultId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const [resultRow] = await db.select().from(result).where(eq(result.id, resultId))

    if (!resultRow) return { success: false, error: 'Result not found' }

    if (resultRow.userId && resultRow.userId !== user.id) {
      return { success: false, error: 'Unauthorized viewing' }
    }

    const answers = await db
      .select({
        id: userAnswer.id,
        isCorrect: userAnswer.isCorrect,
        userAnswer: userAnswer.selectedAnswer,
        question: question.content,
        correctAnswer: question.correctAnswer,
      })
      .from(userAnswer)
      .innerJoin(question, eq(userAnswer.questionId, question.id))
      .where(eq(userAnswer.resultId, resultId))

    const minutes = Math.floor(resultRow.timeSpent / 60)
    const seconds = resultRow.timeSpent % 60
    const timeSpentFormatted = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

    return {
      success: true,
      data: {
        score: resultRow.score,
        total: resultRow.totalQuestions,
        timeSpentFormatted,
        questions: answers,
      },
    }
  } catch (err: unknown) {
    console.error('Failed to get quiz result details:', err)
    return { success: false, error: 'Failed to retrieve result details' }
  }
}

export async function createQuickGame(amount: number, category: string, difficulty: string) {
  let newId = ''
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    const response = await fetch(url)
    const data = await response.json()

    if (data.response_code !== 0 || !data.results.length) {
      return {
        success: false,
        error: 'Not enough questions found for this exact category/difficulty combination. Try changing your settings.',
      }
    }

    const rawCategory = he.decode(data.results[0].category)
    const quizTitle = `Quick Play: ${rawCategory} (${difficulty})`

    const [newQuiz] = await db.insert(quiz).values({
      title: quizTitle,
      description: 'A fast-paced match generated on the fly.',
      visibility: 'PRIVATE',
      userId: user?.id || null,
    }).returning({ id: quiz.id })
    newId = newQuiz.id

    const questionsToInsert = data.results.map((q: { question: string; correct_answer: string; incorrect_answers: string[] }) => ({
      quizId: newQuiz.id,
      content: he.decode(q.question),
      correctAnswer: he.decode(q.correct_answer),
      incorrectAnswers: q.incorrect_answers.map((ans: string) => he.decode(ans)),
    }))

    await db.insert(question).values(questionsToInsert)
    if (user?.id) {
      revalidatePath(`/profile/${user.id}`, 'page')
    }

  } catch (error: unknown) {
    console.error('Failed to generate quick game', error)
    return { success: false, error: 'Failed to instantly generate quick game.' }
  }

  redirect(`/quiz/${newId}`)
}

export async function submitQuizResult(
  quizId: string,
  userAnswersArray: { questionId: string; answer: string | null }[],
  timeSpent: number
) {
  let newResultId = ''

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const quizQuestions = await db.select().from(question).where(eq(question.quizId, quizId))

    let score = 0
    const totalQuestions = quizQuestions.length
    const answersToInsert = []

    for (const qa of quizQuestions) {
      const submitted = userAnswersArray.find((ua) => ua.questionId === qa.id)
      const selectedAnswer = submitted?.answer || null
      const isCorrect = selectedAnswer === qa.correctAnswer

      if (isCorrect) score++

      answersToInsert.push({ questionId: qa.id, selectedAnswer, isCorrect })
    }

    const [newResult] = await db.insert(result).values({
      quizId,
      userId: user?.id || null,
      score,
      totalQuestions,
      timeSpent,
    }).returning({ id: result.id })
    newResultId = newResult.id

    const fullAnswers = answersToInsert.map((a) => ({
      ...a,
      resultId: newResult.id,
    }))

    await db.insert(userAnswer).values(fullAnswers)
    revalidatePath('/my-results', 'page')

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error'
    console.error('Failed to submit result', error)
    return { success: false, error: message }
  }

  redirect(`/results/${newResultId}`)
}
