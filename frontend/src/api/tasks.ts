/**
 * @branch feature/stretch-filters-pagination
 * @history 2026-07-09 — getPaged for paginated list; extended filter query params
 */
import { apiFetch } from './client';
import type {
  CreateTaskPayload,
  PagedTasks,
  Task,
  TaskFilters,
  TaskStatus,
  UpdateTaskPayload,
} from '../types';

export const DEFAULT_PAGE_SIZE = 10;

function buildQuery(filters?: TaskFilters): string {
  const params = new URLSearchParams();
  if (filters?.search?.trim()) {
    params.set('search', filters.search.trim());
  }
  if (filters?.status) {
    params.set('status', filters.status);
  }
  if (filters?.priority) {
    params.set('priority', filters.priority);
  }
  if (filters?.category) {
    params.set('category', filters.category);
  }
  if (filters?.page !== undefined) {
    params.set('page', String(filters.page));
  }
  if (filters?.pageSize !== undefined) {
    params.set('pageSize', String(filters.pageSize));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const tasksApi = {
  getAll: (filters?: TaskFilters) =>
    apiFetch<Task[]>(`/api/tasks${buildQuery(filters)}`),

  getPaged: (filters: TaskFilters) =>
    apiFetch<PagedTasks>(`/api/tasks${buildQuery(filters)}`),

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
