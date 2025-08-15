import api from './api';

class JobService {
  
  /**
   * Récupération des offres d'emploi
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise} - Promesse contenant les offres
   */
  async getJobs(filters = {}) {
    try {
      const response = await api.get('/api/jobs/', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération des offres');
    }
  }

  /**
   * Récupération d'une offre d'emploi spécifique
   * @param {string} jobId - ID de l'offre
   * @returns {Promise} - Promesse contenant l'offre
   */
  async getJob(jobId) {
    try {
      const response = await api.get(`/api/jobs/${jobId}/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération de l\'offre');
    }
  }

  /**
   * Création d'une offre d'emploi
   * @param {Object} jobData - Données de l'offre
   * @returns {Promise} - Promesse contenant l'offre créée
   */
  async createJob(jobData) {
    try {
      const response = await api.post('/api/jobs/', jobData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la création de l\'offre');
    }
  }

  /**
   * Mise à jour d'une offre d'emploi
   * @param {string} jobId - ID de l'offre
   * @param {Object} jobData - Nouvelles données
   * @returns {Promise} - Promesse contenant l'offre mise à jour
   */
  async updateJob(jobId, jobData) {
    try {
      const response = await api.put(`/api/jobs/${jobId}/`, jobData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la mise à jour de l\'offre');
    }
  }

  /**
   * Suppression d'une offre d'emploi
   * @param {string} jobId - ID de l'offre
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteJob(jobId) {
    try {
      const response = await api.delete(`/api/jobs/${jobId}/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la suppression de l\'offre');
    }
  }

  /**
   * Postulation à une offre d'emploi
   * @param {string} jobId - ID de l'offre
   * @param {Object} applicationData - Données de candidature
   * @returns {Promise} - Promesse contenant la candidature
   */
  async applyToJob(jobId, applicationData) {
    try {
      const response = await api.post(`/api/jobs/${jobId}/apply/`, applicationData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la candidature');
    }
  }

  /**
   * Récupération des candidatures d'un utilisateur
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getUserApplications() {
    try {
      const response = await api.get('/api/jobs/applications/');
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération des candidatures');
    }
  }

  /**
   * Récupération des candidatures pour une offre (recruteur)
   * @param {string} jobId - ID de l'offre
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getJobApplications(jobId) {
    try {
      const response = await api.get(`/api/jobs/${jobId}/applications/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération des candidatures');
    }
  }

  /**
   * Mise à jour du statut d'une candidature
   * @param {string} applicationId - ID de la candidature
   * @param {string} status - Nouveau statut
   * @returns {Promise} - Promesse contenant la candidature mise à jour
   */
  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await api.patch(`/api/jobs/applications/${applicationId}/`, {
        status: status
      });
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la mise à jour du statut');
    }
  }

  // ===== NOUVELLES MÉTHODES POUR RECRUTEURS =====

  /**
   * Création d'une offre d'emploi par un recruteur
   * @param {Object} jobData - Données de l'offre
   * @returns {Promise} - Promesse contenant l'offre créée
   */
  async createJobOffer(jobData) {
    try {
      const response = await api.post('/api/jobs/job-offers/', jobData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la création de l\'offre');
    }
  }

  /**
   * Récupération des offres d'emploi d'un recruteur
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise} - Promesse contenant les offres
   */
  async getMyJobOffers(filters = {}) {
    try {
      const response = await api.get('/api/jobs/my-job-offers/', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération de vos offres');
    }
  }

  /**
   * Récupération du détail complet d'une offre d'emploi (recruteur)
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse contenant l'offre
   */
  async getJobOfferDetail(offerId) {
    try {
      const response = await api.get(`/api/jobs/job-offers/${offerId}/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération du détail de l\'offre');
    }
  }

  /**
   * Récupération du détail public d'une offre d'emploi (pour visiteurs)
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse contenant l'offre
   */
  async getPublicJobOfferDetail(offerId) {
    try {
      // Utiliser uniquement l'endpoint public correct
      const response = await api.get(`/api/jobs/job-offers/${offerId}/`);
      return response.data;
    } catch (error) {
      // Pour cette méthode, on préserve l'erreur originale pour permettre la gestion des codes de statut
      // On ne passe pas par handleJobError qui perd les informations de réponse
      console.error('Erreur API getPublicJobOfferDetail:', error);
      
      // Si l'erreur a une réponse avec un statut, on la laisse remonter
      if (error.response) {
        throw error;
      }
      
      // Sinon, on utilise handleJobError pour les autres types d'erreurs
      throw this.handleJobError(error, 'Erreur lors de la récupération du détail de l\'offre');
    }
  }

  /**
   * Mise à jour d'une offre d'emploi par un recruteur
   * @param {string} offerId - ID de l'offre
   * @param {Object} updateData - Nouvelles données
   * @returns {Promise} - Promesse contenant l'offre mise à jour
   */
  async updateJobOffer(offerId, updateData) {
    try {
      const response = await api.patch(`/api/jobs/job-offers/${offerId}/`, updateData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la mise à jour de l\'offre');
    }
  }

  /**
   * Suppression d'une offre d'emploi par un recruteur
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteJobOffer(offerId) {
    try {
      const response = await api.delete(`/api/jobs/job-offers/${offerId}/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la suppression de l\'offre');
    }
  }

  /**
   * Recherche avancée d'offres d'emploi
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchJobOffers(searchParams) {
    try {
      const response = await api.post('/api/jobs/search/', searchParams);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la recherche d\'offres');
    }
  }

  // ===== NOUVELLES MÉTHODES POUR L'API PUBLIQUE DES OFFRES D'EMPLOI =====

  /**
   * Récupération des offres d'emploi publiques avec filtres et pagination
   * @param {Object} filters - Filtres de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les offres avec pagination
   */
  async getPublicJobOffers(filters = {}, page = 1, pageSize = 20) {
    try {
      const params = {
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      };
      
      const response = await api.get('/api/jobs/job-offers/', { params });
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération des offres d\'emploi');
    }
  }

  /**
   * Recherche d'offres par mot-clé
   * @param {string} query - Terme de recherche
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchPublicJobOffers(query, page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ query }, page, pageSize);
  }

  /**
   * Filtrage par département
   * @param {number} departmentId - ID du département
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByDepartment(departmentId, page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ department: departmentId }, page, pageSize);
  }

  /**
   * Filtrage par catégorie
   * @param {number} categoryId - ID de la catégorie
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByCategory(categoryId, page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ category: categoryId }, page, pageSize);
  }

  /**
   * Filtrage par type de contrat
   * @param {string} contractType - Type de contrat
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByContractType(contractType, page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ contract_type: contractType }, page, pageSize);
  }

  /**
   * Filtrage par expérience requise
   * @param {string} experience - Niveau d'expérience
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByExperience(experience, page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ experience_required: experience }, page, pageSize);
  }

  /**
   * Filtrage par mode de travail
   * @param {string} workMode - Mode de travail
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByWorkMode(workMode, page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ work_mode: workMode }, page, pageSize);
  }

  /**
   * Filtrage par salaire
   * @param {number} minSalary - Salaire minimum
   * @param {number} maxSalary - Salaire maximum (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterBySalary(minSalary, maxSalary = null, page = 1, pageSize = 20) {
    const filters = { salary_min: minSalary };
    if (maxSalary) filters.salary_max = maxSalary;
    return this.getPublicJobOffers(filters, page, pageSize);
  }

  /**
   * Filtrage par localisation
   * @param {number} countryId - ID du pays
   * @param {number} regionId - ID de la région (optionnel)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByLocation(countryId, regionId = null, page = 1, pageSize = 20) {
    const filters = { country: countryId };
    if (regionId) filters.region = regionId;
    return this.getPublicJobOffers(filters, page, pageSize);
  }

  /**
   * Filtrage par localisation textuelle
   * @param {string} location - Texte de localisation
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async filterByLocationText(location, page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ location }, page, pageSize);
  }

  /**
   * Filtrage des offres urgentes
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async getUrgentJobOffers(page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ is_urgent: true }, page, pageSize);
  }

  /**
   * Filtrage des offres sponsorisées
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async getSponsoredJobOffers(page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ is_sponsored: true }, page, pageSize);
  }

  /**
   * Tri des offres
   * @param {string} sortBy - Champ de tri
   * @param {string} sortOrder - Ordre de tri (asc/desc)
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async sortJobOffers(sortBy, sortOrder = 'desc', page = 1, pageSize = 20) {
    return this.getPublicJobOffers({ 
      sort_by: sortBy, 
      sort_order: sortOrder 
    }, page, pageSize);
  }

  /**
   * Combinaison de filtres avancés
   * @param {Object} filters - Objet contenant tous les filtres
   * @param {number} page - Numéro de page
   * @param {number} pageSize - Taille de page
   * @returns {Promise} - Promesse contenant les résultats
   */
  async getFilteredJobOffers(filters = {}, page = 1, pageSize = 20) {
    return this.getPublicJobOffers(filters, page, pageSize);
  }

  // ===== MÉTHODES EXISTANTES POUR BOURSES =====

  /**
   * Récupération des bourses
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise} - Promesse contenant les bourses
   */
  async getScholarships(filters = {}) {
    try {
      const response = await api.get('/api/scholarships/', { params: filters });
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération des bourses');
    }
  }

  /**
   * Récupération d'une bourse spécifique
   * @param {string} scholarshipId - ID de la bourse
   * @returns {Promise} - Promesse contenant la bourse
   */
  async getScholarship(scholarshipId) {
    try {
      const response = await api.get(`/api/scholarships/${scholarshipId}/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération de la bourse');
    }
  }

  /**
   * Création d'une bourse
   * @param {Object} scholarshipData - Données de la bourse
   * @returns {Promise} - Promesse contenant la bourse créée
   */
  async createScholarship(scholarshipData) {
    try {
      const response = await api.post('/api/scholarships/', scholarshipData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la création de la bourse');
    }
  }

  /**
   * Mise à jour d'une bourse
   * @param {string} scholarshipId - ID de la bourse
   * @param {Object} scholarshipData - Nouvelles données
   * @returns {Promise} - Promesse contenant la bourse mise à jour
   */
  async updateScholarship(scholarshipId, scholarshipData) {
    try {
      const response = await api.put(`/api/scholarships/${scholarshipId}/`, scholarshipData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la mise à jour de la bourse');
    }
  }

  /**
   * Suppression d'une bourse
   * @param {string} scholarshipId - ID de la bourse
   * @returns {Promise} - Promesse contenant la réponse
   */
  async deleteScholarship(scholarshipId) {
    try {
      const response = await api.delete(`/api/scholarships/${scholarshipId}/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la suppression de la bourse');
    }
  }

  /**
   * Candidature à une bourse
   * @param {string} scholarshipId - ID de la bourse
   * @param {Object} applicationData - Données de candidature
   * @returns {Promise} - Promesse contenant la candidature
   */
  async applyToScholarship(scholarshipId, applicationData) {
    try {
      const response = await api.post(`/api/scholarships/${scholarshipId}/apply/`, applicationData);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la candidature à la bourse');
    }
  }

  /**
   * Récupération des candidatures aux bourses d'un utilisateur
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getUserScholarshipApplications() {
    try {
      const response = await api.get('/api/scholarships/applications/');
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération des candidatures aux bourses');
    }
  }

  /**
   * Récupération des candidatures pour une bourse (recruteur)
   * @param {string} scholarshipId - ID de la bourse
   * @returns {Promise} - Promesse contenant les candidatures
   */
  async getScholarshipApplications(scholarshipId) {
    try {
      const response = await api.get(`/api/scholarships/${scholarshipId}/applications/`);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la récupération des candidatures à la bourse');
    }
  }

  /**
   * Recherche avancée de bourses
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchScholarships(searchParams) {
    try {
      const response = await api.post('/api/scholarships/search/', searchParams);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la recherche de bourses');
    }
  }

  /**
   * Gestion des erreurs
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleJobError(error, defaultMessage) {
    let message = defaultMessage;

    if (error.response?.data) {
      const errorData = error.response.data;
      
      if (errorData.error) {
        message = errorData.error;
      } else if (errorData.details) {
        const fieldErrors = Object.values(errorData.details).flat();
        message = fieldErrors.join(', ');
      } else if (typeof errorData === 'string') {
        message = errorData;
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error('Job Error:', error);
    return new Error(message);
  }
}

// Créer une instance unique du service
const jobService = new JobService();

export default jobService; 