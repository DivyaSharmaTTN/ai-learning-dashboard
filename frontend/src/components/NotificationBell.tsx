/**
 * @branch feature/task-notifications
 * @history 2026-07-13 — Bell dropdown for persisted in-app notifications
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationsApi } from '../api/notifications';
import type { Notification } from '../types';

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const result = await notificationsApi.getUnreadCount();
      setUnreadCount(result.count);
    } catch {
      // Keep previous count on transient failures
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const items = await notificationsApi.getAll();
      setNotifications(items);
      setUnreadCount(items.filter((n) => !n.isRead).length);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUnreadCount();
    const interval = window.setInterval(() => {
      void refreshUnreadCount();
    }, 30000);
    return () => window.clearInterval(interval);
  }, [refreshUnreadCount]);

  useEffect(() => {
    if (!open) return;

    void loadNotifications();

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, loadNotifications]);

  async function handleToggle() {
    setOpen((prev) => !prev);
  }

  async function handleNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      try {
        await notificationsApi.markAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Still navigate even if mark-read fails
      }
    }

    setOpen(false);
    navigate(`/tasks/${notification.taskId}`);
  }

  async function handleMarkAllRead() {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Ignore transient failures
    }
  }

  return (
    <div className="notification-bell" ref={rootRef}>
      <button
        type="button"
        className="icon-btn notification-btn"
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => void handleToggle()}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-dot" aria-hidden="true" />}
      </button>

      {open && (
        <div className="notification-dropdown glass-panel" role="menu">
          <div className="notification-dropdown-header">
            <strong>Notifications</strong>
            {unreadCount > 0 && (
              <button type="button" className="notification-mark-all" onClick={() => void handleMarkAllRead()}>
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-dropdown-list">
            {loading && <p className="notification-empty">Loading…</p>}
            {!loading && notifications.length === 0 && (
              <p className="notification-empty">No notifications yet.</p>
            )}
            {!loading &&
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  role="menuitem"
                  className={`notification-item ${notification.isRead ? '' : 'notification-item--unread'}`}
                  onClick={() => void handleNotificationClick(notification)}
                >
                  <span className="notification-item-message">{notification.message}</span>
                  <span className="notification-item-time">{formatRelativeTime(notification.createdAt)}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
