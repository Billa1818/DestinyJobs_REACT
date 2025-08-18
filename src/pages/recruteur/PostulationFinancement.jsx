import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import candidatureService from '../../services/candidatureService';
import financementService from '../../services/financementService';
import validationService from '../../services/validationService';
import Loader from '../../components/Loader';
import CandidaturePagination from '../../components/CandidaturePagination';

const PostulationFinancement = () => {
  const [searchParams] = useSearchParams(); 
  const financementIdParam = searchParams.get('financement');
  
  // États pour l'API
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  // Filtres API
  const [apiFilters, setApiFilters] = useState({
    status: '',
    priority: '',
    search: '',
    ordering: '-created_at'
  });

  // Filtres d'affichage (conservés pour la compatibilité)
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    experience: '',
    offre: '',
    localisation: '',
    dateCandidature: '',
    note: '',
    competences: ''
  });

  // États pour le modal des documents
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedCandidateDocuments, setSelectedCandidateDocuments] = useState(null);
  
  // États pour le modal de la lettre de motivation
  const [showMotivationLetterModal, setShowMotivationLetterModal] = useState(false);
  const [selectedMotivationLetter, setSelectedMotivationLetter] = useState(null);

  // États pour le modal de contact
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedContactCandidate, setSelectedContactCandidate] = useState(null);

  // État pour les détails de l'offre de financement
  const [financementDetails, setFinancementDetails] = useState(null);
  const [financementLoading, setFinancementLoading] = useState(false);

  // États pour le modal de confirmation pour les actions de validation
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationCandidate, setValidationCandidate] = useState(null);
  const [validationAction, setValidationAction] = useState(null);
  const [validationNotes, setValidationNotes] = useState('');
  const [validationLoading, setValidationLoading] = useState(false);

  // Fonction pour charger les détails de l'offre de financement
  const loadFinancementDetails = async () => {
    if (!financementIdParam || financementIdParam === 'undefined') return;
    
    try {
      setFinancementLoading(true);
      const financementData = await financementService.getFundingOfferDetail(financementIdParam);
      setFinancementDetails(financementData);
      console.log('✅ Détails de l\'offre de financement chargés:', financementData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des détails de l\'offre de financement:', error);
      setFinancementDetails(null);
    } finally {
      setFinancementLoading(false);
    }
  };

  // Fonction pour charger les candidatures depuis l'API
  const loadCandidatures = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (financementIdParam && financementIdParam !== 'undefined') {
        // Charger les candidatures pour un financement spécifique
        console.log(`🔍 Chargement des candidatures pour le financement: ${financementIdParam}`);
        response = await candidatureService.getFundingApplicationsByOffer(financementIdParam, apiFilters, pagination.currentPage, pagination.pageSize);
      } else {
        // Charger toutes les candidatures de financement
        console.log('🔍 Chargement de toutes les candidatures de financement');
        response = await candidatureService.getFundingApplications(apiFilters, pagination.currentPage, pagination.pageSize);
      }
      
      console.log('📡 Réponse API reçue:', response);
      
      // Vérifier la structure de la réponse
      if (!response) {
        throw new Error('Aucune réponse reçue de l\'API');
      }
      
      // Gérer différents formats de réponse
      let results = [];
      let count = 0;
      
      if (response.results && Array.isArray(response.results)) {
        // Format paginé standard
        results = response.results;
        count = response.count || response.results.length;
      } else if (Array.isArray(response)) {
        // Format simple (tableau direct)
        results = response;
        count = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        // Format avec wrapper data
        results = response.data;
        count = response.data.length;
      } else {
        console.warn('⚠️ Structure de réponse inattendue:', response);
        results = [];
        count = 0;
      }
      
      console.log(`📊 ${results.length} candidatures trouvées sur ${count} total`);
      
      // Formater les données pour l'affichage
      const formattedCandidatures = results.map(apiCandidature => 
        formatCandidatureData(apiCandidature)
      );
      
      setCandidatures(formattedCandidatures);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(count / pagination.pageSize),
        totalCount: count
      }));
    } catch (err) {
      console.error('❌ Erreur lors du chargement des candidatures:', err);
      setError(err.message || 'Erreur lors du chargement des candidatures');
      setCandidatures([]);
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalCount: 0
      }));
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  // Fonction pour formater les données de l'API
  const formatCandidatureData = (apiCandidature) => {
    // DEBUG - Afficher la structure exacte des données reçues
    console.log('🔍 DEBUG - Structure de apiCandidature reçue:', apiCandidature);
    console.log('🔍 DEBUG - apiCandidature.id:', apiCandidature?.id);
    console.log('🔍 DEBUG - apiCandidature.application?.id:', apiCandidature?.application?.id);
    console.log('🔍 DEBUG - apiCandidature.application?.applicant?.id:', apiCandidature?.application?.applicant?.id);
    
    // Vérifier que l'objet de base existe
    if (!apiCandidature || typeof apiCandidature !== 'object') {
      return {
        id: 'unknown',
        nom: 'Candidat inconnu',
        titre: 'Titre non spécifié',
        experience: 'Expérience non spécifiée',
        statut: 'unknown',
        competences: [],
        email: 'Email non spécifié',
        telephone: 'Téléphone non spécifié',
        dateCandidature: new Date().toLocaleDateString('fr-FR'),
        avatar: '?',
        note: 0,
        cv: false,
        lettre: false,
        offre: 'Offre non spécifiée',
        localisation: 'Localisation non spécifiée',
        niveauExperience: 'Niveau non spécifié',
        apiData: apiCandidature
      };
    }
    
    // Extraire les données avec la nouvelle structure
    const application = apiCandidature.application || {};
    const applicant = application.applicant || {};
    const applicantProfile = apiCandidature.candidate_profile || {};
    const fundingOffer = apiCandidature.funding_offer || {};
    
    // Construire le nom complet avec fallbacks
    const firstName = applicant.first_name || '';
    const lastName = applicant.last_name || '';
    const username = applicant.username || 'Utilisateur';
    const nom = `${firstName} ${lastName}`.trim() || username;
    
    // Construire l'avatar avec fallbacks
    const avatar = (firstName.charAt(0) || '') + (lastName.charAt(0) || '') || username.charAt(0) || '?';
    
    // Extraire l'image de profil depuis candidate_profile.image
    let imageProfil = applicantProfile.image || null;
    
    // Convertir l'URL relative en URL absolue si nécessaire
    if (imageProfil && !imageProfil.startsWith('http')) {
      // Si l'URL commence par /media, ajouter le port 8000
      if (imageProfil.startsWith('/media')) {
        imageProfil = `http://localhost:8000${imageProfil}`;
      }
      // Si l'URL ne commence pas par http, ajouter le port 8000
      else if (!imageProfil.startsWith('http://localhost:8000')) {
        imageProfil = `http://localhost:8000${imageProfil.startsWith('/') ? '' : '/'}${imageProfil}`;
      }
    }
    
    // Extraire le titre de l'offre de financement
    const titre = fundingOffer.title || 'Titre non spécifié';
    
    // Extraire le statut avec fallback
    const statut = (application.status || 'unknown').toLowerCase();
    
    // Extraire la priorité
    const priorite = application.priority || 'NORMAL';
    
    // Extraire la note depuis l'analyse IA
    const note = apiCandidature.ai_analysis?.compatibility_score ? parseFloat(apiCandidature.ai_analysis.compatibility_score) : 0;
    
    // Vérifier la présence des documents
    const cv = !!(apiCandidature.candidate_cv || applicantProfile.cv);
    const lettre = !!(apiCandidature.motivation_letter || application.motivation_letter);
    
    // Extraire la date de candidature
    const dateCandidature = application.created_at 
      ? new Date(application.created_at).toLocaleDateString('fr-FR')
      : new Date().toLocaleDateString('fr-FR');
    
    // Extraire l'expérience
    const yearsExperience = applicantProfile.years_experience || 0;
    const experience = `${yearsExperience} an(s) d'expérience`;
    
    // Déterminer le niveau d'expérience
    let niveauExperience = 'Junior';
    if (yearsExperience >= 10) niveauExperience = 'Expert';
    else if (yearsExperience >= 5) niveauExperience = 'Senior';
    else if (yearsExperience >= 2) niveauExperience = 'Intermédiaire';
    
    // Extraire les compétences depuis skills
    const competences = applicantProfile.skills ? applicantProfile.skills.split(',').map(s => s.trim()) : [];
    
    // Extraire les technologies
    const technologies = applicantProfile.technologies ? applicantProfile.technologies.split(',').map(t => t.trim()) : [];
    
    // Extraire la localisation
    const country = applicantProfile.country?.name || '';
    const region = applicantProfile.region?.name || '';
    const localisation = [country, region].filter(Boolean).join(', ') || 'Localisation non spécifiée';
    
    // Extraire l'offre de financement
    const offre = titre;
    
    // Extraire l'éducation
    const education = applicantProfile.education || 'Non spécifiée';
    
    // Extraire l'expérience professionnelle
    const experienceProfessionnelle = applicantProfile.professional_experience || 'Non spécifiée';
    
    // Extraire les réalisations
    const achievements = applicantProfile.achievements || 'Non spécifiées';
    
    // Extraire le montant demandé
    const montantDemande = apiCandidature.requested_amount ? parseFloat(apiCandidature.requested_amount).toLocaleString('fr-FR') : 'Non spécifié';
    
    // Extraire le plan d'affaires
    const businessPlan = apiCandidature.business_plan || null;
    
    // Extraire la lettre de motivation
    const motivationLetter = apiCandidature.motivation_letter || null;
    
    // Extraire les informations sur l'offre de financement
    const offreFinancement = {
      titre: fundingOffer.title || 'Titre non spécifié',
      montantMin: fundingOffer.min_amount ? parseFloat(fundingOffer.min_amount).toLocaleString('fr-FR') : 'Non spécifié',
      montantMax: fundingOffer.max_amount ? parseFloat(fundingOffer.max_amount).toLocaleString('fr-FR') : 'Non spécifié',
      tauxInteret: fundingOffer.annual_interest_rate ? `${fundingOffer.annual_interest_rate}%` : 'Non spécifié',
      dureeRemboursement: fundingOffer.repayment_duration ? `${fundingOffer.repayment_duration} mois` : 'Non spécifié',
      secteur: fundingOffer.sector?.name || 'Non spécifié',
      cible: fundingOffer.target?.name || 'Non spécifié',
      zoneGeographique: fundingOffer.geographic_zone || 'Non spécifiée',
      sansGarantie: fundingOffer.no_guarantee || false,
      periodeGrace: fundingOffer.grace_period_available || false,
      planAffairesRequis: fundingOffer.business_plan_required || false,
      etatsFinanciersRequis: fundingOffer.financial_statements_required || false,
      dateLimite: fundingOffer.application_deadline ? new Date(fundingOffer.application_deadline).toLocaleDateString('fr-FR') : 'Non spécifiée',
      joursAvantFermeture: fundingOffer.days_until_closing || 0,
      urgent: fundingOffer.is_urgent_closing || false
    };
    
    return {
      id: apiCandidature.application?.id || apiCandidature.id || 'unknown',
      nom,
      titre,
      experience,
      statut,
      priorite,
      competences,
      technologies,
      email: applicant.email || 'Email non spécifié',
      telephone: applicant.phone || 'Téléphone non spécifié',
      dateCandidature,
      avatar,
      imageProfil,
      note,
      cv,
      lettre,
      offre,
      localisation,
      niveauExperience,
      education,
      experienceProfessionnelle,
      achievements,
      montantDemande,
      businessPlan,
      motivationLetter,
      offreFinancement,
      // Données API originales
      apiData: apiCandidature
    };
  };

  // Gestion des filtres API
  const handleApiFilterChange = (filterName, value) => {
    setApiFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Gestion de la pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ 
      ...prev, 
      currentPage: 1, 
      pageSize: newPageSize 
    }));
  };

  // Recherche
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    loadCandidatures();
  };

  // Gestion des filtres avancés
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Fonction de réinitialisation des filtres
  const resetFilters = () => {
    setApiFilters({
      status: '',
      priority: '',
      search: '',
      ordering: '-created_at'
    });
    setFilters({
      search: '',
      status: '',
      experience: '',
      offre: '',
      localisation: '',
      dateCandidature: '',
      note: '',
      competences: ''
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Fonction de mise à jour du statut
  const updateCandidatureStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'accepted') {
        await validationService.acceptApplication(id, validationNotes || 'Candidat parfaitement qualifié pour le financement');
      } else if (newStatus === 'rejected') {
        await validationService.rejectApplication(id, validationNotes || 'Candidature non retenue pour ce financement');
      }
      // Recharger les candidatures après la mise à jour
      loadCandidatures();
      setValidationLoading(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      setValidationLoading(false);
    }
  };

  // Fonction pour approuver une candidature
  const approveApplication = async (id) => {
    try {
      await validationService.acceptApplication(id, validationNotes || 'Candidat parfaitement qualifié pour le financement');
      // Recharger les candidatures après la mise à jour
      loadCandidatures();
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      throw error; // Propager l'erreur pour la gestion dans confirmValidation
    }
  };

  // Fonction pour rejeter une candidature
  const rejectApplication = async (id) => {
    try {
      await validationService.rejectApplication(id, validationNotes || 'Candidature non retenue pour ce financement');
      // Recharger les candidatures après la mise à jour
      loadCandidatures();
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      throw error; // Propager l'erreur pour la gestion dans confirmValidation
    }
  };

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (statut) => {
    switch (statut) {
      case 'pending': return 'border-blue-500 bg-blue-50';
      case 'viewed': return 'border-yellow-500 bg-yellow-50';
      case 'shortlisted': return 'border-green-500 bg-green-50';
      case 'interview': return 'border-purple-500 bg-purple-50';
      case 'rejected': return 'border-red-500 bg-red-50';
      case 'accepted': return 'border-emerald-500 bg-emerald-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (statut) => {
    switch (statut) {
      case 'pending': return 'En attente';
      case 'viewed': return 'Vue';
      case 'shortlisted': return 'Sélectionnée';
      case 'interview': return 'Entretien';
      case 'rejected': return 'Refusée';
      case 'accepted': return 'Acceptée';
      default: return 'Inconnu';
    }
  };

  // Fonction pour afficher la lettre de motivation
  const viewMotivationLetter = (candidature) => {
    // Afficher le modal avec la lettre de motivation
    setSelectedMotivationLetter(candidature);
    setShowMotivationLetterModal(true);
  };

  // Fonction pour voir les détails du candidat
  const viewCandidateDetails = (candidature) => {
    // Rediriger vers le profil public du candidat
    const candidateId = candidature.apiData?.application?.applicant?.id;
    if (candidateId) {
      window.open(`/profile/candidat/${candidateId}`, '_blank');
    } else {
      alert('ID du candidat non disponible');
    }
  };

  // Fonction pour voir les documents du candidat
  const viewDocuments = (candidature) => {
    // Afficher le modal avec les documents
    setSelectedCandidateDocuments(candidature);
    setShowDocumentsModal(true);
  };

  // Fonction pour voir la compatibilité
  const viewCompatibility = (candidature) => {
    console.log('Voir compatibilité pour:', candidature.id);
    // TODO: Implémenter l'analyse de compatibilité IA
    alert('Fonctionnalité de compatibilité IA à implémenter');
  };

  // Fonction pour contacter le candidat
  const contactCandidate = (candidatureId) => {
    // Trouver la candidature pour récupérer les informations de contact
    const candidature = candidatures.find(c => c.id === candidatureId);
    if (candidature) {
      // Afficher le modal de contact
      setSelectedContactCandidate(candidature);
      setShowContactModal(true);
    } else {
      alert('Informations de contact non disponibles');
    }
  };

  // Effet pour charger les candidatures
  useEffect(() => {
    loadCandidatures();
    if (financementIdParam && financementIdParam !== 'undefined') {
      loadFinancementDetails();
    }
  }, [financementIdParam, pagination.currentPage, pagination.pageSize, apiFilters.status, apiFilters.priority, apiFilters.ordering]);

  // Fonction pour confirmer la validation de la candidature
  const confirmValidation = async () => {
    try {
      setValidationLoading(true);
      if (validationAction === 'approve') {
        await approveApplication(validationCandidate.id);
        // Afficher une alerte de succès pour l'acceptation
        alert(`✅ Candidat ${validationCandidate.nom} accepté avec succès !`);
      } else if (validationAction === 'reject') {
        await rejectApplication(validationCandidate.id);
        // Afficher une alerte de succès pour le refus
        alert(`❌ Candidat ${validationCandidate.nom} refusé avec succès !`);
      }
      // Succès : fermer le modal et réinitialiser
      setShowValidationModal(false);
      setValidationCandidate(null);
      setValidationNotes('');
      setValidationLoading(false);
    } catch (error) {
      console.error('Erreur lors de la validation de la candidature:', error);
      // Erreur : afficher une alerte d'erreur
      alert(`❌ Erreur lors de la validation : ${error.message}`);
      // Erreur : garder le modal ouvert mais arrêter le loading
      setValidationLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-money-bill-wave mr-2 text-green-600"></i>
              {financementIdParam && financementIdParam !== 'undefined' ? (
                `Candidatures - Financement #${financementIdParam}`
              ) : (
                'Candidatures - Financements'
              )}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {financementIdParam && financementIdParam !== 'undefined' ? (
                `Gérez et évaluez les candidatures reçues pour ce financement spécifique`
              ) : (
                'Gérez et évaluez les candidatures reçues pour vos offres de financement'
              )}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {financementIdParam && financementIdParam !== 'undefined' ? 'Financement spécifique' : 'Financement'}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{candidatures.length} candidatures</span>
              <span className="text-xs text-gray-500">Mis à jour récemment</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/gestion-financements"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour aux financements
            </Link>
          </div>
        </div>
      </div>

      {/* Détails de l'offre (si une offre spécifique est sélectionnée) */}
      {financementIdParam && financementIdParam !== 'undefined' && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              <i className="fas fa-briefcase mr-2 text-blue-600"></i>
              Détails de l'offre
            </h3>
          </div>
          
          {financementLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader />
            </div>
          ) : financementDetails ? (
            <div className="space-y-4">
              {/* En-tête de l'offre */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-briefcase text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{financementDetails.title || 'Titre non spécifié'}</h4>
                    </div>
                  </div>
                  
                  {/* Informations de base */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    {financementDetails.sector && (
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-industry mr-2"></i>
                        <span>{financementDetails.sector.name || financementDetails.sector}</span>
                      </div>
                    )}
                    {financementDetails.target && (
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-bullseye mr-2"></i>
                        <span>{financementDetails.target.name || financementDetails.target}</span>
                      </div>
                    )}
                    {financementDetails.created_at && (
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-calendar mr-2"></i>
                        <span>Publié le {new Date(financementDetails.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Statut de l'offre */}
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    financementDetails.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    financementDetails.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    financementDetails.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {financementDetails.status === 'ACTIVE' ? 'Active' : 
                     financementDetails.status === 'PENDING' ? 'En attente' : 
                     financementDetails.status === 'CLOSED' ? 'Fermée' : 
                     financementDetails.status || 'Inconnu'}
                  </span>
                </div>
              </div>

              {/* Statistiques de l'offre */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {financementDetails.amount && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      {financementDetails.amount} FCFA
                    </div>
                    <div className="text-sm text-gray-600">Montant du financement</div>
                  </div>
                )}
                {financementDetails.interest_rate && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600 mb-1">
                      {financementDetails.interest_rate}%
                    </div>
                    <div className="text-sm text-gray-600">Taux d'intérêt</div>
                  </div>
                )}
                {financementDetails.duration && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {financementDetails.duration} mois
                    </div>
                    <div className="text-sm text-gray-600">Durée du prêt</div>
                  </div>
                )}
              </div>

              {/* Description courte */}
              {financementDetails.description && (
                <div className="mt-4">
                  <h5 className="text-md font-semibold text-gray-900 mb-2">Description :</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {financementDetails.description.length > 200 
                      ? `${financementDetails.description.substring(0, 200)}...` 
                      : financementDetails.description
                    }
                  </p>
                </div>
              )}


              {/* Informations détaillées supplémentaires */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colonne gauche - Conditions et exigences */}
                <div className="space-y-4">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-clipboard-list mr-2 text-blue-600"></i>
                    Conditions et exigences
                  </h5>
                  
                  {/* Garantie */}
                  {financementDetails.no_guarantee !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Garantie requise</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        financementDetails.no_guarantee ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {financementDetails.no_guarantee ? 'Non requise' : 'Requis'}
                      </span>
                    </div>
                  )}

                  {/* Période de grâce */}
                  {financementDetails.grace_period_available !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Période de grâce</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        financementDetails.grace_period_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {financementDetails.grace_period_available ? 'Disponible' : 'Non disponible'}
                      </span>
                    </div>
                  )}

                  {/* Expérience requise */}
                  {financementDetails.required_experience_years && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Expérience minimale</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {financementDetails.required_experience_years} an(s)
                      </span>
                    </div>
                  )}

                  {/* Taille de l'entreprise */}
                  {financementDetails.company_size && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Taille d'entreprise</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                        {financementDetails.company_size}
                      </span>
                    </div>
                  )}
                </div>

                {/* Colonne droite - Localisation et contact */}
                <div className="space-y-4">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-map-marker-alt mr-2 text-green-600"></i>
                    Localisation et contact
                  </h5>
                  
                  {/* Pays */}
                  {financementDetails.country && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Pays</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {financementDetails.country.name || financementDetails.country}
                      </span>
                    </div>
                  )}

                  {/* Région */}
                  {financementDetails.region && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Région</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {financementDetails.region.name || financementDetails.region}
                      </span>
                    </div>
                  )}

                  {/* Zone géographique */}
                  {financementDetails.geographic_zone && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Zone géographique</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {financementDetails.geographic_zone}
                      </span>
                    </div>
                  )}

                  {/* Informations de contact */}
                  {financementDetails.contact_info && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Contact</span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        {financementDetails.contact_info}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations sur le recruteur */}
              {financementDetails.recruiter && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-building mr-2 text-blue-600"></i>
                    Informations sur l'entreprise
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {financementDetails.recruiter.company_name && (
                      <div className="flex items-center">
                        <i className="fas fa-building mr-2 text-blue-600"></i>
                        <span className="text-sm text-gray-700">{financementDetails.recruiter.company_name}</span>
                      </div>
                    )}
                    {financementDetails.recruiter.sector && (
                      <div className="flex items-center">
                        <i className="fas fa-industry mr-2 text-blue-600"></i>
                        <span className="text-sm text-gray-700">{financementDetails.recruiter.sector}</span>
                      </div>
                    )}
                    {financementDetails.recruiter.company_size && (
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2 text-blue-600"></i>
                        <span className="text-sm text-gray-700">{financementDetails.recruiter.company_size}</span>
                      </div>
                    )}
                    {financementDetails.recruiter.website && (
                      <div className="flex items-center">
                        <i className="fas fa-globe mr-2 text-blue-600"></i>
                        <a 
                          href={financementDetails.recruiter.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {financementDetails.recruiter.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Détails techniques */}
              {financementDetails.pricing_type && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-calculator mr-2 text-purple-600"></i>
                    Détails techniques
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 mb-1">
                        {financementDetails.pricing_type}
                      </div>
                      <div className="text-xs text-gray-600">Type de tarification</div>
                    </div>
                    {financementDetails.max_concurrent_projects && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600 mb-1">
                          {financementDetails.max_concurrent_projects}
                        </div>
                        <div className="text-xs text-gray-600">Projets max simultanés</div>
                      </div>
                    )}
                    {financementDetails.estimated_duration && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600 mb-1">
                          {financementDetails.estimated_duration} jours
                        </div>
                        <div className="text-xs text-gray-600">Durée estimée</div>
                      </div>
                    )}
                  </div>
                </div>
              )}


            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-2xl text-gray-400"></i>
              </div>
              <p className="text-gray-600">Impossible de charger les détails de l'offre</p>
              <button 
                onClick={loadFinancementDetails}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}


      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{candidatures.length}</div>
          <div className="text-xs text-gray-500">
            {financementIdParam && financementIdParam !== 'undefined' ? 'Candidatures pour ce financement' : 'Candidatures filtrées'}
          </div>
          <div className="text-xs text-gray-400">sur {pagination.totalCount} total</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{candidatures.filter(c => c.statut === 'reviewing').length}</div>
          <div className="text-xs text-gray-500">En cours d'évaluation</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{candidatures.filter(c => c.statut === 'shortlisted').length}</div>
          <div className="text-xs text-gray-500">Présélectionné</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-600">{candidatures.filter(c => c.statut === 'rejected').length}</div>
          <div className="text-xs text-gray-500">Refusées</div>
        </div>
        
        {/* Nouvelles statistiques basées sur l'offre de financement */}
        {financementDetails && (
          <>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-purple-600">{financementDetails.views_count || 0}</div>
              <div className="text-xs text-gray-500">Vues de l'offre</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm text-center">
              <div className="text-2xl font-bold text-orange-600">{financementDetails.max_applications || '∞'}</div>
              <div className="text-xs text-gray-500">Candidatures max</div>
            </div>
          </>
        )}
      </div>


      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {financementIdParam && financementIdParam !== 'undefined' ? 'Filtres pour ce financement' : 'Filtres avancés'}
          </h3>
          {financementIdParam && financementIdParam !== 'undefined' && (
            <p className="text-sm text-gray-600 mb-3">
              Filtrage des candidatures pour le financement <strong>#{financementIdParam}</strong>
            </p>
          )}
        </div>
        
        {/* Première ligne de filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nom, email, compétences..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            >
              <option value="">Tous les statuts</option>
              <option value="new">Nouvelles</option>
              <option value="reviewing">En évaluation</option>
              <option value="shortlisted">Présélectionnées</option>
              <option value="interview">Entretien programmé</option>
              <option value="rejected">Refusées</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expérience</label>
            <select 
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            >
              <option value="">Toute expérience</option>
              <option value="junior">Junior (0-3 ans)</option>
              <option value="mid">Confirmé (3-7 ans)</option>
              <option value="senior">Senior (7+ ans)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note minimum</label>
            <select 
              name="note"
              value={filters.note}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            >
              <option value="">Toutes les notes</option>
              <option value="4.5">4.5+ étoiles</option>
              <option value="4.0">4.0+ étoiles</option>
              <option value="3.5">3.5+ étoiles</option>
              <option value="3.0">3.0+ étoiles</option>
            </select>
          </div>
        </div>
        
        {/* Deuxième ligne de filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offre</label>
            <input 
              type="text" 
              name="offre"
              value={filters.offre}
              onChange={handleFilterChange}
              placeholder="Rechercher par offre..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <input 
              type="text" 
              name="localisation"
              value={filters.localisation}
              onChange={handleFilterChange}
              placeholder="Ville, région..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
            <input 
              type="text" 
              name="competences"
              value={filters.competences}
              onChange={handleFilterChange}
              placeholder="Rechercher par compétences..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-undo mr-2"></i>
              Réinitialiser
            </button>
          </div>
        </div>
        
        {/* Résultats du filtrage */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {candidatures.length} candidature(s) trouvée(s)
            </span>
            <div className="flex space-x-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                <i className="fas fa-filter mr-1"></i>
                Filtres actifs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des candidatures */}
      <div className="space-y-4">


        {loading ? (
          <div className="text-center py-12">
            <Loader />
            <p className="text-gray-600 mt-4">Chargement des candidatures...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-3xl text-red-500"></i>
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Erreur lors du chargement</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <button 
                onClick={loadCandidatures}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200 mr-2"
              >
                <i className="fas fa-redo mr-2"></i>
                Réessayer
              </button>
              <button 
                onClick={() => {
                  setError(null);
                  setInitialLoad(true);
                  loadCandidatures();
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
              >
                <i className="fas fa-refresh mr-2"></i>
                Recharger
              </button>
            </div>
          </div>
        ) : candidatures.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-users text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {initialLoad ? 'Aucune candidature trouvée' : 'Aucune candidature correspond aux critères'}
            </h3>
            <p className="text-gray-600 mb-4">
              {initialLoad 
                ? (financementIdParam && financementIdParam !== 'undefined'
                    ? `Aucune candidature n'a encore été reçue pour le financement #${financementIdParam} ou l'API n'est pas accessible.`
                    : 'Il semble qu\'il n\'y ait pas encore de candidatures pour ce financement ou que l\'API ne soit pas accessible.'
                  )
                : 'Aucune candidature ne correspond aux critères de recherche actuels.'
              }
            </p>
            <div className="space-y-2">
              <button 
                onClick={loadCandidatures}
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200 mr-2"
              >
                <i className="fas fa-refresh mr-2"></i>
                Actualiser
              </button>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200"
              >
                <i className="fas fa-undo mr-2"></i>
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        ) : (
          candidatures.map((candidature) => (
            <div key={candidature.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-green-500">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      {candidature.apiData?.candidate_profile?.image ? (
                        <img 
                          src={`http://localhost:8000${candidature.apiData.candidate_profile.image}`}
                          alt={`Photo de ${candidature.nom}`}
                          className="w-12 h-12 rounded-full object-cover shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold ${candidature.apiData?.candidate_profile?.image ? 'hidden' : ''}`}>
                        {candidature.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidature.nom}</h3>
                        <p className="text-sm text-gray-600">{candidature.apiData?.funding_offer?.title || 'Titre non spécifié'}</p>
                        <p className="text-sm text-gray-600">{candidature.email}</p>
                        <p className="text-sm text-gray-500">{candidature.telephone}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm text-gray-500">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {candidature.apiData?.candidate_profile?.region?.name && candidature.apiData?.candidate_profile?.country?.name 
                              ? `${candidature.apiData.candidate_profile.region.name}, ${candidature.apiData.candidate_profile.country.name}`
                              : candidature.localisation
                            }
                          </span>
                          <span className="text-sm text-gray-500">
                            <i className="fas fa-briefcase mr-1"></i>
                            {candidature.apiData?.candidate_profile?.years_experience 
                              ? `${candidature.apiData.candidate_profile.years_experience} an(s) d'expérience`
                              : candidature.experience
                            }
                          </span>
                          <span className="text-sm text-gray-500">
                            <i className="fas fa-graduation-cap mr-1"></i>
                            {candidature.apiData?.candidate_profile?.years_experience 
                              ? (candidature.apiData.candidate_profile.years_experience >= 5 ? 'Senior' : 
                                 candidature.apiData.candidate_profile.years_experience >= 2 ? 'Confirmé' : 'Junior')
                              : candidature.niveauExperience
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidature.statut).replace('border-', 'bg-').replace('50', '100')}`}>
                        {getStatusText(candidature.statut)}
                      </span>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {candidature.apiData?.ai_analysis?.compatibility_score || candidature.note}%
                        </div>
                        <div className="text-xs text-gray-500">Compatibilité IA</div>
                      </div>
                      {candidature.priorite === 'HIGH' && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          <i className="fas fa-exclamation-triangle mr-1"></i>
                          Priorité haute
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Compétences</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidature.apiData?.candidate_profile?.skills ? (
                        candidature.apiData.candidate_profile.skills.split(',').map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {skill.trim()}
                          </span>
                        ))
                      ) : candidature.competences && candidature.competences.length > 0 ? (
                        candidature.competences.map((competence, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {competence}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">Aucune compétence spécifiée</span>
                      )}
                    </div>
                  </div>
                  
                  {candidature.apiData?.candidate_profile?.technologies && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidature.apiData.candidate_profile.technologies.split(',').map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {candidature.apiData?.candidate_profile?.about && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">À propos</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{candidature.apiData.candidate_profile.about}</p>
                    </div>
                  )}
                  
                  
                  {candidature.apiData?.ai_analysis && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Analyse IA</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div className="bg-blue-50 p-2 rounded border border-blue-200">
                            <div className="font-semibold text-blue-800">Compétences</div>
                            <div className="text-blue-600">{candidature.apiData.ai_analysis.skill_match_percentage}%</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded border border-green-200">
                            <div className="font-semibold text-green-800">Expérience</div>
                            <div className="text-green-600">{candidature.apiData.ai_analysis.experience_match_percentage}%</div>
                          </div>
                          <div className="bg-orange-50 p-2 rounded border border-orange-200">
                            <div className="font-semibold text-orange-800">Localisation</div>
                            <div className="text-orange-600">{candidature.apiData.ai_analysis.location_compatibility_score}%</div>
                          </div>
                          <div className="bg-purple-50 p-2 rounded border border-purple-200">
                            <div className="font-semibold text-purple-800">Éducation</div>
                            <div className="text-purple-600">{candidature.apiData.ai_analysis.education_match_score}%</div>
                          </div>
                        </div>
                        {candidature.apiData.ai_analysis.recommendation && (
                          <div className="bg-gray-50 p-2 rounded border border-gray-200">
                            <span className="text-xs font-medium text-gray-700">Recommandation: </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              candidature.apiData.ai_analysis.recommendation === 'POOR_MATCH' ? 'bg-red-100 text-red-800' :
                              candidature.apiData.ai_analysis.recommendation === 'GOOD_MATCH' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {candidature.apiData.ai_analysis.recommendation === 'POOR_MATCH' ? 'Non recommandé' :
                               candidature.apiData.ai_analysis.recommendation === 'GOOD_MATCH' ? 'Bien recommandé' :
                               'Recommandé avec réserves'
                              }
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {candidature.apiData?.candidate_profile?.years_experience || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">Années d'expérience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-blue-600">{candidature.cv ? 'Oui' : 'Non'}</div>
                      <div className="text-xs text-gray-500">CV</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-green-600">{candidature.lettre ? 'Oui' : 'Non'}</div>
                      <div className="text-xs text-gray-500">Lettre</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-purple-600">
                        {candidature.apiData?.candidate_profile?.skills ? candidature.apiData.candidate_profile.skills.split(',').length : 0}
                      </div>
                      <div className="text-xs text-gray-500">Compétences</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-orange-600">{candidature.priorite}</div>
                      <div className="text-xs text-gray-500">Priorité</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-indigo-600">
                        {candidature.apiData?.candidate_profile?.technologies ? candidature.apiData.candidate_profile.technologies.split(',').length : 0}
                      </div>
                      <div className="text-xs text-gray-500">Technologies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-teal-600">
                        {candidature.apiData?.ai_analysis?.ai_confidence_score || 'N/A'}%
                      </div>
                      <div className="text-xs text-gray-500">Confiance IA</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Candidature soumise le {candidature.dateCandidature}
                    {candidature.apiData?.application?.days_since_application && (
                      <span className="ml-2 text-blue-600">
                        ({candidature.apiData.application.days_since_application} jour(s) depuis)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <button 
                    onClick={() => viewCandidateDetails(candidature)}
                    className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm"
                  >
                    <i className="fas fa-eye mr-1"></i>Détails
                  </button>
                  <button 
                    onClick={() => viewDocuments(candidature)}
                    className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm"
                  >
                    <i className="fas fa-folder-open mr-1"></i>Document
                  </button>
                  <button 
                    onClick={() => viewMotivationLetter(candidature)}
                    className="px-3 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition duration-200 text-sm"
                  >
                    <i className="fas fa-envelope-open-text mr-1"></i>Lettre
                  </button>
                  <button 
                    onClick={() => contactCandidate(candidature.id)}
                    className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm"
                  >
                    <i className="fas fa-envelope mr-1"></i>Contacter
                  </button>
                  <button 
                    onClick={() => {
                      setValidationCandidate(candidature);
                      setValidationAction('approve');
                      setShowValidationModal(true);
                    }}
                    className="px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition duration-200 text-sm"
                  >
                    <i className="fas fa-check mr-1"></i>Accepter
                  </button>
                  <button 
                    onClick={() => {
                      setValidationCandidate(candidature);
                      setValidationAction('reject');
                      setShowValidationModal(true);
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 text-sm"
                  >
                    <i className="fas fa-times mr-1"></i>Refuser
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6">
          <CandidaturePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

      {/* Modal des Documents */}
      {showDocumentsModal && selectedCandidateDocuments && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto m-4 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-folder-open mr-2 text-green-600"></i>
                Documents du Candidat
              </h2>
              <button 
                onClick={() => setShowDocumentsModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                {selectedCandidateDocuments.imageProfil ? (
                  <img 
                    src={selectedCandidateDocuments.imageProfil} 
                    alt={`Photo de ${selectedCandidateDocuments.nom}`}
                    className="w-16 h-16 rounded-full object-cover shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold ${selectedCandidateDocuments.imageProfil ? 'hidden' : ''}`}>
                  {selectedCandidateDocuments.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedCandidateDocuments.nom}
                  </h3>
                  <p className="text-gray-600">{selectedCandidateDocuments.titre}</p>
                  <p className="text-sm text-gray-500">{selectedCandidateDocuments.localisation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* CV */}
              {selectedCandidateDocuments.apiData?.cv ? (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">CV</h4>
                        <p className="text-sm text-gray-600">Curriculum Vitae du candidat</p>
                        <p className="text-xs text-gray-500">Format: PDF</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const cvUrl = selectedCandidateDocuments.apiData.cv;
                        if (cvUrl) {
                          window.open(cvUrl, '_blank');
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 text-sm"
                    >
                      <i className="fas fa-download mr-1"></i>Télécharger
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="fas fa-file-pdf text-gray-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-500">CV</h4>
                      <p className="text-sm text-gray-400">Aucun CV disponible</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Certificats */}
              {selectedCandidateDocuments.apiData?.certificates ? (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-certificate text-blue-600 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Certificats</h4>
                        <p className="text-sm text-gray-600">Certificats et formations du candidat</p>
                        <p className="text-xs text-gray-500">Format: DOCX</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const certificatesUrl = selectedCandidateDocuments.apiData.certificates;
                        if (certificatesUrl) {
                          window.open(certificatesUrl, '_blank');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                    >
                      <i className="fas fa-download mr-1"></i>Télécharger
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="fas fa-certificate text-gray-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-500">Certificats</h4>
                      <p className="text-sm text-gray-400">Aucun certificat disponible</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Diplômes */}
              {selectedCandidateDocuments.apiData?.diplomas ? (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-graduation-cap text-green-600 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Diplômes</h4>
                        <p className="text-sm text-gray-600">Diplômes académiques du candidat</p>
                        <p className="text-xs text-gray-500">Format: DOCX</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const diplomasUrl = selectedCandidateDocuments.apiData.diplomas;
                        if (diplomasUrl) {
                          window.open(diplomasUrl, '_blank');
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 text-sm"
                    >
                      <i className="fas fa-download mr-1"></i>Télécharger
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="fas fa-graduation-cap text-gray-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-500">Diplômes</h4>
                      <p className="text-sm text-gray-400">Aucun diplôme disponible</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents additionnels */}
              {selectedCandidateDocuments.apiData?.additional_documents ? (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file-alt text-purple-600 text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Documents Additionnels</h4>
                        <p className="text-sm text-gray-600">Autres documents soumis par le candidat</p>
                        <p className="text-xs text-gray-500">Format: DOCX</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const additionalDocsUrl = selectedCandidateDocuments.apiData.additional_documents;
                        if (additionalDocsUrl) {
                          window.open(additionalDocsUrl, '_blank');
                        }
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-200 text-sm"
                    >
                      <i className="fas fa-download mr-1"></i>Télécharger
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="fas fa-file-alt text-gray-400 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-500">Documents Additionnels</h4>
                      <p className="text-sm text-gray-400">Aucun document additionnel disponible</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informations sur les Documents */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  Informations
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• Cliquez sur "Télécharger" pour ouvrir un document dans un nouvel onglet</p>
                  <p>• Les documents sont fournis par le candidat lors de sa candidature</p>
                  <p>• Formats supportés : PDF (CV), DOCX (Certificats, Diplômes, Documents additionnels)</p>
                  <p>• Contactez le candidat si des documents sont manquants</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button 
                onClick={() => setShowDocumentsModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de la Lettre de Motivation */}
      {showMotivationLetterModal && selectedMotivationLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto m-4 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-envelope-open-text mr-2 text-teal-600"></i>
                Lettre de Motivation
              </h2>
              <button 
                onClick={() => setShowMotivationLetterModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                {selectedMotivationLetter.imageProfil ? (
                  <img 
                    src={selectedMotivationLetter.imageProfil} 
                    alt={`Photo de ${selectedMotivationLetter.nom}`}
                    className="w-16 h-16 rounded-full object-cover shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold ${selectedMotivationLetter.imageProfil ? 'hidden' : ''}`}>
                  {selectedMotivationLetter.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedMotivationLetter.nom}
                  </h3>
                  <p className="text-gray-600">{selectedMotivationLetter.titre}</p>
                  <p className="text-sm text-gray-500">{selectedMotivationLetter.localisation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Contenu de la lettre de motivation */}
              {selectedMotivationLetter.apiData?.motivation_letter ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <i className="fas fa-envelope-open-text mr-2 text-teal-600"></i>
                      Contenu de la Lettre de Motivation
                    </h4>
                    <p className="text-sm text-gray-600">Lettre soumise le {selectedMotivationLetter.dateCandidature}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-800 whitespace-pre-wrap break-words overflow-hidden">
                      {selectedMotivationLetter.apiData.motivation_letter}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    <p><strong>Note:</strong> Cette lettre a été soumise par le candidat lors de sa candidature.</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-envelope text-gray-400 text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-500 mb-2">Aucune lettre de motivation</h4>
                  <p className="text-gray-400">Ce candidat n'a pas soumis de lettre de motivation</p>
                </div>
              )}

              {/* Informations sur la candidature */}
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <h4 className="font-semibold text-teal-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  Informations sur la candidature
                </h4>
                <div className="text-sm text-teal-700 space-y-1">
                  <p>• Date de candidature: {selectedMotivationLetter.dateCandidature}</p>
                  <p>• Statut: {selectedMotivationLetter.statut}</p>
                  <p>• Priorité: {selectedMotivationLetter.priorite}</p>
                  <p>• Il y a {selectedMotivationLetter.apiData?.days_since_application || 0} jour(s)</p>
                  {selectedMotivationLetter.apiData?.viewed_at && (
                    <p>• Vue le {new Date(selectedMotivationLetter.apiData.viewed_at).toLocaleDateString('fr-FR')}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button 
                onClick={() => setShowMotivationLetterModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Contact */}
      {showContactModal && selectedContactCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-envelope mr-2 text-orange-600"></i>
                Contacter le Candidat
              </h2>
              <button 
                onClick={() => setShowContactModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                {selectedContactCandidate.imageProfil ? (
                  <img 
                    src={selectedContactCandidate.imageProfil} 
                    alt={`Photo de ${selectedContactCandidate.nom}`}
                    className="w-16 h-16 rounded-full object-cover shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold ${selectedContactCandidate.imageProfil ? 'hidden' : ''}`}>
                  {selectedContactCandidate.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedContactCandidate.nom}
                  </h3>
                  <p className="text-gray-600">{selectedContactCandidate.titre}</p>
                  <p className="text-sm text-gray-500">{selectedContactCandidate.localisation}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Informations de contact */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3">
                  <i className="fas fa-address-card mr-2"></i>
                  Informations de Contact
                </h4>
                <div className="space-y-3 text-sm text-orange-700">
                  <div className="flex items-center">
                    <i className="fas fa-envelope mr-3 text-orange-600 w-5"></i>
                    <span className="font-medium">Email:</span>
                    <span className="ml-2">{selectedContactCandidate.email}</span>
                  </div>
                  {selectedContactCandidate.telephone && (
                    <div className="flex items-center">
                      <i className="fas fa-phone mr-3 text-orange-600 w-5"></i>
                      <span className="font-medium">Téléphone:</span>
                      <span className="ml-2">{selectedContactCandidate.telephone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <i className="fas fa-map-marker-alt mr-3 text-orange-600 w-5"></i>
                    <span className="font-medium">Localisation:</span>
                    <span className="ml-2">{selectedContactCandidate.localisation}</span>
                  </div>
                </div>
              </div>

              {/* Actions de contact */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-3">
                  <i className="fas fa-paper-plane mr-2"></i>
                  Actions de Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      const email = selectedContactCandidate.email;
                      const nom = selectedContactCandidate.nom;
                      const sujet = `Réponse à votre candidature de financement`;
                      const corps = `Bonjour ${nom},\n\nNous avons bien reçu votre candidature de financement et nous souhaitons vous contacter.\n\nCordialement,\nL'équipe de recrutement`;
                      
                      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
                      window.open(mailtoLink);
                    }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Envoyer un Email
                  </button>
                  
                  {selectedContactCandidate.telephone && (
                    <button 
                      onClick={() => {
                        const tel = selectedContactCandidate.telephone;
                        window.open(`tel:${tel}`);
                      }}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"
                    >
                      <i className="fas fa-phone mr-2"></i>
                      Appeler
                    </button>
                  )}
                </div>
              </div>

              {/* Informations sur la candidature */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  Informations sur la candidature
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Date de candidature: {selectedContactCandidate.dateCandidature}</p>
                  <p>• Statut: {selectedContactCandidate.statut}</p>
                  <p>• Priorité: {selectedContactCandidate.priorite}</p>
                  <p>• Offre: {selectedContactCandidate.offre}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button 
                onClick={() => setShowContactModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour les actions de validation */}
      {showValidationModal && validationCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                <i className={`fas ${validationAction === 'approve' ? 'fa-check text-emerald-600' : 'fa-times text-red-600'} mr-2`}></i>
                {validationAction === 'approve' ? 'Présélectionner' : 'Rejeter'} la candidature
              </h2>
              <button 
                onClick={() => setShowValidationModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {validationCandidate.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{validationCandidate.nom}</h3>
                  <p className="text-sm text-gray-600">{validationCandidate.titre}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">
                Êtes-vous sûr de vouloir <strong>{validationAction === 'approve' ? 'présélectionner' : 'rejeter'}</strong> 
                la candidature de <strong>{validationCandidate.nom}</strong> ?
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optionnel) :
                </label>
                <textarea
                  value={validationNotes}
                  onChange={(e) => setValidationNotes(e.target.value)}
                  placeholder={validationAction === 'approve' 
                    ? 'Ex: Candidat parfaitement qualifié, convocation pour entretien' 
                    : 'Ex: Profil non adapté aux exigences du poste'
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowValidationModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                disabled={validationLoading}
              >
                Annuler
              </button>
              <button 
                onClick={confirmValidation}
                className={`px-4 py-2 text-white rounded-lg transition duration-200 ${
                  validationAction === 'approve' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } ${validationLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={validationLoading}
              >
                {validationLoading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className={`fas ${validationAction === 'approve' ? 'fa-check' : 'fa-times'} mr-2`}></i>
                )}
                {validationLoading ? 'Traitement...' : (validationAction === 'approve' ? 'Présélectionner' : 'Rejeter')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostulationFinancement;