/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Upcoming deadlines from non-completed tasks
 */
import { CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Task } from '../../types';
import { formatRelativeDate, getUpcomingDeadlines } from '../../utils/dashboardAnalytics';
import { Avatar } from '../ui/Avatar';

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

export function UpcomingDeadlines({ tasks }: UpcomingDeadlinesProps) {
  const upcoming = getUpcomingDeadlines(tasks);

  return (
    <section className="side-panel upcoming-deadlines" aria-label="Upcoming Deadlines">
      <header className="panel-header">
        <CalendarClock size={18} className="panel-icon" />
        <h2>Upcoming Deadlines</h2>
      </header>
      {upcoming.length === 0 ? (
        <p className="panel-empty">No upcoming deadlines</p>
      ) : (
        <ul className="deadline-list">
          {upcoming.map((task) => (
            <li key={task.id}>
              <Link to={`/tasks/${task.id}`} className="deadline-item">
                <Avatar name={task.ownerName} size="sm" />
                <div className="deadline-info">
                  <strong>{task.title}</strong>
                  <span className={task.isOverdue ? 'text-danger' : ''}>
                    {formatRelativeDate(task.dueDate)}
                  </span>
                </div>
                <span className={`badge badge--${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
