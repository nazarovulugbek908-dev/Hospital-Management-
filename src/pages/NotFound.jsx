import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button.jsx';

export function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fadeIn">
      <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-primary flex items-center justify-center text-3xl font-extrabold shadow-sm">
        404
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Page Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        The requested medical portal page does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-dark transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
