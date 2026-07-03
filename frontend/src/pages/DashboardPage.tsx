import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/dashboard';
import { tasksApi } from '../api/tasks';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { SearchFilter } from '../components/SearchFilter';
import { SummaryCards } from '../components/SummaryCards';
import { TaskList } from '../components/TaskList';
import { useToast } from '../context/ToastContext';
import type { DashboardSummary, Task, TaskFilters } from '../types';

export function DashboardPage() {
  const { showSuccess } = useToast();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({ search: '', status: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryData, tasksData] = await Promise.all([
        dashboardApi.getSummary(),
        tasksApi.getAll(filters),
      ]);
      setSummary(summaryData);
      setTasks(tasksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRefresh = async () => {
    await loadData();
    showSuccess('Dashboard updated');
  };

  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadData()} />;
  }

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track learning goals and project tasks</p>
        </div>
      </header>

      {summary && <SummaryCards summary={summary} />}

      <SearchFilter filters={filters} onChange={setFilters} />

      {tasks.length === 0 ? (
        <EmptyState
          action={
            <Link to="/tasks/new" className="btn btn-primary">
              Create your first task
            </Link>
          }
        />
      ) : (
        <TaskList
          tasks={tasks}
          onStatusUpdated={() => void loadData()}
          onError={(msg) => setError(msg)}
        />
      )}

      <div className="page-footer-actions">
        <button type="button" className="btn btn-secondary" onClick={() => void handleRefresh()}>
          Refresh
        </button>
      </div>
    </div>
  );
}
