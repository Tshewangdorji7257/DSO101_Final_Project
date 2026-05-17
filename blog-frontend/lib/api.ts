// API utility for making requests to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : 'https://blog-backend-latest-yin7.onrender.com/api');

export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new APIError(
      data?.error || 'API request failed',
      response.status,
      data
    );
  }

  return data;
}

export const api = {
  // Auth endpoints
  register: (name, email, password) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Posts endpoints
  getPosts: () =>
    apiCall('/posts'),

  getPost: (id) =>
    apiCall(`/posts/${id}`),

  createPost: (postData) =>
    apiCall('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    }),

  updatePost: (id, postData) =>
    apiCall(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    }),

  deletePost: (id) =>
    apiCall(`/posts/${id}`, {
      method: 'DELETE',
    }),

  // Users endpoints
  getProfile: () =>
    apiCall('/users/me'),

  getUser: (id) =>
    apiCall(`/users/${id}`),

  getUserPosts: (id) =>
    apiCall(`/users/${id}/posts`),

  updateProfile: (profileData) =>
    apiCall('/users/me/update', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  changePassword: (currentPassword, newPassword) =>
    apiCall('/users/me/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

export function getAuthToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

export function setAuthToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

export function removeAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

export function isAuthenticated() {
  return !!getAuthToken();
}
