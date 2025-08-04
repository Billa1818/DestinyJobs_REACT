import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const BaseLayout = ({ children }) => {
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
    <div className="min-h-full bg-gray-50 flex flex-col">
      {/* Header */}
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
            
            <Link to="/utilisateurs" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Nos utilisateurs</Link>
            <Link to="/formations" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Formations</Link>
            <Link to="/blog" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Blog</Link>
            <Link to="/abonnements" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Abonnements</Link>
            <Link to="/a-propos" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">À propos</Link>
            <Link to="/contact" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Contact</Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Scrollable Content Column */}
          <div className="xl:w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="xs:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
                <div className="h-5 w-5 xs:h-6 xs:w-6 sm:h-8 sm:w-8 bg-fuchsia-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-briefcase text-white text-xs sm:text-sm"></i>
                </div>
                <span className="ml-1.5 sm:ml-2 text-base xs:text-lg sm:text-xl font-bold">Destiny Jobs</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">Un emploi. Un impact. Une Afrique transformée.</p>
              <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-facebook text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-linkedin text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-twitter text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 p-1">
                  <i className="fab fa-instagram text-sm xs:text-base sm:text-lg lg:text-xl"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Liens rapides</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/jobs" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Emplois</Link></li>
                <li><Link to="/formations" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Formations</Link></li>
                <li><Link to="/bourses" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Bourses</Link></li>
                <li><Link to="/financements" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Financements</Link></li>
                <li><Link to="/consultation" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Consultation</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Services</h3>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/candidat" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Pour candidats</Link></li>
                <li><Link to="/prestataire" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Pour prestataires</Link></li>
                <li><Link to="/blog" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Blog</Link></li>
                <li><Link to="/support" className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Support</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Contact</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt mt-1 mr-2 text-fuchsia-400 text-xs sm:text-sm flex-shrink-0"></i>
                  <span className="text-gray-300 text-xs xs:text-sm sm:text-base">Cotonou, Bénin</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-phone mr-2 text-fuchsia-400 text-xs sm:text-sm flex-shrink-0"></i>
                  <span className="text-gray-300 text-xs xs:text-sm sm:text-base">+229 XX XX XX XX</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-2 text-fuchsia-400 text-xs sm:text-sm flex-shrink-0"></i>
                  <span className="text-gray-300 text-xs xs:text-sm sm:text-base">contact@destinyjobs.careers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6">
            <div className="flex flex-col xs:flex-row justify-between items-center space-y-2 xs:space-y-0">
              <p className="text-gray-400 text-xs xs:text-sm sm:text-base text-center xs:text-left">
                © 2024 Destiny Jobs. Tous droits réservés.
              </p>
              <div className="flex flex-wrap justify-center xs:justify-end items-center space-x-3 sm:space-x-4 lg:space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Politique de confidentialité</a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Conditions d'utilisation</a>
                <a href="#" className="text-gray-400 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout; 