import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionData {
  id: string;
  question: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

interface ResultsAnswerReviewProps {
  questions: QuestionData[];
}

export function ResultsAnswerReview({ questions }: ResultsAnswerReviewProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Review Your Answers
      </h2>
      <div className="flex flex-col gap-4">
        {questions.map((q, index) => (
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
                    <span className="text-muted-foreground">Your Answer:</span>
                    {q.userAnswer === null ? (
                      <span className="rounded bg-amber-100 px-2 py-0.5 font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Timed Out
                      </span>
                    ) : (
                      <span
                        className={`rounded px-2 py-0.5 font-medium ${
                          q.isCorrect
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {q.userAnswer}
                      </span>
                    )}
                  </div>
                  {!q.isCorrect && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground">Correct Answer:</span>
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
    </section>
  );
}
