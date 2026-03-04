import { useAuth } from "@/_core/hooks/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

/**
 * Hook for admin-only features
 * Redirects non-admin users to home
 */
export function useAdmin() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, loading]);

  return {
    isAdmin: user?.role === "admin",
    isLoading: loading,
    user,
  };
}

/**
 * Hook for company-only features
 */
export function useCompanyAccess() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "company"))) {
      router.replace("/");
    }
  }, [user, loading]);

  return {
    isCompanyUser: user?.role === "company" || user?.role === "admin",
    isLoading: loading,
    user,
  };
}

/**
 * Hook to check if user has specific role
 */
export function useRole(requiredRole: string) {
  const { user, loading } = useAuth();

  return {
    hasRole: user?.role === requiredRole,
    isLoading: loading,
    user,
  };
}

/**
 * Hook for protected features
 */
export function useProtected() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading]);

  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user,
  };
}
