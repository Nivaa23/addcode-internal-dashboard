import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Clock,
  CalendarDays,
  Calendar,
  User,
  LogOut
} from 'lucide-react';
import { useEmployees } from '../../context/EmployeeContext';
import logoImg from '../../assets/addcode-logo.png';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { currentUser, logout } = useEmployees();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Attendance', path: '/attendance', icon: Clock },
    { name: 'Leaves', path: '/leaves', icon: CalendarDays },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EM';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Official Addcode Engineering Brand Header */}
      <div className="h-16 lg:h-18 flex items-center px-4.5 border-b border-slate-200/80 gap-3 shrink-0 bg-white">
        <img
          src={logoImg}
          alt="Addcode Engineering Logo"
          className="w-8 h-8 object-contain shrink-0"
        />
        <div className="flex flex-col text-left justify-center">
          <span className="font-extrabold text-slate-900 tracking-tight text-sm leading-tight font-sans">
            Addcode
          </span>
          <span className="text-[11px] text-sky-600 font-bold tracking-wider uppercase leading-tight mt-0.5 font-sans">
            Engineering
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-2 mb-2.5 text-left">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-sans">
            Platform Menu
          </span>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path !== '/dashboard' && currentPath.startsWith(item.path));

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors font-sans
                ${isActive
                  ? 'bg-slate-100 text-slate-900 font-bold text-brand-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }
              `}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {getInitials(currentUser.name)}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-xs font-bold text-slate-900 truncate leading-tight font-sans">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-500 truncate leading-tight mt-0.5 font-sans">
              {currentUser.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer shrink-0"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
