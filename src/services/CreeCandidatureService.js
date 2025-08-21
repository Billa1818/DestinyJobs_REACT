import api from './api';

class CreeCandidatureService {
  // Créer une candidature d'emploi
  async createJobApplication(formData) {
    try {
      console.log('📝 API Call - CreeCandidatureService.createJobApplication:', formData);
      
      const response = await api.post('/api/applications/job/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 secondes pour l'upload de fichiers
      });
      
      console.log('✅ API Response - CreeCandidatureService.createJobApplication:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CreeCandidatureService.createJobApplication:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(`Données invalides: ${error.response.data.error || 'Vérifiez les informations saisies'}`);
          case 401:
            throw new Error('Authentification requise. Veuillez vous reconnecter.');
          case 403:
            throw new Error('Vous n\'êtes pas autorisé à postuler à cette offre.');
          case 404:
            throw new Error('Offre d\'emploi introuvable ou non publiée.');
          default:
            throw new Error(`Erreur ${error.response.status}: ${error.response.data.error || 'Erreur lors de la création de la candidature'}`);
        }
      } else if (error.request) {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Erreur: ${error.message}`);
      }
    }
  }

  // Créer une candidature de consultation
  async createConsultationApplication(formData) {
    try {
      console.log('📝 API Call - CreeCandidatureService.createConsultationApplication:', formData);
      
      const response = await api.post('/api/applications/consultation/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 secondes pour l'upload de fichiers
      });
      
      console.log('✅ API Response - CreeCandidatureService.createConsultationApplication:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CreeCandidatureService.createConsultationApplication:', error);
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        switch (error.response.status) {
          case 400:
            throw new Error(`Données invalides: ${error.response.data.error || 'Vérifiez les informations saisies'}`);
          case 401:
            throw new Error('Authentification requise. Veuillez vous reconnecter.');
          case 403:
            throw new Error('Seuls les prestataires peuvent postuler aux consultations.');
          case 404:
            throw new Error('Offre de consultation introuvable ou non publiée.');
          default:
            throw new Error(`Erreur ${error.response.status}: ${error.response.data.error || 'Erreur lors de la création de la candidature'}`);
        }
      } else if (error.request) {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Erreur: ${error.message}`);
      }
    }
  }

  // Créer une demande de financement
  async createFundingApplication(formData) {
    try {
      console.log('📝 API Call - CreeCandidatureService.createFundingApplication');
      
      // Debug: Vérifier le contenu de FormData avant envoi
      console.log('🔍 Vérification FormData avant envoi:');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: [File] ${value.name} (${value.size} bytes, type: ${value.type})`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
      
      const response = await api.post('/api/applications/funding/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 secondes pour l'upload de fichiers
      });
      
      console.log('✅ API Response - CreeCandidatureService.createFundingApplication:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Erreur CreeCandidatureService.createFundingApplication:', error);
      
      // Debug: Afficher les détails de l'erreur
      if (error.response && error.response.data) {
        console.error('❌ Détails de l\'erreur:', error.response.data);
      }
      
      // Gestion des erreurs spécifiques
      if (error.response) {
        switch (error.response.status) {
          case 400:
            const errorDetails = error.response.data;
            let errorMessage = 'Données invalides:\n';
            
            if (typeof errorDetails === 'object') {
              Object.entries(errorDetails).forEach(([field, messages]) => {
                if (Array.isArray(messages)) {
                  errorMessage += `- ${field}: ${messages.join(', ')}\n`;
                } else {
                  errorMessage += `- ${field}: ${messages}\n`;
                }
              });
            } else {
              errorMessage += errorDetails || 'Vérifiez les informations saisies';
            }
            
            throw new Error(errorMessage);
          case 401:
            throw new Error('Authentification requise. Veuillez vous reconnecter.');
          case 403:
            throw new Error('Vous n\'êtes pas autorisé à demander ce financement.');
          case 404:
            throw new Error('Offre de financement introuvable ou non publiée.');
          default:
            throw new Error(`Erreur ${error.response.status}: ${error.response.data.error || 'Erreur lors de la création de la demande'}`);
        }
      } else if (error.request) {
        throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Erreur: ${error.message}`);
      }
    }
  }

  // Tester si une offre est accessible pour candidature
  async testOfferAvailability(offerId, offerType) {
    try {
      console.log(`🔍 Test d'accessibilité de l'offre ${offerType}:`, offerId);
      
      let endpoint;
      switch (offerType) {
        case 'emploi':
          endpoint = `/api/jobs/job-offers/${offerId}/`;
          break;
        case 'consultation':
          endpoint = `/api/jobs/consultation-offers/${offerId}/`;
          break;
        case 'financement':
          endpoint = `/api/jobs/funding-offers/${offerId}/`;
          break;
        default:
          throw new Error('Type d\'offre non reconnu');
      }
      
      console.log(`🌐 Appel API: ${endpoint}`);
      
      const response = await api.get(endpoint);
      const offer = response.data;
      
      console.log('✅ Offre trouvée:', offer);
      console.log('📊 Statut de l\'offre:', offer.status);
      console.log('📅 Date de clôture:', offer.closing_date);
      console.log('⏰ Expirée:', offer.is_expired);
      console.log('🔒 Active:', offer.is_active);
      
      // Vérifications spécifiques selon le type d'offre
      let checks = {
        exists: true,
        isApproved: true, // Par défaut, on considère que c'est approuvé
        isNotExpired: true, // Par défaut, on considère que ce n'est pas expiré
        hasValidClosingDate: true // Par défaut, on considère que la date est valide
      };
      
      // Vérifications spécifiques selon le type d'offre
      switch (offerType) {
        case 'emploi':
          checks.isApproved = offer.status === 'APPROVED' || offer.status === 'PUBLISHED' || !offer.status;
          checks.isNotExpired = !offer.is_expired && (!offer.application_deadline || new Date(offer.application_deadline) > new Date());
          checks.hasValidClosingDate = !offer.application_deadline || new Date(offer.application_deadline) > new Date();
          break;
          
        case 'consultation':
          checks.isApproved = offer.status === 'APPROVED' || offer.status === 'PUBLISHED' || !offer.status;
          checks.isNotExpired = !offer.is_expired && (!offer.closing_date || new Date(offer.closing_date) > new Date());
          checks.hasValidClosingDate = !offer.closing_date || new Date(offer.closing_date) > new Date();
          break;
          
        case 'financement':
          checks.isApproved = offer.status === 'APPROVED' || offer.status === 'PUBLISHED' || !offer.status;
          checks.isNotExpired = !offer.is_expired && (!offer.closing_date || new Date(offer.closing_date) > new Date());
          checks.hasValidClosingDate = !offer.closing_date || new Date(offer.closing_date) > new Date();
          break;
      }
      
      console.log('🔍 Vérifications finales:', checks);
      
      // Si l'offre existe mais n'est pas dans un état valide, on retourne des informations détaillées
      if (!checks.isApproved || !checks.isNotExpired || !checks.hasValidClosingDate) {
        console.log('⚠️ Offre trouvée mais pas dans un état valide pour candidature');
        return {
          isValid: false,
          checks,
          offer,
          error: 'Offre non disponible pour candidature'
        };
      }
      
      return {
        isValid: true,
        checks,
        offer
      };
      
    } catch (error) {
      console.error('❌ Erreur lors du test d\'accessibilité:', error);
      
      // Gestion spécifique des erreurs HTTP
      if (error.response?.status === 404) {
        console.log('❌ Offre non trouvée (404)');
        return {
          isValid: false,
          checks: { exists: false },
          error: 'Offre non trouvée'
        };
      } else if (error.response?.status === 403) {
        console.log('❌ Accès interdit (403)');
        return {
          isValid: false,
          checks: { exists: true, accessDenied: true },
          error: 'Accès interdit à cette offre'
        };
      } else if (error.response?.status === 401) {
        console.log('❌ Non authentifié (401)');
        return {
          isValid: false,
          checks: { exists: true, notAuthenticated: true },
          error: 'Authentification requise'
        };
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('timeout')) {
        console.log('❌ Erreur réseau ou timeout');
        return {
          isValid: false,
          checks: { exists: true, networkError: true },
          error: 'Erreur de connexion au serveur'
        };
      }
      
      // Erreur générique
      return {
        isValid: false,
        checks: { exists: true, error: true },
        error: error.message || 'Erreur inconnue lors de la vérification de l\'offre'
      };
    }
  }

  // Vérifier les documents requis selon le type d'offre
  getRequiredDocuments(offerType) {
    const requirements = {
      'emploi': {
        required: ['cv'],
        optional: ['motivation_letter', 'additional_documents', 'diplomas', 'certificates'],
        labels: {
          cv: 'CV *',
          motivation_letter: 'Lettre de motivation',
          additional_documents: 'Documents additionnels',
          diplomas: 'Diplômes',
          certificates: 'Certificats'
        }
      },
      'consultation': {
        required: ['portfolio'],
        optional: ['motivation_letter', 'proposed_methodology', 'diplomas', 'certificates'],
        labels: {
          portfolio: 'Portfolio *',
          motivation_letter: 'Lettre de motivation',
          proposed_methodology: 'Méthodologie proposée',
          diplomas: 'Diplômes',
          certificates: 'Certificats'
        }
      },
      'financement': {
        required: ['business_plan', 'requested_amount'],
        optional: ['motivation_letter', 'diplomas', 'certificates'],
        labels: {
          business_plan: 'Plan d\'affaires *',
          requested_amount: 'Montant demandé *',
          motivation_letter: 'Lettre de motivation',
          diplomas: 'Diplômes',
          certificates: 'Certificats'
        }
      }
    };

    return requirements[offerType] || requirements.emploi;
  }

  // Valider les fichiers avant envoi
  validateFiles(files, offerType) {
    const requirements = this.getRequiredDocuments(offerType);
    const errors = [];

    // Vérifier les champs requis
    requirements.required.forEach(field => {
      if (!files[field] || (Array.isArray(files[field]) && files[field].length === 0)) {
        errors.push(`${requirements.labels[field]} est requis`);
      }
    });

    // Vérifier les types de fichiers
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    Object.entries(files).forEach(([field, fileList]) => {
      if (fileList && fileList.length > 0) {
        const filesArray = Array.isArray(fileList) ? fileList : [fileList];
        filesArray.forEach(file => {
          const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
          if (!allowedTypes.includes(fileExtension)) {
            errors.push(`${file.name} n'est pas un type de fichier autorisé`);
          }
        });
      }
    });

    // Vérifier la taille des fichiers (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    Object.entries(files).forEach(([field, fileList]) => {
      if (fileList && fileList.length > 0) {
        const filesArray = Array.isArray(fileList) ? fileList : [fileList];
        filesArray.forEach(file => {
          if (file.size > maxSize) {
            errors.push(`${file.name} est trop volumineux (max 10MB)`);
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Valider FormData avant envoi
  validateFormDataBeforeSend(formData, offerType) {
    const errors = [];
    let hasRequiredFiles = false;
    
    console.log('🔍 Validation FormData avant envoi:');
    
    // Vérifier le contenu de FormData
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
      
      if (value instanceof File) {
        console.log(`    [File] ${value.name} (${value.size} bytes, type: ${value.type})`);
        
        // Vérifier que le fichier n'est pas vide
        if (value.size === 0) {
          errors.push(`Le fichier ${value.name} est vide`);
        }
        
        // Vérifier les fichiers requis
        if (offerType === 'emploi' && key === 'cv') hasRequiredFiles = true;
        if (offerType === 'consultation' && key === 'portfolio') hasRequiredFiles = true;
        if (offerType === 'financement' && key === 'business_plan') hasRequiredFiles = true;
        
      } else {
        console.log(`    [Text] ${value}`);
      }
    }
    
    // Vérifier les champs obligatoires
    const requiredFields = {
      'emploi': ['job_offer_id'],
      'consultation': ['consultation_offer_id'],
      'financement': ['funding_offer_id', 'requested_amount']
    };
    
    const required = requiredFields[offerType] || [];
    required.forEach(field => {
      if (!formData.has(field)) {
        errors.push(`Le champ ${field} est requis`);
      }
    });
    
    // Vérifier les fichiers requis
    if (offerType === 'emploi' && !hasRequiredFiles) {
      errors.push('Un CV est requis pour une candidature d\'emploi');
    }
    if (offerType === 'consultation' && !hasRequiredFiles) {
      errors.push('Un portfolio est requis pour une candidature de consultation');
    }
    if (offerType === 'financement' && !hasRequiredFiles) {
      errors.push('Un plan d\'affaires est requis pour une demande de financement');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Préparer les données du formulaire (version améliorée)
  prepareFormData(offerId, offerType, formData, files) {
    const data = new FormData();
    
    console.log('🔧 Préparation FormData:', { offerId, offerType, formData, files });
    
    // Vérification de l'offerId
    if (!offerId) {
      console.error('❌ offerId manquant!');
      throw new Error('ID de l\'offre manquant');
    }
    
    // Ajouter l'ID de l'offre selon le type
    switch (offerType) {
      case 'emploi':
        data.append('job_offer_id', offerId);
        console.log('📋 job_offer_id ajouté:', offerId);
        break;
      case 'consultation':
        data.append('consultation_offer_id', offerId);
        console.log('📋 consultation_offer_id ajouté:', offerId);
        break;
      case 'financement':
        data.append('funding_offer_id', offerId);
        console.log('📋 funding_offer_id ajouté:', offerId);
        break;
      default:
        console.error('❌ Type d\'offre non reconnu:', offerType);
        throw new Error('Type d\'offre non reconnu');
    }

    // Ajouter les fichiers avec une meilleure gestion
    Object.entries(files).forEach(([field, fileList]) => {
      console.log(`📎 Traitement fichier ${field}:`, fileList);
      
      if (fileList && fileList.length > 0) {
        // Gérer FileList ou Array
        const filesArray = Array.isArray(fileList) ? fileList : Array.from(fileList);
        
        filesArray.forEach((file, index) => {
          if (file instanceof File) {
            // Vérifier que le fichier est valide
            if (file.size > 0 && file.name) {
              data.append(field, file, file.name);
              console.log(`✅ Fichier ${field}[${index}] ajouté:`, file.name, file.size, 'bytes');
            } else {
              console.warn(`⚠️ Fichier ${field}[${index}] invalide:`, file);
            }
          } else {
            console.warn(`⚠️ ${field}[${index}] n'est pas un fichier valide:`, file);
          }
        });
      } else {
        console.log(`ℹ️ Aucun fichier pour ${field}`);
      }
    });

    // Ajouter les champs texte
    Object.entries(formData).forEach(([field, value]) => {
      if (value !== null && value !== undefined && value.toString().trim() !== '') {
        data.append(field, value.toString().trim());
        console.log(`📝 Champ texte ${field} ajouté:`, value);
      }
    });

    // Validation finale
    const validation = this.validateFormDataBeforeSend(data, offerType);
    if (!validation.isValid) {
      console.error('❌ Validation échouée:', validation.errors);
      throw new Error('Données invalides: ' + validation.errors.join(', '));
    }

    return data;
  }
}

export default new CreeCandidatureService(); 