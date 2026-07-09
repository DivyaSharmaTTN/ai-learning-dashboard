/**
 * @branch feature/stretch-activity-log
 * @history 2026-07-09 — Activity history API client
 */
import { apiFetch } from './client';
import type { ActivityLog } from '../types';

export const activityApi = {
  getByTaskId: (taskId: number) =>
    apiFetch<ActivityLog[]>(`/api/tasks/${taskId}/activity`),
};
