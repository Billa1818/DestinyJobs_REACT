import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import profileService from '../../services/profileService';
import authService from '../../services/authService';

const Profil = () => {
  // État principal du profil
  const [profileData, setProfileData] = useState({
    company_name: '',
    description: '',
    sector: '',
    company_size: 'MEDIUM',
    website: '',
    address: '',
    contact_email: '',
    contact_phone: '',
    first_name: '',
    last_name: ''
  });

  // État de la localisation
  const [locationData, setLocationData] = useState({
    country_id: null,
    region_id: null,
    city: '',
    postal_code: ''
  });

  // États de l'interface
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // États des fichiers
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [documentsFile, setDocumentsFile] = useState(null);
  
  // États des données de référence
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  
  // État du compte
  const [accountStatus, setAccountStatus] = useState('PENDING');
  const [isApproved, setIsApproved] = useState(false);

  // Options pour company_size selon l'API
  const companySizeOptions = [
    { value: 'STARTUP', label: 'Startup (1-10 employés)' },
    { value: 'SMALL', label: 'Petite entreprise (11-50 employés)' },
    { value: 'MEDIUM', label: 'Moyenne entreprise (51-200 employés)' },
    { value: 'LARGE', label: 'Grande entreprise (201-500 employés)' },
    { value: 'ENTERPRISE', label: 'Entreprise (500+ employés)' }
  ];

  // Options pour sector
  const sectorOptions = [
    'Technologies de l\'information',
    'Finance',
    'Santé',
    'Éducation',
    'Commerce',
    'Industrie',
    'Transport',
    'Tourisme',
    'Agriculture',
    'Autre'
  ];

  // Fonction pour afficher le statut du compte
  const getAccountStatusDisplay = () => {
    // Normaliser le statut du compte
    let normalizedStatus = accountStatus;
    
    // Si le statut est null ou undefined, utiliser is_approved
    if (!normalizedStatus && userProfile) {
      normalizedStatus = userProfile.is_approved ? 'ACTIVE' : 'PENDING';
    }
    
    // Mapper les statuts possibles
    switch (normalizedStatus) {
      case 'ACTIVE':
      case 'APPROVED':
      case true:
        return {
          icon: 'fas fa-check-circle',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'Compte Actif',
          description: 'Votre compte recruteur est actif et approuvé',
          status: 'success'
        };
      case 'PENDING':
      case 'WAITING':
      case false:
        return {
          icon: 'fas fa-clock',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'En Attente d\'Approbation',
          description: 'Votre compte est en cours de validation par nos équipes',
          status: 'warning'
        };
      case 'REJECTED':
      case 'DENIED':
        return {
          icon: 'fas fa-times-circle',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'Compte Rejeté',
          description: 'Votre compte a été rejeté. Contactez le support pour plus d\'informations',
          status: 'error'
        };
      case 'SUSPENDED':
      case 'BLOCKED':
        return {
          icon: 'fas fa-pause-circle',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          title: 'Compte Suspendu',
          description: 'Votre compte est temporairement suspendu',
          status: 'warning'
        };
      default:
        // Fallback intelligent basé sur is_approved
        if (userProfile?.is_approved) {
          return {
            icon: 'fas fa-check-circle',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            title: 'Compte Approuvé',
            description: 'Votre compte recruteur est approuvé et actif',
            status: 'success'
          };
        } else {
          return {
            icon: 'fas fa-clock',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            title: 'En Attente d\'Approbation',
            description: 'Votre compte est en cours de validation par nos équipes',
            status: 'warning'
          };
        }
    }
  };

  // Charger les données initiales
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupérer le profil utilisateur de base
        const userData = await profileService.getProfile();
        setUserProfile(userData);
        setIsApproved(userData.is_approved);
        
        // Récupérer le profil recruteur complet
        const recruiterData = await profileService.getRecruiterProfile();
        setRecruiterProfile(recruiterData);
        setAccountStatus(recruiterData.account_status || 'PENDING');
        
        // Mettre à jour les états avec les données récupérées
        setProfileData({
          company_name: recruiterData.company_name || '',
          description: recruiterData.description || '',
          sector: recruiterData.sector || '',
          company_size: recruiterData.company_size || 'MEDIUM',
          website: recruiterData.website || '',
          address: recruiterData.address || '',
          contact_email: recruiterData.contact_email || userData.email || '',
          contact_phone: recruiterData.contact_phone || '',
          first_name: userData.first_name || '',
          last_name: userData.last_name || ''
        });

        // Mettre à jour la localisation
        if (recruiterData.country) {
          setLocationData(prev => ({
            ...prev,
            country_id: recruiterData.country.id,
            region_id: recruiterData.region?.id || null
          }));
        }

        // Charger les pays
        await loadCountries();
        
        // Charger les régions si un pays est sélectionné
        if (recruiterData.country?.id) {
          await loadRegions(recruiterData.country.id);
        }

      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
        setError('Erreur lors du chargement du profil. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // Charger la liste des pays
  const loadCountries = async () => {
    try {
      const countriesData = await profileService.getCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Erreur lors du chargement des pays:', error);
    }
  };

  // Charger les régions d'un pays
  const loadRegions = async (countryId) => {
    try {
      if (countryId) {
        const regionsData = await profileService.getRegions(countryId);
        setRegions(regionsData);
      } else {
        setRegions([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des régions:', error);
      setRegions([]);
    }
  };

  // Gérer les changements dans le formulaire principal
  const handleInputChange = (field, value) => {
    // Empêcher la modification de l'email si elle n'est pas vérifiée
    if (field === 'contact_email' && !userProfile?.email_verified) {
      return;
    }
    
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gérer les changements de localisation
  const handleLocationChange = (field, value) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value
    }));

    // Si le pays change, recharger les régions
    if (field === 'country_id') {
      setLocationData(prev => ({ ...prev, region_id: null }));
      loadRegions(value);
    }
  };

  // Gérer le changement de logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      
      // Créer un aperçu
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Gérer le changement de documents
  const handleDocumentsChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentsFile(file);
    }
  };

  // Sauvegarder le profil
  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Vérifier que l'utilisateur est approuvé
      if (!isApproved) {
        setError('Vous ne pouvez pas modifier votre profil tant que votre compte n\'est pas approuvé.');
        return;
      }

      // Créer FormData pour l'upload des fichiers
      const formData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(profileData).forEach(key => {
        if (profileData[key]) {
          formData.append(key, profileData[key]);
        }
      });

      // Ajouter les fichiers
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      if (documentsFile) {
        formData.append('company_documents', documentsFile);
      }

      // Mettre à jour le profil recruteur
      await profileService.updateRecruiterProfile(formData);

      // Mettre à jour les informations utilisateur (first_name, last_name, email)
      const userUpdateData = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.contact_email
      };
      
      await authService.updateProfile(userUpdateData);

      // Mettre à jour la localisation si nécessaire
      if (locationData.country_id) {
        await profileService.updateLocation({
          country_id: locationData.country_id,
          region_id: locationData.region_id,
          address: locationData.address,
          city: locationData.city,
          postal_code: locationData.postal_code
        });
      }

      setSuccessMessage('Profil mis à jour avec succès !');
      
      // Recharger les données
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      if (error.response?.status === 403) {
        setError('Accès refusé. Vérifiez que votre compte est approuvé.');
      } else if (error.response?.status === 400) {
        setError('Données invalides. Vérifiez vos informations.');
      } else {
        setError('Erreur lors de la sauvegarde. Veuillez réessayer.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Afficher un message de succès
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
                <div>
              <h1 className="text-3xl font-bold text-gray-900">Profil Entreprise</h1>
              <p className="mt-2 text-gray-600">
                Gérez les informations de votre entreprise et votre profil recruteur
              </p>
                </div>
            
            <div className="flex items-center space-x-3">
            <Link 
              to={`/entreprise/${recruiterProfile?.id}`}
                className="inline-flex items-center px-4 py-2 border border-fuchsia-300 rounded-lg text-sm font-medium text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100 hover:border-fuchsia-400 transition-colors duration-200"
            >
                <i className="fas fa-eye mr-2"></i>
                Aperçu public
            </Link>
            </div>
          </div>
        </div>

        {/* Statut du compte */}
        <div className="mb-8">
          <div className={`p-6 rounded-xl border-2 ${getAccountStatusDisplay().borderColor} ${getAccountStatusDisplay().bgColor} shadow-sm`}>
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-full ${getAccountStatusDisplay().bgColor.replace('50', '100')}`}>
                <i className={`${getAccountStatusDisplay().icon} text-2xl ${getAccountStatusDisplay().color}`}></i>
              </div>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${getAccountStatusDisplay().color} mb-2`}>
                  {getAccountStatusDisplay().title}
                </h3>
                <p className={`text-sm ${getAccountStatusDisplay().color} opacity-90 leading-relaxed`}>
                  {getAccountStatusDisplay().description}
                </p>
                
                {/* Actions selon le statut */}
                {getAccountStatusDisplay().status === 'error' && (
                  <div className="mt-3">
                    <button className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-xs rounded-md hover:bg-red-200 transition-colors duration-200">
                      <i className="fas fa-headset mr-1"></i>
                      Contacter le support
                    </button>
                  </div>
                )}
                
                {getAccountStatusDisplay().status === 'warning' && accountStatus === 'PENDING' && (
                  <div className="mt-3">
                    <p className="text-xs text-yellow-700 opacity-80">
                      <i className="fas fa-info-circle mr-1"></i>
                      Le processus d'approbation prend généralement 24-48h
                    </p>
                  </div>
                )}
              </div>
                </div>
            </div>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <i className="fas fa-exclamation-circle text-red-400 mr-2"></i>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <i className="fas fa-check-circle text-green-400 mr-2"></i>
              <p className="text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Formulaire principal */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Informations de l'Entreprise</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Logo de l'entreprise */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Logo de l'entreprise
              </label>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Aperçu du logo */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    {(logoPreview || recruiterProfile?.logo) ? (
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg bg-white">
                        <img
                          src={logoPreview || `http://localhost:8000${recruiterProfile?.logo}`}
                          alt="Logo entreprise"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center">
                        <div className="text-center">
                          <i className="fas fa-building text-4xl text-gray-400 mb-2"></i>
                          <p className="text-sm text-gray-500">Aucun logo</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Bouton de suppression du logo */}
                    {(logoPreview || recruiterProfile?.logo) && (
                      <button
                        onClick={() => {
                          setLogoFile(null);
                          setLogoPreview(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                        title="Supprimer le logo"
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Zone d'upload */}
                <div className="flex-1 min-w-0">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-fuchsia-300 rounded-lg text-sm font-medium text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100 hover:border-fuchsia-400 transition-colors duration-200">
                        <i className="fas fa-upload mr-2"></i>
                        Choisir un logo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                      
                      {logoFile && (
                        <span className="text-sm text-green-600 font-medium">
                          <i className="fas fa-check mr-1"></i>
                          {logoFile.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Formats supportés :</strong> JPG, PNG, WebP</p>
                      <p><strong>Taille maximale :</strong> 5 MB</p>
                      <p><strong>Dimensions recommandées :</strong> 300x300px</p>
                    </div>
                    
                    {/* Aperçu en temps réel */}
                    {logoFile && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700 font-medium mb-2">
                          <i className="fas fa-eye mr-1"></i>
                          Aperçu du nouveau logo
                        </p>
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-blue-200">
                          <img
                            src={logoPreview}
                            alt="Aperçu logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Nom de l'entreprise */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                value={profileData.company_name}
                onChange={(e) => handleInputChange('company_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                placeholder="Nom de votre entreprise"
                required
              />
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de l'entreprise
              </label>
              <textarea
                value={profileData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                placeholder="Décrivez votre entreprise, ses activités, sa mission..."
              />
            </div>

            {/* Secteur et taille */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-industry text-fuchsia-500 mr-2"></i>
                Secteur et Taille
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Secteur d'activité
                  </label>
                  <select 
                    value={profileData.sector}
                    onChange={(e) => handleInputChange('sector', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                  >
                    <option value="">Sélectionner un secteur</option>
                    {sectorOptions.map((sector) => (
                      <option key={sector} value={sector}>
                        {sector}
                      </option>
                    ))}
                                </select>
                            </div>

                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taille de l'entreprise
                  </label>
                  <select 
                    value={profileData.company_size}
                    onChange={(e) => handleInputChange('company_size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                  >
                    {companySizeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                                </select>
                            </div>
              </div>
            </div>

            {/* Site web et adresse */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-globe text-fuchsia-500 mr-2"></i>
                Site Web et Adresse
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site web
                  </label>
                  <input 
                    type="url"
                    value={profileData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                    placeholder="https://www.votreentreprise.com"
                  />
                            </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Adresse de votre entreprise"
                  />
                            </div>
                        </div>
            </div>

            {/* Localisation */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-map-marker-alt text-fuchsia-500 mr-2"></i>
                Localisation
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays *
                    </label>
                    <select
                      value={locationData.country_id || ''}
                      onChange={(e) => handleLocationChange('country_id', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                      required
                    >
                      <option value="">Sélectionner un pays</option>
                      {countries.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Région
                    </label>
                    <select
                      value={locationData.region_id || ''}
                      onChange={(e) => handleLocationChange('region_id', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      disabled={!locationData.country_id}
                    >
                      <option value="">Sélectionner une région</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={locationData.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Code postal"
                    />
                                </div>
                </div>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-address-book text-fuchsia-500 mr-2"></i>
                Informations de Contact
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de contact *
                    </label>
                    <input 
                      type="email" 
                      value={profileData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                      placeholder="contact@votreentreprise.com"
                      required
                    />
                                </div>

                            <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone de contact
                    </label>
                  <input 
                      type="tel"
                      value={profileData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                      placeholder="+33 1 23 45 67 89"
                  />
                            </div>
                        </div>
                    </div>
                </div>

            {/* Documents de l'entreprise */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents de l'Entreprise</h3>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  {/* Upload de nouveaux documents */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Documents justificatifs
                    </label>
                    
                    <div className="flex items-center space-x-3">
                      <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-fuchsia-300 rounded-lg text-sm font-medium text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100 hover:border-fuchsia-400 transition-colors duration-200">
                        <i className="fas fa-file-upload mr-2"></i>
                        Choisir un document
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleDocumentsChange}
                          className="hidden"
                        />
                      </label>
                      
                      {documentsFile && (
                        <span className="text-sm text-green-600 font-medium">
                          <i className="fas fa-check mr-1"></i>
                          {documentsFile.name}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600 space-y-1">
                      <p><strong>Formats supportés :</strong> PDF, DOC, DOCX</p>
                      <p><strong>Taille maximale :</strong> 10 MB</p>
                                    </div>
                                    </div>

                  {/* Document actuel */}
                  {recruiterProfile?.company_documents && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <i className="fas fa-file-alt text-blue-500 text-xl"></i>
                                    <div>
                            <p className="text-sm font-medium text-blue-800">
                              Document actuel
                            </p>
                            <p className="text-xs text-blue-600">
                              {recruiterProfile.company_documents.split('/').pop()}
                            </p>
                                </div>
                            </div>
                        
                        <div className="flex space-x-2">
                          <a 
                            href={`http://localhost:8000${recruiterProfile.company_documents}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200 transition-colors duration-200"
                          >
                            <i className="fas fa-eye mr-1"></i>
                            Voir
                          </a>
                          <a 
                            href={`http://localhost:8000${recruiterProfile.company_documents}`}
                            download
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 text-xs rounded-md hover:bg-green-200 transition-colors duration-200"
                          >
                            <i className="fas fa-download mr-1"></i>
                            Télécharger
                          </a>
                            </div>
                        </div>
                    </div>
                  )}

                  {/* Aperçu du nouveau document */}
                  {documentsFile && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium mb-2">
                        <i className="fas fa-eye mr-1"></i>
                        Nouveau document sélectionné
                      </p>
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-file-alt text-green-500 text-xl"></i>
                        <span className="text-sm text-green-700">{documentsFile.name}</span>
                        <span className="text-xs text-green-600">
                          ({(documentsFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                </div>
                    </div>
                  )}
                </div>
              </div>
                        </div>
                    </div>
                </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <i className="fas fa-user-circle text-fuchsia-500 mr-2"></i>
              Informations du Compte
              </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={userProfile?.username || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-500">
                  Le nom d'utilisateur ne peut pas être modifié
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email principal *
                </label>
                <input
                  type="email"
                  value={profileData.contact_email || userProfile?.email || ''}
                  onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  disabled={!userProfile?.email_verified}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200 ${
                    !userProfile?.email_verified
                      ? 'border-red-300 bg-red-50 text-red-700 cursor-not-allowed focus:ring-0 focus:border-red-300'
                      : 'border-gray-300 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent'
                  }`}
                  placeholder="votre@email.com"
                  required
                  title={!userProfile?.email_verified ? "L'email ne peut pas être modifié tant qu'il n'est pas vérifié" : ""}
                />
                
                {!userProfile?.email_verified && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-exclamation-triangle text-red-500"></i>
                        <span className="text-sm text-red-700">
                          Votre email n'est pas vérifié. Cliquez sur "Vérifier" pour recevoir un email de confirmation.
                        </span>
                      </div>
                      
                      <button
                        onClick={async () => {
                          try {
                            await authService.requestEmailVerification();
                            setSuccessMessage('Email de vérification envoyé ! Vérifiez votre boîte de réception.');
                          } catch (error) {
                            setError('Erreur lors de l\'envoi de l\'email de vérification. Veuillez réessayer.');
                          }
                        }}
                        className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition-colors duration-200"
                        title="Demander la vérification de l'email"
                      >
                        <i className="fas fa-envelope mr-2"></i>
                        Vérifier l'email
                      </button>
                    </div>
                  </div>
                )}
                
                {userProfile?.email_verified && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span className="text-sm text-green-700">
                        Votre email est vérifié et vous pouvez le modifier en toute sécurité.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  value={profileData.first_name || userProfile?.first_name || ''}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Votre prénom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  value={profileData.last_name || userProfile?.last_name || ''}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Votre nom"
                />
              </div>
                                    </div>

            {/* Informations supplémentaires sur l'email */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <i className="fas fa-info-circle text-blue-500 text-lg mt-0.5"></i>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                      Vérification de l'Email
                    </h3>
                    <p className="text-sm text-blue-700">
                      {userProfile?.email_verified 
                        ? 'Votre email est vérifié et vous pouvez modifier votre profil en toute sécurité.'
                        : 'Votre email n\'est pas encore vérifié. Utilisez le bouton "Vérifier l\'email" ci-dessus pour recevoir un email de confirmation.'
                      }
                    </p>
                                </div>
                </div>
                            </div>
                        </div>
                    </div>
                </div>

        {/* Bouton de sauvegarde complètement en bas de la page */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || !isApproved}
            className={`inline-flex items-center px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 ${
              saving || !isApproved
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }`}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Sauvegarde...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Sauvegarder
              </>
            )}
          </button>
            </div>
        </div>
    </div>
  );
};

export default Profil;