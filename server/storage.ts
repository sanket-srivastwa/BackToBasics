import { 
  users, questions, answers, sessions,
  type User, type InsertUser,
  type Question, type InsertQuestion,
  type Answer, type InsertAnswer,
  type Session, type InsertSession
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Question methods
  getQuestion(id: number): Promise<Question | undefined>;
  getQuestionsByTopic(topic: string, category: string): Promise<Question[]>;
  getPopularQuestions(company?: string): Promise<Question[]>;
  createQuestion(question: InsertQuestion): Promise<Question>;
  searchQuestions(query: string): Promise<Question[]>;

  // Answer methods
  getAnswer(id: number): Promise<Answer | undefined>;
  getAnswersByQuestion(questionId: number): Promise<Answer[]>;
  createAnswer(answer: InsertAnswer): Promise<Answer>;
  updateAnswerFeedback(id: number, feedback: any): Promise<Answer>;

  // Session methods
  getSession(id: number): Promise<Session | undefined>;
  createSession(session: InsertSession): Promise<Session>;
  updateSession(id: number, updates: Partial<Session>): Promise<Session>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private questions: Map<number, Question>;
  private answers: Map<number, Answer>;
  private sessions: Map<number, Session>;
  private currentUserId: number;
  private currentQuestionId: number;
  private currentAnswerId: number;
  private currentSessionId: number;

  constructor() {
    this.users = new Map();
    this.questions = new Map();
    this.answers = new Map();
    this.sessions = new Map();
    this.currentUserId = 1;
    this.currentQuestionId = 1;
    this.currentAnswerId = 1;
    this.currentSessionId = 1;

    // Seed with sample questions
    this.seedQuestions();
  }

  private seedQuestions() {
    const sampleQuestions: Omit<Question, 'id' | 'createdAt'>[] = [
      {
        title: "Describe a time when you had to manage a cross-functional project with competing priorities",
        description: "Tell me about a situation where you had to manage a cross-functional project with competing priorities. How did you align stakeholders and ensure successful delivery?",
        category: "mock-interview",
        topic: "tpm",
        company: "meta",
        difficulty: "medium",
        timeLimit: 7,
        tips: ["Use the STAR method (Situation, Task, Action, Result)", "Focus on specific examples and quantifiable outcomes", "Highlight leadership and communication skills"],
        optimalAnswer: "**Situation:** While leading the migration of our mobile app's authentication system, three teams had conflicting timelines - Security wanted 6 months for thorough testing, Product needed it done in 2 months for a major launch, and Engineering estimated 4 months.\n\n**Task:** I needed to align all stakeholders on a realistic timeline while ensuring security wasn't compromised and the product launch could proceed.\n\n**Action:** I organized a stakeholder alignment meeting where each team presented their constraints. I then worked with each team to identify critical path items and dependencies. We agreed on a phased approach: Phase 1 would deliver core functionality in 3 months for the product launch, Phase 2 would add advanced security features over the following 2 months. I established weekly cross-functional sync meetings and created a shared dashboard showing progress and blockers.\n\n**Result:** We delivered Phase 1 on time, enabling the product launch. The authentication system supported 2M users in the first month with 99.9% uptime. Phase 2 was completed ahead of schedule, and the framework we established became the standard for future cross-functional projects.",
        isPopular: true,
      },
      {
        title: "How would you prioritize features for Instagram Stories when you have limited engineering resources?",
        description: "You're a Product Manager for Instagram Stories. You have 5 engineers for the next quarter and 10 potential features to build. Walk me through your prioritization framework.",
        category: "mock-interview",
        topic: "pm",
        company: "meta",
        difficulty: "hard",
        timeLimit: 10,
        tips: ["Define clear success metrics", "Consider user impact vs engineering effort", "Think about strategic alignment", "Mention data-driven decision making"],
        optimalAnswer: "I would use a comprehensive prioritization framework considering multiple factors:\n\n**1. Define Success Metrics:** First, I'd align with leadership on what success looks like - user engagement, retention, monetization, or strategic positioning.\n\n**2. Impact Assessment:** For each feature, I'd evaluate:\n- User impact: How many users would benefit and how significantly?\n- Business impact: Revenue potential, competitive advantage, strategic alignment\n- Technical impact: Platform improvements, infrastructure benefits\n\n**3. Effort Estimation:** Work with engineering to estimate each feature in terms of:\n- Engineering weeks required\n- Technical complexity and risk\n- Dependencies on other teams or systems\n\n**4. Prioritization Matrix:** Plot features on Impact vs Effort matrix:\n- High Impact, Low Effort: Quick wins (implement first)\n- High Impact, High Effort: Major initiatives (plan carefully)\n- Low Impact, Low Effort: Nice-to-haves (do if time permits)\n- Low Impact, High Effort: Avoid unless strategic\n\n**5. Final Selection:** With 5 engineers for 12 weeks (60 engineer-weeks), I'd select features that:\n- Maximize user value within our capacity\n- Support Instagram's overall strategy\n- Include at least one infrastructure improvement for future velocity\n\nI'd also reserve 20% capacity for urgent fixes and unexpected opportunities.",
        isPopular: true,
      },
      {
        title: "Walk me through how you would reduce the latency of Google Search by 200ms",
        description: "Google Search currently has an average latency of 400ms. How would you approach reducing this by 200ms while maintaining quality?",
        category: "case-study",
        topic: "tpm",
        company: "google",
        difficulty: "hard",
        timeLimit: 15,
        tips: ["Think systematically about the search pipeline", "Consider both technical and product trade-offs", "Mention measurement and monitoring", "Consider global scale implications"],
        optimalAnswer: "I'd approach this systematically by analyzing the search pipeline and identifying optimization opportunities:\n\n**1. Current State Analysis:**\n- Map the complete search journey: query parsing, index lookup, ranking, result formatting, delivery\n- Measure latency at each stage to identify bottlenecks\n- Analyze geographic and device-specific performance variations\n\n**2. Optimization Strategies:**\n\n**Frontend Optimizations (50-75ms savings):**\n- Implement query autocompletion caching\n- Preload search results for popular queries\n- Optimize JavaScript and CSS delivery\n- Use CDN edge locations more effectively\n\n**Backend Optimizations (100-125ms savings):**\n- Improve index sharding and caching strategies\n- Optimize ranking algorithm efficiency\n- Implement smarter result caching based on query patterns\n- Parallel processing of independent ranking signals\n\n**Infrastructure Optimizations (25-50ms savings):**\n- Reduce network hops between data centers\n- Implement query routing to nearest available resources\n- Optimize load balancing algorithms\n\n**3. Implementation Plan:**\n- Phase 1: Low-risk frontend optimizations (Week 1-2)\n- Phase 2: Backend caching improvements (Week 3-6)\n- Phase 3: Ranking algorithm optimizations (Week 7-12)\n- Phase 4: Infrastructure upgrades (Week 13-16)\n\n**4. Measurement & Monitoring:**\n- Real-time latency monitoring across all regions\n- A/B testing framework to validate improvements\n- Quality metrics to ensure search relevance isn't compromised\n- Rollback plans for each optimization\n\n**5. Risk Mitigation:**\n- Gradual rollout starting with 1% of traffic\n- Comprehensive testing in staging environments\n- Quality assurance checks to maintain search accuracy",
        isPopular: true,
      },
      {
        title: "How would you improve the onboarding experience for new iPhone users?",
        description: "Apple wants to improve the first-time user experience for new iPhone users. Design a comprehensive onboarding strategy.",
        category: "case-study",
        topic: "pm",
        company: "apple",
        difficulty: "medium",
        timeLimit: 12,
        tips: ["Consider different user segments", "Think about the complete user journey", "Balance simplicity with functionality", "Consider Apple's design principles"],
        optimalAnswer: "I'd design a comprehensive onboarding strategy that embodies Apple's principles of simplicity and user delight:\n\n**1. User Segmentation:**\n- First-time smartphone users\n- Android switchers\n- Previous iPhone users upgrading\n- Business/enterprise users\n\n**2. Pre-Setup Experience:**\n- Elegant unboxing with visual setup guide\n- Quick start card with QR code for video tutorials\n- Clear accessory identification and setup instructions\n\n**3. Initial Setup Flow:**\n- Streamlined activation process with minimal steps\n- Smart data transfer from previous devices\n- Intuitive Face ID/Touch ID setup with clear privacy explanations\n- Essential app installation based on user preferences\n\n**4. Guided Discovery (First 3 Days):**\n- Interactive tutorial highlighting key features\n- Personalized tips based on detected usage patterns\n- Progressive disclosure of advanced features\n- Integration with Apple ecosystem (iCloud, Apple ID benefits)\n\n**5. Extended Onboarding (First 2 Weeks):**\n- Daily helpful tips via notifications\n- Suggested shortcuts and automations\n- Introduction to Apple services (App Store, Apple Pay, Siri)\n- Gentle encouragement to explore camera, health, and productivity features\n\n**6. Success Metrics:**\n- Setup completion rate within 24 hours\n- Feature adoption rate in first week\n- Customer satisfaction scores\n- Support contact reduction\n- Time to first successful task completion\n\n**7. Accessibility & Inclusion:**\n- VoiceOver integration for vision-impaired users\n- Large text and high contrast options\n- Multiple language support with localized content\n- Simplified mode for less tech-savvy users\n\nThe goal is to make every new user feel confident and excited about their iPhone within the first few days.",
        isPopular: true,
      },
      {
        title: "How would you measure the success of Netflix's recommendation algorithm?",
        description: "As a Product Manager at Netflix, how would you define and measure the success of the recommendation system?",
        category: "mock-interview",
        topic: "pm",
        company: "netflix",
        difficulty: "medium",
        timeLimit: 8,
        tips: ["Think about different stakeholder perspectives", "Consider both leading and lagging indicators", "Balance multiple objectives", "Mention experimentation framework"],
        optimalAnswer: "I'd establish a comprehensive measurement framework that balances user satisfaction, business impact, and technical performance:\n\n**1. Primary Success Metrics:**\n\n**User Engagement:**\n- Click-through rate on recommended content\n- Completion rate for recommended shows/movies\n- Time spent watching recommended vs. searched content\n- User rating correlation with recommendations\n\n**Content Discovery:**\n- Diversity of content consumed (genres, languages, release dates)\n- Long-tail content discovery rate\n- New user onboarding success (time to first binge)\n\n**2. Business Impact Metrics:**\n- Monthly Active User retention\n- Subscription conversion and churn rates\n- Customer Lifetime Value correlation with recommendation engagement\n- Content ROI optimization\n\n**3. Algorithmic Performance:**\n- Precision and recall for different user segments\n- Recommendation relevance scores\n- Cold start problem resolution (new users/content)\n- Real-time personalization effectiveness\n\n**4. Measurement Framework:**\n- A/B testing infrastructure for algorithm improvements\n- Cohort analysis for long-term impact assessment\n- Multi-armed bandit testing for real-time optimization\n- User surveys for qualitative feedback\n\n**5. Success Targets:**\n- 75%+ of viewing time from recommendations\n- 15%+ improvement in user retention\n- 20%+ increase in content catalog utilization\n- 4.0+ average user satisfaction rating\n\n**6. Monitoring & Iteration:**\n- Daily dashboard monitoring key metrics\n- Weekly algorithm performance reviews\n- Monthly business impact assessment\n- Quarterly strategy adjustments based on learnings\n\nThe ultimate success measure would be users saying 'Netflix always knows what I want to watch' while driving sustainable business growth.",
        isPopular: true,
      },
      {
        title: "Tell me about a time when you had to influence without authority",
        description: "Describe a situation where you needed to drive a critical project forward but didn't have direct authority over the people involved. How did you approach it?",
        category: "mock-interview",
        topic: "tpm",
        company: "amazon",
        difficulty: "medium",
        timeLimit: 6,
        tips: ["Focus on relationship building", "Highlight communication strategies", "Show impact and results", "Demonstrate leadership skills"],
        optimalAnswer: "**Situation:** As a Technical Program Manager at my previous company, I was tasked with implementing a new security compliance framework that required changes across 5 different teams (Engineering, DevOps, QA, Legal, and Customer Support) - none of which reported to me.\n\n**Task:** I needed to coordinate the implementation within 3 months to meet regulatory requirements, but each team had their own priorities and timelines.\n\n**Action:** I employed several influence strategies:\n\n**1. Built Relationships:** I scheduled 1:1s with each team lead to understand their challenges, goals, and how this project could help them. I discovered that Engineering was struggling with security debt, and this project could help address it.\n\n**2. Created Shared Vision:** I organized a kickoff meeting where I presented the business impact of compliance - potential $2M in fines and lost customers. I framed it as an opportunity to improve our security posture, not just a compliance requirement.\n\n**3. Made It Easy:** I created detailed implementation guides, provided resources, and offered to help with their existing workload. I also established a weekly office hours session to answer questions.\n\n**4. Leveraged Stakeholders:** I got buy-in from the CTO and legal team to reinforce the importance and provide air cover for teams to prioritize this work.\n\n**5. Celebrated Progress:** I created a shared dashboard showing progress and regularly recognized teams for their contributions in company-wide updates.\n\n**Result:** All teams completed their implementation 2 weeks ahead of schedule. We passed the compliance audit with zero critical findings, and the security improvements prevented 3 potential breaches in the following quarter. The collaboration framework I established became the template for future cross-functional initiatives.",
        isPopular: true,
      }
    ];

    sampleQuestions.forEach(q => {
      const question: Question = {
        id: this.currentQuestionId++,
        title: q.title,
        description: q.description,
        category: q.category,
        topic: q.topic,
        company: q.company || null,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        tips: q.tips || null,
        optimalAnswer: q.optimalAnswer,
        isPopular: q.isPopular || null,
        createdAt: new Date(),
      };
      this.questions.set(question.id, question);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Question methods
  async getQuestion(id: number): Promise<Question | undefined> {
    return this.questions.get(id);
  }

  async getQuestionsByTopic(topic: string, category: string): Promise<Question[]> {
    return Array.from(this.questions.values()).filter(
      q => q.topic === topic && q.category === category
    );
  }

  async getPopularQuestions(company?: string): Promise<Question[]> {
    let questions = Array.from(this.questions.values()).filter(q => q.isPopular);
    if (company) {
      questions = questions.filter(q => q.company === company);
    }
    return questions.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createQuestion(insertQuestion: InsertQuestion): Promise<Question> {
    const id = this.currentQuestionId++;
    const question: Question = { 
      id,
      title: insertQuestion.title,
      description: insertQuestion.description,
      category: insertQuestion.category,
      topic: insertQuestion.topic,
      company: insertQuestion.company || null,
      difficulty: insertQuestion.difficulty,
      timeLimit: insertQuestion.timeLimit,
      tips: insertQuestion.tips || null,
      optimalAnswer: insertQuestion.optimalAnswer,
      isPopular: insertQuestion.isPopular || null,
      createdAt: new Date()
    };
    this.questions.set(id, question);
    return question;
  }

  async searchQuestions(query: string): Promise<Question[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.questions.values()).filter(q => 
      q.title.toLowerCase().includes(lowercaseQuery) ||
      q.description.toLowerCase().includes(lowercaseQuery) ||
      q.topic.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Answer methods
  async getAnswer(id: number): Promise<Answer | undefined> {
    return this.answers.get(id);
  }

  async getAnswersByQuestion(questionId: number): Promise<Answer[]> {
    return Array.from(this.answers.values()).filter(a => a.questionId === questionId);
  }

  async createAnswer(insertAnswer: InsertAnswer): Promise<Answer> {
    const id = this.currentAnswerId++;
    const answer: Answer = { 
      ...insertAnswer, 
      id, 
      score: null,
      feedback: null,
      strengths: null,
      improvements: null,
      suggestions: null,
      createdAt: new Date()
    };
    this.answers.set(id, answer);
    return answer;
  }

  async updateAnswerFeedback(id: number, feedback: any): Promise<Answer> {
    const answer = this.answers.get(id);
    if (!answer) {
      throw new Error('Answer not found');
    }
    
    const updatedAnswer: Answer = { ...answer, ...feedback };
    this.answers.set(id, updatedAnswer);
    return updatedAnswer;
  }

  // Session methods
  async getSession(id: number): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = { 
      ...insertSession, 
      id,
      completedCount: 0,
      currentQuestionId: null,
      createdAt: new Date()
    };
    this.sessions.set(id, session);
    return session;
  }

  async updateSession(id: number, updates: Partial<Session>): Promise<Session> {
    const session = this.sessions.get(id);
    if (!session) {
      throw new Error('Session not found');
    }
    
    const updatedSession: Session = { ...session, ...updates };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }
}

export const storage = new MemStorage();
