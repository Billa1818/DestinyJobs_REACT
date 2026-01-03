import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faFilter,
    faEye,
    faFileAlt,
    faMapMarkerAlt,
    faClock,
    faStar,
    faChartLine,
    faCalendarAlt,
    faUser,
    faBuilding,
    faMoneyBillWave,
    faBriefcase,
    faHourglassHalf,
    faList,
    faPlus,
    faCheck,
    faLightbulb,
    faExclamationTriangle,
    faThumbsUp,
    faThumbsDown
} from '@fortawesome/free-solid-svg-icons';
import EmploiCandidatureRecentService from '../../services/EmploiCandidatureRecentService';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

const EmploiCandidature = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ search: '', status: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [ordering, setOrdering] = useState('-created_at');
    
    // États pour la pagination
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 10
    });

    // Charger les candidatures
    const loadApplications = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Chargement des candidatures...');
            const response = await EmploiCandidatureRecentService.getJobApplications(
                filters,
                page,
                pagination.pageSize
            );

            console.log('✅ Candidatures chargées:', response);
            setApplications(response.applications || []);
            
            // Mettre à jour la pagination
            setPagination(prev => ({
                ...prev,
                currentPage: page,
                totalPages: Math.ceil((response.count || response.applications?.length || 0) / pagination.pageSize),
                totalCount: response.count || response.applications?.length || 0
            }));

        } catch (error) {
            console.error('❌ Erreur lors du chargement:', error);
            setError(`Erreur lors du chargement: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Charger les candidatures au montage du composant
    useEffect(() => {
        loadApplications(1);
    }, []);

    // Fonction pour construire l'URL complète des images
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return buildImageUrl(imagePath);
    };

    // Filtrer les candidatures
    const filteredApplications = applications ? applications.filter(app => {
        const matchesSearch = !filters.search ||
            app.job_offer?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
            app.job_offer?.recruiter?.company_name?.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus = !filters.status || app.application?.status === filters.status;

        return matchesSearch && matchesStatus;
    }) : [];

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Date non disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Obtenir la couleur du statut
    const getStatusColor = (status) => {
        const statusColors = {
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'SHORTLISTED': 'bg-blue-100 text-blue-800',
            'ACCEPTED': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800',
            'WITHDRAWN': 'bg-gray-100 text-gray-800',
            'INTERVIEW': 'bg-purple-100 text-purple-800'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800';
    };

    // Obtenir le texte du statut
    const getStatusText = (status) => {
        const statusTexts = {
            'PENDING': 'En attente',
            'SHORTLISTED': 'Pré-sélectionnée',
            'ACCEPTED': 'Acceptée',
            'REJECTED': 'Refusée',
            'WITHDRAWN': 'Retirée',
            'INTERVIEW': 'Entretien'
        };
        return statusTexts[status] || status;
    };

    // Obtenir la couleur du score de compatibilité
    const getScoreColor = (score) => {
        if (score >= 70) return { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' };
        if (score >= 50) return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
        if (score >= 30) return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'text-yellow-600' };
        return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
    };

    // Obtenir le label du score
    const getScoreLabel = (score) => {
        if (score >= 70) return 'Très bon match';
        if (score >= 50) return 'Bon match';
        if (score >= 30) return 'Match modéré';
        return 'Faible match';
    };

    // Appliquer les filtres
    const applyFilters = () => {
        loadApplications(1);
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setFilters({ search: '', status: '' });
        setOrdering('-created_at');
        setTimeout(() => loadApplications(1), 0);
    };
    
    // Gestionnaire de changement de page
    const handlePageChange = (page) => {
        loadApplications(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mes candidatures</h1>
                        <p className="text-gray-600">Suivez l'état de vos candidatures aux offres d'emploi</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    {successMessage}
                </div>
            )}

            {/* Statistiques */}
            {!loading && applications && applications.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FontAwesomeIcon icon={faList} className="text-blue-600 text-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{pagination.totalCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">En attente</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {applications.filter(app => app.application?.status === 'PENDING').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FontAwesomeIcon icon={faStar} className="text-blue-600 text-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Pré-sélectionnées</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {applications.filter(app => app.application?.status === 'SHORTLISTED').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FontAwesomeIcon icon={faCheck} className="text-green-600 text-lg" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {applications.filter(app => app.application?.status === 'ACCEPTED').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <FontAwesomeIcon icon={faFilter} className="mr-3 text-fuchsia-600" />
                        Filtres et recherche
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Recherche */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Recherche
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    type="text"
                                    placeholder="Recherche..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filtre par statut */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Statut
                            </label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            >
                                <option value="">Tous les statuts</option>
                                <option value="PENDING">En attente</option>
                                <option value="SHORTLISTED">Pré-sélectionnée</option>
                                <option value="ACCEPTED">Acceptée</option>
                                <option value="REJECTED">Refusée</option>
                                <option value="WITHDRAWN">Retirée</option>
                                <option value="INTERVIEW">Entretien</option>
                            </select>
                        </div>

                        {/* Tri */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tri
                            </label>
                            <select
                                value={ordering}
                                onChange={(e) => setOrdering(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                            >
                                <option value="-created_at">Plus récentes</option>
                                <option value="created_at">Plus anciennes</option>
                                <option value="status">Par statut</option>
                            </select>
                        </div>
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={applyFilters}
                            className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center font-medium"
                        >
                            <FontAwesomeIcon icon={faSearch} className="mr-2" />
                            Appliquer les filtres
                        </button>

                        <button
                            onClick={resetFilters}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-200 font-medium"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            {/* Liste des candidatures */}
            {loading ? (
                <div className="py-12">
                    <LoadingSpinner variant="inline" size="lg" text="Chargement de vos candidatures..." />
                </div>
            ) : filteredApplications.length > 0 ? (
                <div className="space-y-4">
                    {filteredApplications.map((application) => {
                        const aiAnalysis = application.ai_analysis;
                        const compatibilityScore = aiAnalysis?.compatibility_score ? parseFloat(aiAnalysis.compatibility_score) : 0;
                        const scoreColors = getScoreColor(compatibilityScore);

                        const isExpanded = expandedId === application.id;

                        return (
                            <div key={application.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                {/* En-tête avec logo et titre */}
                                <div className="p-6">
                                    <div className="flex items-start space-x-4 mb-4">
                                        {/* Logo de l'entreprise */}
                                        <div className="flex-shrink-0">
                                            {application.job_offer?.recruiter?.logo ? (
                                                <img
                                                    src={getImageUrl(application.job_offer.recruiter.logo)}
                                                    alt={`Logo ${application.job_offer.recruiter.company_name}`}
                                                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                    <FontAwesomeIcon icon={faBuilding} className="text-gray-400 text-2xl" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Titre et Badges */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                {application.job_offer?.title || 'Titre non disponible'}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2">
                                                <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-400" />
                                                {application.job_offer?.recruiter?.company_name || 'Entreprise non spécifiée'}
                                            </p>

                                            {/* Badges de statut et score */}
                                            <div className="flex flex-wrap gap-2 items-center">
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.application?.status)}`}>
                                                    {getStatusText(application.application?.status)}
                                                </span>
                                                {aiAnalysis && (
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${scoreColors.bg} ${scoreColors.text}`}>
                                                        <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                                                        {getScoreLabel(compatibilityScore)} ({compatibilityScore.toFixed(1)}%)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ligne séparatrice */}
                                    <div className="border-t border-gray-100 my-4"></div>

                                    {/* Grille d'informations - VISIBLE TOUJOURS */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 font-medium mb-1">Localisation</p>
                                            <p className="text-sm font-semibold text-gray-900 flex items-center">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                                                {application.job_offer?.location || 'N/A'}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 font-medium mb-1">Type de contrat</p>
                                            <p className="text-sm font-semibold text-gray-900 flex items-center">
                                                <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-gray-400" />
                                                {application.job_offer?.contract_type || 'N/A'}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 font-medium mb-1">Expérience</p>
                                            <p className="text-sm font-semibold text-gray-900 flex items-center">
                                                <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                                                {application.job_offer?.experience_required || 'N/A'}
                                            </p>
                                        </div>

                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 font-medium mb-1">Mode de travail</p>
                                            <p className="text-sm font-semibold text-gray-900 flex items-center">
                                                <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-400" />
                                                {application.job_offer?.work_mode || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bouton pour afficher plus */}
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : application.id)}
                                        className="w-full py-2 text-fuchsia-600 font-semibold hover:bg-fuchsia-50 rounded transition duration-200 flex items-center justify-center"
                                    >
                                        <FontAwesomeIcon
                                            icon={faChartLine}
                                            className={`mr-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                        {isExpanded ? 'Masquer les détails' : 'Afficher plus de détails'}
                                    </button>
                                </div>

                                {/* Contenu déroulable */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                                        {/* Salaire et dates */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-600 font-medium mb-1">Salaire</p>
                                                <p className="text-sm font-bold text-blue-900">
                                                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                                                    {application.job_offer?.salary_range || 'Non précisé'}
                                                </p>
                                            </div>

                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <p className="text-xs text-green-600 font-medium mb-1">Postulé le</p>
                                                <p className="text-sm font-semibold text-green-900">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                                    {formatDate(application.application?.created_at)}
                                                </p>
                                            </div>

                                            <div className="p-3 bg-orange-50 rounded-lg">
                                                <p className="text-xs text-orange-600 font-medium mb-1">Clôture</p>
                                                <p className={`text-sm font-semibold ${application.job_offer?.is_urgent_closing ? 'text-red-600' : 'text-orange-900'}`}>
                                                    <FontAwesomeIcon icon={faHourglassHalf} className="mr-2" />
                                                    {formatDate(application.job_offer?.application_deadline)}
                                                    {application.job_offer?.is_urgent_closing && ' 🔴'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Analyse IA */}
                                        {aiAnalysis && (
                                            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                                                <div className="flex items-center mb-3">
                                                    <FontAwesomeIcon icon={faChartLine} className="text-indigo-600 mr-2" />
                                                    <h4 className="font-bold text-gray-900">Analyse de compatibilité</h4>
                                                </div>

                                                {/* Détails des scores */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                                                    <div className="text-xs">
                                                        <p className="text-gray-600">Compétences</p>
                                                        <p className="font-bold text-indigo-600">
                                                            {aiAnalysis.skill_match_percentage}%
                                                        </p>
                                                    </div>
                                                    <div className="text-xs">
                                                        <p className="text-gray-600">Expérience</p>
                                                        <p className="font-bold text-indigo-600">
                                                            {aiAnalysis.experience_match_percentage}%
                                                        </p>
                                                    </div>
                                                    <div className="text-xs">
                                                        <p className="text-gray-600">Localisation</p>
                                                        <p className="font-bold text-indigo-600">
                                                            {aiAnalysis.location_compatibility_score}%
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Forces et Faiblesses */}
                                                {(aiAnalysis.strengths?.length > 0 || aiAnalysis.weaknesses?.length > 0) && (
                                                    <div className="grid md:grid-cols-2 gap-2 text-xs mb-3">
                                                        {aiAnalysis.strengths?.length > 0 && (
                                                            <div className="flex items-start">
                                                                <FontAwesomeIcon icon={faThumbsUp} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-semibold text-gray-700">Forces:</p>
                                                                    <ul className="text-gray-600">
                                                                        {aiAnalysis.strengths.map((s, i) => (
                                                                            <li key={i}>• {s}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {aiAnalysis.weaknesses?.length > 0 && (
                                                            <div className="flex items-start">
                                                                <FontAwesomeIcon icon={faThumbsDown} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-semibold text-gray-700">À améliorer:</p>
                                                                    <ul className="text-gray-600">
                                                                        {aiAnalysis.weaknesses.map((w, i) => (
                                                                            <li key={i}>• {w}</li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Recommandation */}
                                                {aiAnalysis.recommendations && (
                                                    <div className="p-2 bg-white rounded border border-indigo-200">
                                                        <p className="text-xs font-semibold text-gray-700 flex items-center mb-1">
                                                            <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600 mr-2" />
                                                            Recommandation
                                                        </p>
                                                        <p className="text-xs text-gray-600">{aiAnalysis.recommendations}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <Link
                                            to={`/jobs/${application.job_offer?.id}`}
                                            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                                        >
                                            <FontAwesomeIcon icon={faEye} className="mr-2" />
                                            Voir l'offre complète
                                        </Link>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faList} className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature trouvée</h3>
                    <p className="text-gray-500 mb-6">
                        {applications && applications.length === 0
                            ? "Vous n'avez pas encore postulé à des offres d'emploi."
                            : "Aucune candidature ne correspond à vos critères de recherche."
                        }
                    </p>
                    <Link
                        to="/candidat/offre"
                        className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        Parcourir les offres
                    </Link>
                </div>
            )}
            
            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="mt-8">
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.totalCount}
                        itemsPerPage={pagination.pageSize}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default EmploiCandidature; 