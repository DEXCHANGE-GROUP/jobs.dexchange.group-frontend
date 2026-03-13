import type { Job, Candidate, Application, PaginatedResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Erreur ${res.status}`);
  }
  return res.json();
}

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  return filtered.length ? '?' + new URLSearchParams(filtered.map(([k, v]) => [k, String(v)])).toString() : '';
}

export const api = {
  jobs: {
    list: (params: Record<string, string | number | boolean | undefined> = {}) =>
      request<PaginatedResponse<Job>>(`/jobs${qs(params)}`),
    get: (id: string) => request<Job>(`/jobs/${id}`),
    create: (data: Partial<Job>) =>
      request<Job>('/jobs', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Job>) =>
      request<Job>(`/jobs/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ deleted: boolean }>(`/jobs/${id}`, { method: 'DELETE' }),
    publish: (id: string) =>
      request<Job>(`/jobs/${id}/publish`, { method: 'PATCH' }),
    close: (id: string) =>
      request<Job>(`/jobs/${id}/close`, { method: 'PATCH' }),
  },

  candidates: {
    list: (params: Record<string, string | number | boolean | undefined> = {}) =>
      request<PaginatedResponse<Candidate>>(`/candidates${qs(params)}`),
    get: (id: string) => request<Candidate>(`/candidates/${id}`),
    create: (data: Partial<Candidate>) =>
      request<Candidate>('/candidates', { method: 'POST', body: JSON.stringify(data) }),
  },

  applications: {
    list: (params: Record<string, string | number | boolean | undefined> = {}) =>
      request<PaginatedResponse<Application>>(`/applications${qs(params)}`),
    get: (id: string) => request<Application>(`/applications/${id}`),
    create: (data: { jobId: string; candidateId: string; source?: string; coverLetter?: string; resumeUrl?: string }) =>
      request<Application>('/applications', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, data: { status: string; changedBy?: string; comment?: string }) =>
      request<Application>(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
    dashboardStats: () => request<{ total: number; byStatus: Record<string, number> }>('/applications/stats/dashboard'),
  },
};
