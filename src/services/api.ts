
import { User, Duty, DutyWithUser, RubricType } from '@/types';

const API_URL = 'http://localhost:4000/api';

// Generic fetch handler with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// User endpoints
export const userAPI = {
  getAll: () => fetchAPI<User[]>('/users'),
  getById: (id: string) => fetchAPI<User>(`/users/${id}`),
  create: (user: Omit<User, 'id'>) => 
    fetchAPI<User>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),
  update: (id: string, user: Partial<User>) => 
    fetchAPI<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),
  delete: (id: string) => 
    fetchAPI<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Duty endpoints
export const dutyAPI = {
  getAll: () => fetchAPI<DutyWithUser[]>('/duties'),
  getById: (id: string) => fetchAPI<DutyWithUser>(`/duties/${id}`),
  create: (duty: Omit<Duty, 'id'>) => 
    fetchAPI<Duty>('/duties', {
      method: 'POST',
      body: JSON.stringify(duty),
    }),
  update: (id: string, duty: Partial<Duty>) => 
    fetchAPI<Duty>(`/duties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(duty),
    }),
  delete: (id: string) => 
    fetchAPI<{ success: boolean }>(`/duties/${id}`, {
      method: 'DELETE',
    }),
};

// Rubric endpoints
export const rubricAPI = {
  getAll: () => fetchAPI<RubricType[]>('/rubrics'),
  create: (name: string) => 
    fetchAPI<{ success: boolean }>('/rubrics', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  update: (oldName: string, newName: string) => 
    fetchAPI<{ success: boolean }>(`/rubrics/${encodeURIComponent(oldName)}`, {
      method: 'PUT',
      body: JSON.stringify({ name: newName }),
    }),
  delete: (name: string) => 
    fetchAPI<{ success: boolean }>(`/rubrics/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    }),
};

// Authentication endpoints
export const authAPI = {
  login: (email: string, password: string) => 
    fetchAPI<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
