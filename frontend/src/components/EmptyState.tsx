/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Enhanced empty state with illustration-style icon
 */
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'No tasks found',
  message = 'Create a new task to get started or adjust your filters.',
  action,
}: EmptyStateProps) {
  return (
    <div className="state-panel empty-state">
      <div className="empty-icon">
        <Inbox size={40} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
