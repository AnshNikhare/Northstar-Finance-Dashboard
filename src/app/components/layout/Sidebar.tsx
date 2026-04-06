import React from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, Receipt, LineChart, Settings, LogOut, Briefcase } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useFinance } from '../../../context/FinanceContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Insights', path: '/insights', icon: LineChart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: (val: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const { role, setRole } = useFinance();

  return (
    <aside className={cn(
      "w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-screen fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-8 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
            <Briefcase size={22} className="stroke-2" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
            Northstar<br/>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1 block">Finance</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium transition-all duration-200",
                isActive
                  ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/50 relative overflow-hidden group"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={cn("stroke-2", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                {item.name}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-r-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        {/* Mobile Role Switcher (Visible only on small screens) */}
        <div className="sm:hidden flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/50 shadow-inner mb-4">
          <button
            onClick={() => setRole('viewer')}
            className={cn(
              "flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 ease-out",
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
              "flex-1 py-2 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-300 ease-out",
              role === 'admin' 
                ? "bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5" 
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Admin
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 opacity-60 pointer-events-none"></div>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-slate-700 font-bold shrink-0">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" alt="User" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 truncate">Alex Rivera</p>
              <p className="text-xs text-slate-500 capitalize font-medium">{role}</p>
            </div>
          </div>
          
          <button className="w-full py-2.5 px-3 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors mt-2">
            <LogOut size={16} className="text-slate-400" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};
