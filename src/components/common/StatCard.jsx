// StatCard Component for Doctor Dashboard metrics

import React from 'react';

export function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'emerald', onClick }) {
  const colorStyles = {
    emerald: {
      bg: 'from-emerald-500/10 to-teal-500/5',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      glow: 'group-hover:shadow-emerald-500/10'
    },
    blue: {
      bg: 'from-blue-500/10 to-indigo-500/5',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/20 text-blue-400',
      glow: 'group-hover:shadow-blue-500/10'
    },
    amber: {
      bg: 'from-amber-500/10 to-orange-500/5',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/20 text-amber-400',
      glow: 'group-hover:shadow-amber-500/10'
    },
    cyan: {
      bg: 'from-cyan-500/10 to-sky-500/5',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/20 text-cyan-400',
      glow: 'group-hover:shadow-cyan-500/10'
    },
    purple: {
      bg: 'from-purple-500/10 to-violet-500/5',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/20 text-purple-400',
      glow: 'group-hover:shadow-purple-500/10'
    }
  };

  const currentTheme = colorStyles[color] || colorStyles.emerald;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden bg-gradient-to-br ${currentTheme.bg} bg-slate-900/60 backdrop-blur-xl rounded-2xl border ${currentTheme.border} p-5 transition-all duration-300 hover:-translate-y-1 shadow-lg ${currentTheme.glow} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-3 rounded-xl ${currentTheme.iconBg} transition-transform group-hover:scale-110 duration-300`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {trend && (
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {trend} {trendLabel || ''}
          </span>
        )}
      </div>

      {/* Subtle shine effect */}
      <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-500" />
    </div>
  );
}
