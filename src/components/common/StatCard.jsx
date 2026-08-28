import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  title,
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'up',
  trendUp,
  color = 'primary',
  onClick
}) {
  // Support both "label" and "title" props
  const displayTitle = title || label || '';
  // Support both "trendType" and "trendUp" props
  const resolvedTrendType = trendUp !== undefined ? (trendUp ? 'up' : 'down') : trendType;

  const colorConfig = {
    primary:   { bg: 'from-blue-500 to-blue-600',     light: 'bg-blue-50 dark:bg-blue-950/40',     text: 'text-blue-600 dark:text-blue-400',     border: 'border-blue-200/60 dark:border-blue-800/50',     glow: 'shadow-blue-500/10' },
    blue:      { bg: 'from-blue-500 to-indigo-600',    light: 'bg-blue-50 dark:bg-blue-950/40',     text: 'text-blue-600 dark:text-blue-400',     border: 'border-blue-200/60 dark:border-blue-800/50',     glow: 'shadow-blue-500/10' },
    emerald:   { bg: 'from-emerald-500 to-teal-600',   light: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200/60 dark:border-emerald-800/50', glow: 'shadow-emerald-500/10' },
    success:   { bg: 'from-emerald-500 to-teal-600',   light: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200/60 dark:border-emerald-800/50', glow: 'shadow-emerald-500/10' },
    amber:     { bg: 'from-amber-500 to-orange-600',   light: 'bg-amber-50 dark:bg-amber-950/40',   text: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-200/60 dark:border-amber-800/50',   glow: 'shadow-amber-500/10' },
    warning:   { bg: 'from-amber-500 to-orange-600',   light: 'bg-amber-50 dark:bg-amber-950/40',   text: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-200/60 dark:border-amber-800/50',   glow: 'shadow-amber-500/10' },
    indigo:    { bg: 'from-indigo-500 to-violet-600',   light: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200/60 dark:border-indigo-800/50', glow: 'shadow-indigo-500/10' },
    secondary: { bg: 'from-sky-500 to-cyan-600',       light: 'bg-sky-50 dark:bg-sky-950/40',       text: 'text-sky-600 dark:text-sky-400',       border: 'border-sky-200/60 dark:border-sky-800/50',       glow: 'shadow-sky-500/10' },
    cyan:      { bg: 'from-sky-500 to-cyan-600',       light: 'bg-sky-50 dark:bg-sky-950/40',       text: 'text-sky-600 dark:text-sky-400',       border: 'border-sky-200/60 dark:border-sky-800/50',       glow: 'shadow-sky-500/10' },
    purple:    { bg: 'from-purple-500 to-fuchsia-600',  light: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200/60 dark:border-purple-800/50', glow: 'shadow-purple-500/10' },
  };

  const c = colorConfig[color] || colorConfig.primary;

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border ${c.border} p-5 sm:p-6 shadow-sm hover:shadow-lg ${c.glow} transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      {/* Decorative gradient accent line at top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.bg} opacity-80`} />

      {/* Background decoration */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${c.light} opacity-60 blur-2xl pointer-events-none transition-transform duration-500 group-hover:scale-150`} />

      <div className="relative z-10">
        {/* Header row: title + icon */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${c.text}`}>
            {displayTitle}
          </span>
          <div className={`p-2.5 rounded-2xl ${c.light} ${c.text} flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
            {Icon && <Icon className="w-5 h-5" strokeWidth={2.2} />}
          </div>
        </div>

        {/* Value */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
              {value}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {trend && (
            <span className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-xl ${c.light} ${c.text} flex-shrink-0`}>
              {resolvedTrendType === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
