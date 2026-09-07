import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import OutlookIcon from './OutlookIcon';
import ForgotPasswordModal from './ForgotPasswordModal';

export default function LoginForm({ onSwitchToSignUp, onLoginSuccess }) {
  const [email, setEmail] = useState('marcus.vance@addcode.engineering');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [outlookLoading, setOutlookLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your work email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email, password);
    }, 500);
  };

  const handleOutlookLogin = () => {
    setError('');
    setOutlookLoading(true);
    setTimeout(() => {
      setOutlookLoading(false);
      onLoginSuccess('marcus.vance@addcode.engineering', 'sso-outlook-token');
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail('marcus.vance@addcode.engineering');
    setPassword('AddcodeDev#2026');
    setError('');
  };

  return (
    <div className="w-full text-left font-sans">
      {/* Header section */}
      <div className="mb-7">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          Enter your credentials to access the Addcode Engineering Internal Operations Hub.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Work Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="name@addcode.engineering"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-sans"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & Quick Fill */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 font-medium">Remember me for 30 days</span>
          </label>

          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-brand-600 transition-colors cursor-pointer"
            title="Pre-fill Marcus Vance demo credentials"
          >
            <Sparkles className="w-3 h-3" />
            <span>Demo Fill</span>
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || outlookLoading}
          className="w-full mt-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-semibold rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed font-sans"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 tracking-wider">
            OR
          </span>
        </div>
      </div>

      {/* Microsoft Outlook SSO Button */}
      <button
        type="button"
        onClick={handleOutlookLogin}
        disabled={loading || outlookLoading}
        className="w-full py-2.5 px-4 bg-white hover:bg-slate-50/80 active:bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs sm:text-sm border border-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group font-sans"
      >
        {outlookLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
            <span>Connecting to Outlook SSO...</span>
          </>
        ) : (
          <>
            <OutlookIcon className="w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-105 shrink-0" />
            <span>Continue with Outlook</span>
          </>
        )}
      </button>

      {/* Switch to Sign Up */}
      <div className="mt-7 text-center">
        <p className="text-xs sm:text-sm text-slate-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        initialEmail={email}
      />
    </div>
  );
}
