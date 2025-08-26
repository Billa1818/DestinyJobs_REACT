import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProviderNotificationService from '../../services/ProviderNotificationService';
import ProviderProfilService from '../../services/ProviderProfilService';
import StatistiqueService from '../../services/StatistiqueService';

const PrestataireHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileConsultationsOpen, setMobileConsultationsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();

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

  // Charger les notifications et la photo de profil au montage du composant
  useEffect(() => {
    loadNotifications();
    loadProfileImage();
  }, []);

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      setLoadingNotifications(true);
      const stats = await StatistiqueService.getNotificationStats();
      setNotificationCount(stats.unread || 0);
      console.log('🔔 Notifications chargées:', stats);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      setNotificationCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Charger la photo de profil
  const loadProfileImage = async () => {
    try {
      setLoadingProfile(true);
      
      // Essayer de charger le profil prestataire d'abord
      try {
        const providerProfile = await ProviderProfilService.getProviderProfile();
        if (providerProfile.image) {
          setProfileImage(providerProfile.image);
          return;
        }
      } catch (error) {
        console.log('Profil prestataire non disponible, utilisation du profil utilisateur');
      }
      
      // Si pas de photo dans le profil prestataire, utiliser le profil utilisateur
      if (user && user.social_avatar) {
        setProfileImage(user.social_avatar);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la photo de profil:', error);
      setProfileImage(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Gérer la déconnexion
  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Rediriger quand même
      navigate('/login');
    }
  };

  // Obtenir l'image de profil avec fallback
  const getProfileImage = () => {
    if (profileImage) {
      return profileImage;
    }
    
    // Fallback vers l'avatar avec initiales
    return null;
  };

  // Obtenir les initiales de l'utilisateur
  const getUserInitials = () => {
    if (user) {
      if (user.first_name && user.first_name[0]) {
        return user.first_name[0].toUpperCase();
      }
      if (user.username && user.username[0]) {
        return user.username[0].toUpperCase();
      }
    }
    return 'U';
  };

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
            <Link to="/prestataire" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
              <i className="fas fa-tachometer-alt mr-2"></i>
              Tableau de bord
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                <i className="fas fa-comments mr-2"></i>
                Consultations <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                              <div className="py-1">
                <Link to="/consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                  <i className="fas fa-search mr-2"></i>Parcourir
                </Link>
                <Link to="/prestataire/demandes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                  <i className="fas fa-file-alt mr-2"></i>Mes candidatures
                </Link>
                <Link to="/prestataire/favoris" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                  <i className="fas fa-heart mr-2"></i>Favoris
                </Link>
              </div>
              </div>
            </div>
            <Link to="/prestataire/services" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
              <i className="fas fa-briefcase mr-2"></i>
              Mon Portfolio
            </Link>
            
            <Link to="/formation" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
              <i className="fas fa-graduation-cap mr-2"></i>
              Formation
            </Link>
            
            <Link to="/blog" className="text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
              <i className="fas fa-newspaper mr-2"></i>
              Blog
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Link to="/prestataire/notifications" className="text-gray-600 hover:text-orange-600 p-2 rounded-full transition duration-200 relative">
                <i className="fas fa-bell text-lg"></i>
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center notification-pulse">
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </span>
                )}
              </Link>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center">
                  {getProfileImage() ? (
                    <img
                      src={getProfileImage()}
                      alt="Photo de profil"
                      className="h-full w-full object-cover"
                      onError={() => setProfileImage(null)}
                    />
                  ) : (
                    <span className="text-white text-sm font-medium">
                      {getUserInitials()}
                    </span>
                  )}
                </div>
                <span className="hidden xl:inline">
                  {user ? (user.first_name || user.username || 'Utilisateur') : 'Utilisateur'}
                </span>
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
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
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
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Profile */}
            <button onClick={toggleUserMenu} className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 p-1 rounded-md transition duration-200 touch-target">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full overflow-hidden bg-gradient-to-r from-orange-500 to-purple-600 flex items-center justify-center">
                {getProfileImage() ? (
                  <img
                    src={getProfileImage()}
                    alt="Photo de profil"
                    className="h-full w-full object-cover"
                    onError={() => setProfileImage(null)}
                  />
                ) : (
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {getUserInitials()}
                  </span>
                )}
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
            className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden mobile-menu-slide bg-white border-t border-gray-200 ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          <Link to="/prestataire" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
            <i className="fas fa-tachometer-alt mr-2"></i>
            Tableau de bord
          </Link>
          
          {/* Mobile dropdown for "Consultations" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-consultations')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md">
              <span className="flex items-center">
                <i className="fas fa-comments mr-2"></i>
                Consultations
              </span>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileConsultationsOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileConsultationsOpen ? 'show' : ''}`}>
              <Link to="/consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
                <i className="fas fa-search mr-2"></i>Parcourir
              </Link>
              <Link to="/prestataire/demandes" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
                <i className="fas fa-file-alt mr-2"></i>Mes candidatures
              </Link>
              <Link to="/prestataire/favoris" className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
                <i className="fas fa-heart mr-2"></i>Favoris
              </Link>
            </div>
          </div>
          
          <Link to="/prestataire/services" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
            <i className="fas fa-briefcase mr-2"></i>
            Mon Portfolio
          </Link>
          
          <Link to="/formation" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
            <i className="fas fa-graduation-cap mr-2"></i>
            Formation
          </Link>
          
          <Link to="/prestataire/offres-prestation" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
            <i className="fas fa-handshake mr-2"></i>
            Offres de prestation
          </Link>
          
          <Link to="/blog" className="block px-3 py-2 text-sm text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center">
            <i className="fas fa-newspaper mr-2"></i>
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
};

export default PrestataireHeader;
