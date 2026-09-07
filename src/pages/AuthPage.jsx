import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ArrowUpRight } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import AuthBrandSide from '../components/auth/AuthBrandSide';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import ThemeSelector from '../components/common/ThemeSelector';
import logoImg from '../assets/addcode-logo.png';

export default function AuthPage({ initialMode = 'login' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useEmployees();

  // Determine current mode from path or prop
  const currentMode = location.pathname === '/signup' ? 'signup' : (initialMode || 'login');
  const [mode, setMode] = useState(currentMode);

  useEffect(() => {
    if (location.pathname === '/signup' && mode !== 'signup') {
      setMode('signup');
    } else if (location.pathname === '/login' && mode !== 'login') {
      setMode('login');
    }
  }, [location.pathname]);

  const switchMode = (newMode) => {
    setMode(newMode);
    navigate(newMode === 'signup' ? '/signup' : '/login', { replace: true });
  };

  const handleLoginSuccess = (email, password) => {
    login(email, password);
    navigate('/dashboard');
  };

  const handleSignUpSuccess = ({ name, email }) => {
    signup({ name, email });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden font-sans text-slate-900">
      {/* LEFT SIDE: Brand & Visual Experience (Desktop) */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[52%] sticky top-0 h-screen shrink-0">
        <AuthBrandSide />
      </div>

      {/* RIGHT SIDE: Authentication Area */}
      <div className="w-full lg:w-1/2 xl:w-[48%] min-h-screen flex flex-col justify-between bg-white relative">
        {/* Top Utility Bar: Mobile Logo, Discreet Theme Selector & Dashboard Quick Link */}
        <header className="w-full px-6 sm:px-10 py-5 flex items-center justify-between z-20">
          {/* Mobile Brand Header (Visible on smaller screens) */}
          <div className="flex lg:hidden items-center gap-2.5">
            <img
              src={logoImg}
              alt="Addcode Engineering Logo"
              className="w-7 h-7 object-contain"
            />
            <div className="flex items-center gap-1 text-sm font-black tracking-tight text-slate-900">
              <span>Addcode</span>
              <span className="text-brand-600">Engineering</span>
            </div>
          </div>

          <div className="hidden lg:block" />

          {/* Right Controls: Theme Selector + Dev Access */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Theme Selector (Pill Variant) */}
            <ThemeSelector variant="header" align="right" />

            {/* Quick Access to Dashboard for Development/Review */}
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer shadow-2xs"
              title="Quickly preview internal dashboard"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Preview Hub</span>
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
          </div>
        </header>

        {/* Center Authentication Card / Form */}
        <main className="w-full max-w-md mx-auto px-6 sm:px-10 py-6 sm:py-8 my-auto">
          {/* Animated Tab Switcher */}
          <div className="p-1 bg-slate-100/90 rounded-xl flex items-center mb-8 border border-slate-200/80">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer text-center relative ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer text-center relative ${
                mode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form Switching with Framer Motion */}
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <LoginForm
                  onSwitchToSignUp={() => switchMode('signup')}
                  onLoginSuccess={handleLoginSuccess}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
              >
                <SignUpForm
                  onSwitchToLogin={() => switchMode('login')}
                  onSignUpSuccess={handleSignUpSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Bottom Security / Copyright Bar */}
        <footer className="w-full px-6 sm:px-10 py-5 text-center sm:text-left border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>&copy; 2026 Addcode Engineering. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Security Center</span>
            <span>&bull;</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-slate-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
