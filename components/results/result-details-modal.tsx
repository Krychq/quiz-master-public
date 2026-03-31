"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { getQuizResultDetails } from "@/app/actions/quiz";
import { Loader2, CheckCircle2, XCircle, ListChecks } from "lucide-react";

interface QuizResultData {
  score: number;
  total: number;
  timeSpentFormatted: string;
  questions: {
    id: string;
    isCorrect: boolean;
    userAnswer: string | null;
    question: string;
    correctAnswer: string;
  }[];
}

export function ResultDetailsModal({ resultId, className }: { resultId: string; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<QuizResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open && !data) {
      startTransition(async () => {
        const res = await getQuizResultDetails(resultId);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.error || "Failed to load details");
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 shrink-0 ${className || ""}`}>
          <ListChecks className="h-4 w-4" />
          <span className="hidden sm:inline">Check answers</span>
          <span className="sm:hidden">Answers</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Quiz Details</DialogTitle>
          <DialogDescription>
            Review the answers you submitted for this quiz.
          </DialogDescription>
        </DialogHeader>

        {isPending && !data ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : null}

        {error ? (
          <div className="text-sm text-red-500 p-4 text-center">{error}</div>
        ) : null}

        {data ? (
          <div className="flex flex-col gap-4 min-h-0 flex-1">
            <div className="flex gap-4 text-sm text-muted-foreground px-1 shrink-0">
              <div>Score: <span className="font-bold text-primary">{data.score}</span> / {data.total}</div>
              <div>Time: <span className="font-bold text-primary">{data.timeSpentFormatted}</span></div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
              <div className="flex flex-col gap-4 pb-4 px-1">
                {data.questions.map((q, index: number) => (
                  <Card key={q.id} className="p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 pt-0.5">
                        {q.isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-3 text-sm font-medium text-foreground md:text-base">
                          <span className="text-muted-foreground">Q{index + 1}.</span>{" "}
                          {q.question}
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-muted-foreground">
                              Your Answer:
                            </span>
                            {!q.userAnswer ? (
                              <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                Not answered
                              </span>
                            ) : (
                              <span
                                className={`rounded px-2 py-0.5 font-medium ${q.isCorrect ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                              >
                                {q.userAnswer}
                              </span>
                            )}
                          </div>
                          {!q.isCorrect && (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-muted-foreground">
                                Correct Answer:
                              </span>
                              <span className="rounded bg-green-100 px-2 py-0.5 font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                {q.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
