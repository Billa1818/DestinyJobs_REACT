const API_URL = 'http://localhost:3003';

// Service de gestion des données
export const dataService = {
  // Offres d'emploi
  async getOffers(filters = {}) {
    try {
      let url = `${API_URL}/offers`;
      const params = new URLSearchParams();
      
      if (filters.location) params.append('location_like', filters.location);
      if (filters.type) params.append('type', filters.type);
      if (filters.experience) params.append('experience_like', filters.experience);
      if (filters.recruiterId) params.append('recruiterId', filters.recruiterId);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      throw error;
    }
  },

  async getOfferById(id) {
    try {
      console.log('Récupération de l\'offre:', id);
      const response = await fetch(`${API_URL}/offers/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Offre non trouvée:', id);
          return null;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const offer = await response.json();
      console.log('Offre trouvée:', offer);
      return offer;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'offre:', error);
      return null;
    }
  },

  async getOffersByRecruiter(recruiterId) {
    try {
      console.log('Récupération des offres du recruteur:', recruiterId);
      const response = await fetch(`${API_URL}/offers?recruiterId=${recruiterId}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const offers = await response.json();
      console.log('Offres du recruteur trouvées:', offers);
      return offers;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres du recruteur:', error);
      return [];
    }
  },

  // Bourses
  async getScholarships(filters = {}) {
    try {
      let url = `${API_URL}/scholarships`;
      const params = new URLSearchParams();
      
      if (filters.institution) params.append('institution_like', filters.institution);
      if (filters.amount) params.append('amount_like', filters.amount);
      if (filters.recruiterId) params.append('recruiterId', filters.recruiterId);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des bourses:', error);
      throw error;
    }
  },

  async getScholarshipById(id) {
    try {
      console.log('Récupération de la bourse:', id);
      const response = await fetch(`${API_URL}/scholarships/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Bourse non trouvée:', id);
          return null;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const scholarship = await response.json();
      console.log('Bourse trouvée:', scholarship);
      return scholarship;
    } catch (error) {
      console.error('Erreur lors de la récupération de la bourse:', error);
      return null;
    }
  },

  // Consultations
  async getConsultations(filters = {}) {
    try {
      let url = `${API_URL}/consultations`;
      const params = new URLSearchParams();
      
      if (filters.domaine) params.append('domaine', filters.domaine);
      if (filters.duree) params.append('duree', filters.duree);
      if (filters.recruiterId) params.append('recruiterId', filters.recruiterId);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des consultations:', error);
      throw error;
    }
  },

  async getConsultationById(id) {
    try {
      console.log('Récupération de la consultation:', id);
      const response = await fetch(`${API_URL}/consultations/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Consultation non trouvée:', id);
          return null;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const consultation = await response.json();
      console.log('Consultation trouvée:', consultation);
      return consultation;
    } catch (error) {
      console.error('Erreur lors de la récupération de la consultation:', error);
      return null;
    }
  },

  // Création de consultations (pour les recruteurs)
  async createConsultation(consultationData) {
    try {
      const response = await fetch(`${API_URL}/consultations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...consultationData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          isActive: true,
          applications: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la consultation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la consultation:', error);
      throw error;
    }
  },

  async updateConsultation(consultationId, consultationData) {
    try {
      const response = await fetch(`${API_URL}/consultations/${consultationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(consultationData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la consultation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la consultation:', error);
      throw error;
    }
  },

  async deleteConsultation(consultationId) {
    try {
      const response = await fetch(`${API_URL}/consultations/${consultationId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la consultation');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la consultation:', error);
      throw error;
    }
  },

  // Candidatures
  async submitApplication(applicationData) {
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          id: Date.now(),
          appliedAt: new Date().toISOString(),
          status: 'en_attente'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la soumission de la candidature');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la soumission de la candidature:', error);
      throw error;
    }
  },

  async submitScholarshipApplication(applicationData) {
    try {
      const response = await fetch(`${API_URL}/scholarship-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          id: Date.now(),
          appliedAt: new Date().toISOString(),
          status: 'en_attente'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la soumission de la candidature');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la soumission de la candidature:', error);
      throw error;
    }
  },

  async submitConsultationApplication(applicationData) {
    try {
      console.log('Soumission candidature consultation:', applicationData);
      
      // Vérifier si l'utilisateur a déjà postulé
      const existingApplication = await this.checkUserApplication(
        applicationData.userId, 
        applicationData.consultationId, 
        'consultation'
      );
      
      if (existingApplication) {
        throw new Error('Vous avez déjà postulé à cette consultation');
      }
      
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          type: 'consultation',
          status: 'en_attente',
          appliedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Candidature consultation soumise:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la soumission de la candidature consultation:', error);
      throw error;
    }
  },

  async submitFinancementApplication(applicationData) {
    try {
      console.log('Soumission candidature financement:', applicationData);
      
      // Vérifier si l'utilisateur a déjà postulé
      const existingApplication = await this.checkUserApplication(
        applicationData.userId, 
        applicationData.financementId, 
        'financement'
      );
      
      if (existingApplication) {
        throw new Error('Vous avez déjà postulé à ce financement');
      }
      
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...applicationData,
          type: 'financement',
          status: 'en_attente',
          appliedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Candidature financement soumise:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la soumission de la candidature financement:', error);
      throw error;
    }
  },

  async getUserApplications(userId) {
    try {
      const response = await fetch(`${API_URL}/applications?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  },

  async getApplicationsByOfferId(offerId) {
    try {
      const response = await fetch(`${API_URL}/applications?offerId=${offerId}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  },

  // Notifications
  async getUserNotifications(userId) {
    try {
      const response = await fetch(`${API_URL}/notifications?userId=${userId}`);
      return await response.json();
  } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId) {
    try {
      const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: true }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la notification');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
      throw error;
    }
  },

  // Blog
  async getBlogArticles(filters = {}) {
    try {
      let url = `${API_URL}/blog`;
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.author) params.append('author_like', filters.author);
      if (filters.recruiterId) params.append('recruiterId', filters.recruiterId);
      if (filters.isPublished !== undefined) params.append('isPublished', filters.isPublished);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error);
      throw error;
    }
  },

  async getBlogArticleById(id) {
    try {
      console.log('Récupération de l\'article:', id);
      const response = await fetch(`${API_URL}/blog/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Article non trouvé:', id);
          return null;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const article = await response.json();
      console.log('Article trouvé:', article);
      return article;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      return null;
    }
  },

  // Création d'offres (pour les recruteurs)
  async createOffer(offerData) {
    try {
      const response = await fetch(`${API_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...offerData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          isActive: true,
          applications: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'offre');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'offre:', error);
      throw error;
    }
  },

  async updateOffer(offerId, offerData) {
    try {
      const response = await fetch(`${API_URL}/offers/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'offre');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'offre:', error);
      throw error;
    }
  },

  async deleteOffer(offerId) {
    try {
      const response = await fetch(`${API_URL}/offers/${offerId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'offre');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre:', error);
      throw error;
    }
  },

  // Création de bourses (pour les recruteurs)
  async createScholarship(scholarshipData) {
    try {
      const response = await fetch(`${API_URL}/scholarships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...scholarshipData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          isActive: true,
          applications: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la bourse');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la bourse:', error);
      throw error;
    }
  },

  async updateScholarship(scholarshipId, scholarshipData) {
    try {
      const response = await fetch(`${API_URL}/scholarships/${scholarshipId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scholarshipData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la bourse');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bourse:', error);
      throw error;
    }
  },

  async deleteScholarship(scholarshipId) {
    try {
      const response = await fetch(`${API_URL}/scholarships/${scholarshipId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la bourse');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la bourse:', error);
      throw error;
    }
  },

  // Création d'articles de blog (pour les recruteurs)
  async createBlogArticle(articleData) {
    try {
      const response = await fetch(`${API_URL}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...articleData,
          id: Date.now(),
          publishedAt: new Date().toISOString(),
          isPublished: true,
          likes: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'article');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      throw error;
    }
  },

  async updateBlogArticle(articleId, articleData) {
    try {
      const response = await fetch(`${API_URL}/blog/${articleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'article');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      throw error;
    }
  },

  async deleteBlogArticle(articleId) {
    try {
      const response = await fetch(`${API_URL}/blog/${articleId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'article');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article:', error);
      throw error;
    }
  },

  // Gestion des candidatures reçues (pour les recruteurs)
  async getReceivedApplications(recruiterId) {
    try {
      // Récupérer toutes les offres du recruteur
      const offersResponse = await fetch(`${API_URL}/offers?recruiterId=${recruiterId}`);
      const offers = await offersResponse.json();
      
      const offerIds = offers.map(offer => offer.id);
      
      // Récupérer toutes les candidatures pour ces offres
      const applications = [];
      for (const offerId of offerIds) {
        const applicationsResponse = await fetch(`${API_URL}/applications?offerId=${offerId}`);
        const offerApplications = await applicationsResponse.json();
        applications.push(...offerApplications);
      }
      
      return applications;
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures reçues:', error);
      throw error;
    }
  },

  async updateApplicationStatus(applicationId, status) {
    try {
      const response = await fetch(`${API_URL}/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  // Statistiques pour les recruteurs
  async getRecruiterStats(recruiterId) {
    try {
      const offers = await this.getOffers({ recruiterId });
      const applications = await this.getReceivedApplications(recruiterId);
      const notifications = await this.getUserNotifications(recruiterId);
      
      return {
        totalOffers: offers.length,
        activeOffers: offers.filter(o => o.isActive).length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(a => a.status === 'en_attente').length,
        unreadNotifications: notifications.filter(n => !n.isRead).length
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  // Financements
  async getFinancements(filters = {}) {
    try {
      let url = `${API_URL}/financements`;
      const params = new URLSearchParams();
      
      if (filters.type) params.append('type', filters.type);
      if (filters.sector) params.append('sector', filters.sector);
      if (filters.recruiterId) params.append('recruiterId', filters.recruiterId);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des financements:', error);
      throw error;
    }
  },

  async getFinancementById(id) {
    try {
      console.log('Récupération du financement:', id);
      const response = await fetch(`${API_URL}/financements/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('Financement non trouvé:', id);
          return null;
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const financement = await response.json();
      console.log('Financement trouvé:', financement);
      return financement;
    } catch (error) {
      console.error('Erreur lors de la récupération du financement:', error);
      return null;
    }
  },

  // Création de financements (pour les recruteurs)
  async createFinancement(financementData) {
    try {
      const response = await fetch(`${API_URL}/financements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...financementData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          isActive: true,
          applications: 0
        }),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du financement');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création du financement:', error);
      throw error;
    }
  },

  async updateFinancement(financementId, financementData) {
    try {
      const response = await fetch(`${API_URL}/financements/${financementId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(financementData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du financement');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du financement:', error);
      throw error;
    }
  },

  async deleteFinancement(financementId) {
    try {
      const response = await fetch(`${API_URL}/financements/${financementId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du financement');
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du financement:', error);
      throw error;
    }
  },

  // Candidatures
  async createApplication(applicationData) {
    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...applicationData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création de la candidature');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de la candidature:', error);
      throw error;
    }
  },

  async checkUserApplication(userId, itemId, type) {
    try {
      console.log('Vérification candidature:', { userId, itemId, type });
      
      if (type === 'consultation') {
        // Pour les consultations, vérifier dans applications avec consultationId et userId
        const response = await fetch(`${API_URL}/applications?consultationId=${itemId}&userId=${userId}`);
        const applications = await response.json();
        console.log('Candidatures trouvées pour consultation:', applications);
        return applications.length > 0;
      } else {
        // Pour les offres, vérifier dans applications
        const response = await fetch(`${API_URL}/applications?${type === 'offer' ? 'offerId' : 'consultationId'}=${itemId}&${type === 'offer' ? 'candidateId' : 'providerId'}=${userId}`);
        const applications = await response.json();
        console.log('Candidatures trouvées pour offre:', applications);
        return applications.length > 0;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de la candidature:', error);
      return false;
    }
  },

  async getApplicationsByConsultationId(consultationId) {
    try {
      const response = await fetch(`${API_URL}/applications?consultationId=${consultationId}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  },

  async getApplicationsByFinancementId(financementId) {
    try {
      const response = await fetch(`${API_URL}/applications?financementId=${financementId}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  },

  async getApplicationsByScholarshipId(scholarshipId) {
    try {
      const response = await fetch(`${API_URL}/applications?scholarshipId=${scholarshipId}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  },

  async getUserApplicationsByType(userId, type) {
    try {
      const response = await fetch(`${API_URL}/applications?${type === 'offer' ? 'candidateId' : 'providerId'}=${userId}&type=${type}`);
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des candidatures:', error);
      throw error;
    }
  },

  // Modifier une candidature
  async updateApplication(applicationId, applicationData) {
    try {
      console.log('Modification de la candidature:', applicationId, applicationData);
      
      // S'assurer que l'ID est un nombre
      const numericId = parseInt(applicationId);
      
      const response = await fetch(`${API_URL}/applications/${numericId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coverLetter: applicationData.coverLetter,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse du serveur:', response.status, errorText);
        throw new Error(`Erreur lors de la modification de la candidature: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Candidature modifiée avec succès:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la modification de la candidature:', error);
      throw error;
    }
  },

  // Supprimer une candidature
  async deleteApplication(applicationId) {
    try {
      console.log('Suppression de la candidature:', applicationId);
      
      // S'assurer que l'ID est un nombre
      const numericId = parseInt(applicationId);
      
      const response = await fetch(`${API_URL}/applications/${numericId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse du serveur:', response.status, errorText);
        throw new Error(`Erreur lors de la suppression de la candidature: ${response.status} - ${errorText}`);
      }

      console.log('Candidature supprimée avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la candidature:', error);
      throw error;
    }
  }
}; 