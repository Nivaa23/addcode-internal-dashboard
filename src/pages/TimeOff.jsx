import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Check, X, CalendarDays, UserPlus, UserMinus, Plus } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const TimeOff = () => {
  const { employees, updateTimeOffRequestStatus, requestTimeOff } = useEmployees();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Form State
  const [leaveForm, setLeaveForm] = useState({
    employeeId: employees[0]?.id || '',
    type: 'Vacation',
    startDate: '',
    endDate: '',
    notes: ''
  });

  // Extract all leave requests with employee details
  const getAllRequests = () => {
    const all = [];
    employees.forEach(emp => {
      if (emp.timeOffRequests) {
        emp.timeOffRequests.forEach(req => {
          all.push({
            employeeId: emp.id,
            employeeName: emp.name,
            employeeRole: emp.role,
            ...req
          });
        });
      }
    });
    // Sort so Pending requests are first, then sorted by startDate
    return all.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (a.status !== 'Pending' && b.status === 'Pending') return 1;
      return new Date(b.startDate) - new Date(a.startDate);
    });
  };

  const requests = getAllRequests();
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const resolvedRequests = requests.filter(r => r.status !== 'Pending');

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.employeeId) {
      alert("Please fill in all required fields");
      return;
    }
    requestTimeOff(leaveForm.employeeId, leaveForm.type, leaveForm.startDate, leaveForm.endDate, leaveForm.notes);
    setLeaveForm({
      employeeId: employees[0]?.id || '',
      type: 'Vacation',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setIsRequestModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</span>
              <h3 className="font-display font-bold text-2xl text-slate-800">{pendingRequests.length} requests</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Requires review and coverage checks</p>
            </div>
            <div className="w-12 h-12 rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CalendarDays className="w-5.5 h-5.5" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Availability</span>
              <h3 className="font-display font-bold text-2xl text-slate-800">
                {Math.round(((employees.length - employees.filter(e => e.status === 'On Leave').length) / employees.length) * 100)}%
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Currently active or remote staff</p>
            </div>
            <div className="w-12 h-12 rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Check className="w-5.5 h-5.5" />
            </div>
          </div>
        </Card>

        <Card className="flex flex-col justify-center">
          <Button 
            variant="primary" 
            size="md" 
            className="w-full flex items-center justify-center gap-2 cursor-pointer"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsRequestModalOpen(true)}
          >
            Record Out of Office
          </Button>
        </Card>
      </div>

      {/* Pending Queue */}
      <Card title="Pending Leave Approvals" subtitle="Requests requiring manager or HR review.">
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Employee</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Notes</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-600">
              <AnimatePresence mode="popLayout">
                {pendingRequests.map((req) => (
                  <motion.tr 
                    layout
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="group"
                  >
                    <td className="py-4">
                      <Link to={`/employees/${req.employeeId}`} className="hover:text-brand-600">
                        <div className="font-bold text-slate-800">{req.employeeName}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{req.employeeRole}</div>
                      </Link>
                    </td>
                    <td className="py-4 font-bold text-slate-700">{req.type}</td>
                    <td className="py-4 text-slate-500">{req.startDate} to {req.endDate}</td>
                    <td className="py-4 text-slate-400 font-medium max-w-xs truncate" title={req.notes}>{req.notes || 'None'}</td>
                    <td className="py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          className="px-2 py-1! rounded-lg cursor-pointer flex items-center justify-center"
                          onClick={() => updateTimeOffRequestStatus(req.employeeId, req.id, 'Approved')}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          className="px-2 py-1! rounded-lg cursor-pointer flex items-center justify-center"
                          onClick={() => updateTimeOffRequestStatus(req.employeeId, req.id, 'Rejected')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {pendingRequests.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                    No pending leave approvals in the queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Resolved History */}
      <Card title="Resolved Absences Logs" subtitle="Audit trail of approved and rejected leave records.">
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="pb-3">Employee</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Notes</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-500">
              {resolvedRequests.map((req) => (
                <tr key={req.id}>
                  <td className="py-4">
                    <Link to={`/employees/${req.employeeId}`} className="hover:text-brand-600">
                      <div className="font-bold text-slate-800">{req.employeeName}</div>
                    </Link>
                  </td>
                  <td className="py-4 font-bold text-slate-700">{req.type}</td>
                  <td className="py-4 text-slate-500">{req.startDate} to {req.endDate}</td>
                  <td className="py-4 text-slate-400 font-medium max-w-xs truncate" title={req.notes}>{req.notes || 'None'}</td>
                  <td className="py-4 text-right">
                    <Badge status={req.status} />
                  </td>
                </tr>
              ))}
              {resolvedRequests.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">
                    No resolved request logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Request Leave Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="File Out-of-Office Absence"
        footerActions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsRequestModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleLeaveSubmit}>File Absence</Button>
          </div>
        }
      >
        <form onSubmit={handleLeaveSubmit} className="space-y-4">
          <Input 
            label="Select Employee" 
            name="employeeId" 
            type="select" 
            value={leaveForm.employeeId}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, employeeId: e.target.value }))}
            options={employees.map(e => ({ value: e.id, label: `${e.name} (${e.role})` }))}
          />
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
            placeholder="Add context or notes here..."
            value={leaveForm.notes}
            onChange={(e) => setLeaveForm(prev => ({ ...prev, notes: e.target.value }))}
            rows={2}
          />
        </form>
      </Modal>
    </div>
  );
};

export default TimeOff;
