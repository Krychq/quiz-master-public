"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, ImageIcon, CheckCircle2, X } from "lucide-react";
import { compressImageWebP } from "@/lib/compress-image";
import { toast } from "sonner";
import { DraftQuizSchema } from "@/lib/schemas/quiz";

interface QuestionCardProps {
  index: number;
  removeQuestion: () => void;
  isPending: boolean;
}

export function QuestionCard({ index, removeQuestion, isPending }: QuestionCardProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<DraftQuizSchema>();
  
  const questionType = watch(`questions.${index}.type`);
  const imageUrlPreview = watch(`questions.${index}.imageUrlPreview`);
  const questionErrors = errors.questions?.[index];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);
      setValue(`questions.${index}.imageUrlPreview`, previewUrl);

      const finalFile = await compressImageWebP(file);
      setValue(`questions.${index}.imageFile`, finalFile);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Compression Failed", { description: "Could not process that image format." });
    }
  };

  const removeImage = () => {
    if (imageUrlPreview) URL.revokeObjectURL(imageUrlPreview);
    setValue(`questions.${index}.imageUrlPreview`, null);
    setValue(`questions.${index}.imageFile`, null);
  };

  return (
    <Card className="border-border shadow-sm group relative overflow-visible transition-all duration-300 hover:shadow-md">
      <div className="absolute -left-3 -top-3 h-8 w-8 bg-primary text-primary-foreground font-bold rounded-full flex items-center justify-center shadow-sm text-sm border-2 border-background z-10">
        {index + 1}
      </div>

      <CardHeader className="pb-4 pt-6 pl-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-1">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Question Text</Label>
            <Textarea
              placeholder="Enter your question..."
              className="text-base resize-none"
              rows={2}
              disabled={isPending}
              {...register(`questions.${index}.content` as const)}
            />
            {questionErrors?.content && (
              <p className="text-sm text-destructive mt-1">{questionErrors.content.message}</p>
            )}
          </div>
          
          <div className="flex flex-col gap-2 pt-5">
            <Button type="button" variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={removeQuestion} disabled={isPending}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pl-8">
        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          {imageUrlPreview ? (
            <div className="relative h-24 w-32 rounded-md overflow-hidden bg-black/5 shrink-0 border border-border shadow-xs">
              <img src={imageUrlPreview} alt="Question attachment" className="object-cover w-full h-full" />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
                onClick={removeImage}
                disabled={isPending}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="h-24 w-32 rounded-md border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center hover:bg-muted/50 hover:border-muted-foreground/50 transition-colors cursor-pointer relative shrink-0">
              <input 
                type="file" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleImageUpload}
                disabled={isPending}
              />
              <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Add Image</span>
            </div>
          )}
          <div className="text-sm text-muted-foreground pt-1 flex-1">
            Attach a visual aid or hint for this specific question. The image will securely compress and bundle with your quiz automatically.
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 pl-2 border-l-2 border-primary/20">
          {/* Correct Answer */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5 text-green-600 font-bold">
              <CheckCircle2 className="h-4 w-4" /> Correct Answer
            </Label>
            <Input
              placeholder={questionType === "true_false" ? "True" : "Exact correct answer"}
              className="border-green-600/30 focus-visible:ring-green-600 shadow-sm disabled:opacity-50 font-medium"
              disabled={isPending}
              {...register(`questions.${index}.correctAnswer` as const)}
            />
            {questionErrors?.correctAnswer && (
              <p className="text-sm text-destructive">{questionErrors.correctAnswer.message}</p>
            )}
          </div>

          {/* Incorrect Answers */}
          <div className="space-y-3">
            <Label className="flex items-center gap-1.5 text-destructive font-bold text-sm">
              <X className="h-4 w-4" /> Incorrect Answer{questionType === "multiple_choice" ? "s" : ""}
            </Label>
            {questionType === "multiple_choice" ? (
              <div className="space-y-2">
                {[0, 1, 2].map((idx) => (
                  <div key={idx}>
                    <Input
                      placeholder={`Deceptive option ${idx + 1}`}
                      className="border-destructive/20 focus-visible:ring-destructive shadow-sm disabled:opacity-50"
                      disabled={isPending}
                      {...register(`questions.${index}.incorrectAnswers.${idx}` as const)}
                    />
                    {questionErrors?.incorrectAnswers?.[idx] && (
                      <p className="text-sm text-destructive mt-1">{questionErrors.incorrectAnswers[idx]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <Input
                  placeholder="False"
                  className="border-destructive/30 focus-visible:ring-destructive shadow-sm disabled:opacity-50 font-medium"
                  disabled={isPending}
                  {...register(`questions.${index}.incorrectAnswers.0` as const)}
                />
                {questionErrors?.incorrectAnswers?.[0] && (
                  <p className="text-sm text-destructive mt-1">{questionErrors.incorrectAnswers[0]?.message}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
