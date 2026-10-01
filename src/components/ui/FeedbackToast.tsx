import type { ReactNode } from 'react';

type FeedbackToastVariant = 'error' | 'success' | 'info';

interface FeedbackToastProps {
  title: string;
  variant?: FeedbackToastVariant;
  onDismiss?: () => void;
  children?: ReactNode;
  id?: string;
  className?: string;
}

const variantStyles: Record<FeedbackToastVariant, { container: string; icon: string; symbol: string }> = {
  error: {
    container: 'border-rose-200 bg-rose-50 text-rose-900',
    icon: 'text-rose-600',
    symbol: 'error',
  },
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: 'text-emerald-600',
    symbol: 'check_circle',
  },
  info: {
    container: 'border-teal-200 bg-white text-slate-800',
    icon: 'text-teal-700',
    symbol: 'info',
  },
};

export function FeedbackToast({ title, variant = 'info', onDismiss, children, id, className = '' }: FeedbackToastProps) {
  const styles = variantStyles[variant];

  return (
    <div
      id={id}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={`flex items-start gap-3 rounded-lg border p-3 shadow-sm ${styles.container} ${className}`}
    >
      <span className={`material-symbols-outlined mt-0.5 shrink-0 text-[20px] ${styles.icon}`} aria-hidden="true">
        {styles.symbol}
      </span>
      <div className="min-w-0 flex-1">
        <p className="break-words text-[13px] font-semibold">{title}</p>
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="-mr-1 -mt-1 shrink-0 rounded-md p-1 text-current/70 transition-colors hover:bg-black/5 hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label="Tutup pemberitahuan"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
        </button>
      )}
    </div>
  );
}