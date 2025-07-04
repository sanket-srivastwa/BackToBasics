import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // Replit user ID as string
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Extended user profile fields
  fullName: text("full_name"),
  currentRole: text("current_role"),
  targetRole: text("target_role"),
  experienceLevel: text("experience_level"), // "junior", "mid", "senior", "principal"
  preferredTopics: text("preferred_topics").array(),
  profileCompleted: boolean("profile_completed").default(false),
  // Usage tracking for freemium model
  questionsViewed: integer("questions_viewed").default(0),
  lastViewedReset: timestamp("last_viewed_reset").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const practiceSession = pgTable("practice_sessions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id"),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  questionsCount: integer("questions_count").notNull(),
  completedCount: integer("completed_count").default(0),
  currentQuestionId: integer("current_question_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promptedQuestions = pgTable("prompted_questions", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  experienceLevel: text("experience_level").notNull(),
  questionPrompt: text("question_prompt").notNull(),
  context: text("context"),
  suggestedStructure: text("suggested_structure"),
  keyPoints: text("key_points").array(),
  difficultyLevel: text("difficulty_level").notNull(), // "easy", "medium", "hard"
  estimatedTime: integer("estimated_time").notNull(), // in minutes
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bio: text("bio"),
  skills: text("skills").array(),
  achievements: text("achievements").array(),
  goals: text("goals"),
  practiceHistory: jsonb("practice_history"),
  strengths: text("strengths").array(),
  improvementAreas: text("improvement_areas").array(),
  totalPracticeTime: integer("total_practice_time").default(0), // in minutes
  questionsCompleted: integer("questions_completed").default(0),
  averageScore: integer("average_score").default(0),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Replit Auth user upsert schema
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

// Extended user profile schema  
export const insertUserProfileExtendedSchema = createInsertSchema(users).pick({
  fullName: true,
  currentRole: true,
  targetRole: true,
  experienceLevel: true,
  preferredTopics: true,
});

export const insertPromptedQuestionSchema = createInsertSchema(promptedQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  lastActiveAt: true,
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

export const insertPracticeSessionSchema = createInsertSchema(practiceSession).omit({
  id: true,
  completedCount: true,
  currentQuestionId: true,
  createdAt: true,
});

// Type definitions
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type Answer = typeof answers.$inferSelect;
export type InsertPracticeSession = z.infer<typeof insertPracticeSessionSchema>;
export type PracticeSession = typeof practiceSession.$inferSelect;
export type InsertPromptedQuestion = z.infer<typeof insertPromptedQuestionSchema>;
export type PromptedQuestion = typeof promptedQuestions.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = typeof userProfiles.$inferSelect;
