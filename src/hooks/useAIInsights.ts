import { useState, useCallback } from 'react';
import type { Run, AIInsights, AppSettings } from '../types';
import { generateInsights } from '../lib/openai';

interface UseAIInsightsReturn {
  generate: (run: Run, recentRuns: Run[], settings: AppSettings) => Promise<AIInsights | null>;
  isLoading: boolean;
  error: string | null;
}

export function useAIInsights(): UseAIInsightsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (run: Run, recentRuns: Run[], settings: AppSettings): Promise<AIInsights | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const insights = await generateInsights(run, recentRuns, settings);
        return insights;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to generate insights';
        setError(msg);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { generate, isLoading, error };
}
