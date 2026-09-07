import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockEmployees as initialEmployees, mockActivities as initialActivities, mockStats as initialStats } from '../data/mockEmployees';

const EmployeeContext = createContext();

export const accentPalettes = {
  blue: {
    name: 'Addcode Blue',
    hex: '#0284c7',
    600: '#0284c7',
    700: '#0369a1',
    500: '#0ea5e9',
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd'
  },
  green: {
    name: 'Emerald Green',
    hex: '#16a34a',
    600: '#16a34a',
    700: '#15803d',
    500: '#22c55e',
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0'
  },
  neutral: {
    name: 'Neutral Dark',
    hex: '#18181b',
    600: '#18181b',
    700: '#09090b',
    500: '#27272a',
    50: '#f4f4f5',
    100: '#e4e4e7',
    200: '#d4d4d8'
  },
  orange: {
    name: 'Solar Orange',
    hex: '#ea580c',
    600: '#ea580c',
    700: '#c2410c',
    500: '#f97316',
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa'
  },
  red: {
    name: 'Addcode Red',
    hex: '#dc2626',
    600: '#dc2626',
    700: '#b91c1c',
    500: '#ef4444',
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca'
  },
  rose: {
    name: 'Rose Crimson',
    hex: '#e11d48',
    600: '#e11d48',
    700: '#be123c',
    500: '#f43f5e',
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3'
  },
  violet: {
    name: 'Royal Violet',
    hex: '#7c3aed',
    600: '#7c3aed',
    700: '#6d28d9',
    500: '#8b5cf6',
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe'
  },
  yellow: {
    name: 'Amber Gold',
    hex: '#d97706',
    600: '#d97706',
    700: '#b45309',
    500: '#f59e0b',
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a'
  }
};

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

  // Mock Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('addcode_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('addcode_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_e) {
        // fallback
      }
    }
    return {
      id: "EMP-2026-001",
      name: "Marcus Vance",
      role: "Lead Systems Architect",
      email: "marcus.vance@addcode.engineering",
      avatar: "M",
      location: "San Francisco"
    };
  });

  const login = (email, _password) => {
    const userToSet = {
      ...currentUser,
      email: email || currentUser.email,
      name: email && email.includes('@') ? email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ') : currentUser.name
    };
    setCurrentUser(userToSet);
    setIsAuthenticated(true);
    localStorage.setItem('addcode_auth', 'true');
    localStorage.setItem('addcode_user', JSON.stringify(userToSet));
  };

  const signup = ({ name, email }) => {
    const newUser = {
      id: `EMP-2026-${Math.floor(100 + Math.random() * 900)}`,
      name: name || "New Engineer",
      role: "Software Engineer",
      email: email || "engineer@addcode.engineering",
      avatar: (name || "N").charAt(0).toUpperCase(),
      location: "Remote / HQ"
    };
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('addcode_auth', 'true');
    localStorage.setItem('addcode_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('addcode_auth');
  };

  const addEmployee = (employeeData) => {
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
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        return { ...emp, ...updatedFields };
      }
      return emp;
    }));
  };

  const terminateEmployee = (id) => {
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
  };

  const updateTimeOffRequestStatus = (employeeId, requestId, status) => {
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
  };

  const requestTimeOff = (employeeId, type, startDate, endDate, notes) => {
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
  };

  const signDocument = (employeeId, documentId) => {
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
  };

  const updateStats = (updatedEmployees) => {
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
  };

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
      currentUser,
      login,
      signup,
      logout
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error("useEmployees must be used within an EmployeeProvider");
  }
  return context;
};
