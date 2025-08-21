/**
 * Configuration de compatibilité IA pour DestinyJobs
 * Définit les critères, pondérations et labels pour chaque type d'offre
 */

export const COMPATIBILITY_CONFIG = {
  // Types d'offres supportés
  OFFER_TYPES: {
    JOB: 'JOB',
    CONSULTATION: 'CONSULTATION',
    FUNDING: 'FUNDING'
  },

  // Mapping des types d'offres frontend vers API
  OFFER_TYPE_MAPPING: {
    'emploi': 'JOB',
    'consultation': 'CONSULTATION',
    'financement': 'FUNDING',
    'bourse': 'FUNDING' // Les bourses utilisent le type FUNDING
  },

  // Configuration des critères par type d'offre
  CRITERIA: {
    JOB: {
      skill_match: {
        label: 'Compétences techniques',
        weight: 0.30,
        description: 'Adéquation entre les compétences du candidat et les exigences du poste'
      },
      experience_match: {
        label: 'Expérience professionnelle',
        weight: 0.25,
        description: 'Correspondance entre l\'expérience du candidat et les exigences'
      },
      location_match: {
        label: 'Localisation géographique',
        weight: 0.15,
        description: 'Compatibilité de la localisation du candidat avec le poste'
      },
      text_similarity: {
        label: 'Similarité textuelle',
        weight: 0.15,
        description: 'Cohérence entre le profil du candidat et la description du poste'
      },
      salary_match: {
        label: 'Adéquation salariale',
        weight: 0.10,
        description: 'Correspondance entre les attentes salariales et l\'offre'
      },
      education_match: {
        label: 'Formation et diplômes',
        weight: 0.05,
        description: 'Adéquation de la formation avec les exigences du poste'
      }
    },

    CONSULTATION: {
      expertise_match: {
        label: 'Expertise dans le domaine',
        weight: 0.30,
        description: 'Niveau d\'expertise dans le domaine de la consultation'
      },
      portfolio_quality: {
        label: 'Qualité du portfolio',
        weight: 0.25,
        description: 'Qualité et pertinence des réalisations passées'
      },
      experience_level: {
        label: 'Niveau d\'expérience',
        weight: 0.20,
        description: 'Expérience dans le domaine de la consultation'
      },
      availability: {
        label: 'Disponibilité',
        weight: 0.10,
        description: 'Disponibilité du prestataire pour la consultation'
      },
      communication_skills: {
        label: 'Compétences en communication',
        weight: 0.10,
        description: 'Capacité à communiquer efficacement'
      },
      sector_knowledge: {
        label: 'Connaissance du secteur',
        weight: 0.05,
        description: 'Connaissance du secteur d\'activité'
      }
    },

    FUNDING: {
      business_plan_quality: {
        label: 'Qualité du plan d\'affaires',
        weight: 0.25,
        description: 'Qualité et viabilité du plan d\'affaires présenté'
      },
      financial_profile: {
        label: 'Profil financier',
        weight: 0.25,
        description: 'Solidité et crédibilité du profil financier'
      },
      project_viability: {
        label: 'Viabilité du projet',
        weight: 0.20,
        description: 'Potentiel de réussite du projet'
      },
      market_potential: {
        label: 'Potentiel du marché',
        weight: 0.15,
        description: 'Potentiel de croissance du marché cible'
      },
      team_experience: {
        label: 'Expérience de l\'équipe',
        weight: 0.10,
        description: 'Expérience et compétences de l\'équipe'
      },
      guarantees_available: {
        label: 'Garanties disponibles',
        weight: 0.05,
        description: 'Garanties et sécurités offertes'
      }
    }
  },

  // Échelle de scores et recommandations
  SCORE_SCALE: {
    90: {
      level: 'Excellent',
      recommendation: 'STRONGLY_RECOMMEND',
      action: 'Candidature prioritaire',
      color: 'text-green-600 bg-green-100',
      icon: 'fas fa-star',
      description: 'Compatibilité exceptionnelle'
    },
    80: {
      level: 'Très bon',
      recommendation: 'RECOMMEND',
      action: 'Candidature recommandée',
      color: 'text-green-600 bg-green-100',
      icon: 'fas fa-thumbs-up',
      description: 'Très bonne compatibilité'
    },
    70: {
      level: 'Bon',
      recommendation: 'CONSIDER',
      action: 'Candidature à considérer',
      color: 'text-yellow-600 bg-yellow-100',
      icon: 'fas fa-check',
      description: 'Bonne compatibilité'
    },
    60: {
      level: 'Moyen',
      recommendation: 'CONSIDER',
      action: 'Candidature possible',
      color: 'text-yellow-600 bg-yellow-100',
      icon: 'fas fa-minus',
      description: 'Compatibilité moyenne'
    },
    50: {
      level: 'Faible',
      recommendation: 'NOT_RECOMMEND',
      action: 'Candidature déconseillée',
      color: 'text-red-600 bg-red-100',
      icon: 'fas fa-exclamation-triangle',
      description: 'Compatibilité faible'
    },
    0: {
      level: 'Très faible',
      recommendation: 'NOT_RECOMMEND',
      action: 'Candidature non recommandée',
      color: 'text-red-600 bg-red-100',
      icon: 'fas fa-times',
      description: 'Compatibilité très faible'
    }
  },

  // Messages d'erreur et d'information
  MESSAGES: {
    LOADING: 'Analyse IA en cours...',
    ERROR_ANALYSIS: 'Erreur lors de l\'analyse de compatibilité IA',
    ERROR_LOADING_OFFER: 'Erreur lors du chargement de l\'offre',
    SUCCESS_ANALYSIS: 'Analyse de compatibilité terminée',
    SUCCESS_APPLICATION: 'Candidature envoyée avec succès !',
    ERROR_APPLICATION: 'Erreur lors de la soumission de la candidature',
    AUTHENTICATION_REQUIRED: 'Vous devez être connecté pour accéder à cette fonctionnalité',
    OFFER_NOT_FOUND: 'Offre non trouvée ou non accessible'
  },

  // Configuration des seuils
  THRESHOLDS: {
    EXCELLENT: 90,
    VERY_GOOD: 80,
    GOOD: 70,
    AVERAGE: 60,
    POOR: 50,
    VERY_POOR: 0
  },

  // Configuration des délais
  TIMEOUTS: {
    ANALYSIS: 10000, // 10 secondes pour l'analyse IA
    SUBMISSION: 5000, // 5 secondes pour la soumission
    LOADING: 3000 // 3 secondes pour le chargement
  }
};

/**
 * Obtenir la configuration des critères pour un type d'offre
 * @param {string} offerType - Type d'offre (JOB, CONSULTATION, FUNDING)
 * @returns {Object} Configuration des critères
 */
export const getCriteriaConfig = (offerType) => {
  return COMPATIBILITY_CONFIG.CRITERIA[offerType] || {};
};

/**
 * Obtenir l'échelle de score pour un score donné
 * @param {number} score - Score de compatibilité (0-100)
 * @returns {Object} Configuration de l'échelle
 */
export const getScoreScale = (score) => {
  const thresholds = Object.keys(COMPATIBILITY_CONFIG.SCORE_SCALE)
    .map(Number)
    .sort((a, b) => b - a);
  
  for (const threshold of thresholds) {
    if (score >= threshold) {
      return COMPATIBILITY_CONFIG.SCORE_SCALE[threshold];
    }
  }
  
  return COMPATIBILITY_CONFIG.SCORE_SCALE[0];
};

/**
 * Obtenir le type d'offre API à partir du type frontend
 * @param {string} frontendType - Type d'offre frontend
 * @returns {string} Type d'offre API
 */
export const getApiOfferType = (frontendType) => {
  return COMPATIBILITY_CONFIG.OFFER_TYPE_MAPPING[frontendType] || 'JOB';
};

/**
 * Vérifier si un type d'offre est supporté
 * @param {string} offerType - Type d'offre à vérifier
 * @returns {boolean} True si supporté
 */
export const isOfferTypeSupported = (offerType) => {
  return Object.values(COMPATIBILITY_CONFIG.OFFER_TYPES).includes(offerType);
};

export default COMPATIBILITY_CONFIG; 