import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Login = () => {
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
    
    // Perform mock authentication login
    login(email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Branding Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Layers className="w-5.5 h-5.5 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-display font-extrabold text-slate-800 tracking-tight text-base leading-tight">
              addcode
            </span>
            <span className="text-[10.5px] text-slate-400 font-bold tracking-wider uppercase leading-none mt-0.5">
              engineering
            </span>
          </div>
        </div>

        {/* Welcome titles */}
        <h2 className="text-center font-display font-extrabold text-2xl text-slate-800 tracking-tight">
          Welcome to Addcode Operations
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 font-semibold max-w-sm mx-auto">
          Sign in with your corporate engineering credentials to access internal projects, tasks, and availability logs.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200/50 shadow-[0_10px_40px_-10px_rgba(99,102,241,0.05)] sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-xs font-semibold px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            {/* Email Field */}
            <Input
              label="Corporate Email Address"
              type="email"
              placeholder="e.g. name@addcode.engineering"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            {/* Password Field */}
            <div className="relative">
              <Input
                label="Security Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-[32px] text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Authentication recovery is managed by global IT security. Please contact support@addcode.engineering.')}
                className="text-brand-600 hover:text-brand-700 cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="primary"
                className="w-full flex justify-center py-2.5"
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Guest mode warning */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-200/40 px-2.5 py-1 rounded">
              Mock Portal Mode Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
