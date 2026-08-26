import React from 'react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  color = 'primary', // 'primary' | 'secondary' | 'success' | 'warning'
  onClick
}) {
  const iconColorStyles = {
    primary: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50',
    secondary: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50',
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50',
    amber: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50',
    cyan: 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/50',
    purple: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50'
  };

  const trendStyles = {
    up: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60',
    down: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60',
    neutral: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
          {title}
        </span>
        <div className={`p-2.5 rounded-2xl ${iconColorStyles[color] || iconColorStyles.primary} flex-shrink-0 transition-transform group-hover:scale-110`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {trend && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${trendStyles[trendType] || trendStyles.neutral} flex-shrink-0`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
