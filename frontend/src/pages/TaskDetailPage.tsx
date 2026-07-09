/**
 * @branch feature/stretch-activity-log
 * @history 2026-07-09 — Activity history panel on task detail page
 * @history 2026-07-03 — Styled task detail page (feature/modern-ai-dashboard-ui)
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { activityApi } from '../api/activity';
import { usersApi } from '../api/users';
import { ActivityHistory } from '../components/ActivityHistory';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { TaskForm, taskToFormValues } from '../components/TaskForm';
import { useToast } from '../context/ToastContext';
import type { ActivityLog, Task, User } from '../types';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTask = useCallback(() => {
    const taskId = Number(id);
    if (Number.isNaN(taskId)) {
      setError('Invalid task id');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    Promise.all([tasksApi.getById(taskId), usersApi.getAll(), activityApi.getByTaskId(taskId)])
      .then(([taskData, usersData, logs]) => {
        setTask(taskData);
        setUsers(usersData);
        setActivityLogs(logs);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load task'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    void loadTask();
  }, [loadTask]);

  if (loading) return <LoadingState message="Loading task..." />;
  if (error || !task) {
    return (
      <ErrorState
        message={error ?? 'Task not found'}
        onRetry={error ? () => void loadTask() : undefined}
      />
    );
  }

  return (
    <div className="page-container page-enter">
      <header className="page-header">
        <h1>Task Details</h1>
        <p>
          Created {new Date(task.createdAt).toLocaleString()} · Updated{' '}
          {new Date(task.updatedAt).toLocaleString()}
        </p>
      </header>
      <TaskForm
        users={users}
        initialValues={taskToFormValues(task)}
        submitLabel="Save Changes"
        onCancel={() => navigate('/')}
        onSubmit={async (payload) => {
          await tasksApi.update(task.id, payload);
          showSuccess('Task updated successfully');
          navigate('/');
        }}
      />

      <ActivityHistory logs={activityLogs} />
    </div>
  );
}
