import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuth() {
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

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}