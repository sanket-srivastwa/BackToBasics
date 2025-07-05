import { storage } from "./storage";

const additionalQuestions = [
  // Microsoft - Technical Program Management
  {
    title: "Manage the integration of GitHub and Azure DevOps workflows",
    description: "Microsoft needs to better integrate GitHub and Azure DevOps to provide seamless developer experiences. Coordinate across multiple engineering teams to deliver this integration.",
    category: "case-study",
    topic: "tpm",
    company: "microsoft",
    difficulty: "hard",
    roles: ["program-management"],
    timeLimit: 15,
    tips: ["Consider developer workflow differences", "Think about data synchronization", "Address security requirements", "Plan for gradual migration"],
    optimalAnswer: "I'd establish a cross-functional team including GitHub engineering, Azure DevOps teams, and security specialists. The integration would focus on three key areas: unified authentication using Azure AD, bidirectional sync of work items and pull requests, and shared CI/CD pipelines. I'd implement a phased rollout starting with Microsoft internal teams as early adopters, then expanding to enterprise customers. The technical approach would use GraphQL APIs for real-time sync and webhook-based notifications for instant updates.",
    isPopular: true
  },

  // Google - Product Management  
  {
    title: "Launch Google Pay in 5 emerging markets with different banking regulations",
    description: "Google wants to expand Google Pay to India, Brazil, Nigeria, Indonesia, and Vietnam. Each market has unique banking regulations, payment preferences, and technical infrastructure challenges.",
    category: "case-study",
    topic: "pm",
    company: "google",
    difficulty: "hard",
    roles: ["product-management"],
    timeLimit: 15,
    tips: ["Research regulatory requirements", "Consider local payment methods", "Think about partnership strategy", "Address technical infrastructure"],
    optimalAnswer: "I'd create a market-specific approach for each country while maintaining a unified product foundation. For India, I'd integrate with UPI and partner with local banks. For Brazil, I'd focus on PIX integration and QR code payments. For Nigeria, I'd emphasize mobile money integration with telecoms. The technical architecture would use a regional API gateway approach with country-specific compliance modules. I'd establish local partnerships for regulatory approval and create market-specific user experiences while maintaining Google's security and privacy standards.",
    isPopular: false
  },

  // Amazon - Project Management
  {
    title: "Coordinate the launch of a new AWS region in Southeast Asia",
    description: "AWS is launching a new region in Thailand to serve Southeast Asian customers. This involves data center construction, regulatory compliance, and service migration.",
    category: "case-study",
    topic: "project-management",
    company: "amazon",
    difficulty: "hard",
    roles: ["program-management", "project-management"],
    timeLimit: 18,
    tips: ["Consider regulatory requirements", "Think about infrastructure deployment", "Address customer migration", "Plan for service availability"],
    optimalAnswer: "I'd manage this as an 18-month program with four workstreams: Infrastructure (data center build-out, network connectivity), Compliance (regulatory approvals, data sovereignty), Services (AWS service deployment and testing), and Customer Success (migration support, training). The critical path would focus on regulatory approvals and physical infrastructure. I'd establish local partnerships for compliance and create customer communication plans 6 months before launch. The technical deployment would follow AWS's established playbook with region-specific customizations for local requirements.",
    isPopular: true
  },

  // Meta - Engineering Management
  {
    title: "Lead the development of WhatsApp's end-to-end encrypted backup system",
    description: "WhatsApp needs to implement end-to-end encrypted backups while maintaining user experience and supporting billions of users across different platforms.",
    category: "case-study",
    topic: "em",
    company: "meta",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 12,
    tips: ["Consider cryptographic requirements", "Think about scale challenges", "Address user experience", "Plan for key management"],
    optimalAnswer: "I'd organize teams around three technical challenges: Client-side encryption (mobile apps, key derivation), Cloud infrastructure (encrypted storage, key management), and User experience (backup/restore flows, key recovery). The architecture would use client-side key derivation with user passwords, ensuring Meta never has access to decryption keys. I'd implement progressive rollout starting with power users and gradual expansion based on infrastructure capacity. The system would include robust key recovery mechanisms and seamless cross-platform synchronization.",
    isPopular: false
  },

  // Apple - Product Management
  {
    title: "Design Apple's enterprise device management solution for remote work",
    description: "With increased remote work, enterprises need better ways to manage company-owned Apple devices. Design a comprehensive enterprise solution that maintains Apple's privacy principles.",
    category: "case-study",
    topic: "pm",
    company: "apple",
    difficulty: "medium",
    roles: ["product-management"],
    timeLimit: 12,
    tips: ["Consider enterprise IT requirements", "Think about privacy implications", "Address security needs", "Plan for different device types"],
    optimalAnswer: "I'd design an integrated solution combining enhanced MDM capabilities with privacy-preserving device management. Key features would include zero-touch deployment, automated policy enforcement, and secure remote troubleshooting. The solution would separate corporate and personal data using secure containers while maintaining user privacy for personal activities. I'd integrate with existing enterprise identity systems and provide comprehensive analytics for IT administrators. The approach would leverage Apple's existing Device Enrollment Program and expand it with remote-work specific capabilities.",
    isPopular: true
  },

  // Oracle - Engineering Management
  {
    title: "Modernize Oracle Database's query optimizer using machine learning",
    description: "Oracle Database's query optimizer hasn't been significantly updated in years. Lead an engineering effort to integrate machine learning while maintaining backward compatibility.",
    category: "case-study",
    topic: "em",
    company: "oracle",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 15,
    tips: ["Consider database performance impact", "Think about customer migration", "Address machine learning operations", "Plan for extensive testing"],
    optimalAnswer: "I'd establish a specialized team combining database engineers with ML specialists. The approach would implement ML-enhanced cost estimation alongside traditional rule-based optimization, allowing gradual adoption. Phase 1 would focus on workload pattern analysis and cost model improvements. Phase 2 would introduce adaptive query optimization based on historical performance. The system would include extensive A/B testing infrastructure and automatic fallback to traditional optimization when ML confidence is low. Customer adoption would be opt-in with comprehensive performance monitoring.",
    isPopular: false
  },

  // Netflix - Engineering Management
  {
    title: "Scale Netflix's content recommendation system for 500M global users",
    description: "Netflix's recommendation system needs to handle growing user base while improving personalization accuracy. Lead the engineering effort to scale and enhance the platform.",
    category: "case-study",
    topic: "em",
    company: "netflix",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 12,
    tips: ["Consider real-time processing needs", "Think about global content differences", "Address ML model training scale", "Plan for A/B testing infrastructure"],
    optimalAnswer: "I'd redesign the architecture around three pillars: Real-time inference (edge computing, model serving), Batch processing (large-scale ML training, feature engineering), and Experimentation platform (A/B testing, performance monitoring). The technical approach would use microservices for different recommendation algorithms, allowing independent scaling and updates. I'd implement global content localization with region-specific models while maintaining shared learning across markets. The infrastructure would leverage Kubernetes for auto-scaling and include comprehensive monitoring for recommendation quality metrics.",
    isPopular: true
  },

  // Cisco - Product Management
  {
    title: "Design Cisco's software-defined networking solution for 5G networks",
    description: "Telecom operators need software-defined networking solutions optimized for 5G infrastructure. Design a product that competes with cloud providers while leveraging Cisco's hardware expertise.",
    category: "case-study",
    topic: "pm",
    company: "cisco",
    difficulty: "hard",
    roles: ["product-management"],
    timeLimit: 15,
    tips: ["Consider 5G technical requirements", "Think about telecom operator needs", "Address competitive landscape", "Plan for standards compliance"],
    optimalAnswer: "I'd design a comprehensive SDN platform with three components: Network Function Virtualization (NFV) for 5G core functions, Edge computing integration for low-latency applications, and Central orchestration for network management. The solution would combine Cisco's hardware with cloud-native software, offering hybrid deployment options. Key differentiators would include specialized 5G optimization, integration with existing Cisco infrastructure, and enterprise-grade security. The go-to-market strategy would focus on partnerships with major telecom operators and gradual migration from existing 4G infrastructure.",
    isPopular: false
  },

  // Salesforce - Engineering Management
  {
    title: "Lead Salesforce's transition to a microservices architecture",
    description: "Salesforce's monolithic architecture is limiting development velocity. Lead the engineering effort to transition to microservices while maintaining service reliability for millions of users.",
    category: "case-study",
    topic: "em",
    company: "salesforce",
    difficulty: "hard",
    roles: ["engineering-management"],
    timeLimit: 15,
    tips: ["Consider service boundaries", "Think about data consistency", "Address deployment complexity", "Plan for gradual migration"],
    optimalAnswer: "I'd implement a gradual strangler pattern migration over 24 months. Phase 1 would identify service boundaries based on business capabilities (leads, opportunities, accounts). Phase 2 would extract high-value, low-risk services first. The technical approach would use event-driven architecture for service communication and implement distributed tracing for debugging. I'd establish service ownership model with dedicated teams for each microservice. The migration would include comprehensive monitoring, automated testing, and gradual traffic shifting to ensure zero customer impact.",
    isPopular: true
  },

  // Adobe - Product Management
  {
    title: "Design Adobe's AI-powered video editing assistant for Creative Cloud",
    description: "Video content creation is exploding, but editing remains complex and time-consuming. Design an AI assistant that makes video editing accessible to non-professionals while serving creative professionals.",
    category: "case-study",
    topic: "pm",
    company: "adobe",
    difficulty: "medium",
    roles: ["product-management"],
    timeLimit: 12,
    tips: ["Consider different user segments", "Think about AI capabilities", "Address creative control", "Plan for integration with existing tools"],
    optimalAnswer: "I'd design a tiered AI assistant with three modes: Auto-Edit (fully automated editing for beginners), Assisted Edit (AI suggestions with user control), and Pro Tools (AI-enhanced manual editing). The AI would analyze video content for scene detection, audio quality, and visual composition. Key features would include automatic highlight reel generation, intelligent audio ducking, and style transfer from reference videos. The assistant would integrate seamlessly with Premiere Pro and After Effects while offering a simplified interface for new users. The business model would include usage-based pricing for AI processing.",
    isPopular: false
  },

  // NVIDIA - Technical Program Management
  {
    title: "Coordinate NVIDIA's AI chip deployment across autonomous vehicle partners",
    description: "NVIDIA's automotive partners need customized AI chip configurations for their autonomous vehicle platforms. Coordinate hardware and software delivery across multiple automotive manufacturers.",
    category: "case-study",
    topic: "tpm",
    company: "nvidia",
    difficulty: "hard",
    roles: ["program-management"],
    timeLimit: 15,
    tips: ["Consider automotive industry timelines", "Think about safety requirements", "Address customization needs", "Plan for long-term support"],
    optimalAnswer: "I'd establish partner-specific program tracks for each automotive manufacturer while maintaining common platform components. The program would coordinate Hardware engineering (chip customization, thermal design), Software stack (AI inference optimization, safety certification), and Integration support (partner enablement, testing validation). Each partner would have dedicated liaison engineers and customized delivery timelines aligned with vehicle production schedules. The approach would use modular architecture allowing partner-specific customization while maintaining common software foundation and update mechanisms.",
    isPopular: true
  },

  // Easy and Medium level questions for better balance

  {
    title: "How would you gather user feedback for a new feature?",
    description: "You're launching a new feature in your product and want to understand user sentiment and usage patterns. Describe your approach to collecting and analyzing feedback.",
    category: "mock-interview",
    topic: "pm",
    company: "meta",
    difficulty: "easy",
    roles: ["product-management"],
    timeLimit: 6,
    tips: ["Consider multiple feedback channels", "Think about quantitative and qualitative data", "Address timing of feedback collection", "Plan for iterative improvements"],
    optimalAnswer: "I'd implement a multi-channel feedback approach including in-app surveys, user interviews, analytics tracking, and support ticket analysis. For quantitative data, I'd use A/B testing and feature usage metrics. For qualitative insights, I'd conduct user interviews and analyze support conversations. I'd establish feedback collection at key user journey points and create a systematic process for analyzing and prioritizing feedback for future iterations.",
    isPopular: true
  },

  {
    title: "Describe your approach to onboarding a new team member",
    description: "A senior engineer is joining your team next week. Walk me through your onboarding process to help them become productive quickly.",
    category: "mock-interview",
    topic: "em",
    company: "google",
    difficulty: "easy",
    roles: ["engineering-management"],
    timeLimit: 6,
    tips: ["Focus on structured approach", "Mention documentation", "Consider mentorship", "Think about gradual responsibility increase"],
    optimalAnswer: "I'd create a structured 30-60-90 day onboarding plan. Week 1 would focus on environment setup, codebase overview, and team introductions. I'd assign a mentor for technical guidance and provide comprehensive documentation including architecture diagrams and coding standards. Weeks 2-4 would involve progressively complex tasks starting with bug fixes and small features. I'd schedule regular check-ins to address questions and adjust the plan based on their progress and feedback.",
    isPopular: false
  },

  {
    title: "How do you track and report project progress to stakeholders?",
    description: "You're managing a 6-month project with multiple stakeholders who need regular updates. Describe your approach to progress tracking and communication.",
    category: "mock-interview",
    topic: "tpm",
    company: "amazon",
    difficulty: "medium",
    roles: ["program-management"],
    timeLimit: 8,
    tips: ["Consider different stakeholder needs", "Think about metrics and KPIs", "Address risk communication", "Plan for regular cadence"],
    optimalAnswer: "I'd establish a multi-tiered reporting structure with daily team standups, weekly stakeholder updates, and monthly executive summaries. I'd use project management tools to track milestones, risks, and dependencies with real-time dashboards. For stakeholders, I'd provide role-specific reports focusing on their concerns - executives get high-level status and risks, while technical stakeholders get detailed progress metrics. I'd include trend analysis, upcoming milestones, and proactive risk mitigation plans in all communications.",
    isPopular: true
  },

  {
    title: "How would you improve team productivity without increasing headcount?",
    description: "Your engineering team is struggling to meet delivery commitments, but hiring is frozen. What strategies would you implement to improve productivity?",
    category: "mock-interview",
    topic: "em",
    company: "apple",
    difficulty: "medium",
    roles: ["engineering-management"],
    timeLimit: 8,
    tips: ["Focus on process improvements", "Consider automation opportunities", "Think about skill development", "Address team morale"],
    optimalAnswer: "I'd focus on three areas: process optimization, automation, and skill development. I'd analyze current workflows to eliminate bottlenecks and implement continuous integration/deployment to reduce manual work. I'd invest in training to upskill team members and improve code review processes to catch issues earlier. I'd also examine meeting overhead and implement focused work time blocks. Additionally, I'd address any team morale issues that might be impacting productivity through better recognition and clear career development paths.",
    isPopular: false
  }
];

export async function seedAdditionalQuestions() {
  console.log("Starting additional question seeding...");
  let successCount = 0;
  let errorCount = 0;

  for (const question of additionalQuestions) {
    try {
      await storage.createQuestion(question);
      successCount++;
      console.log(`✓ Added: ${question.title}`);
    } catch (error) {
      console.error(`✗ Failed to add: ${question.title}`, error);
      errorCount++;
    }
  }

  console.log(`\nAdditional seeding complete!`);
  console.log(`Successfully added: ${successCount} questions`);
  console.log(`Errors: ${errorCount}`);
  
  return { successCount, errorCount };
}

// Run the seeding
seedAdditionalQuestions().then(() => {
  console.log("Additional question seeding finished");
}).catch(error => {
  console.error("Additional seeding failed:", error);
});