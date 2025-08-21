import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';
import CandidatNotificationService from '../../services/CandidatNotificationService';

const CandidatHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);
  const [mobileOpportunitiesOpen, setMobileOpportunitiesOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    if (user) {
      setLoading(false);
      // Récupérer le profil candidat pour la photo
      fetchCandidateProfile();
      // Récupérer le compteur de notifications
      fetchNotificationCount();
    }
  }, [user]);

  // Auto-refresh des notifications toutes les 30 secondes
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchNotificationCount();
      }, 30000); // 30 secondes

      return () => clearInterval(interval);
    }
  }, [user]);

  // Fonction pour corriger l'URL de l'image
  const getCorrectImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // Si l'URL est déjà complète avec http://localhost:8000, la retourner telle quelle
    if (imageUrl.startsWith('http://localhost:8000')) {
      return imageUrl;
    }
    
    // Si c'est une URL relative (commence par /media/), ajouter le base URL
    if (imageUrl.startsWith('/media/')) {
      return `http://localhost:8000${imageUrl}`;
    }
    
    // Si c'est juste le nom du fichier, construire l'URL complète
    if (imageUrl.includes('.')) {
      return `http://localhost:8000/media/candidates/images/${imageUrl}`;
    }
    
    return imageUrl;
  };

  // Récupérer le profil candidat
  const fetchCandidateProfile = async () => {
    try {
      const profile = await profileService.getCandidateProfile();
      setCandidateProfile(profile);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil candidat:', error);
    }
  };

  // Récupérer le compteur de notifications
  const fetchNotificationCount = async () => {
    try {
      setLoadingNotifications(true);
      const stats = await CandidatNotificationService.getNotificationStats();
      setNotificationCount(stats.unread || 0);
      console.log('📊 Notifications non lues:', stats.unread);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      // En cas d'erreur, on garde le compteur à 0
      setNotificationCount(0);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Composant Avatar qui affiche soit la photo, soit les initiales
  const Avatar = ({ size = 'h-8 w-8', className = '' }) => {
    const imageUrl = getCorrectImageUrl(candidateProfile?.image);
    
    if (imageUrl) {
      return (
        <img 
          src={imageUrl} 
          alt="Photo de profil" 
          className={`${size} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
        />
      );
    }
    
    return (
      <div className={`${size} rounded-full bg-fuchsia-600 flex items-center justify-center ${className}`}>
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <span className="text-white text-sm font-medium">{getUserInitials()}</span>
        )}
      </div>
    );
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await logout();
      // Rediriger vers la page de connexion après déconnexion
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Rediriger quand même vers la page de connexion
      navigate('/login');
    }
  };

  // Générer les initiales de l'utilisateur
  const getUserInitials = () => {
    if (!user) return 'DJ';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }
    return 'DJ';
  };

  // Obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    if (!user) return 'DJ';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    return user.username || 'DJ';
  };

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileOffersOpen(false);
    setMobileOpportunitiesOpen(false);
    setMobileProfileOpen(false);
    
    // Rafraîchir le profil candidat pour mettre à jour la photo
    if (user) {
      fetchCandidateProfile();
    }
  }, [location, user]);

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
                  <Link to="/candidat/emploi-candidature" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-clock mr-2"></i>Mes candidatures emploi
                  </Link>
                  <Link to="/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
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
                Financements  de projets<i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/candidat/financement-candidature" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-clock mr-2"></i>Mes candidatures emploi
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
                Bourses d'études <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/bourses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
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

            {/* Blog */}
            <Link 
              to="/blog" 
              className={`px-2 py-2 rounded-md text-sm font-medium transition duration-200 ${
                location.pathname.includes('/blog') 
                  ? 'text-fuchsia-600 bg-fuchsia-50' 
                  : 'text-gray-700 hover:text-fuchsia-600'
              }`}
            >
              <i className="fas fa-blog mr-1"></i>
              Blog
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Link to="/candidat/notification">
                <button className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative">
                  <i className="fas fa-bell text-lg"></i>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center notification-pulse">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
                <Avatar size="h-8 w-8" />
                <span className="hidden xl:inline">
                  {loading ? 'Chargement...' : getUserFullName()}
                </span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                    <div className="font-medium">{getUserFullName()}</div>
                    <div className="text-xs text-gray-400">{user?.email || ''}</div>
                  </div>
                  <Link to="/candidat/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-user mr-2"></i>Mon profil
                  </Link>
                  <Link to="/candidat/editer-profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-edit mr-2"></i>Modifier mon profil
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link to="/candidat/parametre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-cog mr-2"></i>Paramètres
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-800"
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
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
            </Link>
            
            {/* Mobile Profile */}
            <button onClick={toggleUserMenu} className="flex items-center space-x-1 text-gray-700 hover:text-fuchsia-600 p-1 rounded-md transition duration-200 touch-target">
              <Avatar size="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="hidden sm:inline text-sm font-medium">
                {loading ? 'Chargement...' : getUserFullName()}
              </span>
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
          {/* User Info Header */}
          <div className="px-3 py-3 bg-gray-50 rounded-md mb-2">
            <div className="flex items-center space-x-3">
              <Avatar size="h-10 w-10" />
              <div>
                <div className="font-medium text-gray-900">
                  {loading ? 'Chargement...' : getUserFullName()}
                </div>
                <div className="text-xs text-gray-400">
                  {user?.email || ''}
                </div>
              </div>
            </div>
          </div>
          
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
            className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
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
              <Link to="/candidat/emploi-candidature" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-clock mr-2"></i>Mes candidatures emploi
              </Link>
              <Link to="/jobs" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
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
              <span><i className="fas fa-money-bill-wave mr-2"></i>Financements de projets</span>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOpportunitiesOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOpportunitiesOpen ? 'show' : ''}`}>
              <Link to="/candidat/financement-candidature" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-clock mr-2"></i>Mes candidatures emploi
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
              <span><i className="fas fa-graduation-cap mr-2"></i>Bourses d'études</span>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileProfileOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileProfileOpen ? 'show' : ''}`}>
              <Link to="/bourses" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
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

          {/* Blog */}
          <Link to="/blog" className={`flex items-center px-3 py-2 text-sm rounded-md ${
            location.pathname.includes('/blog') 
              ? 'text-fuchsia-600 bg-fuchsia-50' 
              : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
          }`}>
            <i className="fas fa-blog mr-2"></i>
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CandidatHeader;
