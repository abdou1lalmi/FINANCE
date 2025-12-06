'use client';

import React, { useState, useEffect } from 'react';
import { TablesInsert, TablesUpdate } from '@/lib/database.types';
import { createClientComponentClient } from '@/lib/supabaseClient';

type Transaction = TablesInsert<'transactions'> & { id?: string };

interface TransactionFormProps {
  initialData?: Transaction;
  onSave: () => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState<Transaction>({
    amount: initialData?.amount || 0,
    category: initialData?.category || '',
    type: initialData?.type || 'expense',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    note: initialData?.note || '',
    user_id: '', // Will be set on submit
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        amount: initialData.amount,
        category: initialData.category,
        type: initialData.type,
        date: initialData.date,
        note: initialData.note,
        user_id: initialData.user_id,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }

    const transactionData: TablesInsert<'transactions'> | TablesUpdate<'transactions'> = {
      ...formData,
      user_id: user.id,
      amount: formData.amount,
      date: formData.date,
      type: formData.type,
      category: formData.category,
      note: formData.note,
    };

    let result;
    if (initialData?.id) {
      // Update
      result = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', initialData.id)
        .select();
    } else {
      // Insert
      result = await supabase.from('transactions').insert([transactionData]).select();
    }

    if (result.error) {
      setError(result.error.message);
    } else {
      onSave();
      onClose();
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            Note (Description)
          </label>
          <textarea
            id="note"
            name="note"
            value={formData.note || ''}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
