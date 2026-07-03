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
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}
