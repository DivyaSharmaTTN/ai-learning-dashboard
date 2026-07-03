import { apiFetch } from './client';
import type { CreateTaskPayload, Task, TaskFilters, TaskStatus, UpdateTaskPayload } from '../types';

function buildQuery(filters?: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters?.search?.trim()) {
    params.set('search', filters.search.trim());
  }
  if (filters?.status) {
    params.set('status', filters.status);
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const tasksApi = {
  getAll: (filters?: TaskFilters) =>
    apiFetch<Task[]>(`/api/tasks${buildQuery(filters)}`),

  getById: (id: number) => apiFetch<Task>(`/api/tasks/${id}`),

  create: (payload: CreateTaskPayload) =>
    apiFetch<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: UpdateTaskPayload) =>
    apiFetch<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  updateStatus: (id: number, status: TaskStatus) =>
    apiFetch<Task>(`/api/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
