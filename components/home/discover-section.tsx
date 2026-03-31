import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, User } from "lucide-react";
import { getPublicQuizzes } from "@/app/actions/quiz";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";

export async function DiscoverSection() {
  const { data: quizzes } = await getPublicQuizzes();

  return (
    <section
      className="bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 scroll-mt-20"
      id="discover-section"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Discover Community Quizzes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Explore quizzes created by our community. Find your favorite topics
            and challenge yourself!
          </p>
        </div>

        {quizzes.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No public quizzes yet. Be the first to create one!
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {quizzes.map((quiz) => {
              const displayName = quiz.authorNickname ?? "Anonymous";

              return (
                <Card
                  key={quiz.id}
                  className="group flex flex-col border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="line-clamp-2 text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                      {quiz.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <Link
                      href={`/profile/${quiz.userId}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <UserAvatar
                        src={quiz.authorAvatarUrl}
                        alt={displayName}
                        className="h-6 w-6"
                      />
                      <span className="text-sm text-muted-foreground">
                        {displayName}
                      </span>
                    </Link>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                      >
                        {quiz.questionCount} Questions
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                    >
                      <Link href={`/quiz/${quiz.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Play
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
