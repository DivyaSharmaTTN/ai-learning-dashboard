import { apiFetch } from './client';
import type { User } from '../types';

export const usersApi = {
  getAll: () => apiFetch<User[]>('/api/users'),
};
