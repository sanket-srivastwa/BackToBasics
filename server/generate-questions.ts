import OpenAI from "openai";
import { storage } from "./storage";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface GeneratedQuestion {
  title: string;
  description: string;
  category: string;
  topic: string;
  company: string;
  difficulty: string;
  roles: string[];
  timeLimit: number;
  tips: string[];
  optimalAnswer: string;
  isPopular: boolean;
}

const companies = [
  "microsoft", "google", "amazon", "meta", "apple", 
  "oracle", "cisco", "salesforce", "adobe", "nvidia", "netflix"
];

const topics = ["pm", "tpm", "em", "project-management"];
const difficulties = ["easy", "medium", "hard"];
const categories = ["mock-interview", "case-study"];

const topicNames = {
  pm: "Product Management",
  tpm: "Technical Program Management", 
  em: "Engineering Management",
  "project-management": "Project Management"
};

const roleMapping = {
  pm: ["product-management"],
  tpm: ["program-management", "engineering-management"],
  em: ["engineering-management"],
  "project-management": ["program-management", "project-management"]
};

async function generateQuestionsForConfig(company: string, topic: string, difficulty: string, category: string): Promise<GeneratedQuestion[]> {
  const prompt = `Generate 3 unique ${difficulty} difficulty ${category} interview questions for ${topicNames[topic as keyof typeof topicNames]} roles at ${company.charAt(0).toUpperCase() + company.slice(1)}.

For each question, provide:
1. A compelling, specific title (50-80 characters)
2. A detailed description explaining the scenario
3. Appropriate time limit in minutes (5-20 minutes based on complexity)
4. 3-4 actionable tips for answering
5. A comprehensive optimal answer (200-500 words)

Make questions realistic and based on actual ${company} challenges. For ${category} questions:
- mock-interview: Focus on behavioral, leadership, and process questions
- case-study: Focus on complex problem-solving scenarios with business context

Respond in JSON format with this structure:
{
  "questions": [
    {
      "title": "string",
      "description": "string", 
      "timeLimit": number,
      "tips": ["string"],
      "optimalAnswer": "string"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return result.questions.map((q: any) => ({
      title: q.title,
      description: q.description,
      category,
      topic,
      company,
      difficulty,
      roles: roleMapping[topic as keyof typeof roleMapping] || [],
      timeLimit: q.timeLimit,
      tips: q.tips,
      optimalAnswer: q.optimalAnswer,
      isPopular: Math.random() > 0.7 // 30% chance of being popular
    }));
  } catch (error) {
    console.error(`Error generating questions for ${company}-${topic}-${difficulty}-${category}:`, error);
    return [];
  }
}

export async function generateAllQuestions() {
  console.log("Starting comprehensive question generation...");
  let totalGenerated = 0;
  let successCount = 0;
  let errorCount = 0;

  // Generate questions for each combination
  for (const company of companies) {
    for (const topic of topics) {
      for (const difficulty of difficulties) {
        for (const category of categories) {
          try {
            console.log(`Generating ${company}-${topic}-${difficulty}-${category} questions...`);
            
            const questions = await generateQuestionsForConfig(company, topic, difficulty, category);
            
            // Insert each question into database
            for (const question of questions) {
              try {
                await storage.createQuestion(question);
                successCount++;
              } catch (dbError) {
                console.error(`Database error for ${question.title}:`, dbError);
                errorCount++;
              }
            }
            
            totalGenerated += questions.length;
            console.log(`Generated ${questions.length} questions for ${company}-${topic}-${difficulty}-${category}`);
            
            // Add delay to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (error) {
            console.error(`Failed to generate questions for ${company}-${topic}-${difficulty}-${category}:`, error);
            errorCount++;
          }
        }
      }
    }
  }

  console.log(`Question generation complete!`);
  console.log(`Total questions generated: ${totalGenerated}`);
  console.log(`Successfully saved: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  
  return { totalGenerated, successCount, errorCount };
}

// Run the generation function immediately
generateAllQuestions().then(() => {
  console.log("Question generation finished");
}).catch(error => {
  console.error("Generation failed:", error);
});