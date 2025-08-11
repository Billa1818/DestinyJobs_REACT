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
   * Recherche avancée d'offres
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchJobs(searchParams) {
    try {
      const response = await api.post('/api/jobs/search/', searchParams);
      return response.data;
    } catch (error) {
      throw this.handleJobError(error, 'Erreur lors de la recherche');
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