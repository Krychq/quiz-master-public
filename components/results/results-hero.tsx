"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Share2, RotateCcw, Home } from "lucide-react";

interface ResultsHeroProps {
  score: number;
  total: number;
  percentage: number;
  feedbackMessage: string;
  quizId: string;
  onShareOpen: () => void;
}

export function ResultsHero({
  score,
  total,
  percentage,
  feedbackMessage,
  quizId,
  onShareOpen
}: ResultsHeroProps) {
  const [ringHovered, setRingHovered] = useState(false);

  return (
    <section className="flex flex-col items-center justify-center px-4 py-12 md:py-20">
      <button
        onClick={onShareOpen}
        onMouseEnter={() => setRingHovered(true)}
        onMouseLeave={() => setRingHovered(false)}
        className="group relative mb-6 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full"
        aria-label="Click to share your results"
      >
        {!ringHovered && (
          <Share2 className="absolute top-0 right-0 left-auto h-5 w-5 text-primary opacity-60 " />
        )}
        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 ${
            ringHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Circular Progress Ring */}
        <svg
          className={`relative h-40 w-40 -rotate-90 transform transition-transform duration-300 md:h-48 md:w-48 ${
            ringHovered ? "scale-105" : "scale-100"
          }`}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.83} 283`}
            className={`text-primary transition-all duration-1000 ease-out ${
              ringHovered ? "drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" : ""
            }`}
          />
        </svg>

        {/* Score Text & Share Hint */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-4xl font-bold text-foreground transition-all duration-300 md:text-5xl ${
              ringHovered ? "scale-95 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {score}/{total}
          </span>
          <span
            className={`text-sm text-muted-foreground transition-all duration-300 ${
              ringHovered ? "opacity-0" : "opacity-100"
            }`}
          >
            {percentage}%
          </span>

          {/* Share hint on hover */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${
              ringHovered ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
          >
            <Share2 className="mb-1 h-6 w-6 text-primary" />
            <span className="text-sm font-medium text-primary">Share</span>
          </div>
        </div>
      </button>

      <h1 className="mb-2 text-center text-2xl font-bold text-foreground md:text-3xl">
        {feedbackMessage}
      </h1>
      <p className="mb-8 text-center text-muted-foreground">
        You answered {score} out of {total} questions correctly.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href={`/quiz/${quizId}`}>
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            New Quiz
          </Link>
        </Button>
      </div>
    </section>
  );
}
