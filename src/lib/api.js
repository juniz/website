const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

async function fetchApi(endpoint, options = {}) {
  const { method = 'GET', body, headers = {}, ...customConfig } = options;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // If body is FormData, don't set Content-Type (browser will do it with boundary)
  if (body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
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
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error',
    };
  }
}

export const api = {
  get: (endpoint, options) => fetchApi(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => fetchApi(endpoint, { ...options, method: 'POST', body }),
  patch: (endpoint, body, options) => fetchApi(endpoint, { ...options, method: 'PATCH', body }),
  delete: (endpoint, options) => fetchApi(endpoint, { ...options, method: 'DELETE' }),
};
