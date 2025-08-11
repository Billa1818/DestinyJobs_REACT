import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const PublicHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [offresMenuOpen, setOffresMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setOffresMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleOffresMenu = () => {
    setOffresMenuOpen(!offresMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
            <Link to="/">
              <img src="/vite.svg" alt="Destiny Jobs" className="h-10 w-10 xs:h-16 xs:w-16 sm:h-20 sm:w-20" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-4 2xl:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Accueil
            </Link>
            
            {/* Offres Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                Offres <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <i className="fas fa-briefcase mr-2"></i>Emplois/Jobs
                  </Link>
                  <Link to="/bourses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <i className="fas fa-graduation-cap mr-2"></i>Bourses
                  </Link>
                  <Link to="/financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <i className="fas fa-money-bill-wave mr-2"></i>Financements
                  </Link>
                  <Link to="/consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <i className="fas fa-comments mr-2"></i>Consultations
                  </Link>
                </div>
              </div>
            </div>

            <Link to="/blog" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Blog
            </Link>
            <Link to="/abonnements" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Abonnements
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Contact
            </Link>
            <Link to="/a-propos" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              À propos
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Login Button */}
            <Link to="/login" className="text-gray-700 hover:text-orange-600 px-3 py-2 rounded-md text-sm font-medium transition duration-200">
              Connexion
            </Link>
            
            {/* Signup Button */}
            <Link to="/signup" className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-200 text-sm font-medium">
              Inscription
            </Link>
          </div>

          {/* Mobile User Menu */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
            {/* Mobile Login */}
            <Link to="/login" className="text-gray-700 hover:text-orange-600 px-2 py-1 rounded-md text-sm font-medium transition duration-200">
              Connexion
            </Link>
            
            {/* Mobile Signup */}
            <Link to="/signup" className="bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-700 transition duration-200 text-sm font-medium">
              Inscription
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex-shrink-0 ml-1 sm:ml-2">
            <button type="button" className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600 p-2 touch-target" onClick={toggleMobileMenu}>
              <i className="fas fa-bars text-base sm:text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden mobile-menu-slide bg-white border-t border-gray-200 ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          <Link to="/" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Accueil
          </Link>
          
          {/* Mobile dropdown for "Offres" */}
          <div>
            <button onClick={toggleOffresMenu} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
              Offres
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${offresMenuOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${offresMenuOpen ? 'show' : ''}`}>
              <Link to="/jobs" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md">
                <i className="fas fa-briefcase mr-2"></i>Emplois/Jobs
              </Link>
              <Link to="/bourses" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md">
                <i className="fas fa-graduation-cap mr-2"></i>Bourses
              </Link>
              <Link to="/financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md">
                <i className="fas fa-money-bill-wave mr-2"></i>Financements
              </Link>
              <Link to="/consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md">
                <i className="fas fa-comments mr-2"></i>Consultations
              </Link>
            </div>
          </div>
          
          <Link to="/blog" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Blog
          </Link>
          <Link to="/abonnements" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Abonnements
          </Link>
          <Link to="/contact" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Contact
          </Link>
          <Link to="/a-propos" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            À propos
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader; 