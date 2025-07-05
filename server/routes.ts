import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnswerSchema, insertPracticeSessionSchema } from "@shared/schema";
import { generateOptimalAnswer, analyzeAnswerComparison, validateQuestion, generateLearningContent, generateLearningResponse, generateCaseStudy, evaluateCaseStudyResponse, generateComprehensiveLearningMaterials, searchLearningContent, type CaseStudy } from "./openai";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily disable auth until environment is configured
  // await setupAuth(app);

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

  // Middleware to track question views for unauthenticated users
  const trackQuestionAccess = async (req: any, res: any, next: any) => {
    try {
      if (req.isAuthenticated()) {
        const userId = req.user.claims.sub;
        await storage.incrementUserQuestionsViewed(userId);
      }
      next();
    } catch (error) {
      console.error("Error tracking question access:", error);
      next(); // Continue even if tracking fails
    }
  };
  // Get popular questions with filters
  app.get("/api/questions/popular", async (req, res) => {
    try {
      const { company, topic, difficulty } = req.query;
      
      let questions = await storage.getPopularQuestions(company as string);
      
      // Filter by topic if specified
      if (topic && topic !== 'all') {
        questions = questions.filter(q => q.topic === topic);
      }
      
      // Filter by difficulty if specified  
      if (difficulty && difficulty !== 'all') {
        questions = questions.filter(q => q.difficulty === difficulty);
      }
      
      res.json(questions);
    } catch (error) {
      console.error("Error fetching popular questions:", error);
      res.status(500).json({ error: "Failed to fetch popular questions" });
    }
  });

  // Search questions
  app.get("/api/questions/search", async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }
      
      const questions = await storage.searchQuestions(query);
      res.json(questions);
    } catch (error) {
      console.error("Error searching questions:", error);
      res.status(500).json({ error: "Failed to search questions" });
    }
  });

  // Get filtered questions with advanced filtering
  app.get("/api/questions/filtered", async (req, res) => {
    try {
      const { company, difficulty, role, topic, search } = req.query;
      
      const filters = {
        company: company as string,
        difficulty: difficulty as string,
        role: role as string,
        topic: topic as string,
        search: search as string
      };

      const questions = await storage.getFilteredQuestions(filters);
      res.json(questions);
    } catch (error) {
      console.error("Error filtering questions:", error);
      res.status(500).json({ error: "Failed to filter questions" });
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

  // Create practice session
  app.post("/api/practice-sessions", async (req, res) => {
    try {
      const validatedData = insertPracticeSessionSchema.parse(req.body);
      const session = await storage.createPracticeSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  // Get practice session
  app.get("/api/practice-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getPracticeSession(id);
      
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

  // AI Learning Search endpoint
  app.post("/api/ai/learning-search", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Query is required" });
      }

      const response = await generateLearningResponse(query.trim());
      res.json({ response });
    } catch (error: any) {
      console.error("AI learning search error:", error);
      if (error?.message?.includes('quota') || error?.message?.includes('rate limit')) {
        return res.status(429).json({ 
          error: "Our AI assistant is currently at capacity. Please try again in a few minutes, or explore our comprehensive learning materials below." 
        });
      }
      res.status(500).json({ error: "Failed to process learning query" });
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

  // Get prompted questions by topic and experience level (AI-generated)
  app.get("/api/prompted-questions", async (req, res) => {
    try {
      const { topic, experienceLevel, forceGenerate } = req.query;
      
      if (!topic || !experienceLevel) {
        return res.status(400).json({ error: "Topic and experience level are required" });
      }

      // Always generate fresh questions using AI
      try {
        const { generatePromptedQuestions } = await import("./openai");
        const aiQuestions = await generatePromptedQuestions(
          topic as string, 
          experienceLevel as string, 
          5
        );
        res.json(aiQuestions);
      } catch (aiError: any) {
        console.log("OpenAI unavailable for questions, falling back to database");
        
        // Fallback to existing database questions if AI fails
        const questions = await storage.getPromptedQuestions(
          topic as string, 
          experienceLevel as string
        );
        
        if (questions.length === 0) {
          // Generate some demo questions if no database content
          const demoQuestions = [
            {
              id: Date.now(),
              topic: topic as string,
              experienceLevel: experienceLevel as string,
              questionPrompt: `Tell me about a time you had to manage competing priorities in a ${topic} context.`,
              context: "Tests prioritization and time management skills under pressure.",
              suggestedStructure: "Use the STAR method to structure your response.",
              keyPoints: ["Problem identification", "Prioritization framework", "Stakeholder communication", "Results achieved"],
              difficultyLevel: experienceLevel === "junior" ? "easy" : experienceLevel === "senior" ? "hard" : "medium",
              estimatedTime: 10,
              isActive: true,
              createdAt: new Date().toISOString()
            }
          ];
          res.json(demoQuestions);
        } else {
          res.json(questions);
        }
      }
    } catch (error) {
      console.error("Failed to fetch prompted questions:", error);
      res.status(500).json({ error: "Failed to fetch prompted questions" });
    }
  });

  // Generate case study following PM Solutions format
  app.post("/api/case-studies/generate", async (req, res) => {
    try {
      const { topic, difficulty = "medium" } = req.body;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      // Try OpenAI first, fallback to demo data if API key issues
      try {
        const caseStudy = await generateCaseStudy(topic, difficulty);
        res.json(caseStudy);
      } catch (error: any) {
        console.log("OpenAI unavailable, generating fresh randomized demo case study");
        
        // Generate varied, fresh case studies with timestamp-based uniqueness
        const timestamp = Date.now();
        const companies = [
          "TechFlow Dynamics", "DataSphere Ventures", "CloudVantage Systems", "InnovatePro Labs", 
          "NextWave Technologies", "ScaleForward Inc.", "DigitalBridge Corp", "StreamTech Solutions",
          "CoreLogic Industries", "EliteOps Platforms", "FlexScale Networks", "ProActive Systems"
        ];
        
        const industries = [
          "Cloud Infrastructure", "AI/ML Platform", "Fintech Services", "E-commerce Platform", 
          "HealthTech Solutions", "EdTech Platform", "Cybersecurity", "DevOps Tools",
          "Data Analytics", "SaaS Platform", "Mobile Technologies", "IoT Solutions"
        ];
        
        const companySizes = [
          "200-500 employees, $75M-200M revenue", 
          "500-1200 employees, $200M-600M revenue",
          "1200-3000 employees, $600M-1.5B revenue", 
          "3000+ employees, $1.5B+ revenue"
        ];
        
        const challengeTypes = [
          "rapid scaling infrastructure to support 5x user growth",
          "modernizing legacy architecture while maintaining service reliability",
          "implementing automation and AI across core business processes",
          "building comprehensive data analytics and insights capabilities", 
          "transforming customer experience through digital innovation",
          "establishing market leadership in an increasingly competitive landscape"
        ];
        
        const timeframes = [
          "5 months for pilot program, 15 months for full enterprise rollout",
          "7 months for core platform development, 12 months for market expansion", 
          "4 months for proof of concept, 10 months for production deployment",
          "9 months for infrastructure overhaul, 6 months for optimization phase"
        ];
        
        // Ensure uniqueness with timestamp
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
        const randomSize = companySizes[Math.floor(Math.random() * companySizes.length)];
        const randomChallenge = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        const randomTimeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
        
        const demoCaseStudy = {
          title: `${topic} Transformation at ${randomCompany} - Initiative ${timestamp % 1000}`,
          company: randomCompany,
          industry: randomIndustry,
          companySize: randomSize,
          challenge: `${randomCompany} must execute ${randomChallenge} to maintain competitive position and drive sustainable growth.`,
          detailedChallenge: `${randomCompany}, a prominent ${randomIndustry.toLowerCase()} company, faces the strategic imperative of ${randomChallenge}. The organization has achieved strong market position but now confronts the challenge of scaling operations while maintaining quality and innovation pace. Current infrastructure and processes are approaching capacity limits, creating bottlenecks that affect both team productivity and customer experience. Market dynamics are shifting rapidly, with new competitors leveraging advanced technologies and changing customer expectations demanding faster, more reliable solutions. The leadership team recognizes that strategic transformation is essential to capture emerging opportunities while managing operational complexities. This initiative requires careful balance between innovation velocity and risk management, ensuring business continuity while building next-generation capabilities.`,
          stakeholders: [
            "Executive Leadership Team",
            "VP of Engineering & Technology",
            "Product Management & Strategy", 
            "Operations & Infrastructure Teams",
            "Customer Success & Experience",
            "Business Development & Partnerships",
            "Quality Assurance & Security",
            "HR & Organizational Development"
          ],
          constraints: [
            `Approved budget of $${Math.floor(Math.random() * 5 + 3)}M allocated over ${Math.floor(Math.random() * 8 + 8)} months`,
            "Zero tolerance for customer-impacting downtime during transitions",
            "Full compliance with SOC2, GDPR, HIPAA, and industry regulations",
            "Limited external hiring - optimize with existing talent pool",
            "Complex integration requirements with 20+ existing systems",
            "Phased deployment approach to minimize business risk"
          ],
          objectives: [
            `Achieve ${Math.floor(Math.random() * 25 + 20)}% improvement in system performance and reliability`,
            `Reduce operational costs by ${Math.floor(Math.random() * 20 + 15)}% while expanding capabilities`,
            `Increase customer satisfaction scores to 92%+ within 6 months`,
            "Implement comprehensive monitoring and automated incident response",
            `Scale platform capacity to handle ${Math.floor(Math.random() * 6 + 4)}x current traffic volume`,
            "Establish center of excellence for continuous innovation and optimization"
          ],
          timeframe: randomTimeframe
        };
        
        res.json(demoCaseStudy);
      }
    } catch (error: any) {
      console.error("Failed to generate case study:", error);
      res.status(500).json({ error: "Failed to generate case study" });
    }
  });

  // Evaluate case study response
  app.post("/api/case-studies/evaluate", async (req, res) => {
    try {
      const { caseStudy, userAnswer } = req.body;
      
      if (!caseStudy || !userAnswer) {
        return res.status(400).json({ error: "Case study and user answer are required" });
      }

      if (userAnswer.trim().length < 100) {
        return res.status(400).json({ error: "Answer must be at least 100 characters long for proper evaluation" });
      }

      // Try OpenAI first, fallback to demo evaluation if API key issues
      try {
        const evaluation = await evaluateCaseStudyResponse(caseStudy, userAnswer);
        res.json(evaluation);
      } catch (error: any) {
        console.log("OpenAI unavailable, using demo evaluation");
        
        // Demo evaluation for testing functionality
        const demoEvaluation = {
          optimalAnswer: `An effective approach to this ${caseStudy.title} would involve: 1) Comprehensive stakeholder analysis and alignment, 2) Phased implementation strategy with clear milestones, 3) Risk mitigation planning with contingencies, 4) Clear success metrics and KPIs, 5) Change management and communication strategy. The solution should balance immediate needs with long-term strategic objectives while considering budget constraints and technical feasibility.`,
          userScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100 for demo
          strengths: [
            "Clear problem identification and analysis",
            "Structured approach to solution design",
            "Consideration of stakeholder impacts",
            "Practical implementation suggestions"
          ],
          improvements: [
            "More detailed risk assessment needed",
            "Could include specific metrics for success measurement",
            "Timeline could be more granular",
            "Budget allocation details would strengthen the proposal"
          ],
          suggestions: [
            "Consider conducting stakeholder interviews before implementation",
            "Develop a detailed change management plan",
            "Create regular checkpoint reviews for course correction",
            "Establish clear communication channels for feedback"
          ],
          detailedFeedback: `Your solution demonstrates strong analytical thinking and practical approach to the challenge. You've identified key components and shown understanding of the complexity involved. To strengthen future responses, focus on providing more specific metrics, detailed timelines, and comprehensive risk mitigation strategies. Consider the business impact and ROI aspects more explicitly in your recommendations.`
        };
        
        res.json(demoEvaluation);
      }
    } catch (error: any) {
      console.error("Failed to evaluate case study:", error);
      res.status(500).json({ error: "Failed to evaluate case study response" });
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

  // Update user profile information
  app.put('/api/users/profile', async (req, res) => {
    try {
      const { userId, profileData } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // For mock authentication, store in localStorage on client side
      // In production, this would update the actual user in database
      res.json({ success: true, message: "Profile updated successfully", profileData });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Generate comprehensive learning materials for a topic
  app.get("/api/learning/materials/:topic", async (req, res) => {
    try {
      const { topic } = req.params;
      
      if (!topic) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const modules = await generateComprehensiveLearningMaterials(topic);
      res.json({ topic, modules });
    } catch (error: any) {
      console.error("Failed to generate learning materials:", error);
      if (error.message.includes("quota exceeded")) {
        res.status(429).json({ error: "AI service temporarily unavailable. Please try again later." });
      } else {
        res.status(500).json({ error: "Failed to generate learning materials" });
      }
    }
  });

  // Search learning content with AI
  app.post("/api/learning/search", async (req, res) => {
    try {
      const { query, topics } = req.body;
      
      if (!query) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const result = await searchLearningContent(query, topics);
      res.json(result);
    } catch (error: any) {
      console.error("Failed to search learning content:", error);
      if (error.message.includes("quota exceeded")) {
        res.status(429).json({ error: "AI service temporarily unavailable. Please try again later." });
      } else {
        res.status(500).json({ error: "Failed to search learning content" });
      }
    }
  });

  // AI Learning Response Assistant
  app.post("/api/learning/ask", async (req, res) => {
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
