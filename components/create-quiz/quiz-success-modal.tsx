"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";
import { QuizShareButtons } from "@/components/profile/quiz-share-buttons";
import Link from "next/link";

interface QuizSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizData: {
    id: string;
    title: string;
    qrDataUrl: string;
  } | null;
  onReset: () => void;
}

export function QuizSuccessModal({ open, onOpenChange, quizData, onReset }: QuizSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto my-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Quiz Published!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Your quiz <strong>"{quizData?.title}"</strong> is now live and ready to be shared.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="rounded-xl bg-muted/50 p-4 border border-border/50">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
              Sharing Options
            </Label>
            {quizData && (
              <QuizShareButtons
                quizId={quizData.id}
                quizTitle={quizData.title}
                qrDataUrl={quizData.qrDataUrl}
              />
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={onReset}>
            Create Another
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/quiz/${quizData?.id}`}>
              View Quiz
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
