import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import logoImg from '../assets/addcode-logo.png';

export default function ChangePassword() {
  const { currentUser, changePassword, logout } = useEmployees();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      changePassword(newPassword);
      navigate('/dashboard', { replace: true });
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-8 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <img src={logoImg} alt="Addcode Logo" className="w-8 h-8 object-contain" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Security Update Required</h2>
          <p className="text-slate-300 text-sm mt-2">
            Welcome, {currentUser?.name}. Please change your initial password before accessing the dashboard.
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-semibold rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>Set Password & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel and Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
