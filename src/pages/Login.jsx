import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import logoImg from '../assets/addcode-logo.png';

export default function Login() {
  const { login } = useEmployees();
  const navigate = useNavigate();

  const [email, setEmail] = useState('marcus.vance@addcode.engineering');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your corporate email address');
      return;
    }
    login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 text-left font-sans">
      <div className="w-full max-w-sm space-y-6">

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src={logoImg}
            alt="Addcode Engineering Logo"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">
              <span className="text-slate-900">Addcode </span>
              <span className="text-sky-600">Engineering</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Internal Employee Management Platform</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase text-[10px]">Corporate Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="name@addcode.engineering"
                  className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 text-xs font-sans"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase text-[10px]">Security Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-8 pr-8 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 text-xs font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember me</span>
              </label>
              <button type="button" onClick={() => alert('Contact support@addcode.engineering.')} className="text-brand-600 font-semibold hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded text-xs transition-colors cursor-pointer shadow-xs font-sans"
            >
              Sign In to Portal
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-mono">Prototype Mode • Local State</span>
          </div>
        </div>

      </div>
    </div>
  );
}
