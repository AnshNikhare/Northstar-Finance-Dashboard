import React, { useState, useMemo } from 'react';
import { useFinance, TransactionCategory } from '../../context/FinanceContext';
import { formatCurrency, cn } from '../../lib/utils';
import { format } from 'date-fns';
import { Search, Filter, Plus, FileDown, MoreHorizontal, Tag, Trash2 } from 'lucide-react';

export const Transactions: React.FC = () => {
  const { transactions, role, addTransaction, deleteTransaction, searchQuery } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<TransactionCategory | 'All'>('All');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({ merchant: '', amount: '', type: 'expense' as 'expense' | 'income', category: 'Other' as TransactionCategory });

  const handleAddSubmit = () => {
    if (!newTx.merchant || !newTx.amount) return;
    addTransaction({
      date: new Date().toISOString(),
      merchant: newTx.merchant,
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      type: newTx.type,
      status: 'completed'
    });
    setNewTx({ merchant: '', amount: '', type: 'expense', category: 'Other' });
    setIsAddModalOpen(false);
  };

  const categories: (TransactionCategory | 'All')[] = [
    'All', 'Housing', 'Food & Dining', 'Transportation', 'Entertainment', 'Shopping', 'Investments', 'Income', 'Other'
  ];

  const filteredTransactions = useMemo(() => {
    const normalizedLocalQuery = searchTerm.trim().toLowerCase();
    const normalizedGlobalQuery = searchQuery.trim().toLowerCase();

    return transactions
      .filter(tx => 
        (filterCategory === 'All' || tx.category === filterCategory) &&
        (normalizedLocalQuery === '' || tx.merchant.toLowerCase().includes(normalizedLocalQuery) || tx.category.toLowerCase().includes(normalizedLocalQuery)) &&
        (normalizedGlobalQuery === '' || tx.merchant.toLowerCase().includes(normalizedGlobalQuery) || tx.category.toLowerCase().includes(normalizedGlobalQuery) || tx.status.toLowerCase().includes(normalizedGlobalQuery))
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });
  }, [transactions, searchTerm, searchQuery, filterCategory, sortOrder]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Transactions Management</h2>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage institutional capital flows.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
            <FileDown size={18} className="text-slate-400" />
            Export
          </button>
          
          {role === 'admin' && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search vendor name, category..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-48">
              <select
                className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-sm text-slate-700 transition-all cursor-pointer"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as TransactionCategory | 'All')}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Filter size={16} />
              </div>
            </div>

            <button 
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 font-semibold text-sm text-slate-700 shadow-sm transition-all"
            >
              Date {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-4 sm:pb-0 scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">Date & Merchant</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">Category</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-right">Amount</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50/80">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                      <Search className="text-slate-400" size={24} />
                    </div>
                    <p className="text-slate-500 font-semibold text-lg">No transactions found</p>
                    <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search term.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-[15px]">{tx.merchant}</span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                          {format(new Date(tx.date), 'MMM dd, yyyy • hh:mm a')}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/50">
                        <Tag size={12} className="opacity-50" /> {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={cn(
                        "font-extrabold text-[15px] tabular-nums tracking-tight",
                        tx.type === 'income' ? "text-emerald-600" : "text-slate-800"
                      )}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={cn(
                        "inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border",
                        tx.status === 'completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        tx.status === 'pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                        "bg-rose-50 text-rose-600 border-rose-100"
                      )}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {role === 'admin' ? (
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteTransaction(tx.id); }}
                          className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors group-hover:opacity-100 opacity-50 sm:opacity-100"
                          title="Delete Transaction"
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <button className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-not-allowed opacity-50" title="Admin access required">
                          <MoreHorizontal size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-sm text-slate-500 font-medium">
          <span>Showing {filteredTransactions.length} results</span>
        </div>
      </div>

      {/* Add Transaction Modal Placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mb-6">Add New Transaction</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Merchant Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                  placeholder="e.g. Apple Store" 
                  value={newTx.merchant}
                  onChange={(e) => setNewTx(prev => ({ ...prev, merchant: e.target.value }))}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Amount</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium" 
                    placeholder="0.00" 
                    value={newTx.amount}
                    onChange={(e) => setNewTx(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
                    value={newTx.type}
                    onChange={(e) => setNewTx(prev => ({ ...prev, type: e.target.value as any }))}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
                  value={newTx.category}
                  onChange={(e) => setNewTx(prev => ({ ...prev, category: e.target.value as any }))}
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddSubmit}
                disabled={!newTx.merchant || !newTx.amount}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
