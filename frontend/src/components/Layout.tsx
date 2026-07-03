import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            AI Learning Dashboard
          </Link>
          <nav className="main-nav">
            <Link to="/">Dashboard</Link>
            <Link to="/tasks/new" className="btn btn-primary">
              New Task
            </Link>
          </nav>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
