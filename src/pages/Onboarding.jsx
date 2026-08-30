import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Laptop, 
  CheckSquare, 
  ArrowRight, 
  UserCheck, 
  FileSignature,
  Settings,
  HelpCircle,
  Square
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

const Onboarding = () => {
  const { employees, updateEmployee, signDocument } = useEmployees();
  
  // Get all onboarding employees
  const onboardingStaff = employees.filter(e => e.status === 'Onboarding');

  // Custom checklists state per employee (simulating IT setup & Welcome)
  const [itSetupState, setItSetupState] = useState({});
  const [welcomeKitState, setWelcomeKitState] = useState({});

  const toggleItSetup = (empId) => {
    setItSetupState(prev => ({ ...prev, [empId]: !prev[empId] }));
  };

  const toggleWelcomeKit = (empId) => {
    setWelcomeKitState(prev => ({ ...prev, [empId]: !prev[empId] }));
  };

  const handleCompleteOnboarding = (empId, name) => {
    // Check if documents are signed
    const staff = employees.find(e => e.id === empId);
    const pendingDocs = staff?.documents.filter(d => d.status === 'Pending').length || 0;
    
    if (pendingDocs > 0) {
      if (!window.confirm(`${name} has ${pendingDocs} unsigned documents. Proceed with completing onboarding anyway?`)) {
        return;
      }
    }

    updateEmployee(empId, { status: 'Active' });
  };

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <Card className="bg-white">
        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-slate-800 text-base leading-snug">Active Onboarding Funnel</h3>
            <p className="text-xs text-slate-400 font-semibold">Track documentation, contract signings, and operational setup for new hires.</p>
          </div>
          <div className="bg-brand-50 border border-brand-100 rounded-xl px-5 py-3 text-center flex-shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Currently Boarding</span>
            <span className="font-display font-extrabold text-2xl text-brand-700">{onboardingStaff.length} hires</span>
          </div>
        </div>
      </Card>

      {/* Main Grid List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {onboardingStaff.map((staff) => {
            const pendingDocs = staff.documents.filter(d => d.status === 'Pending');
            const totalDocs = staff.documents.length;
            const signedDocsCount = totalDocs - pendingDocs.length;
            const itDone = !!itSetupState[staff.id];
            const kitDone = !!welcomeKitState[staff.id];

            return (
              <motion.div
                key={staff.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <Card 
                  className="bg-white"
                  title={staff.name}
                  subtitle={staff.role}
                  headerAction={
                    <div className="flex items-center gap-3">
                      <Link to={`/employees/${staff.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs font-semibold">
                          View profile
                        </Button>
                      </Link>
                      <Button 
                        variant="primary" 
                        size="sm"
                        leftIcon={<UserCheck className="w-4 h-4" />}
                        onClick={() => handleCompleteOnboarding(staff.id, staff.name)}
                      >
                        Complete Onboarding
                      </Button>
                    </div>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                    
                    {/* Documentation column */}
                    <div className="border border-slate-100/80 p-4.5 rounded-xl bg-slate-50/20">
                      <div className="flex items-center justify-between mb-3.5">
                        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-slate-400" /> Documents Verification
                        </h4>
                        <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-100/50 px-2 py-0.5 rounded-full">
                          {signedDocsCount}/{totalDocs} Signed
                        </span>
                      </div>
                      
                      <div className="space-y-2.5">
                        {staff.documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-600 truncate max-w-[150px]">{doc.name}</span>
                            {doc.status === 'Signed' ? (
                              <span className="text-emerald-600 text-[10px] font-bold uppercase">Signed</span>
                            ) : (
                              <button 
                                onClick={() => signDocument(staff.id, doc.id)}
                                className="text-brand-600 hover:text-brand-700 text-[10px] font-bold uppercase hover:underline cursor-pointer"
                              >
                                Sign Doc
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* IT/System Provisioning column */}
                    <div className="border border-slate-100/80 p-4.5 rounded-xl bg-slate-50/20">
                      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-3.5">
                        <Laptop className="w-4 h-4 text-slate-400" /> IT Provisioning
                      </h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleItSetup(staff.id)}
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer w-full text-left"
                        >
                          {itDone ? (
                            <CheckSquare className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-300 shrink-0" />
                          )}
                          <span className={itDone ? 'line-through text-slate-400' : ''}>Configure AWS & Slack IAM</span>
                        </button>
                        
                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                          <CheckSquare className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                          <span className="line-through text-slate-400">Order Macbook Pro M3</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                          <CheckSquare className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                          <span className="line-through text-slate-400">Assign hardware tracking ID</span>
                        </div>
                      </div>
                    </div>

                    {/* Team Welcome / Ops column */}
                    <div className="border border-slate-100/80 p-4.5 rounded-xl bg-slate-50/20">
                      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-3.5">
                        <Users className="w-4 h-4 text-slate-400" /> Team Welcome
                      </h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleWelcomeKit(staff.id)}
                          className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer w-full text-left"
                        >
                          {kitDone ? (
                            <CheckSquare className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-300 shrink-0" />
                          )}
                          <span className={kitDone ? 'line-through text-slate-400' : ''}>Ship Welcome Merch Kit</span>
                        </button>

                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                          <CheckSquare className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                          <span className="line-through text-slate-400">Schedule team welcome standup</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                          <CheckSquare className="w-4.5 h-4.5 text-brand-600 shrink-0" />
                          <span className="line-through text-slate-400">Add to team sync calendar</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {onboardingStaff.length === 0 && (
          <Card padding="lg" className="text-center py-16 bg-white">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold mb-2">No active onboarding processes found.</p>
            <p className="text-xs text-slate-400">All hired employees have completed their document sign-off and equipment checks.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
