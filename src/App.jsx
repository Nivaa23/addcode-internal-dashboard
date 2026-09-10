import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider, useEmployees } from './context/EmployeeContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import EmployeeProfile from './pages/EmployeeProfile';
import TimeOff from './pages/TimeOff';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import CalendarPage from './pages/CalendarPage';
import PlaceholderPage from './pages/PlaceholderPage';
import ChangePassword from './pages/ChangePassword';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, mustChangePassword } = useEmployees();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (mustChangePassword) return <Navigate to="/change-password" replace />;
  return children;
};

const AnonymousRoute = ({ children }) => {
  const { isAuthenticated, mustChangePassword } = useEmployees();
  if (!isAuthenticated) return children;
  if (mustChangePassword) return <Navigate to="/change-password" replace />;
  return <Navigate to="/dashboard" replace />;
};

const ChangePasswordRoute = ({ children }) => {
  const { isAuthenticated, mustChangePassword } = useEmployees();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!mustChangePassword) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Root route requirement */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Anonymous authentication routes */}
      <Route path="/login" element={<AnonymousRoute><Login /></AnonymousRoute>} />
      <Route path="/signup" element={<AnonymousRoute><SignUp /></AnonymousRoute>} />

      {/* Forced Password Change */}
      <Route path="/change-password" element={<ChangePasswordRoute><ChangePassword /></ChangePasswordRoute>} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/calendar" element={<CalendarPage />} />

        {/* Profile page defaults to loading the currentUser profile */}
        <Route path="/profile" element={<EmployeeProfile />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <EmployeeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
