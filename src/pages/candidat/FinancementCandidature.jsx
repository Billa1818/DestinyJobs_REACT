import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    faLightbulb,
    faThumbsUp,
    faThumbsDown
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import financementCandidatureService from '../../services/FinancementCandidatureService';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

const FinancementCandidature = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    // États pour les filtres
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [ordering, setOrdering] = useState('-application__created_at');

    // États pour les statistiques
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        viewed: 0,
        shortlisted: 0,
        interview: 0,
        accepted: 0,
        rejected: 0
    });

    // Charger les candidatures au montage du composant
    useEffect(() => {
        loadApplications();
    }, []);

    // Charger les candidatures avec les filtres actuels
    const loadApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters = {
                search: searchTerm || undefined,
                status: statusFilter || undefined,
                ordering: ordering
            };

            // Nettoyer les filtres undefined
            Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

            const result = await financementCandidatureService.getMyFundingApplications(filters);
            setApplications(result.applications);

            // Calculer les statistiques
            calculateStats(result.applications);

        } catch (error) {
            console.error('❌ Erreur lors du chargement des candidatures:', error);
            setError(error.message || 'Erreur lors du chargement des candidatures');
        } finally {
            setLoading(false);
        }
    };

    // Calculer les statistiques
    const calculateStats = (apps) => {
        if (!apps) return;

        const newStats = {
            total: apps.length,
            pending: apps.filter(app => app.application?.status === 'PENDING').length,
            viewed: apps.filter(app => app.application?.status === 'VIEWED').length,
            shortlisted: apps.filter(app => app.application?.status === 'SHORTLISTED').length,
            interview: apps.filter(app => app.application?.status === 'INTERVIEW').length,
            accepted: apps.filter(app => app.application?.status === 'ACCEPTED').length,
            rejected: apps.filter(app => app.application?.status === 'REJECTED').length
        };

        setStats(newStats);
    };

    // Appliquer les filtres
    const applyFilters = () => {
        loadApplications();
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        setOrdering('-application__created_at');
        loadApplications();
    };

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Formater le montant
    const formatAmount = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(parseFloat(amount));
    };

    // Vérifier si la candidature est urgente (date de clôture proche)
    const isUrgent = (closingDate) => {
        if (!closingDate) return false;
        const closing = new Date(closingDate);
        const now = new Date();
        const diffTime = closing - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays >= 0;
    };

    // Calculer les jours jusqu'à la clôture
    const getDaysUntilClosing = (closingDate) => {
        if (!closingDate) return null;
        const closing = new Date(closingDate);
        const now = new Date();
        const diffTime = closing - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
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

    // Fonction pour construire l'URL complète des images
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return buildImageUrl(imagePath);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                        <h3 className="text-lg font-medium text-red-800 mb-2">Erreur de chargement</h3>
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={loadApplications}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Mes Candidatures de Financement
                    </h1>
                    <p className="text-gray-600">
                        Gérez vos candidatures pour les offres de financement
                    </p>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FontAwesomeIcon icon={faChartLine} className="text-blue-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">En attente</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <FontAwesomeIcon icon={faStar} className="text-purple-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Présélectionnées</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FontAwesomeIcon icon={faUser} className="text-green-600 text-xl" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtres */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            <FontAwesomeIcon icon={faFilter} className="mr-2" />
                            Filtres et recherche
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Rechercher..."
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
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                                >
                                    <option value="">Tous les statuts</option>
                                    <option value="PENDING">En attente</option>
                                    <option value="VIEWED">Consultée</option>
                                    <option value="SHORTLISTED">Présélectionnée</option>
                                    <option value="INTERVIEW">Entretien</option>
                                    <option value="ACCEPTED">Acceptée</option>
                                    <option value="REJECTED">Refusée</option>
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
                                    <option value="-application__created_at">Plus récentes</option>
                                    <option value="application__created_at">Plus anciennes</option>
                                    <option value="application__status">Par statut</option>
                                </select>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <button
                                onClick={applyFilters}
                                className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
                            >
                                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                Appliquer les filtres
                            </button>

                            <button
                                onClick={resetFilters}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
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
                ) : (
                <div className="space-y-6">
                    {applications && applications.length > 0 ? (
                        applications.map((candidature) => {
                            const offer = candidature.funding_offer;
                            const application = candidature.application;
                            const candidate = candidature.candidate_profile;
                            const aiAnalysis = candidature.ai_analysis;
                            const compatibilityScore = aiAnalysis?.compatibility_score ? parseFloat(aiAnalysis.compatibility_score) : 0;
                            const scoreColors = getScoreColor(compatibilityScore);
                            const isExpanded = expandedId === candidature.id;

                            const isUrgentOffer = isUrgent(offer?.closing_date);
                            const daysUntilClosing = getDaysUntilClosing(offer?.closing_date);

                            return (
                                <div key={candidature.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        {/* En-tête avec logo et titre */}
                                        <div className="flex items-start space-x-4 mb-4">
                                            {/* Logo de l'organisation */}
                                            <div className="flex-shrink-0">
                                                {offer?.company_logo ? (
                                                    <img
                                                        src={getImageUrl(offer.company_logo)}
                                                        alt={`Logo ${offer?.organization_name}`}
                                                        className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-fuchsia-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-fuchsia-600 text-2xl" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Titre et Badges */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                    {offer?.title || 'Titre non disponible'}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-2">
                                                    <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-400" />
                                                    {offer?.organization_name || 'Organisation non spécifiée'}
                                                </p>

                                                {/* Badges de statut et score */}
                                                <div className="flex flex-wrap gap-2 items-center">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${financementCandidatureService.getStatusColor(application?.status)}`}>
                                                        {financementCandidatureService.getStatusText(application?.status)}
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
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs text-gray-500 font-medium mb-1">Localisation</p>
                                                <p className="text-sm font-semibold text-gray-900 flex items-center">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                                                    {offer?.region?.name || 'N/A'}
                                                </p>
                                            </div>

                                            <div className="p-3 bg-blue-50 rounded-lg">
                                                <p className="text-xs text-blue-600 font-medium mb-1">Montant</p>
                                                <p className="text-sm font-bold text-blue-900">
                                                    <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2" />
                                                    {formatAmount(candidature.requested_amount)}
                                                </p>
                                            </div>

                                            <div className="p-3 bg-green-50 rounded-lg">
                                                <p className="text-xs text-green-600 font-medium mb-1">Postulé le</p>
                                                <p className="text-sm font-semibold text-green-900">
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                                    {formatDate(application?.created_at)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bouton pour afficher plus */}
                                        <button
                                            onClick={() => setExpandedId(isExpanded ? null : candidature.id)}
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
                                            {/* Analyse IA */}
                                            {aiAnalysis && (
                                                <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                                                    <div className="flex items-center mb-3">
                                                        <FontAwesomeIcon icon={faChartLine} className="text-indigo-600 mr-2" />
                                                        <h4 className="font-bold text-gray-900">Analyse de compatibilité</h4>
                                                    </div>

                                                    {/* Détails des scores */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
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
                                                        <div className="text-xs">
                                                            <p className="text-gray-600">Financer</p>
                                                            <p className="font-bold text-indigo-600">
                                                                90%
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

                                            {/* Action */}
                                            <Link
                                                to={`/financements/${offer?.id}`}
                                                className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="mr-2" />
                                                Voir l'offre complète
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faFileAlt} className="text-gray-400 text-3xl" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucune candidature trouvée
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm || statusFilter
                                    ? 'Aucune candidature ne correspond à vos critères de recherche.'
                                    : 'Vous n\'avez pas encore soumis de candidature pour des offres de financement.'
                                }
                            </p>

                            {searchTerm || statusFilter ? (
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
                                >
                                    Réinitialiser les filtres
                                </button>
                            ) : (
                                <Link
                                    to="/public/financements"
                                    className="inline-flex items-center px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
                                >
                                    <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                    Découvrir des offres
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                )}
            </div>
        </div>
    );
};

export default FinancementCandidature;
