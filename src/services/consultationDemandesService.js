import api from './api';

/**
 * Service pour la gestion des demandes de consultation reçues par le prestataire
 */
class ConsultationDemandesService {
  /**
   * Récupérer toutes les demandes de consultation reçues
   * GET /api/applications/consultation/
   * @returns {Promise} - Promesse contenant la liste des demandes
   */
  async getConsultationDemandes() {
    try {
      const response = await api.get('/api/applications/consultation/');
      console.log('📋 Demandes de consultation récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des demandes:', error);
      throw error;
    }
  }

  /**
   * Récupérer une demande de consultation spécifique par ID
   * GET /api/applications/consultation/{id}/
   * @param {string} demandeId - ID de la demande
   * @returns {Promise} - Promesse contenant les détails de la demande
   */
  async getConsultationDemandeById(demandeId) {
    try {
      const response = await api.get(`/api/applications/consultation/${demandeId}/`);
      console.log('📋 Détails de la demande récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de la demande:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'une demande de consultation
   * PUT /api/applications/consultation/{id}/status/
   * @param {string} demandeId - ID de la demande
   * @param {string} newStatus - Nouveau statut (ACCEPTED, REJECTED, SHORTLISTED, etc.)
   * @param {string} reason - Raison du changement de statut (optionnel)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async updateDemandeStatus(demandeId, newStatus, reason = '') {
    try {
      const response = await api.put(`/api/applications/consultation/${demandeId}/status/`, {
        status: newStatus,
        reason: reason
      });
      console.log('✅ Statut de la demande mis à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  }

  /**
   * Accepter une demande de consultation
   * @param {string} demandeId - ID de la demande
   * @param {string} reason - Raison de l'acceptation (optionnel)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async acceptDemande(demandeId, reason = '') {
    return this.updateDemandeStatus(demandeId, 'ACCEPTED', reason);
  }

  /**
   * Rejeter une demande de consultation
   * @param {string} demandeId - ID de la demande
   * @param {string} reason - Raison du rejet
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async rejectDemande(demandeId, reason) {
    return this.updateDemandeStatus(demandeId, 'REJECTED', reason);
  }

  /**
   * Mettre en shortlist une demande de consultation
   * @param {string} demandeId - ID de la demande
   * @param {string} reason - Raison de la mise en shortlist (optionnel)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async shortlistDemande(demandeId, reason = '') {
    return this.updateDemandeStatus(demandeId, 'SHORTLISTED', reason);
  }

  /**
   * Marquer une demande comme vue
   * PUT /api/applications/consultation/{id}/mark-viewed/
   * @param {string} demandeId - ID de la demande
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async markDemandeAsViewed(demandeId) {
    try {
      const response = await api.put(`/api/applications/consultation/${demandeId}/mark-viewed/`);
      console.log('✅ Demande marquée comme vue:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme vue:', error);
      throw error;
    }
  }

  /**
   * Envoyer un message au candidat
   * POST /api/applications/consultation/{id}/message/
   * @param {string} demandeId - ID de la demande
   * @param {string} message - Contenu du message
   * @param {string} messageType - Type de message (ACCEPTANCE, REJECTION, CLARIFICATION, etc.)
   * @returns {Promise} - Promesse contenant la réponse de l'API
   */
  async sendMessageToCandidate(demandeId, message, messageType = 'CLARIFICATION') {
    try {
      const response = await api.post(`/api/applications/consultation/${demandeId}/message/`, {
        message: message,
        message_type: messageType
      });
      console.log('✅ Message envoyé au candidat:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des demandes
   * @param {Array} demandes - Liste des demandes
   * @returns {Object} - Statistiques des demandes
   */
  getDemandesStats(demandes) {
    if (!demandes || !Array.isArray(demandes)) {
      return {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        shortlisted: 0,
        viewed: 0,
        unviewed: 0
      };
    }

    const stats = {
      total: demandes.length,
      pending: 0,
      accepted: 0,
      rejected: 0,
      shortlisted: 0,
      viewed: 0,
      unviewed: 0
    };

    demandes.forEach(demande => {
      const status = demande.application?.status;
      const viewed = demande.application?.viewed_at;

      switch (status) {
        case 'PENDING':
          stats.pending++;
          break;
        case 'ACCEPTED':
          stats.accepted++;
          break;
        case 'REJECTED':
          stats.rejected++;
          break;
        case 'SHORTLISTED':
          stats.shortlisted++;
          break;
        default:
          stats.pending++;
      }

      if (viewed) {
        stats.viewed++;
      } else {
        stats.unviewed++;
      }
    });

    return stats;
  }

  /**
   * Formater une demande pour l'affichage
   * @param {Object} demande - Demande brute de l'API
   * @returns {Object} - Demande formatée pour l'affichage
   */
  formatDemandeForDisplay(demande) {
    if (!demande) return null;

    const application = demande.application;
    const consultation = demande.consultation_offer;
    const candidate = demande.candidate_profile;
    const aiAnalysis = demande.ai_analysis;

    return {
      id: demande.id,
      applicationId: application?.id,
      status: application?.status || 'PENDING',
      statusDisplay: this.getStatusDisplay(application?.status),
      statusColor: this.getStatusColor(application?.status),
      createdAt: application?.created_at,
      updatedAt: application?.updated_at,
      viewedAt: application?.viewed_at,
      daysSinceApplication: application?.days_since_application || 0,
      
      // Informations de la consultation
      consultationTitle: consultation?.title || 'Titre non disponible',
      consultationType: consultation?.consultation_type?.name || 'Type non précisé',
      expertiseSector: consultation?.expertise_sector || 'Secteur non précisé',
      deliveryMode: consultation?.delivery_mode || 'Mode non précisé',
      estimatedDuration: consultation?.estimated_duration || 'Durée non précisée',
      pricingType: consultation?.pricing_type || 'Tarification non précisée',
      price: consultation?.price || 'Prix non précisé',
      isUrgent: consultation?.is_urgent || false,
      endDate: consultation?.end_date,
      applicationDeadline: consultation?.application_deadline,
      
      // Informations du candidat (depuis applicant si candidate_profile est null)
      candidateId: candidate?.user?.id || application?.applicant?.id,
      candidateName: candidate?.user ? 
        `${candidate.user.first_name || ''} ${candidate.user.last_name || ''}`.trim() || candidate.user.username || 'Nom non disponible' :
        `${application?.applicant?.first_name || ''} ${application?.applicant?.last_name || ''}`.trim() || application?.applicant?.username || 'Nom non disponible',
      candidateEmail: candidate?.user?.email || application?.applicant?.email || 'Email non disponible',
      candidatePhone: candidate?.user?.phone || application?.applicant?.phone || 'Téléphone non disponible',
      candidateExperience: candidate?.years_experience || 0,
      candidateSkills: candidate?.skills || '',
      candidateTechnologies: candidate?.technologies || '',
      candidateAbout: candidate?.about || '',
      candidateImage: candidate?.image,
      candidateCV: candidate?.cv,
      candidateUserType: candidate?.user?.user_type || application?.applicant?.user_type || 'Type non précisé',
      candidateIsApproved: candidate?.user?.is_approved || application?.applicant?.is_approved || false,
      candidateEmailVerified: candidate?.user?.email_verified || application?.applicant?.email_verified || false,
      
      // Documents de candidature
      portfolio: demande.portfolio,
      motivationLetter: demande.motivation_letter,
      motivationLetterFile: demande.motivation_letter_file,
      proposedMethodology: demande.proposed_methodology,
      diplomas: demande.diplomas,
      certificates: demande.certificates,
      
      // Analyse IA (peut être null)
      aiCompatibilityScore: aiAnalysis?.compatibility_score || 0,
      aiRecommendation: aiAnalysis?.recommendations || 'NO_RECOMMENDATION',
      aiRecommendationDisplay: this.getAIRecommendationDisplay(aiAnalysis?.recommendations),
      aiConfidenceScore: aiAnalysis?.ai_confidence_score || 0,
      aiStrengths: aiAnalysis?.strengths || [],
      aiWeaknesses: aiAnalysis?.weaknesses || [],
      aiAnalysisDate: aiAnalysis?.created_at,
      hasAIAnalysis: !!aiAnalysis,
      
      // Informations de l'entreprise
      companyName: consultation?.recruiter?.company_name || 'Entreprise non précisée',
      companyLogo: consultation?.recruiter?.logo,
      companySector: consultation?.recruiter?.sector || 'Secteur non précisé',
      companySize: consultation?.recruiter?.company_size || 'Taille non précisée',
      companyWebsite: consultation?.recruiter?.website,
      
      // Localisation
      country: consultation?.country?.name || 'Pays non précisé',
      region: consultation?.region?.name || 'Région non précisée',
      geographicZone: consultation?.geographic_zone || 'Zone non précisée'
    };
  }

  /**
   * Obtenir l'affichage du statut
   * @param {string} status - Statut de l'API
   * @returns {string} - Statut formaté pour l'affichage
   */
  getStatusDisplay(status) {
    const statusMap = {
      'PENDING': 'En attente',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Rejetée',
      'SHORTLISTED': 'En shortlist',
      'WITHDRAWN': 'Retirée',
      'EXPIRED': 'Expirée',
      'CANCELLED': 'Annulée'
    };
    
    return statusMap[status] || status || 'Statut inconnu';
  }

  /**
   * Obtenir la couleur du statut
   * @param {string} status - Statut de l'API
   * @returns {string} - Classe CSS pour la couleur
   */
  getStatusColor(status) {
    const colorMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'SHORTLISTED': 'bg-blue-100 text-blue-800',
      'WITHDRAWN': 'bg-gray-100 text-gray-800',
      'EXPIRED': 'bg-orange-100 text-orange-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtenir l'affichage de la recommandation IA
   * @param {string} recommendation - Recommandation de l'API
   * @returns {string} - Recommandation formatée pour l'affichage
   */
  getAIRecommendationDisplay(recommendation) {
    const recommendationMap = {
      'STRONG_MATCH': 'Excellente compatibilité',
      'GOOD_MATCH': 'Bonne compatibilité',
      'MODERATE_MATCH': 'Compatibilité modérée',
      'WEAK_MATCH': 'Compatibilité faible',
      'NO_RECOMMENDATION': 'Aucune recommandation',
      'REQUIRES_REVIEW': 'Nécessite une revue manuelle'
    };
    
    return recommendationMap[recommendation] || recommendation || 'Recommandation non disponible';
  }

  /**
   * Filtrer les demandes selon différents critères
   * @param {Array} demandes - Liste des demandes
   * @param {Object} filters - Filtres à appliquer
   * @returns {Array} - Demandes filtrées
   */
  filterDemandes(demandes, filters = {}) {
    if (!demandes || !Array.isArray(demandes)) return [];

    let filteredDemandes = [...demandes];

    // Filtre par statut
    if (filters.status && filters.status !== 'all') {
      filteredDemandes = filteredDemandes.filter(demande => 
        demande.application?.status === filters.status
      );
    }

    // Filtre par score de compatibilité IA
    if (filters.minScore) {
      filteredDemandes = filteredDemandes.filter(demande => 
        demande.ai_analysis?.compatibility_score >= filters.minScore
      );
    }

    // Filtre par urgence
    if (filters.urgentOnly) {
      filteredDemandes = filteredDemandes.filter(demande => 
        demande.consultation_offer?.is_urgent === true
      );
    }

    // Filtre par date (demandes récentes)
    if (filters.recentOnly) {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      filteredDemandes = filteredDemandes.filter(demande => 
        new Date(demande.application?.created_at) >= oneWeekAgo
      );
    }

    // Filtre par non vues
    if (filters.unviewedOnly) {
      filteredDemandes = filteredDemandes.filter(demande => 
        !demande.application?.viewed_at
      );
    }

    return filteredDemandes;
  }

  /**
   * Trier les demandes selon différents critères
   * @param {Array} demandes - Liste des demandes
   * @param {string} sortBy - Critère de tri
   * @param {string} sortOrder - Ordre de tri (asc, desc)
   * @returns {Array} - Demandes triées
   */
  sortDemandes(demandes, sortBy = 'created_at', sortOrder = 'desc') {
    if (!demandes || !Array.isArray(demandes)) return [];

    const sortedDemandes = [...demandes];

    sortedDemandes.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'compatibility_score':
          aValue = parseFloat(a.ai_analysis?.compatibility_score) || 0;
          bValue = parseFloat(b.ai_analysis?.compatibility_score) || 0;
          break;
        case 'created_at':
          aValue = new Date(a.application?.created_at);
          bValue = new Date(b.application?.created_at);
          break;
        case 'candidate_experience':
          aValue = a.candidate_profile?.years_experience || 0;
          bValue = b.candidate_profile?.years_experience || 0;
          break;
        case 'urgency':
          aValue = a.consultation_offer?.is_urgent ? 1 : 0;
          bValue = b.consultation_offer?.is_urgent ? 1 : 0;
          break;
        default:
          aValue = a.application?.created_at;
          bValue = b.application?.created_at;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sortedDemandes;
  }
}

export default new ConsultationDemandesService(); 