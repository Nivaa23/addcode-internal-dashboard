import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ClipboardList,
  LayoutGrid,
  CalendarDays,
  FileText,
  Activity,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const Dashboard = () => {
  const { currentUser } = useEmployees();

  // 1. Mock local state for Today's Check-in
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState("09:18 AM");

  const handleCheckInToggle = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setCheckInTime("--:--");
    } else {
      setIsLoggedIn(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCheckInTime(timeStr);
    }
  };

  // 2. Mock state for Pending Tasks & Interactive Workflow filter
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

  // Calculations for Workflow counts
  const countByStatus = (status) => tasks.filter(t => t.status === status).length;
  const todoCount = countByStatus("To Do");
  const inProgressCount = countByStatus("In Progress");
  const inReviewCount = countByStatus("In Review");
  const completedCount = countByStatus("Completed");

  // Filtered task lists
  const filteredTasks = selectedWorkflow === 'All'
    ? tasks
    : tasks.filter(t => t.status === selectedWorkflow);

  // Toggle single task completion status (to demonstrate interactivity in the table)
  const handleToggleTaskStatus = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Completed' ? 'To Do' : 'Completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  // 3. Ongoing Work projects
  const ongoingProjects = [
    { name: "Addcode Internal Dashboard", progress: 85, status: "Active Development", due: "Sep 10, 2026" },
    { name: "Cranial Space Onboarding Flow", progress: 40, status: "Designing", due: "Sep 20, 2026" },
    { name: "Novance AI Integration", progress: 60, status: "Testing & Review", due: "Sep 15, 2026" }
  ];

  // 4. Compact Announcements
  const announcements = [
    { id: 1, title: "All-Hands Q3 Strategy Session", details: "Scheduled for Friday at 10:00 AM PST. Agenda: Product roadmap reviews and client project deliveries.", tag: "Important" },
    { id: 2, title: "Wellness & Health Benefits Update", details: "The HR operations team has updated our remote wellness stipend packages. Check email for details.", tag: "HR" },
    { id: 3, title: "Q2 Innovation Hackathon Winners", details: "Congratulations to the Novance team for securing the top spot with their automated deployment script!", tag: "Internal" }
  ];

  return (
    <div className="space-y-6">

      {/* 1. Dashboard Custom Header */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-left">
          <h2 className="font-display font-extrabold text-slate-800 text-2xl tracking-tight m-0">
            Good morning, Nivrutti 👋
          </h2>
          <p className="text-xs text-slate-400 font-semibold">
            Here's what's happening with your work today.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Calendar display */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/40 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-brand-500" />
            <span>Mon, Aug 31, 2026</span>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-200/40 transition-all cursor-pointer">
              <Bell className="w-4 h-4" />
            </button>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border border-white"></span>
          </div>

          {/* Avatar shortcut */}
          <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs">
            N
          </div>
        </div>
      </div>

      {/* 2. Today's Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Today's Check-In */}
        <Card className="relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Today's Check-In</span>
              <h3 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">
                {checkInTime}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className={`w-2 h-2 rounded-full ${isLoggedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{isLoggedIn ? 'Logged In' : 'Logged Out'}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 flex items-center justify-center">
              <Clock className="w-5 h-5 text-brand-500" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-50">
            <Button
              variant={isLoggedIn ? 'danger' : 'primary'}
              size="sm"
              className="w-full py-1.5! rounded-lg font-bold text-xs cursor-pointer flex justify-center items-center"
              onClick={handleCheckInToggle}
            >
              {isLoggedIn ? 'Log Out' : 'Check In'}
            </Button>
          </div>
        </Card>

        {/* Work Hours */}
        <Card>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Work Hours</span>
              <h3 className="font-display font-extrabold text-xl text-slate-800 tracking-tight">4h 35m</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">Expected: 8h 30m</p>
            </div>
            <div className="text-[11px] font-bold text-brand-600 bg-brand-50 border border-brand-100/50 px-2 py-0.5 rounded-lg">
              61%
            </div>
          </div>
          <div className="mt-5.5">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full w-[61%] rounded-full" />
            </div>
            <span className="text-[9px] text-slate-400 font-semibold block mt-1.5">Last login sync: 12 mins ago</span>
          </div>
        </Card>

        {/* Leave Balance */}
        <Card>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Leave Balance</span>
          <div className="grid grid-cols-4 gap-1 text-center">
            <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-lg">
              <div className="text-xs font-extrabold text-slate-800">24</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Alloc</div>
            </div>
            <div className="bg-emerald-50/20 border border-emerald-100 p-1.5 rounded-lg">
              <div className="text-xs font-extrabold text-emerald-700">6</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Used</div>
            </div>
            <div className="bg-amber-50/20 border border-amber-100 p-1.5 rounded-lg">
              <div className="text-xs font-extrabold text-amber-700">2</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Pend</div>
            </div>
            <div className="bg-indigo-50/20 border border-indigo-100 p-1.5 rounded-lg">
              <div className="text-xs font-extrabold text-brand-700">16</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Rem</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Quick Actions</span>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/leaves" className="flex items-center gap-1.5 p-2 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 rounded-xl text-[10px] font-bold text-slate-600 hover:text-brand-700 transition-colors">
              <CalendarDays className="w-3.5 h-3.5 text-brand-500" />
              <span>Apply Leave</span>
            </Link>
            <Link to="/attendance" className="flex items-center gap-1.5 p-2 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 rounded-xl text-[10px] font-bold text-slate-600 hover:text-brand-700 transition-colors">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Attendance</span>
            </Link>
            <Link to="/tasks" className="flex items-center gap-1.5 p-2 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 rounded-xl text-[10px] font-bold text-slate-600 hover:text-brand-700 transition-colors">
              <ClipboardList className="w-3.5 h-3.5 text-pink-500" />
              <span>My Tasks</span>
            </Link>
            <Link to="/calendar" className="flex items-center gap-1.5 p-2 bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 rounded-xl text-[10px] font-bold text-slate-600 hover:text-brand-700 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-purple-500" />
              <span>Calendar</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns: Workflow, Tasks, Ongoing projects */}
        <div className="lg:col-span-2 space-y-6">

          {/* My Workflow selector */}
          <Card title="My Workflows" subtitle="Click on a workflow status card below to filter the active task queue.">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              {/* All Filter */}
              <button
                onClick={() => setSelectedWorkflow('All')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${selectedWorkflow === 'All'
                    ? 'border-brand-600 bg-brand-50/30'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Total</span>
                <span className="font-display font-extrabold text-lg text-slate-800">{tasks.length}</span>
                <span className="text-[9px] text-slate-400 font-semibold block mt-1">All Tickets</span>
              </button>

              {/* To Do */}
              <button
                onClick={() => setSelectedWorkflow('To Do')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${selectedWorkflow === 'To Do'
                    ? 'border-brand-600 bg-brand-50/30'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase block">To Do</span>
                <span className="font-display font-extrabold text-lg text-slate-700">{todoCount}</span>
                <span className="text-[9px] text-slate-400 font-semibold block mt-1">Backlog</span>
              </button>

              {/* In Progress */}
              <button
                onClick={() => setSelectedWorkflow('In Progress')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${selectedWorkflow === 'In Progress'
                    ? 'border-brand-600 bg-brand-50/30'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase block">In Progress</span>
                <span className="font-display font-extrabold text-lg text-blue-700">{inProgressCount}</span>
                <span className="text-[9px] text-blue-400 font-semibold block mt-1">Active</span>
              </button>

              {/* In Review */}
              <button
                onClick={() => setSelectedWorkflow('In Review')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${selectedWorkflow === 'In Review'
                    ? 'border-brand-600 bg-brand-50/30'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase block">In Review</span>
                <span className="font-display font-extrabold text-lg text-amber-700">{inReviewCount}</span>
                <span className="text-[9px] text-amber-400 font-semibold block mt-1">Review</span>
              </button>

              {/* Completed */}
              <button
                onClick={() => setSelectedWorkflow('Completed')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all sm:col-span-1 col-span-2 ${selectedWorkflow === 'Completed'
                    ? 'border-brand-600 bg-brand-50/30'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50'
                  }`}
              >
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Completed</span>
                <span className="font-display font-extrabold text-lg text-emerald-700">{completedCount}</span>
                <span className="text-[9px] text-emerald-400 font-semibold block mt-1">Closed</span>
              </button>
            </div>
          </Card>

          {/* Pending Tasks Queue Table */}
          <Card title={`Pending Tasks (${selectedWorkflow})`} subtitle="Check circle icon triggers toggle workflow state.">
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 w-8"></th>
                    <th className="pb-3">Task Details</th>
                    <th className="pb-3">Project</th>
                    <th className="pb-3">Priority</th>
                    <th className="pb-3">Due Date</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
                  <AnimatePresence mode="popLayout">
                    {filteredTasks.map((t) => (
                      <motion.tr
                        layout
                        key={t.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50/30"
                      >
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleTaskStatus(t.id)}
                            className="p-1 text-slate-300 hover:text-brand-600 hover:bg-brand-50 rounded-md cursor-pointer transition-all"
                            title="Toggle Completed"
                          >
                            <CheckCircle2 className={`w-4 h-4 ${t.status === 'Completed' ? 'text-emerald-500 fill-emerald-50' : ''}`} />
                          </button>
                        </td>
                        <td className="py-3">
                          <span className={`text-slate-800 ${t.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                            {t.name}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-medium">{t.project}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${t.priority === 'High' ? 'bg-red-50 text-red-700' :
                              t.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 font-semibold">{t.dueDate}</td>
                        <td className="py-3 text-right">
                          <Badge status={t.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                        No tasks match the selected workflow state.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Ongoing Work */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
              Ongoing Project Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {ongoingProjects.map((p, idx) => (
                <Card key={idx} className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h5 className="text-xs font-bold text-slate-800 leading-tight pr-2">
                        {p.name}
                      </h5>
                      <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
                        {p.progress}%
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div style={{ width: `${p.progress}%` }} className="bg-brand-500 h-full rounded-full" />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span className="bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded text-[9px] text-slate-600 font-semibold">
                      {p.status}
                    </span>
                    <span>Due: {p.due}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Stats, Announcements */}
        <div className="space-y-6">

          {/* My Stats Card */}
          <Card title="My Operations Log" subtitle="Your monthly engineering activity snapshot.">
            <div className="space-y-4 pt-2 text-left">

              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Tasks Completed</h5>
                    <p className="text-[9px] text-slate-400 font-semibold">Across all codebases</p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-lg text-slate-800">34</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Tickets Active</h5>
                    <p className="text-[9px] text-slate-400 font-semibold">Allocated in sprint</p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-lg text-slate-800">3</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 text-pink-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Active Repositories</h5>
                    <p className="text-[9px] text-slate-400 font-semibold">Assigned deployments</p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-lg text-slate-800">4</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Total Hours Logged</h5>
                    <p className="text-[9px] text-slate-400 font-semibold">Standard calendar month</p>
                  </div>
                </div>
                <span className="font-display font-extrabold text-lg text-slate-800">168h</span>
              </div>

            </div>
          </Card>

          {/* Announcements Card */}
          <Card title="Corporate Bulletins" subtitle="Operational updates and team announcements.">
            <div className="space-y-4 pt-2 text-left">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/30 hover:bg-slate-50/60 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <h5 className="text-xs font-bold text-slate-800 leading-tight">
                      {ann.title}
                    </h5>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 uppercase ${ann.tag === 'Important' ? 'bg-red-50 text-red-700' :
                        ann.tag === 'HR' ? 'bg-indigo-50 text-brand-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {ann.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1.5 leading-relaxed">
                    {ann.details}
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
