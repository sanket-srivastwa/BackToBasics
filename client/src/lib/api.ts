import { apiRequest } from "./queryClient";

export interface Question {
  id: number;
  title: string;
  description: string;
  category: string;
  topic: string;
  company?: string;
  difficulty: string;
  timeLimit: number;
  tips?: string[];
  optimalAnswer: string;
  isPopular: boolean;
  createdAt?: Date;
}

export interface Answer {
  id: number;
  questionId: number;
  userAnswer: string;
  score?: number;
  feedback?: any;
  strengths?: string[];
  improvements?: string[];
  suggestions?: string[];
  createdAt?: Date;
}

export interface Session {
  id: number;
  topic: string;
  category: string;
  questionsCount: number;
  completedCount: number;
  currentQuestionId?: number;
  createdAt?: Date;
}

export const api = {
  // Questions
  getPopularQuestions: async (company?: string): Promise<Question[]> => {
    const url = company ? `/api/questions/popular?company=${company}` : "/api/questions/popular";
    const response = await apiRequest("GET", url);
    return response.json();
  },

  getQuestionsByTopic: async (topic: string, category: string): Promise<Question[]> => {
    const response = await apiRequest("GET", `/api/questions?topic=${topic}&category=${category}`);
    return response.json();
  },

  getQuestion: async (id: number): Promise<Question> => {
    const response = await apiRequest("GET", `/api/questions/${id}`);
    return response.json();
  },

  searchQuestions: async (query: string): Promise<Question[]> => {
    const response = await apiRequest("GET", `/api/questions/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Answers
  submitAnswer: async (questionId: number, userAnswer: string): Promise<Answer> => {
    const response = await apiRequest("POST", "/api/answers", {
      questionId,
      userAnswer,
    });
    return response.json();
  },

  getAnswer: async (id: number): Promise<Answer> => {
    const response = await apiRequest("GET", `/api/answers/${id}`);
    return response.json();
  },

  // Sessions
  createSession: async (topic: string, category: string, questionsCount: number): Promise<Session> => {
    const response = await apiRequest("POST", "/api/sessions", {
      topic,
      category,
      questionsCount,
    });
    return response.json();
  },

  getSession: async (id: number): Promise<Session> => {
    const response = await apiRequest("GET", `/api/sessions/${id}`);
    return response.json();
  },
};
