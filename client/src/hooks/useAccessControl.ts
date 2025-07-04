import { useAuth } from "./useAuth";
import { useState, useEffect } from "react";

interface AccessStatus {
  isAuthenticated: boolean;
  questionsViewed: number;
  questionsRemaining: number;
  requiresAuth: boolean;
}

export function useAccessControl() {
  const { isAuthenticated, user } = useAuth();
  const [questionsViewed, setQuestionsViewed] = useState(0);
  
  // For demo purposes, use local storage to track question views
  useEffect(() => {
    const viewedCount = parseInt(localStorage.getItem('questionsViewed') || '0');
    setQuestionsViewed(viewedCount);
  }, []);

  const questionsRemaining = Math.max(0, 5 - questionsViewed);
  const requiresAuth = questionsViewed >= 5 && !isAuthenticated;
  const canViewQuestions = !requiresAuth;
  const shouldShowAuthPrompt = requiresAuth;

  const incrementQuestionView = () => {
    if (!isAuthenticated) {
      const newCount = questionsViewed + 1;
      setQuestionsViewed(newCount);
      localStorage.setItem('questionsViewed', newCount.toString());
    }
  };

  return {
    isLoading: false,
    canViewQuestions,
    shouldShowAuthPrompt,
    questionsRemaining: isAuthenticated ? Infinity : questionsRemaining,
    questionsViewed,
    incrementQuestionView,
  };
}