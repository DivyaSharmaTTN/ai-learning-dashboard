export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

const AUTH_STORAGE_KEY = 'ai-dashboard-auth';

export interface StoredAuth {
  token: string;
  expiresAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

let authTokenGetter: (() => string | null) | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthTokenGetter(getter: () => string | null) {
  authTokenGetter = getter;
}

export function setOnUnauthorized(handler: () => void) {
  onUnauthorized = handler;
}

export function loadStoredAuth(): StoredAuth | null {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAuth;
    if (new Date(parsed.expiresAt) <= new Date()) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveStoredAuth(auth: StoredAuth) {
  sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearStoredAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

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
  const token = authTokenGetter?.();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && onUnauthorized) {
    onUnauthorized();
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
