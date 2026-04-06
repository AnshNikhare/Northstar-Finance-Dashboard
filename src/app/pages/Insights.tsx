import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../lib/utils';
import { TrendingUp, Zap, ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const Insights: React.FC = () => {
  const { transactions, role, searchQuery } = useFinance();

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleTransactions = normalizedQuery
    ? transactions.filter((tx) =>
        tx.merchant.toLowerCase().includes(normalizedQuery) ||
        tx.category.toLowerCase().includes(normalizedQuery) ||
        tx.status.toLowerCase().includes(normalizedQuery)
      )
    : transactions;

  const expenses = visibleTransactions.filter(t => t.type === 'expense' && t.status !== 'failed');
  const expensesByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const highestCategory = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1])[0];

  const barData = [
    { name: 'Jan', income: 12000, expense: 8000 },
    { name: 'Feb', income: 14000, expense: 9500 },
    { name: 'Mar', income: 11000, expense: 7000 },
    { name: 'Apr', income: 15500, expense: 10200 },
    { name: 'May', income: 18240, expense: highestCategory ? highestCategory[1] + 2000 : 12000 }, // Mock dynamic data
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Financial Intelligence</h2>
        <p className="text-slate-500 font-medium mt-1">Advanced predictive modeling and spending analysis.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Highest Spending */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm shadow-slate-200/50 hover:border-indigo-100 hover:shadow-indigo-100/50 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
                <TrendingUp className="text-white" size={28} />
              </div>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold uppercase tracking-wider border border-rose-100 whitespace-nowrap ml-4">
                Needs Attention
              </span>
            </div>
            
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Highest Spending Category</h3>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 break-words">{highestCategory ? highestCategory[0] : 'N/A'}</p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Monthly Allocation</p>
              <p className="text-2xl font-bold tabular-nums text-slate-800">{highestCategory ? formatCurrency(highestCategory[1]) : '$0'}</p>
            </div>
            <div className="w-full sm:w-1/2 h-2 bg-slate-100 rounded-full overflow-hidden mt-2 sm:mt-0">
              <div className="h-full bg-rose-500 rounded-full w-[75%]"></div>
            </div>
          </div>
        </div>

        {/* Financial Efficiency Score */}
        {role === 'admin' ? (
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl shadow-slate-900/20 text-white relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Your Financial Efficiency Score is <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 block sm:inline mt-2 sm:mt-0">88/100</span></h3>
                <p className="text-slate-300 font-medium leading-relaxed max-w-md">
                  You are outperforming 94% of users in your income bracket regarding debt-to-income management. Maintaining this trajectory unlocks "Premium" advisory benefits.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
                  <TrendingUp size={14} /> Top 5% National
                </span>
                <span className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> Low Risk Profile
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-500 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 relative z-10">
              <ShieldCheck size={32} className="text-slate-300" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-slate-700 mb-3 relative z-10">Efficiency Score Hidden</h3>
            <p className="text-sm font-medium max-w-sm relative z-10">
              Advanced scoring and predictive metrics are restricted to Admin users.
            </p>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-200/50 to-transparent opacity-50 pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Cash Flow Velocity Chart */}
      {role === 'admin' ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm shadow-slate-200/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">Cash Flow Velocity</h3>
              <p className="text-slate-500 font-medium text-sm mt-1">Income vs. Expenses (Last 5 Months)</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div> Income
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                <div className="w-3 h-3 rounded-full bg-indigo-900 shadow-sm"></div> Expenses
              </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barGap={6}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} dy={10} />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '16px 20px' }}
                  labelStyle={{ color: '#64748b', fontWeight: 700, marginBottom: '8px' }}
                  formatter={(value: number) => [<span className="font-bold">{formatCurrency(value)}</span>]}
                />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 6, 6]} barSize={24} />
                <Bar dataKey="expense" fill="#0f172a" radius={[6, 6, 6, 6]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      {/* Predictive Tip */}
      {role === 'admin' ? (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-inner">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
              <Zap size={24} />
            </div>
            <div className="w-full">
              <h4 className="text-lg font-bold tracking-tight text-slate-900 mb-2">Predictive Intelligence Tip</h4>
              <p className="text-slate-700 font-medium leading-relaxed max-w-3xl">
                Based on your current spending, you'll reach your <strong>New House</strong> goal in <span className="underline decoration-indigo-300 decoration-2 underline-offset-4">3 months</span> if you reduce 'Entertainment' by 10%.
              </p>
              
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 mt-6">
                <div className="bg-white rounded-xl px-4 py-4 sm:px-5 border border-slate-100 shadow-sm sm:min-w-[160px] text-center sm:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Impact</p>
                  <p className="text-lg sm:text-xl font-extrabold text-emerald-600">+$450/mo</p>
                </div>
                <div className="bg-white rounded-xl px-4 py-4 sm:px-5 border border-slate-100 shadow-sm sm:min-w-[160px] text-center sm:text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Probability</p>
                  <p className="text-lg sm:text-xl font-extrabold text-slate-800">92%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
