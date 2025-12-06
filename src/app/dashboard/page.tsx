import React from 'react';
import { createServerComponentClient } from '@/lib/supabaseServer';
import { Database, Tables } from '@/lib/database.types';
import { cookies } from 'next/headers';

type Transaction = Tables<'transactions'>;

const DashboardPage: React.FC = async () => {
  const supabase = createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Middleware should handle redirection, but this is a safeguard
    return <div className="text-center py-10">Please log in to view the dashboard.</div>;
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  if (error) {
    return <div className="text-center py-10 text-red-500">Error loading data: {error.message}</div>;
  }

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    // Compare date strings to avoid timezone issues, assuming date is stored as YYYY-MM-DD
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    return transactionMonth === currentMonth && transactionYear === currentYear;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  const monthlyIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const Card: React.FC<{ title: string; value: number; color: string }> = ({
    title,
    value,
    color,
  }) => (
    <div className={`p-6 rounded-lg shadow-lg ${color}`}>
      <p className="text-sm font-medium text-white uppercase tracking-wider">{title}</p>
      <p className="mt-1 text-3xl font-bold text-white">{formatCurrency(value)}</p>
    </div>
  );

  return (
    <div className="py-10">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card
          title="Total Balance"
          value={totalBalance}
          color={totalBalance >= 0 ? 'bg-indigo-600' : 'bg-red-600'}
        />
        <Card
          title="Income (Month)"
          value={monthlyIncome}
          color="bg-green-600"
        />
        <Card
          title="Expenses (Month)"
          value={monthlyExpense}
          color="bg-red-600"
        />
      </div>

      <div className="mt-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions recorded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {transactions.slice(0, 5).map((t) => (
              <li key={t.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-900">{t.note}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(t.date).toLocaleDateString()} - {t.category}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${
                    t.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
