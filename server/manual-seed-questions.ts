import { storage } from "./storage";

const comprehensiveQuestions = [
  // Microsoft - Product Management
  {
    title: "Design a new feature for Microsoft Teams to improve remote collaboration",
    description: "Microsoft Teams has over 280 million monthly active users. Design a feature to address the challenge of maintaining team cohesion and collaboration effectiveness in hybrid work environments.",
    category: "case-study",
    topic: "pm",
    company: "microsoft",
    difficulty: "medium",
    roles: ["product-management"],
    timeLimit: 12,
    tips: ["Research current Teams pain points", "Consider integration with Office 365", "Think about mobile and desktop experiences", "Address accessibility requirements"],
    optimalAnswer: "I'd design a 'Team Pulse' feature that combines asynchronous check-ins with AI-powered insights. This would include daily mood tracking, project momentum indicators, and smart suggestions for team bonding activities. The feature would integrate with Outlook calendars to suggest optimal meeting times and use Microsoft Graph API to analyze collaboration patterns, helping managers identify team members who might be feeling disconnected.",
    isPopular: true
  },
  {
    title: "How would you prioritize bug fixes vs new features in Azure DevOps?",
    description: "You're the PM for Azure DevOps and have limited engineering resources. Customer satisfaction scores show mixed feedback - enterprise customers want stability while startups want new features.",
    category: "mock-interview",
    topic: "pm",
    company: "microsoft",
    difficulty: "medium",
    roles: ["product-management"],
    timeLimit: 8,
    tips: ["Use data to support decisions", "Consider customer segmentation", "Think about business impact", "Mention risk assessment"],
    optimalAnswer: "I'd establish a prioritization framework based on customer impact, business value, and technical debt. For enterprise customers, I'd allocate 60% of resources to stability and bug fixes, as their contracts have higher revenue impact. For startup customers, I'd dedicate 30% to new features that drive user acquisition. The remaining 10% would go to technical debt reduction. I'd use customer satisfaction metrics, support ticket volume, and churn risk analysis to validate this allocation monthly.",
    isPopular: false
  },

  // Google - Technical Program Management
  {
    title: "Coordinate the launch of a new Google Search ranking algorithm",
    description: "You're leading the rollout of a major Google Search algorithm update that affects how search results are ranked. This involves ML teams, infrastructure, quality raters, and external communications.",
    category: "case-study",
    topic: "tpm",
    company: "google",
    difficulty: "hard",
    roles: ["program-management", "engineering-management"],
    timeLimit: 15,
    tips: ["Consider gradual rollout strategy", "Think about quality monitoring", "Plan for rollback scenarios", "Address external communications"],
    optimalAnswer: "I'd implement a phased rollout strategy starting with 1% of queries in a single geographic region. Phase 1 would focus on technical validation with automated quality metrics and manual review by quality raters. Phase 2 would expand to 5% globally while monitoring for any negative user feedback or publisher concerns. I'd establish real-time dashboards for key metrics like click-through rates, user satisfaction, and query completion rates. A dedicated war room would monitor the rollout 24/7 with clear escalation procedures. External communications would include proactive outreach to webmaster communities and search industry publications.",
    isPopular: true
  },
  {
    title: "How do you manage dependencies across 15 engineering teams for a YouTube feature?",
    description: "You're launching a new YouTube feature that requires changes from mobile apps, web frontend, backend services, content recommendation systems, and creator tools teams.",
    category: "mock-interview",
    topic: "tpm",
    company: "google",
    difficulty: "hard",
    roles: ["program-management"],
    timeLimit: 10,
    tips: ["Create detailed dependency mapping", "Establish clear communication channels", "Plan for buffer time", "Consider critical path analysis"],
    optimalAnswer: "I'd start by creating a comprehensive dependency map using tools like Gantt charts or dependency tracking software. I'd establish weekly sync meetings with tech leads from all 15 teams, focusing on blockers and interdependencies. For critical path items, I'd implement daily standups and use Slack channels for real-time updates. I'd build 20% buffer time into all estimates and create contingency plans for high-risk dependencies. Each team would have clear deliverable definitions and acceptance criteria to prevent scope creep.",
    isPopular: false
  },

  // Amazon - Engineering Management
  {
    title: "Scale an engineering team from 10 to 50 people while maintaining code quality",
    description: "Your AWS service team needs to grow rapidly to meet customer demand. How do you maintain high engineering standards, code quality, and team culture during this expansion?",
    category: "case-study",
    topic: "em",
    company: "amazon",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 12,
    tips: ["Focus on hiring process", "Consider team structure", "Think about code review processes", "Address knowledge transfer"],
    optimalAnswer: "I'd implement a structured scaling approach focusing on three pillars: hiring, process, and culture. For hiring, I'd establish a rigorous interview process with coding assessments, system design questions, and cultural fit evaluation. I'd create sub-teams of 6-8 engineers with senior leads to maintain accountability. For code quality, I'd implement automated testing requirements (80% coverage minimum), mandatory code reviews with two approvals, and regular architecture reviews. I'd establish mentorship programs pairing new hires with senior engineers and create comprehensive onboarding documentation. Monthly all-hands meetings would maintain team alignment and culture.",
    isPopular: true
  },
  {
    title: "Handle a production outage affecting 50% of Prime Video streaming",
    description: "Prime Video is experiencing degraded performance affecting 50% of users during peak hours. Multiple teams are involved and customer complaints are escalating rapidly.",
    category: "mock-interview",
    topic: "em",
    company: "amazon",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 8,
    tips: ["Focus on incident response process", "Consider communication strategy", "Think about root cause analysis", "Address prevention measures"],
    optimalAnswer: "I'd immediately activate our incident response protocol. First, I'd establish a war room with representatives from infrastructure, content delivery, and frontend teams. I'd designate an incident commander to coordinate response while I handle external communications. We'd implement emergency traffic routing to healthy servers and activate our CDN failover systems. I'd ensure hourly customer communications through social media and status pages. Post-incident, I'd conduct a blameless post-mortem to identify root causes and implement preventive measures like improved monitoring and automated failover systems.",
    isPopular: false
  },

  // Meta - Product Management
  {
    title: "Design a feature to combat misinformation on Facebook",
    description: "Facebook faces ongoing challenges with misinformation spread. Design a product solution that balances free speech principles with the need to reduce harmful false information.",
    category: "case-study",
    topic: "pm",
    company: "meta",
    difficulty: "hard",
    roles: ["product-management"],
    timeLimit: 15,
    tips: ["Consider multiple stakeholder perspectives", "Think about algorithmic solutions", "Address user education", "Consider global implications"],
    optimalAnswer: "I'd design a multi-layered approach combining AI detection, human review, and user empowerment. The solution would include: 1) AI models trained to identify potentially false content based on source credibility, engagement patterns, and fact-checker databases, 2) A user reporting system with community-based verification similar to Wikipedia's model, 3) Content labeling with context from authoritative sources rather than removal, 4) Algorithm adjustments to reduce viral spread of flagged content while preserving organic reach for verified information. The system would be transparent about its decision-making process and include appeals mechanisms.",
    isPopular: true
  },
  {
    title: "Improve Instagram Reels engagement by 25% in 6 months",
    description: "Instagram Reels engagement has plateaued. TikTok continues to gain market share among Gen Z users. How would you increase Reels engagement by 25% within 6 months?",
    category: "mock-interview",
    topic: "pm",
    company: "meta",
    difficulty: "medium",
    roles: ["product-management"],
    timeLimit: 10,
    tips: ["Analyze current engagement metrics", "Consider creator incentives", "Think about discovery improvements", "Address user experience gaps"],
    optimalAnswer: "I'd focus on three key areas: creator tools, discovery algorithm, and user experience. For creators, I'd introduce advanced editing features like AI-powered background replacement and trending audio suggestions. I'd launch a creator fund to incentivize high-quality content. For discovery, I'd improve the algorithm to better surface relevant content based on user interests and engagement history. For UX, I'd streamline the sharing process and add interactive features like polls and Q&A stickers. I'd A/B test each change and use engagement metrics, time spent, and creator retention as key success indicators.",
    isPopular: false
  },

  // Apple - Engineering Management
  {
    title: "Lead the privacy-focused redesign of iOS location services",
    description: "Apple is redesigning iOS location services to provide even stronger privacy protections while maintaining app functionality. Coordinate across hardware, software, and security teams.",
    category: "case-study",
    topic: "em",
    company: "apple",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 12,
    tips: ["Consider hardware implications", "Think about developer impact", "Address user experience", "Plan for security auditing"],
    optimalAnswer: "I'd establish a cross-functional team including hardware engineers for secure enclave integration, iOS engineers for system-level changes, security engineers for threat modeling, and developer relations for third-party app impact. The technical approach would involve on-device processing using the neural engine, differential privacy for analytics, and granular permission controls. I'd create a developer preview program to gather feedback and ensure app compatibility. The rollout would be phased across iOS versions with clear communication about privacy benefits to users. Security audits would be conducted by external firms to validate our privacy claims.",
    isPopular: true
  },

  // Netflix - Technical Program Management
  {
    title: "Coordinate Netflix's expansion to 15 new countries including content localization",
    description: "Netflix wants to expand to 15 new countries across Asia and Africa. This requires content licensing, UI localization, payment integration, and content delivery network expansion.",
    category: "case-study",
    topic: "tpm",
    company: "netflix",
    difficulty: "hard",
    roles: ["program-management"],
    timeLimit: 15,
    tips: ["Consider regulatory requirements", "Think about content strategy", "Address technical infrastructure", "Plan for market research"],
    optimalAnswer: "I'd create a program with four parallel workstreams: Legal & Compliance (licensing agreements, local regulations), Content Strategy (local content acquisition, dubbing/subtitling), Technical Infrastructure (CDN deployment, payment gateways), and Localization (UI translation, cultural adaptation). Each country would have a dedicated country manager working with regional teams. The technical rollout would follow a hub-and-spoke model with regional data centers. I'd establish partnerships with local payment providers and telecommunications companies. The timeline would be 12-18 months with pilot launches in 3 countries first to validate the approach before full expansion.",
    isPopular: false
  },

  // Oracle - Product Management
  {
    title: "Design Oracle's next-generation cloud database migration tool",
    description: "Enterprise customers struggle with migrating legacy databases to Oracle Cloud. Design a product that simplifies this process while ensuring data integrity and minimal downtime.",
    category: "case-study",
    topic: "pm",
    company: "oracle",
    difficulty: "medium",
    roles: ["product-management"],
    timeLimit: 12,
    tips: ["Consider enterprise requirements", "Think about risk mitigation", "Address different database types", "Plan for support and training"],
    optimalAnswer: "I'd design an intelligent migration platform with three components: Assessment Engine (analyzes source databases and identifies compatibility issues), Migration Orchestrator (handles data transfer with real-time validation), and Monitoring Dashboard (tracks progress and performance). The tool would support major database platforms (SQL Server, MySQL, PostgreSQL) and include automated schema conversion, data validation checksums, and rollback capabilities. For minimal downtime, I'd implement change data capture for near real-time synchronization. The product would include migration planning wizards, cost estimation tools, and 24/7 expert support during critical migration windows.",
    isPopular: true
  },

  // Cisco - Engineering Management
  {
    title: "Modernize Cisco's networking hardware development process",
    description: "Cisco's hardware development cycles are too slow compared to software-defined networking competitors. How would you accelerate development while maintaining reliability standards?",
    category: "mock-interview",
    topic: "em",
    company: "cisco",
    difficulty: "medium",
    roles: ["engineering-management"],
    timeLimit: 10,
    tips: ["Consider hardware vs software development differences", "Think about testing requirements", "Address supply chain factors", "Focus on process improvements"],
    optimalAnswer: "I'd implement an agile hardware development approach combining rapid prototyping with rigorous testing. Key changes would include: 1) Modular hardware design allowing parallel development of components, 2) Early software simulation and emulation to catch issues before physical prototypes, 3) Continuous integration pipelines for firmware and software components, 4) Risk-based testing strategies focusing on critical network reliability scenarios, 5) Supplier partnerships for faster component sourcing and qualification. I'd establish cross-functional teams including hardware, firmware, and software engineers working in 6-week sprints with regular customer feedback cycles.",
    isPopular: false
  },

  // Salesforce - Product Management
  {
    title: "Design Salesforce's AI-powered sales forecasting feature",
    description: "Sales teams struggle with accurate forecasting. Design an AI feature that helps sales managers predict quarterly results while providing actionable insights for deal closure.",
    category: "case-study",
    topic: "pm",
    company: "salesforce",
    difficulty: "medium",
    roles: ["product-management"],
    timeLimit: 12,
    tips: ["Consider data privacy", "Think about accuracy vs interpretability", "Address different sales methodologies", "Plan for integration with existing workflows"],
    optimalAnswer: "I'd design 'Einstein Forecast Pro' that analyzes historical deal data, rep performance, customer engagement patterns, and external market signals. The AI would provide three forecast scenarios (conservative, likely, optimistic) with confidence intervals and key influencing factors. Features would include deal risk scoring, recommended actions for at-risk deals, and automated pipeline health reports. The system would integrate with email, calendar, and call data to track customer engagement momentum. For transparency, the AI would explain its predictions using natural language summaries, helping sales managers understand and trust the forecasts.",
    isPopular: true
  },

  // Adobe - Technical Program Management
  {
    title: "Coordinate the Creative Cloud integration of a newly acquired AI company",
    description: "Adobe acquired an AI startup with breakthrough image generation technology. Integrate their technology into Creative Cloud while maintaining performance and user experience standards.",
    category: "case-study",
    topic: "tpm",
    company: "adobe",
    difficulty: "hard",
    roles: ["program-management"],
    timeLimit: 15,
    tips: ["Consider integration challenges", "Think about user adoption", "Address performance requirements", "Plan for support and documentation"],
    optimalAnswer: "I'd establish a 12-month integration program with three phases: Technical Integration (API development, performance optimization), Product Integration (UI/UX design, workflow integration), and Market Launch (training, documentation, marketing). Phase 1 would focus on creating stable APIs and optimizing AI model performance for Creative Cloud's scale. Phase 2 would integrate the technology into Photoshop and Illustrator with intuitive user interfaces. Phase 3 would include comprehensive user training, updated documentation, and a marketing campaign highlighting the new capabilities. I'd maintain weekly cross-team syncs and use customer beta feedback to guide development priorities.",
    isPopular: false
  },

  // NVIDIA - Engineering Management
  {
    title: "Lead the development of NVIDIA's next-generation AI training chip",
    description: "NVIDIA needs to maintain its leadership in AI training hardware. Lead a team developing the next-generation GPU architecture optimized for large language model training.",
    category: "case-study",
    topic: "em",
    company: "nvidia",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 15,
    tips: ["Consider AI workload requirements", "Think about power efficiency", "Address manufacturing constraints", "Plan for software ecosystem"],
    optimalAnswer: "I'd organize teams around three pillars: Architecture (chip design, memory optimization), Software Stack (drivers, CUDA libraries, ML frameworks), and Validation (testing, benchmarking). The technical approach would focus on increased tensor processing units, improved memory bandwidth, and enhanced multi-GPU communication. I'd establish partnerships with major AI companies for early feedback and validation. The development process would include extensive simulation and modeling before tape-out, with regular reviews by external AI researchers. I'd ensure the software ecosystem evolves in parallel, including optimized libraries for popular ML frameworks like PyTorch and TensorFlow.",
    isPopular: true
  },

  // Additional questions for better coverage across difficulties and topics

  // Easy Level Questions
  {
    title: "How do you prioritize features when you have limited development resources?",
    description: "You're a PM with 5 engineers and 20 feature requests from different stakeholders. Walk me through your prioritization process.",
    category: "mock-interview",
    topic: "pm",
    company: "google",
    difficulty: "easy",
    roles: ["product-management"],
    timeLimit: 6,
    tips: ["Use a prioritization framework", "Consider stakeholder input", "Think about business impact", "Mention user research"],
    optimalAnswer: "I'd use a prioritization framework like RICE (Reach, Impact, Confidence, Effort) to evaluate each feature request. I'd gather quantitative data on user demand through analytics and qualitative insights through user interviews. I'd consider business objectives, technical feasibility, and resource requirements. I'd communicate the prioritization rationale to stakeholders and create a roadmap with clear timelines and success metrics.",
    isPopular: true
  },
  {
    title: "Describe how you would handle a team member who consistently misses deadlines",
    description: "One of your engineers has missed 3 deadlines in the past month, affecting the overall project timeline. How do you address this situation?",
    category: "mock-interview",
    topic: "em",
    company: "amazon",
    difficulty: "easy",
    roles: ["engineering-management"],
    timeLimit: 6,
    tips: ["Focus on understanding root causes", "Mention documentation", "Consider support options", "Think about team impact"],
    optimalAnswer: "I'd start with a private one-on-one conversation to understand the root causes - whether it's technical challenges, personal issues, or workload problems. I'd review their current tasks to ensure realistic expectations and provide additional support if needed, such as mentoring or training. I'd document our discussion and create a clear improvement plan with specific milestones. If the pattern continues, I'd escalate to HR while continuing to provide support to help them succeed.",
    isPopular: false
  },
  {
    title: "How do you ensure effective communication in a cross-functional project?",
    description: "You're leading a project involving engineering, design, marketing, and legal teams. How do you keep everyone aligned and informed?",
    category: "mock-interview",
    topic: "tpm",
    company: "microsoft",
    difficulty: "easy",
    roles: ["program-management"],
    timeLimit: 6,
    tips: ["Establish regular meeting cadence", "Use collaboration tools", "Create clear documentation", "Define communication protocols"],
    optimalAnswer: "I'd establish a regular communication cadence with weekly project standups and monthly stakeholder reviews. I'd use collaboration tools like Slack for daily updates and project management software for tracking progress. I'd create a central repository for project documentation including requirements, timelines, and decisions. I'd define clear escalation procedures and ensure each team has a designated point of contact. Regular one-on-ones with team leads would help identify and resolve issues early.",
    isPopular: true
  }
];

export async function seedComprehensiveQuestions() {
  console.log("Starting comprehensive question seeding...");
  let successCount = 0;
  let errorCount = 0;

  for (const question of comprehensiveQuestions) {
    try {
      await storage.createQuestion(question);
      successCount++;
      console.log(`✓ Added: ${question.title}`);
    } catch (error) {
      console.error(`✗ Failed to add: ${question.title}`, error);
      errorCount++;
    }
  }

  console.log(`\nSeeding complete!`);
  console.log(`Successfully added: ${successCount} questions`);
  console.log(`Errors: ${errorCount}`);
  
  return { successCount, errorCount };
}

// Run the seeding
seedComprehensiveQuestions().then(() => {
  console.log("Question seeding finished");
}).catch(error => {
  console.error("Seeding failed:", error);
});