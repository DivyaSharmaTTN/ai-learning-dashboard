/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Task cards with progress bar, avatar, badges, and actions
 */
import { ArrowRight, Check, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import type { Task, TaskStatus } from '../types';
import { formatRelativeDate, getTaskProgress } from '../utils/dashboardAnalytics';
import { Avatar } from './ui/Avatar';

interface TaskListItemProps {
  task: Task;
  onStatusUpdated: () => void;
  onError: (message: string) => void;
}

export function TaskListItem({ task, onStatusUpdated, onError }: TaskListItemProps) {
  const progress = getTaskProgress(task.status);

  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await tasksApi.updateStatus(task.id, status);
      onStatusUpdated();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <article
      className={`task-item priority-${task.priority.toLowerCase()}`}
      style={{ animationDelay: `${(task.id % 5) * 60}ms` }}
    >
      <div className="task-item-left">
        <Avatar name={task.ownerName} size="md" />
      </div>

      <div className="task-item-main">
        <div className="task-item-header">
          <Link to={`/tasks/${task.id}`} className="task-title">
            {task.title}
          </Link>
          <span className="task-category">{task.category}</span>
        </div>

        <div className="task-badges">
          <span className={`badge status-${task.status.toLowerCase()}`}>
            {task.status === 'NotStarted' ? 'Not Started' : task.status === 'InProgress' ? 'In Progress' : 'Completed'}
          </span>
          <span className={`badge badge--${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          {task.isOverdue && <span className="badge badge--overdue">Overdue</span>}
        </div>

        <div className="task-progress">
          <div className="progress-track">
            <div
              className={`progress-fill status-${task.status.toLowerCase()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-label">{progress}%</span>
        </div>

        <p className="task-meta">
          <span>{task.ownerName}</span>
          <span>·</span>
          <span>{formatRelativeDate(task.dueDate)}</span>
        </p>
      </div>

      <div className="task-actions">
        {task.status !== 'InProgress' && task.status !== 'Completed' && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => handleStatusChange('InProgress')}
            title="Start task"
          >
            <Play size={16} />
            Start
          </button>
        )}
        {task.status !== 'Completed' && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleStatusChange('Completed')}
            title="Complete task"
          >
            <Check size={16} />
            Complete
          </button>
        )}
        <Link to={`/tasks/${task.id}`} className="btn btn-ghost btn-sm" title="View details">
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
