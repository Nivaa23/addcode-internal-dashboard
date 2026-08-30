import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className="flex bg-slate-50/50 min-h-screen text-slate-800 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <Header />

        {/* Scrollable Page Outlet */}
        <main className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {/* Outlet for children routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
