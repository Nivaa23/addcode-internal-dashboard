import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useEmployees();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AnonymousRoute = ({ children }) => {
  const { isAuthenticated } = useEmployees();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Anonymous authentication routes */}
      <Route path="/login" element={<AnonymousRoute><Login /></AnonymousRoute>} />
      <Route path="/signup" element={<AnonymousRoute><SignUp /></AnonymousRoute>} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="tasks" element={<Tasks />} />
        <Route path="projects" element={<Projects />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leaves" element={<Leaves />} />
        <Route path="calendar" element={<CalendarPage />} />

        {/* Profile page defaults to loading the currentUser profile */}
        <Route path="profile" element={<EmployeeProfile />} />

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
        <Analytics />
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
