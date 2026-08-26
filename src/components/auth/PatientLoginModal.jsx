// Patient Login / Role Authentication Modal

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../common/ToastContainer.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import { ShieldCheck, Mail, Key, UserCheck, AlertTriangle, X, Stethoscope, Heart } from 'lucide-react';

export function PatientLoginModal({ isOpen, onClose }) {
  const { login, isPatient, user, logout } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('eleanor.vance@gmail.com');
  const [password, setPassword] = useState('patient123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      showToast('Successfully authenticated as Patient!', 'success');
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToDoctor = async () => {
    setLoading(true);
    try {
      await login('sarah.jenkins@hospital.org', 'doctor123');
      showToast('Switched role to Doctor!', 'success');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Heart className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Patient Portal Authentication</h3>
              <p className="text-xs text-slate-400">Security & Patient Identification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Patient Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                placeholder="eleanor.vance@gmail.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">Password *</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? <Spinner size="sm" /> : <UserCheck className="w-4 h-4" />}
            <span>Log In as Patient (Eleanor Vance)</span>
          </button>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <p className="text-[11px] text-slate-400 text-center">Switch Module Context for Testing:</p>
            <button
              type="button"
              onClick={handleSwitchToDoctor}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Stethoscope className="w-4 h-4 text-teal-400" />
              <span>Switch to Doctor Role (Dr. Sarah Jenkins)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
