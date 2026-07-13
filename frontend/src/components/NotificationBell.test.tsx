/**
 * @branch feature/task-notifications
 * @history 2026-07-13 — NotificationBell dropdown and navigation tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotificationBell } from './NotificationBell';
import type { Notification } from '../types';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../api/notifications', () => ({
  notificationsApi: {
    getAll: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  },
}));

import { notificationsApi } from '../api/notifications';

const mockNotifications: Notification[] = [
  {
    id: 1,
    recipientUserId: 5,
    taskId: 42,
    message: 'A new task has been assigned to you.',
    type: 'TaskAssigned',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    recipientUserId: 5,
    taskId: 43,
    message: 'User started Admin Task.',
    type: 'TaskStarted',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(notificationsApi.getUnreadCount).mockResolvedValue({ count: 1 });
    vi.mocked(notificationsApi.getAll).mockResolvedValue(mockNotifications);
    vi.mocked(notificationsApi.markAsRead).mockResolvedValue(undefined);
    vi.mocked(notificationsApi.markAllAsRead).mockResolvedValue(undefined);
  });

  function renderBell() {
    return render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<NotificationBell />} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it('shows unread badge when unread count is greater than zero', async () => {
    renderBell();

    await waitFor(() => {
      expect(notificationsApi.getUnreadCount).toHaveBeenCalled();
    });

    expect(document.querySelector('.notification-dot')).toBeTruthy();
  });

  it('opens dropdown and lists notifications', async () => {
    const user = userEvent.setup();
    renderBell();

    await user.click(screen.getByRole('button', { name: 'Notifications' }));

    expect(await screen.findByText('A new task has been assigned to you.')).toBeInTheDocument();
    expect(screen.getByText('User started Admin Task.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /mark all read/i })).toBeInTheDocument();
  });

  it('navigates to related task and marks notification as read on click', async () => {
    const user = userEvent.setup();
    renderBell();

    await user.click(screen.getByRole('button', { name: 'Notifications' }));
    await user.click(await screen.findByText('A new task has been assigned to you.'));

    expect(notificationsApi.markAsRead).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/tasks/42');
  });

  it('marks all notifications as read', async () => {
    const user = userEvent.setup();
    renderBell();

    await user.click(screen.getByRole('button', { name: 'Notifications' }));
    await user.click(await screen.findByRole('button', { name: /mark all read/i }));

    expect(notificationsApi.markAllAsRead).toHaveBeenCalled();
  });
});
