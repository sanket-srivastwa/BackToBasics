import { storage } from "./storage";

export async function seedDatabase() {
  console.log("Seeding database with sample data...");
  
  try {
    // Seed comprehensive questions covering all categories with top tech companies
    const sampleQuestions = [
      // Easy Questions - Product Management
      {
        title: "How do you prioritize features when resources are limited?",
        description: "Walk through your framework for prioritizing product features when you have limited engineering resources.",
        category: "mock-interview",
        topic: "pm",
        company: "microsoft",
        difficulty: "easy",
        roles: ["product-management"],
        timeLimit: 5,
        tips: ["Use a clear framework", "Consider user impact and business value", "Mention stakeholder alignment"],
        optimalAnswer: "I use a framework combining user impact, business value, and effort. I gather stakeholder input, analyze user data, create a weighted scoring system, and communicate decisions transparently with rationale.",
        isPopular: true,
      },
      {
        title: "How do you handle team communication in a remote environment?",
        description: "Describe your approach to maintaining effective communication with distributed engineering teams.",
        category: "mock-interview",
        topic: "tpm",
        company: "google",
        difficulty: "easy",
        roles: ["program-management", "engineering-management"],
        timeLimit: 5,
        tips: ["Focus on tools and processes", "Mention async communication", "Include regular sync points"],
        optimalAnswer: "I establish clear communication channels using tools like Slack for async updates, weekly team meetings for alignment, and documentation in shared spaces. I ensure time zone coverage and set response time expectations.",
        isPopular: true,
      },
      // Medium Questions - Multiple Roles
      {
        title: "Describe a time when you had to manage a cross-functional project with competing priorities",
        description: "Tell me about a situation where you had to manage a cross-functional project with competing priorities. How did you align stakeholders and ensure successful delivery?",
        category: "mock-interview",
        topic: "tpm",
        company: "amazon",
        difficulty: "medium",
        roles: ["program-management", "engineering-management", "product-management"],
        timeLimit: 7,
        tips: ["Use the STAR method", "Focus on stakeholder alignment", "Highlight trade-off decisions"],
        optimalAnswer: "I organized stakeholder alignment meetings, created a shared timeline with dependencies, and established regular check-ins. I worked with each team to identify critical path items and negotiated a phased delivery approach that met everyone's core needs.",
        isPopular: true,
      },
      {
        title: "How would you approach building a recommendation system for a streaming platform?",
        description: "Design a high-level approach for building a recommendation system that serves millions of users with diverse content preferences.",
        category: "case-study",
        topic: "pm",
        company: "netflix",
        difficulty: "medium",
        roles: ["product-management", "engineering-management"],
        timeLimit: 10,
        tips: ["Consider different user segments", "Think about data sources", "Address cold start problems"],
        optimalAnswer: "I'd start with user behavior data, implement collaborative filtering, add content-based features, use A/B testing for optimization, and create fallback strategies for new users.",
        isPopular: true,
      },
      {
        title: "How do you handle technical debt in a fast-growing engineering team?",
        description: "Your engineering team is growing rapidly but technical debt is slowing down feature development. How do you address this?",
        category: "mock-interview",
        topic: "engineering-management",
        company: "meta",
        difficulty: "medium",
        roles: ["engineering-management", "program-management"],
        timeLimit: 8,
        tips: ["Balance feature work with technical improvements", "Quantify impact", "Get stakeholder buy-in"],
        optimalAnswer: "I'd assess and categorize technical debt by impact, allocate 20-30% of sprint capacity to debt reduction, track metrics, and communicate business impact to stakeholders.",
        isPopular: true,
      },
      // Hard Questions - Advanced Scenarios
      {
        title: "Walk me through how you would reduce the latency of Google Search by 200ms",
        description: "Google Search currently has an average latency of 400ms. How would you approach reducing this by 200ms while maintaining quality?",
        category: "case-study",
        topic: "tpm",
        company: "google",
        difficulty: "hard",
        roles: ["program-management", "engineering-management"],
        timeLimit: 15,
        tips: ["Think systematically about the pipeline", "Consider measurement and monitoring", "Address both technical and product trade-offs"],
        optimalAnswer: "I'd analyze the search pipeline, identify bottlenecks through measurement, implement optimizations in phases (frontend caching, backend algorithms, infrastructure), and monitor quality metrics throughout the process.",
        isPopular: true,
      },
      {
        title: "Design Oracle's next-generation cloud database architecture",
        description: "Oracle wants to build a globally distributed database that can handle 100M+ transactions per second. Design the architecture and implementation strategy.",
        category: "case-study",
        topic: "engineering-management",
        company: "oracle",
        difficulty: "hard",
        roles: ["engineering-management", "program-management"],
        timeLimit: 20,
        tips: ["Consider consistency vs availability trade-offs", "Think about data partitioning", "Address disaster recovery"],
        optimalAnswer: "I'd design a multi-region architecture with sharding, implement eventual consistency with conflict resolution, use RAFT consensus for critical operations, and build comprehensive monitoring.",
        isPopular: true,
      },
      {
        title: "How would you scale Cisco's networking infrastructure to support 10x traffic growth?",
        description: "Cisco's current networking products need to handle 10x more traffic within 2 years. Design a comprehensive scaling strategy.",
        category: "case-study",
        topic: "tpm",
        company: "cisco",
        difficulty: "hard",
        roles: ["program-management", "engineering-management"],
        timeLimit: 18,
        tips: ["Consider hardware and software solutions", "Think about backwards compatibility", "Address cost implications"],
        optimalAnswer: "I'd implement software-defined networking, upgrade hardware with modular architecture, optimize packet processing algorithms, and create migration tools for existing customers.",
        isPopular: true,
      },
      {
        title: "Design a global content delivery system for Adobe Creative Cloud",
        description: "Adobe needs to deliver large creative assets (GB-sized files) to millions of users worldwide with sub-second access times.",
        category: "case-study",
        topic: "pm",
        company: "adobe",
        difficulty: "hard",
        roles: ["product-management", "engineering-management"],
        timeLimit: 16,
        tips: ["Consider global distribution", "Think about caching strategies", "Address bandwidth optimization"],
        optimalAnswer: "I'd build a multi-tier CDN with intelligent caching, implement delta compression for updates, use predictive pre-loading, and optimize for different network conditions.",
        isPopular: true,
      },
      {
        title: "How would you manage the launch of a new NVIDIA GPU architecture?",
        description: "NVIDIA is launching a revolutionary new GPU architecture. Coordinate the product launch across hardware, software, and partner ecosystems.",
        category: "mock-interview",
        topic: "pm",
        company: "nvidia",
        difficulty: "hard",
        roles: ["product-management", "program-management"],
        timeLimit: 12,
        tips: ["Coordinate multiple teams", "Consider supply chain", "Think about developer adoption"],
        optimalAnswer: "I'd create a phased launch plan with early access for key partners, coordinate driver development, manage supply chain logistics, and build developer education programs.",
        isPopular: true,
      },
      {
        title: "Design Salesforce's AI-powered sales prediction system",
        description: "Salesforce wants to build an AI system that predicts sales outcomes with 95% accuracy. Design the product strategy and technical approach.",
        category: "case-study",
        topic: "pm",
        company: "salesforce",
        difficulty: "hard",
        roles: ["product-management", "engineering-management"],
        timeLimit: 14,
        tips: ["Consider data sources", "Think about model training", "Address privacy concerns"],
        optimalAnswer: "I'd gather CRM data, build ML pipelines with feature engineering, implement real-time prediction APIs, and create intuitive dashboards with explainable AI features.",
        isPopular: true,
      },

      // PM Questions
      {
        title: "How would you improve user engagement for a social media app?",
        description: "You notice user engagement has dropped 15% over the past month. Walk through your approach to diagnose and address this.",
        category: "mock-interview",
        topic: "pm",
        company: "meta",
        difficulty: "easy",
        timeLimit: 6,
        tips: ["Start with data analysis", "Consider user feedback", "Think about recent changes"],
        optimalAnswer: "I'd first analyze engagement metrics by user segment and feature usage, then investigate recent product changes, conduct user research to understand pain points, and develop targeted solutions based on the root causes identified.",
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
        tips: ["Define success metrics", "Use impact vs effort matrix", "Consider strategic alignment"],
        optimalAnswer: "I'd use an impact vs effort framework, evaluating user value, business impact, and technical complexity. I'd prioritize high-impact, low-effort wins first, then major strategic initiatives, while reserving capacity for urgent fixes.",
        isPopular: true,
      },
      {
        title: "Design a new feature for Amazon Prime Video",
        description: "Design a feature that would increase user retention for Amazon Prime Video. Walk through your entire process.",
        category: "case-study",
        topic: "pm",
        company: "amazon",
        difficulty: "medium",
        timeLimit: 12,
        tips: ["Start with user research", "Define the problem clearly", "Consider business metrics"],
        optimalAnswer: "I'd identify retention pain points through data analysis and user research, design a personalized watchlist feature with smart recommendations, create an MVP with key metrics, and plan iterative improvements based on user feedback.",
        isPopular: true,
      },

      // Project Management Questions
      {
        title: "How do you manage scope creep in agile projects?",
        description: "Describe your approach to handling scope creep while maintaining team velocity and stakeholder satisfaction.",
        category: "mock-interview",
        topic: "project-management",
        company: "apple",
        difficulty: "easy",
        timeLimit: 5,
        tips: ["Focus on change management process", "Mention stakeholder communication", "Include impact assessment"],
        optimalAnswer: "I establish a clear change management process with impact assessment for new requests, maintain a prioritized backlog, and ensure all scope changes are approved by stakeholders with understanding of timeline and resource implications.",
        isPopular: true,
      },
      {
        title: "Describe how you would handle a project that's 3 weeks behind schedule",
        description: "You're managing a critical product launch that's now 3 weeks behind the original timeline. How do you get back on track?",
        category: "mock-interview",
        topic: "project-management",
        company: "netflix",
        difficulty: "medium",
        timeLimit: 8,
        tips: ["Assess root causes", "Consider timeline vs scope trade-offs", "Focus on stakeholder communication"],
        optimalAnswer: "I'd conduct a thorough analysis of delays, re-evaluate scope vs timeline trade-offs, negotiate with stakeholders on priority features, add resources if possible, and establish more frequent check-ins to prevent future delays.",
        isPopular: true,
      },
      {
        title: "Plan the launch of a new Apple product feature across multiple teams",
        description: "You're responsible for coordinating the launch of a new iPhone feature involving hardware, software, marketing, and retail teams. How do you manage this?",
        category: "case-study",
        topic: "project-management",
        company: "apple",
        difficulty: "hard",
        timeLimit: 15,
        tips: ["Create detailed project plan", "Consider dependencies", "Plan risk mitigation"],
        optimalAnswer: "I'd create a comprehensive project plan mapping all dependencies, establish clear communication channels between teams, set up regular coordination meetings, identify critical path items, and develop contingency plans for potential delays.",
        isPopular: true,
      },

      // Engineering Management Questions
      {
        title: "How do you onboard new engineering team members effectively?",
        description: "Walk through your process for bringing new engineers up to speed on your team.",
        category: "mock-interview",
        topic: "em",
        company: "google",
        difficulty: "easy",
        timeLimit: 6,
        tips: ["Focus on structured approach", "Mention mentorship", "Include feedback loops"],
        optimalAnswer: "I create a structured 30-60-90 day plan with clear milestones, pair new hires with experienced mentors, provide access to documentation and learning resources, and establish regular check-ins for feedback and course correction.",
        isPopular: true,
      },
      {
        title: "How would you handle a conflict between two senior engineers on your team?",
        description: "Two of your most senior engineers strongly disagree on the technical approach for a critical project. How do you resolve this?",
        category: "mock-interview",
        topic: "em",
        company: "amazon",
        difficulty: "medium",
        timeLimit: 7,
        tips: ["Focus on facilitation", "Consider technical and team dynamics", "Mention decision-making process"],
        optimalAnswer: "I'd facilitate a structured discussion where both engineers present their approaches, focus on objective criteria for evaluation, involve relevant stakeholders if needed, and make a clear decision while ensuring both feel heard and understood.",
        isPopular: true,
      },
      {
        title: "Design an engineering culture transformation for a 50-person team",
        description: "You've joined a company as Head of Engineering. The 50-person engineering team has low morale, poor code quality, and slow delivery. How do you transform the culture?",
        category: "case-study",
        topic: "em",
        company: "netflix",
        difficulty: "hard",
        timeLimit: 20,
        tips: ["Assess current state", "Create systematic change plan", "Focus on people and processes"],
        optimalAnswer: "I'd start with listening tours to understand current challenges, establish clear technical standards and review processes, implement regular team feedback mechanisms, invest in professional development, and create visible wins to build momentum for larger cultural changes.",
        isPopular: true,
      },

      // Additional questions for variety
      {
        title: "How would you scale a microservices architecture?",
        description: "Your company is growing rapidly and the current microservices architecture is becoming a bottleneck. How do you scale it?",
        category: "case-study",
        topic: "tpm",
        company: "netflix",
        difficulty: "hard",
        timeLimit: 18,
        tips: ["Consider service boundaries", "Think about data consistency", "Address monitoring and observability"],
        optimalAnswer: "I'd analyze service boundaries and dependencies, implement proper service mesh for communication, establish data consistency patterns, improve monitoring and observability, and create a scaling plan that addresses both technical and organizational aspects.",
        isPopular: false,
      },
      {
        title: "Estimate the market size for food delivery in your city",
        description: "Walk through how you would estimate the total addressable market for food delivery services in your city.",
        category: "case-study",
        topic: "pm",
        company: "uber",
        difficulty: "medium",
        timeLimit: 10,
        tips: ["Use bottom-up approach", "Consider different segments", "Validate assumptions"],
        optimalAnswer: "I'd start with city population, segment by demographics and dining habits, estimate frequency and average order value, consider seasonal variations, and validate with industry benchmarks and competitor analysis.",
        isPopular: false,
      }
    ];

    // Check if questions already exist to prevent duplicates
    const existingQuestions = await storage.getPopularQuestions();
    
    if (existingQuestions.length === 0) {
      // Seed questions only if database is empty
      for (const question of sampleQuestions) {
        await storage.createQuestion(question);
      }
    } else {
      console.log("Questions already exist, skipping seeding to prevent duplicates");
    }

    // Seed prompted questions only if none exist
    const existingPromptedQuestions = await storage.getPromptedQuestions("Program Management", "mid");
    const databaseStorage = storage as any;
    
    if (existingPromptedQuestions.length === 0 && databaseStorage.seedPromptedQuestions) {
      await databaseStorage.seedPromptedQuestions();
    } else if (existingPromptedQuestions.length > 0) {
      console.log("Prompted questions already exist, skipping seeding to prevent duplicates");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}