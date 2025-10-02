import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Only show sidebar for authenticated users
  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Expenses', path: '/expenses', icon: '💰' },
    { name: 'Budgets', path: '/budgets', icon: '📈' },
    { name: 'Goals', path: '/goals', icon: '🎯' },
    { name: 'Learning', path: '/learning', icon: '📚' },
    { name: 'Community', path: '/community', icon: '👥' },
  ];

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-20 left-4 z-30 p-2 rounded-md bg-white shadow-md text-gray-600 hover:bg-gray-100"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed md:relative z-20 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:block w-64`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Navigation</h2>
          </div>
          <nav className="flex-1 p-2 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">Free Account</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;