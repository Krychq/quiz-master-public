import { z } from "zod";

export const questionSchema = z.object({
  content: z.string().min(1, "Question text is required."),
  correctAnswer: z.string().min(1, "Correct answer is required."),
  incorrectAnswers: z
    .array(z.string().min(1, "Incorrect answers cannot be blank."))
    .min(1, "At least one incorrect answer is required."),
  imageUrl: z.string().url().nullable().optional(),
});

export const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required."),
  description: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "WITH_LINK"]),
  questions: z
    .array(questionSchema)
    .min(1, "A quiz must have at least one question."),
});

export const draftQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(["multiple_choice", "true_false"]),
  content: z.string().min(1, "Question text is required."),
  correctAnswer: z.string().min(1, "Correct answer is required."),
  incorrectAnswers: z
    .array(z.string().min(1, "Incorrect answers cannot be blank."))
    .min(1, "At least one incorrect answer is required."),
  imageFile: z.any().nullable().optional(),
  imageUrlPreview: z.string().nullable().optional(),
});

export const draftQuizSchema = z.object({
  title: z.string().min(1, "Quiz title is required."),
  description: z.string().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "WITH_LINK"]),
  questions: z
    .array(draftQuestionSchema)
    .min(1, "A quiz must have at least 1 questions."),
});

export type DraftQuestionSchema = z.infer<typeof draftQuestionSchema>;
export type DraftQuizSchema = z.infer<typeof draftQuizSchema>;

export type QuestionSchema = z.infer<typeof questionSchema>;
export type QuizSchema = z.infer<typeof quizSchema>;
