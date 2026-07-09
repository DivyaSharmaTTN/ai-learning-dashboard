/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Styled create task page
 */
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksApi } from '../api/tasks';
import { usersApi } from '../api/users';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { TaskForm } from '../components/TaskForm';
import { useToast } from '../context/ToastContext';
import type { User } from '../types';

export function CreateTaskPage() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    usersApi
      .getAll()
      .then(setUsers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load users'),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  if (loading) return <LoadingState message="Loading form..." />;
  if (error) return <ErrorState message={error} onRetry={() => void loadUsers()} />;

  return (
    <div className="page-container page-enter">
      <header className="page-header">
        <h1>Create Task</h1>
        <p>Add a new learning goal or project item</p>
      </header>
      <TaskForm
        users={users}
        submitLabel="Create Task"
        onCancel={() => navigate('/')}
        onSubmit={async (payload) => {
          await tasksApi.create(payload);
          showSuccess('Task created successfully');
          navigate('/');
        }}
      />
    </div>
  );
}
