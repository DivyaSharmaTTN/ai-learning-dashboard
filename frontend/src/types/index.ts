export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'NotStarted' | 'InProgress' | 'Completed';
export type TaskCategory = 'Learning' | 'Project' | 'Certification' | 'Other';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  ownerId: number;
  ownerName: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
}

export interface DashboardSummary {
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  overdueItems: number;
  highPriorityItems: number;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  ownerId: number;
  dueDate: string;
}

export type UpdateTaskPayload = CreateTaskPayload;

export interface TaskFilters {
  search?: string;
  status?: TaskStatus | '';
}
