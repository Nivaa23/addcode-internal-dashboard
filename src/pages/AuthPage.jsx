import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, ArrowUpRight } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import AuthBrandSide from '../components/auth/AuthBrandSide';
import LoginForm from '../components/auth/LoginForm';
import ThemeSelector from '../components/common/ThemeSelector';
import logoImg from '../assets/addcode-logo.png';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login } = useEmployees();

  const handleLoginSuccess = async (email, password) => {
    await login(email, password);
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
          <LoginForm onLoginSuccess={handleLoginSuccess} />
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
