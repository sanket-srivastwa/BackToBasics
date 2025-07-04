import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function useAuth() {
  const [demoUser, setDemoUser] = useState<any>(null);
  
  // Check for demo authentication in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('message') === 'signed-in-demo') {
      const mockUser = {
        id: "demo-user-123",
        email: "demo@example.com",
        firstName: "Demo",
        lastName: "User",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        questionsViewed: 0
      };
      setDemoUser(mockUser);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Return demo user if available, otherwise API user
  const finalUser = demoUser || user;

  return {
    user: finalUser,
    isLoading: !demoUser && isLoading,
    isAuthenticated: !!finalUser,
  };
}