// Responsive Sidebar Component supporting both Doctor Panel and Patient Panel

import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  Search,
  Stethoscope,
  Heart,
  FileText,
  Clock,
  Shield,
  PlusCircle
} from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, counts = {}, onBookAppointment }) {
  const { isDoctor, isPatient, doctorProfile, patientProfile } = useAuth();

  const doctorNav = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'appointments',
      label: 'Consultations',
      icon: Calendar,
      badge: counts.todayAppointments > 0 ? counts.todayAppointments : null
    },
    {
      id: 'patients',
      label: 'My Patients',
      icon: Users,
      badge: counts.totalPatients > 0 ? counts.totalPatients : null
    },
    {
      id: 'profile',
      label: 'Doctor Profile',
      icon: UserCheck,
      badge: null
    }
  ];

  const patientNav = [
    {
      id: 'dashboard',
      label: 'Patient Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'findDoctors',
      label: 'Find Doctors',
      icon: Search,
      badge: null
    },
    {
      id: 'appointments',
      label: 'My Appointments',
      icon: Calendar,
      badge: counts.upcomingCount > 0 ? counts.upcomingCount : null
    },
    {
      id: 'profile',
      label: 'Patient Profile',
      icon: UserCheck,
      badge: null
    }
  ];

  const currentNav = isPatient ? patientNav : doctorNav;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 min-h-[calc(100vh-65px)] p-4 space-y-6 flex-shrink-0">
      {/* User Identity Info Box */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={
              isDoctor
                ? doctorProfile?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
                : patientProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'
            }
            alt="Profile"
            className="w-11 h-11 rounded-xl object-cover border border-teal-500/30"
          />
          <div className="space-y-0.5 overflow-hidden">
            <h4 className="text-xs font-bold text-white truncate">
              {isDoctor ? doctorProfile?.fullName || 'Dr. Sarah Jenkins' : patientProfile?.fullName || 'Eleanor Vance'}
            </h4>
            <p className="text-[11px] font-semibold text-teal-400 truncate">
              {isDoctor ? doctorProfile?.specialization || 'Cardiology' : 'Patient Account'}
            </p>
          </div>
        </div>

        {isPatient && onBookAppointment && (
          <button
            onClick={() => onBookAppointment()}
            className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">
          {isDoctor ? 'Doctor Workspace' : 'Patient Portal'}
        </p>

        {currentNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Banner */}
      <div className="mt-auto p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Shield className="w-4 h-4 text-teal-400" />
          <span>RBAC Protected</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Logged in as <strong className="text-slate-400 uppercase font-mono">{isDoctor ? 'Doctor' : 'Patient'}</strong>. Data is isolated to your authorized medical profile.
        </p>
      </div>
    </aside>
  );
}
