export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

export class ApiError extends Error {
  status: number;
  details?: Record<string, string[]>;

  constructor(message: string, status: number, details?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function parseError(response: Response): Promise<ApiError> {
  try {
    const body = await response.json();
    if (body.errors) {
      return new ApiError(body.title ?? 'Validation failed', response.status, body.errors);
    }
    return new ApiError(body.message ?? body.title ?? 'Request failed', response.status);
  } catch {
    return new ApiError('Request failed', response.status);
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
