export type ApiClientOptions = {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
};

export class ApiError extends Error {
  readonly status: number;
  readonly body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export const createApiClient = (options: ApiClientOptions) => {
  const { baseUrl, defaultHeaders } = options;

  const request = async <T>(
    path: string,
    init?: RequestInit & { json?: unknown }
  ): Promise<T> => {
    const headers = new Headers(init?.headers);
    if (defaultHeaders) {
      for (const [k, v] of Object.entries(defaultHeaders)) headers.set(k, v);
    }

    if (init?.json !== undefined) {
      headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers,
      body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
    });

    const contentType = res.headers.get('content-type') ?? '';
    const isJson = contentType.includes('application/json');
    const body = isJson ? await res.json().catch(() => undefined) : await res.text().catch(() => undefined);

    if (!res.ok) {
      throw new ApiError(`Request failed: ${res.status} ${res.statusText}`, res.status, body);
    }

    return body as T;
  };

  return { request };
};
