import { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface ToastContextValue {
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showSuccess = useCallback((text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(null), 3000);
  }, []);

  const value = useMemo(() => ({ showSuccess }), [showSuccess]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <div className="toast success-toast" role="status" aria-live="polite">
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
