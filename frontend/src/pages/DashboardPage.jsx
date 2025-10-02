import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your finances today.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Overview</h2>
        <p className="text-gray-600">
          This is your financial dashboard. Here you can track your expenses, manage budgets, 
          set financial goals, and learn about personal finance.
        </p>
        
        <div className="mt-6">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
