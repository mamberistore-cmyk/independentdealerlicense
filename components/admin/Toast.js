'use client';

import { createContext, useContext, useCallback, useState } from 'react';
import Icon from './Icon';

const ToastContext = createContext({ notify: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

let idc = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const notify = useCallback(
    (message, type = 'success', duration = 3500) => {
      const id = ++idc;
      setToasts((t) => [...t, { id, message, type }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg animate-fade-up ${
              t.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-900/60 dark:bg-red-950/70 dark:text-red-200'
                : t.type === 'info'
                ? 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/70 dark:text-sky-200'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/70 dark:text-emerald-200'
            }`}
          >
            <span className="mt-0.5 shrink-0">
              <Icon name={t.type === 'error' ? 'warning' : t.type === 'info' ? 'info' : 'check'} className="h-4 w-4" />
            </span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 opacity-60 hover:opacity-100"
              aria-label="Dismiss"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
