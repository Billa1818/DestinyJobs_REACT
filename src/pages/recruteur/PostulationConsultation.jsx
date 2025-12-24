import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import candidatureService from '../../services/candidatureService';
import consultationService from '../../services/consultationService';
import validationService from '../../services/validationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import CandidaturePagination from '../../components/CandidaturePagination';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

const PostulationConsultation = () => {
    const { consultationId } = useParams();
    const [searchParams] = useSearchParams();
    const consultationIdParam = searchParams.get('consultation') || consultationId;

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
        status: ''
    });

    // États pour le modal des documents
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [selectedCandidateDocuments, setSelectedCandidateDocuments] = useState(null);

    // États pour le modal de la lettre de motivation
    const [showMotivationLetterModal, setShowMotivationLetterModal] = useState(false);
    const [selectedMotivationLetter, setSelectedMotivationLetter] = useState(null);

    // État pour les détails de l'offre de consultation
    const [consultationDetails, setConsultationDetails] = useState(null);
    const [consultationLoading, setConsultationLoading] = useState(false);

    // États pour les actions de validation
    const [validationLoading, setValidationLoading] = useState(false);
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationAction, setValidationAction] = useState(null);
    const [validationCandidate, setValidationCandidate] = useState(null);
    const [validationNotes, setValidationNotes] = useState('');

    // Les données statiques ont été supprimées et remplacées par l'API

    // Fonction pour charger les détails de l'offre de consultation
    const loadConsultationDetails = async () => {
        if (!consultationIdParam || consultationIdParam === 'undefined') return;

        try {
            setConsultationLoading(true);
            const consultationData = await consultationService.getConsultationOfferDetail(consultationIdParam);
            setConsultationDetails(consultationData);
            console.log('✅ Détails de l\'offre de consultation chargés:', consultationData);
        } catch (error) {
            console.error('❌ Erreur lors du chargement des détails de l\'offre de consultation:', error);
            setConsultationDetails(null);
        } finally {
            setConsultationLoading(false);
        }
    };

    // Fonction pour charger les candidatures depuis l'API
    const loadCandidatures = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;

            if (consultationIdParam && consultationIdParam !== 'undefined') {
                // Charger les candidatures pour une consultation spécifique
                response = await candidatureService.getConsultationApplicationsByOffer(consultationIdParam, apiFilters, pagination.currentPage, pagination.pageSize);
            } else {
                // Charger toutes les candidatures de consultation
                response = await candidatureService.getConsultationApplications(apiFilters, pagination.currentPage, pagination.pageSize);
            }

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
                results = [];
                count = 0;
            }

            // Formater les données pour l'affichage et filtrer les non-PRESTATAIRE
            const formattedCandidatures = results
                .map((apiCandidature) => formatCandidatureData(apiCandidature))
                .filter((candidature) => candidature !== null);

            setCandidatures(formattedCandidatures);
            setPagination(prev => ({
                ...prev,
                totalPages: Math.ceil(count / pagination.pageSize),
                totalCount: count
            }));
        } catch (err) {
            console.error('❌ Erreur lors du chargement des candidatures:', err);
            console.error('❌ Stack trace:', err.stack);
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
        // Vérifier que l'objet de base existe
        if (!apiCandidature || typeof apiCandidature !== 'object') {
            return null;
        }

        // Extraire les données avec vérifications de sécurité
        const application = apiCandidature.application || {};
        const applicant = application.applicant || {};
        const candidateProfile = apiCandidature.candidate_profile || {};
        const consultationOffer = apiCandidature.consultation_offer || {};

        // FILTRE: Afficher uniquement les PRESTATAIRE
        if (applicant.user_type !== 'PRESTATAIRE') {
            return null;
        }

        // Construire le nom complet avec fallbacks
        const firstName = applicant.first_name || '';
        const lastName = applicant.last_name || '';
        const username = applicant.username || 'Utilisateur';
        const nom = `${firstName} ${lastName}`.trim() || username;

        // Construire l'avatar avec fallbacks
        const avatar = (firstName.charAt(0) || '') + (lastName.charAt(0) || '') || username.charAt(0) || '?';

        // Extraire l'image de profil depuis candidate_profile.image
        let imageProfil = candidateProfile.image || null;

        // Convertir l'URL relative en URL absolue si nécessaire
        if (imageProfil && !imageProfil.startsWith('http')) {
            if (imageProfil.startsWith('/media')) {
                imageProfil = buildImageUrl(imageProfil);
            } else if (!imageProfil.startsWith('http://localhost:8000')) {
                imageProfil = buildImageUrl("${imageProfil.startsWith('/') ? '' : '/'}${imageProfil}");
            }
        }

        // Extraire le titre de l'offre
        const titre = consultationOffer.title || 'Titre non spécifié';

        // Extraire le statut avec fallback
        const statut = (application.status || 'unknown').toLowerCase();

        // Extraire la note IA avec fallback
        const note = apiCandidature.ai_analysis?.compatibility_score
            ? parseFloat(apiCandidature.ai_analysis.compatibility_score)
            : 0;

        // Vérifier la présence des documents (depuis l'application et candidate_profile)
        const cv = !!(apiCandidature.portfolio || candidateProfile.cv);
        const lettre = !!(apiCandidature.motivation_letter || apiCandidature.motivation_letter_file);
        const documents = {
            portfolio: apiCandidature.portfolio,
            motivationLetter: apiCandidature.motivation_letter_file,
            diplomas: apiCandidature.diplomas,
            certificates: apiCandidature.certificates,
            profileCv: candidateProfile.cv,
            profilePortfolio: candidateProfile.portfolio
        };

        // Extraire l'expérience depuis candidate_profile.years_experience
        const yearsExperience = candidateProfile.years_experience || 0;
        const experience = yearsExperience
            ? `${yearsExperience} an(s) d'expérience`
            : 'Expérience non spécifiée';

        // Extraire les spécialisations depuis candidate_profile.specializations
        const competences = candidateProfile.specializations
            ? candidateProfile.specializations.split(',').map(skill => skill.trim()).filter(skill => skill)
            : [];

        // Extraire la localisation depuis candidate_profile.region et country
        const localisation = candidateProfile.region?.name && candidateProfile.country?.name
            ? `${candidateProfile.region.name}, ${candidateProfile.country.name}`
            : candidateProfile.region?.name || candidateProfile.country?.name || 'Localisation non spécifiée';

        // Déterminer le niveau d'expérience basé sur years_experience
        const getNiveauExperience = (years) => {
            if (!years) return 'Niveau non spécifié';
            if (years <= 2) return 'Junior';
            if (years <= 5) return 'Intermédiaire';
            if (years <= 8) return 'Senior';
            return 'Expert';
        };

        const niveauExperience = getNiveauExperience(yearsExperience);

        // Extraire le taux horaire et journalier
        const hourlyRate = candidateProfile.hourly_rate || 'Non spécifié';
        const dailyRate = candidateProfile.daily_rate || 'Non spécifié';

        // Extraire le nombre de projets complétés
        const completedProjects = candidateProfile.completed_projects || 0;

        // Extraire l'organisation/entreprise du prestataire
        const organizationName = candidateProfile.organization_name || 'Indépendant';
        const organizationLogo = candidateProfile.organization_logo || null;

        // Extraire le téléphone depuis applicant.phone
        const telephone = applicant.phone || 'Téléphone non spécifié';

        // Extraire l'email depuis applicant.email
        const email = applicant.email || 'Email non spécifié';

        // Extraire la date de visualisation
        const dateVisualisation = application.viewed_at
            ? new Date(application.viewed_at).toLocaleDateString('fr-FR')
            : 'Non visualisée';

        // Extraire le nombre de jours depuis la candidature
        const joursDepuisCandidature = application.days_since_application || 0;

        // Extraire la date de candidature
        const dateCandidature = application.created_at
            ? new Date(application.created_at).toLocaleDateString('fr-FR')
            : new Date().toLocaleDateString('fr-FR');

        // Extraire les forces et faiblesses de l'analyse IA
        const strengths = apiCandidature.ai_analysis?.strengths || [];
        const weaknesses = apiCandidature.ai_analysis?.weaknesses || [];
        const recommendations = apiCandidature.ai_analysis?.recommendations || '';

        return {
            id: apiCandidature.id || 'unknown',
            applicationId: application.id || 'unknown',
            nom,
            titre,
            experience: experience,
            statut,
            competences: competences,
            email: email,
            telephone: telephone,
            dateCandidature,
            avatar,
            imageProfil,
            note,
            cv,
            lettre,
            offre: titre,
            localisation: localisation,
            niveauExperience: niveauExperience,
            hourlyRate,
            dailyRate,
            completedProjects,
            organizationName,
            organizationLogo,
            dateVisualisation,
            joursDepuisCandidature,
            documents,
            strengths,
            weaknesses,
            recommendations,
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

    // Gestion des filtres avancés avec recherche automatique
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));

        // Recherche automatique après changement de filtre
        setTimeout(() => {
            const newApiFilters = {
                status: filters.status || '',
                priority: '',
                search: filters.search || '',
                ordering: '-created_at'
            };

            setApiFilters(newApiFilters);
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            loadCandidatures();
        }, 300); // Délai de 300ms pour éviter trop de requêtes
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

    // Fonction de réinitialisation des filtres avancés
    const resetFilters = () => {
        setFilters({
            search: '',
            status: '',
            experience: '',
            note: '',
            offre: '',
            localisation: '',
            competences: ''
        });
        setApiFilters({
            status: '',
            priority: '',
            search: '',
            ordering: '-created_at'
        });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        loadCandidatures(); // Recharger après reset
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

    // Fonction pour afficher les documents
    const viewDocuments = (candidature) => {
        // Afficher le modal avec tous les documents du candidat
        setSelectedCandidateDocuments(candidature);
        setShowDocumentsModal(true);
    };

    // Fonctions d'action pour les modals
    const viewCV = (candidature) => {
        setSelectedCandidate(candidature);
        setShowCVModal(true);
    };

    const closeCVModal = () => {
        setShowCVModal(false);
        setSelectedCandidate(null);
    };

    // Fonction pour afficher la lettre de motivation
    const viewMotivationLetter = (candidature) => {
        setSelectedMotivationLetter(candidature);
        setShowMotivationLetterModal(true);
    };

    // Fonction pour voir les détails du candidat
    const viewCandidateDetails = (candidature) => {
        // Rediriger vers le profil public du candidat
        const candidateId = candidature.apiData?.application?.applicant?.id;
        console.log('🔍 Debug viewCandidateDetails:', {
            candidature,
            candidateId,
            applicantPath: candidature.apiData?.application?.applicant,
            fullPath: candidature.apiData?.application?.applicant?.id
        });

        if (candidateId) {
            const profileUrl = `/profile/candidat/${candidateId}`;
            console.log('🚀 Redirection vers:', profileUrl);
            window.open(profileUrl, '_blank');
        } else {
            console.error('❌ ID du candidat non trouvé:', candidature);
            alert('Impossible de récupérer l\'ID du candidat');
        }
    };

    // Fonction pour voir la compatibilité
    const viewCompatibility = (candidature) => {
        console.log('Voir compatibilité pour:', candidature.id);
        // TODO: Implémenter l'analyse de compatibilité
        alert('Fonctionnalité de compatibilité à implémenter');
    };

    // Fonctions d'action pour les candidatures
    const viewApplication = (candidature) => {
        console.log('Voir candidature:', candidature);
    };

    const viewBusinessPlan = (candidature) => {
        console.log('Voir plan d\'affaires:', candidature);
    };

    const viewCompatibilityScore = (candidature) => {
        console.log('Voir score de compatibilité:', candidature);
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
                    validationNotes || 'Candidature approuvée'
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
        console.log('Contacter candidat:', id);
    };

    const assignEvaluator = (id) => {
        console.log('Assigner évaluateur:', id);
    };

    const addNote = (id) => {
        console.log('Ajouter note:', id);
        // TODO: Implémenter la logique d'ajout de note
    };

    const viewEvaluationHistory = (id) => {
        console.log('Voir historique évaluation:', id);
        // TODO: Implémenter la logique d'affichage de l'historique
    };

    const contactCandidate = (id) => {
        console.log('Contacter candidat:', id);
        // TODO: Implémenter la logique de contact
    };

    useEffect(() => {
        loadCandidatures();
        loadConsultationDetails(); // Charger les détails de l'offre de consultation
    }, [consultationIdParam, pagination.currentPage, pagination.pageSize, apiFilters.status, apiFilters.priority, apiFilters.ordering]);

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                            <i className="fas fa-comments mr-2 text-blue-600"></i>
                            {consultationIdParam && consultationIdParam !== 'undefined' ? (
                                `Candidatures - Consultation #${consultationIdParam}`
                            ) : (
                                'Candidatures - Consultations'
                            )}
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            {consultationIdParam && consultationIdParam !== 'undefined' ? (
                                `Gérez et évaluez les candidatures reçues pour cette consultation spécifique`
                            ) : (
                                'Gérez et évaluez les candidatures reçues pour vos offres de consultation'
                            )}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {consultationIdParam && consultationIdParam !== 'undefined' ? 'Consultation spécifique' : 'Consultation'}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{candidatures.length} candidatures</span>
                            <span className="text-xs text-gray-500">Mis à jour récemment</span>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <Link
                            to="/recruteur/gestion-consultations"
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Retour aux consultations
                        </Link>
                    </div>
                </div>
            </div>

            {/* Détails de l'offre (si une offre spécifique est sélectionnée) */}
            {consultationIdParam && consultationIdParam !== 'undefined' && (
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            <i className="fas fa-briefcase mr-2 text-blue-600"></i>
                            Détails de l'offre
                        </h3>
                    </div>

                    {consultationLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <LoadingSpinner />
                        </div>
                    ) : consultationDetails ? (
                        <div className="space-y-4">
                            {/* En-tête de l'offre */}
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                        {/* Logo de l'entreprise */}
                                        {consultationDetails.company_logo || consultationDetails.admin_company_logo ? (
                                            <img
                                                src={consultationDetails.company_logo || consultationDetails.admin_company_logo}
                                                alt="Logo de l'entreprise"
                                                className="w-16 h-16 bg-blue-100 rounded-lg mr-4 object-contain p-2"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4 ${consultationDetails.company_logo || consultationDetails.admin_company_logo ? 'hidden' : ''}`}>
                                            <i className="fas fa-briefcase text-blue-600 text-xl"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{consultationDetails.title || 'Titre non spécifié'}</h4>
                                            {consultationDetails.company_details?.company_name && (
                                                <p className="text-sm text-gray-600 mt-1">{consultationDetails.company_details.company_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Informations de base */}
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {consultationDetails.consultation_type && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <i className="fas fa-tag mr-2"></i>
                                                <span>{consultationDetails.consultation_type.name || consultationDetails.consultation_type}</span>
                                            </div>
                                        )}
                                        {consultationDetails.delivery_mode && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <i className="fas fa-location-arrow mr-2"></i>
                                                <span>{consultationDetails.delivery_mode}</span>
                                            </div>
                                        )}
                                        {consultationDetails.created_at && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <i className="fas fa-calendar mr-2"></i>
                                                <span>Publié le {new Date(consultationDetails.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Statut de l'offre */}
                                <div className="flex flex-col items-end space-y-2">
                                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${consultationDetails.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        consultationDetails.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            consultationDetails.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {consultationDetails.status === 'APPROVED' ? 'Active' :
                                            consultationDetails.status === 'PENDING' ? 'En attente' :
                                                consultationDetails.status === 'REJECTED' ? 'Rejetée' :
                                                    consultationDetails.status || 'Inconnu'}
                                    </span>
                                </div>
                            </div>


                            {/* Description courte */}
                            {consultationDetails.description && (
                                <div className="mt-4">
                                    <h5 className="text-md font-semibold text-gray-900 mb-2">Description :</h5>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {consultationDetails.description.length > 200
                                            ? `${consultationDetails.description.substring(0, 200)}...`
                                            : consultationDetails.description
                                        }
                                    </p>
                                </div>
                            )}


                            {/* Localisation */}
                            {(consultationDetails.country || consultationDetails.region || consultationDetails.company_details?.region) && (
                                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                    <h5 className="text-md font-semibold text-gray-900 mb-3">
                                        <i className="fas fa-map-marker-alt mr-2 text-green-600"></i>
                                        Localisation
                                    </h5>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {(consultationDetails.country || consultationDetails.company_details?.country) && (
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600 mb-1">
                                                    {(consultationDetails.country?.name || consultationDetails.country || consultationDetails.company_details?.country?.name)}
                                                </div>
                                                <div className="text-xs text-gray-600">Pays</div>
                                            </div>
                                        )}
                                        {(consultationDetails.region || consultationDetails.company_details?.region) && (
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600 mb-1">
                                                    {(consultationDetails.region?.name || consultationDetails.region || consultationDetails.company_details?.region?.name)}
                                                </div>
                                                <div className="text-xs text-gray-600">Région</div>
                                            </div>
                                        )}
                                        {consultationDetails.geographic_zone && (
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600 mb-1">
                                                    {consultationDetails.geographic_zone}
                                                </div>
                                                <div className="text-xs text-gray-600">Zone géographique</div>
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
                                            {consultationDetails.views_count || 0}
                                        </div>
                                        <div className="text-xs text-gray-600">Vues</div>
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
                                onClick={loadConsultationDetails}
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
                    <div className="text-2xl font-bold text-blue-600">{candidatures.length}</div>
                    <div className="text-xs text-gray-500">
                        {consultationIdParam && consultationIdParam !== 'undefined' ? 'Candidatures pour cette consultation' : 'Candidatures filtrées'}
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

            {/* Filtres avancés */}
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {consultationIdParam && consultationIdParam !== 'undefined' ? 'Filtres pour cette consultation' : 'Filtres avancés'}
                    </h3>
                    {consultationIdParam && consultationIdParam !== 'undefined' && (
                        <p className="text-sm text-gray-600 mb-3">
                            Filtrage des candidatures pour la consultation <strong>#{consultationIdParam}</strong>
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Consultation</label>
                        <input
                            type="text"
                            name="offre"
                            value={filters.offre}
                            onChange={handleFilterChange}
                            placeholder="Rechercher par consultation..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
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
                        <LoadingSpinner />
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
                                ? 'Il semble qu\'il n\'y ait pas encore de candidatures pour cette consultation ou que l\'API ne soit pas accessible.'
                                : 'Aucune candidature ne correspond aux critères de recherche actuels.'
                            }
                        </p>
                        <div className="space-y-2">
                            <button
                                onClick={loadCandidatures}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 mr-2"
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
                                                    src={buildImageUrl(candidature.apiData.candidate_profile.image)}
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
                                                <p className="text-sm text-gray-600">{candidature.apiData?.consultation_offer?.title || 'Titre non spécifié'}</p>
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
                                                        <span className={`text-xs px-2 py-1 rounded ${candidature.apiData.ai_analysis.recommendation === 'WEAK_MATCH' ? 'bg-red-100 text-red-800' :
                                                            candidature.apiData.ai_analysis.recommendation === 'GOOD_MATCH' ? 'bg-green-100 text-green-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {candidature.apiData.ai_analysis.recommendation === 'WEAK_MATCH' ? 'Non recommandé' :
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
                                            <div className="text-xs text-gray-500">Portfolio</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-sm font-bold text-green-600">{candidature.lettre ? 'Oui' : 'Non'}</div>
                                            <div className="text-xs text-gray-500">Lettre</div>
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-3">

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
                                        <i className="fas fa-folder-open mr-1"></i>Documents
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
                                        onClick={() => approveApplication(candidature)}
                                        className="px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition duration-200 text-sm"
                                    >
                                        <i className="fas fa-check mr-1"></i>Accepter
                                    </button>
                                    <button
                                        onClick={() => rejectApplication(candidature)}
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
                            {/* CV depuis applicant_profile */}
                            {selectedCandidateDocuments.apiData?.candidate_profile?.cv ? (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">CV (Profil)</h4>
                                                <p className="text-sm text-gray-600">Curriculum Vitae du profil candidat</p>
                                                <p className="text-xs text-gray-500">Format: PDF</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const cvUrl = selectedCandidateDocuments.apiData.candidate_profile.cv;
                                                if (cvUrl) {
                                                    const fullUrl = cvUrl.startsWith('http') ? cvUrl : buildImageUrl(cvUrl);
                                                    window.open(fullUrl, '_blank');
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
                                            <h4 className="font-semibold text-gray-500">CV (Profil)</h4>
                                            <p className="text-sm text-gray-400">Aucun CV de profil disponible</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CV depuis la candidature */}
                            {selectedCandidateDocuments.apiData?.portfolio ? (
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <i className="fas fa-file-pdf text-orange-600 text-xl"></i>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">CV (Candidature)</h4>
                                                <p className="text-sm text-gray-600">CV soumis avec la candidature</p>
                                                <p className="text-xs text-gray-500">Format: PDF</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                const cvUrl = selectedCandidateDocuments.apiData.portfolio;
                                                if (cvUrl) {
                                                    window.open(cvUrl, '_blank');
                                                }
                                            }}
                                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 text-sm"
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
                                            <h4 className="font-semibold text-gray-500">CV (Candidature)</h4>
                                            <p className="text-sm text-gray-400">Aucun CV de candidature disponible</p>
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
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="font-semibold text-blue-800 mb-2">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Informations
                                </h4>
                                <div className="text-sm text-blue-700 space-y-1">
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
                                <i className="fas fa-envelope mr-2 text-orange-600"></i>
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
                                <div className={`w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold ${selectedMotivationLetter.imageProfil ? 'hidden' : ''}`}>
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
                                            <i className="fas fa-envelope-open-text mr-2 text-orange-600"></i>
                                            Contenu de la Lettre de Motivation
                                        </h4>
                                        <p className="text-sm text-gray-600">Lettre soumise le {selectedMotivationLetter.dateCandidature}</p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-800 whitespace-pre-wrap">
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
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <h4 className="font-semibold text-orange-800 mb-2">
                                    <i className="fas fa-info-circle mr-2"></i>
                                    Informations sur la candidature
                                </h4>
                                <div className="text-sm text-orange-700 space-y-1">
                                    <p>• Date de candidature: {selectedMotivationLetter.dateCandidature}</p>
                                    <p>• Statut: {selectedMotivationLetter.statut}</p>
                                    <p>• Priorité: {selectedMotivationLetter.priorite}</p>
                                    <p>• Il y a {selectedMotivationLetter.joursDepuisCandidature} jour(s)</p>
                                    {selectedMotivationLetter.dateVisualisation !== 'Non visualisée' && (
                                        <p>• Vue le {selectedMotivationLetter.dateVisualisation}</p>
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
                                className={`px-4 py-2 text-white rounded-lg transition duration-200 ${validationAction === 'approve'
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

export default PostulationConsultation;