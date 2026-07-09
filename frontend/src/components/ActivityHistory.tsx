/**
 * @branch feature/stretch-activity-log
 * @history 2026-07-09 — Persisted audit history on task detail page
 */
import { History } from 'lucide-react';
import type { ActivityLog } from '../types';

interface ActivityHistoryProps {
  logs: ActivityLog[];
}

function formatAction(log: ActivityLog): string {
  switch (log.action) {
    case 'Created':
      return `Created task "${log.newValue ?? ''}"`;
    case 'StatusChanged':
      return `Status changed from ${log.previousValue ?? '—'} to ${log.newValue ?? '—'}`;
    case 'Updated':
      return `Updated ${log.newValue ?? log.previousValue ?? 'field'}`;
    default:
      return log.action;
  }
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ActivityHistory({ logs }: ActivityHistoryProps) {
  return (
    <section className="glass-card activity-history" aria-label="Activity history">
      <header className="panel-header">
        <History size={18} className="panel-icon" aria-hidden="true" />
        <h2 className="section-title">Activity History</h2>
      </header>

      {logs.length === 0 ? (
        <p className="panel-empty">No activity recorded yet.</p>
      ) : (
        <ol className="activity-history-list">
          {logs.map((log) => (
            <li key={log.id} className="activity-history-item">
              <span
                className={`activity-dot activity-dot--${log.action.toLowerCase()}`}
                aria-hidden="true"
              />
              <div className="activity-history-content">
                <p className="activity-history-action">{formatAction(log)}</p>
                <p className="activity-history-meta">
                  <span>{log.user}</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={log.timestamp}>{formatTimestamp(log.timestamp)}</time>
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
