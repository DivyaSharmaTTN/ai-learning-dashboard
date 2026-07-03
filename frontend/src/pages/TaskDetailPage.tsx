import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { usersApi } from '../api/users';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { TaskForm, taskToFormValues } from '../components/TaskForm';
import { useToast } from '../context/ToastContext';
import type { Task, User } from '../types';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const taskId = Number(id);
    if (Number.isNaN(taskId)) {
      setError('Invalid task id');
      setLoading(false);
      return;
    }

    Promise.all([tasksApi.getById(taskId), usersApi.getAll()])
      .then(([taskData, usersData]) => {
        setTask(taskData);
        setUsers(usersData);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load task'),
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingState message="Loading task..." />;
  if (error || !task) return <ErrorState message={error ?? 'Task not found'} />;

  return (
    <div className="page-container">
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
    </div>
  );
}
