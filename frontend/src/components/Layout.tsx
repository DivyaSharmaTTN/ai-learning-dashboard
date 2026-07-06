/**
 * @branch feature/fix-search-debounce
 * @history 2026-07-06 — Removed duplicate topbar search; topbar shows page title only
 */
import {
  Bell,
  LayoutDashboard,
  ListTodo,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
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

export function Layout() {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

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
          <NavLink
            to="/tasks/new"
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
          >
            <ListTodo size={18} />
            New Task
          </NavLink>
        </nav>

        <div className="sidebar-promo glass-card">
          <div className="promo-glow" aria-hidden="true" />
          <Sparkles size={20} className="promo-icon" />
          <strong>Learning Pro</strong>
          <p>Unlock advanced AI insights and analytics</p>
          <Link to="/tasks/new" className="btn btn-primary btn-sm btn-block">
            Get Started
          </Link>
        </div>
      </aside>

      <div className="app-content">
        <header className="app-topbar glass-panel">
          <h1 className="topbar-title">{pageTitle}</h1>

          <div className="topbar-actions">
            <button type="button" className="icon-btn notification-btn" aria-label="Notifications">
              <Bell size={18} />
              <span className="notification-dot" />
            </button>
            <ThemeToggle />
            <div className="user-chip">
              <div className="user-avatar">AD</div>
              <div className="user-info">
                <span className="user-name">Alex Developer</span>
                <span className="user-role">Premium</span>
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
