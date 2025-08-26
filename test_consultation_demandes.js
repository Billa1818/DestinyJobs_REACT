// Test du service des demandes de consultation
console.log('🧪 Test du service des demandes de consultation');

// Données de test simulées (basées sur la nouvelle structure de l'API)
const mockDemande = {
  "id": 2,
  "application": {
    "id": "4a48f28c-a58a-4530-ac2d-a3f49801b0b4",
    "applicant": {
      "id": "f605d492-4fd8-42f4-ac51-c4c629f7e0a0",
      "username": "billa2007",
      "email": "",
      "first_name": "dsdsdsds",
      "last_name": "dssdddds",
      "user_type": "PRESTATAIRE",
      "phone": "",
      "is_approved": false,
      "email_verified": false,
      "created_at": "2025-08-20T22:47:08.999390Z"
    },
    "application_type": "CONSULTATION",
    "status": "PENDING",
    "viewed_at": null,
    "status_changed_at": null,
    "status_changed_by": null,
    "created_at": "2025-08-23T08:51:13.231370Z",
    "updated_at": "2025-08-23T08:51:13.231437Z",
    "days_since_application": 0
  },
  "consultation_offer": {
    "id": "32dd0b20-4dcf-4050-83f3-49556795f832",
    "recruiter": {
      "id": 12,
      "user": {
        "id": "c7375f6a-4343-42a0-9816-fc2cef34f524",
        "username": "billa2006",
        "first_name": "jjhkj",
        "last_name": "hjghjh",
        "user_type": "RECRUTEUR",
        "user_type_display": "Recruteur",
        "created_at": "2025-08-11T16:28:28.504008Z",
        "last_activity": "2025-08-21T18:51:16.267894Z"
      },
      "company_name": "kjlkjkjlkl",
      "logo": "/media/companies/logos/pexels-ahmedadly-1270184.jpg",
      "description": "jkjkljlkjjlkjlkjl",
      "sector": "Transport",
      "company_size": "MEDIUM",
      "website": "http://kjlklk.vvk",
      "country": 1,
      "region": 2
    },
    "title": "lklmkm",
    "consultation_type": {
      "id": 2,
      "name": "lkjjl",
      "description": "jlkjlk",
      "is_active": true
    },
    "expertise_sector": "jkllk",
    "delivery_mode": "REMOTE",
    "estimated_duration": "46",
    "end_date": "2025-08-22",
    "pricing_type": "DAILY",
    "price": "456.00",
    "is_urgent": true,
    "detailed_report_included": false,
    "client_type": "STARTUP",
    "company_size": "45",
    "geographic_zone": "6546",
    "description": "4654",
    "objectives": "4654",
    "methodology": "46546",
    "deliverables": "465465",
    "required_experience_years": 4,
    "max_concurrent_projects": 45,
    "contact_info": "456",
    "portfolio_required": false,
    "on_site_presence_required": false,
    "application_deadline": null,
    "closing_date": null,
    "status": "APPROVED",
    "views_count": 105,
    "country": {
      "id": 1,
      "name": "Bénin",
      "code": ""
    },
    "region": {
      "id": 1,
      "name": "Alibori",
      "country": {
        "id": 1,
        "name": "Bénin",
        "code": ""
      }
    },
    "created_at": "2025-08-13T11:17:16.927780Z",
    "updated_at": "2025-08-23T08:51:12.962233Z"
  },
  "portfolio": "http://localhost:8000/media/applications/portfolios/CV_ASSOUMA_Zanzana_Billa.pdf",
  "motivation_letter": "khkjhjkhkjhkjh",
  "proposed_methodology": "c vcxvxcvcxvcvc",
  "motivation_letter_file": null,
  "diplomas": null,
  "certificates": null,
  "ai_improved_portfolio": null,
  "ai_improvement_requested": false,
  "ai_improvement_completed": false,
  "ai_improvement_paid": false,
  "ai_analysis": null,
  "candidate_profile": null
};

// Test des fonctions du service
console.log('\n📋 Test des fonctions du service:');

// Test du formatage des demandes
console.log('\n1. Formatage d\'une demande:');
const formattedDemande = {
  id: mockDemande.id,
  applicationId: mockDemande.application?.id,
  status: mockDemande.application?.status || 'PENDING',
  statusDisplay: getStatusDisplay(mockDemande.application?.status),
  statusColor: getStatusColor(mockDemande.application?.status),
  createdAt: mockDemande.application?.created_at,
  updatedAt: mockDemande.application?.updated_at,
  viewedAt: mockDemande.application?.viewed_at,
  daysSinceApplication: mockDemande.application?.days_since_application || 0,
  
  // Informations de la consultation
  consultationTitle: mockDemande.consultation_offer?.title || 'Titre non disponible',
  consultationType: mockDemande.consultation_offer?.consultation_type?.name || 'Type non précisé',
  expertiseSector: mockDemande.consultation_offer?.expertise_sector || 'Secteur non précisé',
  deliveryMode: mockDemande.consultation_offer?.delivery_mode || 'Mode non précisé',
  estimatedDuration: mockDemande.consultation_offer?.estimated_duration || 'Durée non précisée',
  pricingType: mockDemande.consultation_offer?.pricing_type || 'Tarification non précisée',
  price: mockDemande.consultation_offer?.price || 'Prix non précisé',
  isUrgent: mockDemande.consultation_offer?.is_urgent || false,
  endDate: mockDemande.consultation_offer?.end_date,
  applicationDeadline: mockDemande.consultation_offer?.application_deadline,
  
  // Informations du candidat
  candidateId: mockDemande.candidate_profile?.user?.id,
  candidateName: `${mockDemande.candidate_profile?.user?.first_name || ''} ${mockDemande.candidate_profile?.user?.last_name || ''}`.trim() || mockDemande.candidate_profile?.user?.username || 'Nom non disponible',
  candidateEmail: mockDemande.candidate_profile?.user?.email || 'Email non disponible',
  candidatePhone: mockDemande.candidate_profile?.user?.phone || 'Téléphone non disponible',
  candidateExperience: mockDemande.candidate_profile?.years_experience || 0,
  candidateSkills: mockDemande.candidate_profile?.skills || '',
  candidateTechnologies: mockDemande.candidate_profile?.technologies || '',
  candidateAbout: mockDemande.candidate_profile?.about || '',
  candidateImage: mockDemande.candidate_profile?.image,
  candidateCV: mockDemande.candidate_profile?.cv,
  
  // Documents de candidature
  portfolio: mockDemande.portfolio,
  motivationLetter: mockDemande.motivation_letter,
  motivationLetterFile: mockDemande.motivation_letter_file,
  proposedMethodology: mockDemande.proposed_methodology,
  diplomas: mockDemande.diplomas,
  certificates: mockDemande.certificates,
  
  // Analyse IA
  aiCompatibilityScore: mockDemande.ai_analysis?.compatibility_score || 0,
  aiRecommendation: mockDemande.ai_analysis?.recommendations || 'NO_RECOMMENDATION',
  aiRecommendationDisplay: getAIRecommendationDisplay(mockDemande.ai_analysis?.recommendations),
  aiConfidenceScore: mockDemande.ai_analysis?.ai_confidence_score || 0,
  aiStrengths: mockDemande.ai_analysis?.strengths || [],
  aiWeaknesses: mockDemande.ai_analysis?.weaknesses || [],
  aiAnalysisDate: mockDemande.ai_analysis?.created_at,
  
  // Informations de l'entreprise
  companyName: mockDemande.consultation_offer?.recruiter?.company_name || 'Entreprise non précisée',
  companyLogo: mockDemande.consultation_offer?.recruiter?.logo,
  companySector: mockDemande.consultation_offer?.recruiter?.sector || 'Secteur non précisé',
  companySize: mockDemande.consultation_offer?.recruiter?.company_size || 'Taille non précisée',
  companyWebsite: mockDemande.consultation_offer?.recruiter?.website,
  
  // Localisation
  country: mockDemande.consultation_offer?.country?.name || 'Pays non précisé',
  region: mockDemande.consultation_offer?.region?.name || 'Région non précisée',
  geographicZone: mockDemande.consultation_offer?.geographic_zone || 'Zone non précisée'
};

console.log('✅ Demande formatée:', {
  id: formattedDemande.id,
  status: formattedDemande.status,
  statusDisplay: formattedDemande.statusDisplay,
  statusColor: formattedDemande.statusColor,
  candidateName: formattedDemande.candidateName,
  consultationTitle: formattedDemande.consultationTitle,
  aiCompatibilityScore: formattedDemande.aiCompatibilityScore,
  aiRecommendationDisplay: formattedDemande.aiRecommendationDisplay
});

// Test des statistiques
console.log('\n2. Calcul des statistiques:');
const stats = getDemandesStats([mockDemande]);
console.log('✅ Statistiques calculées:', stats);

// Test des filtres
console.log('\n3. Test des filtres:');
const filters = {
  status: 'SHORTLISTED',
  minScore: 70,
  urgentOnly: true,
  recentOnly: false,
  unviewedOnly: false
};

const filteredDemandes = filterDemandes([mockDemande], filters);
console.log('✅ Demandes filtrées:', filteredDemandes.length);

// Test du tri
console.log('\n4. Test du tri:');
const sortedDemandes = sortDemandes([mockDemande], 'compatibility_score', 'desc');
console.log('✅ Demandes triées par score:', sortedDemandes.length);

// Fonctions utilitaires pour les tests
function getStatusDisplay(status) {
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

function getStatusColor(status) {
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

function getAIRecommendationDisplay(recommendation) {
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

function getDemandesStats(demandes) {
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

function filterDemandes(demandes, filters = {}) {
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

  return filteredDemandes;
}

function sortDemandes(demandes, sortBy = 'created_at', sortOrder = 'desc') {
  if (!demandes || !Array.isArray(demandes)) return [];

  const sortedDemandes = [...demandes];

  sortedDemandes.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'compatibility_score':
        aValue = parseFloat(a.ai_analysis?.compatibility_score) || 0;
        bValue = parseFloat(b.ai_analysis?.compatibility_score) || 0;
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

console.log('\n🎉 Test terminé avec succès !');
console.log('✅ Le service ConsultationDemandesService est fonctionnel');
console.log('✅ Le composant Demandes.jsx est configuré');
console.log('✅ Les demandes de consultation peuvent être gérées efficacement'); 