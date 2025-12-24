import api from './api';
import { buildImageUrl, getApiBaseUrl } from '../utils/urlHelper';

/**
 * Service pour la gestion des profils prestataires
 */
class ProviderProfilService {
  /**
   * Convertir les chemins relatifs des fichiers en URLs complètes
   * @param {Object} profileData - Données du profil
   * @returns {Object} - Données avec URLs complètes
   */
  convertFileUrls(profileData) {
    const baseUrl = getApiBaseUrl();
    const fileFields = ['image', 'cv', 'portfolio', 'organization_logo'];
    
    const convertedData = { ...profileData };
    
    fileFields.forEach(field => {
      if (convertedData[field] && typeof convertedData[field] === 'string') {
        // Si c'est un chemin relatif, le convertir en URL complète
        if (convertedData[field].startsWith('/media/')) {
          convertedData[field] = `${baseUrl}${convertedData[field]}`;
          console.log(`🔄 URL convertie pour ${field}:`, convertedData[field]);
        }
      }
    });
    
    return convertedData;
  }

  /**
   * Récupérer le profil complet du prestataire
   * @returns {Promise} - Promesse contenant le profil complet
   */
  async getProviderProfile() {
    try {
      const response = await api.get('/api/auth/profile/provider/');
      const data = response.data;
      
      // Convertir les URLs des fichiers
      const dataWithFullUrls = this.convertFileUrls(data);
      
      console.log('📥 Profil récupéré:', dataWithFullUrls);
      return dataWithFullUrls;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil prestataire:', error);
      throw error;
    }
  }

  /**
   * Supprimer un fichier du profil prestataire
   * @param {string} field - Nom du champ de fichier (image, cv, portfolio, organization_logo)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async removeFile(field) {
    try {
      // Essayer d'abord l'endpoint de suppression directe
      try {
        const response = await api.delete(`/api/auth/profile/provider/remove-file/`, {
          data: { field_name: field }
        });
        console.log(`✅ Fichier ${field} supprimé avec succès:`, response.data);
        return response.data;
      } catch (deleteError) {
        // Si l'endpoint de suppression n'existe pas, utiliser une approche alternative
        console.log(`⚠️ Endpoint de suppression non disponible, utilisation de l'approche alternative`);
        
        // Créer un FormData avec le champ de fichier vide
        const formData = new FormData();
        formData.append(field, ''); // Champ vide pour indiquer la suppression
        
        // Mettre à jour le profil avec le champ vide
        const response = await api.put('/api/auth/profile/provider/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        console.log(`✅ Fichier ${field} supprimé via mise à jour du profil:`, response.data);
        return response.data;
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la suppression du fichier ${field}:`, error);
      throw error;
    }
  }

  /**
   * Mettre à jour le profil prestataire
   * @param {FormData} profileData - Données du profil (multipart/form-data)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateProviderProfile(profileData) {
    try {
      const response = await api.put('/api/auth/profile/provider/', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil prestataire:', error);
      throw error;
    }
  }

  /**
   * Préparer les données du profil pour l'envoi
   * @param {Object} profileData - Données du profil
   * @param {File[]} files - Fichiers à uploader
   * @returns {FormData} - FormData prêt pour l'envoi
   */
  prepareProfileData(profileData, files = {}) {
    const formData = new FormData();

    // Liste des champs de fichiers à exclure
    const fileFields = ['image', 'cv', 'portfolio', 'organization_logo'];

    // Liste des champs de localisation à exclure (gérés séparément)
    const locationFields = ['country', 'region'];

    // Ajouter seulement les champs textuels non vides et non null
    Object.keys(profileData).forEach(key => {
      // Exclure les champs de fichiers et de localisation
      if (!fileFields.includes(key) && !locationFields.includes(key)) {
        const value = profileData[key];
        if (value !== '' && value !== null && value !== undefined) {
            formData.append(key, value);
        }
      }
    });

    // Ajouter les fichiers seulement s'ils existent et sont de vrais fichiers
    if (files.image && files.image instanceof File) {
      formData.append('image', files.image);
    }
    if (files.cv && files.cv instanceof File) {
      formData.append('cv', files.cv);
    }
    if (files.portfolio && files.portfolio instanceof File) {
      formData.append('portfolio', files.portfolio);
    }
    if (files.organization_logo && files.organization_logo instanceof File) {
      formData.append('organization_logo', files.organization_logo);
    }

    // Gérer les champs de suppression de fichiers
    Object.keys(files).forEach(key => {
      if (files[key] === null && key.endsWith('_delete')) {
        const fieldName = key.replace('_delete', '');
        formData.append(`${fieldName}_delete`, 'true');
        console.log(`🗑️ Champ marqué pour suppression: ${fieldName}`);
      }
    });

    // Debug: afficher le contenu du FormData
    console.log('📤 FormData contenu pour prestataire:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    return formData;
  }

  /**
   * Valider les données du profil avant envoi
   * @param {Object} profileData - Données du profil
   * @returns {Object} - Résultat de la validation
   */
  validateProfileData(profileData) {
    const errors = [];

    // Validation des champs obligatoires
    if (!profileData.provider_type) {
      errors.push('Le type de prestataire est obligatoire');
    }

    if (!profileData.specializations) {
      errors.push('Les spécialisations sont obligatoires');
    }

    if (!profileData.hourly_rate || isNaN(profileData.hourly_rate)) {
      errors.push('Le taux horaire doit être un nombre valide');
    }

    if (!profileData.daily_rate || isNaN(profileData.daily_rate)) {
      errors.push('Le taux journalier doit être un nombre valide');
    }

    if (!profileData.availability) {
      errors.push('La disponibilité est obligatoire');
    }

    if (!profileData.years_experience || isNaN(profileData.years_experience)) {
      errors.push('Les années d\'expérience doivent être un nombre valide');
    }

    // Validation spécifique pour les organisations
    if (profileData.provider_type === 'ORGANIZATION') {
      if (!profileData.organization_name) {
        errors.push('Le nom de l\'organisation est obligatoire');
      }
      if (!profileData.organization_description) {
        errors.push('La description de l\'organisation est obligatoire');
      }
      if (!profileData.team_size || isNaN(profileData.team_size)) {
        errors.push('La taille de l\'équipe doit être un nombre valide');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Formater les données du profil pour l'affichage
   * @param {Object} profileData - Données brutes du profil
   * @returns {Object} - Données formatées
   */
  formatProfileForDisplay(profileData) {
    return {
      ...profileData,
      hourly_rate: parseFloat(profileData.hourly_rate || 0).toFixed(2),
      daily_rate: parseFloat(profileData.daily_rate || 0).toFixed(2),
      years_experience: parseInt(profileData.years_experience || 0),
      completed_projects: parseInt(profileData.completed_projects || 0),
      team_size: profileData.provider_type === 'ORGANIZATION' ? parseInt(profileData.team_size || 0) : null,
      availability_display: this.getAvailabilityDisplay(profileData.availability),
      provider_type_display: this.getProviderTypeDisplay(profileData.provider_type)
    };
  }

  /**
   * Obtenir le texte d'affichage pour la disponibilité
   * @param {string} availability - Code de disponibilité
   * @returns {string} - Texte d'affichage
   */
  getAvailabilityDisplay(availability) {
    const availabilityMap = {
      'AVAILABLE': 'Disponible',
      'BUSY': 'Occupé',
      'UNAVAILABLE': 'Non disponible'
    };
    return availabilityMap[availability] || availability;
  }

  /**
   * Obtenir le texte d'affichage pour le type de prestataire
   * @param {string} providerType - Type de prestataire
   * @returns {string} - Texte d'affichage
   */
  getProviderTypeDisplay(providerType) {
    const typeMap = {
      'INDIVIDUAL': 'Individuel',
      'ORGANIZATION': 'Organisation'
    };
    return typeMap[providerType] || providerType;
  }

  /**
   * Récupérer la liste des pays disponibles
   * @returns {Promise} - Promesse contenant la liste des pays
   */
  async getCountries() {
    try {
      const response = await api.get('/api/auth/countries/');
      console.log('🌍 Pays récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error);
      throw error;
    }
  }

  /**
   * Récupérer la liste des régions pour un pays donné
   * @param {number} countryId - ID du pays
   * @returns {Promise} - Promesse contenant la liste des régions
   */
  async getRegions(countryId) {
    try {
      const response = await api.get(`/api/auth/countries/${countryId}/regions/`);
      console.log(`🏘️ Régions récupérées pour le pays ${countryId}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des régions pour le pays ${countryId}:`, error);
      throw error;
    }
  }

  /**
   * Mettre à jour la localisation du profil (pays et région)
   * @param {Object} locationData - Données de localisation {country_id, region_id}
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateLocation(locationData) {
    try {
      const response = await api.put('/api/auth/profile/location/', locationData);
      console.log('📍 Localisation mise à jour avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la localisation:', error);
      throw error;
    }
  }

  /**
   * Récupérer la localisation actuelle du profil
   * @returns {Promise} - Promesse contenant la localisation actuelle
   */
  async getCurrentLocation() {
    try {
      const response = await api.get('/api/auth/profile/location/');
      console.log('📍 Localisation actuelle récupérée:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation actuelle:', error);
      throw error;
    }
  }

  /**
   * Demander l'envoi d'un email de vérification
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async requestEmailVerification() {
    try {
      const response = await api.post('/api/auth/request-email-verification/');
      console.log('📧 Demande de vérification email envoyée:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la demande de vérification email:', error);
      throw error;
    }
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   * @returns {Promise} - Promesse contenant les informations de l'utilisateur
   */
  async getUserProfile() {
    try {
      const response = await api.get('/api/auth/profile/');
      console.log('👤 Profil utilisateur récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les infos de base de l'utilisateur
   * Modifie: username, email, first_name, last_name, phone
   * @param {Object} userData - Données utilisateur à mettre à jour
   * @returns {Promise} - Promesse contenant les données mises à jour
   */
  async updateUserProfile(userData) {
    try {
      const response = await api.put('/api/auth/profile/', userData);
      console.log('✅ Profil utilisateur mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil utilisateur:', error);
      throw error;
    }
  }

  /**
   * Préparer les données utilisateur pour l'envoi
   * @param {Object} userProfileData - Données de l'utilisateur
   * @returns {Object} - Données préparées pour l'envoi
   */
  prepareUserProfileData(userProfileData) {
    const updateData = {};

    // Champs modifiables (username EXCLU - non modifiable)
    const editableFields = ['email', 'first_name', 'last_name', 'phone'];

    editableFields.forEach(field => {
      if (userProfileData[field] !== undefined && userProfileData[field] !== null) {
        updateData[field] = userProfileData[field];
      }
    });

    console.log('📤 Données utilisateur préparées:', updateData);
    return updateData;
  }

  /**
   * Valider les données de l'utilisateur avant envoi
   * @param {Object} userData - Données à valider
   * @returns {Object} - Résultat de la validation
   */
  validateUserData(userData) {
    const errors = [];

    // Validation de l'email
    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.push('L\'adresse email est invalide');
      }
    }

    // Validation du téléphone (format basique)
    if (userData.phone) {
      const phoneRegex = /^\+?[0-9\s\-\.()]{7,}$/;
      if (!phoneRegex.test(userData.phone)) {
        errors.push('Le numéro de téléphone est invalide');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default new ProviderProfilService(); 