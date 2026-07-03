/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Synaptix-style welcome header + dashboard grid
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
import { useSearchFilter } from '../context/SearchFilterContext';
import { useToast } from '../context/ToastContext';
import type { DashboardSummary, Task } from '../types';

export function DashboardPage() {
  const { showSuccess } = useToast();
  const { filters, setFilters } = useSearchFilter();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
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
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => void loadData()} />;
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
          <WeeklyProgressChart tasks={tasks} />
        </section>
        {summary && (
          <div className="glass-card">
            <AiInsights summary={summary} tasks={tasks} />
          </div>
        )}
        <div className="glass-card">
          <RecentActivity tasks={tasks} />
        </div>
        <div className="glass-card">
          <UpcomingDeadlines tasks={tasks} />
        </div>
      </div>

      <section className="tasks-section glass-card">
        <h2 className="section-title">Tasks</h2>
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
      </section>
    </div>
  );
}
