import React, { useState } from 'react';
import Header from '../organisms/Header';
import Sidebar from '../organisms/Sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  className = ''
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header 
          onMenuToggle={toggleSidebar}
          showMenuButton={true}
        />
        
        {/* Page content */}
        <main className={`p-6 ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
export default DashboardLayout;
