"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Link2,
  Share2,
  Image,
  Download,
  Copy,
  Check,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultsViewShareModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  percentage: number;
  resultId?: string;
  quizId?: string;
}

export const ResultsViewShareModal = ({
  isOpen,
  setIsOpen,
  percentage,
  resultId = "demo-result-123",
  quizId = "demo-quiz",
}: ResultsViewShareModalProps) => {
  const [view, setView] = useState<"options" | "preview">("options");
  const [copiedResults, setCopiedResults] = useState(false);
  const [copiedQuiz, setCopiedQuiz] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [ogBlob, setOgBlob] = useState<Blob | null>(null);
  const [ogObjectUrl, setOgObjectUrl] = useState<string | null>(null);

  const shareMessage = useMemo(() => {
    if (percentage >= 90) return "Show off your genius!";
    if (percentage >= 70) return "Share your brilliance!";
    if (percentage >= 50) return "Tell everyone how you did!";
    return "Challenge friends to beat you!";
  }, [percentage]);

  const ogImageUrl = `/api/og?id=${resultId}&score=${percentage}`;

  const ensureOgBlob = useCallback(async (): Promise<Blob> => {
    if (ogBlob) return ogBlob;
    const response = await fetch(ogImageUrl, { cache: "force-cache" });
    const blob = await response.blob();
    setOgBlob(blob);
    return blob;
  }, [ogBlob, ogImageUrl]);

  useEffect(() => {
    if (!isOpen || view !== "preview") return;

    let cancelled = false;
    (async () => {
      try {
        const blob = await ensureOgBlob();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        setOgObjectUrl(url);
        setIsImageLoaded(false);
      } catch (error) {
        console.error("OG image prefetch failed:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ensureOgBlob, isOpen, view]);

  useEffect(() => {
    return () => {
      if (ogObjectUrl) URL.revokeObjectURL(ogObjectUrl);
    };
  }, [ogObjectUrl]);

  const handleCopyResultsLink = async () => {
    const resultsUrl = `${window.location.origin}/results/${resultId}`;
    await navigator.clipboard.writeText(resultsUrl);
    setCopiedResults(true);
    setTimeout(() => setCopiedResults(false), 2000);
  };

  const handleCopyQuizLink = async () => {
    const quizUrl = `${window.location.origin}/quiz/${quizId}`;
    await navigator.clipboard.writeText(quizUrl);
    setCopiedQuiz(true);
    setTimeout(() => setCopiedQuiz(false), 2000);
  };

  const handleDownloadBanner = async () => {
    setDownloading(true);
    try {
      const blob = await ensureOgBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quizmaster-score-${percentage}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyImage = async () => {
    setCopying(true);
    try {
      const blob = await ensureOgBlob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (error) {
      console.error("Copy image failed:", error);
    } finally {
      setCopying(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setView("options");
      setIsImageLoaded(false);
      setOgBlob(null);
      if (ogObjectUrl) URL.revokeObjectURL(ogObjectUrl);
      setOgObjectUrl(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-xl rounded-2xl gap-0 p-0 overflow-hidden bg-card shadow-2xl border-border/50">
        {view === "options" ? (
          <div className="p-6 md:p-8 flex flex-col">
            <DialogHeader className="flex flex-col items-center text-center space-y-2 mb-6">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {shareMessage}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-base">
                You scored <strong>{percentage}%</strong> on this quiz. Let
                everyone know!
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => setView("preview")}
                className="group relative w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 hover:border-primary/40 hover:from-primary/15 transition-all duration-200"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Image className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-foreground">
                    Shareable Card
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Download or copy your score banner
                  </span>
                </div>
                <div className="ml-auto text-muted-foreground group-hover:text-foreground transition-colors">
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </div>
              </button>

              <button
                onClick={handleCopyResultsLink}
                className="group relative w-full flex items-center gap-4 p-4 rounded-xl bg-background border border-border/60 hover:border-border hover:bg-accent/50 transition-all duration-200"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  {copiedResults ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Link2 className="h-5 w-5" />
                  )}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-foreground">
                    {copiedResults ? "Copied!" : "Copy link to results"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Share your exact score with others
                  </span>
                </div>
              </button>

              <button
                onClick={handleCopyQuizLink}
                className="group relative w-full flex items-center gap-4 p-4 rounded-xl bg-background border border-border/60 hover:border-border hover:bg-accent/50 transition-all duration-200"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                  {copiedQuiz ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Share2 className="h-5 w-5" />
                  )}
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-semibold text-foreground">
                    {copiedQuiz ? "Copied!" : "Copy link to quiz"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Challenge friends to take this quiz
                  </span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-3 p-4 border-b border-border/50">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => setView("options")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h3 className="font-semibold text-foreground">
                  Shareable Card
                </h3>
                <p className="text-xs text-muted-foreground">
                  Preview and download your score
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/30">
              <div
                className="relative rounded-lg overflow-hidden border border-border/50 shadow-lg aspect-[1200/630] bg-muted/20"
                style={{ paddingBottom: !isImageLoaded ? "52.5%" : "" }}
              >
                {!isImageLoaded && (
                  <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
                )}
                <img
                  src={ogObjectUrl ?? ogImageUrl}
                  alt={`Score: ${percentage}%`}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 flex gap-3">
              <Button
                variant="default"
                className="flex-1 h-11 gap-2"
                onClick={handleDownloadBanner}
                disabled={downloading || !isImageLoaded}
              >
                {downloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-11 gap-2"
                onClick={handleCopyImage}
                disabled={copying || !isImageLoaded}
              >
                {copying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Copying...
                  </>
                ) : copiedImage ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Image
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
