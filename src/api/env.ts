export type ApiMode = "mock" | "real";

// Vite env: VITE_API_MODE=mock | real
export const API_MODE: ApiMode = (import.meta.env.VITE_API_MODE ?? "mock") as ApiMode;

export const isMock = () => API_MODE === "mock";

export const getApiBaseUrl = (): string =>
  (import.meta.env.VITE_API_URL as string | undefined) ?? "";
