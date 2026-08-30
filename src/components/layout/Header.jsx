import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Calendar, User } from 'lucide-react';
import { useEmployees } from '../../context/EmployeeContext';

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser } = useEmployees();

  // Determine page title based on path
  const getPageDetails = () => {
    switch (currentPath) {
      case '/dashboard':
        return { title: 'Overview Dashboard', subtitle: 'Real-time engineering operations and team health metrics.' };
      case '/tasks':
        return { title: 'My Tasks', subtitle: 'Manage your sprint tickets, code review actions, and daily tasks.' };
      case '/projects':
        return { title: 'Active Projects', subtitle: 'Explore active client deliveries, repositories, and allocations.' };
      case '/attendance':
        return { title: 'Attendance Tracker', subtitle: 'Inspect daily login history, active work sessions, and logs.' };
      case '/leaves':
        return { title: 'Time Off & Leaves', subtitle: 'File leaves, check balances, and monitor team availability.' };
      case '/calendar':
        return { title: 'Team Calendar', subtitle: 'Track sprint meetings, team availability, and company holidays.' };
      case '/profile':
        return { title: 'My Profile', subtitle: 'Update professional details, check compliance status, and history.' };
      default:
        return { title: 'Addcode Portal', subtitle: 'Addcode Engineering internal employee environment.' };
    }
  };

  const { title, subtitle } = getPageDetails();
  const formattedDate = "Mon, Aug 31, 2026";

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-8 sticky top-0 z-40 flex-shrink-0">
      {/* Left Details */}
      <div className="flex flex-col text-left">
        <h1 className="text-sm font-display font-bold text-slate-800 tracking-tight leading-tight m-0">
          {title}
        </h1>
        <p className="text-[10px] text-slate-400 font-semibold hidden sm:block mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200/40 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-brand-500" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200/40 transition-all cursor-pointer">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border border-white"></span>
        </div>

        {/* Employee Avatar / Profile Trigger */}
        <Link to="/profile" className="flex items-center">
          <button 
            className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs hover:ring-2 hover:ring-brand-500/20 transition-all cursor-pointer"
            title="View Profile"
          >
            {getInitials(currentUser.name)}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
