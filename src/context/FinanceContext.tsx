import React, { createContext, useContext, useState, useMemo } from 'react';

export type Role = 'viewer' | 'admin';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Housing'
  | 'Food & Dining'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Investments'
  | 'Income'
  | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO format
  merchant: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  status: 'completed' | 'pending' | 'failed';
}

interface FinanceContextType {
  role: Role;
  setRole: (role: Role) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-05-24T10:00:00Z',
    merchant: 'Apple Store',
    amount: 1299.00,
    category: 'Shopping',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-05-22T19:30:00Z',
    merchant: 'Le Jardin',
    amount: 154.20,
    category: 'Food & Dining',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-05-21T08:15:00Z',
    merchant: 'Metro Transit',
    amount: 45.00,
    category: 'Transportation',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '4',
    date: '2024-05-20T09:00:00Z',
    merchant: 'Freelance Payout',
    amount: 3200.00,
    category: 'Income',
    type: 'income',
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-05-18T14:20:00Z',
    merchant: 'Whole Foods Market',
    amount: 210.50,
    category: 'Food & Dining',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '6',
    date: '2024-05-15T09:00:00Z',
    merchant: 'Monthly Salary',
    amount: 8500.00,
    category: 'Income',
    type: 'income',
    status: 'completed',
  },
  {
    id: '7',
    date: '2024-05-12T11:45:00Z',
    merchant: 'Amazon Web Services',
    amount: 1240.00,
    category: 'Other',
    type: 'expense',
    status: 'completed',
  },
  {
    id: '8',
    date: '2024-05-10T15:30:00Z',
    merchant: 'Vanguard Real Estate Fund',
    amount: 125000.00,
    category: 'Investments',
    type: 'expense', // Considered expense as money leaving balance
    status: 'pending',
  },
  {
    id: '9',
    date: '2024-05-01T08:00:00Z',
    merchant: 'Apartment Rent',
    amount: 2500.00,
    category: 'Housing',
    type: 'expense',
    status: 'completed',
  },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('viewer');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    // We calculate a base total balance starting point plus net sum of transactions
    // For realism, let's say the initial base balance was 130,000 before these transactions
    const baseBalance = 130000;

    transactions.forEach(t => {
      if (t.status !== 'failed') {
        if (t.type === 'income') {
          income += t.amount;
        } else {
          expenses += t.amount;
        }
      }
    });

    return {
      totalBalance: baseBalance + income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
    };
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        role,
        setRole,
        searchQuery,
        setSearchQuery,
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        totalBalance,
        totalIncome,
        totalExpenses,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
