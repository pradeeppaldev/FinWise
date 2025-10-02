import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Test Page
        </h1>
        <p className="text-center text-gray-600">
          If you can see this, the routing is working correctly!
        </p>
      </div>
    </div>
  );
};

export default TestPage;