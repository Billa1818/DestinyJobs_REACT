import api, { aiAnalysisConfig } from './api';

class ScoreService {
  /**
   * Convertir le type d'offre en format attendu par l'API
   * @param {string} offerType - Type d'offre (emploi, consultation, financement, bourse)
   * @returns {string} - Type d'offre au format API (JOB, CONSULTATION, FUNDING)
   */
  convertOfferTypeToAPI(offerType) {
    const typeMapping = {
      'emploi': 'JOB',
      'consultation': 'CONSULTATION',
      'financement': 'FUNDING',
      'bourse': 'FUNDING', // Fallback pour les bourses
      'job': 'JOB',
      'consultation': 'CONSULTATION',
      'funding': 'FUNDING',
      'scholarship': 'FUNDING'
    };
    
    const apiType = typeMapping[offerType.toLowerCase()];
    if (!apiType) {
      throw new Error(`Type d'offre invalide: ${offerType}. Utilisez: emploi, consultation, financement, ou bourse`);
    }
    
    return apiType;
  }

  /**
   * Formater un score avec un seul chiffre après la virgule
   * @param {number} score - Score à formater
   * @returns {number} - Score formaté
   */
  formatScore(score) {
    if (typeof score !== 'number') return 0;
    return Math.round(score * 10) / 10; // Arrondi à 1 décimale
  }

  /**
   * Formater les scores détaillés selon la nouvelle structure
   * @param {Object} detailedScores - Scores détaillés de l'API
   * @param {string} offerType - Type d'offre
   * @returns {Object} - Scores formatés pour l'affichage
   */
  formatDetailedScores(detailedScores, offerType) {
    const formattedScores = {};
    
    // Mapping des clés selon le type d'offre
    switch (offerType) {
      case 'JOB':
        formattedScores.skills_match = this.formatScore(detailedScores.skill_match || 0);
        formattedScores.experience_match = this.formatScore(detailedScores.experience_match || 0);
        formattedScores.location_match = this.formatScore(detailedScores.location_match || 0);
        formattedScores.salary_match = this.formatScore(detailedScores.salary_match || 0);
        formattedScores.culture_match = this.formatScore(detailedScores.culture_match || 0);
        formattedScores.education_match = this.formatScore(detailedScores.education_match || 0);
        break;
        
      case 'CONSULTATION':
        formattedScores.expertise_match = this.formatScore(detailedScores.expertise_match || 0);
        formattedScores.portfolio_match = this.formatScore(detailedScores.portfolio_match || 0);
        formattedScores.availability_match = this.formatScore(detailedScores.availability_match || 0);
        formattedScores.rates_match = this.formatScore(detailedScores.rates_match || 0);
        formattedScores.references_match = this.formatScore(detailedScores.references_match || 0);
        break;
        
      case 'FUNDING':
        formattedScores.business_plan_match = this.formatScore(detailedScores.business_plan_match || 0);
        formattedScores.financial_profile_match = this.formatScore(detailedScores.financial_profile_match || 0);
        formattedScores.guarantees_match = this.formatScore(detailedScores.guarantees_match || 0);
        formattedScores.profitability_match = this.formatScore(detailedScores.profitability_match || 0);
        formattedScores.risk_assessment = this.formatScore(detailedScores.risk_assessment || 0);
        break;
        
      default:
        // Fallback pour les types non reconnus
        Object.keys(detailedScores).forEach(key => {
          formattedScores[key] = this.formatScore(detailedScores[key] || 0);
        });
    }
    
    return formattedScores;
  }

  /**
   * Calculer le score de compatibilité entre un candidat et une offre
   * POST /api/applications/ai/calculate-compatibility/
   * 
   * @param {string} candidateId - UUID du candidat
   * @param {string} offerId - UUID de l'offre
   * @param {string} offerType - Type d'offre (emploi, consultation, financement, bourse)
   * @returns {Promise} - Promesse contenant l'analyse de compatibilité
   */
  async calculateCompatibility(candidateId, offerId, offerType) {
    try {
      // Convertir le type d'offre en format attendu par l'API
      const apiOfferType = this.convertOfferTypeToAPI(offerType);
      
      console.log('🔍 Calcul du score de compatibilité IA...', { 
        candidateId, 
        offerId, 
        originalType: offerType,
        apiType: apiOfferType
      });
      
      // Configuration avec timeout augmenté pour l'analyse IA
      const config = {
        timeout: 120000, // 60 secondes au lieu de 10 secondes
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const response = await api.post('/api/applications/ai/calculate-compatibility/', {
        candidate_id: candidateId,
        offer_id: offerId,
        offer_type: apiOfferType
      }, config);
      
      // Formater le score principal avec 1 décimale
      if (response.data.compatibility_score) {
        response.data.compatibility_score = this.formatScore(response.data.compatibility_score);
      }
      
      console.log('✅ Score de compatibilité calculé:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors du calcul de compatibilité:', error);
      
      // Gestion spécifique du timeout
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('L\'analyse IA prend plus de temps que prévu. Veuillez réessayer dans quelques instants.');
      }
      
      // Améliorer les messages d'erreur
      if (error.response?.status === 400 && error.response?.data?.error) {
        throw new Error(`Erreur de validation: ${error.response.data.error}`);
      } else if (error.response?.status === 403) {
        throw new Error('Accès interdit. Vous ne pouvez analyser que vos propres offres.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentification requise. Veuillez vous connecter.');
      } else if (error.response?.status === 404) {
        throw new Error('Offre ou candidat non trouvé.');
      } else if (error.response?.status === 408) {
        throw new Error('L\'analyse IA a pris trop de temps. Veuillez réessayer.');
      } else if (error.response?.status >= 500) {
        throw new Error('Erreur serveur. L\'analyse IA est temporairement indisponible. Veuillez réessayer plus tard.');
      } else {
        throw new Error(`Erreur lors du calcul de compatibilité: ${error.message}`);
      }
    }
  }

  /**
   * Calculer la compatibilité pour une offre d'emploi
   * @param {string} candidateId - UUID du candidat
   * @param {string} jobOfferId - UUID de l'offre d'emploi
   * @returns {Promise} - Promesse contenant l'analyse de compatibilité
   */
  async analyzeJobCompatibility(candidateId, jobOfferId) {
    return this.calculateCompatibility(candidateId, jobOfferId, 'emploi');
  }

  /**
   * Calculer la compatibilité pour une consultation
   * @param {string} candidateId - UUID du candidat
   * @param {string} consultationId - UUID de la consultation
   * @returns {Promise} - Promesse contenant l'analyse de compatibilité
   */
  async analyzeConsultationCompatibility(candidateId, consultationId) {
    return this.calculateCompatibility(candidateId, consultationId, 'consultation');
  }

  /**
   * Calculer la compatibilité pour un financement
   * @param {string} candidateId - UUID du candidat
   * @param {string} fundingId - UUID du financement
   * @returns {Promise} - Promesse contenant l'analyse de compatibilité
   */
  async analyzeFundingCompatibility(candidateId, fundingId) {
    return this.calculateCompatibility(candidateId, fundingId, 'financement');
  }

  /**
   * Calculer la compatibilité pour une bourse (utilise FUNDING comme fallback)
   * @param {string} candidateId - UUID du candidat
   * @param {string} scholarshipId - UUID de la bourse
   * @returns {Promise} - Promesse contenant l'analyse de compatibilité
   */
  async analyzeScholarshipCompatibility(candidateId, scholarshipId) {
    // Pour les bourses, on utilise le type FUNDING comme fallback
    // car la nouvelle API ne semble pas avoir de type spécifique pour les bourses
    return this.calculateCompatibility(candidateId, scholarshipId, 'bourse');
  }

  /**
   * Récupérer les scores de compatibilité existants
   * GET /api/applications/compatibility-scores/
   * 
   * @param {Object} filters - Filtres optionnels
   * @returns {Promise} - Promesse contenant les scores
   */
  async getCompatibilityScores(filters = {}) {
    try {
      console.log('📊 Récupération des scores de compatibilité...', { filters });
      
      const response = await api.get('/api/applications/compatibility-scores/', { params: filters });
      
      console.log('✅ Scores de compatibilité récupérés:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des scores:', error);
      throw error;
    }
  }

  /**
   * Récupérer un score de compatibilité spécifique
   * GET /api/applications/compatibility-scores/<uuid:pk>/
   * 
   * @param {string} scoreId - UUID du score de compatibilité
   * @returns {Promise} - Promesse contenant le score
   */
  async getCompatibilityScore(scoreId) {
    try {
      console.log('📊 Récupération du score de compatibilité...', { scoreId });
      
      const response = await api.get(`/api/applications/compatibility-scores/${scoreId}/`);
      
      console.log('✅ Score de compatibilité récupéré:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du score:', error);
      throw error;
    }
  }

  /**
   * Récupérer l'analyse IA des candidatures
   * GET /api/applications/ai-analysis/
   * 
   * @param {Object} filters - Filtres optionnels
   * @returns {Promise} - Promesse contenant les analyses
   */
  async getAIAnalysis(filters = {}) {
    try {
      console.log('🤖 Récupération des analyses IA...', { filters });
      
      const response = await api.get('/api/applications/ai-analysis/', { params: filters });
      
      console.log('✅ Analyses IA récupérées:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des analyses IA:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques de compatibilité
   * GET /api/applications/stats/
   * 
   * @returns {Promise} - Promesse contenant les statistiques
   */
  async getCompatibilityStats() {
    try {
      console.log('📈 Récupération des statistiques de compatibilité...');
      
      const response = await api.get('/api/applications/stats/');
      
      console.log('✅ Statistiques de compatibilité récupérées:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Récupérer mes statistiques de compatibilité
   * GET /api/applications/my-stats/
   * 
   * @returns {Promise} - Promesse contenant mes statistiques
   */
  async getMyCompatibilityStats() {
    try {
      console.log('📊 Récupération de mes statistiques de compatibilité...');
      
      const response = await api.get('/api/applications/my-stats/');
      
      console.log('✅ Mes statistiques de compatibilité récupérées:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur lors de la récupération de mes statistiques:', error);
      throw error;
    }
  }

  /**
   * Interpréter le score de compatibilité selon la nouvelle échelle
   * @param {number} score - Score de compatibilité (0-100)
   * @returns {Object} - Objet contenant l'interprétation
   */
  interpretCompatibilityScore(score) {
    if (score >= 90) {
      return {
        level: 'excellent',
        text: 'Excellente compatibilité',
        color: 'text-green-600 bg-green-100',
        recommendation: 'RECOMMEND'
      };
    } else if (score >= 80) {
      return {
        level: 'very-good',
        text: 'Très bonne compatibilité',
        color: 'text-green-600 bg-green-100',
        recommendation: 'RECOMMEND'
      };
    } else if (score >= 70) {
      return {
        level: 'good',
        text: 'Bonne compatibilité',
        color: 'text-yellow-600 bg-yellow-100',
        recommendation: 'CONSIDER'
      };
    } else if (score >= 60) {
      return {
        level: 'average',
        text: 'Compatibilité moyenne',
        color: 'text-yellow-600 bg-yellow-100',
        recommendation: 'CONSIDER'
      };
    } else if (score >= 50) {
      return {
        level: 'weak',
        text: 'Compatibilité faible',
        color: 'text-red-600 bg-red-100',
        recommendation: 'NOT_RECOMMEND'
      };
    } else {
      return {
        level: 'very-weak',
        text: 'Compatibilité très faible',
        color: 'text-red-600 bg-red-100',
        recommendation: 'NOT_RECOMMEND'
      };
    }
  }
}

export default new ScoreService(); 