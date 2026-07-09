/**
 * @branch feature/stretch-filters-pagination
 * @history 2026-07-09 — Paginated task list with priority/category filters
 * @history 2026-07-06 — Split dashboard load vs debounced list-only search
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, Sparkles, Upload } from 'lucide-react';
import { dashboardApi } from '../api/dashboard';
import { DEFAULT_PAGE_SIZE, tasksApi } from '../api/tasks';
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
import { TaskPagination } from '../components/TaskPagination';
import { DashboardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../context/ToastContext';
import type {
  DashboardSummary,
  Task,
  TaskCategory,
  TaskFilters,
  TaskPriority,
  TaskStatus,
} from '../types';

export function DashboardPage() {
  const { showSuccess } = useToast();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [panelTasks, setPanelTasks] = useState<Task[]>([]);
  const [listTasks, setListTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [dashboardReady, setDashboardReady] = useState(false);

  const listFilters = useMemo<TaskFilters>(
    () => ({
      search: searchQuery,
      status: statusFilter,
      priority: priorityFilter,
      category: categoryFilter,
      page,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
    [searchQuery, statusFilter, priorityFilter, categoryFilter, page],
  );

  const hasActiveFilters = Boolean(
    searchQuery || statusFilter || priorityFilter || categoryFilter,
  );

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
      const result = await tasksApi.getPaged(filters);
      setListTasks(result.items);
      setTotalCount(result.totalCount);
      setTotalPages(result.totalPages);
      setPage(result.page);
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
    void loadTaskList(listFilters);
  }, [dashboardReady, listFilters, loadTaskList]);

  const handleSearchApply = useCallback((search: string) => {
    setSearchQuery(search.trim());
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((status: TaskStatus | '') => {
    setStatusFilter(status);
    setPage(1);
  }, []);

  const handlePriorityChange = useCallback((priority: TaskPriority | '') => {
    setPriorityFilter(priority);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: TaskCategory | '') => {
    setCategoryFilter(category);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setStatusFilter('');
    setPriorityFilter('');
    setCategoryFilter('');
    setPage(1);
  }, []);

  const handlePageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const handleRefresh = async () => {
    await loadDashboard();
    await loadTaskList(listFilters);
    showSuccess('Dashboard updated');
  };

  const handleStatusUpdated = async () => {
    await loadDashboard();
    await loadTaskList(listFilters);
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
          priority={priorityFilter}
          category={categoryFilter}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onCategoryChange={handleCategoryChange}
          onSearchApply={handleSearchApply}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
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
            message={
              hasActiveFilters
                ? 'No tasks match your filters. Try adjusting search or filters.'
                : undefined
            }
            action={
              hasActiveFilters ? (
                <button type="button" className="btn btn-secondary" onClick={handleClearFilters}>
                  Clear filters
                </button>
              ) : (
                <Link to="/tasks/new" className="btn btn-primary">
                  Create your first task
                </Link>
              )
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
            <TaskPagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={DEFAULT_PAGE_SIZE}
              onPageChange={handlePageChange}
              loading={listLoading}
            />
          </div>
        )}
      </section>
    </div>
  );
}
