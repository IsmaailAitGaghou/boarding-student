import { useState, useEffect, useCallback } from "react";

interface AsyncDataState<T> {
   data: T | null;
   loading: boolean;
   error: string | null;
   reload: () => void;
}

/**
 * Encapsulates the standard load/error/loading pattern for a single async data
 * source. Automatically fires on mount and exposes a `reload` callback for
 * manual retries.
 *
 * @example
 * const { data: profile, loading, error, reload } = useAsyncData(getProfile);
 */
export function useAsyncData<T>(
   fetcher: () => Promise<T>,
): AsyncDataState<T> {
   const [data, setData] = useState<T | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const load = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const result = await fetcher();
         setData(result);
      } catch (e) {
         setError(
            e instanceof Error ? e.message : "Something went wrong. Please try again.",
         );
      } finally {
         setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   useEffect(() => {
      void load();
   }, [load]);

   return { data, loading, error, reload: load };
}
