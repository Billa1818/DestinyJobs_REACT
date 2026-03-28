import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import DynamicHeader from '../components/DynamicHeader';
import DynamicFooter from '../components/DynamicFooter';
import ChatbotWidget from '../components/ChatbotWidget';

const BaseLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);
  const [mobileRecruteurOpen, setMobileRecruteurOpen] = useState(false);
  const location = useLocation();

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setAuthMenuOpen(false);
    setMobileOffersOpen(false);
    setMobileRecruteurOpen(false);
  }, [location]);

  // Fermer les menus lors du clic en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-menu]')) {
        setMobileMenuOpen(false);
        setAuthMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* Header dynamique */}
      <DynamicHeader />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Scrollable Content Column */}
          <div className="xl:w-full">
            {children}
          </div>
        </div>
      </main>

      <DynamicFooter />

      {/* Chatbot Widget Flottant */}
      <ChatbotWidget />
    </div>
  );
};

export default BaseLayout; 