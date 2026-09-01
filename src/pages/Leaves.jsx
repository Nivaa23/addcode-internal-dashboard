import React, { useState } from 'react';
import {
  Plus,
  Upload,
  X
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

export default function Leaves() {
  const { currentUser } = useEmployees();

  const [leaveBalances, setLeaveBalances] = useState({
    casual: { allocated: 10, used: 3, remaining: 7 },
    sick: { allocated: 8, used: 1, remaining: 7 },
    earned: { allocated: 6, used: 2, remaining: 4 },
  });

  const [leaveHistory, setLeaveHistory] = useState([
    { id: 'LR-101', type: 'Casual Leave', startDate: '2026-09-09', endDate: '2026-09-09', days: 1, reason: 'Personal errands and family commitment.', status: 'Approved' },
    { id: 'LR-102', type: 'Sick Leave', startDate: '2026-08-14', endDate: '2026-08-15', days: 2, reason: 'Viral fever and doctor advice for rest.', status: 'Approved' },
    { id: 'LR-103', type: 'Earned Leave', startDate: '2026-09-25', endDate: '2026-09-26', days: 2, reason: 'Attending technical conference.', status: 'Pending' },
    { id: 'LR-104', type: 'Casual Leave', startDate: '2026-07-02', endDate: '2026-07-02', days: 1, reason: 'Home maintenance work.', status: 'Approved' },
    { id: 'LR-105', type: 'Sick Leave', startDate: '2026-06-10', endDate: '2026-06-11', days: 2, reason: 'Dental surgery recovery.', status: 'Rejected' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
    fileName: ''
  });

  const totalAllocated = leaveBalances.casual.allocated + leaveBalances.sick.allocated + leaveBalances.earned.allocated;
  const totalUsed = leaveBalances.casual.used + leaveBalances.sick.used + leaveBalances.earned.used;
  const pendingCount = leaveHistory.filter(h => h.status === 'Pending').length;
  const totalRemaining = leaveBalances.casual.remaining + leaveBalances.sick.remaining + leaveBalances.earned.remaining;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) return;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.max(0, end - start);
    const calcDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const newRequest = {
      id: `LR-${Math.floor(106 + Math.random() * 894)}`,
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: calcDays,
      reason: formData.reason || 'Leave request',
      status: 'Pending'
    };

    setLeaveHistory([newRequest, ...leaveHistory]);
    setIsModalOpen(false);
    setFormData({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      days: 1,
      reason: '',
      fileName: ''
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'Pending':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      case 'Rejected':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-red-50 text-red-700 border border-red-200">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600">Unknown</span>;
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Leaves & Time Off</h1>
          <p className="text-xs text-slate-500 mt-0.5">Annual leave balances, out-of-office requests, and approval status logs.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Apply for Leave
        </button>
      </div>

      {/* Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Allocated</span>
          <span className="text-lg font-bold text-slate-900 mt-0.5 block">{totalAllocated} Days</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Used</span>
          <span className="text-lg font-bold text-slate-700 mt-0.5 block">{totalUsed} Days</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
          <span className="text-lg font-bold text-amber-600 mt-0.5 block">{pendingCount} Requests</span>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remaining</span>
          <span className="text-lg font-bold text-emerald-600 mt-0.5 block">{totalRemaining} Days</span>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900">Leave Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Casual Leave</h4>
              <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {leaveBalances.casual.remaining} Left
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Allocated: {leaveBalances.casual.allocated}</span>
                <span>Used: {leaveBalances.casual.used}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-slate-800 h-1.5 rounded-full" style={{ width: `${(leaveBalances.casual.used / leaveBalances.casual.allocated) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Sick Leave</h4>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {leaveBalances.sick.remaining} Left
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Allocated: {leaveBalances.sick.allocated}</span>
                <span>Used: {leaveBalances.sick.used}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${(leaveBalances.sick.used / leaveBalances.sick.allocated) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">Earned Leave</h4>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {leaveBalances.earned.remaining} Left
              </span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Allocated: {leaveBalances.earned.allocated}</span>
                <span>Used: {leaveBalances.earned.used}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${(leaveBalances.earned.used / leaveBalances.earned.allocated) * 100}%` }} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-bold text-slate-900 text-xs">Leave Application Logs</h3>
          <span className="text-[10px] text-slate-400 font-semibold">{leaveHistory.length} Total Logs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-4">Leave Type</th>
                <th className="py-2.5 px-4">Duration Dates</th>
                <th className="py-2.5 px-4">Days</th>
                <th className="py-2.5 px-4">Reason</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaveHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900">{item.type}</td>
                  <td className="py-2.5 px-4 text-slate-600">{item.startDate} to {item.endDate}</td>
                  <td className="py-2.5 px-4 font-bold text-slate-900">{item.days} {item.days > 1 ? 'Days' : 'Day'}</td>
                  <td className="py-2.5 px-4 text-slate-500 max-w-xs truncate">{item.reason}</td>
                  <td className="py-2.5 px-4 text-right">{getStatusBadge(item.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Apply for Leave</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-4 space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Leave Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded bg-slate-50 text-slate-800"
                >
                  <option value="Casual Leave">Casual Leave (Remaining: {leaveBalances.casual.remaining})</option>
                  <option value="Sick Leave">Sick Leave (Remaining: {leaveBalances.sick.remaining})</option>
                  <option value="Earned Leave">Earned Leave (Remaining: {leaveBalances.earned.remaining})</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase text-[10px]">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Reason</label>
                <textarea
                  rows="3"
                  placeholder="Reason for leave request..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase text-[10px]">Supporting File (Optional)</label>
                <div className="border border-dashed border-slate-200 rounded p-3 text-center bg-slate-50">
                  <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span className="text-slate-500 font-medium text-[11px] block">Click to upload supporting note</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
