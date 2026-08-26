import React from 'react';
import { Inbox, Loader2 } from 'lucide-react';
import { Button } from './Button.jsx';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ message = 'Loading healthcare data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
