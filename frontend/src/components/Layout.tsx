/**
 * @branch feature/task-notifications
 * @history 2026-07-13 — Wire NotificationBell into topbar
 * @branch feature/stretch-auth-rbac
 * @history 2026-07-09 — Dynamic user display, logout, role-based nav
 */
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';
import { ThemeToggle } from './ui/ThemeToggle';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/tasks/new': 'New Task',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }
  if (pathname.startsWith('/tasks/')) {
    return 'Task Details';
  }
  return 'Dashboard';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Layout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="app-shell">
      <div className="app-bg-glow" aria-hidden="true" />

      <aside className="app-sidebar glass-panel">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <Zap size={18} />
          </span>
          <span className="brand-text">Dashboard</span>
        </Link>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          {isAdmin && (
            <NavLink
              to="/tasks/new"
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              <ListTodo size={18} />
              New Task
            </NavLink>
          )}
        </nav>

        {isAdmin && (
          <div className="sidebar-promo glass-card">
            <div className="promo-glow" aria-hidden="true" />
            <Sparkles size={20} className="promo-icon" />
            <strong>Learning Pro</strong>
            <p>Unlock advanced AI insights and analytics</p>
            <Link to="/tasks/new" className="btn btn-primary btn-sm btn-block">
              Get Started
            </Link>
          </div>
        )}
      </aside>

      <div className="app-content">
        <header className="app-topbar glass-panel">
          <h1 className="topbar-title">{pageTitle}</h1>

          <div className="topbar-actions">
            <NotificationBell />
            <ThemeToggle />
            <button type="button" className="icon-btn" aria-label="Sign out" onClick={logout}>
              <LogOut size={18} />
            </button>
            <div className="user-chip">
              <div className="user-avatar">{user ? getInitials(user.name) : '?'}</div>
              <div className="user-info">
                <span className="user-name">{user?.name ?? 'User'}</span>
                <span className="user-role">{user?.role ?? ''}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
