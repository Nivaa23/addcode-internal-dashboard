import React, { createContext, useContext, useState } from 'react';
import { mockEmployees as initialEmployees, mockActivities as initialActivities, mockStats as initialStats } from '../data/mockEmployees';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [activities, setActivities] = useState(initialActivities);
  const [stats, setStats] = useState(initialStats);
  
  // Mock Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('addcode_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState({
    id: "EMP-2026-001",
    name: "Nivrutti",
    role: "Lead Systems Architect",
    email: "nivrutti@addcode.engineering",
    avatar: "N",
    location: "San Francisco"
  });

  const login = (email, password) => {
    setIsAuthenticated(true);
    localStorage.setItem('addcode_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('addcode_auth');
  };

  // Add new employee
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

    // Add activity
    const newActivity = {
      id: `act-${Date.now()}`,
      type: "onboarding",
      message: `${newEmp.name} joined the ${newEmp.department} team as ${newEmp.role}`,
      timestamp: "Just now",
      user: newEmp.name
    };
    setActivities(prev => [newActivity, ...prev]);

    // Recalculate stats
    updateStats([newEmp, ...employees]);
  };

  // Update employee
  const updateEmployee = (id, updatedFields) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const updated = { ...emp, ...updatedFields };
        return updated;
      }
      return emp;
    }));
  };

  // Delete/Terminate employee
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

  // Approve or reject time off request
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

    // Add activity
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

  // Request new time off
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

  // Sign document for onboarding
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

  // Helper to sync stats when employees change
  const updateStats = (updatedEmployees) => {
    const total = updatedEmployees.length + 39; // offset to match high-fidelity total stats (e.g. 48)
    const active = updatedEmployees.filter(e => e.status === "Active").length;
    const onboarding = updatedEmployees.filter(e => e.status === "Onboarding").length;
    
    // Average performance
    const withPerformance = updatedEmployees.filter(e => e.performance > 0);
    const avgPerf = withPerformance.length > 0
      ? (withPerformance.reduce((acc, curr) => acc + curr.performance, 0) / withPerformance.length).toFixed(1)
      : 4.5;

    // Department breakdown
    const depts = ["Engineering", "Design", "Product", "HR", "Marketing"];
    const breakdown = depts.map(deptName => {
      const count = updatedEmployees.filter(e => e.department === deptName || (deptName === "HR" && e.department === "HR")).length;
      // add standard padding so dashboard looks realistic and populated
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
      addEmployee,
      updateEmployee,
      terminateEmployee,
      updateTimeOffRequestStatus,
      requestTimeOff,
      signDocument,
      isAuthenticated,
      currentUser,
      login,
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
