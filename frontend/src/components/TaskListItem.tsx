import { Link } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import type { Task, TaskStatus } from '../types';

interface TaskListItemProps {
  task: Task;
  onStatusUpdated: () => void;
  onError: (message: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString();
}

export function TaskListItem({ task, onStatusUpdated, onError }: TaskListItemProps) {
  const handleStatusChange = async (status: TaskStatus) => {
    try {
      await tasksApi.updateStatus(task.id, status);
      onStatusUpdated();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  return (
    <article className={`task-item priority-${task.priority.toLowerCase()}`}>
      <div className="task-item-main">
        <Link to={`/tasks/${task.id}`} className="task-title">
          {task.title}
        </Link>
        <p className="task-meta">
          <span className={`badge status-${task.status.toLowerCase()}`}>{task.status}</span>
          <span className="badge">{task.priority} priority</span>
          <span>{task.ownerName}</span>
          <span>Due {formatDate(task.dueDate)}</span>
          {task.isOverdue && <span className="badge overdue">Overdue</span>}
        </p>
      </div>
      <div className="task-actions">
        {task.status !== 'InProgress' && task.status !== 'Completed' && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleStatusChange('InProgress')}
          >
            Start
          </button>
        )}
        {task.status !== 'Completed' && (
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleStatusChange('Completed')}
          >
            Complete
          </button>
        )}
      </div>
    </article>
  );
}
