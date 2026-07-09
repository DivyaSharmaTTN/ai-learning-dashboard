/**
 * @branch feature/stretch-filters-pagination
 * @history 2026-07-09 — Tests for paginated list and extended filters
 * @history 2026-07-06 — Tests for debounced list-only search
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SummaryCards } from '../components/SummaryCards';
import { TaskForm } from '../components/TaskForm';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import { DashboardPage } from '../pages/DashboardPage';
import type { DashboardSummary, Task, User } from '../types';

vi.mock('../api/dashboard', () => ({
  dashboardApi: { getSummary: vi.fn() },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

const mockUseAuth = vi.fn(() => ({
  user: { id: 4, name: 'Admin', email: 'admin@example.com', role: 'Admin' },
  token: 'test-token',
  isAuthenticated: true,
  isAdmin: true,
  isUser: false,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../api/tasks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/tasks')>();
  return {
    ...actual,
    tasksApi: {
      getAll: vi.fn(),
      getPaged: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
    },
  };
});

import { dashboardApi } from '../api/dashboard';
import { tasksApi } from '../api/tasks';

const mockUsers: User[] = [
  { id: 1, name: 'Alex Developer', email: 'alex@example.com', role: 'Developer' },
];

const mockSummary: DashboardSummary = {
  totalItems: 2,
  completedItems: 1,
  inProgressItems: 1,
  overdueItems: 0,
  highPriorityItems: 1,
};

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Learn React',
    description: 'Hooks',
    category: 'Learning',
    priority: 'High',
    status: 'InProgress',
    ownerId: 1,
    ownerName: 'Alex Developer',
    dueDate: '2026-08-01T00:00:00Z',
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z',
    isOverdue: false,
  },
];

const mockPagedResult = {
  items: mockTasks,
  totalCount: 1,
  page: 1,
  pageSize: 10,
  totalPages: 1,
};

function renderDashboard() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <ToastProvider>
          <DashboardPage />
        </ToastProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('SummaryCards', () => {
  it('displays counts from API summary', () => {
    render(
      <ThemeProvider>
        <SummaryCards summary={mockSummary} />
      </ThemeProvider>,
    );
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
  });
});

describe('TaskForm', () => {
  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <TaskForm
          users={mockUsers}
          submitLabel="Create"
          onSubmit={vi.fn()}
        />
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByText('Title is required.')).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <ThemeProvider>
        <TaskForm
          users={mockUsers}
          submitLabel="Create"
          onSubmit={onSubmit}
        />
      </ThemeProvider>,
    );

    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.type(screen.getByLabelText(/due date/i), '2026-12-01');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'New Task', ownerId: 1 }),
      );
    });
  });
});

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.mocked(dashboardApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(tasksApi.getAll).mockResolvedValue(mockTasks);
    vi.mocked(tasksApi.getPaged).mockResolvedValue(mockPagedResult);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders tasks from API', async () => {
    renderDashboard();

    expect(await screen.findByRole('link', { name: 'Learn React' })).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', async () => {
    vi.mocked(tasksApi.getPaged).mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    renderDashboard();

    expect(await screen.findByText(/no tasks yet/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create your first task' })).toBeInTheDocument();
  });

  it('shows user-specific empty state without create action', async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 5, name: 'User', email: 'user@example.com', role: 'User' },
      token: 'test-token',
      isAuthenticated: true,
      isAdmin: false,
      isUser: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(tasksApi.getPaged).mockResolvedValue({
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    });

    renderDashboard();

    expect(await screen.findByText(/no assigned tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/contact an admin/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Create your first task' })).not.toBeInTheDocument();

    mockUseAuth.mockReturnValue({
      user: { id: 4, name: 'Admin', email: 'admin@example.com', role: 'Admin' },
      token: 'test-token',
      isAuthenticated: true,
      isAdmin: true,
      isUser: false,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('updates status via quick action', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.mocked(tasksApi.updateStatus).mockResolvedValue({
      ...mockTasks[0],
      status: 'Completed',
    });

    renderDashboard();

    await screen.findByRole('link', { name: 'Learn React' });
    await user.click(screen.getByRole('button', { name: 'Complete' }));

    await waitFor(() => {
      expect(tasksApi.updateStatus).toHaveBeenCalledWith(1, 'Completed');
    });
  });

  it('debounces search and updates list without reloading summary', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderDashboard();
    await screen.findByRole('link', { name: 'Learn React' });

    const initialSummaryCalls = vi.mocked(dashboardApi.getSummary).mock.calls.length;
    const initialPagedCalls = vi.mocked(tasksApi.getPaged).mock.calls.length;

    const searchInput = screen.getByPlaceholderText(/search by title/i);
    await user.type(searchInput, 'react');

    // Before debounce: no extra list fetch
    expect(vi.mocked(tasksApi.getPaged).mock.calls.length).toBe(initialPagedCalls);
    expect(vi.mocked(dashboardApi.getSummary).mock.calls.length).toBe(initialSummaryCalls);

    await vi.advanceTimersByTimeAsync(400);

    await waitFor(() => {
      expect(vi.mocked(tasksApi.getPaged)).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'react', page: 1 }),
      );
    });
    expect(vi.mocked(dashboardApi.getSummary).mock.calls.length).toBe(initialSummaryCalls);
  });

  it('applies search immediately on Search button click', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderDashboard();
    await screen.findByRole('link', { name: 'Learn React' });

    const searchInput = screen.getByPlaceholderText(/search by title/i);
    await user.type(searchInput, 'hooks');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(vi.mocked(tasksApi.getPaged)).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'hooks', page: 1 }),
      );
    });
  });

  it('resets to page 1 when priority filter changes', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderDashboard();
    await screen.findByRole('link', { name: 'Learn React' });

    await user.selectOptions(screen.getByLabelText(/priority filter/i), 'High');

    await waitFor(() => {
      expect(vi.mocked(tasksApi.getPaged)).toHaveBeenCalledWith(
        expect.objectContaining({ priority: 'High', page: 1 }),
      );
    });
  });
});
