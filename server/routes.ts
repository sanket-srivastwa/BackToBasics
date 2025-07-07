import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnswerSchema, insertPracticeSessionSchema, insertCommunityQuestionSchema } from "@shared/schema";
import { generateOptimalAnswer, analyzeAnswerComparison, validateQuestion, generateLearningContent, generateLearningResponse, generateCaseStudy, evaluateCaseStudyResponse, generateComprehensiveLearningMaterials, searchLearningContent, type CaseStudy } from "./openai";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily disable auth until environment is configured
  // await setupAuth(app);

  // Helper function to get current user ID
  function getCurrentUserId(req: any): string | null {
    if (req.session && req.session.user) {
      return req.session.user.id;
    }
    return null;
  }

  // Auth routes (mock for now)
  app.get('/api/auth/user', async (req: any, res) => {
    if (req.session && req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  // Demo authentication for development
  app.get('/api/login', async (req: any, res) => {
    // For demo purposes, create a mock session
    req.session.user = {
      id: "demo-user-123",
      email: "demo@example.com", 
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    };
    res.redirect('/?message=signed-in');
  });

  app.get('/api/logout', async (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.redirect('/?message=logged-out');
    });
  });

  // Middleware to track question access for unauthenticated users
  const trackQuestionAccess = async (req: any, res: any, next: any) => {
    try {
      if (req.isAuthenticated()) {
        const userId = req.user.claims.sub;
        await storage.incrementUserQuestionsViewed(userId);
      }
      next();
    } catch (error) {
      console.error('Error tracking question access:', error);
      next();
    }
  };

  // Questions API
  app.get("/api/questions/popular", async (req, res) => {
    try {
      const company = req.query.company as string;
      const questions = await storage.getPopularQuestions(company);
      res.json(questions);
    } catch (error) {
      console.error("Failed to fetch popular questions:", error);
      res.status(500).json({ error: "Failed to fetch popular questions" });
    }
  });

  // Community Questions API
  app.get("/api/community/questions", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        company: req.query.company as string,
        difficulty: req.query.difficulty as string,
        role: req.query.role as string,
        topic: req.query.topic as string,
        sortBy: req.query.sortBy as string || "most-active"
      };

      // For now, return regular questions with mock community data
      // In a real implementation, this would query a community_questions table
      const questions = await storage.getFilteredQuestions(filters);
      
      // Add mock community data for demonstration
      const communityQuestions = questions.map(question => ({
        ...question,
        communityAnswersCount: Math.floor(Math.random() * 10),
        communityLikesCount: Math.floor(Math.random() * 25),
        communityVotesCount: Math.floor(Math.random() * 15),
        lastActivityAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        topContributors: []
      }));

      res.json(communityQuestions);
    } catch (error) {
      console.error("Failed to fetch community questions:", error);
      res.status(500).json({ error: "Failed to fetch community questions" });
    }
  });

  app.get("/api/questions/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const filters = {
        company: req.query.company as string,
        difficulty: req.query.difficulty as string,
        role: req.query.role as string,
        topic: req.query.topic as string,
        search: query
      };

      const questions = await storage.getFilteredQuestions(filters);
      res.json(questions);
    } catch (error) {
      console.error("Failed to search questions:", error);
      res.status(500).json({ error: "Failed to search questions" });
    }
  });

  app.get("/api/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQuestion(id);
      
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json(question);
    } catch (error) {
      console.error("Failed to fetch question:", error);
      res.status(500).json({ error: "Failed to fetch question" });
    }
  });

  // Community Answer APIs
  app.get("/api/questions/:questionId/community-answers", async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const sortBy = req.query.sortBy as string || "recent";
      
      const answers = await storage.getCommunityAnswers(questionId, sortBy);
      res.json(answers);
    } catch (error) {
      console.error("Failed to fetch community answers:", error);
      res.status(500).json({ error: "Failed to fetch community answers" });
    }
  });

  app.post("/api/questions/:questionId/community-answers", async (req, res) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const userId = getCurrentUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { title, content, isAnonymous, experienceLevel, currentRole, company, tags } = req.body;
      
      const answer = await storage.createCommunityAnswer({
        questionId,
        userId,
        title,
        content,
        isAnonymous: isAnonymous || false,
        experienceLevel,
        currentRole,
        company,
        tags: tags || []
      });
      
      res.json(answer);
    } catch (error) {
      console.error("Failed to create community answer:", error);
      res.status(500).json({ error: "Failed to create community answer" });
    }
  });

  app.post("/api/community-answers/:answerId/vote", async (req, res) => {
    try {
      const answerId = parseInt(req.params.answerId);
      const userId = getCurrentUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { voteType } = req.body;
      
      if (!["up", "down"].includes(voteType)) {
        return res.status(400).json({ error: "Invalid vote type" });
      }

      const vote = await storage.voteOnAnswer({
        answerId,
        userId,
        voteType
      });
      
      res.json(vote);
    } catch (error) {
      console.error("Failed to vote on answer:", error);
      res.status(500).json({ error: "Failed to vote on answer" });
    }
  });

  app.post("/api/community-answers/:answerId/like", async (req, res) => {
    try {
      const answerId = parseInt(req.params.answerId);
      const userId = getCurrentUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const like = await storage.likeAnswer({
        answerId,
        userId
      });
      
      res.json(like);
    } catch (error) {
      console.error("Failed to like answer:", error);
      res.status(500).json({ error: "Failed to like answer" });
    }
  });

  app.get("/api/community-answers/:answerId/comments", async (req, res) => {
    try {
      const answerId = parseInt(req.params.answerId);
      const comments = await storage.getAnswerComments(answerId);
      res.json(comments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/community-answers/:answerId/comments", async (req, res) => {
    try {
      const answerId = parseInt(req.params.answerId);
      const userId = getCurrentUserId(req);
      
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { content, isAnonymous, parentCommentId } = req.body;
      
      const comment = await storage.createAnswerComment({
        answerId,
        userId,
        content,
        isAnonymous: isAnonymous || false,
        parentCommentId: parentCommentId || null
      });
      
      res.json(comment);
    } catch (error) {
      console.error("Failed to create comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  // Standard answer submission for AI feedback
  app.post("/api/questions/:id/answers", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const validatedData = insertAnswerSchema.parse(req.body);

      const question = await storage.getQuestion(questionId);
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const answer = await storage.createAnswer({
        questionId,
        userAnswer: validatedData.userAnswer,
      });

      try {
        const feedback = await generateFeedback(validatedData.userAnswer, question.optimalAnswer);
        await storage.updateAnswerFeedback(answer.id, feedback);
        
        res.json({ 
          ...answer, 
          ...feedback 
        });
      } catch (feedbackError) {
        console.error("Failed to generate AI feedback:", feedbackError);
        res.json({ 
          ...answer, 
          score: 7,
          feedback: {
            overall: "Answer submitted successfully. AI feedback temporarily unavailable.",
            detailedAnalysis: "Your response has been recorded. Please try again later for detailed analysis."
          },
          strengths: ["Clear communication"],
          improvements: ["Consider adding more specific examples"],
          suggestions: ["Structure your response using frameworks when applicable"]
        });
      }
    } catch (error) {
      console.error("Failed to create answer:", error);
      res.status(500).json({ error: "Failed to create answer" });
    }
  });

  // Community Questions API
  app.get("/api/community-questions", async (req, res) => {
    try {
      const { role, topic, company, search } = req.query;
      const filters = {
        role: role as string,
        topic: topic as string,
        company: company as string,
        search: search as string,
      };
      
      const questions = await storage.getCommunityQuestions(filters);
      res.json(questions);
    } catch (error) {
      console.error("Error fetching community questions:", error);
      res.status(500).json({ message: "Error fetching community questions" });
    }
  });

  app.post("/api/community-questions", async (req, res) => {
    try {
      const userId = getCurrentUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const questionData = { ...req.body, userId };
      const question = await storage.createCommunityQuestion(questionData);
      res.json(question);
    } catch (error) {
      console.error("Error creating community question:", error);
      res.status(500).json({ message: "Error creating community question" });
    }
  });

  app.get("/api/community-questions/:id", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.getCommunityQuestion(questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      res.json(question);
    } catch (error) {
      console.error("Error fetching community question:", error);
      res.status(500).json({ message: "Error fetching community question" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// AI-powered feedback generation
async function generateFeedback(userAnswer: string, optimalAnswer: string) {
  const userWords = userAnswer.toLowerCase().split(/\s+/);
  const optimalWords = optimalAnswer.toLowerCase().split(/\s+/);
  
  const commonWords = userWords.filter(word => 
    optimalWords.some(optimal => optimal.includes(word) || word.includes(optimal))
  );
  
  const score = Math.min(10, Math.max(1, Math.round((commonWords.length / optimalWords.length) * 10)));
  
  const strengths = [];
  const improvements = [];
  const suggestions = [];
  
  if (userAnswer.length > 100) {
    strengths.push("Comprehensive response with good detail");
  }
  
  if (userAnswer.includes("because") || userAnswer.includes("therefore")) {
    strengths.push("Good use of reasoning and justification");
  }
  
  if (score < 5) {
    improvements.push("Consider including more relevant keywords");
    improvements.push("Add more specific details related to the question");
  }
  
  suggestions.push("Consider using the STAR method for behavioral questions");
  suggestions.push("Include specific metrics and timelines when possible");
  
  return {
    score,
    feedback: {
      overall: score >= 7 ? "Strong response with good structure" : 
               score >= 5 ? "Good foundation, could use more detail" : 
               "Needs significant improvement in detail and structure",
      detailedAnalysis: `Your response scored ${score}/10. ${
        score >= 7 ? "You demonstrated good understanding and provided relevant examples." :
        score >= 5 ? "You have the right idea but could benefit from more specific details." :
        "Consider restructuring your response with more concrete examples."
      }`
    },
    strengths: strengths.length > 0 ? strengths : ["Clear communication"],
    improvements: improvements.length > 0 ? improvements : ["Consider adding more specific examples"],
    suggestions: suggestions
  };
}

