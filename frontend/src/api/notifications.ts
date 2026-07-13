/**
 * @branch feature/task-notifications
 * @history 2026-07-13 — Notification API client
 */
import { apiFetch } from './client';
import type { Notification } from '../types';

export const notificationsApi = {
  getAll: (unreadOnly = false) =>
    apiFetch<Notification[]>(`/api/notifications${unreadOnly ? '?unreadOnly=true' : ''}`),

  getUnreadCount: () =>
    apiFetch<{ count: number }>('/api/notifications/unread-count'),

  markAsRead: (id: number) =>
    apiFetch<void>(`/api/notifications/${id}/read`, { method: 'PATCH' }),

  markAllAsRead: () =>
    apiFetch<void>('/api/notifications/read-all', { method: 'POST' }),
};
