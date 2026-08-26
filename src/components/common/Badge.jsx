// Badge Component for Appointment and Patient Statuses

import React from 'react';

export function StatusBadge({ status }) {
  const getStyle = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'completed':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'cancelled':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'active':
        return 'bg-teal-500/15 text-teal-400 border-teal-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  const getDotColor = () => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-emerald-400';
      case 'completed':
        return 'bg-blue-400';
      case 'pending':
        return 'bg-amber-400 animate-pulse';
      case 'cancelled':
        return 'bg-rose-400';
      case 'active':
        return 'bg-teal-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
      {status}
    </span>
  );
}

export function GenderBadge({ gender }) {
  const isFemale = gender?.toLowerCase() === 'female';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium ${
        isFemale
          ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
      }`}
    >
      {isFemale ? '♀ Female' : '♂ Male'}
    </span>
  );
}
