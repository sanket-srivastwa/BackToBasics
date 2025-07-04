import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface AccessStatus {
  isAuthenticated: boolean;
  questionsViewed: number;
  questionsRemaining: number;
  requiresAuth: boolean;
}

export function useAccessControl() {
  const { isAuthenticated } = useAuth();
  
  const { data: accessStatus, isLoading } = useQuery<AccessStatus>({
    queryKey: ["/api/auth/access-status"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const canViewQuestions = !accessStatus?.requiresAuth;
  const shouldShowAuthPrompt = accessStatus?.requiresAuth && !isAuthenticated;

  return {
    accessStatus,
    isLoading,
    canViewQuestions,
    shouldShowAuthPrompt,
    questionsRemaining: accessStatus?.questionsRemaining || 5,
    questionsViewed: accessStatus?.questionsViewed || 0,
  };
}