import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import candidatureService from '../../services/candidatureService';
import jobService from '../../services/jobService';
import validationService from '../../services/validationService';
import Loader from '../../components/Loader';
import CandidaturePagination from '../../components/CandidaturePagination';

const PostulationOffre = () => { 
  const [searchParams] = useSearchParams();
  const offreId = searchParams.get('offre');
  
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

  // États d'affichage (conservés pour la compatibilité)
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
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

  // États pour le modal de compatibilité
  const [showCompatibilityModal, setShowCompatibilityModal] = useState(false);
  const [compatibilityData, setCompatibilityData] = useState(null);
  const [compatibilityLoading, setLoadingCompatibility] = useState(false);
  
  // États pour le modal des documents
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [selectedCandidateDocuments, setSelectedCandidateDocuments] = useState(null);
  
  // États pour le modal de la lettre de motivation
  const [showMotivationLetterModal, setShowMotivationLetterModal] = useState(false);
  const [selectedMotivationLetter, setSelectedMotivationLetter] = useState(null);

  // État pour les détails de l'offre
  const [offreDetails, setOffreDetails] = useState(null);
  const [offreLoading, setOffreLoading] = useState(false);
  
  // États pour les actions de validation
  const [validationLoading, setValidationLoading] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationAction, setValidationAction] = useState(null);
  const [validationCandidate, setValidationCandidate] = useState(null);
  const [validationNotes, setValidationNotes] = useState('');

  // Fonction pour charger les détails de l'offre
  const loadOffreDetails = async () => {
    if (!offreId || offreId === 'undefined') return;
    
    try {
      setOffreLoading(true);
      const offreData = await jobService.getJobOfferDetail(offreId);
      setOffreDetails(offreData);
      console.log('✅ Détails de l\'offre chargés:', offreData);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des détails de l\'offre:', error);
      setOffreDetails(null);
    } finally {
      setOffreLoading(false);
    }
  };

  // Fonction pour charger les candidatures depuis l'API
  const loadCandidatures = async () => {
    try {
      console.log('🚀 Début de loadCandidatures');
      console.log('🔍 Paramètres:', { offreId, apiFilters, currentPage: pagination.currentPage, pageSize: pagination.pageSize });
      
      setLoading(true);
      setError(null);
      
      let response;
      
      if (offreId && offreId !== 'undefined') {
        // Charger les candidatures pour l'offre: ${offreId}
        console.log(`🔍 Chargement des candidatures pour l'offre: ${offreId}`);
        response = await candidatureService.getJobApplicationsByOffer(offreId, apiFilters, pagination.currentPage, pagination.pageSize);
      } else {
        // Charger de toutes les candidatures d'emploi
        console.log('🔍 Chargement de toutes les candidatures d\'emploi');
        response = await candidatureService.getJobApplications(apiFilters, pagination.currentPage, pagination.pageSize);
      }
      
      console.log('📡 Réponse API reçue:', response);
      console.log('📡 Type de réponse:', typeof response);
      console.log('📡 Est un tableau:', Array.isArray(response));
      
      // Vérifier la structure de la réponse
      if (!response) {
        throw new Error('Aucune réponse reçue de l\'API');
      }
      
      // Gérer différents formats de réponse
      let results = [];
      let count = 0;
      
      if (response.results && Array.isArray(response.results)) {
        // Format paginé standard
        console.log('✅ Format paginé détecté');
        results = response.results;
        count = response.count || response.results.length;
      } else if (Array.isArray(response)) {
        // Format simple (tableau direct)
        console.log('✅ Format tableau direct détecté');
        results = response;
        count = response.length;
      } else if (response.data && Array.isArray(response.data)) {
        // Format avec wrapper data
        console.log('✅ Format wrapper data détecté');
        results = response.data;
        count = response.data.length;
      } else {
        console.warn('⚠️ Structure de réponse inattendue:', response);
        results = [];
        count = 0;
      }
      
      console.log(`📊 Résultats extraits: ${results.length} candidatures sur ${count} total`);
      console.log('📊 Premier résultat:', results[0]);
      
      // Formater les données pour l'affichage
      const formattedCandidatures = results.map(apiCandidature => {
        console.log('🔧 Formatage de la candidature:', apiCandidature);
        return formatCandidatureData(apiCandidature);
      });
      
      console.log('🔧 Candidatures formatées:', formattedCandidatures);
      
      setCandidatures(formattedCandidatures);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(count / pagination.pageSize),
        totalCount: count
      }));
      
      console.log('✅ loadCandidatures terminé avec succès');
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
      console.log('🏁 loadCandidatures terminé (finally)');
    }
  };

  // Fonction pour formater les données de l'API
  const formatCandidatureData = (apiCandidature) => {
    // Vérifier que l'objet de base existe
    if (!apiCandidature || typeof apiCandidature !== 'object') {
      return {
        id: Math.random().toString(36).substr(2, 9), // Fallback ID
        nom: 'Inconnu', titre: 'N/A', experience: 'N/A', statut: 'unknown',
        competences: [], email: 'N/A', telephone: 'N/A', dateCandidature: 'N/A',
        avatar: '?', imageProfil: null, cv: false, lettre: false, offre: 'N/A',
        localisation: 'N/A', niveauExperience: 'N/A', apiData: apiCandidature,
        note: 0, priority: 'NORMAL', about: '', achievements: '', education: '',
        technologies: [], aiAnalysis: null
      };
    }

    // Extraire les données avec vérifications de sécurité
    const application = apiCandidature.application || {};
    const applicant = application.applicant || {};
    const applicantProfile = application.applicant_profile || {};
    const jobOffer = apiCandidature.job_offer || {};
    
    // Construire le nom complet avec fallbacks
    const firstName = applicant.first_name || '';
    const lastName = applicant.last_name || '';
    const username = applicant.username || 'Utilisateur';
    const nom = `${firstName} ${lastName}`.trim() || username;
    
    // Construire l'avatar avec fallbacks (pour fallback si pas d'image)
    const avatar = (firstName.charAt(0) || '') + (lastName.charAt(0) || '') || username.charAt(0) || '?';
    
    // Extraire l'image de profil
    let imageProfil = applicantProfile.image || apiCandidature.candidate_image || null;
    
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
    
    // Extraire le titre de l'offre
    const titre = jobOffer?.title || 'Titre non spécifié';
    
    // Extraire le statut avec fallback
    const statut = (application?.status || 'unknown').toLowerCase();
    
    // Extraire la priorité
    const priority = application?.priority || 'NORMAL';
    
    // Extraire la note IA avec fallback (à adapter selon les données disponibles)
    const note = apiCandidature.ai_analysis?.compatibility_score ? parseFloat(apiCandidature.ai_analysis.compatibility_score) : 0;
    
    // Vérifier la présence des documents
    const cv = !!(apiCandidature.cv || applicantProfile.cv || apiCandidature.candidate_cv);
    const lettre = !!(apiCandidature.motivation_letter);
    
    // Extraire la date de candidature
    const dateCandidature = application?.created_at 
      ? new Date(application.created_at).toLocaleDateString('fr-FR')
      : new Date().toLocaleDateString('fr-FR');
    
    // Extraire l'expérience avec fallback
    const experience = applicantProfile.years_experience || apiCandidature.candidate_experience
      ? `${applicantProfile.years_experience || apiCandidature.candidate_experience} an(s) d'expérience`
      : 'Expérience non spécifiée';
    
    // Extraire les compétences avec fallback
    const competences = (applicantProfile.skills || apiCandidature.candidate_skills)
      ? (applicantProfile.skills || apiCandidature.candidate_skills).split(',').map(skill => skill.trim()).filter(skill => skill)
      : [];
    
    // Extraire les technologies
    const technologies = (applicantProfile.technologies || apiCandidature.candidate_technologies)
      ? (applicantProfile.technologies || apiCandidature.candidate_technologies).split(',').map(tech => tech.trim()).filter(tech => tech)
      : [];
    
    // Extraire la localisation avec fallback
    const localisation = apiCandidature.candidate_city && apiCandidature.candidate_region
      ? `${apiCandidature.candidate_city}, ${apiCandidature.candidate_region}`
      : applicantProfile.region?.name || applicantProfile.country?.name || 'Localisation non spécifiée';
    
    // Extraire le niveau d'expérience avec fallback
    const niveauExperience = (applicantProfile.years_experience || apiCandidature.candidate_experience)
      ? (applicantProfile.years_experience || apiCandidature.candidate_experience) >= 5 ? 'Senior' : (applicantProfile.years_experience || apiCandidature.candidate_experience) >= 2 ? 'Confirmé' : 'Junior'
      : 'Niveau non spécifié';
    
    // Extraire le téléphone avec fallback
    const telephone = applicant.phone || apiCandidature.candidate_phone || 'Téléphone non spécifié';
    
    // Extraire l'offre avec fallback
    const offre = jobOffer?.title || 'Offre non spécifiée';
    
    // Extraire les informations supplémentaires
    const about = applicantProfile.about || apiCandidature.candidate_about || '';
    const achievements = applicantProfile.achievements || apiCandidature.candidate_achievements || '';
    const education = applicantProfile.education || apiCandidature.candidate_education || '';

    return {
      id: apiCandidature.id || 'unknown',
      nom: nom,
      titre: titre,
      experience: experience,
      statut: statut,
      competences: competences,
      email: applicant.email || apiCandidature.candidate_email || 'Email non spécifié',
      telephone: telephone,
      dateCandidature: dateCandidature,
      avatar: avatar.toUpperCase(),
      imageProfil: imageProfil,
      cv: cv,
      lettre: lettre,
      offre: offre,
      localisation: localisation,
      niveauExperience: niveauExperience,
      note: note,
      priority: priority,
      about: about,
      achievements: achievements,
      education: education,
      technologies: technologies,
      aiAnalysis: apiCandidature.ai_analysis || null,
      // Données API originales pour accès complet
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

  // Effet pour charger les candidatures
  useEffect(() => {
    loadCandidatures();
    if (offreId && offreId !== 'undefined') {
      loadOffreDetails();
    }
  }, [pagination.currentPage, pagination.pageSize, apiFilters.status, apiFilters.priority, apiFilters.ordering]);

  // Les variables stats et filteredStats ont été supprimées car elles ne sont plus nécessaires
  // Le composant CandidatureStats gère maintenant les statistiques

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
    setFilters({ search: '', status: '', experience: '', offre: '', localisation: '', dateCandidature: '', note: '', competences: '' });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Fonction de mise à jour du statut
  const updateCandidatureStatus = async (id, newStatus) => {
    try {
      await candidatureService.updateApplicationStatus(id, newStatus);
      // Recharger les candidatures après la mise à jour
      loadCandidatures();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
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

  // Le useEffect problématique a été supprimé car le filtrage est maintenant géré par l'API

  // Fonctions d'action pour les candidatures
  const viewApplication = (candidature) => {
    // Voir candidature
  };

  const viewBusinessPlan = (candidature) => {
    // Voir plan d'affaires
  };

  const viewCompatibilityScore = (candidature) => {
    // Voir score de compatibilité
  };

  const approveApplication = async (candidature) => {
    try {
      const applicationId = candidature.apiData?.application?.id;
      if (!applicationId) {
        alert('Impossible de récupérer l\'ID de la candidature');
        return;
      }
      
      setValidationAction('approve');
      setValidationCandidate(candidature);
      setValidationNotes('');
      setShowValidationModal(true);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du modal d\'approbation:', error);
    }
  };

  const rejectApplication = async (candidature) => {
    try {
      const applicationId = candidature.apiData?.application?.id;
      if (!applicationId) {
        alert('Impossible de récupérer l\'ID de la candidature');
        return;
      }
      
      setValidationAction('reject');
      setValidationCandidate(candidature);
      setValidationNotes('');
      setShowValidationModal(true);
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du modal de rejet:', error);
    }
  };

  const confirmValidation = async () => {
    if (!validationCandidate || !validationAction) return;

    try {
      const applicationId = validationCandidate.apiData?.application?.id;
      if (!applicationId) {
        alert('❌ Impossible de récupérer l\'ID de la candidature');
        return;
      }

      setValidationLoading(true);
      
      let result;
      if (validationAction === 'approve') {
        result = await validationService.acceptApplication(
          applicationId, 
          validationNotes || 'Candidature présélectionnée'
        );
        // Afficher une alerte de succès pour l'acceptation
        alert(`✅ Candidat ${validationCandidate.nom} accepté avec succès !`);
      } else if (validationAction === 'reject') {
        result = await validationService.rejectApplication(
          applicationId, 
          validationNotes || 'Candidature rejetée'
        );
        // Afficher une alerte de succès pour le refus
        alert(`❌ Candidat ${validationCandidate.nom} refusé avec succès !`);
      }

      console.log('✅ Action de validation réussie:', result);
      
      // Fermer le modal
      setShowValidationModal(false);
      setValidationAction(null);
      setValidationCandidate(null);
      setValidationNotes('');
      
      // Recharger les candidatures pour mettre à jour l'affichage
      await loadCandidatures();
      
    } catch (error) {
      console.error('❌ Erreur lors de la validation:', error);
      // Erreur : afficher une alerte d'erreur détaillée
      alert(`❌ Erreur lors de la validation : ${error.message}`);
    } finally {
      setValidationLoading(false);
    }
  };

  const contactApplicant = (id) => {
    // Contacter candidat
  };

  const assignEvaluator = (id) => {
    // Assigner évaluateur
  };

  const viewEvaluationHistory = (id) => {
    // Voir historique évaluation
  };

  const contactCandidate = (id) => {
    // Contacter candidat
  };

  // Nouvelles fonctions pour les boutons
  const viewCandidateDetails = (candidature) => {
    // Rediriger vers le profil public du candidat
    const candidateId = candidature.apiData?.application?.applicant?.id;
    if (candidateId) {
      window.open(`/profile/candidat/${candidateId}`, '_blank');
    }
  };

  const viewDocuments = (candidature) => {
    // Afficher le modal avec tous les documents du candidat
    setSelectedCandidateDocuments(candidature);
    setShowDocumentsModal(true);
  };

  const viewCompatibility = async (candidature) => {
    try {
      // Récupérer l'ID de l'offre et du candidat
      const jobOfferId = candidature.apiData?.job_offer?.id;
      const candidateId = candidature.apiData?.application?.applicant?.id;
      
      if (!jobOfferId || !candidateId) {
        alert('Impossible de récupérer les informations nécessaires pour l\'analyse de compatibilité');
        return;
      }

      // Appeler l'endpoint de compatibilité
      const response = await candidatureService.calculateCompatibility(jobOfferId, candidateId);
      
      // Afficher le modal avec les résultats
      setCompatibilityData(response);
      setShowCompatibilityModal(true);
    } catch (error) {
      console.error('Erreur lors du calcul de compatibilité:', error);
      alert('Erreur lors du calcul de compatibilité: ' + error.message);
    }
  };

  const contactCandidateByEmail = (candidature) => {
    // Ouvrir le client mail avec l'email du candidat
    const email = candidature.email;
    if (email && email !== 'Email non spécifié') {
      window.open(`mailto:${email}`, '_blank');
    } else {
      alert('Email du candidat non disponible');
    }
  };

  const viewMotivationLetter = (candidature) => {
    // Afficher le modal avec la lettre de motivation
    setSelectedMotivationLetter(candidature);
    setShowMotivationLetterModal(true);
  };

  const acceptCandidate = async (candidature) => {
    try {
      await updateCandidatureStatus(candidature.id, 'accepted');
      alert('Candidature acceptée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'acceptation de la candidature:', error);
      alert('Erreur lors de l\'acceptation de la candidature: ' + error.message);
    }
  };

  const rejectCandidate = async (candidature) => {
    try {
      await updateCandidatureStatus(candidature.id, 'rejected');
      alert('Candidature refusée avec succès !');
    } catch (error) {
      console.error('Erreur lors du rejet de la candidature:', error);
      alert('Erreur lors du rejet de la candidature: ' + error.message);
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
                <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-users mr-2 text-purple-600"></i>
              {offreId && offreId !== 'undefined' ? (
                `Candidatures - Offre #${offreId}`
              ) : (
                'Toutes les candidatures d\'emploi'
              )}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              {offreId && offreId !== 'undefined' ? (
                `Gérez et évaluez les candidatures reçues pour cette offre spécifique`
              ) : (
                'Gérez et évaluez toutes les candidatures d\'emploi reçues'
              )}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {offreId && offreId !== 'undefined' ? 'Offre spécifique' : 'Toutes les offres'}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{candidatures.length} candidatures</span>
              <span className="text-xs text-gray-500">Mis à jour récemment</span>
            </div>
                </div>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/gestion-offres"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
                        Retour aux offres
            </Link>
                </div>
            </div>
        </div>

      {/* Détails de l'offre (si une offre spécifique est sélectionnée) */}
      {offreId && offreId !== 'undefined' && (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              <i className="fas fa-briefcase mr-2 text-blue-600"></i>
              Détails de l'offre
            </h3>
          </div>
          
          {offreLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader />
            </div>
          ) : offreDetails ? (
            <div className="space-y-4">
              {/* En-tête de l'offre */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-briefcase text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{offreDetails.title || 'Titre non spécifié'}</h4>
                    </div>
                  </div>
                  
                  {/* Informations de base */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    {offreDetails.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-map-marker-alt mr-2"></i>
                        <span>{offreDetails.location}</span>
                      </div>
                    )}
                    {offreDetails.employment_type && (
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-clock mr-2"></i>
                        <span>{offreDetails.employment_type}</span>
                      </div>
                    )}
                    {offreDetails.created_at && (
                      <div className="flex items-center text-sm text-gray-600">
                        <i className="fas fa-calendar mr-2"></i>
                        <span>Publié le {new Date(offreDetails.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Statut de l'offre */}
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    offreDetails.status === 'active' ? 'bg-green-100 text-green-800' :
                    offreDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {offreDetails.status === 'active' ? 'Active' : 
                     offreDetails.status === 'pending' ? 'En attente' : 
                     offreDetails.status || 'Inconnu'}
                  </span>
                </div>
              </div>

              {/* Statistiques de l'offre */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {offreDetails.salary_min && offreDetails.salary_max && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 mb-1">
                      {offreDetails.salary_min} - {offreDetails.salary_max}
                    </div>
                    <div className="text-sm text-gray-600">FCFA par mois</div>
                  </div>
                )}
                {offreDetails.experience_years && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600 mb-1">
                      {offreDetails.experience_years} an(s)
                    </div>
                    <div className="text-sm text-gray-600">Expérience requise</div>
                  </div>
                )}
                {offreDetails.education_level && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {offreDetails.education_level}
                    </div>
                    <div className="text-sm text-gray-600">Niveau d'études</div>
                  </div>
                )}
              </div>

              {/* Description courte */}
              {offreDetails.description && (
                <div className="mt-4">
                  <h5 className="text-md font-semibold text-gray-900 mb-2">Description :</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {offreDetails.description.length > 200 
                      ? `${offreDetails.description.substring(0, 200)}...` 
                      : offreDetails.description
                    }
                  </p>
                </div>
              )}

              {/* Informations détaillées supplémentaires */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colonne gauche - Détails du poste */}
                <div className="space-y-4">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-clipboard-list mr-2 text-blue-600"></i>
                    Détails du poste
                  </h5>
                  
                  {/* Profil recherché */}
                  {offreDetails.profile_sought && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-start">
                        <i className="fas fa-user-tie mr-2 text-blue-600 mt-1"></i>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Profil recherché :</span>
                          <p className="text-sm text-gray-600 mt-1">{offreDetails.profile_sought}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informations supplémentaires */}
                  {offreDetails.additional_info && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start">
                        <i className="fas fa-info-circle mr-2 text-green-600 mt-1"></i>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Informations supplémentaires :</span>
                          <p className="text-sm text-gray-600 mt-1">{offreDetails.additional_info}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Département */}
                  {offreDetails.department && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Département</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {offreDetails.department.name || offreDetails.department}
                      </span>
                    </div>
                  )}

                  {/* Catégorie */}
                  {offreDetails.category && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Catégorie</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {offreDetails.category.name || offreDetails.category}
                      </span>
                    </div>
                  )}

                  {/* Nom du poste */}
                  {offreDetails.position_name && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Nom du poste</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                        {offreDetails.position_name}
                      </span>
                    </div>
                  )}

                  {/* Date limite de candidature */}
                  {offreDetails.application_deadline && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Date limite</span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        {new Date(offreDetails.application_deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Colonne droite - Conditions et exigences */}
                <div className="space-y-4">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-requirements mr-2 text-green-600"></i>
                    Conditions et exigences
                  </h5>
                  
                  {/* Type de contrat */}
                  {offreDetails.contract_type && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Type de contrat</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {offreDetails.contract_type}
                      </span>
                    </div>
                  )}

                  {/* Expérience requise */}
                  {offreDetails.experience_required && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Expérience requise</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        {offreDetails.experience_required}
                      </span>
                    </div>
                  )}

                  {/* Mode de travail */}
                  {offreDetails.work_mode && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Mode de travail</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                        {offreDetails.work_mode}
                      </span>
                    </div>
                  )}

                  {/* CV requis */}
                  {offreDetails.cv_required !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">CV requis</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        offreDetails.cv_required ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {offreDetails.cv_required ? 'Requis' : 'Non requis'}
                      </span>
                    </div>
                  )}

                  {/* Lettre de motivation requise */}
                  {offreDetails.motivation_letter_required !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Lettre de motivation</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        offreDetails.motivation_letter_required ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {offreDetails.motivation_letter_required ? 'Requis' : 'Non requis'}
                      </span>
                    </div>
                  )}

                  {/* Offre urgente */}
                  {offreDetails.is_urgent !== undefined && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">Urgence</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        offreDetails.is_urgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {offreDetails.is_urgent ? 'Urgent' : 'Normal'}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informations sur le recruteur */}
              {offreDetails.recruiter && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-building mr-2 text-blue-600"></i>
                    Informations sur l'entreprise
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offreDetails.recruiter.company_name && (
                      <div className="flex items-center">
                        <i className="fas fa-building mr-2 text-blue-600"></i>
                        <span className="text-sm text-gray-700">{offreDetails.recruiter.company_name}</span>
                      </div>
                    )}
                    {offreDetails.recruiter.sector && (
                      <div className="flex items-center">
                        <i className="fas fa-industry mr-2 text-blue-600"></i>
                        <span className="text-sm text-gray-700">{offreDetails.recruiter.sector}</span>
                      </div>
                    )}
                    {offreDetails.recruiter.company_size && (
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2 text-blue-600"></i>
                        <span className="text-sm text-gray-700">{offreDetails.recruiter.company_size}</span>
                      </div>
                    )}
                    {offreDetails.recruiter.website && (
                      <div className="flex items-center">
                        <i className="fas fa-globe mr-2 text-blue-600"></i>
                        <a 
                          href={offreDetails.recruiter.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {offreDetails.recruiter.website}
                        </a>
                      </div>
                    )}
                    {offreDetails.recruiter.description && (
                      <div className="flex items-start col-span-2">
                        <i className="fas fa-info-circle mr-2 text-blue-600 mt-1"></i>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Description de l'entreprise :</span>
                          <p className="text-sm text-gray-600 mt-1">{offreDetails.recruiter.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Localisation */}
              {(offreDetails.country || offreDetails.region) && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="text-md font-semibold text-gray-900 mb-3">
                    <i className="fas fa-map-marker-alt mr-2 text-green-600"></i>
                    Localisation
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offreDetails.country && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 mb-1">
                          {offreDetails.country.name || offreDetails.country}
                        </div>
                        <div className="text-xs text-gray-600">Pays</div>
                      </div>
                    )}
                    {offreDetails.region && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600 mb-1">
                          {offreDetails.region.name || offreDetails.region}
                        </div>
                        <div className="text-xs text-gray-600">Région</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Statistiques avancées */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h5 className="text-md font-semibold text-gray-900 mb-3">
                  <i className="fas fa-chart-bar mr-2 text-purple-600"></i>
                  Statistiques avancées
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {offreDetails.views_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Vues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {offreDetails.applications_count || 0}
                    </div>
                    <div className="text-xs text-gray-600">Candidatures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {offreDetails.days_until_closing || 'N/A'}
                    </div>
                    <div className="text-xs text-gray-600">Jours restants</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 mb-1">
                      {offreDetails.is_expired ? 'Oui' : 'Non'}
                    </div>
                    <div className="text-xs text-gray-600">Expirée</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-2xl text-gray-400"></i>
              </div>
              <p className="text-gray-600">Impossible de charger les détails de l'offre</p>
              <button 
                onClick={loadOffreDetails}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600">{candidatures.length}</div>
          <div className="text-xs text-gray-500">
            {offreId && offreId !== 'undefined' ? 'Candidatures pour cette offre' : 'Candidatures filtrées'}
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
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {offreId && offreId !== 'undefined' ? 'Filtres pour cette offre' : 'Filtres avancés'}
          </h3>
          {offreId && offreId !== 'undefined' && (
            <p className="text-sm text-gray-600 mb-3">
              Filtrage des candidatures pour l'offre <strong>#{offreId}</strong>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
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
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
              {offreId && offreId !== 'undefined' 
                ? `Aucune candidature n'a encore été reçue pour l'offre #${offreId} ou l'API n'est pas accessible.`
                : initialLoad 
                  ? 'Il semble qu\'il n\'y ait pas encore de candidatures pour cette offre ou que l\'API ne soit pas accessible.'
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
            <div key={candidature.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-fuchsia-500">
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
                      <div className={`w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold ${candidature.apiData?.candidate_profile?.image ? 'hidden' : ''}`}>
                        {candidature.avatar}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidature.nom}</h3>
                        <p className="text-sm text-gray-600">{candidature.apiData?.job_offer?.title || 'Titre non spécifié'}</p>
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
                              ? (candidature.apiData.candidate_profile.years_experience >= 5 ? 'Senior' : candidature.apiData.candidate_profile.years_experience >= 2 ? 'Confirmé' : 'Junior')
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
                        <div className="text-lg font-bold text-purple-600">{candidature.note.toFixed(1)}%</div>
                        <div className="text-xs text-gray-500">Compatibilité IA</div>
                      </div>
                      {candidature.priority === 'HIGH' && (
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
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                            {skill.trim()}
                          </span>
                        ))
                      ) : candidature.competences.length > 0 ? (
                        candidature.competences.map((competence, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
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
                      <div className="text-sm font-bold text-orange-600">{candidature.priority}</div>
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
                    onClick={() => contactCandidateByEmail(candidature)}
                    className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm"
                  >
                    <i className="fas fa-envelope mr-1"></i>Contacter
                  </button>
                  <button 
                    onClick={() => approveApplication(candidature)}
                    className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm font-medium"
                  >
                    <i className="fas fa-check mr-1"></i>Accepter
                  </button>
                  <button 
                    onClick={() => rejectApplication(candidature)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-200 text-sm font-medium"
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

      {/* Modal de Compatibilité */}
      {showCompatibilityModal && compatibilityData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto m-4 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                <i className="fas fa-chart-pie mr-2 text-purple-600"></i>
                Analyse de Compatibilité IA
              </h2>
              <button 
                onClick={() => setShowCompatibilityModal(false)} 
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Score Global */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {compatibilityData.compatibility_score}%
                  </div>
                  <div className="text-lg text-gray-700">Score de Compatibilité Global</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Analyse terminée en {compatibilityData.processing_time_ms}ms
                  </div>
                </div>
              </div>

              {/* Scores Détaillés */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {compatibilityData.analysis_details?.skill_match_percentage || 'N/A'}%
                    </div>
                    <div className="text-sm text-gray-600">Correspondance des Compétences</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {compatibilityData.analysis_details?.experience_match_percentage || 'N/A'}%
                    </div>
                    <div className="text-sm text-gray-600">Correspondance de l'Expérience</div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {compatibilityData.analysis_details?.culture_fit_score || 'N/A'}%
                    </div>
                    <div className="text-sm text-gray-600">Adéquation Culturelle</div>
                  </div>
                </div>
              </div>

              {/* Points Forts et Faiblesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    <i className="fas fa-check-circle mr-2"></i>
                    Points Forts
                  </h3>
                  <ul className="space-y-2">
                    {compatibilityData.analysis_details?.strengths?.map((strength, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <i className="fas fa-check text-green-500 mr-2 mt-1 text-xs"></i>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Points d'Amélioration
                  </h3>
                  <ul className="space-y-2">
                    {compatibilityData.analysis_details?.weaknesses?.map((weakness, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <i className="fas fa-arrow-up text-red-500 mr-2 mt-1 text-xs"></i>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommandations */}
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Recommandations
                </h3>
                <p className="text-gray-700 mb-3">
                  {compatibilityData.analysis_details?.recommendations}
                </p>
                <div className="text-sm text-gray-500">
                  <strong>Évaluation des risques:</strong> {compatibilityData.analysis_details?.risk_assessment}
                </div>
              </div>

              {/* Évaluation Technique */}
              {compatibilityData.analysis_details?.technical_assessment && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    <i className="fas fa-code mr-2"></i>
                    Évaluation Technique
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(compatibilityData.analysis_details.technical_assessment).map(([skill, score]) => (
                      <div key={skill} className="text-center">
                        <div className="text-lg font-bold text-purple-600">{score}</div>
                        <div className="text-xs text-gray-600 capitalize">{skill}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button 
                onClick={() => setShowCompatibilityModal(false)} 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
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
                {selectedCandidateDocuments.apiData?.candidate_profile?.image ? (
                  <img 
                    src={`http://localhost:8000${selectedCandidateDocuments.apiData.candidate_profile.image}`}
                    alt={`Photo de ${selectedCandidateDocuments.nom}`}
                    className="w-16 h-16 rounded-full object-cover shadow-sm"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold ${selectedCandidateDocuments.apiData?.candidate_profile?.image ? 'hidden' : ''}`}>
                  {selectedCandidateDocuments.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedCandidateDocuments.nom}
                  </h3>
                  <p className="text-gray-600">{selectedCandidateDocuments.apiData?.job_offer?.title || 'Titre non spécifié'}</p>
                  <p className="text-sm text-gray-500">
                    {selectedCandidateDocuments.apiData?.candidate_profile?.region?.name && selectedCandidateDocuments.apiData?.candidate_profile?.country?.name 
                      ? `${selectedCandidateDocuments.apiData.candidate_profile.region.name}, ${selectedCandidateDocuments.apiData.candidate_profile.country.name}`
                      : selectedCandidateDocuments.localisation
                    }
                  </p>
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

              {/* Informations sur les Documents */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  Informations
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• Cliquez sur "Télécharger" pour ouvrir un document dans un nouvel onglet</p>
                  <p>• Les documents sont fournis par le candidat lors de sa candidature</p>
                  <p>• Formats supportés : PDF (CV), DOCX (Certificats, Diplômes)</p>
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
              {/* Contenu de la Lettre */}
              {selectedMotivationLetter.apiData?.motivation_letter ? (
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    <i className="fas fa-file-alt mr-2 text-teal-600"></i>
                    Contenu de la Lettre de Motivation
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMotivationLetter.apiData.motivation_letter}
                    </p>
                  </div>
                  <div className="mt-4 text-sm text-gray-500">
                    <p><strong>Date de candidature :</strong> {selectedMotivationLetter.dateCandidature}</p>
                    <p><strong>Statut :</strong> {selectedMotivationLetter.statut}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-envelope-open-text text-gray-400 text-2xl"></i>
                    </div>
                    <h4 className="font-semibold text-gray-500 mb-2">Aucune Lettre de Motivation</h4>
                    <p className="text-sm text-gray-400">Ce candidat n'a pas fourni de lettre de motivation</p>
                  </div>
                </div>
              )}

              {/* Informations sur la Candidature */}
              <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                <h4 className="font-semibold text-teal-800 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  Informations sur la Candidature
                </h4>
                <div className="text-sm text-teal-700 space-y-1">
                  <p>• La lettre de motivation exprime l'intérêt du candidat pour le poste</p>
                  <p>• Elle peut contenir des informations sur la motivation et les objectifs</p>
                  <p>• Contactez le candidat si vous avez des questions sur sa motivation</p>
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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

export default PostulationOffre;