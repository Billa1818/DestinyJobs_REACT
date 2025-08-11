import React from 'react';
import { Link } from 'react-router-dom';
import PublicProfileNavigation from '../../components/public/PublicProfileNavigation';

const PublicProfilesIndex = () => {
  const profileTypes = [
    {
      type: 'candidat',
      title: 'Profils Candidats',
      description: 'Découvrez des talents et des compétences dans divers domaines',
      icon: 'fas fa-user-graduate',
      color: 'from-blue-500 to-blue-600',
      link: '/profile/candidat',
      features: [
        'CV et expériences',
        'Compétences techniques',
        'Portfolios de projets',
        'Recommandations'
      ]
    },
    {
      type: 'recruteur',
      title: 'Profils Recruteurs',
      description: 'Trouvez des recruteurs et des entreprises qui recrutent',
      icon: 'fas fa-briefcase',
      color: 'from-green-500 to-green-600',
      link: '/profile/recruteur',
      features: [
        'Entreprises et secteurs',
        'Offres d\'emploi',
        'Politiques de recrutement',
        'Contact direct'
      ]
    },
    {
      type: 'prestataire',
      title: 'Profils Prestataires',
      description: 'Explorez des services et des prestataires qualifiés',
      icon: 'fas fa-tools',
      color: 'from-purple-500 to-purple-600',
      link: '/profile/prestataire',
      features: [
        'Services proposés',
        'Expertise technique',
        'Réalisations',
        'Tarifs et disponibilités'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-fuchsia-600 hover:text-fuchsia-700">
              <i className="fas fa-arrow-left mr-2"></i>
              Retour à l'accueil
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Profils Publics</h1>
              <p className="text-gray-600">Découvrez notre communauté de professionnels</p>
            </div>
            <div className="w-20"></div> {/* Spacer pour centrer le titre */}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation des profils publics */}
        <PublicProfileNavigation userType={null} />
        
        {/* Grille des types de profils */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {profileTypes.map((profileType) => (
            <div key={profileType.type} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* En-tête avec gradient */}
              <div className={`bg-gradient-to-r ${profileType.color} px-6 py-6 text-white`}>
                <div className="text-center">
                  <i className={`${profileType.icon} text-4xl mb-3`}></i>
                  <h2 className="text-xl font-bold mb-2">{profileType.title}</h2>
                  <p className="text-sm opacity-90">{profileType.description}</p>
                </div>
              </div>
              
              {/* Contenu */}
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {profileType.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <i className="fas fa-check text-green-500 mr-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link
                  to={profileType.link}
                  className={`block w-full text-center py-2 px-4 rounded-lg font-medium transition duration-200 ${
                    profileType.type === 'candidat'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : profileType.type === 'recruteur'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Explorer les profils
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Section d'information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="fas fa-info-circle text-fuchsia-600 mr-2"></i>
            À propos des profils publics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Visibilité contrôlée</h4>
              <p className="text-sm text-gray-600">
                Les utilisateurs peuvent choisir la visibilité de leur profil : public, recruteurs uniquement, ou privé.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Données sécurisées</h4>
              <p className="text-sm text-gray-600">
                Seules les informations publiques sont affichées. Les données personnelles restent privées.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfilesIndex; 