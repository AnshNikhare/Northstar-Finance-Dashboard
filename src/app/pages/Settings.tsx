import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../lib/utils';
import { Shield, Eye, Settings as SettingsIcon, LogOut, Smartphone, Laptop } from 'lucide-react';

export const Settings: React.FC = () => {
  const { role, setRole } = useFinance();

  return (
    <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Role & Settings</h2>
        <p className="text-slate-500 font-medium mt-1">Manage your architectural workspace preferences and access levels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role Management */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm shadow-slate-200/50 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-slate-900">Role Management</h3>
            <div className="flex items-center bg-slate-100 p-1.5 rounded-full border border-slate-200/50 shadow-inner">
              <button
                onClick={() => setRole('viewer')}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                  role === 'viewer' 
                    ? "bg-white text-indigo-700 shadow-md shadow-indigo-100/50" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Viewer
              </button>
              <button
                onClick={() => setRole('admin')}
                className={cn(
                  "px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300",
                  role === 'admin' 
                    ? "bg-white text-indigo-700 shadow-md shadow-indigo-100/50" 
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Admin
              </button>
            </div>
          </div>

          <div className={cn(
            "rounded-2xl p-6 border-2 transition-all duration-500 relative overflow-hidden group",
            role === 'viewer' ? "border-indigo-600 bg-indigo-50/30" : "border-slate-100 hover:border-slate-200 cursor-pointer hover:bg-slate-50"
          )} onClick={() => setRole('viewer')}>
            <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6 shadow-md text-white">
              <Eye size={24} />
            </div>
            <h4 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Viewer</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
              Read-only access. You can view all ledger entries, reports, and insights, but cannot edit or delete any transactional data.
            </p>
            {role === 'viewer' && <span className="inline-flex px-3 py-1 rounded-full bg-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700">Active Role</span>}
          </div>

          <div className={cn(
            "rounded-2xl p-6 border-2 transition-all duration-500 relative overflow-hidden group",
            role === 'admin' ? "border-indigo-600 bg-indigo-50/30" : "border-slate-100 hover:border-slate-200 cursor-pointer hover:bg-slate-50"
          )} onClick={() => setRole('admin')}>
            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center mb-6 shadow-sm text-slate-700">
              <Shield size={24} />
            </div>
            <h4 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Admin</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
              Full administrative access. Permission to add, edit, and delete transactions. Access to user management and global settings.
            </p>
            {role === 'admin' && <span className="inline-flex px-3 py-1 rounded-full bg-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-700">Active Role</span>}
          </div>
        </div>

        {/* Security & Preferences */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl shadow-slate-900/20 text-white relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 w-48 h-48 bg-indigo-600 rounded-full blur-[80px] opacity-40 translate-x-1/2 translate-y-1/2"></div>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 text-indigo-300">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Security</h3>
            </div>
            
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Enhanced Protection</p>
              <p className="text-sm font-medium text-slate-300 leading-relaxed mb-8">
                Your account is protected by enterprise-grade encryption. Last password change was 42 days ago.
              </p>
              <button className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg">
                Change Password
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm shadow-slate-200/50">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 mb-6">Active Sessions</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Laptop size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">MacBook Pro 16"</p>
                    <p className="text-xs font-medium text-slate-400">London, UK • <span className="text-emerald-500 font-semibold">Active Now</span></p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
              
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">iPhone 15 Pro</p>
                    <p className="text-xs font-medium text-slate-400">London, UK • 2 hours ago</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-wider hidden group-hover:block">Revoke</button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <button className="w-full py-3 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-200 flex items-center justify-center gap-2">
                <LogOut size={16} /> Sign out of all sessions
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-rose-50/50 rounded-3xl p-8 border border-rose-200/50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-dashed">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-rose-600 mb-1">Deactivate Account</h3>
          <p className="text-sm font-medium text-rose-500/80 leading-relaxed max-w-md">
            Permanently delete your account and all associated ledger data. This action is irreversible.
          </p>
        </div>
        <button className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 hover:shadow-lg hover:shadow-rose-500/30 transition-all shrink-0">
          Delete Account
        </button>
      </div>
      
      <div className="text-center py-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">© 2026 Northstar Finance</p>
      </div>
    </div>
  );
};
