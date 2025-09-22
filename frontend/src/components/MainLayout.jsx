import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="h-screen bg-gray-50">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-64">
          <div className="w-64 h-full">
            <Sidebar />
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center space-x-3">
                {/* Header content can be added here later */}
              </div>
              
              {/* Right side content can be added here later */}
              <div className="flex items-center space-x-3">
                {/* Placeholder for future features like search, notifications, user menu */}
              </div>
          </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
