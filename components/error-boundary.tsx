import { View, Text, Pressable, ScrollView } from "react-native";
import { useEffect, useState } from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, retry: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for catching and displaying errors
 */
export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setState({
        hasError: true,
        error: event.error,
      });
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (state.hasError && state.error) {
    if (fallback) {
      return fallback(state.error, () => setState({ hasError: false, error: null }));
    }

    return (
      <ScrollView className="flex-1 bg-background p-4">
        <View className="flex-1 items-center justify-center">
          <View className="w-full rounded-lg bg-error/10 p-4">
            <Text className="mb-2 text-lg font-bold text-error">⚠️ Algo deu errado</Text>
            <Text className="mb-4 text-sm text-foreground">{state.error.message}</Text>

            <View className="mb-4 rounded-lg bg-surface p-3">
              <Text className="font-mono text-xs text-muted">{state.error.stack}</Text>
            </View>

            <Pressable
              onPress={() => setState({ hasError: false, error: null })}
              className="rounded-lg bg-primary py-3 px-4"
            >
              <Text className="text-center font-semibold text-white">Tentar Novamente</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    );
  }

  return <>{children}</>;
}

/**
 * Error display component for showing errors in UI
 */
export function ErrorDisplay({
  error,
  onRetry,
}: {
  error: string | Error;
  onRetry?: () => void;
}) {
  const message = typeof error === "string" ? error : error.message;

  return (
    <View className="rounded-lg border border-error bg-error/5 p-4">
      <Text className="font-semibold text-error mb-2">❌ Erro</Text>
      <Text className="text-sm text-foreground mb-3">{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} className="rounded-lg bg-error py-2 px-3">
          <Text className="text-center text-sm font-semibold text-white">Tentar Novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

/**
 * Hook for error handling
 */
export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (err: unknown) => {
    const error = err instanceof Error ? err : new Error(String(err));
    setError(error);
    console.error("Error:", error);
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
}
