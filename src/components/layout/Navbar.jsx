// Responsive Top Navigation Bar with Role-based Context Switcher

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Activity,
  User,
  LogOut,
  Bell,
  Stethoscope,
  Heart,
  Calendar,
  Search,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, onOpenAuthModal, onBookAppointment }) {
  const { user, doctorProfile, patientProfile, isDoctor, isPatient, isOnDuty, toggleDutyStatus, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const displayName = isDoctor
    ? doctorProfile?.fullName || user?.name || 'Dr. Sarah Jenkins'
    : patientProfile?.fullName || user?.name || 'Eleanor Vance';

  const avatarUrl = isDoctor
    ? doctorProfile?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'
    : patientProfile?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200';

  const userRoleTitle = isDoctor ? 'Physician Care Specialist' : 'Registered Patient';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xl">
      {/* Brand Logo & Module Indicator */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Activity className="w-5 h-5 text-teal-400" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-extrabold tracking-tight text-white">MedPulse</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
              HMS {isDoctor ? 'Doctor' : 'Patient'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Hospital Management Platform</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
        {isPatient ? (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('findDoctors')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'findDoctors'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Find Doctors
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'appointments'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              My Appointments
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Profile
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Doctor Dashboard
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'appointments'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setActiveTab('patients')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'patients'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              My Patients
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Doctor Profile
            </button>
          </>
        )}
      </div>

      {/* User Actions & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Book Appointment Shortcut for Patient */}
        {isPatient && onBookAppointment && (
          <button
            onClick={() => onBookAppointment()}
            className="hidden sm:flex px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs items-center gap-1.5 shadow-md shadow-teal-500/20 transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Visit</span>
          </button>
        )}

        {/* Doctor Duty Toggle */}
        {isDoctor && (
          <button
            onClick={toggleDutyStatus}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
              isOnDuty
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}
            />
            <span>{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
          </button>
        )}

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="flex items-center gap-2 p-1 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-8 h-8 rounded-xl object-cover border border-teal-500/40"
            />
            <div className="hidden md:block text-left pr-1">
              <p className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">{displayName}</p>
              <p className="text-[10px] text-teal-400 font-mono capitalize">{user?.role || 'User'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 space-y-1 text-xs z-50 animate-fadeIn">
              <div className="p-2.5 border-b border-slate-800 mb-1">
                <p className="font-bold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('profile');
                  setShowProfileMenu(false);
                }}
                className="w-full p-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onOpenAuthModal();
                }}
                className="w-full p-2 rounded-xl text-left text-slate-300 hover:bg-slate-800 hover:text-white flex items-center gap-2"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Switch Role (Doctor/Patient)</span>
              </button>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    window.location.reload();
                  }}
                  className="w-full p-2 rounded-xl text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
