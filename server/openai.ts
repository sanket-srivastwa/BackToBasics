import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface QuestionAnalysis {
  optimalAnswer: string;
  userScore: number;
  strengths: string[];
  improvements: string[];
  suggestions: string[];
  detailedFeedback: string;
}

export async function generateOptimalAnswer(question: string, topic: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert interview coach specializing in ${topic} roles at top tech companies (MAANG). Provide comprehensive, structured answers that demonstrate best practices for interview responses.`
        },
        {
          role: "user",
          content: `Generate an optimal answer for this interview question: "${question}"

Please structure your response using the STAR method (Situation, Task, Action, Result) where applicable, and include:
- Specific examples and metrics
- Leadership and technical skills demonstration
- Problem-solving approach
- Impact and results

The answer should be 300-500 words and demonstrate expertise level appropriate for senior roles.`
        }
      ],
    });

    return response.choices[0].message.content || "Unable to generate optimal answer.";
  } catch (error: any) {
    console.error("Error generating optimal answer:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to generate optimal answer");
  }
}

export async function analyzeAnswerComparison(
  question: string,
  userAnswer: string,
  optimalAnswer: string,
  topic: string
): Promise<QuestionAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert interview coach providing detailed feedback on ${topic} interview responses. Analyze answers against best practices and provide constructive, actionable feedback.`
        },
        {
          role: "user",
          content: `Question: "${question}"

User's Answer: "${userAnswer}"

Optimal Answer: "${optimalAnswer}"

Please analyze the user's answer compared to the optimal answer and provide feedback in JSON format:
{
  "userScore": <number 1-10>,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "detailedFeedback": "Comprehensive analysis of the response quality, structure, content, and areas for improvement. Include specific examples from their answer and explain why the optimal answer is more effective."
}

Focus on:
- Content quality and relevance
- Structure and organization (STAR method usage)
- Specific examples and metrics
- Leadership/technical demonstration
- Communication clarity
- Missing key elements`
        }
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      optimalAnswer,
      userScore: Math.max(1, Math.min(10, analysis.userScore || 5)),
      strengths: analysis.strengths || ["Clear communication"],
      improvements: analysis.improvements || ["Add more specific examples"],
      suggestions: analysis.suggestions || ["Use the STAR method for structure"],
      detailedFeedback: analysis.detailedFeedback || "Please provide more detail in your response."
    };
  } catch (error: any) {
    console.error("Error analyzing answer:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to analyze answer");
  }
}

export async function generateLearningContent(track: string, module: string): Promise<any> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert learning content creator for technical management roles. Generate comprehensive, practical learning content."
        },
        {
          role: "user",
          content: `Generate detailed learning content for ${track} - ${module}.

Include:
- Learning objectives (3-5 bullet points)
- Key concepts with explanations
- Practical examples and case studies
- Action items and exercises
- Recommended readings and resources
- Assessment questions

Make it comprehensive, practical, and suitable for professionals at top tech companies.

Respond in JSON format with this structure:
{
  "title": "Module Title",
  "objectives": ["objective1", "objective2"],
  "concepts": [{"title": "Concept", "explanation": "Detailed explanation"}],
  "examples": [{"scenario": "Scenario", "solution": "Solution approach"}],
  "exercises": ["exercise1", "exercise2"],
  "resources": [{"title": "Resource", "type": "book/article/course", "description": "Description"}],
  "assessment": [{"question": "Question", "answer": "Answer"}]
}`
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error: any) {
    console.error("Error generating learning content:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to generate learning content");
  }
}

export async function validateQuestion(question: string): Promise<{ isValid: boolean; feedback?: string }> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an interview coach. Validate if a question is appropriate for professional interviews and provide feedback."
        },
        {
          role: "user",
          content: `Is this a good interview question for management/technical roles? "${question}"

Respond with JSON:
{
  "isValid": <boolean>,
  "feedback": "Brief explanation of why it's good or how to improve it"
}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      isValid: result.isValid !== false,
      feedback: result.feedback
    };
  } catch (error: any) {
    console.error("Error validating question:", error);
    if (error.status === 429) {
      console.warn("OpenAI API quota exceeded for validation - defaulting to valid");
    }
    return { isValid: true }; // Default to allowing questions if validation fails
  }
}