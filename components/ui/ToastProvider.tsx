'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  id?: number;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: Omit<ToastOptions, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (options: Omit<ToastOptions, 'id'>) => {
      const id = Date.now();
      const toast: ToastOptions = {
        id,
        type: options.type ?? 'info',
        duration: options.duration ?? 3000,
        ...options,
      };

      setToasts((prev) => [...prev, toast]);

      // auto close
      setTimeout(() => removeToast(id), toast.duration);
    },
    [removeToast]
  );

  const getTypeClasses = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-600 text-white border-emerald-500';
      case 'error':
        return 'bg-red-600 text-white border-red-500';
      case 'warning':
        return 'bg-amber-500 text-white border-amber-400';
      default:
        return 'bg-slate-800 text-slate-50 border-slate-700';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed z-[9999] top-4 right-4 space-y-3 w-[320px] max-w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`border rounded-xl shadow-lg px-4 py-3 flex flex-col gap-1 animate-fade-in-up ${getTypeClasses(
              toast.type ?? 'info'
            )}`}
          >
            {toast.title && (
              <p className="font-semibold text-sm">{toast.title}</p>
            )}
            <p className="text-sm">{toast.message}</p>
            <button
              onClick={() => toast.id && removeToast(toast.id)}
              className="self-end text-xs mt-1 opacity-80 hover:opacity-100"
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
