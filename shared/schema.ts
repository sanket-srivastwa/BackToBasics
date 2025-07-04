import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // "mock-interview" or "case-study"
  topic: text("topic").notNull(), // "tpm", "pm", "project-management", or custom
  company: text("company"), // "meta", "amazon", "apple", "netflix", "google"
  difficulty: text("difficulty").notNull(), // "easy", "medium", "hard"
  timeLimit: integer("time_limit").notNull(), // in minutes
  tips: text("tips").array(),
  optimalAnswer: text("optimal_answer").notNull(),
  isPopular: boolean("is_popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull(),
  userAnswer: text("user_answer").notNull(),
  score: integer("score"), // 1-10
  feedback: jsonb("feedback"), // structured feedback object
  strengths: text("strengths").array(),
  improvements: text("improvements").array(),
  suggestions: text("suggestions").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  questionsCount: integer("questions_count").notNull(),
  completedCount: integer("completed_count").default(0),
  currentQuestionId: integer("current_question_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuestionSchema = createInsertSchema(questions).omit({
  id: true,
  createdAt: true,
});

export const insertAnswerSchema = createInsertSchema(answers).omit({
  id: true,
  score: true,
  feedback: true,
  strengths: true,
  improvements: true,
  suggestions: true,
  createdAt: true,
});

export const insertSessionSchema = createInsertSchema(sessions).omit({
  id: true,
  completedCount: true,
  currentQuestionId: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type Answer = typeof answers.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = typeof sessions.$inferSelect;
