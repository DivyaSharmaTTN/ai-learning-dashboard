/**
 * @branch feature/stretch-auth-rbac
 * @history 2026-07-09 — Modern responsive login UI with validation and password toggle
 */
import { Eye, EyeOff, Loader2, Lock, Mail, Zap } from 'lucide-react';
import { FormEvent, useId, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { useAuth } from '../context/AuthContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const formId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const validate = (): boolean => {
    const nextErrors: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Check your credentials and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isBusy = submitting || loading;

  return (
    <div className="login-page">
      <div className="login-bg-glow" aria-hidden="true" />
      <div className="login-bg-grid" aria-hidden="true" />

      <header className="login-topbar">
        <div className="login-brand-mark" aria-hidden="true">
          <Zap size={18} />
        </div>
        <ThemeToggle />
      </header>

      <main className="login-main">
        <div className="login-card glass-panel">
          <div className="login-header">
            <div className="login-logo" aria-hidden="true">
              <Zap size={28} />
            </div>
            <p className="login-eyebrow">AI Learning Dashboard</p>
            <h1 id={`${formId}-title`}>Welcome back</h1>
            <p className="login-subtitle">Sign in to manage your learning goals and tasks</p>
          </div>

          <form
            className="login-form"
            onSubmit={(e) => void handleSubmit(e)}
            aria-labelledby={`${formId}-title`}
            noValidate
          >
            <div className={`login-field ${fieldErrors.email ? 'login-field--error' : ''}`}>
              <label htmlFor={`${formId}-email`}>Email address</label>
              <div className="login-input-wrap">
                <Mail size={18} className="login-input-icon" aria-hidden="true" />
                <input
                  id={`${formId}-email`}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="you@example.com"
                  autoComplete="username"
                  inputMode="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined}
                  disabled={isBusy}
                />
              </div>
              {fieldErrors.email && (
                <p id={`${formId}-email-error`} className="login-field-error" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className={`login-field ${fieldErrors.password ? 'login-field--error' : ''}`}>
              <label htmlFor={`${formId}-password`}>Password</label>
              <div className="login-input-wrap">
                <Lock size={18} className="login-input-icon" aria-hidden="true" />
                <input
                  id={`${formId}-password`}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={fieldErrors.password ? `${formId}-password-error` : undefined}
                  disabled={isBusy}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  disabled={isBusy}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p id={`${formId}-password-error`} className="login-field-error" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {error && (
              <div className="login-alert" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-block login-submit"
              disabled={isBusy}
              aria-busy={isBusy}
            >
              {isBusy ? (
                <>
                  <Loader2 size={18} className="login-spinner" aria-hidden="true" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <details className="login-demo">
            <summary>Demo accounts</summary>
            <ul>
              <li>
                <strong>Admin</strong> — full dashboard and task management
                <span>admin@example.com / Admin123!</span>
              </li>
              <li>
                <strong>User</strong> — assigned tasks and status updates only
                <span>user@example.com / User123!</span>
              </li>
            </ul>
          </details>
        </div>

        <p className="login-footer-note">
          Task creation is restricted to Admin accounts. User accounts can view assigned tasks and
          update status.
        </p>
      </main>
    </div>
  );
}
