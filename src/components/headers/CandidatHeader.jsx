import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CandidatHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);
  const [mobileOpportunitiesOpen, setMobileOpportunitiesOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const location = useLocation();

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileOffersOpen(false);
    setMobileOpportunitiesOpen(false);
    setMobileProfileOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileDropdown = (menuId) => {
    switch (menuId) {
      case 'mobile-offers':
        setMobileOffersOpen(!mobileOffersOpen);
        break;
      case 'mobile-opportunities':
        setMobileOpportunitiesOpen(!mobileOpportunitiesOpen);
        break;
      case 'mobile-profile':
        setMobileProfileOpen(!mobileProfileOpen);
        break;
      default:
        break;
    }
  };

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Générer les initiales de l'utilisateur
  const getUserInitials = () => {
    console.log('CandidatHeader - getUserInitials - user:', user);
    if (user?.firstName && user?.lastName) {
      const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      console.log('CandidatHeader - getUserInitials - initials:', initials);
      return initials;
    }
    const fallback = user?.firstName?.charAt(0)?.toUpperCase() || 'U';
    console.log('CandidatHeader - getUserInitials - fallback:', fallback);
    return fallback;
  };

  // Obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    console.log('CandidatHeader - getUserFullName - user:', user);
    if (user?.firstName && user?.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`;
      console.log('CandidatHeader - getUserFullName - fullName:', fullName);
      return fullName;
    }
    const fallback = user?.firstName || user?.email || 'Utilisateur';
    console.log('CandidatHeader - getUserFullName - fallback:', fallback);
    return fallback;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log('CandidatHeader - user:', user);
  console.log('CandidatHeader - getUserFullName():', getUserFullName());
  console.log('CandidatHeader - getUserInitials():', getUserInitials());

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
            <Link to="/candidat">
              <img src="/vite.svg" alt="Destiny Jobs" className="h-10 w-10 xs:h-16 xs:w-16 sm:h-20 sm:w-20" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-4 2xl:space-x-6">
            {/* Tableau de bord */}
            <Link 
              to="/candidat" 
              className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 ${
                isActiveLink('/candidat') && !location.pathname.includes('/candidat/') 
                  ? 'text-fuchsia-600 bg-fuchsia-50' 
                  : 'text-gray-700 hover:text-fuchsia-600'
              }`}
            >
              <i className="fas fa-tachometer-alt mr-1"></i>
              Tableau de bord
            </Link>

            {/* Opportunités d'emploi */}
            <div className="relative group">
              <button className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                location.pathname.includes('/candidat/offre') || location.pathname.includes('/jobs')
                  ? 'text-fuchsia-600 bg-fuchsia-50' 
                  : 'text-gray-700 hover:text-fuchsia-600'
              }`}>
                <i className="fas fa-briefcase mr-1"></i>
                Emplois <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/candidat/offre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-search mr-2"></i>Rechercher des emplois
                  </Link>
                  <Link to="/candidat/candidature-recente" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-clock mr-2"></i>Candidatures récentes
                  </Link>
                  <Link to="/candidat/offres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-external-link-alt mr-2"></i>Toutes les offres
                  </Link>
                </div>
              </div>
            </div>

            {/* Opportunités de financement */}
            <div className="relative group">
              <button className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                location.pathname.includes('/candidat/finacement') || location.pathname.includes('/financements')
                  ? 'text-fuchsia-600 bg-fuchsia-50' 
                  : 'text-gray-700 hover:text-fuchsia-600'
              }`}>
                <i className="fas fa-money-bill-wave mr-1"></i>
                Financements <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/candidat/finacement" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-search mr-2"></i>Rechercher des financements
                  </Link>
                  <Link to="/financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-external-link-alt mr-2"></i>Tous les financements
                  </Link>
                </div>
              </div>
            </div>

            {/* Bourses */}
            <div className="relative group">
              <button className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center ${
                location.pathname.includes('/candidat/bourse') || location.pathname.includes('/bourses')
                  ? 'text-fuchsia-600 bg-fuchsia-50' 
                  : 'text-gray-700 hover:text-fuchsia-600'
              }`}>
                <i className="fas fa-graduation-cap mr-1"></i>
                Bourses <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/candidat/bourse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-search mr-2"></i>Rechercher des bourses
                  </Link>
                  <Link to="/candidat/bourse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-external-link-alt mr-2"></i>Toutes les bourses
                  </Link>
                </div>
              </div>
            </div>

            {/* Formations */}
            <Link 
              to="/formations" 
              className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 ${
                location.pathname.includes('/formations') 
                  ? 'text-fuchsia-600 bg-fuchsia-50' 
                  : 'text-gray-700 hover:text-fuchsia-600'
              }`}
            >
              <i className="fas fa-chalkboard-teacher mr-1"></i>
              Formations
            </Link>

            {/* À propos */}
            <Link 
              to="/a-propos" 
              className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 ${
                location.pathname.includes('/a-propos') 
                  ? 'text-fuchsia-600 bg-fuchsia-50' 
                  : 'text-gray-700 hover:text-fuchsia-600'
              }`}
            >
              <i className="fas fa-info-circle mr-1"></i>
              À propos
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Link to="/candidat/notification">
                <button className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative">
                  <i className="fas fa-bell text-lg"></i>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center notification-pulse">3</span>
                </button>
              </Link>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
                <div className="h-8 w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                </div>
                <span className="hidden xl:inline">{getUserFullName()}</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/candidat/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-user mr-2"></i>Mon profil
                  </Link>
                  <Link to="/candidat/editer-profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-edit mr-2"></i>Modifier mon profil
                  </Link>
                  <Link to="/candidat/postuler" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-paper-plane mr-2"></i>Postuler
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link to="/candidat/parametre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-cog mr-2"></i>Paramètres
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile User Menu */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
            {/* Mobile Notifications */}
            <Link to="/candidat/notification">
              <button className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative touch-target">
                <i className="fas fa-bell"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </button>
            </Link>
            
            {/* Mobile Profile */}
            <button onClick={toggleUserMenu} className="flex items-center space-x-1 text-gray-700 hover:text-fuchsia-600 p-1 rounded-md transition duration-200 touch-target">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-fuchsia-600 flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">{getUserInitials()}</span>
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
          <Link to="/candidat/profil" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-user mr-2"></i>Mon profil
          </Link>
          <Link to="/candidat/editer-profil" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-edit mr-2"></i>Modifier mon profil
          </Link>
          <Link to="/candidat/postuler" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-paper-plane mr-2"></i>Postuler
          </Link>
          <Link to="/candidat/parametre" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-cog mr-2"></i>Paramètres
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden mobile-menu-slide bg-white border-t border-gray-200 ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          {/* Tableau de bord */}
          <Link to="/candidat" className={`flex items-center px-3 py-2 text-sm rounded-md ${
            isActiveLink('/candidat') && !location.pathname.includes('/candidat/') 
              ? 'text-fuchsia-600 bg-fuchsia-50' 
              : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
          }`}>
            <i className="fas fa-tachometer-alt mr-2"></i>
            Tableau de bord
          </Link>
          
          {/* Emplois */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-offers')} className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md ${
              location.pathname.includes('/candidat/offre') || location.pathname.includes('/jobs')
                ? 'text-fuchsia-600 bg-fuchsia-50' 
                : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
            }`}>
              <span><i className="fas fa-briefcase mr-2"></i>Emplois</span>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffersOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffersOpen ? 'show' : ''}`}>
              <Link to="/candidat/offre" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-search mr-2"></i>Rechercher des emplois
              </Link>
              <Link to="/candidat/candidature-recente" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-clock mr-2"></i>Candidatures récentes
              </Link>
              <Link to="/candidat/offres" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-external-link-alt mr-2"></i>Toutes les offres
              </Link>
            </div>
          </div>

          {/* Financements */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-opportunities')} className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md ${
              location.pathname.includes('/candidat/finacement') || location.pathname.includes('/financements')
                ? 'text-fuchsia-600 bg-fuchsia-50' 
                : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
            }`}>
              <span><i className="fas fa-money-bill-wave mr-2"></i>Financements</span>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOpportunitiesOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOpportunitiesOpen ? 'show' : ''}`}>
              <Link to="/candidat/finacement" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-search mr-2"></i>Rechercher des financements
              </Link>
              <Link to="/financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-external-link-alt mr-2"></i>Tous les financements
              </Link>
            </div>
          </div>

          {/* Bourses */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-profile')} className={`w-full flex justify-between items-center px-3 py-2 text-sm rounded-md ${
              location.pathname.includes('/candidat/bourse') || location.pathname.includes('/bourses')
                ? 'text-fuchsia-600 bg-fuchsia-50' 
                : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
            }`}>
              <span><i className="fas fa-graduation-cap mr-2"></i>Bourses</span>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileProfileOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileProfileOpen ? 'show' : ''}`}>
              <Link to="/candidat/bourse" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-search mr-2"></i>Rechercher des bourses
              </Link>
              <Link to="/candidat/bourse" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-external-link-alt mr-2"></i>Toutes les bourses
              </Link>
            </div>
          </div>
          
          {/* Formations */}
          <Link to="/formations" className={`flex items-center px-3 py-2 text-sm rounded-md ${
            location.pathname.includes('/formations') 
              ? 'text-fuchsia-600 bg-fuchsia-50' 
              : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
          }`}>
            <i className="fas fa-chalkboard-teacher mr-2"></i>
            Formations
          </Link>

          {/* À propos */}
          <Link to="/a-propos" className={`flex items-center px-3 py-2 text-sm rounded-md ${
            location.pathname.includes('/a-propos') 
              ? 'text-fuchsia-600 bg-fuchsia-50' 
              : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
          }`}>
            <i className="fas fa-info-circle mr-2"></i>
            À propos
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CandidatHeader;
