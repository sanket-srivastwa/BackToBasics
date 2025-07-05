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

export async function generateLearningResponse(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert learning assistant for management and technical roles. Provide comprehensive, practical answers to questions about technical program management, product management, engineering management, system design, leadership, and career development. Use examples, frameworks, and actionable advice. Keep responses well-structured and easy to understand."
        },
        {
          role: "user",
          content: query
        }
      ],
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response to your question. Please try rephrasing it or ask something more specific.";
  } catch (error: any) {
    console.error("Error generating learning response:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to generate learning response");
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

export interface CaseStudy {
  title: string;
  company: string;
  industry: string;
  companySize: string;
  challenge: string;
  detailedChallenge: string;
  stakeholders: string[];
  constraints: string[];
  objectives: string[];
  timeframe: string;
}

export async function generateCaseStudy(topic: string, difficulty: string = "medium"): Promise<CaseStudy> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert case study creator for ${topic} interviews. Create realistic, challenging case studies following the PM Solutions format with proper company context, specific challenges, and measurable objectives. Focus on real-world business scenarios that test strategic thinking, problem-solving, and leadership skills.`
        },
        {
          role: "user",
          content: `Generate a ${difficulty} difficulty case study for ${topic}. Follow this structure and provide detailed, realistic information:

1. Title: Create an engaging, specific title
2. Company: Choose a realistic company (can be fictional but believable)
3. Industry: Specify the industry sector
4. Company Size: Employee count and revenue range
5. Challenge: Brief 2-3 sentence summary
6. Detailed Challenge: Comprehensive problem description with context
7. Stakeholders: List key stakeholders involved
8. Constraints: Budget, time, resource, or regulatory constraints
9. Objectives: Specific, measurable goals
10. Timeframe: Project timeline

Make it realistic and challenging for a ${topic} professional. Output as JSON with these exact field names: title, company, industry, companySize, challenge, detailedChallenge, stakeholders, constraints, objectives, timeframe.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const caseStudy = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: caseStudy.title || "Strategic Initiative Case Study",
      company: caseStudy.company || "TechCorp Inc.",
      industry: caseStudy.industry || "Technology",
      companySize: caseStudy.companySize || "500-1000 employees, $100M-500M revenue",
      challenge: caseStudy.challenge || "Complex organizational challenge requiring strategic solution",
      detailedChallenge: caseStudy.detailedChallenge || "Detailed challenge description",
      stakeholders: caseStudy.stakeholders || ["CEO", "CTO", "Engineering Teams"],
      constraints: caseStudy.constraints || ["Limited budget", "Tight timeline"],
      objectives: caseStudy.objectives || ["Improve efficiency", "Reduce costs"],
      timeframe: caseStudy.timeframe || "6 months"
    };
  } catch (error: any) {
    console.error("Error generating case study:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to generate case study");
  }
}

export async function evaluateCaseStudyResponse(caseStudy: CaseStudy, userAnswer: string): Promise<QuestionAnalysis> {
  try {
    // Generate optimal answer
    const optimalResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a senior management consultant providing the optimal solution to a business case study. Provide a comprehensive, strategic response that demonstrates expert-level thinking."
        },
        {
          role: "user",
          content: `Case Study: ${caseStudy.title}
          
Company: ${caseStudy.company} (${caseStudy.industry}, ${caseStudy.companySize})

Challenge: ${caseStudy.detailedChallenge}

Stakeholders: ${caseStudy.stakeholders.join(", ")}
Constraints: ${caseStudy.constraints.join(", ")}
Objectives: ${caseStudy.objectives.join(", ")}
Timeframe: ${caseStudy.timeframe}

Provide a comprehensive, optimal solution that addresses all aspects of this case study. Structure your response with clear sections covering analysis, strategy, implementation plan, risk mitigation, and success metrics.`
        }
      ]
    });

    const optimalAnswer = optimalResponse.choices[0].message.content || "";

    // Analyze user's answer
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert management consultant evaluating case study responses. Provide detailed, constructive feedback with specific recommendations for improvement."
        },
        {
          role: "user",
          content: `Case Study Context:
${caseStudy.title} - ${caseStudy.company}
Challenge: ${caseStudy.challenge}

User's Answer: ${userAnswer}

Optimal Answer: ${optimalAnswer}

Evaluate the user's response and provide:
1. userScore (1-10): Overall quality score
2. strengths: Array of specific strengths in their response
3. improvements: Array of specific areas needing improvement
4. suggestions: Array of actionable suggestions for better responses
5. detailedFeedback: Comprehensive feedback paragraph

Respond in JSON format with these exact fields.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(analysisResponse.choices[0].message.content || "{}");
    
    return {
      optimalAnswer,
      userScore: Math.max(1, Math.min(10, analysis.userScore || 5)),
      strengths: analysis.strengths || ["Addressed the main challenge"],
      improvements: analysis.improvements || ["Provide more specific implementation details"],
      suggestions: analysis.suggestions || ["Use structured frameworks like SWOT or McKinsey 7S"],
      detailedFeedback: analysis.detailedFeedback || "Consider providing more detailed analysis and implementation steps."
    };
  } catch (error: any) {
    console.error("Error evaluating case study response:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to evaluate response");
  }
}