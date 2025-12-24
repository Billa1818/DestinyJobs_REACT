import React, { useState, useEffect } from 'react';
import profileService from '../../services/profileService';
import authService from '../../services/authService';
import FileUpload from './FileUpload';
import { buildImageUrl } from '../../utils/urlHelper';

const CandidateProfileSection = () => {
  const [profileData, setProfileData] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState({
    isVerified: false,
    isRequesting: false
  });

  // Fonction pour corriger l'URL de l'image
  const getCorrectImageUrl = (imageUrl) => {
    return buildImageUrl(imageUrl);
  };

  // Fonction pour demander la vérification de l'email
  const handleRequestEmailVerification = async () => {
    try {
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: true }));
      
      await authService.requestEmailVerification();
      
      // Afficher un message de succès temporaire
      setTimeout(() => {
        setEmailVerificationStatus(prev => ({ ...prev, isRequesting: false }));
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la demande de vérification:', error);
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: false }));
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        // Récupérer le profil utilisateur de base
        const userProfile = await authService.getProfile();
        setProfileData(userProfile);
        
        // Récupérer le profil candidat détaillé
        const candidateData = await profileService.getCandidateProfile();
        console.log('API Response - Image URL:', candidateData?.image);
        setCandidateProfile(candidateData);

        // Récupérer les données de localisation
        try {
          const locationResponse = await profileService.getLocation();
          console.log('Location data:', locationResponse);
          setLocationData(locationResponse.location);
        } catch (locationError) {
          console.log('Aucune localisation trouvée ou erreur:', locationError);
          setLocationData(null);
        }

        // Vérifier le statut de vérification de l'email
        if (userProfile?.email_verified !== undefined) {
          setEmailVerificationStatus(prev => ({
            ...prev,
            isVerified: userProfile.email_verified
          }));
        }
      } catch (err) {
        setError('Erreur lors du chargement du profil');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);



  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center text-red-600">
          <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Informations de base */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          <i className="fas fa-user mr-2 text-fuchsia-600"></i>
          Informations personnelles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <p className="text-gray-900">
              {profileData?.first_name || 'Non renseigné'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <p className="text-gray-900">
              {profileData?.last_name || 'Non renseigné'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex items-center space-x-2">
            <p className="text-gray-900">{profileData?.email}</p>
              {!emailVerificationStatus.isVerified && (
                <button
                  type="button"
                  onClick={handleRequestEmailVerification}
                  disabled={emailVerificationStatus.isRequesting}
                  className="inline-flex items-center px-2 py-1 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white text-xs rounded-md transition duration-200 disabled:opacity-50"
                  title="Vérifier l'email"
                >
                  {emailVerificationStatus.isRequesting ? (
                    <i className="fas fa-spinner fa-spin mr-1"></i>
                  ) : (
                    <i className="fas fa-envelope mr-1"></i>
                  )}
                  Vérifier
                </button>
              )}
              {emailVerificationStatus.isVerified && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">
                  <i className="fas fa-check mr-1"></i>
                  Vérifié
                </span>
              )}
            </div>
            {!emailVerificationStatus.isVerified && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                Email non vérifié. Cliquez sur "Vérifier" pour recevoir un lien de vérification.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <p className="text-gray-900">
              {profileData?.phone || 'Non renseigné'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visibilité du profil</label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Public
            </span>
          </div>
        </div>
      </div>

      {/* Photo de profil */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
          <i className="fas fa-camera mr-2 text-fuchsia-600"></i>
          Photo de profil
          </h2>
        
        {/* Composant d'upload pour la photo */}
        <FileUpload
          type="image"
          currentFile={getCorrectImageUrl(candidateProfile?.image) || null}
          onFileUpdate={(fileUrl) => {
            console.log('🔄 Mise à jour de l\'image:', fileUrl);
            
            // Recharger la page après l'upload réussi
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Attendre 1 seconde pour que l'utilisateur voie le message de succès
          }}
          onFileDelete={() => {
            // Mettre à jour l'état local après la suppression
            setCandidateProfile(prev => ({
              ...prev,
              image: null
            }));
            
            // Recharger la page après la suppression
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
          maxSize={2} // 2MB max pour les images
                />
              </div>

      {/* CV */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          <i className="fas fa-file-pdf mr-2 text-fuchsia-600"></i>
          CV
        </h2>
        
        {/* Affichage du CV actuel */}
            {candidateProfile?.cv && (
          <div className="mb-4">
                <a 
              href={getCorrectImageUrl(candidateProfile.cv)} 
                  target="_blank" 
                  rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-fuchsia-100 text-fuchsia-700 rounded-lg hover:bg-fuchsia-200 transition duration-200"
                >
                  <i className="fas fa-download mr-2"></i>
              Télécharger le CV actuel
                </a>
              </div>
            )}
        
        {/* Composant d'upload pour le CV */}
        <FileUpload
          type="cv"
          currentFile={getCorrectImageUrl(candidateProfile?.cv) || null}
          onFileUpdate={(fileUrl) => {
            console.log('🔄 Mise à jour du CV:', fileUrl);
            
            // Recharger la page après l'upload réussi
            setTimeout(() => {
              window.location.reload();
            }, 1000); // Attendre 1 seconde pour que l'utilisateur voie le message de succès
          }}
          onFileDelete={() => {
            // Mettre à jour l'état local après la suppression
            setCandidateProfile(prev => ({
              ...prev,
              cv: null
            }));
            
            // Recharger la page après la suppression
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }}
          maxSize={5} // 5MB max pour les CV
        />
        </div>

      {/* À propos */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
            À propos
          </h2>
        <p className="text-gray-700 leading-relaxed">
          {candidateProfile?.about || 'Aucune description renseignée'}
        </p>
        </div>

      {/* Expérience */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
            Expérience professionnelle
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
            <p className="text-gray-900">
              {candidateProfile?.years_experience ? `${candidateProfile.years_experience} an(s)` : 'Non renseigné'}
            </p>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Détails de l'expérience</label>
            <p className="text-gray-700">
              {candidateProfile?.professional_experience || 'Non renseigné'}
            </p>
          </div>
        </div>
      </div>

      {/* Formation */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-graduation-cap mr-2 text-fuchsia-600"></i>
            Formation
          </h2>
        <p className="text-gray-700">
          {candidateProfile?.education || 'Non renseigné'}
        </p>
        </div>

      {/* Technologies */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-code mr-2 text-fuchsia-600"></i>
            Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
          {candidateProfile?.technologies ? (
            candidateProfile.technologies.split(',').map((tech, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuchsia-100 text-fuchsia-800"
              >
                {tech.trim()}
              </span>
            ))
          ) : (
            <p className="text-gray-500 italic">Aucune technologie renseignée</p>
          )}
        </div>
      </div>

      {/* Compétences */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-star mr-2 text-fuchsia-600"></i>
            Compétences
          </h2>
        <p className="text-gray-700">
          {candidateProfile?.skills || 'Aucune compétence renseignée'}
        </p>
        </div>

      {/* Réalisations */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-trophy mr-2 text-fuchsia-600"></i>
            Réalisations
          </h2>
        <p className="text-gray-700">
          {candidateProfile?.achievements || 'Aucune réalisation renseignée'}
        </p>
        </div>

      {/* Localisation */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
            Localisation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
            <p className="text-gray-900">
              {locationData?.country?.name || 'Non renseigné'}
            </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <p className="text-gray-900">
              {locationData?.region?.name || 'Non renseigné'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
            <p className="text-gray-900">
              {locationData?.city || 'Non renseigné'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
            <p className="text-gray-900">
              {locationData?.postal_code || 'Non renseigné'}
            </p>
              </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <p className="text-gray-900">
              {locationData?.address || 'Non renseigné'}
            </p>
          </div>
        </div>
      </div>

      {/* Score de visibilité */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
            Score de visibilité
          </h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-fuchsia-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${candidateProfile?.visibility_score || 0}%` }}
                ></div>
              </div>
            </div>
            <span className="text-lg font-semibold text-fuchsia-600">
            {candidateProfile?.visibility_score || 0}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Ce score indique la qualité et la complétude de votre profil
          </p>
        </div>

      {/* Message si profil incomplet */}
      {(!candidateProfile?.about || !candidateProfile?.skills || !candidateProfile?.technologies) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start">
            <i className="fas fa-exclamation-triangle text-yellow-600 mt-1 mr-3"></i>
            <div>
              <h3 className="text-lg font-medium text-yellow-800 mb-2">Profil incomplet</h3>
              <p className="text-yellow-700 mb-3">
                Votre profil n'est pas encore complet. Complétez-le pour augmenter votre visibilité auprès des recruteurs.
              </p>
              <a 
                href="/candidat/parametre" 
                className="inline-flex items-center px-4 text-fuchsia-600 hover:text-fuchsia-800 underline"
              >
                <i className="fas fa-edit mr-2"></i>
                Compléter mon profil
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateProfileSection;
 