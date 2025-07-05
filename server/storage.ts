import {
  users,
  questions,
  answers,
  practiceSession,
  promptedQuestions,
  userProfiles,
  type User,
  type UpsertUser,
  type Question,
  type InsertQuestion,
  type Answer,
  type InsertAnswer,
  type PracticeSession,
  type InsertPracticeSession,
  type PromptedQuestion,
  type InsertPromptedQuestion,
  type UserProfile,
  type InsertUserProfile,
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc, and, or, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Extended user operations
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  incrementUserQuestionsViewed(id: string): Promise<User>;
  resetUserQuestionsViewed(id: string): Promise<User>;

  // User Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile>;

  // Question operations
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByTopic(topic: string, category: string): Promise<Question[]>;
  getPopularQuestions(company?: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  searchQuestions(query: string): Promise<Question[]>;
  getFilteredQuestions(filters: {
    company?: string;
    difficulty?: string;
    role?: string;
    topic?: string;
    search?: string;
  }): Promise<Question[]>;

  // Prompted Question operations
  getPromptedQuestions(topic: string, experienceLevel: string): Promise<PromptedQuestion[]>;
  getPromptedQuestion(id: number): Promise<PromptedQuestion | undefined>;
  createPromptedQuestion(question: InsertPromptedQuestion): Promise<PromptedQuestion>;

  // Answer operations
  getAnswer(id: number): Promise<Answer | undefined>;
  getAnswersByQuestion(questionId: number): Promise<Answer[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  updateAnswerFeedback(id: number, feedback: any): Promise<Answer>;

  // Practice Session operations
  getPracticeSession(id: number): Promise<PracticeSession | undefined>;
  createPracticeSession(session: InsertPracticeSession): Promise<PracticeSession>;
  updatePracticeSession(id: number, updates: Partial<PracticeSession>): Promise<PracticeSession>;
  getUserPracticeSessions(userId: string): Promise<PracticeSession[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Extended user operations
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async incrementUserQuestionsViewed(id: string): Promise<User> {
    // Get current count and increment
    const currentUser = await this.getUser(id);
    const newCount = (currentUser?.questionsViewed || 0) + 1;
    
    const [user] = await db
      .update(users)
      .set({
        questionsViewed: newCount,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async resetUserQuestionsViewed(id: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        questionsViewed: 0,
        lastViewedReset: new Date(),
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // User Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, parseInt(userId)));
    return profile;
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values(insertProfile)
      .returning();
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const [profile] = await db
      .update(userProfiles)
      .set(updates)
      .where(eq(userProfiles.userId, parseInt(userId)))
      .returning();
    return profile;
  }

  // Question operations
  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question;
  }

  async getQuestionsByTopic(topic: string, category: string): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(and(eq(questions.topic, topic), eq(questions.category, category)))
      .orderBy(desc(questions.createdAt));
  }

  async getPopularQuestions(company?: string): Promise<Question[]> {
    const baseQuery = db.select().from(questions);
    
    if (company) {
      return await baseQuery
        .where(and(eq(questions.isPopular, true), eq(questions.company, company)))
        .orderBy(desc(questions.createdAt));
    }
    
    return await baseQuery
      .where(eq(questions.isPopular, true))
      .orderBy(desc(questions.createdAt));
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async searchQuestions(query: string): Promise<Question[]> {
    return await db
      .select()
      .from(questions)
      .where(like(questions.title, `%${query}%`))
      .orderBy(desc(questions.createdAt));
  }

  async getFilteredQuestions(filters: {
    company?: string;
    difficulty?: string;
    role?: string;
    topic?: string;
    search?: string;
  }): Promise<Question[]> {
    const conditions = [];

    if (filters.company && filters.company !== 'all') {
      conditions.push(sql`LOWER(${questions.company}) = LOWER(${filters.company})`);
    }
    
    if (filters.difficulty && filters.difficulty !== 'all') {
      conditions.push(eq(questions.difficulty, filters.difficulty));
    }
    
    if (filters.role && filters.role !== 'all') {
      // For role filtering, we'll use a simple approach for now
      conditions.push(sql`${questions.roles} @> ARRAY[${filters.role}]::text[]`);
    }
    
    if (filters.topic && filters.topic !== 'all') {
      conditions.push(eq(questions.topic, filters.topic));
    }
    
    if (filters.search) {
      conditions.push(
        or(
          like(questions.title, `%${filters.search}%`),
          like(questions.description, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      return await db.select().from(questions).where(and(...conditions)).orderBy(desc(questions.createdAt));
    }

    return await db.select().from(questions).orderBy(desc(questions.createdAt));
  }

  // Prompted Question operations
  async getPromptedQuestions(topic: string, experienceLevel: string): Promise<PromptedQuestion[]> {
    return await db
      .select()
      .from(promptedQuestions)
      .where(
        and(
          eq(promptedQuestions.topic, topic),
          eq(promptedQuestions.experienceLevel, experienceLevel),
          eq(promptedQuestions.isActive, true)
        )
      )
      .orderBy(desc(promptedQuestions.createdAt));
  }

  async getPromptedQuestion(id: number): Promise<PromptedQuestion | undefined> {
    const [question] = await db
      .select()
      .from(promptedQuestions)
      .where(eq(promptedQuestions.id, id));
    return question;
  }

  async createPromptedQuestion(insertQuestion: InsertPromptedQuestion): Promise<PromptedQuestion> {
    const [question] = await db
      .insert(promptedQuestions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  // Answer operations
  async getAnswer(id: number): Promise<Answer | undefined> {
    const [answer] = await db.select().from(answers).where(eq(answers.id, id));
    return answer;
  }

  async getAnswersByQuestion(questionId: number): Promise<Answer[]> {
    return await db
      .select()
      .from(answers)
      .where(eq(answers.questionId, questionId))
      .orderBy(desc(answers.createdAt));
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const [answer] = await db
      .insert(answers)
      .values(insertAnswer)
      .returning();
    return answer;
  }

  async updateAnswerFeedback(id: number, feedback: any): Promise<Answer> {
    const [answer] = await db
      .update(answers)
      .set(feedback)
      .where(eq(answers.id, id))
      .returning();
    return answer;
  }

  // Practice Session operations
  async getPracticeSession(id: number): Promise<PracticeSession | undefined> {
    const [session] = await db.select().from(practiceSession).where(eq(practiceSession.id, id));
    return session;
  }

  async createPracticeSession(insertSession: InsertPracticeSession): Promise<PracticeSession> {
    const [session] = await db
      .insert(practiceSession)
      .values(insertSession)
      .returning();
    return session;
  }

  async updatePracticeSession(id: number, updates: Partial<PracticeSession>): Promise<PracticeSession> {
    const [session] = await db
      .update(practiceSession)
      .set(updates)
      .where(eq(practiceSession.id, id))
      .returning();
    return session;
  }

  async getUserPracticeSessions(userId: string): Promise<PracticeSession[]> {
    return await db
      .select()
      .from(practiceSession)
      .where(eq(practiceSession.userId, userId))
      .orderBy(desc(practiceSession.createdAt));
  }
}

export const storage = new DatabaseStorage();