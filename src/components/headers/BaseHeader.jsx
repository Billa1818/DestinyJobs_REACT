import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BaseHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);

  const location = useLocation();

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setAuthMenuOpen(false);
    setMobileOffersOpen(false);
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
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
            <Link to="/home">
              <img src="/vite.svg" alt="Destiny Jobs" className="h-10 w-10 xs:h-16 xs:w-16 sm:h-20 sm:w-20" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-4 2xl:space-x-6">
            <Link to="/home" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Accueil
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                Nos offres <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Emplois/Jobs</Link>
                  <Link to="/financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Financements</Link>
                  <Link to="/consultation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Consultation</Link>
                  <Link to="/bourses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Bourses</Link>
                </div>
              </div>
            </div>

            <Link to="/utilisateurs" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Nos utilisateurs
            </Link>
            <Link to="/formations" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Formations
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Blog
            </Link>
            <Link to="/abonnements" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Abonnements
            </Link>
            <Link to="/a-propos" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              À propos
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Contact
            </Link>
          </nav>

          {/* Auth buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            <Link to="/login" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200">
              Connexion
            </Link>
          </div>

          {/* Mobile/Tablet Auth buttons */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
            <Link to="/login" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition duration-200 touch-target flex items-center justify-center">
              <span className="hidden xs:inline">Connexion</span>
              <i className="fas fa-sign-in-alt xs:hidden"></i>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex-shrink-0 ml-1 sm:ml-2">
            <button 
              type="button" 
              className="text-gray-700 hover:text-fuchsia-600 focus:outline-none focus:text-fuchsia-600 p-2 touch-target" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-menu="mobile"
            >
              <i className="fas fa-bars text-base sm:text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden mobile-menu-slide bg-white border-t border-gray-200 ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          <Link to="/home" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Accueil</Link>
          
          {/* Mobile dropdown for "Nos offres" */}
          <div>
            <button 
              onClick={() => setMobileOffersOpen(!mobileOffersOpen)} 
              className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md"
            >
              Nos offres
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffersOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffersOpen ? 'show' : ''}`}>
              <Link to="/jobs" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Emplois/Jobs</Link>
              <Link to="/financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Financements</Link>
              <Link to="/consultation" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Consultation</Link>
              <Link to="/bourses" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Bourses</Link>
            </div>
          </div>
          
          <Link to="/formations" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Formations</Link>
          <Link to="/blog" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Blog</Link>
          <Link to="/abonnements" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Abonnements</Link>
          <Link to="/a-propos" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">À propos</Link>
          <Link to="/contact" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Contact</Link>
        </div>
      </div>
    </header>
  );
};

export default BaseHeader; 