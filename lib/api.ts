// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getAuthHeaders() {
  const token = localStorage.getItem('taskapp_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Auth APIs
export async function registerUser(email: string, password: string, name: string) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Registration failed');
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  return data;
}

// Task APIs
export async function fetchTasks() {
  const response = await fetch(`${API_URL}/api/tasks`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  const data = await response.json();
  return data.tasks;
}

export async function createTask(taskData: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
}) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create task');
  }

  const data = await response.json();
  return data.task;
}

export async function updateTask(id: string, updates: any) {
  const response = await fetch(`${API_URL}/api/tasks`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ id, ...updates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update task');
  }

  const data = await response.json();
  return data.task;
}

export async function deleteTask(id: string) {
  const response = await fetch(`${API_URL}/api/tasks?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete task');
  }

  return true;
}