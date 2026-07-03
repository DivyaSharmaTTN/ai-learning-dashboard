interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong while loading data.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="state-panel error-state" role="alert">
      <h3>Error</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
