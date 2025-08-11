import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const RecruteurHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);
  const location = useLocation();

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileOffersOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileDropdown = (menuId) => {
    if (menuId === 'mobile-offers') {
      setMobileOffersOpen(!mobileOffersOpen);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
            <Link to="/recruteur">
              <img src="/vite.svg" alt="Destiny Jobs" className="h-10 w-10 xs:h-16 xs:w-16 sm:h-20 sm:w-20" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-4 2xl:space-x-6">
            <Link to="/recruteur" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Tableau de bord
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                Créer une offre <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/creer-offre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Emplois/Jobs</Link>
                  <Link to="/recruteur/creer-financement" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Financements</Link>
                  <Link to="/recruteur/creer-consultation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Consultation</Link>
                  <Link to="/recruteur/creer-bourse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Bourses</Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                Gérer mes offres <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/gestion-offres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Emplois/Jobs</Link>
                  <Link to="/recruteur/gestion-financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Financements</Link>
                  <Link to="/recruteur/gestion-consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Consultations</Link>
                  <Link to="/recruteur/gestion-bourses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Bourses</Link>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                Candidatures reçues <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/postulations-offres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Emplois/Jobs</Link>
                  <Link to="/recruteur/postulations-financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Financements</Link>
                  <Link to="/recruteur/postulations-consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Consultations</Link>
                  <Link to="/recruteur/postulations-bourses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">Bourses</Link>
                </div>
              </div>
            </div>
            <Link to="/recruteur/statistiques" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Statistiques
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                Blog <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/blog/publier" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-plus mr-2"></i>Publier un article
                  </Link>
                  <Link to="/recruteur/blog/gerer" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-edit mr-2"></i>Gérer mes articles
                  </Link>
                  <Link to="/recruteur/blog/categories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-tags mr-2"></i>Catégories
                  </Link>
                  <Link to="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-eye mr-2"></i>Voir le blog public
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/recruteur/messagerie" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Messagerie
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Link to="/recruteur/notifications" className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative">
                <i className="fas fa-bell text-lg"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center notification-pulse">3</span>
              </Link>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
                <div className="h-8 w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JD</span>
                </div>
                <span className="hidden xl:inline">Jean Dupont</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-user mr-2"></i>Mon profil
                  </Link>
                  <Link to="/recruteur/profil-public" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-building mr-2"></i>Mon entreprise
                  </Link>
                  <Link to="/recruteur/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-bell mr-2"></i>Notifications
                  </Link>
                  <Link to="/recruteur/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-cog mr-2"></i>Paramètres
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600">
                    <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile User Menu */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
            {/* Mobile Notifications */}
            <Link to="/recruteur/notifications" className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative touch-target">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </Link>
            
            {/* Mobile Profile */}
            <button onClick={toggleUserMenu} className="flex items-center space-x-1 text-gray-700 hover:text-fuchsia-600 p-1 rounded-md transition duration-200 touch-target">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">JD</span>
              </div>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex-shrink-0 ml-1 sm:ml-2">
            <button type="button" className="text-gray-700 hover:text-fuchsia-600 focus:outline-none focus:text-fuchsia-600 p-2 touch-target" onClick={toggleMobileMenu}>
              <i className="fas fa-bars text-base sm:text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile User Menu */}
      <div className={`lg:hidden mobile-menu-slide bg-white border-t border-gray-200 ${userMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          <Link to="/recruteur/profil" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-user mr-2"></i>Mon profil
          </Link>
          <Link to="/recruteur/profil-public" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-building mr-2"></i>Mon entreprise
          </Link>
          <Link to="/recruteur/notifications" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-bell mr-2"></i>Notifications
          </Link>
          <Link to="/recruteur/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-cog mr-2"></i>Paramètres
          </Link>
          <Link to="/login" className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md">
            <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden mobile-menu-slide bg-white border-t border-gray-200 ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          <Link to="/recruteur" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            Tableau de bord
          </Link>
          
          {/* Mobile dropdown for "Créer une offre" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-offers')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              Créer une offre
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffersOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffersOpen ? 'show' : ''}`}>
              <Link to="/recruteur/creer-offre" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Emplois/Jobs</Link>
              <Link to="/recruteur/creer-financement" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Financements</Link>
              <Link to="/recruteur/creer-consultation" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Consultation</Link>
              <Link to="/recruteur/creer-bourse" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Bourses</Link>
            </div>
          </div>

          {/* Mobile dropdown for "Gérer mes offres" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-manage')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              Gérer mes offres
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffersOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffersOpen ? 'show' : ''}`}>
              <Link to="/recruteur/gestion-offres" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Emplois/Jobs</Link>
              <Link to="/recruteur/gestion-financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Financements</Link>
              <Link to="/recruteur/gestion-consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Consultations</Link>
              <Link to="/recruteur/gestion-bourses" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Bourses</Link>
            </div>
          </div>

          {/* Mobile dropdown for "Candidatures reçues" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-applications')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              Candidatures reçues
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffersOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffersOpen ? 'show' : ''}`}>
              <Link to="/recruteur/postulations-offres" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Emplois/Jobs</Link>
              <Link to="/recruteur/postulations-financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Financements</Link>
              <Link to="/recruteur/postulations-consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Consultations</Link>
              <Link to="/recruteur/postulations-bourses" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Bourses</Link>
            </div>
          </div>
          
          <Link to="/recruteur/statistiques" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            Statistiques
          </Link>
          
          {/* Mobile dropdown for "Blog" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-blog')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              Blog
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffersOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffersOpen ? 'show' : ''}`}>
              <Link to="/recruteur/blog/publier" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-plus mr-2"></i>Publier un article
              </Link>
              <Link to="/recruteur/blog/gerer" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-edit mr-2"></i>Gérer mes articles
              </Link>
              <Link to="/recruteur/blog/categories" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-tags mr-2"></i>Catégories
              </Link>
              <Link to="/blog" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-eye mr-2"></i>Voir le blog public
              </Link>
            </div>
          </div>
          
          <Link to="/recruteur/messagerie" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            Messagerie
          </Link>
        </div>
      </div>
    </header>
  );
};

export default RecruteurHeader;
