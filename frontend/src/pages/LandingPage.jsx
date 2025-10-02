import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          FinWise
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Financial Literacy Platform
        </p>
        
        <div className="space-y-4">
          <Link 
            to="/auth/login" 
            className="block w-full text-center py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
          
          <Link 
            to="/auth/register" 
            className="block w-full text-center py-3 px-4 bg-white text-blue-600 font-medium rounded-md border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Create Account
          </Link>
          
          <Link 
            to="/test" 
            className="block w-full text-center py-3 px-4 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Test Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
