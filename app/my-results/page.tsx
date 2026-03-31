import { db } from "@/db";
import { result as resultTable, quiz } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Trophy, Target, Timer, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResultDetailsModal } from "@/components/results/result-details-modal";
import { ShareResultButton } from "@/components/results/share-result-button";

export default async function MyResultsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const userResults = await db
    .select({
      id: resultTable.id,
      quizId: resultTable.quizId,
      score: resultTable.score,
      totalQuestions: resultTable.totalQuestions,
      timeSpent: resultTable.timeSpent,
      createdAt: resultTable.createdAt,
      quizTitle: quiz.title,
    })
    .from(resultTable)
    .leftJoin(quiz, eq(resultTable.quizId, quiz.id))
    .where(eq(resultTable.userId, user.id))
    .orderBy(desc(resultTable.createdAt));

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Results
            </h1>
            <p className="text-muted-foreground">
              Review your past performance and track your progress.
            </p>
          </div>
        </div>

        {userResults.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              You haven't played any quizzes yet. Go back to the home page to
              start a quick game!
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {userResults.map((r) => {
              const percentage = Math.round((r.score / r.totalQuestions) * 100);
              return (
                <Card
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center hover:shadow-md transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <CardHeader className="pb-4 sm:pb-6">
                      <CardTitle
                        className="text-xl truncate"
                        title={r.quizTitle || "Unknown Quiz"}
                      >
                        {r.quizTitle || "Unknown Quiz"}
                      </CardTitle>
                      <CardDescription>
                        {formatDistanceToNow(r.createdAt, { addSuffix: true })}
                      </CardDescription>
                    </CardHeader>
                  </div>

                  <CardContent className="pb-4 sm:pb-0 sm:py-6 sm:px-6 w-full sm:w-auto flex-shrink-0">
                    <div className="flex gap-8 sm:gap-12">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                          <Target className="h-4 w-4" />
                          Score
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-foreground">
                            {r.score} / {r.totalQuestions}
                          </span>
                          <span className="text-muted-foreground text-xs font-medium">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-sm flex items-center gap-1.5">
                          <Timer className="h-4 w-4" />
                          Time
                        </span>
                        <span className="font-semibold text-foreground">
                          {r.timeSpent}s
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4 sm:pt-6 pb-5 sm:pb-6 w-full sm:w-auto flex-shrink-0 border-t sm:border-0 border-border/50">
                    <div className="grid grid-cols-2 gap-2 w-full sm:w-[280px]">
                      <ShareResultButton
                        percentage={percentage}
                        resultId={r.id}
                        quizId={r.quizId}
                        className="w-full"
                      />
                      <ResultDetailsModal resultId={r.id} className="w-full" />
                      {r.quizId && (
                        <Button
                          asChild
                          size="sm"
                          className="gap-1.5 shrink-0 col-span-2 w-full"
                        >
                          <Link href={`/quiz/${r.quizId}`}>
                            <RotateCcw className="h-3.5 w-3.5" />
                            Play again
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
