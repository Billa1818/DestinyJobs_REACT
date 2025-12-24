import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import prestataireRoutes from '../routers/prestataireRoutes';
import candidatRoutes from '../routers/candidatRoutes';
import recruteurRoutes from '../routers/recruteurRoutes';

const DynamicFooter = ({ accountType: propAccountType = null }) => {
  const { user, isAuthenticated } = useAuth();

  // Détecte automatiquement le type de compte depuis AuthContext
  const detectAccountType = () => {
    if (!isAuthenticated || !user) {
      return 'public'; // Pour les pages publiques (pas connecté)
    }

    const userType = user?.user_type?.toLowerCase();
    if (userType === 'prestataire') return 'prestataire';
    if (userType === 'candidat') return 'candidat';
    if (userType === 'recruteur') return 'recruteur';
    
    return 'public'; // Type inconnu
  };

  const accountType = propAccountType || detectAccountType();

  // Map routes to display labels
  const routeLabels = {
    prestataire: {
      '': 'Tableau de bord',
      'dashboard': 'Tableau de bord',
      'consultation': 'Consultations',
      'consultations': 'Consultations',
      'profile': 'Mon profil',
      'candidatures': 'Mes candidatures',
      'favoris': 'Mes favoris',
      'settings': 'Paramètres',
      'demandes': 'Mes demandes',
      'services': 'Mon portfolio',
      'notifications': 'Notifications',
      'offres-prestation': 'Offres de prestation'
    },
    candidat: {
      '': 'Tableau de bord',
      'dashboard': 'Tableau de bord',
      'profil': 'Mon profil',
      'offre': 'Les offres',
      'detail-offre': 'Détails offre',
      'emploi-candidature': 'Mes candidatures',
      'financement-candidature': 'Financement candidature',
      'editer-profil': 'Éditer profil',
      'postuler': 'Postuler',
      'parametre': 'Paramètres',
      'notification': 'Notifications',
      'finacement': 'Financements',
      'detail-finacement': 'Détails financement',
      'bourse': 'Bourses',
      'detail-bourse': 'Détails bourse',
      'favoris': 'Mes favoris'
    },
    recruteur: {
      '': 'Tableau de bord',
      'dashboard': 'Tableau de bord',
      'profil': 'Mon profil',
      'profil-public': 'Profil public',
      'creer-offre': 'Créer une offre',
      'gestion-offres': 'Gestion des offres',
      'postulations-offres': 'Postulations offres',
      'creer-financement': 'Créer un financement',
      'gestion-financements': 'Gestion financements',
      'postulations-financements': 'Postulations financements',
      'creer-bourse': 'Créer une bourse',
      'gestion-bourses': 'Gestion bourses',
      'postulations-bourses': 'Postulations bourses',
      'creer-consultation': 'Créer consultation',
      'gestion-consultations': 'Gestion consultations',
      'postulations-consultations': 'Postulations consultations',
      'candidatures': 'Candidatures',
      'settings': 'Paramètres',
      'notifications': 'Notifications'
    }
  };

  // Get routes for the account type
  const routesConfig = {
    prestataire: prestataireRoutes,
    candidat: candidatRoutes,
    recruteur: recruteurRoutes,
    public: [] // Pas de routes pour les pages publiques
  };

  const routes = routesConfig[accountType] || [];
  const labels = routeLabels[accountType] || {};

  // Filter routes to display (exclude parametrized routes and debug pages)
  const displayRoutes = routes.filter(route => {
    const path = route.path;
    // Exclude parametrized routes and debug pages
    if (path.includes(':') || path.includes('debug') || path.includes('test-profile') || path.includes('file-preview')) {
      return false;
    }
    return true;
  }).slice(0, 8); // Limit to 8 routes

  // Color configurations per account type
  const colorConfigs = {
    prestataire: {
      icon: 'orange-600',
      text: 'orange-400'
    },
    candidat: {
      icon: 'fuchsia-600',
      text: 'fuchsia-400'
    },
    recruteur: {
      icon: 'fuchsia-600',
      text: 'fuchsia-400'
    },
    public: {
      icon: 'fuchsia-600',
      text: 'fuchsia-400'
    }
  };

  const colors = colorConfigs[accountType] || colorConfigs.public;

  // Éléments communs à tous les footers
  const commonLinks = {
    rapidLinks: [
      { label: 'Emplois', path: '/jobs' },
      { label: 'Formations', path: '/formations' },
      { label: 'Bourses', path: '/bourses' },
      { label: 'Financements', path: '/financements' },
      { label: 'Consultation', path: '/consultation' }
    ],
    services: [
      { label: 'Pour candidats', path: '/candidat' },
      { label: 'Pour recruteurs', path: '/recruteur' },
      { label: 'Pour prestataires', path: '/prestataire' },
      { label: 'Blog', path: '/blog' },
      { label: 'À propos', path: '/a-propos' }
    ]
  };

  // Section du compte actuel (seulement si ce n'est pas une page publique)
  const showAccountSection = accountType !== 'public' && displayRoutes.length > 0;

  // Réorganiser les colonnes en fonction du type de compte
  const getFooterLayout = () => {
    if (accountType === 'public') {
      return { hasAccountSection: false, columnsCount: 'lg:grid-cols-4' };
    }
    return { hasAccountSection: true, columnsCount: 'lg:grid-cols-4' };
  };

  const layout = getFooterLayout();

  return (
    <footer className="bg-gray-900 text-white mt-6 sm:mt-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className={`grid grid-cols-1 xs:grid-cols-2 ${layout.columnsCount} gap-4 sm:gap-6 lg:gap-8`}>
          {/* Company Info */}
          <div className="xs:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
              <div className={`h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10  rounded-lg flex items-center justify-center flex-shrink-0`}>
                <img src="/footer.svg" alt="Destiny Jobs Logo" className="h-3/4 w-3/4 object-contain" />
              </div>
              <span className="ml-1.5 sm:ml-2 text-base xs:text-lg sm:text-xl font-bold">Destiny Jobs</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">Un emploi. Un impact. Une Afrique transformée.</p>
            
            {/* Social Links */}
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200 p-1">
                <i className="fab fa-facebook text-sm xs:text-base sm:text-lg lg:text-xl"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200 p-1">
                <i className="fab fa-linkedin text-sm xs:text-base sm:text-lg lg:text-xl"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200 p-1">
                <i className="fab fa-twitter text-sm xs:text-base sm:text-lg lg:text-xl"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-200 p-1">
                <i className="fab fa-instagram text-sm xs:text-base sm:text-lg lg:text-xl"></i>
              </a>
            </div>
          </div>

          {/* Account-Specific Links - Dynamic Routes */}
          {showAccountSection && (
            <div>
              <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4 capitalize">{accountType}</h3>
              <ul className="space-y-1 sm:space-y-2">
                {displayRoutes.map((route) => {
                  const pathKey = route.path === '' ? '' : route.path.split('/')[0];
                  const label = labels[route.path] || labels[pathKey] || route.path.replace('-', ' ').charAt(0).toUpperCase() + route.path.slice(1);
                  const linkPath = `/${accountType}/${route.path}`.replace(/\/$/, '') || `/${accountType}`;
                  
                  return (
                    <li key={route.path}>
                      <Link
                        to={linkPath}
                        className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base"
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Common Quick Links */}
          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Liens rapides</h3>
            <ul className="space-y-1 sm:space-y-2">
              {commonLinks.rapidLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Common Services */}
          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Services</h3>
            <ul className="space-y-1 sm:space-y-2">
              {commonLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition duration-200 text-xs xs:text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4">Contact</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start">
                <i className={`fas fa-map-marker-alt mt-1 mr-2 text-${colors.text} text-xs sm:text-sm flex-shrink-0`}></i>
                <span className="text-gray-300 text-xs xs:text-sm sm:text-base">Cotonou, Bénin</span>
              </div>
              <div className="flex items-center">
                <i className={`fas fa-phone mr-2 text-${colors.text} text-xs sm:text-sm flex-shrink-0`}></i>
                <span className="text-gray-300 text-xs xs:text-sm sm:text-base">+229 XX XX XX XX</span>
              </div>
              <div className="flex items-center">
                <i className={`fas fa-envelope mr-2 text-${colors.text} text-xs sm:text-sm flex-shrink-0`}></i>
                <span className="text-gray-300 text-xs xs:text-sm sm:text-base">contact@destinyjobs.careers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer - Common Elements */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-4 sm:pt-6">
          <div className="flex flex-col xs:flex-row justify-between items-center space-y-3 xs:space-y-0">
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
  );
};

export default DynamicFooter;
