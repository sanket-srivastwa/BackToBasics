import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useAuth() {
  // Mock user for testing account management
  const [mockUser] = useState(() => {
    // Check if we should show mock authenticated state for testing
    const mockAuth = localStorage.getItem('mockAuth');
    return mockAuth === 'true' ? {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      profileImageUrl: null
    } : null;
  });

  // Check for authentication status changes in URL and refresh
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('message') === 'signed-in' || urlParams.get('message') === 'logged-out') {
      // Clean up URL and refresh auth state
      window.history.replaceState({}, '', window.location.pathname);
      // Refresh the page to update auth state
      window.location.reload();
    }
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Use real user if available, otherwise use mock user for testing
  const finalUser = user || mockUser;
  const finalIsAuthenticated = !!user || !!mockUser;

  return {
    user: finalUser,
    isLoading,
    isAuthenticated: finalIsAuthenticated,
  };
}