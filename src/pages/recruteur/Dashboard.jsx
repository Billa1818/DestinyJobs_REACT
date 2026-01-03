import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardService from '../../services/DashboardService';
import RecruteurNotificationService from '../../services/RecruteurNotificationService';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOfferType, setSelectedOfferType] = useState('ALL'); // ALL, JOB, FUNDING, CONSULTATION, SCHOLARSHIP

    // Formatage des dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifié';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Charger les notifications récentes
    const loadRecentNotifications = async () => {
        try {
            console.log('🔔 Chargement des notifications récentes pour le dashboard...');
            const response = await RecruteurNotificationService.getNotifications({}, 1, 5); // 5 dernières notifications

            console.log('✅ Notifications récentes reçues:', response);

            // Adapter la structure de réponse selon la nouvelle API
            const notificationsData = response.notifications || response.results || [];
            setNotifications(notificationsData);

        } catch (error) {
            console.error('❌ Erreur lors du chargement des notifications récentes:', error);
            setNotifications([]);
        }
    };

    // Charger le dashboard complet
    const loadDashboard = async () => {
        try {
            setLoading(true);
            console.log('🚀 Chargement du tableau de bord complet...');

            const data = await DashboardService.getDashboardData();
            console.log('✅ Tableau de bord chargé avec succès:', data);

            setDashboardData(data);

            // Charger les notifications séparément avec le service dédié
            await loadRecentNotifications();

        } catch (error) {
            console.error('❌ Erreur lors du chargement du tableau de bord:', error);
            setError('Erreur lors du chargement du tableau de bord');
        } finally {
            setLoading(false);
        }
    };

    // Charger les données au montage du composant
    useEffect(() => {
        loadDashboard();
    }, []);

    // Formatage des nombres
    const formatNumber = (num) => {
        if (num === null || num === undefined) return '0';
        return num.toLocaleString('fr-FR');
    };

    // Obtenir la couleur du statut
    const getStatusColor = (status, isExpired = false) => {
        if (isExpired) return 'bg-red-100 text-red-800';
        switch (status) {
            case 'DRAFT':
                return 'bg-gray-100 text-gray-800';
            case 'PENDING_APPROVAL':
                return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED':
                return 'bg-fuchsia-100 text-fuchsia-800';
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            case 'CLOSED':
                return 'bg-gray-800 text-white';
            case 'EXPIRED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Obtenir le label du statut
    const getStatusLabel = (status, isExpired = false) => {
        if (isExpired) return 'Expiré';
        switch (status) {
            case 'DRAFT':
                return 'Brouillon';
            case 'PENDING_APPROVAL':
                return 'En attente d\'approbation';
            case 'APPROVED':
                return 'Approuvée';
            case 'PUBLISHED':
                return 'Publiée';
            case 'REJECTED':
                return 'Refusée';
            case 'CLOSED':
                return 'Fermée';
            case 'EXPIRED':
                return 'Expiré';
            default:
                return status;
        }
    };

    // Calculer les stats filtrées par type d'offre
    const getFilteredStats = () => {
        if (!dashboardData?.recentApplications) {
            return dashboardData?.applicationStats || {};
        }

        if (selectedOfferType === 'ALL') {
            return dashboardData?.applicationStats || {};
        }

        // Filtrer les candidatures par type d'offre
        const filteredApplications = dashboardData.recentApplications.filter(app => {
            if (selectedOfferType === 'JOB') return app.offer_type === 'JOB';
            if (selectedOfferType === 'FUNDING') return app.offer_type === 'FUNDING';
            if (selectedOfferType === 'CONSULTATION') return app.offer_type === 'CONSULTATION';
            if (selectedOfferType === 'SCHOLARSHIP') return app.offer_type === 'SCHOLARSHIP';
            return true;
        });

        // Compter par statut
        const stats = {
            total_applications: filteredApplications.length,
            pending_applications: filteredApplications.filter(a => a.status === 'PENDING').length,
            viewed_applications: filteredApplications.filter(a => a.status === 'VIEWED').length,
            shortlisted_applications: filteredApplications.filter(a => a.status === 'SHORTLISTED').length,
            rejected_applications: filteredApplications.filter(a => a.status === 'REJECTED').length,
            accepted_applications: filteredApplications.filter(a => a.status === 'ACCEPTED').length,
            interview_applications: filteredApplications.filter(a => a.status === 'INTERVIEW').length
        };

        return stats;
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="text-red-600 text-xl font-semibold mb-2">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    Erreur
                </div>
                <p className="text-red-700">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    if (!loading && !dashboardData) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <div className="text-yellow-600 text-xl font-semibold">
                    <i className="fas fa-info-circle mr-2"></i>
                    Aucune donnée disponible
                </div>
            </div>
        );
    }

    // Extraire les données du dashboard
    const {
        applicationStats = {},
        jobOffers = [],
        fundingOffers = [],
        consultationOffers = [],
        scholarships = [],
        recentApplications = []
    } = dashboardData || {};

    // Obtenir les stats filtrées
    const filteredStats = getFilteredStats();

    return (
        <div className="bg-gray-50 min-h-screen">
            {loading ? (
                <LoadingSpinner variant="page" size="lg" text="Chargement du tableau de bord..." />
            ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
                        <p className="text-gray-600">Vue d'ensemble de vos activités de recrutement</p>
                    </div>
                    <button
                        onClick={loadDashboard}
                        className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
                    >
                        <i className="fas fa-sync mr-2"></i>
                        Actualiser
                    </button>
                </div>



                {/* Filtres par type d'offre */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Filtrer par type d'offre</h3>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { value: 'ALL', label: 'Toutes les offres' },
                            { value: 'JOB', label: 'Offres d\'emploi' },
                            { value: 'FUNDING', label: 'Offres de financement' },
                            { value: 'CONSULTATION', label: 'Consultations' },
                            { value: 'SCHOLARSHIP', label: 'Bourses' }
                        ].map(option => (
                            <button
                                key={option.value}
                                onClick={() => setSelectedOfferType(option.value)}
                                className={`px-4 py-2 rounded-lg transition duration-200 ${
                                    selectedOfferType === option.value
                                        ? 'bg-fuchsia-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statistiques des Candidatures */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-fuchsia-100 text-fuchsia-600">
                                <i className="fas fa-users text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Candidatures</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatNumber(filteredStats?.total_applications || 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <i className="fas fa-clock text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">En Attente</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatNumber(filteredStats?.pending_applications || 0)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <i className="fas fa-check-circle text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Présélectionnés</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatNumber(filteredStats?.shortlisted_applications || 0)}
                                </p>
                            </div>
                        </div>
                    </div>



                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600">
                                <i className="fas fa-times-circle text-xl"></i>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Refusées</p>
                                <p className="text-2xl font-semibold text-gray-900">
                                    {formatNumber(filteredStats?.rejected_applications || 0)}
                                </p>
                            </div>
                        </div>
                    </div>


                </div>


                {/* Mes Offres - Affichage Horizontal */}
                <div className="mb-8 space-y-8">
                    {/* Offres d'Emploi */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <i className="fas fa-briefcase text-gray-700 text-xl"></i>
                                    <h2 className="text-lg font-semibold text-gray-900">Offres d'Emploi</h2>
                                </div>
                                <Link to="/recruteur/gestion-offre" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                    Voir tout →
                                </Link>
                            </div>
                        </div>

                        {/* Contenu - Horizontal */}
                        <div className="p-6">
                            {jobOffers?.results && jobOffers.results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {jobOffers.results.slice(0, 3).map((offer, index) => (
                                        <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition duration-200">
                                            {/* Titre et statut */}
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                                    {offer.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded whitespace-nowrap flex-shrink-0 ${getStatusColor(offer.status, offer.is_expired)
                                                    }`}>
                                                    {getStatusLabel(offer.status, offer.is_expired)}
                                                </span>
                                            </div>

                                            {/* Infos clés */}
                                            <div className="space-y-1 mb-3 text-xs text-gray-600">
                                                {offer.location && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-map-marker-alt text-gray-400 w-3"></i>
                                                        <span className="truncate">{offer.location}</span>
                                                    </div>
                                                )}
                                                {offer.contract_type && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-id-badge text-gray-400 w-3"></i>
                                                        <span className="truncate">{offer.contract_type}</span>
                                                    </div>
                                                )}
                                                {offer.salary_range && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-money-bill-wave text-gray-400 w-3"></i>
                                                        <span className="truncate text-xs font-medium">{offer.salary_range}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Statistiques et actions */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs text-gray-600">
                                                <div className="flex gap-2">
                                                    <span className="flex items-center gap-1">
                                                        <i className="fas fa-eye text-gray-400"></i>
                                                        {formatNumber(offer.views_count || 0)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <i className="fas fa-user text-gray-400"></i>
                                                        {formatNumber(offer.applications_count || 0)}
                                                    </span>
                                                </div>
                                                <Link to={`/jobs/${offer.id}`} className="text-gray-600 hover:text-gray-900 font-medium">
                                                    Voir →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <i className="fas fa-inbox text-3xl text-gray-300 mb-3 block"></i>
                                    <p className="text-gray-500 text-sm mb-3">Aucune offre d'emploi créée</p>
                                    <Link to="/recruteur/creer-offre" className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium">
                                        <i className="fas fa-plus mr-1"></i>Créer une offre
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Offres de Consultation */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <i className="fas fa-handshake text-gray-700 text-xl"></i>
                                    <h2 className="text-lg font-semibold text-gray-900">Consultations</h2>
                                </div>
                                <Link to="/recruteur/gestion-consultations" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                    Voir tout →
                                </Link>
                            </div>
                        </div>

                        {/* Contenu - Horizontal */}
                        <div className="p-6">
                            {consultationOffers?.results && consultationOffers.results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {consultationOffers.results.slice(0, 3).map((offer, index) => (
                                        <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition duration-200">
                                            {/* Titre et statut */}
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                                    {offer.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded whitespace-nowrap flex-shrink-0 ${getStatusColor(offer.status, offer.is_expired)
                                                    }`}>
                                                    {getStatusLabel(offer.status, offer.is_expired)}
                                                </span>
                                            </div>

                                            {/* Infos clés */}
                                            <div className="space-y-1 mb-3 text-xs text-gray-600">
                                                {offer.company_details?.company_name && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-building text-gray-400 w-3"></i>
                                                        <span className="truncate">{offer.company_details.company_name}</span>
                                                    </div>
                                                )}
                                                {offer.country?.name && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-globe text-gray-400 w-3"></i>
                                                        <span className="truncate">{offer.country.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description courte */}
                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                {offer.description}
                                            </p>

                                            {/* Statistiques et actions */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <i className="fas fa-eye text-gray-400"></i>
                                                    {formatNumber(offer.views_count || 0)}
                                                </span>
                                                <Link to={`consultations/${offer.id}`} className="text-gray-600 hover:text-gray-900 font-medium">
                                                    Voir →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <i className="fas fa-inbox text-3xl text-gray-300 mb-3 block"></i>
                                    <p className="text-gray-500 text-sm mb-3">Aucune consultation créée</p>
                                    <Link to="/recruteur/creer-consultation" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                                        <i className="fas fa-plus mr-1"></i>Créer une consultation
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Offres de Financement */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Header */}
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <i className="fas fa-coins text-gray-700 text-xl"></i>
                                    <h2 className="text-lg font-semibold text-gray-900">Financements</h2>
                                </div>
                                <Link to="/recruteur/gestion-financements" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                    Voir tout →
                                </Link>
                            </div>
                        </div>

                        {/* Contenu - Horizontal */}
                        <div className="p-6">
                            {fundingOffers?.results && fundingOffers.results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {fundingOffers.results.slice(0, 3).map((offer, index) => (
                                        <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition duration-200">
                                            {/* Titre et statut */}
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                                                    {offer.title}
                                                </h3>
                                                <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded whitespace-nowrap flex-shrink-0 ${offer.status === 'PUBLISHED' ? 'bg-gray-100 text-gray-700' :
                                                        offer.status === 'PENDING_APPROVAL' ? 'bg-gray-100 text-gray-600' :
                                                            offer.status === 'APPROVED' ? 'bg-gray-100 text-gray-700' :
                                                                offer.is_expired ? 'bg-gray-100 text-gray-600' :
                                                                    'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {offer.is_expired ? 'Expiré' : offer.status === 'PUBLISHED' ? 'Publié' : offer.status === 'APPROVED' ? 'Approuvé' : 'En attente'}
                                                </span>
                                            </div>

                                            {/* Montant en évidence */}
                                            {offer.montant && (
                                                <div className="mb-3 p-2 bg-gray-50 rounded border border-gray-200">
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-money-bill-wave text-gray-400"></i>
                                                        <span className="font-semibold text-gray-900">{parseFloat(offer.montant).toLocaleString('fr-FR')} FCFA</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Infos clés */}
                                            <div className="space-y-1 mb-3 text-xs text-gray-600">
                                                {offer.organization_name && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-building text-gray-400 w-3"></i>
                                                        <span className="truncate">{offer.organization_name}</span>
                                                    </div>
                                                )}
                                                {offer.country?.name && (
                                                    <div className="flex items-center gap-2">
                                                        <i className="fas fa-globe text-gray-400 w-3"></i>
                                                        <span className="truncate">{offer.country.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description courte */}
                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                {offer.objective}
                                            </p>

                                            {/* Statistiques et actions */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-xs text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <i className="fas fa-eye text-gray-400"></i>
                                                    {formatNumber(offer.views_count || 0)}
                                                </span>
                                                <Link to={`financements/${offer.id}`} className="text-gray-600 hover:text-gray-900 font-medium">
                                                    Voir →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <i className="fas fa-inbox text-3xl text-gray-300 mb-3 block"></i>
                                    <p className="text-gray-500 text-sm mb-3">Aucun financement créé</p>
                                    <Link to="/recruteur/creer-financement" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                                        <i className="fas fa-plus mr-1"></i>Créer un financement
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notifications Récentes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Notifications Récentes</h2>
                        <Link to="/recruteur/notifications" className="text-orange-600 hover:text-orange-700 text-sm">
                            Voir tout
                        </Link>
                    </div>
                    {notifications && notifications.length > 0 ? (
                        <div className="space-y-3">
                            {notifications.map((notification) => {
                                const meta = notification.metadata || {};
                                const metaEntries = Object.entries(meta).slice(0, 3);
                                const priorityClass = notification.priority === 'HIGH'
                                    ? 'bg-red-100 text-red-800'
                                    : notification.priority === 'URGENT'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-gray-100 text-gray-800';

                                // Fonction pour marquer comme lu
                                const handleMarkAsRead = async (id) => {
                                    try {
                                        await RecruteurNotificationService.markAsRead([id]);
                                        // Mettre à jour l'état local
                                        setNotifications(notifications.map(n =>
                                            n.id === id ? { ...n, is_read: true } : n
                                        ));
                                    } catch (error) {
                                        console.error('Erreur lors du marquage comme lu:', error);
                                    }
                                };

                                return (
                                    <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${notification.is_read ? 'bg-gray-50 border-gray-300' : 'bg-fuchsia-50 border-fuchsia-500'
                                        }`}>
                                        <div className="flex justify-between items-start">
                                            <div className="pr-4 flex-1">
                                                <div className="flex items-center flex-wrap gap-2 mb-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-fuchsia-100 text-fuchsia-800">
                                                        {notification.notification_type_display || notification.notification_type}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${priorityClass}`}>
                                                        {notification.priority_display || notification.priority}
                                                    </span>
                                                    {notification.delivery_method_display && (
                                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                                            {notification.delivery_method_display}
                                                        </span>
                                                    )}
                                                    {notification.is_read ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                            Lu
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                            Non lu
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-medium text-gray-900">{notification.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>

                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="text-right whitespace-nowrap text-xs text-gray-500">
                                                    {notification.time_since_created || formatDate(notification.created_at)}
                                                </div>
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                                                        title="Marquer comme lu"
                                                    >
                                                        <i className="fas fa-check mr-1"></i>Marquer lu
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">Aucune notification</p>
                    )}
                </div>
            </div>
            )}
        </div>
    );
};

export default Dashboard; 