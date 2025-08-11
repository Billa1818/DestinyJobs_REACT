import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import profileService from '../../services/profileService';

const CandidatePublicProfile = () => {
  const { userId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        setAccessDenied(false);

        try {
          // Utiliser le service profileService au lieu de fetch directement
          const profileData = await profileService.getPublicCandidateProfile(userId);
          
          // Si le CV n'est pas dans les données publiques, essayer de le récupérer depuis l'endpoint complet
          if (!profileData.cv) {
            try {
              const fullProfileResponse = await fetch(`/api/auth/profile/candidate/${userId}/`);
              if (fullProfileResponse.ok) {
                const fullProfileData = await fullProfileResponse.json();
                
                // Fusionner les données
                const mergedProfile = {
                  ...profileData,
                  cv: fullProfileData.cv,
                  education: fullProfileData.education || profileData.education,
                  professional_experience: fullProfileData.professional_experience || profileData.professional_experience,
                  achievements: fullProfileData.achievements || profileData.achievements
                };
                
                setProfile(mergedProfile);
                return;
              }
            } catch (fullError) {
              // Erreur silencieuse, utilisation des données publiques uniquement
            }
          }
          
          setProfile(profileData);
        } catch (serviceError) {
          // Fallback vers fetch direct si le service échoue
          const response = await fetch(`/api/auth/public/candidates/${userId}/`);
          
          // Vérifier le type de contenu
          const contentType = response.headers.get('content-type');
          
          if (response.status === 200) {
            // Vérifier si c'est du JSON
            if (contentType && contentType.includes('application/json')) {
              try {
                const profileData = await response.json();
                setProfile(profileData);
              } catch (parseError) {
                setError('Erreur de format des données reçues');
              }
            } else {
              // Si ce n'est pas du JSON, essayer de lire le texte pour diagnostiquer
              setError('Format de réponse inattendu du serveur');
            }
          } else if (response.status === 403) {
            setAccessDenied(true);
          } else if (response.status === 404) {
            setError('Profil non trouvé');
          } else {
            setError(`Erreur serveur: ${response.status}`);
          }
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPublicProfile();
    }
  }, [userId]);

  // Fonction pour corriger l'URL de l'image
  const getCorrectImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http://localhost:8000')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/media/')) {
      return `http://localhost:8000${imageUrl}`;
    }
    
    return imageUrl;
  };

  // Fonction pour corriger l'URL du CV
  const getCorrectCVUrl = (cvUrl) => {
    if (!cvUrl) return null;
    
    if (cvUrl.startsWith('http://localhost:8000')) {
      return cvUrl;
    }
    
    if (cvUrl.startsWith('/media/')) {
      return `http://localhost:8000${cvUrl}`;
    }
    
    return cvUrl;
  };

  // Fonction pour formater les technologies
  const formatTechnologies = (technologies) => {
    if (!technologies) return [];
    
    try {
      if (typeof technologies === 'string') {
        return JSON.parse(technologies);
      }
      return technologies;
    } catch {
      return technologies.split(',').map(tech => tech.trim());
    }
  };

  // Fonction pour extraire le nom du fichier depuis l'URL
  const getFileNameFromUrl = (url) => {
    if (!url) return 'Document';
    
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return fileName || 'Document';
    } catch {
      return 'Document';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Erreur</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/" className="text-fuchsia-600 hover:text-fuchsia-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
            <i className="fas fa-lock text-yellow-600 text-xl"></i>
          </div>
          <h3 className="text-lg font-medium text-yellow-900 mb-2">Accès refusé</h3>
          <p className="text-yellow-600 mb-4">
            Ce profil n'est pas accessible publiquement.
          </p>
          <Link to="/" className="text-fuchsia-600 hover:text-fuchsia-700">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-fuchsia-600 hover:text-fuchsia-700">
              <i className="fas fa-arrow-left mr-2"></i>
              Retour à l'accueil
            </Link>
            <div className="text-sm text-gray-500">
              Profil public
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
                <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* En-tête du profil */}
          <div className="bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center space-x-6">
              {/* Photo de profil */}
              <div className="flex-shrink-0">
                {profile.image ? (
                  <img 
                    src={getCorrectImageUrl(profile.image)} 
                    alt="Photo de profil"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white shadow-lg">
                    <i className="fas fa-user text-3xl"></i>
                  </div>
                )}
              </div>
              
              {/* Informations principales */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  {profile.user.first_name} {profile.user.last_name}
                </h1>
                <p className="text-xl opacity-90 mb-2">
                  @{profile.user.username}
                </p>
                {profile.about && (
                  <p className="text-lg opacity-80 leading-relaxed">
                    {profile.about}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Détails du profil */}
          <div className="p-6 space-y-6">
            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <i className="fas fa-info-circle text-fuchsia-600 mr-2"></i>
                  Informations générales
                </h3>
                <div className="space-y-2">
                  {profile.years_experience && (
                    <div className="flex items-center text-gray-700">
                      <i className="fas fa-briefcase text-gray-400 w-5 mr-3"></i>
                      <span>{profile.years_experience} an(s) d'expérience</span>
                    </div>
                  )}
                  {profile.country && (
                    <div className="flex items-center text-gray-700">
                      <i className="fas fa-map-marker-alt text-gray-400 w-5 mr-3"></i>
                      <span>{profile.country.name}</span>
                      {profile.region && <span className="ml-1">, {profile.region.name}</span>}
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-calendar text-gray-400 w-5 mr-3"></i>
                    <span>Membre depuis {new Date(profile.user.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {/* Compétences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <i className="fas fa-star text-fuchsia-600 mr-2"></i>
                  Compétences
                </h3>
                {profile.skills ? (
                  <p className="text-gray-700">{profile.skills}</p>
                ) : (
                  <p className="text-gray-500 italic">Aucune compétence renseignée</p>
                )}
              </div>
            </div>

            {/* Technologies */}
            {profile.technologies && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <i className="fas fa-code text-fuchsia-600 mr-2"></i>
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formatTechnologies(profile.technologies).map((tech, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuchsia-100 text-fuchsia-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Formation */}
            {profile.education && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <i className="fas fa-graduation-cap text-fuchsia-600 mr-2"></i>
                  Formation
                </h3>
                <p className="text-gray-700">{profile.education}</p>
              </div>
            )}

            {/* Expérience professionnelle */}
            {profile.professional_experience && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <i className="fas fa-briefcase text-fuchsia-600 mr-2"></i>
                  Expérience professionnelle
                </h3>
                <p className="text-gray-700">{profile.professional_experience}</p>
              </div>
            )}

            {/* Réalisations */}
            {profile.achievements && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <i className="fas fa-trophy text-fuchsia-600 mr-2"></i>
                  Réalisations
                </h3>
                <p className="text-gray-700">{profile.achievements}</p>
              </div>
            )}

            {/* CV et Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                <i className="fas fa-file-alt text-fuchsia-600 mr-2"></i>
                CV et Documents
              </h3>
              
              <div className="space-y-3">
                {/* CV */}
                {profile.cv ? (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">CV de {profile.user.first_name}</h4>
                          <p className="text-sm text-gray-600">{getFileNameFromUrl(profile.cv)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={getCorrectCVUrl(profile.cv)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-fuchsia-600 text-white text-sm font-medium rounded-lg hover:bg-fuchsia-700 transition duration-200"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          Voir le CV
                        </a>
                        <a
                          href={getCorrectCVUrl(profile.cv)}
                          download
                          className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-200"
                        >
                          <i className="fas fa-download mr-2"></i>
                          Télécharger
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-file-pdf text-gray-400 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-500">CV non disponible</h4>
                        <p className="text-sm text-gray-400">Ce candidat n'a pas encore partagé son CV</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Photo de profil */}
                {profile.image ? (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="fas fa-image text-blue-600 text-xl"></i>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Photo de profil</h4>
                          <p className="text-sm text-gray-600">Image personnelle</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={getCorrectImageUrl(profile.image)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          <i className="fas fa-eye mr-2"></i>
                          Voir l'image
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <i className="fas fa-image text-gray-400 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-500">Photo de profil non disponible</h4>
                        <p className="text-sm text-gray-400">Ce candidat n'a pas encore partagé sa photo</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-6">
              <div className="flex flex-col sm:flex-row gap-3">
                {isAuthenticated && user?.user_type === 'RECRUITER' && (
                  <button className="flex-1 bg-fuchsia-600 text-white px-6 py-3 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium">
                    <i className="fas fa-envelope mr-2"></i>
                    Contacter ce candidat
                  </button>
                )}
                <Link 
                  to="/" 
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200 font-medium text-center"
                >
                  <i className="fas fa-search mr-2"></i>
                  Voir d'autres profils
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePublicProfile; 