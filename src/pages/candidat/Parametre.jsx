import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileService from '../../services/profileService';
import authService from '../../services/authService';
import PasswordManagement from '../../components/auth/PasswordManagement';
import SessionManagement from '../../components/auth/SessionManagement';
import LocationManager from '../../components/candidat/LocationManager';


const Parametre = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const [locationData, setLocationData] = useState({
    country_id: null,
    region_id: null,
    address: null,
    city: null,
    postal_code: null
  });
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [emailVerificationStatus, setEmailVerificationStatus] = useState({
    isVerified: false,
    isRequesting: false
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Récupérer le profil utilisateur de base
        const userData = await authService.getProfile();
        setProfileData({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
        
        // Mettre à jour le statut de vérification de l'email
        setEmailVerificationStatus(prev => ({
          ...prev,
          isVerified: userData.email_verified || false
        }));
        


        // Récupérer la localisation
        try {
          const locationResponse = await profileService.getLocation();
          setLocationData({
            country_id: locationResponse.location?.country?.id || null,
            region_id: locationResponse.location?.region?.id || null,
            address: locationResponse.location?.address || null,
            city: locationResponse.location?.city || null,
            postal_code: locationResponse.location?.postal_code || null
          });
        } catch (err) {
          console.log('Localisation non configurée');
        }

        // Récupérer la liste des pays
        const countriesData = await profileService.getCountries();
        setCountries(countriesData);
      } catch (err) {
        console.error('Erreur lors de la récupération du profil:', err);
        setError('Erreur lors de la récupération du profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileChange = (field, value) => {
    // Empêcher la modification de l'email si celui-ci n'est pas vérifié
    if (field === 'email' && !emailVerificationStatus.isVerified) {
      return;
    }
    setProfileData(prev => ({ ...prev, [field]: value }));
  };



  // Fonction pour demander la vérification d'email
  const handleRequestEmailVerification = async () => {
    try {
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: true }));
      
      const response = await authService.requestEmailVerification();
      
      setSuccessMessage('Email de vérification envoyé ! Vérifiez votre boîte de réception.');
      setEmailVerificationStatus(prev => ({ ...prev, isVerified: false }));
      
      // Effacer le message de succès après 5 secondes
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'email de vérification');
      console.error('Erreur vérification email:', error);
    } finally {
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: false }));
    }
  };

  const handleLocationChange = (field, value) => {
    // Convertir les chaînes vides en null pour les IDs
    const cleanValue = (field === 'country_id' || field === 'region_id') && value === '' ? null : value;
    
    setLocationData(prev => ({ ...prev, [field]: cleanValue }));
    
    // Si le pays change, réinitialiser la région et charger les nouvelles régions
    if (field === 'country_id') {
      setLocationData(prev => ({ ...prev, region_id: null }));
      if (cleanValue) {
        loadRegions(cleanValue);
      } else {
        setRegions([]);
      }
    }
  };

  const loadRegions = async (countryId) => {
    try {
      const regionsData = await profileService.getRegions(countryId);
      setRegions(regionsData);
    } catch (err) {
      console.error('Erreur lors du chargement des régions:', err);
      setRegions([]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Mettre à jour le profil utilisateur de base
      await authService.updateProfile(profileData);
      

      
      // Mettre à jour la localisation - Préparer les données selon le format attendu par l'API
      const cleanLocationData = {};
      
      // Vérifier que le pays est sélectionné (obligatoire)
      if (!locationData.country_id) {
        console.log('Pays obligatoire non sélectionné');
        setError('Veuillez sélectionner un pays');
        return;
      }
      
      // Champs obligatoires
      cleanLocationData.country_id = parseInt(locationData.country_id);
      cleanLocationData.region_id = locationData.region_id ? parseInt(locationData.region_id) : null;
      
      // Champs optionnels - chaînes vides si non renseignés
      cleanLocationData.address = locationData.address && locationData.address.trim() !== '' ? locationData.address.trim() : '';
      cleanLocationData.city = locationData.city && locationData.city.trim() !== '' ? locationData.city.trim() : '';
      cleanLocationData.postal_code = locationData.postal_code && locationData.postal_code.trim() !== '' ? locationData.postal_code.trim() : '';
      
      console.log('Données de localisation à envoyer:', cleanLocationData);
      
      await profileService.updateLocation(cleanLocationData);
      
      // Afficher un message de succès et recharger seulement les données nécessaires
      setError(null); // Effacer les erreurs précédentes
      
      // Recharger seulement les données mises à jour
      try {
        // Recharger la localisation
        const updatedLocation = await profileService.getLocation();
        setLocationData({
          country_id: updatedLocation.location?.country?.id || null,
          region_id: updatedLocation.location?.region?.id || null,
          address: updatedLocation.location?.address || null,
          city: updatedLocation.location?.city || null,
          postal_code: updatedLocation.location?.postal_code || null
        });
        

        
        // Afficher un message de succès temporaire
        setSuccessMessage('Profil mis à jour avec succès !');
        
        // Effacer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
        
      } catch (err) {
        console.error('Erreur lors du rechargement des données:', err);
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des paramètres...</p>
          </div>
        </div>
      </main>
    );
  }



  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content Column */}
        <div className="xl:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-gray-600 mt-1">Gérez vos préférences et informations personnelles</p>
              </div>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50"
              >
                <i className="fas fa-save mr-2"></i>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>

            {/* Messages d'erreur et de succès */}
            {error && (
              <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-triangle text-red-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <i className="fas fa-check-circle text-green-400"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'profile' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Profil
              </button>

              <button
                onClick={() => setActiveTab('location')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'location' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-map-marker-alt mr-2"></i>Localisation
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition duration-200 ${
                  activeTab === 'security' 
                    ? 'bg-white text-fuchsia-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <i className="fas fa-lock mr-2"></i>Sécurité
              </button>
            </div>
          </div>

          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-user mr-2 text-fuchsia-600"></i>
                Informations du profil
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={profileData.first_name}
                    onChange={(e) => handleProfileChange('first_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    value={profileData.last_name}
                    onChange={(e) => handleProfileChange('last_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <div className="relative">
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                      disabled={!emailVerificationStatus.isVerified}
                      className={`w-full px-3 py-2 pr-12 border rounded-lg transition duration-200 ${
                        !emailVerificationStatus.isVerified 
                          ? 'border-red-300 bg-gray-50 text-gray-500 cursor-not-allowed focus:ring-0 focus:border-red-300' 
                          : 'border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent'
                      }`}
                      title={!emailVerificationStatus.isVerified ? "L'email ne peut pas être modifié tant qu'il n'est pas vérifié" : ""}
                    />
                    {!emailVerificationStatus.isVerified && (
                      <button
                        type="button"
                        onClick={handleRequestEmailVerification}
                        disabled={emailVerificationStatus.isRequesting}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white rounded-md flex items-center justify-center transition duration-200 disabled:opacity-50"
                        title="Vérifier l'email"
                      >
                        {emailVerificationStatus.isRequesting ? (
                          <i className="fas fa-spinner fa-spin text-xs"></i>
                        ) : (
                          <i className="fas fa-envelope text-xs"></i>
                        )}
                      </button>
                    )}
                    {emailVerificationStatus.isVerified && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-green-500 text-white rounded-md flex items-center justify-center">
                        <i className="fas fa-check text-xs"></i>
                      </div>
                    )}
                  </div>
                  {!emailVerificationStatus.isVerified && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Email non vérifié. Le champ est désactivé. Cliquez sur le bouton rouge pour recevoir un lien de vérification.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 disabled:opacity-50 transition duration-200"
                >
                  {saving ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-save mr-2"></i>
                  )}
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </div>
          )}

          {/* Location Settings */}
          {activeTab === 'location' && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
                Paramètres de localisation
              </h2>
              
              <LocationManager
                locationData={locationData}
                onLocationChange={handleLocationChange}
                countries={countries}
                regions={regions}
                onRegionsLoad={setRegions}
              />
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
              <div className="space-y-6">
              {/* Password Management */}
              <PasswordManagement />
              
              {/* Session Management */}
              <SessionManagement />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Account Summary */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-user-circle mr-2 text-fuchsia-600"></i>
              Résumé du compte
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mr-3">
                  <i className="fas fa-user text-fuchsia-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{profileData.first_name} {profileData.last_name}</h4>
                  <p className="text-sm text-gray-600">{profileData.email}</p>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type de profil</span>
                  <span className="font-medium">Candidat</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link to="/candidat/profil" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-eye text-fuchsia-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Voir mon profil</h4>
                  <p className="text-xs text-gray-500">Comment les autres me voient</p>
                </div>
              </Link>
              
              <Link to="/candidat/editer-profil" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-edit text-green-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Modifier le profil</h4>
                  <p className="text-xs text-gray-500">Mettre à jour mes informations</p>
                </div>
              </Link>
              
              <Link to="/candidat/notification" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-bell text-purple-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
                  <p className="text-xs text-gray-500">Gérer mes alertes</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Parametre;