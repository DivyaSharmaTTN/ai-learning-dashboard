/**
 * @branch feature/fix-search-debounce
 * @history 2026-07-06 — Split dashboard load vs debounced list-only search
 */
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Sparkles, Upload } from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { tasksApi } from '../api/tasks';
import { AiInsights } from '../components/dashboard/AiInsights';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { TaskStatusChart } from '../components/dashboard/TaskStatusChart';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { WeeklyProgressChart } from '../components/dashboard/WeeklyProgressChart';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { SearchFilter } from '../components/SearchFilter';
import { SummaryCards } from '../components/SummaryCards';
import { TaskList } from '../components/TaskList';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import type { DashboardSummary, Task, TaskFilters, TaskStatus } from '../types';

export function DashboardPage() {
  const { showSuccess } = useToast();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [panelTasks, setPanelTasks] = useState<Task[]>([]);
  const [listTasks, setListTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [dashboardReady, setDashboardReady] = useState(false);

  const loadDashboard = useCallback(async () => {
    setInitialLoading(true);
    setError(null);
    try {
      const [summaryData, allTasks] = await Promise.all([
        dashboardApi.getSummary(),
        tasksApi.getAll({}),
      ]);
      setSummary(summaryData);
      setPanelTasks(allTasks);
      setDashboardReady(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setInitialLoading(false);
    }
  }, []);

  const loadTaskList = useCallback(async (filters: TaskFilters) => {
    setListLoading(true);
    setListError(null);
    try {
      const tasksData = await tasksApi.getAll(filters);
      setListTasks(tasksData);
    } catch (err) {
      setListError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (!dashboardReady) {
      return;
    }
    void loadTaskList({ search: searchQuery, status: statusFilter });
  }, [dashboardReady, searchQuery, statusFilter, loadTaskList]);

  const handleSearchApply = useCallback((search: string) => {
    setSearchQuery(search.trim());
  }, []);

  const handleStatusChange = useCallback((status: TaskStatus | '') => {
    setStatusFilter(status);
  }, []);

  const handleRefresh = async () => {
    await loadDashboard();
    await loadTaskList({ search: searchQuery, status: statusFilter });
    showSuccess('Dashboard updated');
  };

  const handleStatusUpdated = async () => {
    await loadDashboard();
    await loadTaskList({ search: searchQuery, status: statusFilter });
  };

  if (initialLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadDashboard()} />;
  }

  return (
    <div className="dashboard-page page-enter">
      <header className="welcome-header">
        <div>
          <h1>Welcome back, Alex</h1>
          <p>Track learning goals and project tasks with AI-powered insights</p>
        </div>
        <div className="header-pills">
          <span className="pill pill--active">
            <Sparkles size={14} />
            AI Active
          </span>
          <Link to="/tasks/new" className="pill pill--ghost">
            <Plus size={14} />
            New Task
          </Link>
          <button type="button" className="pill pill--ghost" onClick={() => void handleRefresh()}>
            <RefreshCw size={14} />
            Refresh
          </button>
          <button type="button" className="pill pill--ghost" disabled title="Coming soon">
            <Upload size={14} />
            Export
          </button>
        </div>
      </header>

      {summary && <SummaryCards summary={summary} />}

      <div className="dashboard-grid">
        <section className="chart-section glass-card">
          <h2 className="section-title">Task Status</h2>
          {summary && <TaskStatusChart summary={summary} />}
        </section>
        <section className="chart-section glass-card">
          <h2 className="section-title">Weekly Progress</h2>
          <WeeklyProgressChart tasks={panelTasks} />
        </section>
        {summary && (
          <div className="glass-card">
            <AiInsights summary={summary} tasks={panelTasks} />
          </div>
        )}
        <div className="glass-card">
          <RecentActivity tasks={panelTasks} />
        </div>
        <div className="glass-card">
          <UpcomingDeadlines tasks={panelTasks} />
        </div>
      </div>

      <section className="tasks-section glass-card" aria-busy={listLoading}>
        <h2 className="section-title">Tasks</h2>
        <SearchFilter
          status={statusFilter}
          onStatusChange={handleStatusChange}
          onSearchApply={handleSearchApply}
          listLoading={listLoading}
        />

        {listError && (
          <p className="list-error" role="alert">
            {listError}
          </p>
        )}

        {listLoading && listTasks.length === 0 ? (
          <div className="list-loading" role="status">
            <div className="spinner" aria-hidden="true" />
            <p>Searching tasks...</p>
          </div>
        ) : listTasks.length === 0 ? (
          <EmptyState
            action={
              <Link to="/tasks/new" className="btn btn-primary">
                Create your first task
              </Link>
            }
          />
        ) : (
          <div className={`task-list-wrapper ${listLoading ? 'task-list-wrapper--loading' : ''}`}>
            {listLoading && (
              <div className="list-loading-overlay" aria-hidden="true">
                <div className="spinner" />
              </div>
            )}
            <TaskList
              tasks={listTasks}
              onStatusUpdated={() => void handleStatusUpdated()}
              onError={(msg) => setListError(msg)}
            />
          </div>
        )}
      </section>
    </div>
  );
}
