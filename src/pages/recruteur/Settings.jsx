import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileService from '../../services/profileService';
import authService from '../../services/authService';
import PasswordManagement from '../../components/auth/PasswordManagement';
import SessionManagement from '../../components/auth/SessionManagement';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  // Profil recruteur
  const [recruiterData, setRecruiterData] = useState({
    company_name: '',
    description: '',
    sector: '',
    company_size: '',
    website: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    country_id: null,
    region_id: null,
    city: '',
    postal_code: ''
  });

  // Profil utilisateur
  const [userProfile, setUserProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  // Données de localisation
  const [locationData, setLocationData] = useState({
    country_id: null,
    region_id: null,
    address: '',
    city: '',
    postal_code: ''
  });



  // États pour les fichiers
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [documentsFile, setDocumentsFile] = useState(null);

  // États pour les listes
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);

  // Statut de vérification email
  const [emailVerificationStatus, setEmailVerificationStatus] = useState({
    isVerified: false,
    isRequesting: false
  });

  // Options pour les sélecteurs
  const companySizeOptions = [
    { value: 'STARTUP', label: 'Startup (1-10 employés)' },
    { value: 'SMALL', label: 'Petite entreprise (11-50 employés)' },
    { value: 'MEDIUM', label: 'Moyenne entreprise (51-200 employés)' },
    { value: 'LARGE', label: 'Grande entreprise (201-1000 employés)' },
    { value: 'ENTERPRISE', label: 'Entreprise (1000+ employés)' }
  ];

  const sectorOptions = [
    'Technologies de l\'information',
    'Finance et banque',
    'Santé',
    'Éducation',
    'Commerce et retail',
    'Industrie manufacturière',
    'Services aux entreprises',
    'Médias et communication',
    'Transport et logistique',
    'Énergie',
    'Construction',
    'Agriculture',
    'Tourisme et hôtellerie',
    'Autre'
  ];

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer le profil utilisateur de base
      const userData = await authService.getProfile();
      setUserProfile({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      });

      // Mettre à jour le statut de vérification de l'email
      setEmailVerificationStatus(prev => ({
      ...prev,
        isVerified: userData.email_verified || false
      }));

      // Récupérer le profil recruteur
      try {
        const recruiterResponse = await profileService.getRecruiterProfile();
        setRecruiterData({
          company_name: recruiterResponse.company_name || '',
          description: recruiterResponse.description || '',
          sector: recruiterResponse.sector || '',
          company_size: recruiterResponse.company_size || '',
          website: recruiterResponse.website || '',
          address: recruiterResponse.address || '',
          contact_email: recruiterResponse.contact_email || '',
          contact_phone: recruiterResponse.contact_phone || '',
          country_id: recruiterResponse.country?.id || null,
          region_id: recruiterResponse.region?.id || null,
          city: recruiterResponse.city || '',
          postal_code: recruiterResponse.postal_code || ''
        });

        // Logo preview
        if (recruiterResponse.logo) {
          setLogoPreview(recruiterResponse.logo);
        }
      } catch (err) {
        console.log('Profil recruteur non configuré');
      }

      // Récupérer la localisation
      try {
        const locationResponse = await profileService.getLocation();
        setLocationData({
          country_id: locationResponse.location?.country?.id || null,
          region_id: locationResponse.location?.region?.id || null,
          address: locationResponse.location?.address || '',
          city: locationResponse.location?.city || '',
          postal_code: locationResponse.location?.postal_code || ''
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

  const handleProfileChange = (field, value) => {
    // Empêcher la modification de l'email si celui-ci n'est pas vérifié
    if (field === 'email' && !emailVerificationStatus.isVerified) {
      return;
    }
    setRecruiterData(prev => ({ ...prev, [field]: value }));
  };

  const handleUserProfileChange = (field, value) => {
    // Empêcher la modification de l'email si celui-ci n'est pas vérifié
    if (field === 'email' && !emailVerificationStatus.isVerified) {
      return;
    }
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setLocationData(prev => ({ ...prev, [field]: value }));
    
    // Si le pays change, charger les régions
    if (field === 'country_id') {
      loadRegions(value);
      // Réinitialiser la région
      setLocationData(prev => ({ ...prev, region_id: null }));
      setRecruiterData(prev => ({ ...prev, region_id: null }));
    }
  };

  const loadRegions = async (countryId) => {
    if (!countryId) return;
    
    try {
      const regionsData = await profileService.getRegions(countryId);
      setRegions(regionsData);
    } catch (err) {
      console.error('Erreur lors du chargement des régions:', err);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentsChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentsFile(file);
    }
  };

  // Fonction pour demander la vérification d'email
  const handleRequestEmailVerification = async () => {
    try {
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: true }));
      
      await authService.requestEmailVerification();
      
      setSuccessMessage('Email de vérification envoyé. Vérifiez votre boîte mail.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      setError('Erreur lors de l\'envoi de l\'email de vérification');
      setTimeout(() => setError(null), 5000);
    } finally {
      setEmailVerificationStatus(prev => ({ ...prev, isRequesting: false }));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Vérifier que l'utilisateur est un recruteur approuvé
      if (userProfile.user_type !== 'RECRUTEUR') {
        setError('Accès non autorisé');
        return;
      }

      // Mettre à jour le profil utilisateur
      await authService.updateProfile({
        first_name: userProfile.first_name,
        last_name: userProfile.last_name,
        phone: userProfile.phone
      });

      // Mettre à jour le profil recruteur
      const formData = new FormData();
      formData.append('company_name', recruiterData.company_name);
      formData.append('description', recruiterData.description);
      formData.append('sector', recruiterData.sector);
      formData.append('company_size', recruiterData.company_size);
      formData.append('website', recruiterData.website);
      formData.append('address', recruiterData.address);
      formData.append('contact_email', recruiterData.contact_email);
      formData.append('contact_phone', recruiterData.contact_phone);
      formData.append('country_id', recruiterData.country_id);
      formData.append('region_id', recruiterData.region_id);
      formData.append('city', recruiterData.city);
      formData.append('postal_code', recruiterData.postal_code);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (documentsFile) {
        formData.append('company_documents', documentsFile);
      }

      await profileService.updateRecruiterProfile(formData);

      // Mettre à jour la localisation
      await profileService.updateLocation({
        country_id: locationData.country_id,
        region_id: locationData.region_id,
        address: locationData.address,
        city: locationData.city,
        postal_code: locationData.postal_code
      });

      setSuccessMessage('Profil mis à jour avec succès');
      setTimeout(() => setSuccessMessage(null), 5000);

      // Recharger les données
      await fetchProfileData();

    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      
      if (err.response?.status === 403) {
        setError('Votre compte n\'est pas encore approuvé. Impossible de modifier le profil.');
      } else if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
      } else if (err.response?.status === 400) {
        setError('Données invalides. Vérifiez vos informations.');
      } else {
        setError('Erreur lors de la sauvegarde du profil');
      }
      
      setTimeout(() => setError(null), 5000);
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-fuchsia-600 mb-4"></i>
          <p className="text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Paramètres</h1>
          <p className="text-gray-600">Gérez vos préférences et informations de compte entreprise</p>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-circle text-red-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Main Content Column */}
          <div className="xl:w-2/3">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                    <i className="fas fa-building mr-2"></i>
                    Profil Entreprise
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-fuchsia-500 text-fuchsia-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Sécurité
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
                  <div className="space-y-8">
                    {/* Informations de l'entreprise */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <i className="fas fa-building mr-2 text-fuchsia-600"></i>
                        Informations de l'entreprise
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom de l'entreprise *
                          </label>
                      <input
                        type="text"
                            value={recruiterData.company_name}
                            onChange={(e) => handleProfileChange('company_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            placeholder="Nom de votre entreprise"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secteur d'activité
                          </label>
                          <select
                            value={recruiterData.sector}
                            onChange={(e) => handleProfileChange('sector', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner un secteur</option>
                            {sectorOptions.map((sector) => (
                              <option key={sector} value={sector}>{sector}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Taille de l'entreprise
                          </label>
                          <select
                            value={recruiterData.company_size}
                            onChange={(e) => handleProfileChange('company_size', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner une taille</option>
                            {companySizeOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Site web
                          </label>
                      <input
                            type="url"
                            value={recruiterData.website}
                            onChange={(e) => handleProfileChange('website', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            placeholder="https://www.votreentreprise.com"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description de l'entreprise
                        </label>
                        <textarea
                          value={recruiterData.description}
                          onChange={(e) => handleProfileChange('description', e.target.value)}
                          rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                          placeholder="Décrivez votre entreprise, ses valeurs, sa mission..."
                      />
                      </div>
                    </div>

                    {/* Logo de l'entreprise */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <i className="fas fa-image mr-2 text-fuchsia-600"></i>
                        Logo de l'entreprise
                      </h3>
                      <div className="flex items-center space-x-6">
                        {logoPreview && (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={logoPreview}
                              alt="Logo de l'entreprise"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                      <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Formats acceptés : JPG, PNG, WebP. Taille max : 5 MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Informations de contact */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <i className="fas fa-address-book mr-2 text-fuchsia-600"></i>
                        Informations de contact
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email de contact *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={recruiterData.contact_email}
                              onChange={(e) => handleProfileChange('contact_email', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent ${
                                !emailVerificationStatus.isVerified 
                                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                                  : 'border-gray-300'
                              }`}
                              placeholder="contact@entreprise.com"
                            />
                            {!emailVerificationStatus.isVerified && (
                              <button
                                onClick={handleRequestEmailVerification}
                                disabled={emailVerificationStatus.isRequesting}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                              >
                                {emailVerificationStatus.isRequesting ? (
                                  <i className="fas fa-spinner fa-spin"></i>
                                ) : (
                                  'Vérifier'
                                )}
                              </button>
                            )}
                          </div>
                          {!emailVerificationStatus.isVerified && (
                            <p className="mt-1 text-xs text-red-600">
                              Email non vérifié. Cliquez sur "Vérifier" pour recevoir un lien de vérification.
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Téléphone de contact
                          </label>
                      <input
                            type="tel"
                            value={recruiterData.contact_phone}
                            onChange={(e) => handleProfileChange('contact_phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            placeholder="+33 1 23 45 67 89"
                      />
                        </div>
                      </div>
                    </div>

                    {/* Localisation */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
                        Localisation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pays
                          </label>
                          <select
                            value={locationData.country_id || ''}
                            onChange={(e) => handleLocationChange('country_id', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner un pays</option>
                            {countries.map((country) => (
                              <option key={country.id} value={country.id}>{country.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Région
                          </label>
                          <select
                            value={locationData.region_id || ''}
                            onChange={(e) => handleLocationChange('region_id', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            disabled={!locationData.country_id}
                          >
                            <option value="">Sélectionner une région</option>
                            {regions.map((region) => (
                              <option key={region.id} value={region.id}>{region.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ville
                          </label>
                      <input
                        type="text"
                            value={locationData.city}
                            onChange={(e) => handleLocationChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            placeholder="Ville"
                      />
                    </div>
                    <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Code postal
                          </label>
                      <input
                        type="text"
                            value={locationData.postal_code}
                            onChange={(e) => handleLocationChange('postal_code', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            placeholder="Code postal"
                      />
                    </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Adresse complète
                          </label>
                          <input
                            type="text"
                            value={locationData.address}
                            onChange={(e) => handleLocationChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            placeholder="Adresse complète de l'entreprise"
                    />
                  </div>
                      </div>
                    </div>

                    {/* Documents de l'entreprise */}
                      <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <i className="fas fa-file-alt mr-2 text-fuchsia-600"></i>
                        Documents de l'entreprise
                      </h3>
                      <div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleDocumentsChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Formats acceptés : PDF, DOC, DOCX. Taille max : 10 MB
                        </p>
                      </div>
                    </div>

                    {/* Bouton de sauvegarde */}
                    <div className="flex justify-end pt-6 border-t">
                  <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-fuchsia-600 text-white px-6 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Visibility Tab */}
                {activeTab === 'visibility' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        <i className="fas fa-eye mr-2 text-fuchsia-600"></i>
                        Gestion de la visibilité du profil
                      </h3>
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                              <i className="fas fa-info-circle text-blue-400"></i>
                        </div>
                        <div className="ml-3">
                              <h4 className="text-sm font-medium text-blue-800">Visibilité actuelle</h4>
                              <p className="mt-1 text-sm text-blue-700">
                                Votre profil est actuellement visible : <strong>{visibilityData.profile_visibility}</strong>
                              </p>
                          </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="visibility"
                              value="PUBLIC"
                              checked={visibilityData.profile_visibility === 'PUBLIC'}
                              onChange={(e) => handleVisibilityChange(e.target.value)}
                              className="mr-3 text-fuchsia-600 focus:ring-fuchsia-500"
                            />
                            <div>
                              <span className="font-medium text-gray-900">Public</span>
                              <p className="text-sm text-gray-500">Visible par tous les visiteurs</p>
                      </div>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="visibility"
                              value="RECRUITERS_ONLY"
                              checked={visibilityData.profile_visibility === 'RECRUITERS_ONLY'}
                              onChange={(e) => handleVisibilityChange(e.target.value)}
                              className="mr-3 text-fuchsia-600 focus:ring-fuchsia-500"
                            />
                            <div>
                              <span className="font-medium text-gray-900">Recruteurs uniquement</span>
                              <p className="text-sm text-gray-500">Visible uniquement par les recruteurs</p>
                    </div>
                          </label>

                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="visibility"
                              value="PRIVATE"
                              checked={visibilityData.profile_visibility === 'PRIVATE'}
                              onChange={(e) => handleVisibilityChange(e.target.value)}
                              className="mr-3 text-fuchsia-600 focus:ring-fuchsia-500"
                            />
                            <div>
                              <span className="font-medium text-gray-900">Privé</span>
                              <p className="text-sm text-gray-500">Visible uniquement par vous</p>
                        </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    {/* Password Management */}
                    <PasswordManagement />
                    
                    {/* Session Management */}
                    <SessionManagement />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:w-1/3">
            {/* Account Summary */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-building mr-2 text-fuchsia-600"></i>
                Résumé du compte
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-building text-fuchsia-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{recruiterData.company_name || 'Nom de l\'entreprise'}</h4>
                    <p className="text-sm text-gray-600">{userProfile.email}</p>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type de profil</span>
                    <span className="font-medium">Recruteur</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-600">Statut</span>
                    <span className="font-medium text-green-600">Actif</span>
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
                <Link to="/recruteur/profil" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                  <i className="fas fa-eye text-fuchsia-600 mr-3"></i>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Voir mon profil</h4>
                    <p className="text-xs text-gray-500">Comment les autres me voient</p>
                  </div>
                </Link>
                
                <Link to="/recruteur/profil-public" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                  <i className="fas fa-globe text-green-600 mr-3"></i>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Profil public</h4>
                    <p className="text-xs text-gray-500">Voir mon profil public</p>
                  </div>
                </Link>
                
                <Link to="/recruteur/dashboard" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                  <i className="fas fa-chart-bar text-purple-600 mr-3"></i>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Dashboard</h4>
                    <p className="text-xs text-gray-500">Voir mes statistiques</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 