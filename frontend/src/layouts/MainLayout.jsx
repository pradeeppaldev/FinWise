import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 bg-gray-50 min-h-screen">
        {/* Render nested routes here */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;