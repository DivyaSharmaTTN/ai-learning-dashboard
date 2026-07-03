/**
 * @branch feature/modern-ai-dashboard-ui
 * @history 2026-07-03 — Toast with smooth enter/exit transitions
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastContextValue {
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const showSuccess = useCallback((text: string) => {
    setMessage(text);
    setVisible(true);
    window.setTimeout(() => setVisible(false), 2800);
    window.setTimeout(() => setMessage(null), 3200);
  }, []);

  const value = useMemo(() => ({ showSuccess }), [showSuccess]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <div
          className={`toast success-toast ${visible ? 'toast--visible' : 'toast--hidden'}`}
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
