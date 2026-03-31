/**
 * Shared return type for all server actions used with useActionState.
 * null = initial / idle state.
 */
export type ActionState<T = any> = {
  error?: string;
  success?: boolean;
  data?: T;
} | null;

export interface Question {
  id: string;
  content: string;
  answers: string[];
  imageUrl: string | null;
}

export interface QuizEngineProps {
  quizId: string;
  questions: Question[];
}

export interface QuestionViewProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  timeLeft: number;
  maxTime: number;
  onAnswer: (answer: string) => void;
}

export interface UserAnswer {
  questionId: string;
  answer: string | null;
}
