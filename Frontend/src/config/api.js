/**
 * API Configuration
 * Centrally manages the backend URL for the entire application.
 * Uses Vite environment variables with a local fallback.
 */

// Vite env vars must start with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AUTH_URL = `${API_BASE_URL}/auth`;

export const getApiUrl = (endpoint) => {
  // Ensure we don't double the slash
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
