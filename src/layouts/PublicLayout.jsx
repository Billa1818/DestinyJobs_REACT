import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DynamicHeader from '../components/DynamicHeader';
import DynamicFooter from '../components/DynamicFooter';
import RedirectNotification from '../components/RedirectNotification';
import ChatbotWidget from '../components/ChatbotWidget';

const PublicLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DynamicHeader />
      <RedirectNotification />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Outlet />
      </main>
      <DynamicFooter />
      <ChatbotWidget />
    </div>
  );
};

export default PublicLayout; 