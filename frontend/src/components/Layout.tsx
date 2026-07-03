/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Synaptix-inspired glass sidebar + topbar
 */
import {
  Bell,
  LayoutDashboard,
  ListTodo,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSearchFilter } from '../context/SearchFilterContext';
import { ThemeToggle } from './ui/ThemeToggle';

export function Layout() {
  const { setSearch } = useSearchFilter();
  const location = useLocation();
  const isDashboard = location.pathname === '/';

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
          <div className="topbar-search">
            <Search size={18} className="topbar-search-icon" aria-hidden="true" />
            <input
              type="search"
              className="topbar-search-input"
              placeholder="Search tasks, projects, or learning goals..."
              onChange={(e) => isDashboard && setSearch(e.target.value)}
              disabled={!isDashboard}
              aria-label="Search tasks"
            />
          </div>

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
