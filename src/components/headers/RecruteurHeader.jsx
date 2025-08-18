import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';
import RecruteurNotificationService from '../../services/RecruteurNotificationService';
import authService from '../../services/authService';

const RecruteurHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOffersOpen, setMobileOffersOpen] = useState(false);
  const [mobileManageOpen, setMobileManageOpen] = useState(false);
  const [mobileOffresOpen, setMobileOffresOpen] = useState(false);
  const [mobileCandidatureOpen, setMobileCandidatureOpen] = useState(false);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Récupérer les données du profil recruteur et utilisateur
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (isAuthenticated && user) {
          console.log('🔐 Utilisateur connecté:', {
            id: user.id,
            username: user.username,
            user_type: user.user_type
          });
          
          // Récupérer le profil utilisateur de base
          const userData = await profileService.getProfile();
          setUserProfile(userData);
          
          // Récupérer le profil recruteur complet
          const recruiterData = await profileService.getRecruiterProfile();
          setRecruiterProfile(recruiterData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, user]);

  // Test alternatif avec le service existant
  const testNotificationService = async () => {
    try {
      console.log('🧪 Test du service de notifications...');
      const stats = await RecruteurNotificationService.getNotificationStats();
      console.log('✅ Service service retourne:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Service service échoue:', error);
      return null;
    }
  };

  // Récupérer le compteur de notifications non lues
  const fetchNotificationCount = async () => {
    try {
      if (isAuthenticated && user) {
        console.log('🔔 Chargement du compteur de notifications...');
        console.log('👤 Utilisateur connecté:', { id: user.id, username: user.username });
        
        // Récupérer le token depuis le service d'authentification
        const accessToken = authService.getAccessToken();
        console.log('🔑 Token récupéré:', accessToken ? 'Présent' : 'Absent');
        
        if (!accessToken) {
          console.error('❌ Aucun token d\'accès disponible');
          setNotificationCount(0);
          return;
        }
        
        // Test 1: Service existant (qui utilise le bon token via api.js)
        console.log('🧪 Test 1: Service existant');
        try {
          const serviceStats = await RecruteurNotificationService.getNotificationStats();
          console.log('✅ Service service retourne:', serviceStats);
          
          const unreadCount = serviceStats.unread_count || serviceStats.unread || serviceStats.count || 0;
          console.log('🔢 Compteur non lues trouvé:', unreadCount);
          
          setNotificationCount(unreadCount);
          return; // Utiliser le service si ça marche
        } catch (serviceError) {
          console.log('⚠️ Service échoue, test de l\'API directe...', serviceError);
        }
        

        
        console.log('🌐 Réponse brute de l\'API:', response);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.log('🔄 Token expiré, tentative de rafraîchissement...');
            try {
              await authService.refreshToken();
              const newToken = authService.getAccessToken();
              if (newToken) {
                console.log('✅ Token rafraîchi, nouvelle tentative...');
                // Réessayer avec le nouveau token
                return fetchNotificationCount();
              }
            } catch (refreshError) {
              console.error('❌ Échec du rafraîchissement du token:', refreshError);
            }
          }
          
          console.error('❌ Erreur HTTP:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('📄 Contenu de l\'erreur:', errorText);
          setNotificationCount(0);
          return;
        }
        
        const rawData = await response.text();
        console.log('📄 Données brutes reçues:', rawData);
        
        let apiStats;
        try {
          apiStats = JSON.parse(rawData);
        } catch (parseError) {
          console.error('❌ Erreur de parsing JSON:', parseError);
          setNotificationCount(0);
          return;
        }
        
        console.log('📊 Stats API directe:', apiStats);
        
        // Utiliser le résultat de l'API directe
        const unreadCount = apiStats.unread_count || apiStats.unread || apiStats.count || 0;
        console.log('🔢 Compteur non lues final:', unreadCount);
        console.log('🔍 Clés disponibles dans stats API:', Object.keys(apiStats));
        
        setNotificationCount(unreadCount);
        
        // Forcer le re-render
        setNotificationCount(prev => {
          console.log('🔄 Mise à jour du compteur:', { prev, new: unreadCount });
          return unreadCount;
        });
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement du compteur de notifications:', error);
      console.error('📋 Détails de l\'erreur:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      setNotificationCount(0);
    }
  };

  // Rafraîchir le compteur quand on revient de la page notifications
  const refreshNotificationCount = () => {
    if (isAuthenticated && user) {
      fetchNotificationCount();
    }
  };

  // Charger le compteur de notifications au montage et rafraîchir toutes les 30 secondes
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotificationCount();
      
      // Rafraîchir le compteur toutes les 30 secondes
      const interval = setInterval(fetchNotificationCount, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, user]);

  // Rafraîchir le compteur quand on change de route (pour les notifications marquées comme lues)
  useEffect(() => {
    if (location.pathname === '/recruteur/notifications') {
      // Attendre un peu que la page se charge puis rafraîchir
      const timeoutId = setTimeout(refreshNotificationCount, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [location.pathname]);

  // Fonction pour corriger l'URL de l'image
  const getCorrectImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:8000${imageUrl}`;
  };

  // Fonction pour obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    }
    if (userProfile?.first_name) return userProfile.first_name;
    if (userProfile?.last_name) return userProfile.last_name;
    return userProfile?.username || 'Utilisateur';
  };

  // Fonction pour obtenir les initiales
  const getUserInitials = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name.charAt(0)}${userProfile.last_name.charAt(0)}`.toUpperCase();
    }
    if (userProfile?.first_name) return userProfile.first_name.charAt(0).toUpperCase();
    if (userProfile?.last_name) return userProfile.last_name.charAt(0).toUpperCase();
    return userProfile?.username?.charAt(0).toUpperCase() || 'U';
  };

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileOffersOpen(false);
    setMobileManageOpen(false);
    setMobileOffresOpen(false);
    setMobileCandidatureOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileDropdown = (menuId) => {
    if (menuId === 'mobile-offres') {
      setMobileOffresOpen(!mobileOffresOpen);
      setMobileOffersOpen(false);
      setMobileManageOpen(false);
      setMobileCandidatureOpen(false);
    } else if (menuId === 'mobile-offers') {
      setMobileOffersOpen(!mobileOffersOpen);
      setMobileOffresOpen(false);
      setMobileManageOpen(false);
      setMobileCandidatureOpen(false);
    } else if (menuId === 'mobile-manage') {
      setMobileManageOpen(!mobileManageOpen);
      setMobileOffresOpen(false);
      setMobileOffersOpen(false);
      setMobileCandidatureOpen(false);
    } else if (menuId === 'mobile-candidature') {
      setMobileCandidatureOpen(!mobileCandidatureOpen);
      setMobileOffresOpen(false);
      setMobileOffersOpen(false);
      setMobileManageOpen(false);
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
            <Link to="/recruteur" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
              <i className="fas fa-chart-bar mr-2"></i>
              Tableau de bord
            </Link>
            
            {/* Offres Dropdown - Consulter les offres publiques */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                <i className="fas fa-search mr-2"></i>
                Offres <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/jobs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-briefcase mr-2"></i>Emplois/Jobs
                  </Link>
                  <Link to="/bourses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-graduation-cap mr-2"></i>Bourses d'études
                  </Link>
                  <Link to="/financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-money-bill-wave mr-2"></i>Financements de projets
                  </Link>
                  <Link to="/consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-comments mr-2"></i>Consultations
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Créer une offre Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                <i className="fas fa-plus-circle mr-2"></i>
                Créer <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/creer-offre" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-briefcase mr-2"></i>Emplois/Jobs
                  </Link>
                  <Link to="/recruteur/creer-financement" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-money-bill-wave mr-2"></i>Financements de projets
                  </Link>
                  <Link to="/recruteur/creer-consultation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-comments mr-2"></i>Consultations
                  </Link>
                  <Link to="/recruteur/creer-bourse" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-graduation-cap mr-2"></i>Bourses d'études
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Gestion Offres Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                <i className="fas fa-cogs mr-2"></i>
                Gérer <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/gestion-offres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-briefcase mr-2"></i>Emplois/Jobs
                  </Link>
                  <Link to="/recruteur/gestion-bourses" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-graduation-cap mr-2"></i>Bourses d'études
                  </Link>
                  <Link to="/recruteur/gestion-financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-money-bill-wave mr-2"></i>Financements de projets
                  </Link>
                  <Link to="/recruteur/gestion-consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-comments mr-2"></i>Consultations
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
                <i className="fas fa-users mr-2"></i>
                Candidature <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className="dropdown-menu absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/postulations-offres" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-briefcase mr-2"></i>Offres d'emploi
                  </Link>
                  <Link to="/recruteur/postulations-financements" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-money-bill-wave mr-2"></i>Financement
                  </Link>
                  <Link to="/recruteur/postulations-consultations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-comments mr-2"></i>Consultation
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/blog" className="text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200 flex items-center">
              <i className="fas fa-newspaper mr-2"></i>
              Blog
            </Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
            {/* Notifications */}
            <div className="relative">
              <Link to="/recruteur/notifications" className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative group">
                <i className="fas fa-bell text-lg group-hover:scale-110 transition-transform"></i>
                {/* Badge bleu avec le nombre de notifications - affiché seulement s'il y a des notifications non lues */}
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 font-bold shadow-lg">
                    {notificationCount}
                  </span>
                )}
                <span className="sr-only">
                  {notificationCount > 0 ? `${notificationCount} notification${notificationCount > 1 ? 's' : ''} non lue${notificationCount > 1 ? 's' : ''}` : 'Aucune notification'}
                </span>
              </Link>
            </div>
            
            {/* User Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-fuchsia-600 px-2 py-2 rounded-md text-sm font-medium transition duration-200">
                <div className="h-8 w-8 rounded-full bg-fuchsia-600 flex items-center justify-center overflow-hidden">
                  {recruiterProfile?.logo ? (
                    <img
                      src={getCorrectImageUrl(recruiterProfile.logo)}
                      alt="Logo entreprise"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span className={`text-white text-sm font-medium ${recruiterProfile?.logo ? 'hidden' : 'flex'}`}>
                    {getUserInitials()}
                  </span>
                </div>
                <span className="hidden xl:inline">{getUserFullName()}</span>
                <i className="fas fa-chevron-down text-xs"></i>
              </button>
              <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                <div className="py-1">
                  <Link to="/recruteur/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-user mr-2"></i>Mon profil
                  </Link>
                  <Link to={`/entreprise/${user?.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-building mr-2"></i>Mon entreprise
                  </Link>
                  <Link to="/recruteur/notifications" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-bell mr-2"></i>Notifications
                  </Link>
                  <Link to="/recruteur/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                    <i className="fas fa-cog mr-2"></i>Paramètres
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button 
                    onClick={async () => {
                      try {
                        await logout();
                        // Redirection sera gérée par le contexte
                      } catch (error) {
                        console.error('Erreur lors de la déconnexion:', error);
                      }
                    }}
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
            <Link to="/recruteur/notifications" className="text-gray-600 hover:text-fuchsia-600 p-2 rounded-full transition duration-200 relative touch-target">
              <i className="fas fa-bell"></i>
              {/* Badge bleu avec le nombre de notifications - affiché seulement s'il y a des notifications non lues */}
              {notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 font-bold shadow-lg">
                  {notificationCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Profile */}
            <button onClick={toggleUserMenu} className="flex items-center space-x-1 text-gray-700 hover:text-fuchsia-600 p-1 rounded-md transition duration-200 touch-target">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-fuchsia-600 flex items-center justify-center overflow-hidden">
                {recruiterProfile?.logo ? (
                  <img
                    src={getCorrectImageUrl(recruiterProfile.logo)}
                    alt="Logo entreprise"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span className={`text-white text-xs sm:text-sm font-medium ${recruiterProfile?.logo ? 'hidden' : 'flex'}`}>
                  {getUserInitials()}
                </span>
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
          <Link to={`/entreprise/${user?.id}`} className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-building mr-2"></i>Mon entreprise
          </Link>
          <Link to="/recruteur/notifications" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-bell mr-2"></i>Notifications
          </Link>
          <Link to="/recruteur/settings" className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
            <i className="fas fa-cog mr-2"></i>Paramètres
          </Link>
          <button 
            onClick={async () => {
              try {
                await logout();
                // Redirection sera gérée par le contexte
              } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
              }
            }}
            className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`xl:hidden mobile-menu-slide bg-white border-t border-gray-200 ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="px-2 py-2 space-y-1">
          <Link to="/recruteur" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md flex items-center">
            <i className="fas fa-chart-bar mr-2"></i>
            Tableau de bord
          </Link>
          
          {/* Notifications - Mobile */}
          <Link to="/recruteur/notifications" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md relative">
            <i className="fas fa-bell mr-2"></i>Notifications
            {/* Badge bleu avec le nombre de notifications - affiché seulement s'il y a des notifications non lues */}
            {notificationCount > 0 && (
              <span className="absolute top-2 right-3 bg-blue-500 text-white text-xs rounded-full px-2 py-1 font-bold">
                {notificationCount}
              </span>
            )}
          </Link>
          
          {/* Mobile dropdown for "Offres" - Consulter les offres publiques */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-offres')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              <div className="flex items-center">
                <i className="fas fa-search mr-2"></i>
                Offres
              </div>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffresOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffresOpen ? 'show' : ''}`}>
              <Link to="/jobs" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-briefcase mr-2"></i>Emplois/Jobs
              </Link>
              <Link to="/bourses" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-graduation-cap mr-2"></i>Bourses d'études
              </Link>
              <Link to="/financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-money-bill-wave mr-2"></i>Financements de projets
              </Link>
              <Link to="/consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-comments mr-2"></i>Consultations
              </Link>
            </div>
          </div>
          
          {/* Mobile dropdown for "Créer une offre" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-offers')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              <div className="flex items-center">
                <i className="fas fa-plus-circle mr-2"></i>
                Créer une offre
              </div>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileOffersOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileOffersOpen ? 'show' : ''}`}>
              <Link to="/recruteur/creer-offre" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Emplois/Jobs</Link>
              <Link to="/recruteur/creer-financement" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Financements de projets</Link>
              <Link to="/recruteur/creer-consultation" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Consultations</Link>
              <Link to="/recruteur/creer-bourse" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Bourses d'études</Link>
            </div>
          </div>

          {/* Mobile dropdown for "Gérer mes offres" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-manage')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              <div className="flex items-center">
                <i className="fas fa-cogs mr-2"></i>
                Gérer mes offres
              </div>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileManageOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileManageOpen ? 'show' : ''}`}>
              <Link to="/recruteur/gestion-offres" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Emplois/Jobs</Link>
              <Link to="/recruteur/gestion-financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Financements de projets</Link>
              <Link to="/recruteur/gestion-consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Consultations</Link>
              <Link to="/recruteur/gestion-bourses" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">Bourses d'études</Link>
            </div>
          </div>
          
          {/* Mobile dropdown for "Candidature" */}
          <div>
            <button onClick={() => toggleMobileDropdown('mobile-candidature')} className="w-full flex justify-between items-center px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
              <div className="flex items-center">
                <i className="fas fa-users mr-2"></i>
                Candidature
              </div>
              <i className={`fas fa-chevron-down text-xs transform transition-transform ${mobileCandidatureOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`mobile-menu-slide ml-4 ${mobileCandidatureOpen ? 'show' : ''}`}>
              <Link to="/recruteur/postulations-offres" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-briefcase mr-2"></i>Offres d'emploi
              </Link>
              <Link to="/recruteur/postulations-financements" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-money-bill-wave mr-2"></i>Financement de projets
              </Link>
              <Link to="/recruteur/postulations-consultations" className="block px-3 py-2 text-sm text-gray-600 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md">
                <i className="fas fa-comments mr-2"></i>Consultation
              </Link>
            </div>
          </div>

          
          <Link to="/blog" className="block px-3 py-2 text-sm text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md flex items-center">
            <i className="fas fa-newspaper mr-2"></i>
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
};

export default RecruteurHeader;
