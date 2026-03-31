import { createClient, getUser } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QuizBuilder } from "@/components/create-quiz/quiz-builder";

export default async function CreateQuizPage() {
  const user = await getUser();

  if (!user) {
    redirect("/?login=true");
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create New Quiz</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Configure your quiz metadata and construct dynamic questions.
        </p>
      </div>

      <QuizBuilder />
    </main>
  );
}
