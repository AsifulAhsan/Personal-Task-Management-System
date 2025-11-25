// lib/api.ts

// Smart URL builder that works in both environments
const getApiUrl = (path: string) => {
  // Client-side: use relative URL (same origin) - works in both dev and production
  if (typeof window !== 'undefined') {
    return `/api${path}`;
  }
  
  // Server-side (Server Components, SSR, API routes): 
  // Use full URL only when explicitly provided, otherwise relative
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (baseUrl) {
    return `${baseUrl}/api${path}`;
  }
  
  // Default to relative URL for server-side too
  return `/api${path}`;
};

function getAuthHeaders() {
  // Safe localStorage access - only in browser
  const token = typeof window !== 'undefined' ? localStorage.getItem('taskapp_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// Auth APIs
export async function registerUser(email: string, password: string, name: string) {
  const response = await fetch(getApiUrl('/auth/register'), {
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
  const response = await fetch(getApiUrl('/auth/login'), {
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
  const response = await fetch(getApiUrl('/tasks'), {
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
  const response = await fetch(getApiUrl('/tasks'), {
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
  const response = await fetch(getApiUrl('/tasks'), {
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
  const response = await fetch(getApiUrl(`/tasks?id=${id}`), {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete task');
  }

  return true;
}