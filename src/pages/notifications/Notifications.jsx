import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckCircle2,
  Info,
  AlertTriangle,
  X
} from 'lucide-react';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Button } from '../../components/common/Button.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';

export function Notifications() {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
  } = useHospital();
  const { t, lang } = useLanguage();
  const { showToast } = useToast();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifs = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const handleMarkAll = () => {
    markAllNotificationsAsRead();
    showToast(lang === 'uz' ? 'Barcha xabarlar o‘qildi deb belgilandi.' : 'All notifications marked as read.', 'success');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      case 'error':
        return <X className="w-5 h-5 text-rose-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />;
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>{t('notificationsTitle')}</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('notificationsSubtitle')}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            icon={CheckCheck}
            onClick={handleMarkAll}
          >
            {t('markAllRead')}
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t('allNotifications')} ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'unread'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          {t('unread')} ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifs.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={t('noNotifsTitle')}
          description={t('noNotifsDesc')}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                n.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 opacity-75'
                  : 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 shadow-sm'
              }`}
            >
              <div className="mt-0.5">{getIcon(n.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {n.message}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                  showToast(lang === 'uz' ? 'Xabar o‘chirildi.' : 'Notification removed.', 'info');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete notification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
