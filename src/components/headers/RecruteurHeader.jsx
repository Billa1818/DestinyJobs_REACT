import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const RecruteurHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalOffers: 0,
    totalApplications: 0,
    unreadNotifications: 0
  });
  const location = useLocation();

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Charger les données dynamiques
  useEffect(() => {
    const fetchHeaderData = async () => {
      if (user) {
        try {
          // Récupérer les notifications non lues
          const userNotifications = await dataService.getUserNotifications(user.id);
          const unreadNotifications = userNotifications.filter(n => !n.isRead);
          setNotifications(unreadNotifications);

          // Récupérer les statistiques
          const offers = await dataService.getOffers({ recruiterId: user.id });
          const applications = await dataService.getReceivedApplications(user.id);
          
          setStats({
            totalOffers: offers.length,
            totalApplications: applications.length,
            unreadNotifications: unreadNotifications.length
          });
        } catch (error) {
          console.error('Erreur lors du chargement des données du header:', error);
        }
      }
    };

    fetchHeaderData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Générer les initiales de l'utilisateur
  const getUserInitials = () => {
    console.log('RecruteurHeader - getUserInitials - user:', user);
    if (user?.firstName && user?.lastName) {
      const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
      console.log('RecruteurHeader - getUserInitials - initials:', initials);
      return initials;
    }
    const fallback = user?.firstName?.charAt(0)?.toUpperCase() || 'U';
    console.log('RecruteurHeader - getUserInitials - fallback:', fallback);
    return fallback;
  };

  // Obtenir le nom complet de l'utilisateur
  const getUserFullName = () => {
    console.log('RecruteurHeader - getUserFullName - user:', user);
    if (user?.firstName && user?.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`;
      console.log('RecruteurHeader - getUserFullName - fullName:', fullName);
      return fullName;
    }
    const fallback = user?.firstName || user?.email || 'Utilisateur';
    console.log('RecruteurHeader - getUserFullName - fallback:', fallback);
    return fallback;
  };

  // Obtenir le nom de l'entreprise
  const getCompanyName = () => {
    console.log('RecruteurHeader - getCompanyName - user:', user);
    const companyName = user?.profile?.company || 'Entreprise non définie';
    console.log('RecruteurHeader - getCompanyName - companyName:', companyName);
    return companyName;
  };

  console.log('RecruteurHeader - user:', user);
  console.log('RecruteurHeader - getUserFullName():', getUserFullName());
  console.log('RecruteurHeader - getUserInitials():', getUserInitials());
  console.log('RecruteurHeader - getCompanyName():', getCompanyName());

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et Navigation principale */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/recruteur" className="flex items-center space-x-2">
              <img src="/vite.svg" alt="Destiny Jobs" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-900">Destiny Jobs</span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                to="/home" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
              >
                <i className="fas fa-home mr-2"></i>
                Accueil
              </Link>

              <Link 
                to="/recruteur" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/recruteur' 
                    ? 'bg-fuchsia-100 text-fuchsia-700' 
                    : 'text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50'
                }`}
              >
                <i className="fas fa-tachometer-alt mr-2"></i>
                Dashboard
              </Link>

              {/* Menu Créer */}
              <div className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors">
                  <i className="fas fa-plus mr-2"></i>
                  Créer
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <Link to="/recruteur/creer-offre" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-briefcase mr-3 text-fuchsia-600"></i>
                      Offre d'emploi
                    </Link>
                    <Link to="/recruteur/creer-financement" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-money-bill mr-3 text-green-600"></i>
                      Financement
                    </Link>
                    <Link to="/recruteur/creer-consultation" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-handshake mr-3 text-blue-600"></i>
                      Consultation
                    </Link>
                    <Link to="/recruteur/creer-bourse" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-graduation-cap mr-3 text-purple-600"></i>
                      Bourse
                    </Link>
                  </div>
                </div>
              </div>

              {/* Menu Gérer */}
              <div className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors">
                  <i className="fas fa-cog mr-2"></i>
                  Gérer
                  {stats.totalOffers > 0 && (
                    <span className="ml-2 bg-fuchsia-600 text-white text-xs rounded-full px-2 py-1">
                      {stats.totalOffers}
                    </span>
                  )}
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <Link to="/recruteur/gestion-offres" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-briefcase mr-3 text-fuchsia-600"></i>
                      Offres d'emploi
                    </Link>
                    <Link to="/recruteur/gestion-financements" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-money-bill mr-3 text-green-600"></i>
                      Financements
                    </Link>
                    <Link to="/recruteur/gestion-consultations" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-handshake mr-3 text-blue-600"></i>
                      Consultations
                    </Link>
                    <Link to="/recruteur/gestion-bourses" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-graduation-cap mr-3 text-purple-600"></i>
                      Bourses
                    </Link>
                  </div>
                </div>
              </div>

              {/* Menu Candidatures */}
              <div className="relative group">
                <button className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors">
                  <i className="fas fa-users mr-2"></i>
                  Candidatures
                  {stats.totalApplications > 0 && (
                    <span className="ml-2 bg-green-600 text-white text-xs rounded-full px-2 py-1">
                      {stats.totalApplications}
                    </span>
                  )}
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <Link to="/recruteur/postulations-offres" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-briefcase mr-3 text-fuchsia-600"></i>
                      Candidatures emploi
                    </Link>
                    <Link to="/recruteur/postulations-financements" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-money-bill mr-3 text-green-600"></i>
                      Demandes financement
                    </Link>
                    <Link to="/recruteur/postulations-consultations" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-handshake mr-3 text-blue-600"></i>
                      Propositions consultation
                    </Link>
                    <Link to="/recruteur/postulations-bourses" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-graduation-cap mr-3 text-purple-600"></i>
                      Candidatures bourse
                    </Link>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <Link 
                to="/recruteur/messagerie" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
              >
                <i className="fas fa-envelope mr-2"></i>
                Messages
              </Link>

              {/* Statistiques */}
              <Link 
                to="/recruteur/statistiques" 
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 transition-colors"
              >
                <i className="fas fa-chart-line mr-2"></i>
                Statistiques
              </Link>
            </nav>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <Link 
                to="/recruteur/notifications"
                className="p-2 text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md transition-colors"
              >
                <i className="fas fa-bell"></i>
                {stats.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.unreadNotifications}
                  </span>
                )}
              </Link>
            </div>

            {/* Menu utilisateur */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-fuchsia-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900">{getUserFullName()}</p>
                </div>
                <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
              </button>

              {/* Dropdown menu utilisateur */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getUserFullName()}</p>
                      <p className="text-xs text-gray-500">{getCompanyName()}</p>
                    </div>
                    <Link to="/recruteur/profil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-user mr-3"></i>
                      Mon profil
                    </Link>
                    <Link to="/recruteur/parametres" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                      <i className="fas fa-cog mr-3"></i>
                      Paramètres
                    </Link>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                      >
                        <i className="fas fa-sign-out-alt mr-3"></i>
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menu mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-fuchsia-600 hover:bg-fuchsia-50 rounded-md transition-colors"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link 
                to="/home" 
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600 rounded-md"
              >
                <i className="fas fa-home mr-3"></i>
                Accueil
              </Link>

              <Link 
                to="/recruteur" 
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600 rounded-md"
              >
                <i className="fas fa-tachometer-alt mr-3"></i>
                Dashboard
              </Link>
              
              <div className="px-4 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Créer</p>
                <div className="space-y-1 ml-4">
                  <Link to="/recruteur/creer-offre" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-briefcase mr-3 text-fuchsia-600"></i>
                    Offre d'emploi
                  </Link>
                  <Link to="/recruteur/creer-financement" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-money-bill mr-3 text-green-600"></i>
                    Financement
                  </Link>
                  <Link to="/recruteur/creer-consultation" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-handshake mr-3 text-blue-600"></i>
                    Consultation
                  </Link>
                  <Link to="/recruteur/creer-bourse" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-graduation-cap mr-3 text-purple-600"></i>
                    Bourse
                  </Link>
                </div>
              </div>

              <div className="px-4 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Gérer</p>
                <div className="space-y-1 ml-4">
                  <Link to="/recruteur/gestion-offres" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-briefcase mr-3 text-fuchsia-600"></i>
                    Offres d'emploi
                  </Link>
                  <Link to="/recruteur/gestion-financements" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-money-bill mr-3 text-green-600"></i>
                    Financements
                  </Link>
                  <Link to="/recruteur/gestion-consultations" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-handshake mr-3 text-blue-600"></i>
                    Consultations
                  </Link>
                  <Link to="/recruteur/gestion-bourses" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-graduation-cap mr-3 text-purple-600"></i>
                    Bourses
                  </Link>
                </div>
              </div>

              <div className="px-4 py-2">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Candidatures</p>
                <div className="space-y-1 ml-4">
                  <Link to="/recruteur/postulations-offres" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-briefcase mr-3 text-fuchsia-600"></i>
                    Candidatures emploi
                  </Link>
                  <Link to="/recruteur/postulations-financements" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-money-bill mr-3 text-green-600"></i>
                    Demandes financement
                  </Link>
                  <Link to="/recruteur/postulations-consultations" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-handshake mr-3 text-blue-600"></i>
                    Propositions consultation
                  </Link>
                  <Link to="/recruteur/postulations-bourses" className="flex items-center py-2 text-sm text-gray-700 hover:text-fuchsia-600">
                    <i className="fas fa-graduation-cap mr-3 text-purple-600"></i>
                    Candidatures bourse
                  </Link>
                </div>
              </div>

              <Link to="/recruteur/messagerie" className="flex items-center px-4 py-2 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                <i className="fas fa-envelope mr-3"></i>
                Messages
              </Link>

              <Link to="/recruteur/statistiques" className="flex items-center px-4 py-2 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                <i className="fas fa-chart-line mr-3"></i>
                Statistiques
              </Link>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <Link to="/recruteur/profil" className="flex items-center px-4 py-2 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                  <i className="fas fa-user mr-3"></i>
                  Mon profil
                </Link>
                <Link to="/recruteur/parametres" className="flex items-center px-4 py-2 text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600">
                  <i className="fas fa-cog mr-3"></i>
                  Paramètres
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-red-700 hover:bg-red-50"
                >
                  <i className="fas fa-sign-out-alt mr-3"></i>
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default RecruteurHeader;
