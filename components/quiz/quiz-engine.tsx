"use client";

import { useState, useEffect } from "react";
import { QuizEngineProps, UserAnswer } from "@/types";
import { QuestionView } from "./question-view";
import { submitQuizResult } from "@/app/actions/quiz";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const SECONDS_PER_QUESTION = 15;

export function QuizEngine({ quizId, questions }: QuizEngineProps) {
  const [startTime] = useState(Date.now());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleAnswer(null);
          return SECONDS_PER_QUESTION;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isSubmitting]);

  const handleAnswer = async (selectedAnswer: string | null) => {
    const currentQuestion = questions[currentIndex];

    const newAnswers = [
      ...userAnswers,
      { questionId: currentQuestion.id, answer: selectedAnswer },
    ];
    setUserAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(SECONDS_PER_QUESTION);

      return;
    }

    const endTime = Date.now();
    const durationInSeconds = Math.floor((endTime - startTime) / 1000);

    setIsSubmitting(true);
    const subbmitResult = await submitQuizResult(
      quizId,
      newAnswers,
      durationInSeconds,
    );
    console.log(subbmitResult);

    if (subbmitResult && !subbmitResult.success) {
      toast.error("Błąd zapisu", {
        description: subbmitResult.error,
      });
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-lg font-medium">Calculating your score...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Button variant="outline" size="icon" asChild className="absolute top-4 left-4 z-50 rounded-full bg-background/50 backdrop-blur-md">
        <Link href="/">
          <Home className="w-5 h-5 text-foreground" /> 
        </Link>
      </Button>

      <div className="fixed opacity-0 pointer-events-none -z-50 h-px w-px overflow-hidden">
        {questions.map((q) => (
          q.imageUrl && (
            <Image
              key={`prefetch-${q.id}`}
              src={q.imageUrl}
              alt=""
              width={800}
              height={450}
              priority
            />
          )
        ))}
      </div>

      <div className="flex-1 overflow-y-auto relative flex flex-col">
        <QuestionView
          question={currentQuestion}
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          timeLeft={timeLeft}
          maxTime={SECONDS_PER_QUESTION}
          onAnswer={handleAnswer}
        />
      </div>

      <footer className="w-full border-t border-border/40 py-4 px-4 shrink-0 bg-background text-center flex items-center justify-center z-10">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} QuizMaster. All rights reserved. Developed by:{" "}
          <Link href="https://urbandev.netlify.app" className="hover:text-foreground transition-colors font-bold" target="_blank" rel="noopener noreferrer">
            Krystian Urban
          </Link>
        </p>
      </footer>
    </div>
  );
}
