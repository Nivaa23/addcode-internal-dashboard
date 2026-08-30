import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EmployeeProvider, useEmployees } from './context/EmployeeContext';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import EmployeeProfile from './pages/EmployeeProfile';
import TimeOff from './pages/TimeOff';
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
      {/* Anonymous route */}
      <Route path="/login" element={<AnonymousRoute><Login /></AnonymousRoute>} />
      
      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route 
          path="tasks" 
          element={
            <PlaceholderPage 
              title="My Tasks" 
              description="Monitor your daily scrum tickets, engineering pull request reviews, and administrative action items." 
            />
          } 
        />
        <Route 
          path="projects" 
          element={
            <PlaceholderPage 
              title="Projects" 
              description="Explore client deliveries, active codebases, and engineering team resource allocations." 
            />
          } 
        />
        <Route 
          path="attendance" 
          element={
            <PlaceholderPage 
              title="Attendance" 
              description="Inspect corporate login history, billing allocations, and operational remote metrics." 
            />
          } 
        />
        
        {/* Leaves redirects to the interactive leave scheduling/request logs */}
        <Route path="leaves" element={<TimeOff />} />
        
        <Route 
          path="calendar" 
          element={
            <PlaceholderPage 
              title="Calendar" 
              description="Track sprint meetings, client demos, team availability, and company holidays." 
            />
          } 
        />
        
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
      </BrowserRouter>
    </EmployeeProvider>
  );
}

export default App;
