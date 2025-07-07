import {
  users,
  questions,
  answers,
  practiceSession,
  promptedQuestions,
  userProfiles,
  communityAnswers,
  answerVotes,
  answerLikes,
  answerComments,
  commentLikes,
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
  type CommunityAnswer,
  type InsertCommunityAnswer,
  type AnswerVote,
  type InsertAnswerVote,
  type AnswerLike,
  type InsertAnswerLike,
  type AnswerComment,
  type InsertAnswerComment,
  type CommentLike,
  type InsertCommentLike,
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

  // Community Answer operations
  getCommunityAnswers(questionId: number, sortBy?: string): Promise<(CommunityAnswer & { author: { firstName: string; lastName: string; profileImageUrl: string | null } })[]>;
  getCommunityAnswer(id: number): Promise<CommunityAnswer | undefined>;
  createCommunityAnswer(answer: InsertCommunityAnswer): Promise<CommunityAnswer>;
  updateCommunityAnswer(id: number, updates: Partial<CommunityAnswer>): Promise<CommunityAnswer>;
  deleteCommunityAnswer(id: number, userId: string): Promise<boolean>;

  // Vote operations
  voteOnAnswer(vote: InsertAnswerVote): Promise<AnswerVote>;
  removeVoteFromAnswer(answerId: number, userId: string): Promise<boolean>;
  getUserVoteOnAnswer(answerId: number, userId: string): Promise<AnswerVote | undefined>;

  // Like operations
  likeAnswer(like: InsertAnswerLike): Promise<AnswerLike>;
  unlikeAnswer(answerId: number, userId: string): Promise<boolean>;
  getUserLikeOnAnswer(answerId: number, userId: string): Promise<AnswerLike | undefined>;

  // Comment operations
  getAnswerComments(answerId: number): Promise<(AnswerComment & { author: { firstName: string; lastName: string; profileImageUrl: string | null } })[]>;
  createAnswerComment(comment: InsertAnswerComment): Promise<AnswerComment>;
  updateAnswerComment(id: number, updates: Partial<AnswerComment>): Promise<AnswerComment>;
  deleteAnswerComment(id: number, userId: string): Promise<boolean>;

  // Comment like operations
  likeComment(like: InsertCommentLike): Promise<CommentLike>;
  unlikeComment(commentId: number, userId: string): Promise<boolean>;
  getUserLikeOnComment(commentId: number, userId: string): Promise<CommentLike | undefined>;
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
    
    let results;
    if (company) {
      results = await baseQuery
        .where(and(eq(questions.isPopular, true), eq(questions.company, company)))
        .orderBy(desc(questions.createdAt));
    } else {
      results = await baseQuery
        .where(eq(questions.isPopular, true))
        .orderBy(desc(questions.createdAt));
    }
    
    // Deduplicate based on ID to prevent duplicate results
    const uniqueResults = results.filter((question, index, self) => 
      index === self.findIndex((q) => q.id === question.id)
    );
    
    return uniqueResults;
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const [question] = await db
      .insert(questions)
      .values(insertQuestion)
      .returning();
    return question;
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    const results = await db
      .select()
      .from(questions)
      .where(
        or(
          sql`LOWER(${questions.title}) LIKE ${searchPattern}`,
          sql`LOWER(${questions.description}) LIKE ${searchPattern}`,
          sql`LOWER(${questions.company}) LIKE ${searchPattern}`,
          sql`LOWER(${questions.topic}) LIKE ${searchPattern}`
        )
      )
      .orderBy(desc(questions.createdAt));
    
    // Deduplicate based on ID to prevent duplicate results
    const uniqueResults = results.filter((question, index, self) => 
      index === self.findIndex((q) => q.id === question.id)
    );
    
    return uniqueResults;
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
      conditions.push(eq(questions.company, filters.company.toLowerCase()));
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
      const searchPattern = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          sql`LOWER(${questions.title}) LIKE ${searchPattern}`,
          sql`LOWER(${questions.description}) LIKE ${searchPattern}`,
          sql`LOWER(${questions.company}) LIKE ${searchPattern}`,
          sql`LOWER(${questions.topic}) LIKE ${searchPattern}`
        )
      );
    }

    if (conditions.length > 0) {
      const results = await db.select().from(questions)
        .where(and(...conditions))
        .orderBy(desc(questions.createdAt));
      
      // Deduplicate based on ID to prevent duplicate results
      const uniqueResults = results.filter((question, index, self) => 
        index === self.findIndex((q) => q.id === question.id)
      );
      
      return uniqueResults;
    }

    // Return all questions if no filters
    const results = await db.select().from(questions)
      .orderBy(desc(questions.createdAt));
    
    // Deduplicate based on ID 
    const uniqueResults = results.filter((question, index, self) => 
      index === self.findIndex((q) => q.id === question.id)
    );
    
    return uniqueResults;
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

  // Community Answer operations
  async getCommunityAnswers(questionId: number, sortBy: string = "recent"): Promise<(CommunityAnswer & { author: { firstName: string; lastName: string; profileImageUrl: string | null } })[]> {
    let orderBy;
    
    switch (sortBy) {
      case "most_liked":
        orderBy = desc(communityAnswers.likesCount);
        break;
      case "most_voted":
        orderBy = desc(communityAnswers.votesCount);
        break;
      case "most_relevant":
        orderBy = desc(communityAnswers.relevanceScore);
        break;
      case "most_commented":
        orderBy = desc(communityAnswers.commentsCount);
        break;
      default:
        orderBy = desc(communityAnswers.createdAt);
    }

    const results = await db
      .select({
        id: communityAnswers.id,
        questionId: communityAnswers.questionId,
        userId: communityAnswers.userId,
        title: communityAnswers.title,
        content: communityAnswers.content,
        isAnonymous: communityAnswers.isAnonymous,
        experienceLevel: communityAnswers.experienceLevel,
        currentRole: communityAnswers.currentRole,
        company: communityAnswers.company,
        likesCount: communityAnswers.likesCount,
        votesCount: communityAnswers.votesCount,
        commentsCount: communityAnswers.commentsCount,
        relevanceScore: communityAnswers.relevanceScore,
        isHelpful: communityAnswers.isHelpful,
        isFeatured: communityAnswers.isFeatured,
        tags: communityAnswers.tags,
        createdAt: communityAnswers.createdAt,
        updatedAt: communityAnswers.updatedAt,
        author: {
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(communityAnswers)
      .leftJoin(users, eq(communityAnswers.userId, users.id))
      .where(eq(communityAnswers.questionId, questionId))
      .orderBy(orderBy);

    return results;
  }

  async getCommunityAnswer(id: number): Promise<CommunityAnswer | undefined> {
    const [answer] = await db
      .select()
      .from(communityAnswers)
      .where(eq(communityAnswers.id, id));
    return answer;
  }

  async createCommunityAnswer(insertAnswer: InsertCommunityAnswer): Promise<CommunityAnswer> {
    const [answer] = await db
      .insert(communityAnswers)
      .values(insertAnswer)
      .returning();
    return answer;
  }

  async updateCommunityAnswer(id: number, updates: Partial<CommunityAnswer>): Promise<CommunityAnswer> {
    const [answer] = await db
      .update(communityAnswers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(communityAnswers.id, id))
      .returning();
    return answer;
  }

  async deleteCommunityAnswer(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(communityAnswers)
      .where(and(eq(communityAnswers.id, id), eq(communityAnswers.userId, userId)));
    return result.rowCount > 0;
  }

  // Vote operations
  async voteOnAnswer(vote: InsertAnswerVote): Promise<AnswerVote> {
    // Remove existing vote first
    await this.removeVoteFromAnswer(vote.answerId, vote.userId);
    
    const [newVote] = await db
      .insert(answerVotes)
      .values(vote)
      .returning();

    // Update answer vote count
    await this.updateAnswerCounts(vote.answerId);
    
    return newVote;
  }

  async removeVoteFromAnswer(answerId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(answerVotes)
      .where(and(eq(answerVotes.answerId, answerId), eq(answerVotes.userId, userId)));
    
    // Update answer vote count
    await this.updateAnswerCounts(answerId);
    
    return result.rowCount > 0;
  }

  async getUserVoteOnAnswer(answerId: number, userId: string): Promise<AnswerVote | undefined> {
    const [vote] = await db
      .select()
      .from(answerVotes)
      .where(and(eq(answerVotes.answerId, answerId), eq(answerVotes.userId, userId)));
    return vote;
  }

  // Like operations
  async likeAnswer(like: InsertAnswerLike): Promise<AnswerLike> {
    const [newLike] = await db
      .insert(answerLikes)
      .values(like)
      .onConflictDoNothing()
      .returning();

    // Update answer like count
    await this.updateAnswerCounts(like.answerId);
    
    return newLike;
  }

  async unlikeAnswer(answerId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(answerLikes)
      .where(and(eq(answerLikes.answerId, answerId), eq(answerLikes.userId, userId)));
    
    // Update answer like count
    await this.updateAnswerCounts(answerId);
    
    return result.rowCount > 0;
  }

  async getUserLikeOnAnswer(answerId: number, userId: string): Promise<AnswerLike | undefined> {
    const [like] = await db
      .select()
      .from(answerLikes)
      .where(and(eq(answerLikes.answerId, answerId), eq(answerLikes.userId, userId)));
    return like;
  }

  // Comment operations
  async getAnswerComments(answerId: number): Promise<(AnswerComment & { author: { firstName: string; lastName: string; profileImageUrl: string | null } })[]> {
    const results = await db
      .select({
        id: answerComments.id,
        answerId: answerComments.answerId,
        userId: answerComments.userId,
        content: answerComments.content,
        isAnonymous: answerComments.isAnonymous,
        parentCommentId: answerComments.parentCommentId,
        likesCount: answerComments.likesCount,
        createdAt: answerComments.createdAt,
        updatedAt: answerComments.updatedAt,
        author: {
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
        },
      })
      .from(answerComments)
      .leftJoin(users, eq(answerComments.userId, users.id))
      .where(eq(answerComments.answerId, answerId))
      .orderBy(answerComments.createdAt);

    return results;
  }

  async createAnswerComment(insertComment: InsertAnswerComment): Promise<AnswerComment> {
    const [comment] = await db
      .insert(answerComments)
      .values(insertComment)
      .returning();

    // Update answer comment count
    await this.updateAnswerCounts(insertComment.answerId);
    
    return comment;
  }

  async updateAnswerComment(id: number, updates: Partial<AnswerComment>): Promise<AnswerComment> {
    const [comment] = await db
      .update(answerComments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(answerComments.id, id))
      .returning();
    return comment;
  }

  async deleteAnswerComment(id: number, userId: string): Promise<boolean> {
    const comment = await db
      .select()
      .from(answerComments)
      .where(eq(answerComments.id, id));
    
    if (comment.length === 0) return false;
    
    const result = await db
      .delete(answerComments)
      .where(and(eq(answerComments.id, id), eq(answerComments.userId, userId)));
    
    // Update answer comment count
    if (result.rowCount > 0) {
      await this.updateAnswerCounts(comment[0].answerId);
    }
    
    return result.rowCount > 0;
  }

  // Comment like operations
  async likeComment(like: InsertCommentLike): Promise<CommentLike> {
    const [newLike] = await db
      .insert(commentLikes)
      .values(like)
      .onConflictDoNothing()
      .returning();

    // Update comment like count
    await this.updateCommentLikeCount(like.commentId);
    
    return newLike;
  }

  async unlikeComment(commentId: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));
    
    // Update comment like count
    if (result.rowCount > 0) {
      await this.updateCommentLikeCount(commentId);
    }
    
    return result.rowCount > 0;
  }

  async getUserLikeOnComment(commentId: number, userId: string): Promise<CommentLike | undefined> {
    const [like] = await db
      .select()
      .from(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, userId)));
    return like;
  }

  // Helper methods
  private async updateAnswerCounts(answerId: number): Promise<void> {
    const [likesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(answerLikes)
      .where(eq(answerLikes.answerId, answerId));

    const [votesCount] = await db
      .select({ 
        upVotes: sql<number>`count(case when vote_type = 'up' then 1 end)::int`,
        downVotes: sql<number>`count(case when vote_type = 'down' then 1 end)::int`
      })
      .from(answerVotes)
      .where(eq(answerVotes.answerId, answerId));

    const [commentsCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(answerComments)
      .where(eq(answerComments.answerId, answerId));

    const netVotes = (votesCount?.upVotes || 0) - (votesCount?.downVotes || 0);

    await db
      .update(communityAnswers)
      .set({
        likesCount: likesCount?.count || 0,
        votesCount: netVotes,
        commentsCount: commentsCount?.count || 0,
        updatedAt: new Date(),
      })
      .where(eq(communityAnswers.id, answerId));
  }

  private async updateCommentLikeCount(commentId: number): Promise<void> {
    const [likesCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(commentLikes)
      .where(eq(commentLikes.commentId, commentId));

    await db
      .update(answerComments)
      .set({
        likesCount: likesCount?.count || 0,
        updatedAt: new Date(),
      })
      .where(eq(answerComments.id, commentId));
  }
}

export const storage = new DatabaseStorage();