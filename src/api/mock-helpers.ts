/**
 * Shared mock utilities used by all feature API files in mock mode.
 * Import from here instead of redefining in each feature.
 */

/** Simulates network latency in mock mode. */
export const mockDelay = (ms: number): Promise<void> =>
   new Promise((r) => setTimeout(r, ms));
