import { ApiResponse } from '@/types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface FetchOptions extends RequestInit {
  body?: any;
}

async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', body, headers = {}, ...customConfig } = options;

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // If body is FormData, don't set Content-Type (browser will do it with boundary)
  if (body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config: RequestInit = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers as Record<string, string>,
    },
    cache: 'no-store', // Default to no-store to prevent stale data in production
    ...customConfig,
  };

  if (body && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  } else if (body) {
    config.body = body;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    }

    return {
      success: false,
      error: data.message || response.statusText,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'POST', body }),
  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};
