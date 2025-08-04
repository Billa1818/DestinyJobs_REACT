import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrestataireHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileConsultationsOpen, setMobileConsultationsOpen] = useState(false);
  const location = useLocation();

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileConsultationsOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileDropdown = (menuId) => {
    if (menuId === 'mobile-consultations') {
      setMobileConsultationsOpen(!mobileConsultationsOpen);
    }
  };

  // Générer les initiales de l'utilisateur
  const getUserInitials = () => {
    console.log('PrestataireHeader - getUserInitials - user:', user);
    if (user?.firstName && user?.lastName) {
      const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      console.log('PrestataireHeader - getUserInitials - initials:', initials);
      return initials;
    }
    const fallback = user?.firstName?.charAt(0)?.toUpperCase() || 'U';
    console.log('PrestataireHeader - getUserInitials - fallback:', fallback);
    return fallback;
  };

  // Obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    console.log('PrestataireHeader - getUserFullName - user:', user);
    if (user?.firstName && user?.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`;
      console.log('PrestataireHeader - getUserFullName - fullName:', fullName);
      return fullName;
    }
    const fallback = user?.firstName || user?.email || 'Utilisateur';
    console.log('PrestataireHeader - getUserFullName - fallback:', fallback);
    return fallback;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log('PrestataireHeader - user:', user);
  console.log('PrestataireHeader - getUserFullName():', getUserFullName());
  console.log('PrestataireHeader - getUserInitials():', getUserInitials());

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-3 lg:py-4">
          {/* Logo */}
          <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
            <Link to="/prestataire">
              <img src="/vite.svg" alt="Destiny Jobs" className="h-10 w-10 xs:h-16 xs:w-16 sm:h-20 sm:w-20" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-4 2xl:space-x-6">
            <Link to="/prestataire" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Tableau de bord
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                Consultations <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                              <div className="py-1">
                <Link to="/prestataire/consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Parcourir</Link>
                <Link to="/prestataire/demandes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Mes candidatures</Link>
                <Link to="/prestataire/favoris" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Favoris</Link>
              </div>
              </div>
            </div>
            <Link to="/prestataire/services" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Mon Portfolio
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              Blog
            </Link>
            <Link to="/a-propos" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
              À propos
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Link to="/prestataire/notifications" className="text-gray-600 hover:text-orange-600 p-2 rounded-full transition duration-200 relative">
                <i className="fas fa-bell text-lg"></i>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center notification-pulse">2</span>
              </Link>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                </div>
                <span className="hidden xl:inline">{getUserFullName()}</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/prestataire/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <i className="fas fa-user mr-2"></i>Mon profil
                  </Link>
                  <Link to="/prestataire/services" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <i className="fas fa-briefcase mr-2"></i>Mon portfolio
                  </Link>
                  
                  <Link to="/prestataire/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
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
            <Link to="/prestataire/notifications" className="text-gray-600 hover:text-orange-600 p-2 rounded-full transition duration-200 relative touch-target">
              <i className="fas fa-bell"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">2</span>
            </Link>
            
            {/* Mobile Profile */}
            <button onClick={toggleUserMenu} className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 p-1 rounded-md transition duration-200 touch-target">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-xs sm:text-sm font-medium">{getUserInitials()}</span>
              </div>
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex-shrink-0 ml-1 sm:ml-2">
            <button type="button" className="text-gray-700 hover:text-orange-600 focus:outline-none focus:text-orange-600 p-2 touch-target" onClick={toggleMobileMenu}>
              <i className="fas fa-bars text-base sm:text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile User Menu */}
      <div className={`lg:hidden mobile-menu-slide bg-white border-t border-gray-200 ${userMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          <Link to="/prestataire/profile" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            <i className="fas fa-user mr-2"></i>Mon profil
          </Link>
          <Link to="/prestataire/services" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            <i className="fas fa-briefcase mr-2"></i>Mon portfolio
          </Link>

          <Link to="/prestataire/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
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
          <Link to="/prestataire" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Tableau de bord
          </Link>
          
          {/* Mobile dropdown for "Consultations" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-consultations')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
              Consultations
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileConsultationsOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileConsultationsOpen ? 'show' : ''}`}>
              <Link to="/prestataire/consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md">Parcourir</Link>
              <Link to="/prestataire/demandes" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md">Mes candidatures</Link>
              <Link to="/prestataire/favoris" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md">Favoris</Link>
            </div>
          </div>
          
          <Link to="/prestataire/services" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Mon Portfolio
          </Link>
          <Link to="/prestataire/offres-prestation" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Offres de prestation
          </Link>
          <Link to="/blog" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            Blog
          </Link>
          <Link to="/a-propos" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
            À propos
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PrestataireHeader;
