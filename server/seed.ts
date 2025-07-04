import { storage } from "./storage";

export async function seedDatabase() {
  console.log("Seeding database with sample data...");
  
  try {
    // Seed sample questions
    const sampleQuestions = [
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