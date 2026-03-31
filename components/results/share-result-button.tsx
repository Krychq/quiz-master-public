"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { ResultsViewShareModal } from "./share-modal";

interface ShareResultButtonProps {
  percentage: number;
  resultId: string;
  quizId: string | null;
  className?: string;
}

export function ShareResultButton({ percentage, resultId, quizId, className }: ShareResultButtonProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsShareOpen(true)} className={`gap-2 shrink-0 ${className || ""}`}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <ResultsViewShareModal
        isOpen={isShareOpen}
        setIsOpen={setIsShareOpen}
        percentage={percentage}
        resultId={resultId}
        quizId={quizId || ""}
      />
    </>
  );
}
