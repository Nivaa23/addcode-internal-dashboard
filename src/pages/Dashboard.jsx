import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CalendarDays,
  CheckSquare,
  Calendar as CalendarIcon,
  CheckCircle2
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

export default function Dashboard() {
  const { currentUser, activities } = useEmployees();

  // 1. Mock local state for Today's Check-in & Live Timer
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState("09:18 AM");
  const [checkOutTime, setCheckOutTime] = useState("");

  // Timer state in seconds (Initial: 4 hours, 35 minutes, 41 seconds = 16541s)
  const [elapsedSeconds, setElapsedSeconds] = useState(4 * 3600 + 35 * 60 + 41);

  // Live timer effect
  useEffect(() => {
    let interval = null;
    if (isLoggedIn) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoggedIn]);

  // Format seconds to HH:MM:SS
  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  // Format work hours summary (e.g. "4h 35m")
  const formatWorkHoursSummary = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const handleCheckInToggle = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      const now = new Date();
      setCheckOutTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setIsLoggedIn(true);
      const now = new Date();
      setCheckInTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCheckOutTime("");
    }
  };

  // 2. Pending Tasks & Interactive Workflow state
  const [selectedWorkflow, setSelectedWorkflow] = useState('All');
  const [tasks, setTasks] = useState([
    { id: 1, name: "Implement Protected Routing", project: "Addcode Internal Dashboard", priority: "High", dueDate: "Today", status: "In Progress" },
    { id: 2, name: "Figma Typography Review", project: "Cranial Space", priority: "Medium", dueDate: "Sep 02, 2026", status: "To Do" },
    { id: 3, name: "Optimize Assets Bundler", project: "Novance AI", priority: "High", dueDate: "Sep 05, 2026", status: "In Review" },
    { id: 4, name: "Fix Form Input Validation", project: "Addcode Website", priority: "Low", dueDate: "Sep 08, 2026", status: "To Do" },
    { id: 5, name: "Setup CI/CD Pipeline Config", project: "Cranial Space", priority: "High", dueDate: "Sep 12, 2026", status: "To Do" },
    { id: 6, name: "Draft API Integration Documentation", project: "Novance AI", priority: "Medium", dueDate: "Sep 14, 2026", status: "To Do" },
    { id: 7, name: "Build Visual Design Tokens Swatch", project: "Addcode Internal Dashboard", priority: "High", dueDate: "Yesterday", status: "Completed" }
  ]);

  const countByStatus = (st) => tasks.filter(t => t.status === st).length;
  const todoCount = countByStatus("To Do");
  const inProgressCount = countByStatus("In Progress");
  const inReviewCount = countByStatus("In Review");
  const completedCount = countByStatus("Completed");

  const filteredTasks = selectedWorkflow === 'All'
    ? tasks
    : tasks.filter(t => t.status === selectedWorkflow);

  const handleToggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'Completed' ? 'To Do' : 'Completed' };
      }
      return t;
    }));
  };

  // 3. Ongoing Projects
  const ongoingProjects = [
    { name: "Addcode Internal Dashboard", progress: 85, status: "Active Development", due: "Sep 10, 2026" },
    { name: "Cranial Space Onboarding Flow", progress: 40, status: "Designing", due: "Sep 20, 2026" },
    { name: "Novance AI Integration", progress: 60, status: "Testing & Review", due: "Sep 15, 2026" }
  ];

  // 4. Announcements
  const announcements = [
    { id: 1, title: "All-Hands Q3 Strategy Session", details: "Scheduled for Friday at 10:00 AM PST. Agenda: Product roadmap reviews and client project deliveries.", tag: "Important" },
    { id: 2, title: "Wellness & Health Benefits Update", details: "The HR operations team has updated our remote wellness stipend packages.", tag: "HR" },
    { id: 3, title: "Q2 Innovation Hackathon Winners", details: "Congratulations to the Novance team for securing the top spot!", tag: "Internal" }
  ];

  // 5. Calendar dates grid for current month
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 text-left font-sans">

      {/* Header Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 font-sans">Good morning, Nivrutti</h2>
          <p className="text-xs lg:text-sm text-slate-500 font-medium mt-1">Here is your daily engineering workflow overview.</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Working from Office
          </span>
        </div>
      </div>

      {/* TIER 1 — WHAT NEEDS MY ATTENTION (Today's Overview Bar) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 lg:p-6 shadow-xs">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Today's Overview</div>

        {/* Balanced 4-Column Internal Grid with Symmetrical Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-y-6 xl:gap-y-0 xl:divide-x divide-slate-200">

          {/* 1. Today's Check-In */}
          <div className="xl:pr-6 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500 block">Today's Check-In</span>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{checkInTime}</span>
                <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${isLoggedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                  {isLoggedIn ? 'Logged In' : 'Logged Out'}
                </span>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={handleCheckInToggle}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-xs font-semibold transition-colors cursor-pointer shadow-xs focus:ring-2 focus:ring-brand-500 focus:outline-none flex items-center justify-center gap-1.5"
              >
                {isLoggedIn ? 'Check Out / Log Out' : 'Check In'}
              </button>
            </div>
          </div>

          {/* FEATURE 1: 2. Work Hours & Live Session Timer */}
          <div className="pt-4 md:pt-0 xl:px-6 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-semibold text-slate-500">Work Hours & Live Session</span>
                <span className="text-xs font-bold text-slate-900">
                  {formatWorkHoursSummary(elapsedSeconds)} <span className="text-slate-400 font-normal">/ 8h 30m</span>
                </span>
              </div>

              {/* Live Operational Timer Display */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold font-mono tracking-tight text-slate-900 leading-none">
                    {formatTimer(elapsedSeconds)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-1">
                    {isLoggedIn ? `Working since ${checkInTime}` : `Session ended ${checkOutTime ? 'at ' + checkOutTime : ''}`}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${isLoggedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isLoggedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {isLoggedIn ? 'Live' : 'Ended'}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                <div
                  style={{ width: `${Math.min(100, Math.round((elapsedSeconds / 30600) * 100))}%` }}
                  className="bg-brand-600 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>{Math.round((elapsedSeconds / 30600) * 100)}% of target logged</span>
              <span className="text-[11px] font-medium">Real-time sync</span>
            </div>
          </div>

          {/* 3. Leave Balance */}
          <div className="pt-4 md:pt-0 xl:px-6 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-500 block">Leave Balance</span>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 bg-brand-50/50 border border-brand-200/80 rounded-md transition-colors flex flex-col items-center justify-center">
                  <div className="text-base font-bold text-brand-600 leading-none">16</div>
                  <div className="text-[10px] text-brand-700 font-semibold uppercase mt-1">Remaining</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex flex-col items-center justify-center">
                  <div className="text-base font-bold text-amber-700 leading-none">2</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1">Pending</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex flex-col items-center justify-center">
                  <div className="text-base font-bold text-slate-600 leading-none">6</div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold mt-1">Used</div>
                </div>
              </div>
            </div>
            <div className="pt-1">
              <span className="text-xs text-slate-400 font-medium block">24 Total Annual Allocation</span>
            </div>
          </div>

          {/* 4. Quick Actions (Clean 2x2 Grid) */}
          <div className="pt-4 md:pt-0 xl:pl-6 flex flex-col justify-between h-full space-y-4">
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-500 block">Quick Actions</span>
              <div className="grid grid-cols-2 gap-2.5 w-full">
                <Link
                  to="/leaves"
                  className="px-3 py-2 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-200/80 rounded-md text-xs font-semibold text-slate-800 flex items-center gap-2 transition-all w-full h-9 group shadow-xs"
                >
                  <CalendarDays className="w-4 h-4 text-brand-600 shrink-0 transition-colors" />
                  <span className="truncate">Apply Leave</span>
                </Link>
                <Link
                  to="/tasks"
                  className="px-3 py-2 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-200/80 rounded-md text-xs font-semibold text-slate-800 flex items-center gap-2 transition-all w-full h-9 group shadow-xs"
                >
                  <CheckSquare className="w-4 h-4 text-brand-600 shrink-0 transition-colors" />
                  <span className="truncate">My Tasks</span>
                </Link>
                <Link
                  to="/attendance"
                  className="px-3 py-2 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-200/80 rounded-md text-xs font-semibold text-slate-800 flex items-center gap-2 transition-all w-full h-9 group shadow-xs"
                >
                  <Clock className="w-4 h-4 text-brand-600 shrink-0 transition-colors" />
                  <span className="truncate">Attendance</span>
                </Link>
                <Link
                  to="/calendar"
                  className="px-3 py-2 bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-200/80 rounded-md text-xs font-semibold text-slate-800 flex items-center gap-2 transition-all w-full h-9 group shadow-xs"
                >
                  <CalendarIcon className="w-4 h-4 text-brand-600 shrink-0 transition-colors" />
                  <span className="truncate">Calendar</span>
                </Link>
              </div>
            </div>
            <div className="pt-1 text-right">
              <span className="text-[11px] text-slate-400 font-medium">Internal Shortcuts</span>
            </div>
          </div>

        </div>
      </div>

      {/* TIER 2 — WHAT AM I WORKING ON? */}
      <div className="space-y-4 pt-2">

        {/* Section Heading & Horizontal Workflow Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base lg:text-lg font-bold text-slate-900">My Workflow & Pending Tasks</h3>
            <p className="text-xs text-slate-500 mt-0.5">Filter sprint tickets and update progress status directly.</p>
          </div>

          {/* Structured Horizontal Workflow Filter Bar */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md border border-slate-200 self-start">
            {[
              { id: 'All', label: 'All', count: tasks.length },
              { id: 'To Do', label: 'To Do', count: todoCount },
              { id: 'In Progress', label: 'In Progress', count: inProgressCount },
              { id: 'In Review', label: 'In Review', count: inReviewCount },
              { id: 'Completed', label: 'Completed', count: completedCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedWorkflow(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${selectedWorkflow === tab.id
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {tab.label} <span className="ml-1 text-xs text-slate-400 font-bold">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Clean Pending Tasks Table */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center"></th>
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleTaskStatus(t.id)}
                        className="text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className={`w-4 h-4 ${t.status === 'Completed' ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-sm font-semibold ${t.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {t.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">{t.project}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${t.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                          t.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">{t.dueDate}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold border ${t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          t.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            t.status === 'In Review' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-400 font-medium text-xs">
                      No tasks found for this status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* TIER 3 — WHAT IS HAPPENING AROUND ME? */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-3">

        {/* Ongoing Work */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Ongoing Work</h4>
            <Link to="/projects" className="text-xs font-semibold text-brand-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {ongoingProjects.map((p, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200/80 space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                  <span className="text-xs font-bold text-slate-700">{p.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${p.progress}%` }} className="bg-slate-800 h-full rounded-full" />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-0.5">
                  <span>Status: {p.status}</span>
                  <span>Due: {p.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Recent Activity</h4>
          </div>
          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div key={act.id} className="flex items-start gap-2.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium leading-normal truncate">{act.message}</p>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{act.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">Announcements</h4>
          </div>
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{ann.title}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{ann.tag}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{ann.details}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* TIER 4 — SUPPORTING INFORMATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-3">

        {/* My Stats Metric Blocks (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">My Stats Overview</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-xs text-slate-500 font-semibold block">Tasks Completed</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">34</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-xs text-slate-500 font-semibold block">In Progress</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">3</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-xs text-slate-500 font-semibold block">Active Projects</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">4</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <span className="text-xs text-slate-500 font-semibold block">Hours Worked</span>
              <span className="text-2xl font-bold text-slate-900 mt-1 block">168h</span>
            </div>
          </div>
        </div>

        {/* Compact Calendar */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h4 className="text-sm font-bold text-slate-900">September 2026</h4>
            <Link to="/calendar" className="text-xs font-semibold text-brand-600 hover:underline">Full Calendar</Link>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {daysInMonth.map((d) => (
              <span
                key={d}
                className={`py-1.5 rounded font-semibold ${d === 1 ? 'bg-brand-600 text-white font-bold' :
                    [5, 6, 12, 13, 19, 20, 26, 27].includes(d) ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'
                  }`}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
