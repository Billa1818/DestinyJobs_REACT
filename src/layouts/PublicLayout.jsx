import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from '../components/headers/PublicHeader';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout; 