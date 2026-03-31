import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

export const visibilityEnum = pgEnum("visibility", [
  "PUBLIC",
  "PRIVATE",
  "WITH_LINK",
]);

export const quiz = pgTable("quiz", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  userId: uuid("user_id"),
  visibility: visibilityEnum("visibility").default("PRIVATE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const question = pgTable("question", {
  id: uuid("id").defaultRandom().primaryKey(),
  quizId: uuid("quiz_id")
    .references(() => quiz.id, { onDelete: "cascade" })
    .notNull(),
  content: text("content").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  incorrectAnswers: text("incorrect_answers").array().notNull(),
  imageUrl: text("image_url"),
});

export const result = pgTable("result", {
  id: uuid("id").defaultRandom().primaryKey(),
  quizId: uuid("quiz_id")
    .references(() => quiz.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id"),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  timeSpent: integer("time_spent").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userAnswer = pgTable("user_answer", {
  id: uuid("id").defaultRandom().primaryKey(),
  resultId: uuid("result_id")
    .references(() => result.id, { onDelete: "cascade" })
    .notNull(),
  questionId: uuid("question_id")
    .references(() => question.id)
    .notNull(),
  selectedAnswer: text("selected_answer"),
  isCorrect: boolean("is_correct").notNull(),
});
