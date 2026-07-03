/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Enhanced error state styling
 */
import { AlertTriangle } from 'lucide-react';

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
      <div className="error-icon">
        <AlertTriangle size={40} strokeWidth={1.5} />
      </div>
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
