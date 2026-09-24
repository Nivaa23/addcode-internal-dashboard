import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { mockEmployees as initialEmployees, mockActivities as initialActivities, mockStats as initialStats } from '../data/mockEmployees';
import { supabase } from '../lib/supabase';

import { accentPalettes } from '../constants/theme';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [activities, setActivities] = useState(initialActivities);
  const [stats, setStats] = useState(initialStats);

  // Accent Theme State (Default: Addcode Blue)
  const [accentTheme, setAccentThemeState] = useState(() => {
    return localStorage.getItem('addcode_accent') || 'blue';
  });

  const applyAccentTheme = (themeKey) => {
    const palette = accentPalettes[themeKey] || accentPalettes.blue;
    const root = document.documentElement;
    root.style.setProperty('--color-brand-600', palette[600]);
    root.style.setProperty('--color-brand-700', palette[700]);
    root.style.setProperty('--color-brand-500', palette[500] || palette[600]);
    root.style.setProperty('--color-brand-50', palette[50]);
    root.style.setProperty('--color-brand-100', palette[100]);
    root.style.setProperty('--color-brand-200', palette[200]);
    root.style.setProperty('--color-brand-hex', palette.hex);
  };

  useEffect(() => {
    applyAccentTheme(accentTheme);
  }, [accentTheme]);

  const setAccentTheme = (themeKey) => {
    if (accentPalettes[themeKey]) {
      setAccentThemeState(themeKey);
      localStorage.setItem('addcode_accent', themeKey);
      applyAccentTheme(themeKey);
    }
  };

  // Mock Auth State to be replaced completely but retaining some shapes for UI
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [supabaseUser, setSupabaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [currentUser, setCurrentUser] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [workSession, setWorkSession] = useState(null);

  const handleSession = async (session) => {
    if (session?.user) {
      setSupabaseUser(session.user);
      setIsAuthenticated(true);
      
      try {
        const { data: employeeData, error } = await supabase
          .from('employees')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();

        if (!error && employeeData) {
          setCurrentUser({
            ...employeeData,
            name: employeeData.full_name || employeeData.name || session.user.email?.split('@')[0],
            role: employeeData.designation || employeeData.role || 'Employee'
          });
          setMustChangePassword(employeeData.must_change_password);

          // Fetch active work session first (where check_out_time IS NULL)
          const { data: activeSession } = await supabase
            .from('work_sessions')
            .select('*')
            .eq('employee_id', employeeData.id)
            .is('check_out_time', null)
            .maybeSingle();

          if (activeSession) {
            setWorkSession(activeSession);
          } else {
            // Otherwise fetch today's latest session (completed)
            const today = new Date().toISOString().split('T')[0];
            const { data: sessionData } = await supabase
              .from('work_sessions')
              .select('*')
              .eq('employee_id', employeeData.id)
              .eq('session_date', today)
              .order('check_in_time', { ascending: false })
              .limit(1)
              .maybeSingle();
              
            setWorkSession(sessionData || null);
          }
        } else {
          setCurrentUser({
            id: null,
            unlinked: true,
            name: "Account Not Linked",
            role: "Pending Setup",
            email: session.user.email
          });
          setMustChangePassword(false);
        }
      } catch {
        setCurrentUser({
          id: null,
          unlinked: true,
          name: "Account Not Linked",
          role: "Pending Setup",
          email: session.user.email
        });
        setMustChangePassword(false);
      }
    } else {
      setSupabaseUser(null);
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (mounted) {
        await handleSession(session);
        setAuthLoading(false);
      }
    };

    initializeSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setAuthLoading(true);
        await handleSession(session);
        setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);



  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    sessionStorage.setItem('addcode_initial_password', password);
  };

  const signup = async ({ name, email, password }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const changePassword = async (newPassword) => {
    const currentPassword = sessionStorage.getItem('addcode_initial_password');
    const updatePayload = { password: newPassword };
    
    if (currentPassword) {
      updatePayload.current_password = currentPassword;
    }

    const { error } = await supabase.auth.updateUser(updatePayload);
    
    if (error) {
      if (error.message.includes('Current password required') && !currentPassword) {
        throw new Error('Session expired. Please log out and log back in to change your password.');
      }
      throw error;
    }
    
    // Update public.employees table in Supabase so must_change_password becomes false in DB
    const userId = supabaseUser?.id || currentUser?.auth_user_id;
    if (userId) {
      const { error: dbError } = await supabase
        .from('employees')
        .update({ must_change_password: false })
        .eq('auth_user_id', userId);
        
      if (dbError) {
        console.error('Failed to update must_change_password in database:', dbError);
        throw new Error(`Failed to persist password change to database: ${dbError.message}`);
      }
    } else {
      throw new Error('User session ID not found. Unable to update employee record.');
    }
    
    setMustChangePassword(false);
    setCurrentUser(prev => prev ? { ...prev, must_change_password: false } : prev);
    sessionStorage.removeItem('addcode_initial_password');
  };

  const checkIn = async () => {
    if (!currentUser || !currentUser.id) {
      console.warn('Cannot check in: currentUser or currentUser.id is not available', currentUser);
      throw new Error('Employee identity not resolved. Cannot check in.');
    }

    // Check for existing active session (prevent duplicate active sessions)
    const { data: existingActive } = await supabase
      .from('work_sessions')
      .select('*')
      .eq('employee_id', currentUser.id)
      .is('check_out_time', null)
      .maybeSingle();

    if (existingActive) {
      console.log('Active work session already exists:', existingActive);
      setWorkSession(existingActive);
      return;
    }

    const { data, error } = await supabase
      .from('work_sessions')
      .insert([{
        employee_id: currentUser.id,
        check_in_time: new Date().toISOString(),
        session_date: new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();
      
    if (!error && data) {
      setWorkSession(data);
    } else if (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  };

  const checkOut = async () => {
    if (!workSession) return;
    const { data, error } = await supabase
      .from('work_sessions')
      .update({ check_out_time: new Date().toISOString() })
      .eq('id', workSession.id)
      .select()
      .single();
      
    if (!error && data) {
      setWorkSession(data);
    } else if (error) {
      console.error('Error checking out:', error);
    }
  };

  const updateStats = useCallback((updatedEmployees) => {
    const total = updatedEmployees.length + 39;
    const onboarding = updatedEmployees.filter(e => e.status === "Onboarding").length;

    const withPerformance = updatedEmployees.filter(e => e.performance > 0);
    const avgPerf = withPerformance.length > 0
      ? (withPerformance.reduce((acc, curr) => acc + curr.performance, 0) / withPerformance.length).toFixed(1)
      : 4.5;

    const depts = ["Engineering", "Design", "Product", "HR", "Marketing"];
    const breakdown = depts.map(deptName => {
      const count = updatedEmployees.filter(e => e.department === deptName || (deptName === "HR" && e.department === "HR")).length;
      const pad = deptName === "Engineering" ? 18 : deptName === "Design" ? 7 : deptName === "Product" ? 4 : deptName === "HR" ? 3 : 2;
      const actualCount = count + pad;
      return {
        name: deptName === "HR" ? "HR & Ops" : deptName,
        count: actualCount,
        percentage: Math.round((actualCount / total) * 100),
        color: deptName === "Engineering" ? "bg-indigo-500 text-indigo-500" :
          deptName === "Design" ? "bg-purple-500 text-purple-500" :
            deptName === "Product" ? "bg-pink-500 text-pink-500" :
              deptName === "HR" ? "bg-emerald-500 text-emerald-500" : "bg-amber-500 text-amber-500"
      };
    });

    setStats({
      totalEmployees: total,
      activeProjects: 12,
      averagePerformance: parseFloat(avgPerf),
      onboardingActive: onboarding,
      departmentBreakdown: breakdown
    });
  }, []);

  const addEmployee = useCallback((employeeData) => {
    const newEmp = {
      id: `EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: "Onboarding",
      attendance: 100.0,
      performance: 5.0,
      timeOffRequests: [],
      documents: [
        { id: "doc-1", name: "Employment Agreement", status: "Pending", signedDate: "" },
        { id: "doc-2", name: "NDA", status: "Pending", signedDate: "" },
        { id: "doc-3", name: "IP Agreement", status: "Pending", signedDate: "" }
      ],
      ...employeeData
    };

    setEmployees(prev => [newEmp, ...prev]);

    const newActivity = {
      id: `act-${Date.now()}`,
      type: "onboarding",
      message: `${newEmp.name} joined the ${newEmp.department} team as ${newEmp.role}`,
      timestamp: "Just now",
      user: newEmp.name
    };
    setActivities(prev => [newActivity, ...prev]);
    updateStats([newEmp, ...employees]);
  }, [employees, updateStats]);

  const updateEmployee = useCallback((id, updatedFields) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, ...updatedFields };
      }
      return emp;
    }));
  }, []);

  const terminateEmployee = useCallback((id) => {
    const employeeToDelete = employees.find(emp => emp.id === id);
    if (!employeeToDelete) return;

    setEmployees(prev => prev.filter(emp => emp.id !== id));

    const newActivity = {
      id: `act-${Date.now()}`,
      type: "termination",
      message: `${employeeToDelete.name} was offboarded from the company`,
      timestamp: "Just now",
      user: employeeToDelete.name
    };
    setActivities(prev => [newActivity, ...prev]);
    updateStats(employees.filter(emp => emp.id !== id));
  }, [employees, updateStats]);

  const updateTimeOffRequestStatus = useCallback((employeeId, requestId, status) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          timeOffRequests: emp.timeOffRequests.map(req => {
            if (req.id === requestId) {
              return { ...req, status };
            }
            return req;
          })
        };
      }
      return emp;
    }));

    const emp = employees.find(e => e.id === employeeId);
    const req = emp?.timeOffRequests.find(r => r.id === requestId);
    if (emp && req) {
      const newActivity = {
        id: `act-${Date.now()}`,
        type: "leave",
        message: `${emp.name}'s ${req.type} request was ${status.toLowerCase()}`,
        timestamp: "Just now",
        user: emp.name
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  }, [employees]);

  const requestTimeOff = useCallback((employeeId, type, startDate, endDate, notes) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      type,
      startDate,
      endDate,
      status: "Pending",
      notes
    };

    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          timeOffRequests: [newRequest, ...emp.timeOffRequests]
        };
      }
      return emp;
    }));

    const emp = employees.find(e => e.id === employeeId);
    if (emp) {
      const newActivity = {
        id: `act-${Date.now()}`,
        type: "leave",
        message: `${emp.name} submitted a request for ${type}`,
        timestamp: "Just now",
        user: emp.name
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  }, [employees]);

  const signDocument = useCallback((employeeId, documentId) => {
    const today = new Date().toISOString().split('T')[0];
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          documents: emp.documents.map(doc => {
            if (doc.id === documentId) {
              return { ...doc, status: "Signed", signedDate: today };
            }
            return doc;
          })
        };
      }
      return emp;
    }));

    const emp = employees.find(e => e.id === employeeId);
    const doc = emp?.documents.find(d => d.id === documentId);
    if (emp && doc) {
      const newActivity = {
        id: `act-${Date.now()}`,
        type: "document",
        message: `${emp.name} signed the document: ${doc.name}`,
        timestamp: "Just now",
        user: emp.name
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  }, [employees]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <EmployeeContext.Provider value={{
      employees,
      activities,
      stats,
      accentTheme,
      setAccentTheme,
      addEmployee,
      updateEmployee,
      terminateEmployee,
      updateTimeOffRequestStatus,
      requestTimeOff,
      signDocument,
      isAuthenticated,
      mustChangePassword,
      currentUser,
      supabaseUser,
      workSession,
      checkIn,
      checkOut,
      login,
      signup,
      logout,
      changePassword
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
