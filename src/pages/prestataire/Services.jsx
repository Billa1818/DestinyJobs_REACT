import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProviderPublicProfileService from '../../services/ProviderPublicProfileService';

const PrestataireServices = () => {
  const { providerId } = useParams();
  const { user } = useAuth();
  
  // États pour les données du profil
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtenir l'ID du prestataire (depuis l'URL ou l'utilisateur connecté)
  const getProviderId = () => {
    if (providerId) return providerId;
    if (user?.id) return user.id;
    return null;
  };

  // Normaliser l'ID du prestataire
  const getNormalizedProviderId = () => {
    const id = getProviderId();
    if (!id) return null;
    
    // Normaliser l'ID (convertir en nombre si c'est une chaîne)
    return ProviderPublicProfileService.normalizeProviderId(id);
  };

  // Charger le profil au montage du composant
  useEffect(() => {
    const id = getNormalizedProviderId();
    if (id) {
      loadProfile(id);
    } else {
      setError('ID du prestataire non disponible ou invalide');
      setLoading(false);
    }
  }, [providerId, user]);

  // Charger le profil depuis l'API
  const loadProfile = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      // L'ID est déjà normalisé et validé par getNormalizedProviderId
      console.log('🔄 Chargement du profil pour l\'ID:', id, 'Type:', typeof id);
      
      const data = await ProviderPublicProfileService.getPublicProfile(id);
      const formattedData = ProviderPublicProfileService.formatProfileForDisplay(data);
      
      if (!formattedData) {
        throw new Error('Données du profil invalides');
      }
      
      setProfileData(formattedData);
      console.log('✅ Profil chargé avec succès:', formattedData);
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement du profil:', err);
      if (err.response?.status === 404) {
        setError('Profil du prestataire non trouvé');
      } else if (err.response?.status === 400) {
        setError('ID du prestataire invalide');
      } else {
        setError(err.message || 'Erreur lors du chargement du profil');
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtenir l'icône du type de prestataire
  const getProviderIcon = () => {
    if (profileData?.providerType === 'ORGANIZATION') {
      return 'fas fa-building';
    }
    return 'fas fa-user';
  };

  // Obtenir les couleurs selon le type de prestataire
  const getProviderColors = () => {
    if (profileData?.providerType === 'ORGANIZATION') {
      return {
        gradient: 'from-blue-500 to-indigo-600',
        border: 'border-blue-200',
        icon: 'text-blue-600'
      };
    } else {
      return {
        gradient: 'from-orange-500 to-purple-600',
        border: 'border-orange-200',
        icon: 'text-orange-600'
      };
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non spécifiée';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Gérer le téléchargement du portfolio
  const handlePortfolioDownload = () => {
    if (profileData?.fullPortfolioUrl) {
      const link = document.createElement('a');
      link.href = profileData.fullPortfolioUrl;
      link.download = `Portfolio_${profileData.username}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Affichage du chargement
  if (loading) {
  return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du profil...</p>
          </div>
        </div>
      </main>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
              </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/prestataire" 
              className="text-sm text-red-600 hover:text-red-500 underline"
            >
              Retour au tableau de bord
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Affichage du profil
  if (!profileData) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="text-center py-8">
          <i className="fas fa-user-slash text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profil non trouvé</h3>
          <p className="text-gray-600">
            Le profil demandé n'a pas pu être chargé.
          </p>
              </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:px-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profil Public</h1>
                <p className="text-gray-600 mt-1">Vue publique de votre profil prestataire</p>
              </div>
              <Link 
                to="/prestataire/profile"
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200"
              >
                <i className="fas fa-edit mr-2"></i>
                Modifier le profil
              </Link>
            </div>
          </div>
          
          {/* Profile Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <i className="fas fa-user mr-2 text-orange-600"></i>
              Informations du profil
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <p className="text-gray-900 font-medium">
                  {profileData.displayName}
                </p>
              </div>

              {/* Nom d'utilisateur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <p className="text-gray-900">@{profileData.username}</p>
              </div>

              {/* Type de prestataire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de prestataire
                </label>
                <div className="flex items-center">
                  <i className={`${getProviderIcon()} ${getProviderColors().icon} mr-2`}></i>
                  <span className="text-gray-900">{profileData.providerTypeLabel}</span>
            </div>
          </div>
          
              {/* Disponibilité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité
                </label>
            <div className="flex items-center">
                  <div className={`w-3 h-3 ${profileData.availabilityStatus.bgColor} rounded-full mr-2`}>
                    <i className={`${profileData.availabilityStatus.icon} ${profileData.availabilityStatus.color} text-xs`}></i>
                  </div>
                  <span className={`${profileData.availabilityStatus.color} font-medium`}>
                    {profileData.availabilityStatus.text}
                  </span>
                </div>
              </div>

              {/* Spécialisations */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialisations
                </label>
                <p className="text-gray-900">
                  {profileData.specializations || 'Aucune spécialisation spécifiée'}
                </p>
              </div>

              {/* Années d'expérience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience
                </label>
                <p className="text-gray-900">{profileData.experienceText}</p>
        </div>

              {/* Projets complétés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projets complétés
                </label>
                <p className="text-gray-900">
                  {profileData.completedProjects || 0} projets
                </p>
          </div>

              {/* Taux horaire */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux horaire
                </label>
                <p className="text-gray-900 font-medium">
                  {profileData.hourlyRateFormatted}
                </p>
                </div>
                
              {/* Score de visibilité */}
                        <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Score de visibilité
                </label>
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${profileData.visibilityLevel.bgColor} ${profileData.visibilityLevel.color}`}>
                    <i className={`${profileData.visibilityLevel.icon} mr-1`}></i>
                    {profileData.visibilityLevel.level}
                          </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({profileData.visibilityScore}/100)
                          </span>
                        </div>
                      </div>
                      
              {/* Localisation */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                          <div className="flex items-center">
                  <i className="fas fa-map-marker-alt text-gray-400 mr-2"></i>
                  <span className="text-gray-900">{profileData.location}</span>
                </div>
              </div>

              {/* Date de création */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Membre depuis
                </label>
                <p className="text-gray-900">{formatDate(profileData.createdAt)}</p>
                </div>
                
              {/* Dernière mise à jour */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dernière mise à jour
                </label>
                <p className="text-gray-900">{formatDate(profileData.updatedAt)}</p>
                        </div>
                        </div>
                      </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              <i className="fas fa-envelope mr-2 text-blue-600"></i>
              Informations de contact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center">
                  <i className="fas fa-envelope text-gray-400 mr-2"></i>
                  <a 
                    href={`mailto:${profileData.email}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {profileData.email}
                  </a>
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="flex items-center">
                  <i className="fas fa-phone text-gray-400 mr-2"></i>
                  <a 
                    href={`tel:${profileData.phone}`}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    {profileData.phone}
                  </a>
                </div>
                          </div>
                        </div>
                        </div>
                      </div>
                      
        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Profile Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="text-center mb-6">
              {/* Photo de profil */}
              {profileData.fullImageUrl ? (
                <div className="w-24 h-24 mx-auto mb-4">
                  <img
                    src={profileData.fullImageUrl}
                    alt="Photo de profil"
                    className={`w-24 h-24 object-cover rounded-full border-4 ${getProviderColors().border} shadow-lg`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div 
                    className={`w-24 h-24 bg-gradient-to-r ${getProviderColors().gradient} rounded-full flex items-center justify-center mx-auto mb-4 hidden`}
                    style={{ display: 'none' }}
                  >
                    <i className={`${getProviderIcon()} text-white text-2xl`}></i>
                        </div>
                      </div>
              ) : (
                <div className={`w-24 h-24 bg-gradient-to-r ${getProviderColors().gradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`${getProviderIcon()} text-white text-2xl`}></i>
              </div>
            )}

              <h3 className="text-xl font-bold text-gray-900">
                {profileData.displayName}
              </h3>
              <p className="text-gray-600">
                {profileData.providerTypeLabel}
              </p>
              
              {/* Statut de disponibilité */}
              <div className="mt-3">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${profileData.availabilityStatus.bgColor} ${profileData.availabilityStatus.color}`}>
                  <i className={`${profileData.availabilityStatus.icon} mr-2`}></i>
                  {profileData.availabilityStatus.text}
                </div>
              </div>
                </div>
                
            <div className="space-y-4">
              <div className="flex items-center">
                <i className="fas fa-clock text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.experienceText}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-check-circle text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.completedProjects || 0} projets complétés</span>
                        </div>
              <div className="flex items-center">
                <i className="fas fa-money-bill text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.hourlyRateFormatted}</span>
                        </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                <span className="text-gray-700">{profileData.location}</span>
                        </div>
                      </div>
                      </div>

          {/* Portfolio */}
          {profileData.fullPortfolioUrl && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-file-pdf text-blue-600 text-xl"></i>
                    </div>
                <p className="text-sm text-gray-600 mb-3">
                  Portfolio disponible au téléchargement
                </p>
                <button
                  onClick={handlePortfolioDownload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                  <i className="fas fa-download mr-2"></i>
                  Télécharger
                </button>
                </div>
              </div>
            )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Link to="/prestataire/profile" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-edit text-orange-600 mr-3"></i>
                <span className="text-gray-700">Modifier le profil</span>
              </Link>
              <Link to="/consultations" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-search text-orange-600 mr-3"></i>
                <span className="text-gray-700">Rechercher des consultations</span>
              </Link>
              <Link to="/prestataire/demandes" className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200">
                <i className="fas fa-paper-plane text-orange-600 mr-3"></i>
                <span className="text-gray-700">Mes candidatures</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrestataireServices; 