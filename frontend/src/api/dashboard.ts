import { apiFetch } from './client';
import type { DashboardSummary } from '../types';

export const dashboardApi = {
  getSummary: () => apiFetch<DashboardSummary>('/api/dashboard/summary'),
};
