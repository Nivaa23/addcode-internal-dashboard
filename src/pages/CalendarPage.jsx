import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Clock
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';

export default function CalendarPage() {
  const { currentUser } = useEmployees();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    { id: 'EVT-01', day: 1, title: 'Q3 All-Hands Kickoff', category: 'Work', time: '10:00 AM - 11:30 AM', description: 'Executive team sync reviewing Q3 delivery goals and platform roadmap.', attendees: ['Sarah Connor', 'Nivrutti', 'Marcus Wright'] },
    { id: 'EVT-02', day: 5, title: 'Labor Day Holiday', category: 'Holiday', time: 'All Day', description: 'Official company-wide paid holiday.', attendees: ['All Employees'] },
    { id: 'EVT-03', day: 8, title: 'TSK-102 Pipeline Due', category: 'Task Deadline', time: '05:00 PM', description: 'GitHub Actions secret scanning workflow review deadline.', attendees: ['Marcus Wright', 'Kate Brewster'] },
    { id: 'EVT-04', day: 9, title: 'Nivrutti Casual Leave', category: 'Leave', time: 'All Day', description: 'Approved out-of-office casual leave.', attendees: ['Nivrutti'] },
    { id: 'EVT-05', day: 12, title: 'TSK-101 API Gateway Due', category: 'Task Deadline', time: '06:00 PM', description: 'Redis session cache latency optimization delivery target.', attendees: ['Nivrutti', 'Sarah Connor'] },
    { id: 'EVT-06', day: 15, title: 'Cyberdyne Security Audit', category: 'Work', time: '02:00 PM - 04:00 PM', description: 'External security penetration testing report walkthrough.', attendees: ['Kate Brewster', 'David Kim'] },
    { id: 'EVT-07', day: 20, title: 'Company Hackathon', category: 'Holiday', time: 'All Day', description: 'Annual Addcode engineering hackathon & social event.', attendees: ['All Staff'] },
    { id: 'EVT-08', day: 25, title: 'Sarah on Vacation', category: 'Leave', time: 'All Day', description: 'Approved annual vacation leave.', attendees: ['Sarah Connor'] },
  ];

  const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Work':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">Work Sync</span>;
      case 'Leave':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">Leave</span>;
      case 'Holiday':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-purple-50 text-purple-700 border border-purple-200">Holiday</span>;
      case 'Task Deadline':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-red-50 text-red-700 border border-red-200">Task Deadline</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600">Event</span>;
    }
  };

  const getCategoryTagStyle = (category) => {
    switch (category) {
      case 'Work':
        return 'bg-blue-600 text-white';
      case 'Leave':
        return 'bg-amber-600 text-white';
      case 'Holiday':
        return 'bg-purple-600 text-white';
      case 'Task Deadline':
        return 'bg-red-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-display">Corporate Calendar</h1>
          <p className="text-xs text-slate-500 mt-0.5">Sprint meetings, team availability, company holidays, and ticket deadlines.</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded shadow-xs self-start sm:self-auto">
          <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-xs font-bold text-slate-900">September 2026</span>
          <button className="text-slate-400 hover:text-slate-600 p-0.5 rounded"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Category Legend */}
      <div className="bg-white border border-slate-200 rounded p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-600">
        <span className="text-slate-400 font-bold uppercase text-[10px]">Categories:</span>
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Work Syncs</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Team Leaves</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Holidays</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Task Deadlines</span>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((dayNum) => {
            const dayEvents = events.filter(e => e.day === dayNum);
            const isToday = dayNum === 1;

            return (
              <div
                key={dayNum}
                className={`min-h-[84px] p-1.5 rounded border flex flex-col justify-between ${isToday ? 'border-slate-900 bg-slate-50 font-bold' : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isToday ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>{dayNum}</span>
                  {isToday && <span className="text-[9px] font-bold bg-slate-900 text-white px-1 rounded">Today</span>}
                </div>

                <div className="space-y-1 mt-1">
                  {dayEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEvent(evt)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-semibold truncate cursor-pointer ${getCategoryTagStyle(evt.category)}`}
                    >
                      {evt.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-md overflow-hidden text-xs">
            <div className="p-4 border-b border-slate-200 flex items-start justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-slate-400">{selectedEvent.id}</span>
                  {getCategoryBadge(selectedEvent.category)}
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedEvent.title}</h3>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-800">Date & Time: Sep {selectedEvent.day}, 2026 • {selectedEvent.time}</span>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Description</span>
                <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-slate-700 uppercase text-[10px]">Attendees</span>
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.attendees.map((person, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px]">
                      {person}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button onClick={() => setSelectedEvent(null)} className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
