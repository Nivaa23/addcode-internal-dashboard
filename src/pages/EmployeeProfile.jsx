import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  UserCheck,
  Edit3,
  X,
  Building2
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

export default function EmployeeProfile() {
  const { id } = useParams();
  const { employees, currentUser, updateEmployee, requestTimeOff, signDocument } = useEmployees();

  const resolvedId = id || currentUser.id;
  const emp = employees.find(e => e.id === resolvedId) || {
    id: "EMP-2026-001",
    name: currentUser.name || "Nivrutti",
    role: "Lead Systems Architect",
    department: "Engineering",
    email: "nivrutti@addcode.engineering",
    phone: "+1 (555) 019-2834",
    joinDate: "2021-06-01",
    status: "Active",
    employmentType: "Full-Time Permanent",
    location: "San Francisco",
    manager: "Sarah Connor",
    bio: "Lead Systems Architect at Addcode Engineering. Driving core platform architecture, serverless migration, and infrastructure scalability.",
    skills: ["System Architecture", "React", "Node.js", "Scalability", "AWS"],
    projects: ["Addcode Internal Dashboard", "Project Phoenix"],
    attendance: 99.5,
    performance: 4.9,
    timeOffRequests: [],
    documents: []
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: emp.name || '',
    role: emp.role || '',
    department: emp.department || '',
    email: emp.email || '',
    phone: emp.phone || '',
    manager: emp.manager || 'Sarah Connor',
    joinDate: emp.joinDate || '2021-06-01',
    employmentType: emp.employmentType || 'Full-Time Permanent',
    status: emp.status || 'Active',
    location: emp.location || 'San Francisco',
    bio: emp.bio || ''
  });

  const [leaveForm, setLeaveForm] = useState({
    type: 'Vacation',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'EM';
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateEmployee(emp.id, profileForm);
    setIsEditingModalOpen(false);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate) return;
    requestTimeOff(emp.id, leaveForm.type, leaveForm.startDate, leaveForm.endDate, leaveForm.notes);
    setLeaveForm({ type: 'Vacation', startDate: '', endDate: '', notes: '' });
    setIsLeaveModalOpen(false);
  };

  const tabs = [
    { id: 'overview', name: 'Overview & Details' },
    { id: 'skills', name: 'Skills & Projects' },
    { id: 'time-off', name: 'Time Off History' },
    { id: 'documents', name: 'Documents' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Back Link Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <Link to="/profile" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
        </Link>

        <button
          onClick={() => setIsEditingModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      {/* Profile Header Banner */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg shrink-0">
              {getInitials(emp.name)}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900">{emp.name}</h1>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {emp.status}
                </span>
              </div>

              <p className="text-xs font-semibold text-slate-700">{emp.role} • <span className="text-slate-500 font-normal">{emp.department}</span></p>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 text-[11px] font-medium pt-0.5">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {emp.location}</span>
                <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-slate-400" /> {emp.employmentType || 'Full-Time Permanent'}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" /> Joined {emp.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-xs self-start sm:self-auto">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee ID</span>
            <span className="font-mono font-bold text-slate-900">{emp.id}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-slate-100 -mx-4 -mb-4 px-4 overflow-x-auto text-xs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2.5 px-3 font-medium border-b-2 cursor-pointer transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? 'border-slate-900 text-slate-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">Employee Details Specs</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Full Name</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{emp.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee ID</span>
                  <span className="font-mono font-semibold text-slate-900 mt-0.5 block">{emp.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Corporate Email</span>
                  <a href={`mailto:${emp.email}`} className="font-semibold text-slate-900 hover:underline mt-0.5 block">{emp.email}</a>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact Phone</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{emp.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{emp.department}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Designation</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{emp.role}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Reporting Manager</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{emp.manager || 'Sarah Connor'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Joining Date</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{emp.joinDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Employment Type</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{emp.employmentType || 'Full-Time Permanent'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                  <span className="font-semibold text-emerald-700 mt-0.5 block">{emp.status}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Biography</span>
                <p className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 leading-relaxed">
                  {emp.bio || "No professional biography provided."}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">Skills & Assigned Projects</h3>

              <div className="space-y-2">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Core Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {emp.skills?.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-800 font-semibold text-xs px-2.5 py-1 rounded border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Assigned Projects</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {emp.projects?.map((proj, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="font-bold text-slate-900 text-xs block">{proj}</span>
                      <span className="text-[10px] text-slate-400">Engineering Pod</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'time-off' && (
            <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">Time Off Logs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Dates</th>
                      <th className="py-2.5 px-3">Notes</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {emp.timeOffRequests?.map((req) => (
                      <tr key={req.id}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{req.type}</td>
                        <td className="py-2.5 px-3 text-slate-600">{req.startDate} to {req.endDate}</td>
                        <td className="py-2.5 px-3 text-slate-500 max-w-xs truncate">{req.notes}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!emp.timeOffRequests || emp.timeOffRequests.length === 0) && (
                      <tr>
                        <td colSpan="4" className="py-6 text-center text-slate-400 font-medium">
                          No leave requests recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">Compliance Documents</h3>
              <div className="space-y-2">
                {emp.documents?.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-900 block">{doc.name}</span>
                      <span className="text-[10px] text-slate-400">Status: {doc.status}</span>
                    </div>
                    {doc.status === 'Pending' ? (
                      <button
                        onClick={() => signDocument(emp.id, doc.id)}
                        className="px-2.5 py-1 bg-brand-600 text-white font-bold rounded text-xs"
                      >
                        Sign Document
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded font-bold text-[10px]">
                        Signed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stats Column */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">Metrics Snapshot</h3>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Attendance Rate</span>
                <span className="text-slate-900 font-bold">{emp.attendance}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div style={{ width: `${emp.attendance}%` }} className="bg-slate-800 h-1.5 rounded-full" />
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Performance Rating</span>
                <span className="text-emerald-700 font-bold">{emp.performance} / 5.0</span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= Math.floor(emp.performance) ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
      {isEditingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Edit Profile</h3>
              <button onClick={() => setIsEditingModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Designation</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Department</label>
                  <input
                    type="text"
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Manager</label>
                  <input
                    type="text"
                    value={profileForm.manager}
                    onChange={(e) => setProfileForm({ ...profileForm, manager: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Biography</label>
                <textarea
                  rows="3"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingModalOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
