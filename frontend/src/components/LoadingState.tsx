interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="state-panel loading-state" role="status" aria-busy="true">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
