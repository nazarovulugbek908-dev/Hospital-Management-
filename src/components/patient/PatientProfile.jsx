// Patient Profile Component with View and Edit Modes

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../services/api.js';
import { useToast } from '../common/ToastContainer.jsx';
import { Spinner } from '../common/LoadingSkeleton.jsx';
import { GenderBadge } from '../common/Badge.jsx';
import { User, Mail, Phone, Calendar, MapPin, Heart, AlertTriangle, Edit3, Save, X, Shield, FileText } from 'lucide-react';

export function PatientProfile() {
  const { user, patientProfile, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Female',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    avatar: ''
  });

  useEffect(() => {
    if (patientProfile) {
      setFormData({
        fullName: patientProfile.fullName || '',
        email: patientProfile.email || '',
        phone: patientProfile.phone || '',
        dateOfBirth: patientProfile.dateOfBirth || '',
        gender: patientProfile.gender || 'Female',
        address: patientProfile.address || '',
        emergencyContact: patientProfile.emergencyContact || '',
        bloodGroup: patientProfile.bloodGroup || 'A+',
        avatar: patientProfile.avatar || ''
      });
    }
  }, [patientProfile]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.dateOfBirth.trim()) errs.dateOfBirth = 'Date of birth is required';
    if (!formData.gender) errs.gender = 'Gender selection is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fix errors in profile form', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.updatePatientProfile(patientProfile.id, formData);
      await refreshProfile();
      showToast('Patient profile updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast(err.message || 'Failed to update patient profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-teal-400" />
            <span>Patient Personal Profile</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal record, contact details, DOB, and medical emergency information.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-teal-500/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
              setErrors({});
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <X className="w-4 h-4" />
            <span>Cancel Editing</span>
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Card: Avatar & Demographics */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl text-center">
          <div className="relative inline-block mx-auto">
            <img
              src={formData.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200'}
              alt={formData.fullName}
              className="w-36 h-36 rounded-3xl object-cover border-4 border-teal-500/30 shadow-2xl mx-auto"
            />
            <div className="absolute -bottom-2 right-2 p-2 rounded-xl bg-teal-500 text-slate-950 shadow-lg">
              <Shield className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{formData.fullName || 'Eleanor Vance'}</h3>
            <div className="flex items-center justify-center gap-2 mt-1">
              <GenderBadge gender={formData.gender} />
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/20">
                Blood Group: {formData.bloodGroup}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 space-y-3 text-left">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Mail className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span className="truncate">{formData.email}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Phone className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>{formData.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Calendar className="w-4 h-4 text-teal-400 flex-shrink-0" />
              <span>DOB: {formData.dateOfBirth}</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
              <span>{formData.address || 'No address registered.'}</span>
            </div>
          </div>
        </div>

        {/* Right Card: Detail View / Form */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
          {!isEditing ? (
            /* VIEW MODE */
            <div className="space-y-8">
              {/* Emergency Contact & Medical Alerts */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Emergency Contact & Medical Details</span>
                </h4>

                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Emergency Contact Person:</span>
                    <span className="text-slate-200 font-bold">{formData.emergencyContact || 'None listed'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800/60 pb-2">
                    <span className="text-slate-400">Blood Type:</span>
                    <span className="text-rose-400 font-bold">{formData.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Registered Address:</span>
                    <span className="text-slate-200 font-medium">{formData.address}</span>
                  </div>
                </div>
              </div>

              {/* Patient Allergies & History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Clinical Allergies & Medical File</span>
                </h4>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                  <span className="font-bold block text-amber-300">Reported Allergies:</span>
                  <p>
                    {patientProfile?.allergies && patientProfile.allergies.length > 0
                      ? patientProfile.allergies.join(', ')
                      : 'No known drug allergies reported'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* EDIT FORM MODE */
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
                Edit Patient Personal Information
              </h3>

              {/* Full Name & Avatar URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.fullName ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="Eleanor Vance"
                  />
                  {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profile Image URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="eleanor.vance@gmail.com"
                  />
                  {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.phone ? 'border-rose-500' : 'border-slate-800'
                    }`}
                    placeholder="+1 (555) 112-3344"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* DOB, Gender, Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border text-xs text-white focus:outline-none focus:border-teal-500 transition-colors ${
                      errors.dateOfBirth ? 'border-rose-500' : 'border-slate-800'
                    }`}
                  />
                  {errors.dateOfBirth && <p className="text-[11px] text-rose-400 mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Blood Group</label>
                  <input
                    type="text"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                    placeholder="e.g. A+"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Emergency Contact Details</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Robert Vance (Husband) - +1 (555) 998-1122"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Residential Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Enter street address, city, state..."
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50"
                >
                  {saving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
