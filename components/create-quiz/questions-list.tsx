"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { DraftQuizSchema } from "@/lib/schemas/quiz";
import { QuestionCard } from "./question-card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface QuestionsListProps {
  isPending: boolean;
  onSubmit: () => void;
}

export function QuestionsList({ isPending, onSubmit }: QuestionsListProps) {
  const { control } = useFormContext<DraftQuizSchema>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const addQuestion = (type: "multiple_choice" | "true_false") => {
    append({
      id: crypto.randomUUID(),
      type,
      content: "",
      correctAnswer: type === "true_false" ? "True" : "",
      incorrectAnswers: type === "true_false" ? ["False"] : ["", "", ""],
    });
  };

  const removeQuestion = (index: number) => {
    if (fields.length <= 1) {
      toast.error("Cannot remove", { description: "A quiz must have at least one question." });
      return;
    }
    remove(index);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Questions</h2>
          <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
            {fields.length} Total
          </div>
        </div>

        {fields.map((field, index) => (
          <QuestionCard
            key={field.id}
            index={index}
            removeQuestion={() => removeQuestion(index)}
            isPending={isPending}
          />
        ))}
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4 shadow-xl z-50">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => addQuestion("multiple_choice")} className="bg-background shadow-xs hover:bg-muted" disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" /> Multiple Choice
            </Button>
            <Button type="button" variant="outline" onClick={() => addQuestion("true_false")} className="bg-background shadow-xs hover:bg-muted hidden sm:flex" disabled={isPending}>
              <Plus className="mr-2 h-4 w-4" /> True / False
            </Button>
          </div>

          <Button type="button" size="lg" className="px-8 shadow-md" onClick={onSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
            Publish Quiz
          </Button>
        </div>
      </div>
    </>
  );
}
