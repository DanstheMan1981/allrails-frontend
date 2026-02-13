const BASE = '/api';

function headers(json = true): HeadersInit {
  const h: Record<string, string> = {};
  const token = localStorage.getItem('token');
  if (token) h['Authorization'] = `Bearer ${token}`;
  if (json) h['Content-Type'] = 'application/json';
  return h;
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...opts, headers: { ...headers(), ...(opts.headers as Record<string, string> || {}) } });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || JSON.stringify(err));
  }
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// Auth
export const auth = {
  register: (email: string, password: string, name?: string) =>
    request<{ access_token: string; user: { id: string; email: string; role: string } }>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
  login: (email: string, password: string) =>
    request<{ access_token: string; user: { id: string; email: string; role: string } }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  forgotPassword: (email: string) =>
    request<{ message: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) }),
};

// Profile
export interface Profile {
  id: string; userId: string; username: string; displayName: string | null;
  avatar: string | null; bio: string | null; createdAt: string; updatedAt: string;
}

export const profile = {
  get: () => request<Profile | Record<string, never>>('/profile'),
  upsert: (data: { username: string; displayName?: string; avatar?: string; bio?: string }) =>
    request<Profile>('/profile', { method: 'PUT', body: JSON.stringify(data) }),
};

// Payment Methods
export interface PaymentMethod {
  id: string; userId: string; type: string; label: string | null;
  handle: string; sortOrder: number; active: boolean; createdAt: string; updatedAt: string;
}

export const paymentMethods = {
  list: () => request<PaymentMethod[]>('/payment-methods'),
  create: (data: { type: string; label?: string; handle: string }) =>
    request<PaymentMethod>('/payment-methods', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<PaymentMethod>) =>
    request<PaymentMethod>(`/payment-methods/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/payment-methods/${id}`, { method: 'DELETE' }),
  reorder: (order: { id: string; sortOrder: number }[]) =>
    request<PaymentMethod[]>('/payment-methods/reorder', { method: 'PATCH', body: JSON.stringify({ order }) }),
};

// Public page
export interface PublicPage {
  username: string; displayName: string | null; avatar: string | null;
  bio: string | null; paymentMethods: { id: string; type: string; label: string | null; handle: string; sortOrder: number }[];
}

export const publicPage = {
  get: (username: string) => request<PublicPage>(`/p/${username}`),
};
