// Simple script to seed prompted questions
import { storage } from './server/storage.js';

const promptedQuestions = [
  {
    topic: "Technical Program Management",
    experienceLevel: "junior",
    questionPrompt: "Describe how you would coordinate a simple feature rollout across frontend and backend teams.",
    context: "Tests basic coordination and communication skills",
    suggestedStructure: "Use STAR method focusing on planning and execution",
    keyPoints: ["Team coordination", "Timeline management", "Communication"],
    difficultyLevel: "easy",
    estimatedTime: 8,
    isActive: true
  },
  {
    topic: "Technical Program Management", 
    experienceLevel: "mid",
    questionPrompt: "You're leading a database migration project that affects multiple services. How do you minimize downtime and ensure data integrity?",
    context: "Tests mid-level technical planning and risk management",
    suggestedStructure: "Focus on risk assessment, planning phases, and contingency planning",
    keyPoints: ["Risk management", "Data integrity", "Phased approach", "Rollback plans"],
    difficultyLevel: "medium",
    estimatedTime: 12,
    isActive: true
  },
  {
    topic: "Product Management",
    experienceLevel: "junior", 
    questionPrompt: "How would you gather user feedback for a new feature you're considering?",
    context: "Tests basic user research and feedback collection skills",
    suggestedStructure: "Cover research methods, user segments, and feedback analysis",
    keyPoints: ["User research", "Feedback methods", "Data analysis"],
    difficultyLevel: "easy",
    estimatedTime: 8,
    isActive: true
  },
  {
    topic: "Product Management",
    experienceLevel: "mid",
    questionPrompt: "Your product metrics show declining user engagement. Walk through your investigation and solution approach.",
    context: "Tests analytical thinking and product problem-solving",
    suggestedStructure: "Cover data analysis, hypothesis formation, and solution planning",
    keyPoints: ["Data analysis", "Root cause analysis", "Solution planning", "Metrics tracking"],
    difficultyLevel: "medium", 
    estimatedTime: 10,
    isActive: true
  },
  {
    topic: "Engineering Management",
    experienceLevel: "junior",
    questionPrompt: "One of your team members is consistently missing deadlines. How do you address this?",
    context: "Tests basic people management and performance issues",
    suggestedStructure: "Focus on investigation, communication, and support planning",
    keyPoints: ["Performance management", "Communication", "Support planning"],
    difficultyLevel: "easy",
    estimatedTime: 6,
    isActive: true
  }
];

async function seedPromptedQuestions() {
  console.log('Seeding prompted questions...');
  
  for (const question of promptedQuestions) {
    try {
      await storage.createPromptedQuestion(question);
      console.log(`Created: ${question.topic} - ${question.experienceLevel}`);
    } catch (error) {
      console.error(`Error creating question: ${error.message}`);
    }
  }
  
  console.log('Prompted questions seeded successfully!');
}

seedPromptedQuestions().then(() => {
  console.log('Done!');
}).catch(error => {
  console.error('Seeding failed:', error);
});