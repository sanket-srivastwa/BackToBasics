import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnswerSchema, insertSessionSchema } from "@shared/schema";
import { generateOptimalAnswer, analyzeAnswerComparison, validateQuestion, generateLearningContent, generateLearningResponse } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get popular questions
  app.get("/api/questions/popular", async (req, res) => {
    try {
      const company = req.query.company as string;
      const questions = await storage.getPopularQuestions(company);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular questions" });
    }
  });

  // Get questions by topic and category
  app.get("/api/questions", async (req, res) => {
    try {
      const { topic, category } = req.query;
      
      if (!topic || !category) {
        return res.status(400).json({ error: "Topic and category are required" });
      }

      const questions = await storage.getQuestionsByTopic(
        topic as string, 
        category as string
      );
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch questions" });
    }
  });

  // Get specific question
  app.get("/api/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQuestion(id);
      
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json(question);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch question" });
    }
  });

  // Search questions
  app.get("/api/questions/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const questions = await storage.searchQuestions(query);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to search questions" });
    }
  });

  // Create session
  app.post("/api/sessions", async (req, res) => {
    try {
      const validatedData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Get session
  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getSession(id);
      
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  // Submit answer
  app.post("/api/answers", async (req, res) => {
    try {
      const validatedData = insertAnswerSchema.parse(req.body);
      const answer = await storage.createAnswer(validatedData);
      
      // Generate feedback
      const question = await storage.getQuestion(validatedData.questionId);
      if (question) {
        const feedback = await generateFeedback(validatedData.userAnswer, question.optimalAnswer);
        const updatedAnswer = await storage.updateAnswerFeedback(answer.id, feedback);
        res.json(updatedAnswer);
      } else {
        res.json(answer);
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid answer data" });
    }
  });

  // Get answer with feedback
  app.get("/api/answers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const answer = await storage.getAnswer(id);
      
      if (!answer) {
        return res.status(404).json({ error: "Answer not found" });
      }

      res.json(answer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch answer" });
    }
  });

  // Validate custom question
  app.post("/api/questions/validate", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question || typeof question !== 'string' || question.trim().length < 10) {
        return res.status(400).json({ error: "Question must be at least 10 characters long" });
      }

      const validation = await validateQuestion(question.trim());
      res.json(validation);
    } catch (error) {
      console.error("Question validation error:", error);
      res.status(500).json({ error: "Failed to validate question" });
    }
  });

  // Generate optimal answer for custom question
  app.post("/api/questions/generate-answer", async (req, res) => {
    try {
      const { question, topic = "Technical Program Management" } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ error: "Question is required" });
      }

      const optimalAnswer = await generateOptimalAnswer(question.trim(), topic);
      res.json({ optimalAnswer });
    } catch (error) {
      console.error("Answer generation error:", error);
      res.status(500).json({ error: "Failed to generate optimal answer" });
    }
  });

  // Submit and analyze custom question answer
  app.post("/api/answers/analyze", async (req, res) => {
    try {
      const { question, userAnswer, topic = "Technical Program Management" } = req.body;
      
      if (!question || !userAnswer) {
        return res.status(400).json({ error: "Question and answer are required" });
      }

      if (userAnswer.trim().length < 50) {
        return res.status(400).json({ error: "Answer must be at least 50 characters long" });
      }

      // Generate optimal answer
      const optimalAnswer = await generateOptimalAnswer(question.trim(), topic);
      
      // Analyze user's answer
      const analysis = await analyzeAnswerComparison(
        question.trim(), 
        userAnswer.trim(), 
        optimalAnswer, 
        topic
      );

      res.json(analysis);
    } catch (error) {
      console.error("Answer analysis error:", error);
      res.status(500).json({ error: "Failed to analyze answer" });
    }
  });

  // Get prompted questions by topic and experience level
  app.get("/api/prompted-questions", async (req, res) => {
    try {
      const { topic, experienceLevel } = req.query;
      
      if (!topic || !experienceLevel) {
        return res.status(400).json({ error: "Topic and experience level are required" });
      }

      const questions = await storage.getPromptedQuestions(
        topic as string, 
        experienceLevel as string
      );
      res.json(questions);
    } catch (error) {
      console.error("Failed to fetch prompted questions:", error);
      res.status(500).json({ error: "Failed to fetch prompted questions" });
    }
  });

  // Get specific prompted question
  app.get("/api/prompted-questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getPromptedQuestion(id);
      
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json(question);
    } catch (error) {
      console.error("Failed to fetch prompted question:", error);
      res.status(500).json({ error: "Failed to fetch prompted question" });
    }
  });

  // Generate learning content using AI
  app.get("/api/learning/:track/:module", async (req, res) => {
    try {
      const { track, module } = req.params;
      
      if (!track || !module) {
        return res.status(400).json({ error: "Track and module are required" });
      }

      const content = await generateLearningContent(track, module);
      res.json(content);
    } catch (error: any) {
      console.error("Failed to generate learning content:", error);
      if (error.message.includes("quota exceeded")) {
        res.status(429).json({ error: "AI service temporarily unavailable. Please try again later." });
      } else {
        res.status(500).json({ error: "Failed to generate learning content" });
      }
    }
  });

  // AI Learning Search Assistant
  app.post("/api/learning/search", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const response = await generateLearningResponse(query);
      res.json({ response });
    } catch (error: any) {
      console.error("Failed to generate learning response:", error);
      if (error.message.includes("quota exceeded")) {
        res.status(429).json({ error: "AI assistant temporarily unavailable due to API limitations. Please try again later." });
      } else {
        res.status(500).json({ error: "Failed to generate response" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// AI-powered feedback generation
async function generateFeedback(userAnswer: string, optimalAnswer: string) {
  // This is a simplified feedback generation algorithm
  // In production, this would use AI/ML models for more sophisticated analysis
  
  const userWords = userAnswer.toLowerCase().split(/\s+/);
  const optimalWords = optimalAnswer.toLowerCase().split(/\s+/);
  
  // Calculate basic similarity score
  const commonWords = userWords.filter(word => 
    optimalWords.some(optimal => optimal.includes(word) || word.includes(optimal))
  );
  
  const score = Math.min(10, Math.max(1, Math.round((commonWords.length / optimalWords.length) * 10)));
  
  // Generate basic feedback
  const strengths = [];
  const improvements = [];
  const suggestions = [];
  
  if (userAnswer.length > 100) {
    strengths.push("Good detail and comprehensive response");
  }
  
  if (userAnswer.toLowerCase().includes("situation") || 
      userAnswer.toLowerCase().includes("task") || 
      userAnswer.toLowerCase().includes("action") || 
      userAnswer.toLowerCase().includes("result")) {
    strengths.push("Used structured approach (STAR method)");
  }
  
  if (score < 6) {
    improvements.push("Provide more specific examples and details");
    improvements.push("Focus on quantifiable outcomes and results");
  }
  
  if (userAnswer.length < 150) {
    improvements.push("Expand your answer with more detail");
  }
  
  if (!userAnswer.toLowerCase().includes("result") && !userAnswer.toLowerCase().includes("outcome")) {
    suggestions.push("Always include the results and impact of your actions");
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
