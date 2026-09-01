import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Calendar, Search, Palette, Check } from 'lucide-react';
import { useEmployees, accentPalettes } from '../../context/EmployeeContext';

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { currentUser, accentTheme, setAccentTheme } = useEmployees();

  const [showThemePicker, setShowThemePicker] = useState(false);
  const themePickerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themePickerRef.current && !themePickerRef.current.contains(event.target)) {
        setShowThemePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageDetails = () => {
    switch (currentPath) {
      case '/dashboard':
        return { title: 'Dashboard', subtitle: 'Overview of work, tasks, and system activities.' };
      case '/tasks':
        return { title: 'My Tasks', subtitle: 'Manage tickets, pull requests, and action items.' };
      case '/projects':
        return { title: 'Projects', subtitle: 'Active software deliverables and team assignments.' };
      case '/attendance':
        return { title: 'Attendance', subtitle: 'Daily work sessions, check-in logs, and metrics.' };
      case '/leaves':
        return { title: 'Leaves & Time Off', subtitle: 'File leave requests and track annual balances.' };
      case '/calendar':
        return { title: 'Calendar', subtitle: 'Company events, sprint deadlines, and leaves.' };
      case '/profile':
        return { title: 'My Profile', subtitle: 'Employee details, contact info, and records.' };
      default:
        return { title: 'Addcode Engineering', subtitle: 'Internal Employee Management Platform.' };
    }
  };

  const { title, subtitle } = getPageDetails();

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EM';
  };

  return (
    <header className="h-16 lg:h-18 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40 shrink-0 font-sans">
      {/* Left Title & Subtitle */}
      <div className="flex flex-col text-left">
        <h1 className="text-base lg:text-lg font-bold text-slate-900 font-sans leading-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-500 font-medium hidden sm:block leading-tight mt-0.5 font-sans">
          {subtitle}
        </p>
      </div>

      {/* Right Controls: Utility Group */}
      <div className="flex items-center gap-3 lg:gap-4">
        {/* Search Input */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search platform... (⌘K)"
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white text-slate-800 placeholder-slate-400 transition-all font-sans"
          />
        </div>

        {/* Date Selector */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Sep 01, 2026</span>
        </div>

        {/* FEATURE 2: Theme / Accent Color Selector Trigger */}
        <div className="relative" ref={themePickerRef}>
          <button
            onClick={() => setShowThemePicker(!showThemePicker)}
            className={`p-2 rounded-md border transition-colors cursor-pointer flex items-center justify-center ${showThemePicker
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            title="Custom Accent Color"
          >
            <Palette className="w-4 h-4" />
          </button>

          {/* Popover Dropdown */}
          {showThemePicker && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-2.5 px-3 z-50 text-left space-y-2 font-sans animate-in fade-in zoom-in-95 duration-100">
              <div className="pb-1.5 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">Theme Customization</h4>
                <p className="text-[10px] text-slate-500">Choose an accent color for UI highlights</p>
              </div>

              <div className="space-y-1">
                {Object.entries(accentPalettes).map(([key, item]) => {
                  const isSelected = accentTheme === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setAccentTheme(key);
                        setShowThemePicker(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors cursor-pointer ${isSelected ? 'bg-slate-100 font-semibold text-slate-900' : 'hover:bg-slate-50 text-slate-600'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors cursor-pointer flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full border border-white"></span>
        </div>

        {/* User Profile Avatar */}
        <Link to="/profile" className="flex items-center">
          <div
            className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
            title="View Profile"
          >
            {getInitials(currentUser.name)}
          </div>
        </Link>
      </div>
    </header>
  );
}
