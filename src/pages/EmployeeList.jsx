import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Calendar, ChevronRight, UserMinus, Eye } from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const EmployeeList = () => {
  const { employees, terminateEmployee } = useEmployees();
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedLoc, setSelectedLoc] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Filters Options
  const departments = ['All', 'Engineering', 'Design', 'Product', 'HR', 'Marketing'];
  const locations = ['All', 'San Francisco', 'Bengaluru', 'London', 'Berlin', 'Remote'];
  const statuses = ['All', 'Active', 'Onboarding', 'On Leave'];

  // Filtering Logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || 
                          emp.role.toLowerCase().includes(search.toLowerCase()) ||
                          emp.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept || (selectedDept === 'HR' && emp.department === 'HR');
    const matchesLoc = selectedLoc === 'All' || emp.location === selectedLoc;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;
    
    return matchesSearch && matchesDept && matchesLoc && matchesStatus;
  });

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleDelete = (id, name, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to offboard ${name}? This will remove them from the active dashboard directory.`)) {
      terminateEmployee(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <Card padding="md" className="bg-white">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                placeholder="Search by name, role, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {/* Department Select */}
              <div className="w-full sm:w-40">
                <Input
                  type="select"
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  options={departments.map(d => ({ value: d, label: d === 'All' ? 'All Departments' : d }))}
                />
              </div>

              {/* Location Select */}
              <div className="w-full sm:w-40">
                <Input
                  type="select"
                  value={selectedLoc}
                  onChange={(e) => setSelectedLoc(e.target.value)}
                  options={locations.map(l => ({ value: l, label: l === 'All' ? 'All Locations' : l }))}
                />
              </div>

              {/* Status Select */}
              <div className="w-full sm:w-40">
                <Input
                  type="select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  options={statuses.map(s => ({ value: s, label: s === 'All' ? 'All Statuses' : s }))}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Directory count and grid */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Found {filteredEmployees.length} {filteredEmployees.length === 1 ? 'employee' : 'employees'}
        </span>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredEmployees.map((emp) => (
            <motion.div
              layout
              key={emp.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card hoverable className="h-full flex flex-col justify-between group relative">
                <div>
                  {/* Top line: status and options */}
                  <div className="flex justify-between items-start mb-4">
                    <Badge status={emp.status} />
                    <span className="text-[10px] font-bold text-slate-400 font-mono tracking-tight bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      {emp.id}
                    </span>
                  </div>

                  {/* Profile info */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-base shadow-sm">
                      {getInitials(emp.name)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-semibold text-slate-800 text-sm tracking-tight leading-snug group-hover:text-brand-600 transition-colors truncate">
                        {emp.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-medium truncate">
                        {emp.role}
                      </p>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="space-y-2 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.department} Team</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{emp.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Joined {emp.joinDate}</span>
                    </div>
                  </div>
                </div>

                {/* Hover overlay/quick actions */}
                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                  <Link to={`/employees/${emp.id}`} className="w-full mr-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-lg p-2 shrink-0 cursor-pointer"
                    onClick={(e) => handleDelete(emp.id, emp.name, e)}
                    title="Offboard Employee"
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredEmployees.length === 0 && (
        <Card padding="lg" className="text-center py-16 bg-white">
          <p className="text-slate-400 font-semibold mb-2">No employees match your filter criteria.</p>
          <p className="text-xs text-slate-400">Try adjusting your query or resetting your active dropdowns.</p>
        </Card>
      )}
    </div>
  );
};

export default EmployeeList;
