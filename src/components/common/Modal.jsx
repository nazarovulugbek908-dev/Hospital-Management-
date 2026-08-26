import React, { useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from './Button.jsx';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full ${maxWidth} transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 text-left shadow-2xl transition-all z-10`}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-start justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              {title && (
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
            {showClose && (
              <button
                onClick={onClose}
                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={false}>
      <div className="text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{message}</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
