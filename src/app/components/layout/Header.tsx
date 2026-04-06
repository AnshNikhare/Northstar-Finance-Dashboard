import React from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { Bell, Search, Menu } from 'lucide-react';
import { cn } from '../../../lib/utils';

export const Header: React.FC<{ title: string; onMenuClick: () => void }> = ({ title, onMenuClick }) => {
  const { role, setRole, searchQuery, setSearchQuery } = useFinance();

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-8 py-4 sm:py-5 bg-white/70 backdrop-blur-xl sticky top-0 z-10 border-b border-slate-200 shadow-sm/50">
      <div className="flex items-center justify-between w-full sm:w-auto">
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none truncate">{title}</h1>
        </div>
        
        {/* Mobile Profile Icon (Visible only when Search pushes it out or space is tight) */}
        <button className="sm:hidden flex items-center gap-3 hover:bg-slate-50 p-1 rounded-full transition-colors border border-transparent hover:border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white overflow-hidden shrink-0">
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
          </div>
        </button>
      </div>

      <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/50 shadow-inner">
          <button
            onClick={() => setRole('viewer')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 ease-out",
              role === 'viewer' 
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Viewer
          </button>
          <button
            onClick={() => setRole('admin')}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-300 ease-out",
              role === 'admin' 
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Admin
          </button>
        </div>

      <div className="flex items-center gap-3 sm:gap-5 text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
        <div className="relative flex-1 sm:flex-initial">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 w-full sm:w-48 xl:w-64 rounded-full bg-slate-100 border-none text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-5">
          <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors group">
            <Bell size={20} className="text-slate-500 group-hover:text-slate-700 transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
          
          <button className="hidden sm:flex items-center gap-3 hover:bg-slate-50 p-1 sm:pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm ring-2 ring-white overflow-hidden shrink-0">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col items-start hidden lg:flex">
              <span className="text-sm font-bold text-slate-800 leading-tight">Alex R.</span>
              <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">{role}</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
