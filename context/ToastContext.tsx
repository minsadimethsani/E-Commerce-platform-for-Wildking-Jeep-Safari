'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4500 }: Omit<ToastItem, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => {
        // Keep max 5 toasts visible at once
        const updated = [newToast, ...prev];
        return updated.slice(0, 5);
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'success', title, message, duration });
    },
    [showToast]
  );

  const showError = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'error', title, message, duration });
    },
    [showToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'warning', title, message, duration });
    },
    [showToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'info', title, message, duration });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Stack Container */}
      <div
        aria-live="assertive"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === 'success';
          const isError = t.type === 'error';
          const isWarning = t.type === 'warning';

          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full p-4 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 transform animate-in slide-in-from-top-5 sm:slide-in-from-right-5 fade-in flex items-start gap-3.5 relative overflow-hidden ${
                isSuccess
                  ? 'bg-[#061811]/95 border-emerald-500/50 text-white shadow-emerald-950/50'
                  : isError
                  ? 'bg-[#1c080c]/95 border-rose-500/50 text-white shadow-rose-950/50'
                  : isWarning
                  ? 'bg-[#1a1406]/95 border-amber-500/50 text-white shadow-amber-950/50'
                  : 'bg-[#081220]/95 border-cyan-500/50 text-white shadow-cyan-950/50'
              }`}
            >
              {/* Left Accent Bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isSuccess
                    ? 'bg-gradient-to-b from-emerald-400 to-teal-500'
                    : isError
                    ? 'bg-gradient-to-b from-rose-500 to-pink-600'
                    : isWarning
                    ? 'bg-gradient-to-b from-amber-400 to-orange-500'
                    : 'bg-gradient-to-b from-cyan-400 to-blue-500'
                }`}
              />

              {/* Icon Badge */}
              <div className="shrink-0 pt-0.5">
                {isSuccess && (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {isError && (
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {isWarning && (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
                {t.type === 'info' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Info className="w-5 h-5 stroke-[2.5]" />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 pr-3 space-y-0.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                  {t.title}
                </h4>
                {t.message && (
                  <p className="text-xs text-slate-300 font-medium leading-snug">
                    {t.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
