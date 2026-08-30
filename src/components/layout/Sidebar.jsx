import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Layers, 
  Clock, 
  CalendarDays, 
  Calendar, 
  User,
  LogOut
} from 'lucide-react';
import { useEmployees } from '../../context/EmployeeContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { currentUser, logout } = useEmployees();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: ClipboardCheck },
    { name: 'Projects', path: '/projects', icon: Layers },
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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200/60 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-2.5 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-md shadow-brand-500/20">
          <Layers className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-slate-800 tracking-tight text-sm leading-tight">
            addcode
          </span>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase leading-none mt-0.5">
            engineering
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-left">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Internal Platform
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
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group
                ${isActive 
                  ? 'bg-brand-50/70 text-brand-700 border-l-2 border-brand-600 pl-2.5' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-l-2 border-transparent'
                }
              `}
            >
              <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Authenticated User Footer with Logout action */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-between gap-3 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm border border-brand-200">
              {getInitials(currentUser.name)}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-xs font-bold text-slate-800 truncate">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
