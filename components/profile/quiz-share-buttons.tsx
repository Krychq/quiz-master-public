"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link2, QrCode, Check } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface QuizShareButtonsProps {
  quizId: string;
  quizTitle: string;
  qrDataUrl: string;
}

export function QuizShareButtons({ quizId, quizTitle, qrDataUrl }: QuizShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const quizUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/quiz/${quizId}`
      : `/quiz/${quizId}`;

  const handleCopy = async () => {
    const url = `${window.location.origin}/quiz/${quizId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied!", { description: url });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto gap-2"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Link2 className="h-4 w-4" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto gap-2"
          onClick={() => setQrOpen(true)}
        >
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-sm font-medium line-clamp-1">
              {quizTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-2">
            <div className="rounded-xl border bg-white p-3 shadow-sm">
              <Image
                src={qrDataUrl}
                alt={`QR code for ${quizTitle}`}
                width={200}
                height={200}
                className="block"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center break-all px-2">
              {quizUrl}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
