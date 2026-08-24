'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@/lib/supabaseClient';
import { Tables } from '@/lib/database.types';
import TransactionForm from '@/components/TransactionForm';

type Transaction = Tables<'transactions'>;

const TransactionsPage: React.FC = () => {
  const supabase = createClientComponentClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(
    undefined
  );

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Redirection is handled by middleware, but for client-side safety:
      // This is a client component, so we can't rely solely on middleware for the initial load.
      // However, the middleware should handle the redirect before this component loads.
      // We'll proceed assuming the user is logged in if this component is reached.
      // If not, the server-side rendering will likely redirect.
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      setError(error.message);
      setTransactions([]);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    const loadTransactions = async () => {
      await fetchTransactions();
    };

    void loadTransactions();
  }, [fetchTransactions]);

  const handleAddClick = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      fetchTransactions();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return <div className="text-center py-10">Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Transaction
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No transactions found. Start by adding one!
        </div>
      ) : (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.note}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                      {transaction.category}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(transaction)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(transaction.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <TransactionForm
              key={editingTransaction?.id ?? 'new'}
              initialData={editingTransaction}
              onSave={fetchTransactions}
              onClose={handleModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
