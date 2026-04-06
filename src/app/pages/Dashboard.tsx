import React from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, ArrowDownRight, Wallet, Banknote, ShoppingCart, Lightbulb, ChevronRight, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, formatCompactNumber, cn } from '../../lib/utils';
import { format } from 'date-fns';

const data = [
  { name: 'Jan', balance: 110000 },
  { name: 'Feb', balance: 115000 },
  { name: 'Mar', balance: 112000 },
  { name: 'Apr', balance: 120500 },
  { name: 'May', balance: 124592 },
  { name: 'Jun', balance: 130000 },
];

const COLORS = ['#4f46e5', '#10b981', '#f43f5e', '#f59e0b', '#8b5cf6', '#64748b'];

export const Dashboard: React.FC = () => {
  const { totalBalance, totalIncome, totalExpenses, transactions, role, searchQuery } = useFinance();

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const visibleTransactions = normalizedQuery
    ? transactions.filter((tx) =>
        tx.merchant.toLowerCase().includes(normalizedQuery) ||
        tx.category.toLowerCase().includes(normalizedQuery) ||
        tx.status.toLowerCase().includes(normalizedQuery)
      )
    : transactions;

  const recentTransactions = visibleTransactions.slice(0, 4);

  // Group by category for pie chart
  const expensesByCategory = visibleTransactions
    .filter(t => t.type === 'expense' && t.status !== 'failed')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(expensesByCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 categories

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Balance"
          amount={totalBalance}
          trend="+12.5%"
          isPositive={true}
          icon={<Wallet className="text-white" size={24} />}
          bg="bg-indigo-600 shadow-indigo-200"
          textClass="text-white"
        />
        <SummaryCard
          title="Monthly Income"
          amount={totalIncome}
          trend="+4.2%"
          isPositive={true}
          icon={<Banknote className="text-emerald-600" size={24} />}
          bg="bg-white shadow-emerald-50/50"
          iconBg="bg-emerald-50"
        />
        <SummaryCard
          title="Monthly Expenses"
          amount={totalExpenses}
          trend="-2.1%"
          isPositive={true}
          subtext="(Savings ↑)"
          icon={<ShoppingCart className="text-rose-600" size={24} />}
          bg="bg-white shadow-rose-50/50"
          iconBg="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col h-[420px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Balance Trend {role === 'admin' && '(Admin View)'}</h2>
              <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl sm:rounded-full">
                {['1W', '1M', '6M', '1Y', 'ALL'].map((period) => (
                  <button
                    key={period}
                    className={cn(
                      "px-3 py-1.5 sm:py-1 rounded-xl sm:rounded-full text-xs font-semibold transition-all flex-1 sm:flex-none text-center",
                      period === '6M' ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs key="defs">
                    <linearGradient key="grad" id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop key="stop-1" offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop key="stop-2" offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis key="xaxis" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                  <RechartsTooltip
                    key="tooltip"
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                    labelStyle={{ color: '#64748b', fontWeight: 600, marginBottom: '4px' }}
                    itemStyle={{ color: '#0f172a', fontWeight: 700, fontSize: '16px' }}
                    formatter={(value: number) => [formatCurrency(value), 'Balance']}
                  />
                  <Area
                    key="area"
                    type="monotone"
                    dataKey="balance"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold tracking-tight text-slate-800">Recent Transactions</h2>
              <Link to="/transactions" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                      tx.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                    )}>
                      {tx.type === 'income' ? <TrendingUp size={22} /> : <ShoppingCart size={22} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-[15px]">{tx.merchant}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                          {tx.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {format(new Date(tx.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "font-bold text-[15px]",
                      tx.type === 'income' ? "text-emerald-600" : "text-slate-800"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                    {tx.status === 'pending' && (
                      <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider mt-1">Pending</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-8">
          {/* Insights Card */}
          {role === 'admin' ? (
            <div className="bg-slate-900 rounded-3xl p-7 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[64px] -translate-y-1/2 translate-x-1/2 opacity-40"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm shadow-inner border border-white/10">
                    <Lightbulb size={20} className="text-amber-400" />
                  </div>
                  <h3 className="font-bold text-lg tracking-tight">Active Insights</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer group-hover:border-white/20">
                    <p className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      Unusual Spending
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-slate-200">
                      Software subscriptions jumped by <span className="text-white font-bold bg-white/20 px-1 rounded">45%</span> this week. Consider reviewing your active plans.
                    </p>
                    <button className="text-xs font-semibold text-indigo-300 mt-3 flex items-center gap-1 hover:text-white transition-colors">
                      Review Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 text-slate-500 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
                <Lightbulb size={20} className="text-slate-300" />
              </div>
              <h3 className="font-bold text-lg tracking-tight text-slate-700 mb-2">Insights Locked</h3>
              <p className="text-sm">Active Insights and AI-driven alerts require Admin access.</p>
            </div>
          )}

          {/* Spending Breakdown */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col h-[400px]">
            <h2 className="text-xl font-bold tracking-tight text-slate-800 mb-6">Spending Breakdown</h2>
            <div className="flex-1 relative flex items-center justify-center -mt-4">
              <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={0}>
                <PieChart>
                  <Pie
                    key="pie"
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    key="pie-tooltip"
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">This Month</p>
                <p className="text-2xl font-bold text-slate-800 mt-0.5">{formatCompactNumber(totalExpenses)}</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              {pieData.slice(0, 3).map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index] }}></div>
                    <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SummaryCard({ title, amount, trend, isPositive, subtext, icon, bg, textClass = "text-slate-800", iconBg = "bg-white/20" }: {
  title: string;
  amount: number;
  trend: string;
  isPositive: boolean;
  subtext?: string;
  icon: React.ReactNode;
  bg: string;
  textClass?: string;
  iconBg?: string;
}) {
  return (
    <div className={cn("p-7 rounded-3xl relative overflow-hidden group shadow-lg", bg)}>
      {textClass === "text-white" && (
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500"></div>
      )}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className={cn("text-xs font-bold uppercase tracking-widest opacity-80 mb-2", textClass)}>{title}</p>
          <h3 className={cn("text-4xl font-extrabold tracking-tight", textClass)}>{formatCurrency(amount)}</h3>
        </div>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-md", iconBg)}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-2 relative z-10">
        <span className={cn(
          "flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg backdrop-blur-md",
          isPositive 
            ? textClass === "text-white" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700" 
            : textClass === "text-white" ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"
        )}>
          {isPositive ? <ArrowUpRight size={16} strokeWidth={2.5} /> : <ArrowDownRight size={16} strokeWidth={2.5} />}
          {trend}
        </span>
        <span className={cn("text-sm font-medium opacity-80", textClass)}>
          vs last month {subtext}
        </span>
      </div>
    </div>
  );
}
