import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold">
              FinWise
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden lg:inline text-blue-100">Welcome, {user.name}</span>
                <button
                  onClick={logout}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/auth/register" className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;