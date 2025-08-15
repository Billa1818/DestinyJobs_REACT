import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DynamicHeader from '../components/DynamicHeader';
import Footer from '../components/Footer';
import RedirectNotification from '../components/RedirectNotification';

const PublicLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicHeader />
      <RedirectNotification />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 