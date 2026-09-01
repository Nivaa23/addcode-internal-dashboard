import React, { useState } from 'react';
import {
  Search,
  Plus,
  X
} from 'lucide-react';
import { mockTasks as initialTasks, mockProjects } from '../data/mockTasksAndProjects';
import { useEmployees } from '../context/EmployeeContext';

export default function Tasks() {
  const { currentUser } = useEmployees();
  const [tasks, setTasks] = useState(initialTasks);

  // Filter States
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Task Modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Calculate Metrics
  const totalTasks = tasks.length;
  const todoCount = tasks.filter(t => t.status === 'To Do').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const inReviewCount = tasks.filter(t => t.status === 'In Review').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  // Filter Logic
  const filteredTasks = tasks.filter(t => {
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'All' || t.project === projectFilter;
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.project.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPriority && matchesProject && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'In Progress':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>;
      case 'In Review':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">In Review</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">To Do</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-red-50 text-red-700 border border-red-200">Critical</span>;
      case 'High':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-orange-50 text-orange-700 border border-orange-200">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">Medium</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">Low</span>;
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedUser = currentUser?.name || 'Nivrutti';
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newProgress = newStatus === 'Completed' ? 100 : t.progress;
        const newActivity = {
          id: `act-${Date.now()}`,
          event: `Status changed to ${newStatus}`,
          user: updatedUser,
          timestamp: 'Just now'
        };
        const updated = {
          ...t,
          status: newStatus,
          progress: newProgress,
          activity: [newActivity, ...t.activity]
        };
        if (selectedTask?.id === taskId) setSelectedTask(updated);
        return updated;
      }
      return t;
    }));
  };

  const handleProgressChange = (taskId, newProgressValue) => {
    const progressNum = Math.min(100, Math.max(0, parseInt(newProgressValue, 10) || 0));
    const updatedUser = currentUser?.name || 'Nivrutti';
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newStatus = progressNum === 100 ? 'Completed' : t.status;
        const newActivity = {
          id: `act-${Date.now()}`,
          event: `Progress updated to ${progressNum}%`,
          user: updatedUser,
          timestamp: 'Just now'
        };
        const updated = {
          ...t,
          progress: progressNum,
          status: newStatus,
          activity: [newActivity, ...t.activity]
        };
        if (selectedTask?.id === taskId) setSelectedTask(updated);
        return updated;
      }
      return t;
    }));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || !selectedTask) return;

    const authorName = currentUser?.name || 'Nivrutti';
    const authorAvatar = currentUser?.avatar || authorName.slice(0, 2).toUpperCase();

    const newComment = {
      id: `comm-${Date.now()}`,
      user: authorName,
      avatar: authorAvatar,
      text: newCommentText.trim(),
      time: 'Just now'
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      event: 'Added a comment',
      user: authorName,
      timestamp: 'Just now'
    };

    setTasks(prev => prev.map(t => {
      if (t.id === selectedTask.id) {
        const updated = {
          ...t,
          comments: [...t.comments, newComment],
          activity: [newActivity, ...t.activity]
        };
        setSelectedTask(updated);
        return updated;
      }
      return t;
    }));

    setNewCommentText('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-display">My Tasks</h1>
          <p className="text-xs lg:text-sm text-slate-500 font-medium mt-1">Manage engineering tickets, update completion progress, and view activity history.</p>
        </div>
        <button
          onClick={() => {
            const newTaskObj = {
              id: `TSK-${Math.floor(110 + Math.random() * 890)}`,
              title: 'New Engineering Task Item',
              projectId: 'PRJ-101',
              project: 'Addcode Internal Dashboard',
              status: 'To Do',
              priority: 'Medium',
              dueDate: new Date().toISOString().split('T')[0],
              progress: 0,
              assignedBy: currentUser?.name || 'Sarah Connor',
              assignee: currentUser?.name || 'Nivrutti',
              description: 'Created new sprint action item.',
              comments: [],
              activity: [{ id: `act-${Date.now()}`, event: 'Task created', user: currentUser?.name || 'Nivrutti', timestamp: 'Just now' }]
            };
            setTasks([newTaskObj, ...tasks]);
            setSelectedTask(newTaskObj);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Metric Blocks Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Tasks</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{totalTasks}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">To Do</span>
          <span className="text-2xl font-bold text-slate-700 mt-1 block">{todoCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">In Progress</span>
          <span className="text-2xl font-bold text-blue-600 mt-1 block">{inProgressCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">In Review</span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">{inReviewCount}</span>
        </div>
        <div className="p-4 bg-white border border-slate-200 rounded shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-500 block">Completed</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">{completedCount}</span>
        </div>
      </div>

      {/* Filter Toolbar (shadcn style) */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 overflow-x-auto">
            {['All', 'To Do', 'In Progress', 'In Review', 'Completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${statusFilter === tab ? 'bg-white text-slate-900 font-semibold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="py-1 px-2.5 text-xs border border-slate-200 rounded bg-slate-50 text-slate-800"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="py-1 px-2.5 text-xs border border-slate-200 rounded bg-slate-50 text-slate-800"
            >
              <option value="All">All Projects</option>
              {mockProjects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <th className="py-3 px-4 w-28">Task ID</th>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-400 font-bold">{task.id}</td>
                  <td className="py-3.5 px-4 text-sm font-semibold text-slate-900">{task.title}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">{task.project}</td>
                  <td className="py-3.5 px-4">{getPriorityBadge(task.priority)}</td>
                  <td className="py-3.5 px-4 w-36">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div style={{ width: `${task.progress}%` }} className="bg-slate-800 h-full rounded-full" />
                      </div>
                      <span className="text-xs text-slate-400 font-bold">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600 font-medium">{task.dueDate}</td>
                  <td className="py-3.5 px-4 text-right">{getStatusBadge(task.status)}</td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-medium text-xs">
                    No tasks match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TASK DETAILS MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-xs"
          >
            <div className="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-slate-400">{selectedTask.id}</span>
                  {getStatusBadge(selectedTask.status)}
                  {getPriorityBadge(selectedTask.priority)}
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedTask.title}</h3>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Project</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedTask.project}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned By</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedTask.assignedBy}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Assignee</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedTask.assignee}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Due Date</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedTask.dueDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 border border-slate-200 rounded bg-white">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Change Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask.id, e.target.value)}
                    className="w-full p-1.5 border border-slate-200 rounded text-xs bg-slate-50 text-slate-800"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Update Progress</span>
                    <span>{selectedTask.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={selectedTask.progress}
                    onChange={(e) => handleProgressChange(selectedTask.id, e.target.value)}
                    className="w-full accent-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Description</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Comments ({selectedTask.comments.length})</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedTask.comments.map((c) => (
                      <div key={c.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>{c.user}</span>
                          <span>{c.time}</span>
                        </div>
                        <p className="text-slate-700 mt-1">{c.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="flex-1 p-1.5 border border-slate-200 rounded text-xs"
                    />
                    <button type="submit" className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded text-xs">
                      Post
                    </button>
                  </form>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-slate-800 uppercase text-[10px]">Activity Log</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pl-2 border-l border-slate-200">
                    {selectedTask.activity.map((act) => (
                      <div key={act.id} className="text-[11px]">
                        <p className="font-semibold text-slate-800">{act.event}</p>
                        <span className="text-[10px] text-slate-400">{act.user} • {act.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
