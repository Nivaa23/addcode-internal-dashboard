import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCheck, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  AlertCircle, 
  Search, 
  Lock, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Mail,
  Briefcase
} from 'lucide-react';
import { useEmployees } from '../context/EmployeeContext';
import { supabase } from '../lib/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const Onboarding = () => {
  const { currentUser } = useEmployees();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('unprovisioned'); // 'unprovisioned' | 'provisioned'

  // Provisioning Modal & Result State
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [provisioningLoading, setProvisioningLoading] = useState(false);
  const [provisionError, setProvisionError] = useState(null);
  const [provisionSuccess, setProvisionSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  // Check authorization
  const callerRole = (currentUser?.role || '').toLowerCase();
  const isAuthorized = callerRole === 'super_admin' || callerRole === 'hr';

  // Fetch real employee list from public.employees
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('employees')
        .select('id, employee_id, full_name, email, role, designation, department, employment_status, auth_user_id, must_change_password')
        .neq('employee_id', '169')
        .order('employee_id', { ascending: true });

      if (fetchErr) throw fetchErr;

      // Sort numeric employee_id ascending
      const sorted = (data || []).sort((a, b) => {
        const numA = parseInt(a.employee_id, 10) || 0;
        const numB = parseInt(b.employee_id, 10) || 0;
        return numA - numB;
      });

      setEmployees(sorted);
    } catch (err) {
      console.error('Error loading employees for onboarding:', err);
      setError(err.message || 'Failed to load employee records.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchEmployees();
    }
  }, [isAuthorized, fetchEmployees]);

  // Filter unprovisioned vs provisioned
  const unprovisionedEmployees = employees.filter(emp => {
    const isExcluded = String(emp.employee_id).trim() === '169';
    const isUnprovisioned = !emp.auth_user_id;
    const isEligibleStatus = (emp.employment_status || '').toLowerCase() === 'active';
    const hasValidEmail = emp.email && emp.email.includes('@');
    return !isExcluded && isUnprovisioned && isEligibleStatus && hasValidEmail;
  });

  const provisionedEmployees = employees.filter(emp => emp.auth_user_id !== null);

  // Search filtering
  const filterList = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(emp => 
      (emp.full_name || '').toLowerCase().includes(q) ||
      (emp.employee_id || '').toLowerCase().includes(q) ||
      (emp.email || '').toLowerCase().includes(q) ||
      (emp.designation || '').toLowerCase().includes(q) ||
      (emp.department || '').toLowerCase().includes(q)
    );
  };

  const filteredUnprovisioned = filterList(unprovisionedEmployees);
  const filteredProvisioned = filterList(provisionedEmployees);

  // Trigger Account Provisioning via Edge Function
  const handleProvisionAccount = async (targetEmp) => {
    setSelectedEmployee(targetEmp);
    setProvisionError(null);
    setProvisionSuccess(null);
    setProvisioningLoading(true);
    setCopied(false);

    try {
      // Call secure Supabase Edge Function
      const { data, error: invokeErr } = await supabase.functions.invoke('provision-employee-account', {
        body: { target_employee_id: targetEmp.id },
      });

      if (invokeErr) {
        throw new Error(invokeErr.message || 'Edge Function call failed.');
      }

      if (!data || data.error) {
        throw new Error(data?.error || 'Provisioning failed.');
      }

      // Success
      setProvisionSuccess({
        employee_id: data.employee_id,
        full_name: data.full_name,
        email: data.email,
        temporary_password: data.temporary_password,
      });

      // Refresh employee list so newly provisioned user moves to Provisioned tab
      await fetchEmployees();
    } catch (err) {
      console.error('Provisioning error:', err);
      setProvisionError(err.message || 'An error occurred during account provisioning.');
    } finally {
      setProvisioningLoading(false);
    }
  };

  const handleCopyPassword = () => {
    if (provisionSuccess?.temporary_password) {
      navigator.clipboard.writeText(provisionSuccess.temporary_password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCloseModal = () => {
    setSelectedEmployee(null);
    setProvisionError(null);
    setProvisionSuccess(null);
    setProvisioningLoading(false);
    setCopied(false);
  };

  // Human-readable role formatting helper for UI presentation ONLY
  const formatRole = (role) => {
    if (!role) return 'Employee';
    const norm = String(role).trim().toLowerCase();
    switch (norm) {
      case 'super_admin':
        return 'Super Admin';
      case 'managing_director':
        return 'Managing Director';
      case 'hr':
        return 'HR';
      case 'employee':
        return 'Employee';
      default:
        return role;
    }
  };

  // If user is not authorized (not super_admin or hr)
  if (!isAuthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 mb-4 shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-slate-800 text-xl mb-2">Access Restricted</h2>
        <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
          Employee account provisioning is restricted to authorized <span className="font-bold text-slate-700">Super Admin</span> and <span className="font-bold text-slate-700">HR</span> personnel only.
        </p>
        <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md">
          Current Role: {formatRole(currentUser?.role)}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics Card */}
      <Card className="bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <h2 className="font-display font-bold text-slate-900 text-lg leading-snug">
                Employee Account Provisioning
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Securely provision Supabase Auth dashboard access for active Addcode employees.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Pending Auth</span>
              <span className="font-display font-extrabold text-xl text-amber-900">{unprovisionedEmployees.length}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Provisioned</span>
              <span className="font-display font-extrabold text-xl text-emerald-900">{provisionedEmployees.length}</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchEmployees}
              disabled={loading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 w-fit">
          <button
            onClick={() => setActiveTab('unprovisioned')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'unprovisioned'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Eligible Unprovisioned</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-100 text-amber-800 font-bold">
              {unprovisionedEmployees.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('provisioned')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'provisioned'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Provisioned Accounts</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold">
              {provisionedEmployees.length}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search name, ID, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Card className="text-center py-16 bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading employee records from Supabase...</p>
        </Card>
      ) : error ? (
        <Card className="bg-red-50/50 border border-red-200 text-center py-12">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <h3 className="font-bold text-red-800 text-sm mb-1">Failed to Load Employees</h3>
          <p className="text-xs text-red-600 mb-4">{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchEmployees}>Try Again</Button>
        </Card>
      ) : (
        <div>
          {/* TAB 1: Eligible Unprovisioned Employees */}
          {activeTab === 'unprovisioned' && (
            <div className="space-y-4">
              {filteredUnprovisioned.length === 0 ? (
                <Card className="text-center py-16 bg-white border border-slate-200/80">
                  <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-slate-800 text-base mb-1">
                    No Eligible Employees Pending Provisioning
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {searchQuery.trim()
                      ? 'No unprovisioned employees matched your search query.'
                      : 'All active employees in public.employees have already been provisioned with dashboard accounts.'}
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filteredUnprovisioned.map((emp) => (
                      <motion.div
                        layout
                        key={emp.id}
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-2xs h-full flex flex-col justify-between">
                          <div>
                            {/* Employee ID & Status Badge */}
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
                                ID: {emp.employee_id}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                Auth Pending
                              </span>
                            </div>

                            {/* Full Name & Designation */}
                            <h3 className="font-display font-bold text-slate-900 text-base tracking-tight mb-0.5">
                              {emp.full_name}
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{emp.designation || formatRole(emp.role)}</span>
                            </p>

                            {/* Info Rows */}
                            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600 font-medium">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate text-slate-700 font-mono text-[11px]">{emp.email}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-400">Department:</span>
                                <span className="font-semibold text-slate-700">{emp.department || 'Engineering'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-5 border-t border-slate-100 pt-3">
                            <Button
                              variant="primary"
                              size="sm"
                              className="w-full font-bold"
                              leftIcon={<Key className="w-3.5 h-3.5" />}
                              onClick={() => handleProvisionAccount(emp)}
                            >
                              Provision Auth Account
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Provisioned Dashboard Accounts */}
          {activeTab === 'provisioned' && (
            <div className="space-y-4">
              {filteredProvisioned.length === 0 ? (
                <Card className="text-center py-16 bg-white border border-slate-200/80">
                  <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="font-display font-semibold text-slate-800 text-base mb-1">
                    No Provisioned Accounts Found
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {searchQuery.trim()
                      ? 'No provisioned accounts matched your search query.'
                      : 'No employee accounts have been provisioned yet.'}
                  </p>
                </Card>
              ) : (
                <Card padding="none" className="bg-white border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Employee</th>
                          <th className="py-3 px-4">Employee ID</th>
                          <th className="py-3 px-4">Corporate Email</th>
                          <th className="py-3 px-4">Role / Designation</th>
                          <th className="py-3 px-4">Auth Account Status</th>
                          <th className="py-3 px-4 text-right">Password Policy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredProvisioned.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900 block">{emp.full_name}</span>
                              <span className="text-[10px] text-slate-400">{emp.department || 'Engineering'}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                              {emp.employee_id}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                              {emp.email}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">{formatRole(emp.role)}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{emp.designation}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600" />
                                Linked to Auth
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {emp.must_change_password ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                  <Lock className="w-3 h-3" />
                                  Must Change Password
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                  Password Verified
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      )}

      {/* PROVISIONING RESULT MODAL */}
      <Modal
        isOpen={!!selectedEmployee}
        onClose={handleCloseModal}
        title={provisionSuccess ? "Account Provisioned Successfully" : "Provisioning Account"}
        size="md"
        footerActions={
          provisionSuccess ? (
            <Button variant="primary" size="sm" onClick={handleCloseModal}>
              Done
            </Button>
          ) : provisionError ? (
            <Button variant="secondary" size="sm" onClick={handleCloseModal}>
              Close
            </Button>
          ) : null
        }
      >
        {provisioningLoading ? (
          <div className="py-10 text-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-sky-600 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">Communicating with Secure Server...</h3>
            <p className="text-xs text-slate-500">
              Creating Supabase Auth user and linking record for <span className="font-bold text-slate-700">{selectedEmployee?.full_name}</span>.
            </p>
          </div>
        ) : provisionError ? (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-red-800 text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>Account Provisioning Failed</span>
              </div>
              <p className="text-red-600">{provisionError}</p>
            </div>
            <p className="text-xs text-slate-500">
              Please check server logs or verify that the target employee possesses a valid email address.
            </p>
          </div>
        ) : provisionSuccess ? (
          <div className="py-2 space-y-5">
            {/* Success Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-900 text-sm">Auth User Account Created</h4>
                <p className="text-xs text-emerald-700">
                  Supabase Auth account has been successfully linked to <span className="font-bold">{provisionSuccess.full_name}</span> (ID: {provisionSuccess.employee_id}).
                </p>
              </div>
            </div>

            {/* Generated Credential Details */}
            <div className="space-y-3 bg-slate-50 border border-slate-200/80 p-4 rounded-xl">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Target Employee:</span>
                <span className="font-bold text-slate-900">{provisionSuccess.full_name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Work Email:</span>
                <span className="font-mono font-bold text-slate-800">{provisionSuccess.email}</span>
              </div>

              {/* Temporary Password Box */}
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Generated Temporary Password
                </span>
                <div className="flex items-center gap-2">
                  <div className="grow bg-white border border-slate-300 rounded-lg px-3 py-2 font-mono font-bold text-base text-slate-900 tracking-wider shadow-2xs select-all">
                    {provisionSuccess.temporary_password}
                  </div>
                  <Button
                    variant={copied ? "primary" : "secondary"}
                    size="md"
                    onClick={handleCopyPassword}
                    leftIcon={copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Security Warning Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Mandatory Security Instructions</span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Securely convey this temporary password to <span className="font-bold">{provisionSuccess.full_name}</span>. Upon their initial login, they will be forced to change this password before accessing the dashboard.
              </p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default Onboarding;
