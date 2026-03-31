"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuestionViewProps } from "@/types";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export function QuestionView({
  question,
  currentIndex,
  totalQuestions,
  timeLeft,
  maxTime,
  onAnswer,
}: QuestionViewProps) {
  const progressValue = (timeLeft / maxTime) * 100;
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    setImageLoading(true);
  }, [question.id]);

  return (
    <div className="relative max-w-2xl h-full w-full flex-1 mx-auto flex flex-col items-center justify-center bg-background">
      <header className="absolute top-0 z-10 w-full">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className={`text-sm ${timeLeft <= 5 ? "text-destructive font-semibold" : "text-muted-foreground font-medium"}`}>
              {timeLeft}s
            </span>
          </div>
          <Progress
            value={progressValue}
            className="h-2 bg-transparent"
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 w-full">
        <div className="w-full max-w-2xl space-y-8">
          {question.imageUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted flex items-center justify-center">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
              )}
              <Image
                key={question.id}
                src={question.imageUrl}
                alt="Question illustration"
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300",
                  imageLoading ? "opacity-0" : "opacity-100"
                )}
                width={800}
                height={450}
                priority
                onLoad={() => setImageLoading(false)}
              />
            </div>
          )}

          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-balance leading-tight">
              {question.content}
            </h1>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {question.answers.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onAnswer(option)}
                className={cn(
                  "h-auto min-h-14 px-6 py-4 text-base md:text-lg font-medium transition-all duration-200",
                  "justify-center text-center whitespace-normal",
                  "hover:border-primary/50 hover:bg-accent",
                )}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
