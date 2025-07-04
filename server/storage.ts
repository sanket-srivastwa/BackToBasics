import { 
  users, questions, answers, sessions, promptedQuestions, userProfiles,
  type User, type InsertUser,
  type Question, type InsertQuestion,
  type Answer, type InsertAnswer,
  type Session, type InsertSession,
  type PromptedQuestion, type InsertPromptedQuestion,
  type UserProfile, type InsertUserProfile
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // User Profile methods
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, updates: Partial<UserProfile>): Promise<UserProfile>;

  // Question methods
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByTopic(topic: string, category: string): Promise<Question[]>;
  getPopularQuestions(company?: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  searchQuestions(query: string): Promise<Question[]>;

  // Prompted Question methods
  getPromptedQuestions(topic: string, experienceLevel: string): Promise<PromptedQuestion[]>;
  getPromptedQuestion(id: number): Promise<PromptedQuestion | undefined>;
  createPromptedQuestion(question: InsertPromptedQuestion): Promise<PromptedQuestion>;

  // Answer methods
  getAnswer(id: number): Promise<Answer | undefined>;
  getAnswersByQuestion(questionId: number): Promise<Answer[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  updateAnswerFeedback(id: number, feedback: any): Promise<Answer>;

  // Session methods
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, updates: Partial<Session>): Promise<Session>;
  getUserSessions(userId: number): Promise<Session[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        profileCompleted: false,
        createdAt: new Date()
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile || undefined;
  }

  async createUserProfile(insertProfile: InsertUserProfile): Promise<UserProfile> {
    const [profile] = await db
      .insert(userProfiles)
      .values({
        ...insertProfile,
        createdAt: new Date(),
        lastActiveAt: new Date()
      })
      .returning();
    return profile;
  }

  async updateUserProfile(userId: number, updates: Partial<UserProfile>): Promise<UserProfile> {
    const [profile] = await db
      .update(userProfiles)
      .set({ ...updates, lastActiveAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return profile;
  }

  async getQuestion(id: number): Promise<Question | undefined> {
    const [question] = await db.select().from(questions).where(eq(questions.id, id));
    return question || undefined;
  }

  async getQuestionsByTopic(topic: string, category: string): Promise<Question[]> {
    return await db.select().from(questions)
      .where(and(eq(questions.topic, topic), eq(questions.category, category)));
  }

  async getPopularQuestions(company?: string): Promise<Question[]> {
    if (company) {
      return await db.select().from(questions)
        .where(and(eq(questions.isPopular, true), eq(questions.company, company)));
    }
    return await db.select().from(questions).where(eq(questions.isPopular, true));
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values({
        ...insertQuestion,
        company: insertQuestion.company || null,
        tips: insertQuestion.tips || null,
        isPopular: insertQuestion.isPopular || null,
        createdAt: new Date()
      })
      .returning();
    return question;
  }

  async searchQuestions(query: string): Promise<Question[]> {
    // Note: This is a simple text search, in production you'd use full-text search
    return await db.select().from(questions);
  }

  async getPromptedQuestions(topic: string, experienceLevel: string): Promise<PromptedQuestion[]> {
    return await db.select().from(promptedQuestions)
      .where(and(
        eq(promptedQuestions.topic, topic),
        eq(promptedQuestions.experienceLevel, experienceLevel),
        eq(promptedQuestions.isActive, true)
      ));
  }

  async getPromptedQuestion(id: number): Promise<PromptedQuestion | undefined> {
    const [question] = await db.select().from(promptedQuestions).where(eq(promptedQuestions.id, id));
    return question || undefined;
  }

  async createPromptedQuestion(insertQuestion: InsertPromptedQuestion): Promise<PromptedQuestion> {
    const [question] = await db
      .insert(promptedQuestions)
      .values({
        ...insertQuestion,
        createdAt: new Date()
      })
      .returning();
    return question;
  }

  async getAnswer(id: number): Promise<Answer | undefined> {
    const [answer] = await db.select().from(answers).where(eq(answers.id, id));
    return answer || undefined;
  }

  async getAnswersByQuestion(questionId: number): Promise<Answer[]> {
    return await db.select().from(answers).where(eq(answers.questionId, questionId));
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const [answer] = await db
      .insert(answers)
      .values({
        ...insertAnswer,
        createdAt: new Date()
      })
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

  async getSession(id: number): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id));
    return session || undefined;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const [session] = await db
      .insert(sessions)
      .values({
        ...insertSession,
        userId: insertSession.userId || null,
        createdAt: new Date()
      })
      .returning();
    return session;
  }

  async updateSession(id: number, updates: Partial<Session>): Promise<Session> {
    const [session] = await db
      .update(sessions)
      .set(updates)
      .where(eq(sessions.id, id))
      .returning();
    return session;
  }

  async getUserSessions(userId: number): Promise<Session[]> {
    return await db.select().from(sessions).where(eq(sessions.userId, userId));
  }

  // Seed sample data for prompted questions
  async seedPromptedQuestions(): Promise<void> {
    const samplePromptedQuestions: InsertPromptedQuestion[] = [
      // TPM Questions
      {
        topic: "Technical Program Management",
        experienceLevel: "junior",
        questionPrompt: "Describe how you would coordinate a simple feature rollout across frontend and backend teams with a 2-week timeline.",
        context: "Tests basic coordination and communication skills for entry-level TPM roles.",
        suggestedStructure: "Use STAR method focusing on planning, coordination, and execution",
        keyPoints: ["Team coordination", "Timeline management", "Communication", "Risk planning"],
        difficultyLevel: "easy",
        estimatedTime: 8
      },
      {
        topic: "Technical Program Management",
        experienceLevel: "mid",
        questionPrompt: "You're leading a database migration project that affects 8 microservices. How do you minimize downtime and ensure data integrity?",
        context: "Tests mid-level technical planning and risk management skills.",
        suggestedStructure: "Focus on risk assessment, phased approach, and contingency planning",
        keyPoints: ["Risk management", "Data integrity", "Phased migration", "Rollback plans", "Service coordination"],
        difficultyLevel: "medium",
        estimatedTime: 12
      },
      {
        topic: "Technical Program Management",
        experienceLevel: "senior",
        questionPrompt: "You're leading a complex API migration that affects 15 different services across 4 teams. The migration has a hard deadline due to vendor contract expiration in 3 months. Describe how you would plan and execute this migration while minimizing risk and ensuring quality.",
        context: "This scenario tests cross-functional leadership, risk management, and technical planning skills essential for senior TPM roles.",
        suggestedStructure: "Use STAR method: Situation (API dependency and timeline), Task (migration execution), Action (planning steps and risk mitigation), Result (successful migration metrics)",
        keyPoints: ["Cross-team coordination", "Risk assessment", "Timeline management", "Quality assurance", "Stakeholder communication"],
        difficultyLevel: "hard",
        estimatedTime: 15
      },
      
      // PM Questions
      {
        topic: "Product Management",
        experienceLevel: "junior",
        questionPrompt: "How would you gather user feedback for a new feature you're considering adding to your mobile app?",
        context: "Tests basic user research and feedback collection skills for entry-level PM roles.",
        suggestedStructure: "Cover research methods, user segments, and feedback analysis approaches",
        keyPoints: ["User research", "Feedback methods", "Data collection", "Analysis planning"],
        difficultyLevel: "easy",
        estimatedTime: 8
      },
      {
        topic: "Product Management",
        experienceLevel: "mid",
        questionPrompt: "Your analytics show that 40% of users abandon the onboarding flow at step 3 out of 5. User research indicates confusion about feature value. You have limited engineering resources for the next quarter. How do you prioritize and approach fixing this issue?",
        context: "This tests product sense, data analysis skills, and resource prioritization - key for mid-level PM roles.",
        suggestedStructure: "Structure around: Problem analysis, hypothesis formation, solution prioritization, implementation plan, and success metrics",
        keyPoints: ["Data interpretation", "User research synthesis", "Feature prioritization", "Resource planning", "Metrics definition"],
        difficultyLevel: "medium",
        estimatedTime: 10
      },
      {
        topic: "Product Management", 
        experienceLevel: "senior",
        questionPrompt: "You're launching a new product line that could cannibalize 20% of your existing revenue but opens a $500M market opportunity. Walk through your strategic approach.",
        context: "Tests strategic thinking, business analysis, and senior-level decision making.",
        suggestedStructure: "Focus on market analysis, risk assessment, strategic planning, and stakeholder alignment",
        keyPoints: ["Strategic planning", "Market analysis", "Risk assessment", "Revenue impact", "Stakeholder management"],
        difficultyLevel: "hard",
        estimatedTime: 15
      },

      // Engineering Management Questions
      {
        topic: "Engineering Management",
        experienceLevel: "junior", 
        questionPrompt: "One of your team members is consistently missing deadlines. How do you address this performance issue?",
        context: "Tests basic people management and performance issue handling.",
        suggestedStructure: "Focus on investigation, communication, and support planning",
        keyPoints: ["Performance management", "Communication", "Support planning", "Documentation"],
        difficultyLevel: "easy",
        estimatedTime: 6
      },
      {
        topic: "Engineering Management",
        experienceLevel: "mid",
        questionPrompt: "Your team is experiencing high technical debt and velocity is decreasing. How do you balance feature delivery with technical improvements?",
        context: "Tests technical decision making and team productivity management.",
        suggestedStructure: "Cover assessment, prioritization framework, and stakeholder communication",
        keyPoints: ["Technical debt assessment", "Velocity optimization", "Stakeholder communication", "Balance planning"],
        difficultyLevel: "medium", 
        estimatedTime: 10
      },
      {
        topic: "Engineering Management",
        experienceLevel: "senior",
        questionPrompt: "You need to scale your engineering organization from 20 to 50 engineers in 6 months while maintaining code quality and team culture. How do you approach this?",
        context: "Tests organizational scaling, culture management, and strategic planning.",
        suggestedStructure: "Focus on hiring strategy, organizational design, culture preservation, and process scaling",
        keyPoints: ["Hiring strategy", "Organizational design", "Culture scaling", "Process optimization", "Leadership development"],
        difficultyLevel: "hard",
        estimatedTime: 15
      },

      // Project Management Questions
      {
        topic: "Project Management",
        experienceLevel: "junior",
        questionPrompt: "You're managing a project with a tight deadline when a key developer gets sick for 2 weeks. The client expects the delivery on time. Walk me through how you would handle this situation.",
        context: "Tests basic project management skills including risk management, communication, and problem-solving under pressure.",
        suggestedStructure: "Focus on immediate assessment, stakeholder communication, resource reallocation, and contingency planning",
        keyPoints: ["Risk assessment", "Team communication", "Resource management", "Client communication", "Timeline adjustment"],
        difficultyLevel: "easy",
        estimatedTime: 8
      },
      {
        topic: "Project Management",
        experienceLevel: "mid",
        questionPrompt: "You're managing a cross-functional project involving marketing, engineering, and design teams. Each team has different priorities and timelines. How do you align everyone?",
        context: "Tests stakeholder management and cross-functional coordination skills.",
        suggestedStructure: "Cover stakeholder analysis, alignment strategies, and coordination frameworks",
        keyPoints: ["Stakeholder management", "Cross-functional coordination", "Priority alignment", "Communication planning"],
        difficultyLevel: "medium",
        estimatedTime: 10
      }
    ];

    for (const question of samplePromptedQuestions) {
      await this.createPromptedQuestion(question);
    }
  }
}

export const storage = new DatabaseStorage();