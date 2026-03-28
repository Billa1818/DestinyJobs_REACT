import React from 'react';
import { Outlet } from 'react-router-dom';
import DynamicHeader from '../components/DynamicHeader';
import DynamicFooter from '../components/DynamicFooter';
import ChatbotWidget from '../components/ChatbotWidget';

const CandidatLayout = () => {
  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      <DynamicHeader />
      
      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Scrollable Content Column */}
          <div className="xl:w-full">
            <Outlet />
          </div>
        </div>
      </main>

      <DynamicFooter accountType="candidat" />
      <ChatbotWidget />
    </div>
  );
};

export default CandidatLayout;
