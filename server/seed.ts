import { storage } from "./storage";

export async function seedDatabase() {
  console.log("Seeding database with sample data...");
  
  try {
    // Seed comprehensive questions covering all categories
    const sampleQuestions = [
      // TPM Questions - Easy
      {
        title: "How do you handle team communication in a remote environment?",
        description: "Describe your approach to maintaining effective communication with distributed engineering teams.",
        category: "mock-interview",
        topic: "tpm",
        company: "meta",
        difficulty: "easy",
        timeLimit: 5,
        tips: ["Focus on tools and processes", "Mention async communication", "Include regular sync points"],
        optimalAnswer: "I establish clear communication channels using tools like Slack for async updates, weekly team meetings for alignment, and documentation in shared spaces. I ensure time zone coverage and set response time expectations.",
        isPopular: true,
      },
      {
        title: "Describe a time when you had to manage a cross-functional project with competing priorities",
        description: "Tell me about a situation where you had to manage a cross-functional project with competing priorities. How did you align stakeholders and ensure successful delivery?",
        category: "mock-interview",
        topic: "tpm",
        company: "meta",
        difficulty: "medium",
        timeLimit: 7,
        tips: ["Use the STAR method", "Focus on stakeholder alignment", "Highlight trade-off decisions"],
        optimalAnswer: "I organized stakeholder alignment meetings, created a shared timeline with dependencies, and established regular check-ins. I worked with each team to identify critical path items and negotiated a phased delivery approach that met everyone's core needs.",
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
        tips: ["Think systematically about the pipeline", "Consider measurement and monitoring", "Address both technical and product trade-offs"],
        optimalAnswer: "I'd analyze the search pipeline, identify bottlenecks through measurement, implement optimizations in phases (frontend caching, backend algorithms, infrastructure), and monitor quality metrics throughout the process.",
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

    // Seed questions
    for (const question of sampleQuestions) {
      await storage.createQuestion(question);
    }

    // Seed prompted questions
    const databaseStorage = storage as any;
    if (databaseStorage.seedPromptedQuestions) {
      await databaseStorage.seedPromptedQuestions();
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}