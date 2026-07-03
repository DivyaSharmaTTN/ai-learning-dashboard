/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Recent activity from tasks sorted by updatedAt
 */
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Task } from '../../types';
import { getRecentActivity } from '../../utils/dashboardAnalytics';

interface RecentActivityProps {
  tasks: Task[];
}

function activityLabel(task: Task): string {
  const action =
    task.status === 'Completed'
      ? 'completed'
      : task.status === 'InProgress'
        ? 'updated'
        : 'created';
  return `${action} · ${new Date(task.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function RecentActivity({ tasks }: RecentActivityProps) {
  const recent = getRecentActivity(tasks);

  return (
    <section className="side-panel recent-activity" aria-label="Recent Activity">
      <header className="panel-header">
        <Clock size={18} className="panel-icon" />
        <h2>Recent Activity</h2>
      </header>
      {recent.length === 0 ? (
        <p className="panel-empty">No recent activity</p>
      ) : (
        <ul className="activity-list">
          {recent.map((task) => (
            <li key={task.id}>
              <Link to={`/tasks/${task.id}`} className="activity-item">
                <span className={`activity-dot status-${task.status.toLowerCase()}`} />
                <div>
                  <strong>{task.title}</strong>
                  <span>{activityLabel(task)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
