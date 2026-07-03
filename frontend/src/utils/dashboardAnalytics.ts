/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Dashboard analytics derived from real API task data
 */
import type { DashboardSummary, Task } from '../types';

export function getTaskProgress(status: Task['status']): number {
  switch (status) {
    case 'Completed':
      return 100;
    case 'InProgress':
      return 55;
    default:
      return 15;
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays}d`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export interface StatusChartDatum {
  name: string;
  value: number;
  fill: string;
}

export function buildStatusChartData(summary: DashboardSummary): StatusChartDatum[] {
  const notStarted = Math.max(
    0,
    summary.totalItems - summary.completedItems - summary.inProgressItems,
  );
  return [
    { name: 'Completed', value: summary.completedItems, fill: 'var(--chart-completed)' },
    { name: 'In Progress', value: summary.inProgressItems, fill: 'var(--chart-progress)' },
    { name: 'Not Started', value: notStarted, fill: 'var(--chart-pending)' },
  ].filter((d) => d.value > 0 || summary.totalItems === 0);
}

export interface WeeklyChartDatum {
  week: string;
  completed: number;
  created: number;
}

export function buildWeeklyProgressData(tasks: Task[]): WeeklyChartDatum[] {
  const weeks: WeeklyChartDatum[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const label = weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    const completed = tasks.filter((t) => {
      if (t.status !== 'Completed') return false;
      const updated = new Date(t.updatedAt);
      return updated >= weekStart && updated < weekEnd;
    }).length;

    const created = tasks.filter((t) => {
      const createdAt = new Date(t.createdAt);
      return createdAt >= weekStart && createdAt < weekEnd;
    }).length;

    weeks.push({ week: label, completed, created });
  }

  return weeks;
}

export interface AiInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'accent';
  title: string;
  description: string;
}

export function buildAiInsights(summary: DashboardSummary, tasks: Task[]): AiInsight[] {
  const insights: AiInsight[] = [];
  const completionRate =
    summary.totalItems > 0
      ? Math.round((summary.completedItems / summary.totalItems) * 100)
      : 0;

  insights.push({
    id: 'completion',
    type: completionRate >= 50 ? 'success' : 'info',
    title: `${completionRate}% completion rate`,
    description:
      summary.totalItems > 0
        ? `${summary.completedItems} of ${summary.totalItems} tasks completed.`
        : 'Create tasks to start tracking progress.',
  });

  if (summary.overdueItems > 0) {
    insights.push({
      id: 'overdue',
      type: 'warning',
      title: `${summary.overdueItems} overdue task${summary.overdueItems > 1 ? 's' : ''}`,
      description: 'Prioritize overdue items to stay on track with learning goals.',
    });
  }

  if (summary.highPriorityItems > 0) {
    insights.push({
      id: 'priority',
      type: 'accent',
      title: `${summary.highPriorityItems} high-priority item${summary.highPriorityItems > 1 ? 's' : ''}`,
      description: 'Focus on high-priority tasks to maximize impact this week.',
    });
  }

  const inProgress = tasks.filter((t) => t.status === 'InProgress');
  if (inProgress.length > 0) {
    insights.push({
      id: 'momentum',
      type: 'info',
      title: `${inProgress.length} task${inProgress.length > 1 ? 's' : ''} in progress`,
      description: `Latest: "${inProgress[0].title}" — keep the momentum going.`,
    });
  }

  return insights.slice(0, 4);
}

export function getRecentActivity(tasks: Task[], limit = 5): Task[] {
  return [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
}

export function getUpcomingDeadlines(tasks: Task[], limit = 5): Task[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return tasks
    .filter((t) => t.status !== 'Completed')
    .filter((t) => new Date(t.dueDate) >= now)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, limit);
}
