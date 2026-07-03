import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SummaryCards } from '../components/SummaryCards';
import { TaskForm } from '../components/TaskForm';
import { ToastProvider } from '../context/ToastContext';
import { DashboardPage } from '../pages/DashboardPage';
import type { DashboardSummary, Task, User } from '../types';

vi.mock('../api/dashboard', () => ({
  dashboardApi: { getSummary: vi.fn() },
}));

vi.mock('../api/tasks', () => ({
  tasksApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
  },
}));

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

describe('SummaryCards', () => {
  it('displays counts from API summary', () => {
    render(<SummaryCards summary={mockSummary} />);
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
  });
});

describe('TaskForm', () => {
  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup();
    render(
      <TaskForm
        users={mockUsers}
        submitLabel="Create"
        onSubmit={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(screen.getByText('Title is required.')).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(
      <TaskForm
        users={mockUsers}
        submitLabel="Create"
        onSubmit={onSubmit}
      />,
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
    vi.mocked(dashboardApi.getSummary).mockResolvedValue(mockSummary);
    vi.mocked(tasksApi.getAll).mockResolvedValue(mockTasks);
  });

  it('renders tasks from API', async () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <DashboardPage />
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText('Learn React')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', async () => {
    vi.mocked(tasksApi.getAll).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ToastProvider>
          <DashboardPage />
        </ToastProvider>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/no tasks found/i)).toBeInTheDocument();
  });

  it('updates status via quick action', async () => {
    const user = userEvent.setup();
    vi.mocked(tasksApi.updateStatus).mockResolvedValue({
      ...mockTasks[0],
      status: 'Completed',
    });

    render(
      <MemoryRouter>
        <ToastProvider>
          <DashboardPage />
        </ToastProvider>
      </MemoryRouter>,
    );

    await screen.findByText('Learn React');
    await user.click(screen.getByRole('button', { name: 'Complete' }));

    await waitFor(() => {
      expect(tasksApi.updateStatus).toHaveBeenCalledWith(1, 'Completed');
    });
  });
});
