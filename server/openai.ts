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
    // Add timestamp to ensure uniqueness in AI generation
    const timestamp = Date.now();
    const uniqueId = Math.floor(Math.random() * 1000);

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert case study creator for ${topic} interviews at top technology companies. Create realistic, challenging case studies that test strategic thinking, problem-solving, and leadership skills. Each case study should be unique and based on contemporary business challenges. Generate fresh, varied content every time - avoid repetitive scenarios.`
        },
        {
          role: "user",
          content: `Generate a completely unique ${difficulty} difficulty case study for ${topic}. Create a fresh scenario that hasn't been used before.

Requirements:
- Make it realistic for a ${topic} professional at a major tech company
- Use current industry trends and challenges (2024-2025)
- Include specific metrics and business context
- Vary the company type, industry, and challenge focus
- Create unique stakeholder combinations
- Add creative constraints that test problem-solving

Structure (JSON format):
1. title: Engaging, specific title that includes unique elements
2. company: Realistic fictional company name (avoid generic names)
3. industry: Specific tech sector or vertical
4. companySize: Detailed employee count and revenue range
5. challenge: Compelling 2-3 sentence problem statement
6. detailedChallenge: Comprehensive context with market dynamics, internal factors, and urgency
7. stakeholders: Realistic mix of internal and external stakeholders
8. constraints: Mix of budget, timeline, technical, regulatory, and competitive constraints
9. objectives: 4-6 specific, measurable business goals
10. timeframe: Realistic project timeline with phases

Ensure high variety - different industries (FinTech, HealthTech, EdTech, etc.), company stages (startup to enterprise), and challenge types. Use timestamp ${timestamp} and ID ${uniqueId} to ensure uniqueness.

Output JSON with exact field names: title, company, industry, companySize, challenge, detailedChallenge, stakeholders, constraints, objectives, timeframe.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const caseStudy = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      title: caseStudy.title || `Strategic ${topic} Initiative ${uniqueId}`,
      company: caseStudy.company || "InnovateTech Solutions",
      industry: caseStudy.industry || "Technology Platform",
      companySize: caseStudy.companySize || "800-1500 employees, $200M-600M revenue",
      challenge: caseStudy.challenge || "Complex strategic challenge requiring innovative solution",
      detailedChallenge: caseStudy.detailedChallenge || "Comprehensive business challenge with market and operational complexities",
      stakeholders: caseStudy.stakeholders || ["CEO", "CTO", "VP Engineering", "Product Teams"],
      constraints: caseStudy.constraints || ["Budget limitations", "Regulatory requirements", "Timeline pressure"],
      objectives: caseStudy.objectives || ["Improve efficiency", "Reduce costs", "Scale operations", "Enhance user experience"],
      timeframe: caseStudy.timeframe || "8 months"
    };
  } catch (error: any) {
    console.error("Error generating case study:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to generate case study");
  }
}

// Generate AI-powered prompted questions
export async function generatePromptedQuestions(topic: string, experienceLevel: string, count: number = 5): Promise<any[]> {
  try {
    const difficultyMap: { [key: string]: string } = {
      "junior": "easy",
      "mid": "medium", 
      "senior": "hard"
    };

    const difficulty = difficultyMap[experienceLevel] || "medium";

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert interviewer creating ${topic} interview questions. Generate realistic, challenging questions that test both theoretical knowledge and practical experience. Each question should include context about what skills it tests, suggested structure for answering, and key points to cover.`
        },
        {
          role: "user",
          content: `Generate ${count} unique ${difficulty} difficulty interview questions for ${topic} at ${experienceLevel} level.

For each question, provide:
1. questionPrompt: The main interview question (realistic scenario or behavioral question)
2. context: What skills/knowledge this question tests
3. suggestedStructure: How to structure the answer (e.g., "Use STAR method", "Framework approach")
4. keyPoints: Array of 4-5 key points that should be covered in a good answer
5. difficultyLevel: "${difficulty}"
6. estimatedTime: Time in minutes to answer (8-15 minutes based on difficulty)

Make questions varied - include technical scenarios, leadership challenges, strategic thinking, and behavioral examples. Ensure they're realistic for ${topic} interviews at top tech companies.

Output as JSON array with these exact field names.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    const questions = result.questions || [];

    return questions.map((q: any, index: number) => ({
      id: Date.now() + index, // Temporary ID for frontend
      topic,
      experienceLevel,
      questionPrompt: q.questionPrompt || "Tell me about a challenging project you led.",
      context: q.context || "Tests leadership and problem-solving skills.",
      suggestedStructure: q.suggestedStructure || "Use the STAR method (Situation, Task, Action, Result).",
      keyPoints: q.keyPoints || ["Problem identification", "Solution approach", "Results achieved"],
      difficultyLevel: q.difficultyLevel || difficulty,
      estimatedTime: q.estimatedTime || 10,
      isActive: true,
      createdAt: new Date().toISOString()
    }));
  } catch (error: any) {
    console.error("Error generating prompted questions:", error);
    if (error.status === 429) {
      throw new Error("OpenAI API quota exceeded. Please check your API plan and billing details.");
    }
    throw new Error("Failed to generate questions");
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