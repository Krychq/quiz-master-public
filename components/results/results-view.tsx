"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { ResultsViewShareModal } from "./share-modal";
import { ResultsHero } from "./results-hero";
import { ResultsStatsSummary } from "./results-stats-summary";
import { ResultsAnswerReview } from "./results-answer-review";
import { Metadata } from "next";

interface ResultsViewProps {
  data: {
    resultsId: string;
    quizId: string;
    score: number;
    total: number;
    timeSpentFormatted: string;
    questions: {
      id: string;
      question: string;
      userAnswer: string | null;
      correctAnswer: string;
      isCorrect: boolean;
    }[];
  };
}

function getFeedbackMessage(percentage: number): string {
  if (percentage >= 90) return "Outstanding!";
  if (percentage >= 70) return "Excellent Work!";
  if (percentage >= 50) return "Good Effort!";
  return "Keep Practicing!";
}

function getAccuracyLabel(percentage: number): string {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 70) return "High";
  if (percentage >= 50) return "Medium";
  return "Low";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ resultId: string }>;
}): Promise<Metadata> {
  const { resultId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const ogImageUrl = `${baseUrl}/api/og?id=${resultId}`;

  return {
    title: "Mój wynik w quizie!",
    description: "Zobacz, jak mi poszło i spróbuj uzyskać lepszy wynik.",
    openGraph: {
      title: "Mój wynik w quizie!",
      description: "Zobacz, jak mi poszło i spróbuj uzyskać lepszy wynik.",
      url: `${baseUrl}/results/${resultId}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Karta wyniku quizu",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Mój wynik w quizie!",
      description: "Zobacz, jak mi poszło i spróbuj uzyskać lepszy wynik.",
      images: [ogImageUrl],
    },
  };
}

export function ResultsView({ data }: ResultsViewProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [ringHovered, setRingHovered] = useState(false);

  const { score, total, timeSpentFormatted, questions } = data;
  const percentage = Math.round((score / total) * 100);

  const feedbackMessage = useMemo(
    () => getFeedbackMessage(percentage),
    [percentage],
  );
  const accuracyLabel = useMemo(
    () => getAccuracyLabel(percentage),
    [percentage],
  );

  useEffect(() => {
    if (percentage >= 50) {
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#6366f1", "#8b5cf6", "#a855f7"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#6366f1", "#8b5cf6", "#a855f7"],
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [percentage]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <ResultsHero
        score={score}
        total={total}
        percentage={percentage}
        feedbackMessage={feedbackMessage}
        quizId={data.quizId}
        onShareOpen={() => setIsShareOpen(true)}
      />

      <ResultsViewShareModal
        isOpen={isShareOpen}
        setIsOpen={setIsShareOpen}
        percentage={percentage}
        resultId={data.resultsId}
        quizId={data.quizId}
      />

      {/* Stats Summary */}
      <ResultsStatsSummary
        percentage={percentage}
        timeSpentFormatted={timeSpentFormatted}
        accuracyLabel={accuracyLabel}
      />

      {/* Answer Review */}
      <ResultsAnswerReview questions={questions} />
    </div>
  );
}
