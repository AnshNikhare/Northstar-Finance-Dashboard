import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const Layout: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const title = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/transactions': return 'Transactions Management';
      case '/insights': return 'Insights & Analytics';
      case '/settings': return 'Role & Settings';
      default: return 'Northstar Finance';
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen text-slate-800 font-sans antialiased overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-y-auto overflow-x-hidden w-full">
        <Header title={title()} onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex-1 p-4 sm:p-8 lg:px-12 xl:px-16 pb-16 w-full max-w-[1920px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
