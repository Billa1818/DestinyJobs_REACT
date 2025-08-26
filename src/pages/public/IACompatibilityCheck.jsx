import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import scoreService from '../../services/scoreService';
import jobService from '../../services/jobService';
import consultationService from '../../services/consultationService';
import financementService from '../../services/financementService';
import bourseService from '../../services/bourseService';
import CreeCandidatureService from '../../services/CreeCandidatureService';

const IACompatibilityCheck = () => {
  const { offerId, offerType: urlOfferType } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [compatibilityScore, setCompatibilityScore] = useState(0);
  const [analysis, setAnalysis] = useState({});
  const [motivationLetter, setMotivationLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMotivationForm, setShowMotivationForm] = useState(false);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);
  const [offerType, setOfferType] = useState(urlOfferType);
  
  // États pour la création de candidature
  const [showCandidatureForm, setShowCandidatureForm] = useState(false);
  const [candidatureForm, setCandidatureForm] = useState({
    motivation_letter: '',
    proposed_methodology: '',
    requested_amount: ''
  });
  const [candidatureFiles, setCandidatureFiles] = useState({});
  const [candidatureErrors, setCandidatureErrors] = useState([]);
  const [isCreatingCandidature, setIsCreatingCandidature] = useState(false);

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Charger les détails de l'offre selon le type
  useEffect(() => {
    const loadOfferDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let offerData;
        
        switch (offerType) {
          case 'emploi':
            offerData = await jobService.getPublicJobOfferDetail(offerId);
            break;
          case 'consultation':
            offerData = await consultationService.getConsultationOfferDetail(offerId);
            break;
          case 'financement':
            offerData = await financementService.getFundingOfferDetail(offerId);
            break;
          case 'bourse':
            offerData = await bourseService.getScholarshipOfferDetail(offerId);
            break;
          default:
            throw new Error('Type d\'offre non reconnu');
        }
        
        setOffer(offerData);
        console.log('✅ Détails de l\'offre chargés:', offerData);
        
        // Validation intelligente : détecter automatiquement le type d'offre basé sur les données
        const detectedOfferType = detectOfferType(offerData);
        console.log('🔍 Type d\'offre détecté:', detectedOfferType);
        console.log('🔍 Type d\'offre depuis l\'URL:', offerType);
        
        // Si le type détecté est différent de celui de l'URL, corriger et avertir
        if (detectedOfferType !== offerType) {
          console.warn(`⚠️ Incohérence de type d'offre: URL=${offerType}, Détecté=${detectedOfferType}`);
          console.warn('🔄 Correction automatique du type d\'offre...');
          
          // Mettre à jour l'URL sans recharger la page
          const newPath = window.location.pathname.replace(`/${offerType}/`, `/${detectedOfferType}/`);
          window.history.replaceState({}, '', newPath);
          
          // Mettre à jour l'état local
          setOfferType(detectedOfferType);
        }
        
        // Effectuer l'analyse de compatibilité IA
        await performCompatibilityAnalysis();
        
      } catch (error) {
        console.error('❌ Erreur lors du chargement de l\'offre:', error);
        setError(error.message || 'Erreur lors du chargement de l\'offre');
      } finally {
        setIsLoading(false);
      }
    };

    if (offerId && offerType && isAuthenticated && user) {
      loadOfferDetails();
    }
  }, [offerId, offerType, isAuthenticated, user]);

  // Effectuer l'analyse de compatibilité IA
  const performCompatibilityAnalysis = async () => {
    try {
      console.log('🔍 Début de l\'analyse de compatibilité IA...');
      
      // Utiliser la méthode unifiée avec conversion automatique du type
      const analysisResult = await scoreService.calculateCompatibility(user.id, offerId, offerType);
      
      console.log('✅ Analyse de compatibilité terminée:', analysisResult);
      
      // Mettre à jour l'état avec les résultats de l'analyse
      setCompatibilityScore(analysisResult.compatibility_score);
      setAnalysis({
        strengths: generateStrengths(analysisResult.detailed_scores, offerType),
        weaknesses: generateWeaknesses(analysisResult.detailed_scores, offerType),
        recommendations: generateRecommendations(analysisResult.detailed_scores, offerType),
        matchPercentage: scoreService.formatDetailedScores(analysisResult.detailed_scores, offerType),
        recommendation: analysisResult.recommendation,
        weights: analysisResult.weights || {},
        analysisDate: analysisResult.analysis_date,
        scoreSaved: analysisResult.score_saved
      });
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'analyse de compatibilité:', error);
      
      // Gestion spécifique des erreurs de timeout
      if (error.message.includes('temps') || error.message.includes('timeout')) {
        setError('⏱️ L\'analyse IA prend plus de temps que prévu. Veuillez réessayer dans quelques instants.');
      } else if (error.message.includes('serveur') || error.message.includes('indisponible')) {
        setError('🔧 L\'analyse IA est temporairement indisponible. Veuillez réessayer plus tard.');
      } else {
        setError(error.message || 'Erreur lors de l\'analyse de compatibilité IA');
      }
    }
  };

  // Obtenir les poids selon le type d'offre
  const getWeightsByOfferType = (type) => {
    switch (type) {
      case 'emploi':
        return {
          skills_match: 0.30,
          experience_match: 0.25,
          location_match: 0.15,
          text_similarity: 0.15,
          salary_match: 0.10,
          education_match: 0.05
        };
      case 'consultation':
        return {
          expertise_match: 0.30,
          portfolio_quality: 0.25,
          experience_level: 0.20,
          availability: 0.10,
          communication_skills: 0.10,
          sector_knowledge: 0.05
        };
      case 'financement':
        return {
          business_plan_quality: 0.25,
          financial_profile: 0.25,
          project_viability: 0.20,
          market_potential: 0.15,
          team_experience: 0.10,
          guarantees: 0.05
        };
      default:
        return {
          basic_match: 0.40,
          profile_completeness: 0.35,
          location_match: 0.25
        };
    }
  };

  // Générer les points forts basés sur les scores détaillés
  const generateStrengths = (detailedScores, offerType) => {
    const strengths = [];
    const threshold = 80;
    
    switch (offerType) {
      case 'JOB':
        if (detailedScores.skill_match >= threshold) {
          strengths.push('Excellente correspondance des compétences');
        }
        if (detailedScores.experience_match >= threshold) {
          strengths.push('Expérience très pertinente pour le poste');
        }
        if (detailedScores.location_match >= threshold) {
          strengths.push('Localisation parfaitement adaptée');
        }
        if (detailedScores.salary_match >= threshold) {
          strengths.push('Attentes salariales alignées');
        }
        if (detailedScores.culture_match >= threshold) {
          strengths.push('Culture d\'entreprise compatible');
        }
        break;
        
      case 'CONSULTATION':
        if (detailedScores.expertise_match >= threshold) {
          strengths.push('Expertise métier excellente');
        }
        if (detailedScores.portfolio_match >= threshold) {
          strengths.push('Portfolio de qualité');
        }
        if (detailedScores.availability_match >= threshold) {
          strengths.push('Disponibilité parfaite');
        }
        if (detailedScores.rates_match >= threshold) {
          strengths.push('Tarifs compétitifs');
        }
        if (detailedScores.references_match >= threshold) {
          strengths.push('Références de qualité');
        }
        break;
        
      case 'FUNDING':
        if (detailedScores.business_plan_match >= threshold) {
          strengths.push('Plan d\'affaires solide');
        }
        if (detailedScores.financial_profile_match >= threshold) {
          strengths.push('Profil financier excellent');
        }
        if (detailedScores.guarantees_match >= threshold) {
          strengths.push('Garanties solides');
        }
        if (detailedScores.profitability_match >= threshold) {
          strengths.push('Potentiel de rentabilité élevé');
        }
        if (detailedScores.risk_assessment >= threshold) {
          strengths.push('Niveau de risque maîtrisé');
        }
        break;
        
      default:
        // Fallback pour les types non reconnus
        Object.entries(detailedScores).forEach(([key, score]) => {
          if (score >= threshold) {
            strengths.push(`Score élevé en ${key.replace('_', ' ')}`);
          }
        });
    }
    
    return strengths.length > 0 ? strengths : ['Profil globalement compatible'];
  };

  // Générer les points faibles basés sur les scores détaillés
  const generateWeaknesses = (detailedScores, offerType) => {
    const weaknesses = [];
    const threshold = 60;
    
    switch (offerType) {
      case 'JOB':
        if (detailedScores.skill_match < threshold) {
          weaknesses.push('Certaines compétences requises manquent');
        }
        if (detailedScores.experience_match < threshold) {
          weaknesses.push('Expérience insuffisante pour le poste');
        }
        if (detailedScores.location_match < threshold) {
          weaknesses.push('Localisation non optimale');
        }
        if (detailedScores.salary_match < threshold) {
          weaknesses.push('Attentes salariales non alignées');
        }
        if (detailedScores.culture_match < threshold) {
          weaknesses.push('Culture d\'entreprise non compatible');
        }
        break;
        
      case 'CONSULTATION':
        if (detailedScores.expertise_match < threshold) {
          weaknesses.push('Expertise métier insuffisante');
        }
        if (detailedScores.portfolio_match < threshold) {
          weaknesses.push('Portfolio à améliorer');
        }
        if (detailedScores.availability_match < threshold) {
          weaknesses.push('Disponibilité limitée');
        }
        if (detailedScores.rates_match < threshold) {
          weaknesses.push('Tarifs non compétitifs');
        }
        if (detailedScores.references_match < threshold) {
          weaknesses.push('Références insuffisantes');
        }
        break;
        
      case 'FUNDING':
        if (detailedScores.business_plan_match < threshold) {
          weaknesses.push('Plan d\'affaires à améliorer');
        }
        if (detailedScores.financial_profile_match < threshold) {
          weaknesses.push('Profil financier fragile');
        }
        if (detailedScores.guarantees_match < threshold) {
          weaknesses.push('Garanties insuffisantes');
        }
        if (detailedScores.profitability_match < threshold) {
          weaknesses.push('Rentabilité incertaine');
        }
        if (detailedScores.risk_assessment < threshold) {
          weaknesses.push('Niveau de risque élevé');
        }
        break;
        
      default:
        // Fallback pour les types non reconnus
        Object.entries(detailedScores).forEach(([key, score]) => {
          if (score < threshold) {
            weaknesses.push(`Score faible en ${key.replace('_', ' ')}`);
          }
        });
    }
    
    return weaknesses.length > 0 ? weaknesses : ['Aucun point faible majeur identifié'];
  };

  // Générer les recommandations basées sur les scores détaillés
  const generateRecommendations = (detailedScores, offerType) => {
    const recommendations = [];
    
    switch (offerType) {
      case 'JOB':
        if (detailedScores.skill_match < 70) {
          recommendations.push('Développer les compétences manquantes');
        }
        if (detailedScores.experience_match < 70) {
          recommendations.push('Acquérir plus d\'expérience dans le domaine');
        }
        if (detailedScores.location_match < 70) {
          recommendations.push('Envisager la mobilité géographique');
        }
        if (detailedScores.culture_match < 70) {
          recommendations.push('Se renseigner sur la culture d\'entreprise');
        }
        break;
        
      case 'CONSULTATION':
        if (detailedScores.expertise_match < 70) {
          recommendations.push('Renforcer l\'expertise métier');
        }
        if (detailedScores.portfolio_match < 70) {
          recommendations.push('Améliorer le portfolio avec des projets récents');
        }
        if (detailedScores.rates_match < 70) {
          recommendations.push('Réviser la stratégie tarifaire');
        }
        break;
        
      case 'FUNDING':
        if (detailedScores.business_plan_match < 70) {
          recommendations.push('Affiner le plan d\'affaires');
        }
        if (detailedScores.financial_profile_match < 70) {
          recommendations.push('Consolider le profil financier');
        }
        if (detailedScores.guarantees_match < 70) {
          recommendations.push('Renforcer les garanties');
        }
        break;
        
      default:
        recommendations.push('Analyser les critères d\'évaluation');
    }
    
    recommendations.push('Mettre en avant vos points forts dans la candidature');
    recommendations.push('Préparer des exemples concrets de votre travail');
    
    return recommendations;
  };

  const handleSubmitApplication = async () => {
    if (!motivationLetter.trim()) {
      alert('Veuillez rédiger votre lettre de motivation');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ici, vous pouvez ajouter la logique pour soumettre la candidature
      // avec la lettre de motivation et les résultats de l'analyse IA
      
      console.log('📝 Soumission de candidature avec analyse IA:', {
        offerId,
        offerType,
        motivationLetter,
        compatibilityScore,
        analysis
      });
      
      // Simulation de soumission pour l'instant
      setTimeout(() => {
        alert('Candidature envoyée avec succès ! Votre score de compatibilité IA a été pris en compte.');
        
        // Rediriger selon le type d'offre
        switch (offerType) {
          case 'emploi':
            navigate('/jobs');
            break;
          case 'consultation':
            navigate('/consultations');
            break;
          case 'financement':
            navigate('/financements');
            break;
          case 'bourse':
            navigate('/bourses');
            break;
          default:
            navigate('/candidat');
        }
        
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      console.error('❌ Erreur lors de la soumission:', error);
      alert('Erreur lors de la soumission de la candidature');
      setIsSubmitting(false);
    }
  };

  const handleCreateCandidature = async (e) => {
    e.preventDefault();
    setCandidatureErrors([]);
    let hasError = false;

    // Debug: Afficher toutes les informations importantes
    console.log('🔍 DEBUG - Informations de candidature:');
    console.log('  - offerId (de useParams):', offerId);
    console.log('  - offerType (de useParams):', offerType);
    console.log('  - offer (de l\'état):', offer);
    console.log('  - offer.id:', offer?.id);
    console.log('  - offer.status:', offer?.status);
    console.log('  - offer (complet):', JSON.stringify(offer, null, 2));
    console.log('  - user:', user);
    console.log('  - candidatureForm:', candidatureForm);
    console.log('  - candidatureFiles:', candidatureFiles);

    // Vérification spéciale pour les offres de financement
    if (offerType === 'financement' && offer) {
      console.log('💰 FINANCEMENT - Vérification du statut:');
      console.log('  - offer.status:', offer.status);
      console.log('  - est publiée (APPROVED):', offer.status === 'APPROVED');
      console.log('  - est active:', offer.is_active);
      console.log('  - date de clôture:', offer.closing_date);
      console.log('  - expirée:', offer.is_expired);
      
      // Vérifier si l'offre est dans un état valide pour candidature
      if (offer.status !== 'APPROVED') {
        setCandidatureErrors([`Cette offre de financement n'est pas encore approuvée (statut: ${offer.status}). Vous ne pouvez pas postuler pour le moment.`]);
        hasError = true;
      }
      
      if (offer.is_expired) {
        setCandidatureErrors(['Cette offre de financement a expiré. Vous ne pouvez plus postuler.']);
        hasError = true;
      }
    }

    if (!user) {
      setCandidatureErrors(['Vous devez être connecté pour soumettre une candidature.']);
      hasError = true;
    }

    if (!offer) {
      setCandidatureErrors(['Offre non trouvée.']);
      hasError = true;
    }

    // Vérifier que l'offerId existe
    if (!offerId) {
      setCandidatureErrors(['ID de l\'offre manquant dans l\'URL.']);
      hasError = true;
    }

    // Utiliser l'ID de l'offre chargée si disponible, sinon celui de l'URL
    const actualOfferId = offer?.id || offerId;
    console.log('  - actualOfferId utilisé:', actualOfferId);

    // Vérification supplémentaire : s'assurer que l'offre est bien chargée
    if (!offer || !offer.id) {
      console.error('❌ Offre non chargée ou invalide:', offer);
      setCandidatureErrors(['L\'offre n\'a pas pu être chargée. Veuillez rafraîchir la page et réessayer.']);
      return;
    }

    // Vérifier la cohérence du type d'offre avec les données reçues
    const detectedType = detectOfferType(offer);
    if (detectedType !== offerType) {
      console.error('❌ Incohérence de type d\'offre:', { offerType, detectedType, offer });
      setCandidatureErrors([
        `Type d'offre incohérent: l'URL indique "${offerType}" mais les données correspondent à une offre de "${detectedType}". ` +
        'Veuillez rafraîchir la page ou contacter le support.'
      ]);
      return;
    }

    // Vérifier que l'ID de l'offre correspond à celui de l'URL
    if (offer.id !== offerId) {
      console.warn('⚠️ ID de l\'offre différent de celui de l\'URL:', { offerId, actualOfferId: offer.id });
    }

    if (offerType === 'emploi' && !candidatureFiles.cv) {
      setCandidatureErrors(['Veuillez sélectionner un CV.']);
      hasError = true;
    }
    if (offerType === 'consultation' && !candidatureFiles.portfolio) {
      setCandidatureErrors(['Veuillez sélectionner un Portfolio.']);
      hasError = true;
    }
    if (offerType === 'financement' && !candidatureFiles.business_plan) {
      setCandidatureErrors(['Veuillez sélectionner un Plan d\'affaires.']);
      hasError = true;
    }
    if (offerType === 'financement' && !candidatureForm.requested_amount) {
      setCandidatureErrors(['Veuillez spécifier le montant demandé.']);
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsCreatingCandidature(true);
    
    try {
      console.log('🚀 Début création candidature');
      console.log('📋 actualOfferId final:', actualOfferId);
      console.log('📋 offerType:', offerType);
      
      // Test d'accessibilité de l'offre avant de procéder
      console.log('🔍 Test d\'accessibilité de l\'offre...');
      const accessibilityTest = await CreeCandidatureService.testOfferAvailability(actualOfferId, offerType);
      
      console.log('📊 Résultat du test d\'accessibilité:', accessibilityTest);
      
      if (!accessibilityTest.isValid) {
        let errorMessage = 'Impossible de créer une candidature pour cette offre:\n';
        
        if (!accessibilityTest.checks.exists) {
          errorMessage += '- L\'offre n\'existe pas ou n\'est plus disponible';
        } else if (accessibilityTest.checks.accessDenied) {
          errorMessage += '- Accès interdit à cette offre';
        } else if (accessibilityTest.checks.notAuthenticated) {
          errorMessage += '- Authentification requise';
        } else if (accessibilityTest.checks.networkError) {
          errorMessage += '- Erreur de connexion au serveur';
        } else if (!accessibilityTest.checks.isApproved) {
          errorMessage += '- L\'offre n\'est pas encore approuvée ou publiée';
        } else if (!accessibilityTest.checks.isNotExpired) {
          errorMessage += '- L\'offre a expiré';
        } else if (!accessibilityTest.checks.hasValidClosingDate) {
          errorMessage += '- La date limite de candidature est dépassée';
        } else {
          errorMessage += `- ${accessibilityTest.error || 'Erreur inconnue'}`;
        }
        
        console.error('❌ Offre non accessible:', errorMessage);
        setCandidatureErrors([errorMessage]);
        return;
      }
      
      console.log('✅ Offre accessible, création de la candidature...');
      console.log('📋 candidatureForm:', candidatureForm);
      console.log('📋 candidatureFiles:', candidatureFiles);
      
      // Préparer les données du formulaire avec l'ID correct
      const formData = CreeCandidatureService.prepareFormData(
        actualOfferId,  // Utiliser l'ID vérifié
        offerType, 
        candidatureForm, 
        candidatureFiles
      );

      let response;
      
      // Créer la candidature selon le type d'offre
      switch (offerType) {
        case 'emploi':
          response = await CreeCandidatureService.createJobApplication(formData);
          break;
        case 'consultation':
          response = await CreeCandidatureService.createConsultationApplication(formData);
          break;
        case 'financement':
          response = await CreeCandidatureService.createFundingApplication(formData);
          break;
        default:
          throw new Error('Type d\'offre non supporté');
      }

      console.log('✅ Candidature créée avec succès:', response);
      
      // Afficher le message de succès
      alert('🎉 Candidature créée avec succès ! Votre score de compatibilité IA a été pris en compte.');
      
      // Fermer le modal et rediriger
      setShowCandidatureForm(false);
      setCandidatureForm({ motivation_letter: '', proposed_methodology: '', requested_amount: '' });
      setCandidatureFiles({});
      
      // Rediriger selon le type d'offre
      switch (offerType) {
        case 'emploi':
          navigate('/candidat/emploi-candidature');
          break;
        case 'consultation':
          navigate('/candidat/consultation-candidature');
          break;
        case 'financement':
          navigate('/candidat/financement-candidature');
          break;
        default:
          navigate('/candidat');
      }
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de la candidature:', error);
      setCandidatureErrors([error.message || 'Erreur lors de la création de la candidature']);
    } finally {
      setIsCreatingCandidature(false);
    }
  };

  // Gérer le changement de fichiers
  const handleFileChange = (field, files) => {
    console.log(`📎 handleFileChange appelé pour ${field}:`, files);
    console.log(`📎 Type de files:`, typeof files, files.constructor.name);
    console.log(`📎 Longueur:`, files ? files.length : 'null');
    
    if (files && files.length > 0) {
      // Convertir FileList en Array pour une meilleure compatibilité
      const filesArray = Array.from(files);
      console.log(`📎 Fichiers convertis en array:`, filesArray);
      
      setCandidatureFiles(prev => {
        const newFiles = {
          ...prev,
          [field]: filesArray
        };
        console.log(`📎 Nouveaux fichiers dans l'état:`, newFiles);
        return newFiles;
      });
    } else {
      console.log(`📎 Aucun fichier sélectionné pour ${field}`);
    }
  };

  // Réinitialiser le formulaire
  const resetCandidatureForm = () => {
    setCandidatureForm({
      motivation_letter: '',
      proposed_methodology: '',
      requested_amount: ''
    });
    setCandidatureFiles({});
    setCandidatureErrors([]);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-red-600 bg-red-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreText = (score) => {
    if (score >= 90) return 'Excellente compatibilité';
    if (score >= 80) return 'Très bonne compatibilité';
    if (score >= 70) return 'Bonne compatibilité';
    if (score >= 60) return 'Compatibilité moyenne';
    if (score >= 50) return 'Compatibilité faible';
    return 'Compatibilité très faible';
  };

  const getRecommendationText = (recommendation) => {
    switch (recommendation) {
      case 'RECOMMEND':
        return 'Recommandé';
      case 'CONSIDER':
        return 'À considérer';
      case 'NOT_RECOMMEND':
        return 'Non recommandé';
      default:
        return 'À évaluer';
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'RECOMMEND':
        return 'text-green-600 bg-green-100';
      case 'CONSIDER':
        return 'text-yellow-600 bg-yellow-100';
      case 'NOT_RECOMMEND':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Erreur</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-fuchsia-600 mx-auto mb-6"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Analyse IA en cours...</h2>
          <p className="text-gray-600 mb-4">
            Vérification de votre compatibilité avec le poste
          </p>
          
          {/* Informations sur le processus */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <h3 className="font-medium text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Ce que fait l'IA en ce moment :
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Analyse de votre profil et compétences</li>
              <li>• Comparaison avec les exigences du poste</li>
              <li>• Calcul des scores de compatibilité</li>
              <li>• Génération des recommandations</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">
              ⏱️ L'analyse peut prendre 30 secondes à 2 minutes selon la complexité
            </p>
          </div>
          
          {/* Barre de progression simulée */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-fuchsia-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Analyse en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-circle text-gray-400 text-4xl mb-4"></i>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Offre non trouvée</h2>
          <p className="text-gray-600 mb-4">L'offre demandée n'existe pas ou n'est plus disponible</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-robot text-fuchsia-600 mr-3"></i>
                Analyse IA - Compatibilité
              </h1>
              <p className="text-gray-600 mt-2">
                Analyse de votre profil pour : <span className="font-semibold">{offer.title || offer.name}</span>
              </p>
              {offer.company_name && (
                <p className="text-gray-500 text-sm">
                  <i className="fas fa-building mr-1"></i>
                  {offer.company_name}
                </p>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getScoreColor(compatibilityScore)}`}>
                <i className="fas fa-chart-line mr-2"></i>
                Score : {compatibilityScore.toFixed(1)}%
              </div>
              {analysis.recommendation && (
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRecommendationColor(analysis.recommendation)}`}>
                  <i className="fas fa-thumbs-up mr-1"></i>
                  {getRecommendationText(analysis.recommendation)}
                </div>
              )}
              {analysis.note && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <i className="fas fa-info-circle mr-1"></i>
                  Mode fallback
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score de compatibilité */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-percentage text-fuchsia-600 mr-2"></i>
                Score de compatibilité global
              </h2>
              
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - compatibilityScore / 100)}`}
                      className={`${getScoreColor(compatibilityScore).split(' ')[0]}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(compatibilityScore).split(' ')[0]}`}>
                        {compatibilityScore.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600">{getScoreText(compatibilityScore)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Détails du score avec poids */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {analysis.matchPercentage && Object.entries(analysis.matchPercentage).map(([key, score]) => {
                  const displayName = getDisplayName(key, offerType);
                  const weight = analysis.weights ? analysis.weights[key] || 0 : 0;
                  
                  return (
                    <div key={key} className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{score.toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">{displayName}</div>
                      {weight > 0 && (
                        <div className="text-xs text-gray-500">Poids: {(weight * 100).toFixed(1)}%</div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Note de l'analyse si disponible */}
              {analysis.note && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <i className="fas fa-info-circle mr-2"></i>
                    <strong>Note :</strong> {analysis.note}
                  </p>
                </div>
              )}
            </div>

            {/* Analyse détaillée */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <i className="fas fa-chart-bar text-fuchsia-600 mr-2"></i>
                Analyse détaillée
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Points forts */}
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-3">
                    <i className="fas fa-check-circle mr-2"></i>
                    Points forts
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-plus text-green-500 mr-2 mt-1 text-sm"></i>
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Points d'amélioration */}
                <div>
                  <h3 className="text-lg font-medium text-orange-700 mb-3">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Points d'amélioration
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-minus text-orange-500 mr-2 mt-1 text-sm"></i>
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommandations */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-blue-700 mb-3">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Recommandations
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations?.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <i className="fas fa-arrow-right text-blue-500 mr-2 mt-1 text-sm"></i>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informations de l'offre */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-info-circle text-fuchsia-600 mr-2"></i>
                Détails de l'offre
              </h3>
              <div className="space-y-3 text-sm">
                {offer.salary_min && offer.salary_max && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salaire :</span>
                    <span className="font-medium text-gray-900">
                      {offer.salary_min?.toLocaleString()} - {offer.salary_max?.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                {offer.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Localisation :</span>
                    <span className="font-medium text-gray-900">{offer.location}</span>
                  </div>
                )}
                {offer.contract_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type de contrat :</span>
                    <span className="font-medium text-gray-900">{offer.contract_type}</span>
                  </div>
                )}
                {offer.experience_required && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expérience :</span>
                    <span className="font-medium text-gray-900">{offer.experience_required}</span>
                  </div>
                )}
                {offer.work_mode && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode de travail :</span>
                    <span className="font-medium text-gray-900">{offer.work_mode}</span>
                  </div>
                )}
                {offer.application_deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date limite :</span>
                    <span className="font-medium text-gray-900">
                      {new Date(offer.application_deadline).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Formulaire de candidature */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-paper-plane text-fuchsia-600 mr-2"></i>
                Candidature
              </h3>
              
              {!showMotivationForm ? (
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    Votre score de compatibilité IA : <span className="font-semibold text-fuchsia-600">{compatibilityScore}%</span>
                  </p>
                  {analysis.scoreSaved && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-green-700">
                        <i className="fas fa-check-circle mr-2"></i>
                        Score sauvegardé automatiquement
                      </p>
                    </div>
                  )}
                  <button
                    onClick={() => setShowCandidatureForm(true)}
                    className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Rédiger ma candidature
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lettre de motivation
                    </label>
                    <textarea
                      value={motivationLetter}
                      onChange={(e) => setMotivationLetter(e.target.value)}
                      placeholder="Rédigez votre lettre de motivation en vous appuyant sur votre score de compatibilité IA..."
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 100 caractères recommandé
                    </p>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowMotivationForm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting || motivationLetter.trim().length < 100}
                      className="flex-1 bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Envoi...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Envoyer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Statistiques de l'analyse */}
            {analysis.analysisDate && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-clock text-fuchsia-600 mr-2"></i>
                  Informations de l'analyse
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date d'analyse :</span>
                    <span className="font-medium text-gray-900">
                      {new Date(analysis.analysisDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure :</span>
                    <span className="font-medium text-gray-900">
                      {new Date(analysis.analysisDate).toLocaleTimeString('fr-FR')}
                    </span>
                  </div>
                  {analysis.scoreSaved && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut :</span>
                      <span className="font-medium text-green-600">
                        <i className="fas fa-check mr-1"></i>
                        Sauvegardé
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal lettre de motivation */}
        {showMotivationForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    <i className="fas fa-edit text-fuchsia-600 mr-2"></i>
                    Lettre de motivation
                  </h2>
                  <button 
                    onClick={() => setShowMotivationForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pourquoi êtes-vous intéressé par ce poste ?
                    </label>
                    <textarea
                      value={motivationLetter}
                      onChange={(e) => setMotivationLetter(e.target.value)}
                      placeholder="Rédigez votre lettre de motivation en expliquant pourquoi vous êtes le candidat idéal pour ce poste..."
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowMotivationForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSubmitApplication}
                      disabled={isSubmitting || !motivationLetter.trim()}
                      className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Envoyer ma candidature
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal création de candidature */}
        {showCandidatureForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    <i className="fas fa-file-alt text-fuchsia-600 mr-2"></i>
                    Créer ma candidature
                  </h2>
                  <button 
                    onClick={() => setShowCandidatureForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>

                {/* Affichage des documents requis selon le type d'offre */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    <i className="fas fa-info-circle mr-2"></i>
                    Documents requis pour {offerType === 'emploi' ? 'cette offre d\'emploi' : offerType === 'consultation' ? 'cette consultation' : 'ce financement'}
                  </h3>
                  <div className="text-sm text-blue-800">
                    {offerType === 'emploi' && (
                      <p>📋 <strong>CV obligatoire</strong> + Lettre de motivation et documents additionnels optionnels</p>
                    )}
                    {offerType === 'consultation' && (
                      <p>📋 <strong>Portfolio obligatoire</strong> + Lettre de motivation et méthodologie proposée optionnelles</p>
                    )}
                    {offerType === 'financement' && (
                      <p>📋 <strong>Plan d'affaires et montant demandé obligatoires</strong> + Lettre de motivation optionnelle</p>
                    )}
                  </div>
                </div>

                {/* Formulaire de candidature */}
                <form onSubmit={handleCreateCandidature} className="space-y-6">
                  {/* Documents obligatoires */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {offerType === 'emploi' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CV * <span className="text-red-500">(obligatoire)</span>
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange('cv', e.target.files)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX (max 10MB)</p>
                      </div>
                    )}

                    {offerType === 'consultation' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Portfolio * <span className="text-red-500">(obligatoire)</span>
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange('portfolio', e.target.files)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX (max 10MB)</p>
                      </div>
                    )}

                    {offerType === 'financement' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plan d'affaires * <span className="text-red-500">(obligatoire)</span>
                          </label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange('business_plan', e.target.files)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Formats acceptés: PDF, DOC, DOCX (max 10MB)</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Montant demandé * <span className="text-red-500">(obligatoire)</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={candidatureForm.requested_amount}
                            onChange={(e) => setCandidatureForm(prev => ({ ...prev, requested_amount: e.target.value }))}
                            placeholder="Montant en FCFA"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Documents optionnels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lettre de motivation
                      </label>
                      <textarea
                        value={candidatureForm.motivation_letter}
                        onChange={(e) => setCandidatureForm(prev => ({ ...prev, motivation_letter: e.target.value }))}
                        placeholder="Expliquez votre motivation et pourquoi vous êtes le candidat idéal..."
                        rows="4"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {offerType === 'consultation' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Méthodologie proposée
                        </label>
                        <textarea
                          value={candidatureForm.proposed_methodology}
                          onChange={(e) => setCandidatureForm(prev => ({ ...prev, proposed_methodology: e.target.value }))}
                          placeholder="Décrivez votre approche et méthodologie..."
                          rows="4"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diplômes
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) => handleFileChange('diplomas', e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Certificats
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) => handleFileChange('certificates', e.target.files)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Affichage des erreurs */}
                  {candidatureErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Erreurs à corriger :</h4>
                      <ul className="text-sm text-red-700 space-y-1">
                        {candidatureErrors.map((error, index) => (
                          <li key={index} className="flex items-center">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowCandidatureForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingCandidature}
                      className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCreatingCandidature ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Créer ma candidature
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Fonction utilitaire pour obtenir le nom d'affichage des critères
const getDisplayName = (key, offerType) => {
  const displayNames = {
    // Critères pour les emplois
    skill_match: 'Compétences',
    experience_match: 'Expérience',
    location_match: 'Localisation',
    salary_match: 'Salaire',
    culture_match: 'Culture',
    education_match: 'Formation',
    
    // Critères pour les consultations
    expertise_match: 'Expertise',
    portfolio_match: 'Portfolio',
    availability_match: 'Disponibilité',
    rates_match: 'Tarifs',
    references_match: 'Références',
    
    // Critères pour les financements
    business_plan_match: 'Plan d\'affaires',
    financial_profile_match: 'Profil financier',
    guarantees_match: 'Garanties',
    profitability_match: 'Rentabilité',
    risk_assessment: 'Évaluation risque',
    
    // Fallback
    skills_match: 'Compétences',
    text_similarity: 'Cohérence'
  };
  
  return displayNames[key] || key.replace('_', ' ');
};

// Détecter automatiquement le type d'offre basé sur les données
const detectOfferType = (offerData) => {
  if (!offerData) return offerType;
  
  console.log('🔍 Analyse des données pour détecter le type d\'offre:', offerData);
  
  // Vérifier les attributs spécifiques à chaque type d'offre
  if (offerData.min_amount && offerData.max_amount && offerData.annual_interest_rate) {
    console.log('💰 Offre de FINANCEMENT détectée (min_amount, max_amount, annual_interest_rate)');
    return 'financement';
  }
  
  if (offerData.contract_type && offerData.experience_required && offerData.work_mode) {
    console.log('💼 Offre d\'EMPLOI détectée (contract_type, experience_required, work_mode)');
    return 'emploi';
  }
  
  if (offerData.expertise_required || offerData.consultation_type) {
    console.log('📋 Offre de CONSULTATION détectée (expertise_required, consultation_type)');
    return 'consultation';
  }
  
  if (offerData.scholarship_amount || offerData.academic_level) {
    console.log('🎓 Offre de BOURSE détectée (scholarship_amount, academic_level)');
    return 'bourse';
  }
  
  // Si aucun attribut spécifique n'est trouvé, retourner le type de l'URL
  console.log('❓ Type d\'offre non détecté, utilisation du type de l\'URL:', offerType);
  return offerType;
};

export default IACompatibilityCheck; 