import api from './api';

/**
 * Service pour la recherche publique des utilisateurs
 */
class PublicUserSearchService {
  /**
   * Rechercher des utilisateurs avec filtres avancés
   * GET /api/common/users/search/
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise} - Promesse contenant les résultats de recherche
   */
  async searchUsers(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Filtres de base
      if (filters.user_type && filters.user_type !== 'all') {
        params.append('user_type', filters.user_type);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Filtres de compétences
      if (filters.skills) {
        params.append('skills', filters.skills);
      }
      
      // Filtres de localisation
      if (filters.country) {
        params.append('country', filters.country);
      }
      if (filters.region) {
        params.append('region', filters.region);
      }
      
      // Filtres d'expérience
      if (filters.experience_min) {
        params.append('experience_min', filters.experience_min);
      }
      if (filters.experience_max) {
        params.append('experience_max', filters.experience_max);
      }
      
      // Filtres spécifiques aux prestataires
      if (filters.availability) {
        params.append('availability', filters.availability);
      }
      if (filters.hourly_rate_min) {
        params.append('hourly_rate_min', filters.hourly_rate_min);
      }
      if (filters.hourly_rate_max) {
        params.append('hourly_rate_max', filters.hourly_rate_max);
      }
      
      // Filtres spécifiques aux recruteurs
      if (filters.sector) {
        params.append('sector', filters.sector);
      }
      if (filters.company_size) {
        params.append('company_size', filters.company_size);
      }
      
      // Filtres de pagination et tri
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.page_size) {
        params.append('page_size', filters.page_size);
      }
      if (filters.ordering) {
        params.append('ordering', filters.ordering);
      }
      
      const url = `/api/common/users/search/${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      
      console.log('🔍 Recherche d\'utilisateurs réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la recherche d\'utilisateurs:', error);
      throw error;
    }
  }

  /**
   * Formater un utilisateur pour l'affichage
   * @param {Object} userData - Données brutes de l'utilisateur
   * @returns {Object} - Utilisateur formaté pour l'affichage
   */
  formatUserForDisplay(userData) {
    if (!userData) return null;

    const { user_type, profile } = userData;
    
    if (user_type === 'PRESTATAIRE') {
      return this.formatProviderForDisplay(profile);
    } else if (user_type === 'CANDIDAT') {
      return this.formatCandidateForDisplay(profile);
    } else if (user_type === 'RECRUTEUR') {
      return this.formatRecruiterForDisplay(profile);
    }
    
    return null;
  }

  /**
   * Formater un prestataire pour l'affichage
   * @param {Object} profile - Profil du prestataire
   * @returns {Object} - Prestataire formaté
   */
  formatProviderForDisplay(profile) {
    if (!profile) return null;

    return {
      id: profile.id,
      userType: 'PRESTATAIRE',
      userTypeDisplay: 'Prestataire',
      username: profile.user?.username || 'N/A',
      firstName: profile.user?.first_name || 'N/A',
      lastName: profile.user?.last_name || 'N/A',
      displayName: profile.display_name || `${profile.user?.first_name || ''} ${profile.user?.last_name || ''}`.trim() || 'N/A',
      providerType: profile.provider_type || 'N/A',
      specializations: profile.specializations || 'Aucune spécialisation',
      hourlyRate: profile.hourly_rate ? `${profile.hourly_rate}€/h` : 'Tarif non précisé',
      availability: this.getAvailabilityDisplay(profile.availability),
      availabilityColor: this.getAvailabilityColor(profile.availability),
      yearsExperience: profile.years_experience || 0,
      completedProjects: profile.completed_projects || 0,
      country: profile.country?.name || 'Pays non précisé',
      region: profile.region?.name || 'Région non précisée',
      location: profile.country?.name && profile.region?.name ? 
        `${profile.region.name}, ${profile.country.name}` : 
        (profile.country?.name || profile.region?.name || 'Localisation non précisée'),
      createdAt: profile.user?.created_at,
      lastActivity: profile.user?.last_activity,
      skills: profile.specializations ? profile.specializations.split(',').map(s => s.trim()) : []
    };
  }

  /**
   * Formater un candidat pour l'affichage
   * @param {Object} profile - Profil du candidat
   * @returns {Object} - Candidat formaté
   */
  formatCandidateForDisplay(profile) {
    if (!profile) return null;

    return {
      id: profile.id,
      userType: 'CANDIDAT',
      userTypeDisplay: 'Candidat',
      username: profile.user?.username || 'N/A',
      firstName: profile.user?.first_name || 'N/A',
      lastName: profile.user?.last_name || 'N/A',
      displayName: profile.display_name || `${profile.user?.first_name || ''} ${profile.user?.last_name || ''}`.trim() || 'N/A',
      skills: profile.skills || 'Aucune compétence',
      technologies: profile.technologies || 'Aucune technologie',
      yearsExperience: profile.years_experience || 0,
      about: profile.about || 'Aucune description',
      country: profile.country?.name || 'Pays non précisé',
      region: profile.region?.name || 'Région non précisée',
      location: profile.country?.name && profile.region?.name ? 
        `${profile.region.name}, ${profile.country.name}` : 
        (profile.country?.name || profile.region?.name || 'Localisation non précisée'),
      createdAt: profile.user?.created_at,
      lastActivity: profile.user?.last_activity,
      skillsList: profile.skills ? profile.skills.split(',').map(s => s.trim()) : []
    };
  }

  /**
   * Formater un recruteur pour l'affichage
   * @param {Object} profile - Profil du recruteur
   * @returns {Object} - Recruteur formaté
   */
  formatRecruiterForDisplay(profile) {
    if (!profile) return null;

    return {
      id: profile.id,
      userType: 'RECRUTEUR',
      userTypeDisplay: 'Recruteur',
      username: profile.user?.username || 'N/A',
      firstName: profile.user?.first_name || 'N/A',
      lastName: profile.user?.last_name || 'N/A',
      displayName: profile.display_name || `${profile.user?.first_name || ''} ${profile.user?.last_name || ''}`.trim() || 'N/A',
      companyName: profile.company_name || 'Entreprise non précisée',
      sector: profile.sector || 'Secteur non précisé',
      companySize: profile.company_size || 'Taille non précisée',
      website: profile.website || null,
      country: profile.country?.name || 'Pays non précisé',
      region: profile.region?.name || 'Région non précisée',
      location: profile.country?.name && profile.region?.name ? 
        `${profile.region.name}, ${profile.country.name}` : 
        (profile.country?.name || profile.region?.name || 'Localisation non précisée'),
      createdAt: profile.user?.created_at,
      lastActivity: profile.user?.last_activity
    };
  }

  /**
   * Obtenir l'affichage de la disponibilité
   * @param {string} availability - Disponibilité de l'API
   * @returns {string} - Disponibilité formatée pour l'affichage
   */
  getAvailabilityDisplay(availability) {
    const availabilityMap = {
      'AVAILABLE': 'Disponible',
      'BUSY': 'Occupé',
      'UNAVAILABLE': 'Non disponible'
    };
    return availabilityMap[availability] || 'Non précisé';
  }

  /**
   * Obtenir la couleur de la disponibilité
   * @param {string} availability - Disponibilité de l'API
   * @returns {string} - Classe CSS de couleur
   */
  getAvailabilityColor(availability) {
    const colorMap = {
      'AVAILABLE': 'text-green-600',
      'BUSY': 'text-yellow-600',
      'UNAVAILABLE': 'text-red-600'
    };
    return colorMap[availability] || 'text-gray-600';
  }

  /**
   * Obtenir l'icône pour le type d'utilisateur
   * @param {string} userType - Type d'utilisateur
   * @returns {string} - Classe CSS de l'icône
   */
  getUserTypeIcon(userType) {
    const iconMap = {
      'CANDIDAT': 'fas fa-user-graduate',
      'PRESTATAIRE': 'fas fa-user-cog',
      'RECRUTEUR': 'fas fa-user-tie'
    };
    return iconMap[userType] || 'fas fa-user';
  }

  /**
   * Obtenir la couleur pour le type d'utilisateur
   * @param {string} userType - Type d'utilisateur
   * @returns {string} - Classe CSS de couleur
   */
  getUserTypeColor(userType) {
    const colorMap = {
      'CANDIDAT': 'text-blue-600',
      'PRESTATAIRE': 'text-green-600',
      'RECRUTEUR': 'text-orange-600'
    };
    return colorMap[userType] || 'text-gray-600';
  }

  /**
   * Formater la date pour l'affichage
   * @param {string} dateString - Date ISO
   * @returns {string} - Date formatée
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
    
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Obtenir les filtres par défaut
   * @returns {Object} - Filtres par défaut
   */
  getDefaultFilters() {
    return {
      user_type: 'all',
      search: '',
      skills: '',
      country: '',
      region: '',
      experience_min: '',
      experience_max: '',
      availability: '',
      hourly_rate_min: '',
      hourly_rate_max: '',
      sector: '',
      company_size: '',
      page: 1,
      page_size: 20,
      ordering: '-created_at'
    };
  }
}

export default new PublicUserSearchService(); 