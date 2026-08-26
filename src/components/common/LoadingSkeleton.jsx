// LoadingSkeleton Component for Doctor Panel UI loading states

import React from 'react';

export function StatSkeleton() {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-slate-800 rounded w-24"></div>
        <div className="h-10 w-10 bg-slate-800 rounded-xl"></div>
      </div>
      <div className="mt-4 h-8 bg-slate-800 rounded w-16"></div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 animate-pulse">
      <div className="h-10 bg-slate-800/80 rounded-xl mb-4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/50">
          <div className="flex items-center space-x-3 w-1/4">
            <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
            <div className="h-4 bg-slate-800 rounded w-28"></div>
          </div>
          <div className="h-4 bg-slate-800 rounded w-20"></div>
          <div className="h-4 bg-slate-800 rounded w-24"></div>
          <div className="h-6 bg-slate-800 rounded-full w-20"></div>
          <div className="h-8 bg-slate-800 rounded-lg w-16"></div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3'
  };

  return (
    <div
      className={`inline-block ${sizes[size]} border-teal-500 border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}
