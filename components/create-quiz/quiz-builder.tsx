"use client";

import { useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { draftQuizSchema, DraftQuizSchema } from "@/lib/schemas/quiz";
import { createQuiz } from "@/app/actions/quiz";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import QRCode from "qrcode";
import confetti from "canvas-confetti";

import { QuizDetailsForm } from "./quiz-details-form";
import { QuestionsList } from "./questions-list";
import { QuizSuccessModal } from "./quiz-success-modal";

export function QuizBuilder() {
  const [isPending, startTransition] = useTransition();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdQuizData, setCreatedQuizData] = useState<{
    id: string;
    title: string;
    qrDataUrl: string;
  } | null>(null);

  const methods = useForm<DraftQuizSchema>({
    resolver: zodResolver(draftQuizSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "PRIVATE",
      questions: [
        {
          id: crypto.randomUUID(),
          type: "multiple_choice",
          content: "",
          correctAnswer: "",
          incorrectAnswers: ["", "", ""],
          imageFile: null,
          imageUrlPreview: null,
        },
      ],
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    startTransition(async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Unauthorized", {
          description: "You must be logged in to create a quiz.",
        });
        return;
      }

      const draftId = crypto.randomUUID();

      const processedQuestions = await Promise.all(
        data.questions.map(async (q, i) => {
          let imageUrl = null;
          if (q.imageFile) {
            const fileName = `${user.id}/${draftId}/q${i}-${Date.now()}.webp`;
            const { error: uploadError } = await supabase.storage
              .from("quiz-images")
              .upload(fileName, q.imageFile, { contentType: "image/webp" });

            if (!uploadError) {
              const { data: imgData } = supabase.storage
                .from("quiz-images")
                .getPublicUrl(fileName);
              imageUrl = imgData.publicUrl;
            } else {
              console.error("Failed to upload image:", uploadError);
              toast.error("Upload Warning", {
                description: `Failed to upload image for question ${i + 1}`,
              });
            }
          }

          return {
            content: q.content,
            correctAnswer: q.correctAnswer,
            incorrectAnswers: q.incorrectAnswers,
            imageUrl,
          };
        }),
      );

      const payload = {
        title: data.title,
        description: data.description || "",
        visibility: data.visibility,
        questions: processedQuestions,
      };

      const res = await createQuiz(payload);

      if (res?.error) {
        toast.error("Error Creating Quiz", { description: res.error });
      } else if (res?.success && res.quizId) {
        try {
          const siteUrl =
            typeof window !== "undefined" ? window.location.origin : "";
          const qrDataUrl = await QRCode.toDataURL(
            `${siteUrl}/quiz/${res.quizId}`,
            {
              width: 400,
              margin: 2,
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            },
          );

          setCreatedQuizData({
            id: res.quizId,
            title: data.title,
            qrDataUrl,
          });
          setShowSuccessModal(true);

          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#22c55e", "#3b82f6", "#f59e0b"],
          });
        } catch (err) {
          console.error("QR Generation failed", err);
          setCreatedQuizData({
            id: res.quizId,
            title: data.title,
            qrDataUrl: "",
          });
          setShowSuccessModal(true);
        }
      }
    });
  });

  const resetBuilder = () => {
    methods.getValues("questions").forEach((q) => {
      if (q.imageUrlPreview) {
        URL.revokeObjectURL(q.imageUrlPreview);
      }
    });

    methods.reset({
      title: "",
      description: "",
      visibility: "PRIVATE",
      questions: [
        {
          id: crypto.randomUUID(),
          type: "multiple_choice",
          content: "",
          correctAnswer: "",
          incorrectAnswers: ["", "", ""],
          imageFile: null,
          imageUrlPreview: null,
        },
      ],
    });
    setShowSuccessModal(false);
    setCreatedQuizData(null);
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-8 pb-32">
        <QuizDetailsForm isPending={isPending} />

        <QuestionsList isPending={isPending} onSubmit={onSubmit} />

        <QuizSuccessModal
          open={showSuccessModal}
          onOpenChange={(open) => !open && setShowSuccessModal(false)}
          quizData={createdQuizData}
          onReset={resetBuilder}
        />
      </form>
    </FormProvider>
  );
}
