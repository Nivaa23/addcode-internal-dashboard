import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  ShieldAlert,
  FileText,
  CheckCircle,
  FileSignature,
  PlusCircle
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const EmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees, currentUser, updateEmployee, updateTimeOffRequestStatus, requestTimeOff, signDocument } = useEmployees();
  
  const resolvedId = id || currentUser.id;
  const emp = employees.find(e => e.id === resolvedId);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(emp ? {
    name: emp.name,
    role: emp.role,
    email: emp.email,
    phone: emp.phone,
    location: emp.location,
    bio: emp.bio
  } : {});

  // Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    type: 'Vacation',
    startDate: '',
    endDate: '',
    notes: ''
  });

  if (!emp) {
    return (
      <Card className="text-center py-16">
        <h3 className="font-semibold text-slate-800 text-lg">Employee profile not found</h3>
        <p className="text-xs text-slate-400 mt-2">The record may have been deleted or doesn't exist.</p>
        <Link to="/employees" className="mt-4 inline-block">
          <Button variant="primary" size="sm">Back to Directory</Button>
        </Link>
      </Card>
    );
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    updateEmployee(emp.id, editForm);
    setIsEditing(false);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate) {
      alert("Please fill in start and end dates");
      return;
    }
    requestTimeOff(emp.id, leaveForm.type, leaveForm.startDate, leaveForm.endDate, leaveForm.notes);
    setLeaveForm({ type: 'Vacation', startDate: '', endDate: '', notes: '' });
    setIsLeaveModalOpen(false);
  };

  const tabs = [
    { id: 'overview', name: 'Overview & Details' },
    { id: 'skills', name: 'Skills & Projects' },
    { id: 'time-off', name: 'Time Off History' },
    { id: 'documents', name: 'Documents & Compliance' }
  ];

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link to="/employees" className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Directory
      </Link>

      {/* Profile Banner */}
      <Card className="bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl shadow-inner">
              {getInitials(emp.name)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight m-0">{emp.name}</h2>
                <Badge status={emp.status} />
              </div>
              <p className="text-xs text-slate-400 font-semibold">{emp.role}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 text-xs font-semibold mt-1">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {emp.location}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {emp.department} Team</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined {emp.joinDate}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSaveProfile}>Save Changes</Button>
              </>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-t border-slate-100 mt-6 -mx-6 -mb-6 px-6 overflow-x-auto whitespace-nowrap scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-4 text-xs font-bold border-b-2 cursor-pointer transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'border-brand-600 text-brand-700 font-extrabold' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </Card>

      {/* Tab Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details Panel (Left Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <Card title="Professional Profile" subtitle="Basic employee records and organizational info.">
              {isEditing ? (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" name="name" value={editForm.name} onChange={handleEditChange} />
                    <Input label="Job Title" name="role" value={editForm.role} onChange={handleEditChange} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Email" name="email" value={editForm.email} onChange={handleEditChange} />
                    <Input label="Phone" name="phone" value={editForm.phone} onChange={handleEditChange} />
                  </div>
                  <Input label="Location" name="location" value={editForm.location} onChange={handleEditChange} />
                  <Input type="textarea" label="Professional Biography" name="bio" value={editForm.bio} onChange={handleEditChange} rows={4} />
                </div>
              ) : (
                <div className="space-y-6 pt-2">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biography</h4>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {emp.bio || "No professional biography has been provided for this employee."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 border-t border-slate-50 pt-6">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</span>
                      <a href={`mailto:${emp.email}`} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" /> {emp.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Phone Number</span>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {emp.phone}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Reporting Line</span>
                      <span className="text-xs font-semibold text-slate-700">
                        Reports to <span className="text-brand-700">{emp.manager}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Corporate ID</span>
                      <span className="text-xs font-bold text-slate-700 font-mono">
                        {emp.id}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'skills' && (
            <Card title="Skills Matrix & Active Deliverables" subtitle="Registered competencies and client projects.">
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expertise & Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {emp.skills && emp.skills.map((skill, index) => (
                      <span key={index} className="bg-slate-100 border border-slate-200/50 text-slate-600 px-3 py-1 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-50 pt-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Projects</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {emp.projects && emp.projects.map((project, idx) => (
                      <div key={idx} className="border border-slate-100 p-4 rounded-xl bg-slate-50/30">
                        <h5 className="text-xs font-bold text-slate-800">{project}</h5>
                        <p className="text-[10px] text-slate-400 mt-1">Status: Active Development</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'time-off' && (
            <Card 
              title="Time Off & Absence Log" 
              subtitle="Registered leave history and request status trackers."
              headerAction={
                <Button 
                  variant="primary" 
                  size="sm" 
                  leftIcon={<PlusCircle className="w-4 h-4" />}
                  onClick={() => setIsLeaveModalOpen(true)}
                >
                  Request Leave
                </Button>
              }
            >
              <div className="pt-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="pb-3">Type</th>
                        <th className="pb-3">Duration</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Notes</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs">
                      {emp.timeOffRequests && emp.timeOffRequests.map((req) => (
                        <tr key={req.id}>
                          <td className="py-4 font-bold text-slate-700">{req.type}</td>
                          <td className="py-4 font-semibold text-slate-500">{req.startDate} to {req.endDate}</td>
                          <td className="py-4"><Badge status={req.status} /></td>
                          <td className="py-4 text-slate-400 font-medium max-w-xs truncate" title={req.notes}>{req.notes}</td>
                          <td className="py-4 text-right">
                            {req.status === 'Pending' ? (
                              <div className="flex gap-1.5 justify-end">
                                <Button 
                                  variant="primary" 
                                  size="sm" 
                                  className="text-[10px] px-2 py-1! rounded-md"
                                  onClick={() => updateTimeOffRequestStatus(emp.id, req.id, 'Approved')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="danger" 
                                  size="sm" 
                                  className="text-[10px] px-2 py-1! rounded-md"
                                  onClick={() => updateTimeOffRequestStatus(emp.id, req.id, 'Rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase">{req.status}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {(!emp.timeOffRequests || emp.timeOffRequests.length === 0) && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                            No leave requests filed yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card title="Onboarding Documents Checklist" subtitle="Required employee documentation signing and status tracking.">
              <div className="space-y-4 pt-2">
                {emp.documents && emp.documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      doc.status === 'Signed' 
                        ? 'bg-emerald-50/20 border-emerald-100 text-slate-800' 
                        : 'bg-amber-50/20 border-amber-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {doc.status === 'Signed' ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <h5 className="text-xs font-bold text-slate-700">{doc.name}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {doc.status === 'Signed' ? `Signed on ${doc.signedDate}` : 'Action required (Pending Signature)'}
                        </p>
                      </div>
                    </div>
                    <div>
                      {doc.status === 'Pending' ? (
                        <Button 
                          variant="accent" 
                          size="sm"
                          leftIcon={<FileSignature className="w-3.5 h-3.5" />}
                          onClick={() => signDocument(emp.id, doc.id)}
                        >
                          Sign Document
                        </Button>
                      ) : (
                        <Badge status="Signed" />
                      )}
                    </div>
                  </div>
                ))}
                {(!emp.documents || emp.documents.length === 0) && (
                  <p className="text-center py-8 text-slate-400 font-medium">No files registered for this account.</p>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Info stats (Right Column) */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Metrics Overview">
            <div className="space-y-6 pt-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Attendance</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-2xl text-slate-800">{emp.attendance}%</span>
                  <span className="text-[10px] font-bold text-emerald-600">Within target</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-2">
                  <div style={{ width: `${emp.attendance}%` }} className="bg-brand-500 h-full rounded-full" />
                </div>
              </div>

              <div className="space-y-1 border-t border-slate-50 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Performance Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-2xl text-slate-800">{emp.performance} <span className="text-sm font-semibold text-slate-400">/ 5.0</span></span>
                  <span className="text-[10px] font-bold text-brand-600">Top Quartile</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span 
                      key={s} 
                      className={`h-2 flex-grow rounded-sm ${
                        s <= Math.floor(emp.performance) ? 'bg-indigo-500' : 'bg-slate-100'
                      }`} 
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-50 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quick Actions</span>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs border border-slate-200/50 hover:bg-slate-50" onClick={() => { setActiveTab('time-off'); setIsLeaveModalOpen(true); }}>
                    Record Leave Request
                  </Button>
                  {emp.status === 'Onboarding' && (
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs border border-slate-200/50 hover:bg-slate-50" onClick={() => setActiveTab('documents')}>
                      View Onboarding Files
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Leave Request Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Record Leave Absence Request"
        footerActions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleLeaveSubmit}>Submit Request</Button>
          </div>
        }
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <Input 
            label="Absence Type" 
            name="type" 
            type="select" 
            value={leaveForm.type}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, type: e.target.value }))}
            options={[
              { value: 'Vacation', label: 'Vacation' },
              { value: 'Sick Leave', label: 'Sick Leave' },
              { value: 'Medical Leave', label: 'Medical Leave' },
              { value: 'Compensatory Off', label: 'Compensatory Off' }
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="date" 
              value={leaveForm.startDate}
              onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
              required
            />
            <Input 
              label="End Date" 
              type="date" 
              value={leaveForm.endDate}
              onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
              required
            />
          </div>
          <Input 
            label="Administrative Notes" 
            type="textarea" 
            placeholder="Additional context or description..."
            value={leaveForm.notes}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </form>
      </Modal>
    </div>
  );
};

export default EmployeeProfile;
