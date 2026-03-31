import { QuizEngine } from "@/components/quiz/quiz-engine";
import { db } from "@/db";
import { quiz, question } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import he from "he";
import { createClient } from "@/lib/supabase/server";
import type { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ quizId: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { quizId } = await params;
  try {
    const currentQuiz = await db.query.quiz.findFirst({
      where: eq(quiz.id, quizId),
    });

    if (!currentQuiz) {
      return { title: "Quiz Not Found" };
    }

    return {
      title: `${currentQuiz.title} - QuizMaster`,
      description:
        currentQuiz.description ||
        `Play the ${currentQuiz.title} quiz on QuizMaster!`,
      openGraph: {
        title: currentQuiz.title,
        description:
          currentQuiz.description ||
          `Play the ${currentQuiz.title} quiz on QuizMaster!`,
      },
    };
  } catch (e) {
    return { title: "Quiz - QuizMaster" };
  }
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = await params;

  let currentQuiz;
  try {
    currentQuiz = await db.query.quiz.findFirst({
      where: eq(quiz.id, quizId),
    });

    if (!currentQuiz) {
      notFound();
    }

    if (currentQuiz.visibility === "PRIVATE") {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.id !== currentQuiz.userId) {
        notFound();
      }
    }
  } catch (error) {
    notFound();
  }

  const quizQuestions = await db.query.question.findMany({
    where: eq(question.quizId, quizId),
  });

  const safeQuestions = quizQuestions.map((q) => {
    const decodedContent = he.decode(q.content);
    const decodedCorrect = he.decode(q.correctAnswer);
    const decodedIncorrect = q.incorrectAnswers.map((ans) => he.decode(ans));

    let allAnswers = [...decodedIncorrect, decodedCorrect];

    if (allAnswers.length === 2 && allAnswers.includes("True")) {
      allAnswers = ["True", "False"];
    } else {
      allAnswers.sort(() => Math.random() - 0.5);
    }

    return {
      id: q.id,
      content: decodedContent,
      answers: allAnswers,
      imageUrl: q.imageUrl,
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: currentQuiz.title,
    description:
      currentQuiz.description ||
      `Play the ${currentQuiz.title} quiz on QuizMaster!`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://quiz-master.netlify.app"}/quiz/${quizId}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <QuizEngine quizId={quizId} questions={safeQuestions} />
    </>
  );
}
