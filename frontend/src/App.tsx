/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — App providers including shared search filter
 */
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SearchFilterProvider } from './context/SearchFilterContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CreateTaskPage } from './pages/CreateTaskPage';
import { DashboardPage } from './pages/DashboardPage';
import { TaskDetailPage } from './pages/TaskDetailPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <SearchFilterProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<DashboardPage />} />
                <Route path="tasks/new" element={<CreateTaskPage />} />
                <Route path="tasks/:id" element={<TaskDetailPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SearchFilterProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
