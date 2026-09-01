import React, { useState } from 'react';
import {
  FolderGit2,
  Users,
  Calendar,
  Plus,
  X,
  CheckSquare
} from 'lucide-react';
import { mockProjects, mockTasks } from '../data/mockTasksAndProjects';
import { useEmployees } from '../context/EmployeeContext';

export default function Projects() {
  const { currentUser } = useEmployees();
  const [projectsList, setProjectsList] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [taskFilterTab, setTaskFilterTab] = useState('all');

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Completed</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">Planning</span>;
    }
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
  const pendingProjectTasks = selectedProject ? mockTasks.filter(t => (t.project === selectedProject.name || t.projectId === selectedProject.id) && t.status === 'To Do').length : 0;

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Engineering Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">Active software deliverables, team allocations, and target schedules.</p>
        </div>
        <button
          onClick={() => {
            const newProj = {
              id: `PRJ-${Math.floor(106 + Math.random() * 894)}`,
              name: 'New Subsystem Module',
              description: 'Designing high-performance platform subsystem module.',
              status: 'In Progress',
              progress: 20,
              projectLead: currentUser?.name || 'Nivrutti',
              leadRole: 'Lead Systems Architect',
              leadAvatar: 'N',
              teamSize: 4,
              startDate: new Date().toISOString().split('T')[0],
              expectedCompletion: '2026-11-30',
              teamMembers: [
                { name: currentUser?.name || 'Nivrutti', role: 'Lead Architect', avatar: 'N' }
              ]
            };
            setProjectsList([newProj, ...projectsList]);
            setSelectedProject(newProj);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projectsList.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white border border-slate-200 rounded p-4 shadow-xs hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4 cursor-pointer"
          >
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-slate-400">{project.id}</span>
                {getStatusBadge(project.status)}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {project.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-normal mt-1 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Progress & Lead */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-slate-900 font-bold">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div style={{ width: `${project.progress}%` }} className="bg-slate-800 h-1.5 rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                    {project.leadAvatar || project.projectLead.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="font-semibold text-slate-800">{project.projectLead}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">Lead</span>
              </div>
            </div>

            {/* Footer Specs */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" /> {project.teamSize} Members
              </span>
              <span>Due: {project.expectedCompletion}</span>
            </div>
          </div>
        ))}
      </div>

      {/* PROJECT DETAILS MODAL */}
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
                  <span className="font-mono font-bold text-slate-400">{selectedProject.id}</span>
                  {getStatusBadge(selectedProject.status)}
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedProject.name}</h3>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Project Lead</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedProject.projectLead}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Team Size</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedProject.teamSize} Members</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Start Date</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedProject.startDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Target</span>
                  <span className="block font-semibold text-slate-800 mt-0.5">{selectedProject.expectedCompletion}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Overview</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div className="space-y-1 p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>System Progress</span>
                  <span>{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div style={{ width: `${selectedProject.progress}%` }} className="bg-slate-900 h-2 rounded-full" />
                </div>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
