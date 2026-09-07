import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import OutlookIcon from './OutlookIcon';

export default function SignUpForm({ onSwitchToLogin, onSignUpSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [loading, setLoading] = useState(false);
  const [outlookLoading, setOutlookLoading] = useState(false);
  const [error, setError] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-600' };
    if (score === 2 || score === 3) return { score: 2, label: 'Fair', color: 'bg-amber-500 text-amber-600' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500 text-emerald-600' };
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your work email address');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!termsAccepted) {
      setError('Please accept the Addcode Engineering platform terms');
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onSignUpSuccess({ name, email });
    }, 550);
  };

  const handleOutlookSignUp = () => {
    setError('');
    setOutlookLoading(true);
    setTimeout(() => {
      setOutlookLoading(false);
      onSignUpSuccess({
        name: 'Elena Rostova',
        email: 'elena.rostova@addcode.engineering'
      });
    }, 600);
  };

  return (
    <div className="w-full text-left font-sans">
      {/* Header section */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          Join the Addcode Engineering Internal Operations Hub.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200/80 text-red-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-700">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="e.g. Elena Rostova"
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-sans"
            />
          </div>
        </div>

        {/* Work Email */}
        <div className="space-y-1">
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
              placeholder="e.g. name@addcode.engineering"
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-sans"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Password
            </label>
            {password && (
              <span className={`text-[11px] font-semibold ${strength.color.split(' ')[1]}`}>
                {strength.label}
              </span>
            )}
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
              placeholder="At least 8 characters"
              className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all font-sans"
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

          {/* Strength progress bar */}
          {password && (
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className={`h-1 rounded-full transition-colors ${strength.score >= 1 ? strength.color.split(' ')[0] : 'bg-slate-200'}`} />
              <div className={`h-1 rounded-full transition-colors ${strength.score >= 2 ? strength.color.split(' ')[0] : 'bg-slate-200'}`} />
              <div className={`h-1 rounded-full transition-colors ${strength.score >= 3 ? strength.color.split(' ')[0] : 'bg-slate-200'}`} />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Confirm Password
            </label>
            {passwordsMatch && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Matches
              </span>
            )}
            {passwordsMismatch && (
              <span className="text-[11px] font-semibold text-red-500">
                Does not match
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              placeholder="Re-enter your password"
              className={`w-full pl-10 pr-10 py-2 bg-white border rounded-lg text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all font-sans ${
                passwordsMismatch
                  ? 'border-red-300 focus:ring-2 focus:ring-red-400/20 focus:border-red-500'
                  : 'border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Platform access terms */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 leading-normal">
              I agree to the Addcode Engineering Internal Platform Usage Guidelines and Corporate Security Standards.
            </span>
          </label>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={loading || outlookLoading}
          className="w-full mt-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white font-semibold rounded-lg text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed font-sans"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-5">
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
        onClick={handleOutlookSignUp}
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

      {/* Switch to Login */}
      <div className="mt-6 text-center">
        <p className="text-xs sm:text-sm text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-colors cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
