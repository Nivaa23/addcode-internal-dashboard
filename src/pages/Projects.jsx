import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Users,
  Plus,
  X,
  Loader2,
  Pencil,
  Trash2,
  AlertTriangle,
  Search,
  ChevronDown,
  Check
} from 'lucide-react';
import { mockTasks } from '../data/mockTasksAndProjects';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../lib/supabase';

export default function Projects() {
  const { currentUser } = useEmployees();

  const [projectsList, setProjectsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState(null);

  // Modals & Active selections
  const [selectedProject, setSelectedProject] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  // Project Manager Custom Combobox State
  const [isPmDropdownOpen, setIsPmDropdownOpen] = useState(false);
  const [pmSearchQuery, setPmSearchQuery] = useState('');
  const [pmDropdownStyle, setPmDropdownStyle] = useState({});
  const pmDropdownRef = useRef(null);

  const updatePmDropdownPosition = () => {
    if (!pmDropdownRef.current) return;
    const rect = pmDropdownRef.current.getBoundingClientRect();
    const dropdownEstimatedHeight = 240;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceBelow < dropdownEstimatedHeight && rect.top > dropdownEstimatedHeight) {
      setPmDropdownStyle({
        position: 'fixed',
        bottom: `${window.innerHeight - rect.top + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 9999
      });
    } else {
      setPmDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 4}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 9999
      });
    }
  };

  useEffect(() => {
    if (isPmDropdownOpen) {
      updatePmDropdownPosition();
      window.addEventListener('resize', updatePmDropdownPosition);
      window.addEventListener('scroll', updatePmDropdownPosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePmDropdownPosition);
      window.removeEventListener('scroll', updatePmDropdownPosition, true);
    };
  }, [isPmDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pmDropdownRef.current && !pmDropdownRef.current.contains(event.target)) {
        // Also check if click was inside portal content
        const portalEl = document.getElementById('pm-dropdown-portal');
        if (portalEl && portalEl.contains(event.target)) return;
        setIsPmDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Form handling & async state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    startDate: '',
    dueDate: '',
    projectManagerId: ''
  });

  const [taskFilterTab, setTaskFilterTab] = useState('all');

  const fetchProjectsAndEmployees = async () => {
    setLoading(true);
    setError(null);
    setEmployeesLoading(true);
    setEmployeesError(null);

    try {
      // 1. Fetch projects from Supabase
      const { data: projData, error: projErr } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (projErr) throw projErr;
      setProjectsList(projData || []);

      // 2. Fetch employees for manager selection exclusively from public.employees
      const { data: empData, error: empErr } = await supabase
        .from('employees')
        .select('id, full_name, employee_id, employment_status, designation, email')
        .neq('employee_id', '169');

      if (empErr) {
        console.error('Error fetching employees for project manager selector:', empErr);
        setEmployeesError(empErr.message || 'Failed to load employees.');
        setEmployeesList([]);
      } else {
        // Sort real employees in ascending numeric order by employee_id
        const sortedEmps = (empData || []).slice().sort((a, b) => {
          const idA = Number(a.employee_id) || 0;
          const idB = Number(b.employee_id) || 0;
          return idA - idB;
        });
        setEmployeesList(sortedEmps);
      }
    } catch (err) {
      console.error('Error fetching projects data:', err);
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsAndEmployees();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      priority: 'medium',
      startDate: '',
      dueDate: '',
      projectManagerId: ''
    });
    setFormError(null);
    setIsPmDropdownOpen(false);
    setPmSearchQuery('');
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditModal = (project) => {
    setFormError(null);
    setIsPmDropdownOpen(false);
    setPmSearchQuery('');
    setFormData({
      name: project.name || '',
      description: project.description || '',
      status: project.status || 'planning',
      priority: project.priority || 'medium',
      startDate: project.start_date || '',
      dueDate: project.due_date || '',
      projectManagerId: project.project_manager_id || ''
    });
    setEditingProject(project);
  };

  const getSelectedPmDisplay = () => {
    if (!formData.projectManagerId) return 'Unassigned';
    const emp = employeesList.find((e) => e.id === formData.projectManagerId);
    if (emp) {
      const name = emp.full_name || emp.email || 'Unnamed Employee';
      const code = emp.employee_id ? ` (${emp.employee_id})` : '';
      return `${name}${code}`;
    }
    return `Assigned (ID: ${formData.projectManagerId.slice(0, 8)})`;
  };

  const filteredPmEmployees = employeesList.filter((emp) => {
    if (!pmSearchQuery.trim()) return true;
    const query = pmSearchQuery.toLowerCase().trim();
    const name = (emp.full_name || emp.email || '').toLowerCase();
    const code = (emp.employee_id || '').toLowerCase();
    return name.includes(query) || code.includes(query);
  });

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Project Name is required.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status || 'planning',
        priority: formData.priority || 'medium',
        start_date: formData.startDate || null,
        due_date: formData.dueDate || null,
        project_manager_id: formData.projectManagerId || null,
        created_by: currentUser?.id || null
      };

      const { error: insertErr } = await supabase.from('projects').insert(payload);
      if (insertErr) throw insertErr;

      setIsCreateOpen(false);
      resetForm();
      await fetchProjectsAndEmployees();
    } catch (err) {
      console.error('Failed to create project:', err);
      setFormError(err.message || 'Failed to create project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError('Project Name is required.');
      return;
    }
    if (!editingProject?.id) return;

    setIsSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        start_date: formData.startDate || null,
        due_date: formData.dueDate || null,
        project_manager_id: formData.projectManagerId || null,
        updated_at: new Date().toISOString()
      };

      const { error: updateErr } = await supabase
        .from('projects')
        .update(payload)
        .eq('id', editingProject.id);

      if (updateErr) throw updateErr;

      setEditingProject(null);
      if (selectedProject?.id === editingProject.id) {
        setSelectedProject(null);
      }
      resetForm();
      await fetchProjectsAndEmployees();
    } catch (err) {
      console.error('Failed to update project:', err);
      setFormError(err.message || 'Failed to update project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject?.id) return;

    setIsDeleting(true);
    setFormError(null);

    try {
      const { error: deleteErr } = await supabase
        .from('projects')
        .delete()
        .eq('id', deletingProject.id);

      if (deleteErr) throw deleteErr;

      setDeletingProject(null);
      if (selectedProject?.id === deletingProject.id) {
        setSelectedProject(null);
      }
      await fetchProjectsAndEmployees();
    } catch (err) {
      console.error('Failed to delete project:', err);
      setFormError(err.message || 'Failed to delete project.');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'planning').toLowerCase();
    switch (s) {
      case 'completed':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'in_progress':
      case 'in progress':
      case 'active development':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>;
      case 'on_hold':
      case 'on hold':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">On Hold</span>;
      case 'planning':
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">Planning</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || 'medium').toLowerCase();
    switch (p) {
      case 'critical':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-red-50 text-red-700 border border-red-200 uppercase">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">High</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">Low</span>;
      case 'medium':
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-600 border border-blue-200 uppercase">Medium</span>;
    }
  };

  const getProjectManagerName = (managerId) => {
    if (!managerId) return 'Unassigned';
    const emp = employeesList.find(e => e.id === managerId);
    if (emp) {
      const code = emp.employee_id ? ` (${emp.employee_id})` : '';
      return `${emp.full_name || emp.email}${code}`;
    }
    return `ID: ${managerId.slice(0, 8)}`;
  };

  const getProjectTasks = () => {
    if (!selectedProject) return [];
    const related = mockTasks.filter(t => t.project === selectedProject.name || t.projectId === selectedProject.id);

    if (taskFilterTab === 'ongoing') {
      return related.filter(t => t.status === 'In Progress' || t.status === 'In Review');
    }
    if (taskFilterTab === 'pending') {
      return related.filter(t => t.status === 'To Do');
    }
    if (taskFilterTab === 'completed') {
      return related.filter(t => t.status === 'Completed');
    }
    return related;
  };

  const projectTasks = getProjectTasks();
  const totalProjectTasks = selectedProject ? mockTasks.filter(t => t.project === selectedProject.name || t.projectId === selectedProject.id).length : 0;
  const completedProjectTasks = selectedProject ? mockTasks.filter(t => (t.project === selectedProject.name || t.projectId === selectedProject.id) && t.status === 'Completed').length : 0;
  const ongoingProjectTasks = selectedProject ? mockTasks.filter(t => (t.project === selectedProject.name || t.projectId === selectedProject.id) && (t.status === 'In Progress' || t.status === 'In Review')).length : 0;

  return (
    <div className="space-y-6 text-left font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Engineering Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">Active software deliverables, team allocations, and target schedules.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-16 flex items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mr-2" />
          <span className="text-xs font-semibold">Loading projects from database...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-semibold flex items-center justify-between">
          <span>Failed to load projects: {error}</span>
          <button onClick={fetchProjectsAndEmployees} className="px-2.5 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">Retry</button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && projectsList.length === 0 && (
        <div className="py-16 border border-dashed border-slate-200 rounded text-center text-xs text-slate-500 bg-slate-50 space-y-3">
          <p className="font-semibold text-slate-700">No engineering projects found in database.</p>
          <p className="text-slate-400">Click "+ New Project" to create your first persistent project.</p>
        </div>
      )}

      {/* Projects Grid */}
      {!loading && !error && projectsList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectsList.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-slate-200 rounded p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4"
            >
              {/* Header info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {getStatusBadge(project.status)}
                    {getPriorityBadge(project.priority)}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(project);
                      }}
                      className="p-1 text-slate-400 hover:text-brand-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingProject(project);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div onClick={() => setSelectedProject(project)} className="cursor-pointer">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight hover:text-brand-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-normal mt-1 line-clamp-2">
                    {project.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              {/* Manager & Specs */}
              <div onClick={() => setSelectedProject(project)} className="space-y-3 pt-2 cursor-pointer">
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                      {getProjectManagerName(project.project_manager_id).slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-slate-800">{getProjectManagerName(project.project_manager_id)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Manager</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>Start: {project.start_date || 'N/A'}</span>
                  <span>Due: {project.due_date || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW PROJECT DETAILS MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-xs"
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getStatusBadge(selectedProject.status)}
                  {getPriorityBadge(selectedProject.priority)}
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedProject.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const p = selectedProject;
                    setSelectedProject(null);
                    openEditModal(p);
                  }}
                  className="px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-700 hover:text-brand-600 hover:border-brand-300 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    const p = selectedProject;
                    setSelectedProject(null);
                    setDeletingProject(p);
                  }}
                  className="px-2.5 py-1.5 bg-white border border-red-200 rounded text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Project Manager</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{getProjectManagerName(selectedProject.project_manager_id)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Start Date</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedProject.start_date || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Target Date</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedProject.due_date || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Overview</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                  {selectedProject.description || 'No description provided.'}
                </p>
              </div>

              {/* Related Tasks */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase text-[10px]">Related Tasks</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded text-[11px]">
                    <button onClick={() => setTaskFilterTab('all')} className={`px-2 py-0.5 rounded ${taskFilterTab === 'all' ? 'bg-white font-bold text-slate-900' : 'text-slate-600'}`}>All ({totalProjectTasks})</button>
                    <button onClick={() => setTaskFilterTab('ongoing')} className={`px-2 py-0.5 rounded ${taskFilterTab === 'ongoing' ? 'bg-white font-bold text-slate-900' : 'text-slate-600'}`}>Ongoing ({ongoingProjectTasks})</button>
                    <button onClick={() => setTaskFilterTab('completed')} className={`px-2 py-0.5 rounded ${taskFilterTab === 'completed' ? 'bg-white font-bold text-slate-900' : 'text-slate-600'}`}>Completed ({completedProjectTasks})</button>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {projectTasks.map((t) => (
                    <div key={t.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-900 block">{t.title}</span>
                        <span className="text-[10px] text-slate-400">Assigned: {t.assignee} • Due: {t.dueDate}</span>
                      </div>
                      {getStatusBadge(t.status)}
                    </div>
                  ))}
                  {projectTasks.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 border border-slate-200 rounded">
                      No related tasks for this project.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PROJECT FORM MODAL */}
      {(isCreateOpen || editingProject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-lg overflow-hidden text-xs font-sans">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingProject(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingProject ? handleEditSubmit : handleCreateSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Project Name */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. NextGen Microservices Refactor"
                  className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Briefly describe the project goals and deliverables..."
                  className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600"
                />
              </div>

              {/* Status & Priority Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-white"
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Start & Due Date Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 bg-white"
                  />
                </div>
              </div>

              {/* Project Manager Selection */}
              <div className="space-y-1 relative" ref={pmDropdownRef}>
                <label className="block font-semibold text-slate-700">Project Manager</label>
                {employeesLoading ? (
                  <div className="p-2 border border-slate-200 rounded text-xs text-slate-500 flex items-center gap-2 bg-slate-50">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600 shrink-0" />
                    <span>Loading employees list...</span>
                  </div>
                ) : employeesError ? (
                  <div className="p-2 border border-red-200 bg-red-50 rounded text-xs text-red-600 font-semibold">
                    Failed to load employees: {employeesError}
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsPmDropdownOpen((prev) => !prev)}
                      className="w-full px-3 py-2 border border-slate-200 rounded text-xs text-slate-900 bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 cursor-pointer text-left font-sans"
                    >
                      <span className="truncate">{getSelectedPmDisplay()}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                    </button>

                    {isPmDropdownOpen && createPortal(
                      <div
                        id="pm-dropdown-portal"
                        style={pmDropdownStyle}
                        className="bg-white border border-slate-200 rounded-md shadow-xl overflow-hidden text-xs font-sans"
                      >
                        {/* Search Input Bar */}
                        <div className="p-2 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            autoFocus
                            value={pmSearchQuery}
                            onChange={(e) => setPmSearchQuery(e.target.value)}
                            placeholder="Search employee..."
                            className="w-full text-xs text-slate-900 bg-transparent focus:outline-none placeholder-slate-400 font-sans"
                          />
                          {pmSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setPmSearchQuery('')}
                              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* Options List (max-h-[185px] shows ~5 employee options with vertical scroll) */}
                        <div className="max-h-46.25 overflow-y-auto py-1">
                          {/* Unassigned Option */}
                          {(!pmSearchQuery.trim() || 'unassigned'.includes(pmSearchQuery.toLowerCase().trim())) && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, projectManagerId: '' }));
                                setIsPmDropdownOpen(false);
                                setPmSearchQuery('');
                              }}
                              className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                                !formData.projectManagerId ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 font-medium'
                              }`}
                            >
                              <span>Unassigned</span>
                              {!formData.projectManagerId && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />}
                            </button>
                          )}

                          {/* Employee List Options */}
                          {filteredPmEmployees.map((emp) => {
                            const isSelected = formData.projectManagerId === emp.id;
                            const name = emp.full_name || emp.email || 'Unnamed Employee';
                            const code = emp.employee_id ? ` (${emp.employee_id})` : '';

                            return (
                              <button
                                key={emp.id}
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, projectManagerId: emp.id }));
                                  setIsPmDropdownOpen(false);
                                  setPmSearchQuery('');
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                                  isSelected ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 font-medium'
                                }`}
                              >
                                <span className="truncate">{name}{code}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0 ml-2" />}
                              </button>
                            );
                          })}

                          {/* Preserved Assigned PM Option if not present in list */}
                          {formData.projectManagerId && !employeesList.some((e) => e.id === formData.projectManagerId) && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsPmDropdownOpen(false);
                                setPmSearchQuery('');
                              }}
                              className="w-full px-3 py-2 text-left flex items-center justify-between bg-brand-50 text-brand-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <span className="truncate">{`Assigned (ID: ${formData.projectManagerId.slice(0, 8)})`}</span>
                              <Check className="w-3.5 h-3.5 text-brand-600 shrink-0 ml-2" />
                            </button>
                          )}

                          {/* No Search Results */}
                          {filteredPmEmployees.length === 0 && (!'unassigned'.includes(pmSearchQuery.toLowerCase().trim()) || pmSearchQuery.trim() !== '') && (
                            <div className="px-3 py-3 text-center text-slate-400 text-xs font-medium">
                              No employee found matching "{pmSearchQuery}"
                            </div>
                          )}
                        </div>
                      </div>,
                      document.body
                    )}
                  </>
                )}
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-3 py-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProject ? 'Save Changes' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md p-5 space-y-4 font-sans text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Project</h3>
                <p className="text-slate-500 text-xs mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-semibold">
                {formError}
              </div>
            )}

            <p className="text-slate-700 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deletingProject.name}</strong> from the database?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingProject(null)}
                className="px-3 py-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
