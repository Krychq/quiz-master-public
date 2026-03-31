"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DraftQuizSchema } from "@/lib/schemas/quiz";

interface QuizDetailsFormProps {
  isPending: boolean;
}

export function QuizDetailsForm({ isPending }: QuizDetailsFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<DraftQuizSchema>();

  const visibility = watch("visibility");

  return (
    <Card className="border-border shadow-md">
      <CardHeader className="bg-muted/30 border-b border-border">
        <CardTitle>Quiz Details</CardTitle>
        <CardDescription>
          The main information players will see before starting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label htmlFor="quiz-title" className="text-foreground font-semibold">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quiz-title"
            placeholder="e.g. Advanced JavaScript Concepts"
            className="text-lg disabled:opacity-50"
            disabled={isPending}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quiz-desc" className="text-foreground font-semibold">
            Description (Optional)
          </Label>
          <Textarea
            id="quiz-desc"
            placeholder="Briefly describe what this quiz is about..."
            className="resize-none disabled:opacity-50"
            rows={3}
            disabled={isPending}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2 max-w-sm">
          <Label className="text-foreground font-semibold">Visibility</Label>
          <Select
            value={visibility}
            onValueChange={(val: "PUBLIC" | "PRIVATE" | "WITH_LINK") =>
              setValue("visibility", val)
            }
            disabled={isPending}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="WITH_LINK">Unlisted (With Link)</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
            </SelectContent>
          </Select>
          {errors.visibility && (
            <p className="text-sm text-destructive">
              {errors.visibility.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
