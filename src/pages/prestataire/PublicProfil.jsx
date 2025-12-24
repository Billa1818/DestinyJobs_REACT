import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { buildImageUrl } from '../../utils/urlHelper';
import prestataireService from '../../services/prestataireService';

const PublicProfil = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  // Fonction pour corriger l'URL de l'image
  const getCorrectImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http://localhost:8000')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/media/')) {
      return buildImageUrl(imageUrl);
    }
    
    return imageUrl;
  };

  // Récupérer le profil public du prestataire
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setAccessDenied(false);

        // Timeout de 10 secondes
        timeoutId = setTimeout(() => {
          if (isMounted) {
            setLoading(false);
            setError('Délai d\'attente dépassé. L\'endpoint des profils publics prestataires n\'est peut-être pas encore disponible.');
          }
        }, 10000);

        // Récupérer le profil public du prestataire via le service
        const profileData = await prestataireService.getPublicPrestataireProfile(id);
        
        if (isMounted) {
          setProfile(profileData);
        }
      } catch (serviceError) {
        console.error('Erreur du service:', serviceError);
        
        if (isMounted) {
          clearTimeout(timeoutId);
          
          // Gérer les erreurs spécifiques
          if (serviceError.response?.status === 403) {
            setAccessDenied(true);
          } else if (serviceError.response?.status === 404) {
            setError('Profil non trouvé');
          } else if (serviceError.message === 'Format de réponse inattendu') {
            setError('Format de réponse inattendu du serveur');
          } else {
            setError('Erreur de connexion au serveur');
          }
        }
      } finally {
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchPublicProfile();
    } else {
      setLoading(false);
      setError('ID du prestataire manquant');
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [id]);

  // Formater la disponibilité
  const formatAvailability = (availability) => {
    const availabilityMap = {
      'AVAILABLE': 'Disponible',
      'PARTIALLY_AVAILABLE': 'Partiellement disponible',
      'BUSY': 'Occupé',
      'ON_LEAVE': 'En congé'
    };
    return availabilityMap[availability] || availability;
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner 
          variant="page" 
          size="xl" 
          text="Chargement du profil..."
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <i className="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="space-y-3">
              <Link 
                to="/" 
                className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 text-center"
              >
                <i className="fas fa-home mr-2"></i>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
              <i className="fas fa-lock text-yellow-600 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès Refusé</h1>
            <p className="text-gray-600 mb-6">Ce profil n'est pas accessible publiquement.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
            >
              <i className="fas fa-home mr-2"></i>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <i className="fas fa-user text-gray-400 text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Profil Non Trouvé</h1>
            <p className="text-gray-600 mb-6">Le profil demandé n'existe pas ou n'est plus disponible.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200"
            >
              <i className="fas fa-home mr-2"></i>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative">
            {/* Image de couverture */}
            <div className="h-32 bg-white border-b border-gray-100"></div>
                                    
            {/* Logo et informations principales */}
            <div className="relative px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center space-x-6">
                  {/* Logo/Image du prestataire */}
                  <div className="w-28 h-28 bg-gray-100 rounded-xl shadow-md flex items-center justify-center flex-shrink-0">
                    {profile.organization_logo ? (
                      <img 
                        src={getCorrectImageUrl(profile.organization_logo)} 
                        alt={`Logo ${profile.organization_name}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : profile.image ? (
                      <img 
                        src={getCorrectImageUrl(profile.image)} 
                        alt={`Image ${profile.user?.first_name}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <i className="fas fa-user text-4xl text-gray-400"></i>
                    )}
                  </div>
                                    
                  {/* Informations principales */}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {profile.organization_name || `${profile.user?.first_name} ${profile.user?.last_name}`}
                    </h1>
                    {profile.specializations && (
                      <p className="text-lg text-orange-600 font-medium mb-1">
                        {profile.specializations}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <i className="fas fa-briefcase mr-1"></i>
                      {profile.years_experience} ans d'expérience
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAuthenticated && (
                    <button className="bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 transition duration-200 font-medium text-sm">
                      <i className="fas fa-handshake mr-2"></i>
                      Contacter
                    </button>
                  )}
                  <Link 
                    to="/" 
                    className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 transition duration-200 font-medium text-center text-sm"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Retour
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description de l'organisation */}
            {profile.organization_description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-info-circle text-orange-600 mr-2"></i>
                  À propos
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {profile.organization_description}
                </p>
              </div>
            )}

            {/* Spécializations */}
            {profile.specializations && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-star text-orange-600 mr-2"></i>
                  Spécializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.split(',').map((spec, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200"
                    >
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tarifs */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-dollar-sign text-orange-600 mr-2"></i>
                Tarifs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {profile.hourly_rate && (
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm text-gray-600 mb-1">Taux horaire</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {parseFloat(profile.hourly_rate).toFixed(2)} €
                    </div>
                  </div>
                )}
                {profile.daily_rate && (
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm text-gray-600 mb-1">Taux journalier</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {parseFloat(profile.daily_rate).toFixed(2)} €
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Informations de contact */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-address-book text-orange-600 mr-2"></i>
                Informations de contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.organization_contact_email && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-envelope text-gray-600"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                      <p className="text-gray-600">{profile.organization_contact_email}</p>
                    </div>
                  </div>
                )}
                
                {profile.organization_contact_phone && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-phone text-gray-600"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Téléphone</h4>
                      <p className="text-gray-600">{profile.organization_contact_phone}</p>
                    </div>
                  </div>
                )}
                
                {profile.organization_website && (
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-globe text-gray-600"></i>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Site web</h4>
                      <a 
                        href={profile.organization_website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 transition duration-200"
                      >
                        {profile.organization_website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-chart-bar text-orange-600 mr-2"></i>
                Statistiques
              </h3>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {profile.completed_projects}
                  </div>
                  <div className="text-sm text-gray-600">Projets complétés</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {profile.years_experience}
                  </div>
                  <div className="text-sm text-gray-600">Années d'expérience</div>
                </div>
                
                {profile.team_size && (
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {profile.team_size}
                    </div>
                    <div className="text-sm text-gray-600">Taille de l'équipe</div>
                  </div>
                )}
              </div>
            </div>

            {/* Disponibilité */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-calendar text-orange-600 mr-2"></i>
                Disponibilité
              </h3>
              <div className={`text-center p-4 rounded-lg border ${
                profile.availability === 'AVAILABLE' ? 'bg-green-50 border-green-200' :
                profile.availability === 'PARTIALLY_AVAILABLE' ? 'bg-yellow-50 border-yellow-200' :
                profile.availability === 'BUSY' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className={`text-lg font-semibold mb-1 ${
                  profile.availability === 'AVAILABLE' ? 'text-green-700' :
                  profile.availability === 'PARTIALLY_AVAILABLE' ? 'text-yellow-700' :
                  profile.availability === 'BUSY' ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {formatAvailability(profile.availability)}
                </div>
              </div>
            </div>

            {/* Informations complémentaires */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-building text-orange-600 mr-2"></i>
                Informations
              </h3>
              <div className="space-y-4">
                {profile.user && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Membre depuis</span>
                    <p className="text-gray-900">{formatDate(profile.user.created_at)}</p>
                  </div>
                )}
                
                {profile.provider_type && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Type</span>
                    <p className="text-gray-900">
                      {profile.provider_type === 'ORGANIZATION' ? 'Organisation' : 'Individuel'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfil;
