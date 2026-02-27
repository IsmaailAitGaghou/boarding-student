import { useState, useEffect } from "react";

/**
 * Debounces a value by `delay` ms.
 * The returned value only updates after the input value has stopped changing
 * for the specified delay period.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 500);
 */
export function useDebounce<T>(value: T, delay: number): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value);

   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);

      return () => {
         clearTimeout(timer);
      };
   }, [value, delay]);

   return debouncedValue;
}
