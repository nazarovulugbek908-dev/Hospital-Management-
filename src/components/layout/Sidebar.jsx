import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CalendarCheck,
  Calendar,
  FileText,
  CheckSquare,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  PhoneCall,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Avatar } from '../common/Badge.jsx';

export function Sidebar({ collapsed, onToggleCollapse }) {
  const { patient, logout } = useAuth();
  const { stats, tasks, notifications } = useHospital();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const pendingTasksCount = tasks.filter(t => t.status !== 'Completed').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const clinicalNav = [
    { label: t('dashboard'), to: '/patient/dashboard', icon: LayoutDashboard },
    { label: t('findDoctors'), to: '/patient/doctors', icon: UserCheck },
    { label: t('bookVisit'), to: '/patient/book-appointment', icon: CalendarCheck },
    { label: t('appointments'), to: '/patient/appointments', icon: Calendar },
    { label: t('medicalRecords'), to: '/patient/medical-records', icon: FileText },
  ];

  const portalNav = [
    { label: t('myTasks'), to: '/todo', icon: CheckSquare },
    { label: t('notifications'), to: '/notifications', icon: Bell },
    { label: t('myProfile'), to: '/profile', icon: User },
    { label: t('settings'), to: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-20 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t('portalTitle')}
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List with Categorized Sections */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {/* Section 1: Clinical Services */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              {t('clinicalServices')}
            </p>
          )}
          {clinicalNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : `${item.badgeColor || 'bg-slate-700'} text-white`
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Section 2: Patient Space */}
        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          {!collapsed && (
            <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
              {t('patientSpace')}
            </p>
          )}
          {portalNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${collapsed ? 'justify-center px-0' : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                    {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : `${item.badgeColor || 'bg-slate-700'} text-white`
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* 24/7 Patient Emergency & Support Card */}
        {!collapsed && (
          <div className="pt-2 px-1">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-slate-900 border border-blue-100 dark:border-blue-900/50 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <HeartPulse className="w-4 h-4" />
                <span className="text-xs font-bold">{t('support24')}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {t('supportDesc')}
              </p>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5 pt-0.5">
                <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
                <span>+1 (800) 427-3785</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom User Area */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {patient && !collapsed && (
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
            <Avatar src={patient.avatar} name={patient.name} size="sm" status="online" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {patient.name}
              </p>
              <p className="text-[10px] text-slate-400">{t('portalTitle')}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={t('signOut')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title={t('signOut')}
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
