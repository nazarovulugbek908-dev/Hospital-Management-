import React from 'react';
import { CheckCircle2, Circle, Clock, Tag, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Badge } from '../common/Badge.jsx';

export function TodoCard({ task, onToggle, onEdit, onDelete }) {
  const { t } = useLanguage();
  const isCompleted = task.status === 'Completed';

  const priorityVariants = {
    High: 'danger',
    Medium: 'warning',
    Low: 'neutral'
  };

  const statusVariants = {
    Todo: 'neutral',
    'In Progress': 'secondary',
    Completed: 'success'
  };

  const categoryColors = {
    Personal: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/50',
    Medical: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/50',
    Appointment: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/50',
    Study: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/50',
    Work: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/50',
    Other: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (onToggle) onToggle(task.id);
  };

  return (
    <div
      className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-md ${
        isCompleted
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-80 scale-[0.99]'
          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Checkbox */}
        <button
          type="button"
          onClick={handleToggleClick}
          className="mt-0.5 text-slate-400 hover:text-blue-600 transition-all flex-shrink-0"
          aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950 animate-fadeIn" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-600 transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`text-sm font-bold truncate transition-all ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {task.title}
            </h4>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {task.description && (
            <p
              className={`text-xs line-clamp-2 ${
                isCompleted
                  ? 'text-slate-400/80 dark:text-slate-600'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <Badge variant={priorityVariants[task.priority] || 'neutral'} size="sm" dot>
              {task.priority === 'High' ? t('priorityHigh') : task.priority === 'Medium' ? t('priorityMedium') : t('priorityLow')}
            </Badge>

            <Badge variant={statusVariants[task.status] || 'neutral'} size="sm">
              {task.status === 'Completed' ? t('taskCompleted') : task.status === 'In Progress' ? t('taskInProgress') : t('taskPending')}
            </Badge>

            {task.category && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                  categoryColors[task.category] || categoryColors.Other
                }`}
              >
                <Tag className="w-3 h-3" />
                {task.category}
              </span>
            )}

            {task.dueDate && (
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1 ml-auto">
                <Calendar className="w-3 h-3" />
                {task.dueDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
