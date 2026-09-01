import React, { useState } from 'react';
import {
  Clock,
  LogIn,
  LogOut,
  Timer,
  Coffee
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

export default function Attendance() {
  const { currentUser } = useEmployees();

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState('09:18 AM');
  const [checkOutTime, setCheckOutTime] = useState('Current');
  const [totalWorkHours, setTotalWorkHours] = useState('6h 45m');

  const [workSessions, setWorkSessions] = useState([
    { id: 1, start: '09:18 AM', end: '12:45 PM', duration: '3h 27m', type: 'Morning Session' },
    { id: 2, start: '01:30 PM', end: 'Current', duration: '3h 18m', type: 'Afternoon Session' }
  ]);

  const handleToggleCheckIn = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isCheckedIn) {
      setIsCheckedIn(false);
      setCheckOutTime(formattedTime);
      setWorkSessions(prev => prev.map(s => s.id === 2 ? { ...s, end: formattedTime, duration: '3h 45m' } : s));
      setTotalWorkHours('7h 12m');
    } else {
      setIsCheckedIn(true);
      setCheckInTime(formattedTime);
      setCheckOutTime('Current');
      const newSession = {
        id: Date.now(),
        start: formattedTime,
        end: 'Current',
        duration: '0h 01m',
        type: 'Extra Session'
      };
      setWorkSessions(prev => [...prev, newSession]);
    }
  };

  const attendanceDays = [
    { day: 1, status: 'Present' },
    { day: 2, status: 'Present' },
    { day: 3, status: 'Present' },
    { day: 4, status: 'Present' },
    { day: 5, status: 'Holiday' },
    { day: 6, status: 'Holiday' },
    { day: 7, status: 'Present' },
    { day: 8, status: 'Present' },
    { day: 9, status: 'Leave' },
    { day: 10, status: 'Present' },
    { day: 11, status: 'Present' },
    { day: 12, status: 'Holiday' },
    { day: 13, status: 'Holiday' },
    { day: 14, status: 'Present' },
    { day: 15, status: 'Present' },
    { day: 16, status: 'Absent' },
    { day: 17, status: 'Present' },
    { day: 18, status: 'Present' },
    { day: 19, status: 'Holiday' },
    { day: 20, status: 'Holiday' },
    { day: 21, status: 'Present' },
    { day: 22, status: 'Present' },
    { day: 23, status: 'Present' },
    { day: 24, status: 'Present' },
    { day: 25, status: 'Leave' },
    { day: 26, status: 'Holiday' },
    { day: 27, status: 'Holiday' },
    { day: 28, status: 'Present' },
    { day: 29, status: 'Present' },
    { day: 30, status: 'Present' },
  ];

  const todayDayNumber = 1;

  const getStatusColor = (status, isToday) => {
    if (isToday) return 'bg-slate-900 text-white font-bold';
    switch (status) {
      case 'Present':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Absent':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'Leave':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Holiday':
        return 'bg-slate-100 text-slate-400 border border-slate-200';
      default:
        return 'bg-white text-slate-600';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Attendance Tracker</h1>
          <p className="text-xs text-slate-500 mt-0.5">Daily clock-in logs, work session durations, and monthly status matrix.</p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className={`text-xs font-semibold px-2 py-1 rounded border ${isCheckedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
            {isCheckedIn ? 'Status: Checked In' : 'Status: Checked Out'}
          </span>
          <button
            onClick={handleToggleCheckIn}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer ${isCheckedIn
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
          >
            {isCheckedIn ? <LogOut className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
            <span>{isCheckedIn ? 'Check Out' : 'Check In'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Present Days</span>
          <span className="text-lg font-bold text-emerald-600 mt-0.5 block">21 Days</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Absent Days</span>
          <span className="text-lg font-bold text-red-600 mt-0.5 block">1 Day</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Leave Days</span>
          <span className="text-lg font-bold text-amber-600 mt-0.5 block">2 Days</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Holidays</span>
          <span className="text-lg font-bold text-slate-700 mt-0.5 block">6 Days</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Hours</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block">168.5 hrs</span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Today's Work Sessions */}
        <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">Today's Work Sessions</h3>
            <div className="space-y-2">
              {workSessions.map((session) => (
                <div key={session.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-900">{session.type}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{session.start} — {session.end}</p>
                  </div>
                  <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                    {session.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
            <div className="flex justify-between">
              <span>Total Work Hours:</span>
              <span className="font-bold text-slate-900">{totalWorkHours}</span>
            </div>
            <div className="flex justify-between">
              <span>Expected Work Hours:</span>
              <span className="font-bold text-slate-700">8h 00m</span>
            </div>
            <div className="flex justify-between">
              <span>Break Duration:</span>
              <span className="font-bold text-amber-700">45 mins</span>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900">September 2026 Matrix</h3>
            <span className="text-[11px] font-semibold text-slate-500">30-day Month</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {attendanceDays.map((item) => {
              const isToday = item.day === todayDayNumber;
              return (
                <div
                  key={item.day}
                  className={`py-2 rounded flex flex-col items-center justify-center ${getStatusColor(item.status, isToday)}`}
                >
                  <span className="font-bold">{item.day}</span>
                  <span className="text-[9px] uppercase mt-0.5 opacity-80">{item.status}</span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Present</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Absent</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Leave</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Holiday</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-900"></span> Today</span>
          </div>
        </div>

      </div>
    </div>
  );
}
