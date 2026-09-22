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

  const [mustChangePassword, setMustChangePassword] = useState(() => {
    return localStorage.getItem('addcode_must_change_password') === 'true';
  });

  const handleSession = async (session) => {
    if (session?.user) {
      setSupabaseUser(session.user);
      setIsAuthenticated(true);
      
      try {
        const { data: employeeData, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && employeeData) {
          setCurrentUser({
            ...employeeData,
            name: employeeData.name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            email: session.user.email,
          });
        } else {
          // Graceful fallback if no employee record exists yet
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            role: "Employee", // Generic fallback role
            email: session.user.email,
          });
        }
      } catch {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
          role: "Employee",
          email: session.user.email,
        });
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
    
    // Simulate first-time login logic
    const hasCompletedChange = localStorage.getItem('addcode_password_changed') === 'true';
    if (!hasCompletedChange) {
      setMustChangePassword(true);
      localStorage.setItem('addcode_must_change_password', 'true');
      sessionStorage.setItem('addcode_initial_password', password);
    }
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
      // If the API still demands a current password and we lost it (e.g., cross-tab),
      // we throw the error so the UI handles it, but typically the user should re-login.
      if (error.message.includes('Current password required') && !currentPassword) {
        throw new Error('Session expired. Please log out and log back in to change your password.');
      }
      throw error;
    }
    
    setMustChangePassword(false);
    localStorage.setItem('addcode_must_change_password', 'false');
    localStorage.setItem('addcode_password_changed', 'true');
    sessionStorage.removeItem('addcode_initial_password');
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
