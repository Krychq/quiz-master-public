import { db } from "@/db";
import { result, userAnswer, question } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ResultsView } from "@/components/results/results-view";
import { formatTime } from "@/lib/utils";
import he from "he";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ resultsId: string }>;
}) {
  const { resultsId } = await params;

  const [quizResult] = await db
    .select()
    .from(result)
    .where(eq(result.id, resultsId))
    .limit(1);

  if (!quizResult) notFound();

  const userAnswersData = await db
    .select({
      id: userAnswer.id,
      selectedAnswer: userAnswer.selectedAnswer,
      isCorrect: userAnswer.isCorrect,
      questionText: question.content,
      correctAnswer: question.correctAnswer,
    })
    .from(userAnswer)
    .leftJoin(question, eq(userAnswer.questionId, question.id))
    .where(eq(userAnswer.resultId, resultsId));

  const mappedData = {
    resultsId,
    quizId: quizResult.quizId,
    score: quizResult.score,
    total: quizResult.totalQuestions,
    timeSpentFormatted: formatTime(quizResult.timeSpent),
    questions: userAnswersData.map((ua) => ({
      id: ua.id,
      question: he.decode(ua.questionText ?? "Question not found"),
      userAnswer: he.decode(ua.selectedAnswer ?? ""),
      correctAnswer: he.decode(ua.correctAnswer ?? ""),
      isCorrect: ua.isCorrect,
    })),
  };

  return <ResultsView data={mappedData} />;
}
