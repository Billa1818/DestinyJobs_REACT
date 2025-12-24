import api from './api';
import { buildImageUrl, getApiBaseUrl } from '../utils/urlHelper';

/**
 * Service pour la gestion du profil public du prestataire
 * Note: Les IDs des prestataires sont numériques (pas des UUID)
 */
class ProviderPublicProfileService {
  /**
   * Récupérer le profil public du prestataire
   * GET /api/auth/provider/public/{provider_id}/
   * @param {string|number} providerId - ID numérique du prestataire
   * @returns {Promise} - Promesse contenant le profil public
   */
  async getPublicProfile(providerId) {
    try {
      const response = await api.get(`/api/auth/provider/public/${providerId}/`);
      console.log('📋 Profil public récupéré:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du profil public:', error);
      throw error;
    }
  }

  /**
   * Formater les données du profil pour l'affichage
   * @param {Object} profileData - Données du profil
   * @returns {Object} - Données formatées
   */
  formatProfileForDisplay(profileData) {
    if (!profileData || !profileData.provider) {
      return null;
    }

    const provider = profileData.provider;
    
    return {
      id: provider.id,
      userId: provider.user_id,
      username: provider.username,
      firstName: provider.first_name,
      lastName: provider.last_name,
      email: provider.email,
      phone: provider.phone,
      providerType: provider.provider_type,
      availability: provider.availability,
      specializations: provider.specializations,
      yearsExperience: provider.years_experience,
      hourlyRate: provider.hourly_rate,
      countryName: provider.country_name,
      regionName: provider.region_name,
      city: provider.city,
      completedProjects: provider.completed_projects,
      visibilityScore: provider.visibility_score,
      imageUrl: provider.image_url,
      portfolioUrl: provider.portfolio_url,
      createdAt: provider.created_at,
      updatedAt: provider.updated_at,
      
      // Données calculées
      fullName: `${provider.first_name || ''} ${provider.last_name || ''}`.trim(),
      displayName: provider.first_name && provider.last_name 
        ? `${provider.first_name} ${provider.last_name}`
        : provider.username,
      
      // URLs complètes pour les fichiers
      fullImageUrl: provider.image_url 
        ? (provider.image_url.startsWith('http') ? provider.image_url : buildImageUrl(provider.image_url))
        : null,
      fullPortfolioUrl: provider.portfolio_url
        ? (provider.portfolio_url.startsWith('http') ? provider.portfolio_url : buildImageUrl(provider.portfolio_url))
        : null,
      
      // Statuts formatés
      availabilityStatus: this.getAvailabilityStatus(provider.availability),
      providerTypeLabel: this.getProviderTypeLabel(provider.provider_type),
      
      // Localisation
      location: this.formatLocation(provider.country_name, provider.region_name, provider.city),
      
      // Expérience formatée
      experienceText: this.formatExperience(provider.years_experience),
      
      // Tarifs formatés
      hourlyRateFormatted: this.formatPrice(provider.hourly_rate, 'FCFA/h'),
      
      // Score de visibilité
      visibilityLevel: this.getVisibilityLevel(provider.visibility_score)
    };
  }

  /**
   * Obtenir le statut de disponibilité formaté
   * @param {string} availability - Statut de disponibilité
   * @returns {Object} - Statut formaté
   */
  getAvailabilityStatus(availability) {
    const statuses = {
      'AVAILABLE': {
        text: 'Disponible',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: 'fas fa-check-circle'
      },
      'BUSY': {
        text: 'Occupé',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        icon: 'fas fa-clock'
      },
      'UNAVAILABLE': {
        text: 'Non disponible',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: 'fas fa-times-circle'
      }
    };
    
    return statuses[availability] || {
      text: 'Non défini',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      icon: 'fas fa-question-circle'
    };
  }

  /**
   * Obtenir le label du type de prestataire
   * @param {string} providerType - Type de prestataire
   * @returns {string} - Label formaté
   */
  getProviderTypeLabel(providerType) {
    const labels = {
      'INDIVIDUAL': 'Individuel',
      'ORGANIZATION': 'Organisation'
    };
    
    return labels[providerType] || providerType;
  }

  /**
   * Formater la localisation
   * @param {string} country - Pays
   * @param {string} region - Région
   * @param {string} city - Ville
   * @returns {string} - Localisation formatée
   */
  formatLocation(country, region, city) {
    const parts = [];
    
    if (city) parts.push(city);
    if (region) parts.push(region);
    if (country) parts.push(country);
    
    return parts.length > 0 ? parts.join(', ') : 'Localisation non spécifiée';
  }

  /**
   * Formater l'expérience
   * @param {number} years - Années d'expérience
   * @returns {string} - Expérience formatée
   */
  formatExperience(years) {
    if (!years || years === 0) return 'Débutant';
    if (years === 1) return '1 an d\'expérience';
    return `${years} ans d'expérience`;
  }

  /**
   * Formater le prix
   * @param {string|number} price - Prix
   * @param {string} unit - Unité
   * @returns {string} - Prix formaté
   */
  formatPrice(price, unit = '') {
    if (!price) return 'Non spécifié';
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) return 'Non spécifié';
    return `${numericPrice.toLocaleString('fr-FR')} ${unit}`.trim();
  }

  /**
   * Obtenir le niveau de visibilité
   * @param {number} score - Score de visibilité
   * @returns {Object} - Niveau formaté
   */
  getVisibilityLevel(score) {
    if (score >= 80) {
      return {
        level: 'Excellent',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        icon: 'fas fa-star'
      };
    } else if (score >= 60) {
      return {
        level: 'Bon',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        icon: 'fas fa-thumbs-up'
      };
    } else if (score >= 40) {
      return {
        level: 'Moyen',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        icon: 'fas fa-minus'
      };
    } else {
      return {
        level: 'Faible',
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        icon: 'fas fa-exclamation-triangle'
      };
    }
  }

  /**
   * Valider l'ID du prestataire
   * @param {string|number} providerId - ID du prestataire (numérique)
   * @returns {boolean} - Validité de l'ID
   */
  validateProviderId(providerId) {
    if (!providerId) return false;
    
    // Convertir en nombre si c'est une chaîne
    const numericId = typeof providerId === 'string' ? parseInt(providerId, 10) : providerId;
    
    // Vérifier que c'est un nombre valide et positif
    if (isNaN(numericId) || numericId <= 0) return false;
    
    return true;
  }

  /**
   * Normaliser l'ID du prestataire
   * @param {string|number} providerId - ID du prestataire
   * @returns {number|null} - ID normalisé ou null si invalide
   */
  normalizeProviderId(providerId) {
    if (!this.validateProviderId(providerId)) return null;
    
    // Retourner l'ID comme nombre
    return typeof providerId === 'string' ? parseInt(providerId, 10) : providerId;
  }
}

export default new ProviderPublicProfileService(); 