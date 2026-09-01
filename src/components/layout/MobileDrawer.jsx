import React, { useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  X,
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
  Sun,
  Moon,
  Stethoscope,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useHospital } from '../../context/HospitalContext.jsx';
import { Avatar } from '../common/Badge.jsx';
import { Logo } from '../common/Logo.jsx';

export function MobileDrawer({ isOpen, onClose }) {
  const { patient, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, lang } = useLanguage();
  const { tasks, notifications } = useHospital();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isAdmin = patient?.role === 'admin';

  const adminNav = [
    { label: t('dashboard') || 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: t('doctors') || 'Doctors', to: '/admin/doctors', icon: Stethoscope },
    { label: t('patients') || 'Patients', to: '/admin/patients', icon: Users },
    { label: t('appointments') || 'Appointments', to: '/admin/appointments', icon: Calendar },
  ];

  const clinicalNav = [
    { label: t('dashboard') || 'Dashboard', to: '/patient/dashboard', icon: LayoutDashboard },
    { label: t('findDoctors') || 'Find Doctors', to: '/patient/doctors', icon: UserCheck },
    { label: t('bookVisit') || 'Book Visit', to: '/patient/book-appointment', icon: CalendarCheck },
    { label: t('appointments') || 'Appointments', to: '/patient/appointments', icon: Calendar },
    { label: t('medicalRecords') || 'Medical Records', to: '/patient/medical-records', icon: FileText },
  ];

  const portalNav = [
    { label: t('myTasks') || 'My Tasks', to: '/todo', icon: CheckSquare },
    { label: t('notifications') || 'Notifications', to: '/notifications', icon: Bell },
    { label: t('myProfile') || 'My Profile', to: '/profile', icon: User },
    { label: t('settings') || 'Settings', to: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-white dark:bg-slate-900 shadow-2xl flex flex-col z-10 animate-fadeIn">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <Link to="/" onClick={onClose}>
            <Logo size="sm" />
          </Link>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User preview */}
        {patient && (
          <div className="p-3.5 mx-3 my-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center gap-3">
            <Avatar src={patient.avatar} name={patient.name} size="sm" status="online" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{patient.name}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">
                {isAdmin ? 'Administrator' : t('portalTitle')}
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        )}

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {isAdmin ? (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Admin Management
              </p>
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Clinical Services
                </p>
                {clinicalNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  Patient Space
                </p>
                {portalNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('signOut')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
