import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PrestataireDashboardService from '../../services/PrestataireDashboardService';
import consultationDemandesService from '../../services/consultationDemandesService';

const PrestataireHome = () => {
  // États pour les données du tableau de bord
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentOffers, setRecentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Charger toutes les données du tableau de bord
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques personnelles
      const statsData = await PrestataireDashboardService.getMyApplicationStats();
      const formattedStats = PrestataireDashboardService.formatStatsForDisplay(statsData);
      setStats(formattedStats);

      // Charger les candidatures récentes avec consultationDemandesService
      const applicationsData = await consultationDemandesService.getConsultationDemandes();
      const formattedApplications = applicationsData
        .slice(0, 5) // Prendre seulement les 5 plus récentes
        .map(demande => consultationDemandesService.formatDemandeForDisplay(demande))
        .filter(app => app !== null); // Filtrer les données invalides
      setRecentApplications(formattedApplications);

      // Charger les offres récentes
      const offersData = await PrestataireDashboardService.getConsultationOffers({
        ordering: '-created_at',
        page_size: 5
      });
      setRecentOffers(offersData.results || []);

      console.log('✅ Données du tableau de bord chargées avec succès');
    } catch (err) {
      console.error('❌ Erreur lors du chargement du tableau de bord:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Formater le montant
  const formatAmount = (amount) => {
    if (!amount) return 'Non spécifié';
    return `${parseFloat(amount).toLocaleString('fr-FR')} FCFA`;
  };

  // Obtenir l'icône selon le type d'offre
  const getOfferTypeIcon = (offerType) => {
    const icons = {
      'CONSULTATION': 'fas fa-comments',
      'FUNDING': 'fas fa-money-bill-wave',
      'JOB': 'fas fa-briefcase',
      'SCHOLARSHIP': 'fas fa-graduation-cap'
    };
    return icons[offerType] || 'fas fa-file-alt';
  };

  // Obtenir la couleur selon le type d'offre
  const getOfferTypeColor = (offerType) => {
    const colors = {
      'CONSULTATION': 'text-blue-600',
      'FUNDING': 'text-green-600',
      'JOB': 'text-orange-600',
      'SCHOLARSHIP': 'text-purple-600'
    };
    return colors[offerType] || 'text-gray-600';
  };

  // Affichage du chargement
  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </main>
    );
  }

  // Affichage de l'erreur
  if (error) {
  return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={loadDashboardData}
              className="text-sm text-red-600 hover:text-red-500 underline"
            >
              Réessayer
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de vos activités et opportunités</p>
      </div>

      {/* Statistiques principales */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total des candidatures */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <i className="fas fa-paper-plane text-blue-600"></i>
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total candidatures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>

          {/* Candidatures en attente */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <i className="fas fa-clock text-yellow-600"></i>
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                <p className="text-xs text-gray-500">{stats.pendingPercentage}%</p>
            </div>
          </div>
        </div>

          {/* Candidatures acceptées */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <i className="fas fa-check-circle text-green-600"></i>
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.acceptedApplications}</p>
                <p className="text-xs text-gray-500">{stats.acceptedPercentage}%</p>
            </div>
          </div>
        </div>

          {/* Taux de réussite */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <i className="fas fa-chart-line text-purple-600"></i>
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de réussite</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                <p className="text-xs text-gray-500">Temps moyen: {stats.averageResponseTime}j</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphique des candidatures par mois */}
      {stats && stats.applicationsByMonth && stats.applicationsByMonth.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Évolution des candidatures</h2>
          <div className="space-y-3">
            {stats.applicationsByMonth.slice(0, 6).map((monthData, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{monthData.month}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Total: {monthData.count}</span>
                  <span className="text-sm text-green-600">✓ {monthData.accepted}</span>
                  <span className="text-sm text-red-600">✗ {monthData.rejected}</span>
                  <span className="text-sm text-yellow-600">⏳ {monthData.pending}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top des domaines de consultation */}
      {stats && stats.topConsultationAreas && stats.topConsultationAreas.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Domaines de consultation populaires</h2>
          <div className="flex flex-wrap gap-2">
            {stats.topConsultationAreas.map((area, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {area}
              </span>
            ))}
        </div>
      </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidatures récentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Candidatures récentes</h2>
              <Link
                to="/prestataire/demandes"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Voir tout
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentApplications.length > 0 ? (
            <div className="space-y-4">
                {recentApplications.map((application) => {
                  const statusDisplay = consultationDemandesService.getStatusDisplay(application.status);
                  const statusColor = consultationDemandesService.getStatusColor(application.status);
                  
                  return (
                    <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{application.consultationTitle}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                          {statusDisplay}
                        </span>
                    </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Candidat:</span> {application.candidateName}
                  </div>
                      
                      {application.aiCompatibilityScore > 0 && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Score IA:</span> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                            application.aiCompatibilityScore >= 80 ? 'bg-green-100 text-green-800' :
                            application.aiCompatibilityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {application.aiCompatibilityScore}%
                    </span>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Type:</span> {application.consultationType}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Postulé le {formatDate(application.createdAt)}
                  </div>
                </div>
                  );
                })}
            </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-paper-plane text-3xl text-gray-300 mb-3"></i>
                <p className="text-gray-500">Aucune candidature pour le moment</p>
                <Link
                  to="/consultations"
                  className="inline-block mt-3 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Parcourir les offres
              </Link>
            </div>
            )}
          </div>
        </div>

        {/* Offres récentes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Offres récentes</h2>
              <Link
                to="/consultations"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Voir tout
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentOffers.length > 0 ? (
            <div className="space-y-4">
                {recentOffers.map((offer) => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{offer.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${getOfferTypeColor(offer.offer_type)}`}>
                        <i className={`${getOfferTypeIcon(offer.offer_type)} mr-1`}></i>
                        {offer.offer_type}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Budget:</span> {formatAmount(offer.budget)}
                    </div>
                    
                    {offer.deadline && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Date limite:</span> {formatDate(offer.deadline)}
                  </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mb-3">
                      Publié le {formatDate(offer.created_at)}
                  </div>
                    
                    <Link
                      to={`/consultation/${offer.id}`}
                      className="inline-block text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                      Voir les détails →
                    </Link>
                </div>
              ))}
            </div>
            ) : (
              <div className="text-center py-8">
                <i className="fas fa-search text-3xl text-gray-300 mb-3"></i>
                <p className="text-gray-500">Aucune offre récente</p>
                <Link
                  to="/consultations"
                  className="inline-block mt-3 text-orange-600 hover:text-orange-700 font-medium"
                >
                  Parcourir les offres
              </Link>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/consultations"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200"
          >
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <i className="fas fa-search text-blue-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Rechercher des offres</h3>
              <p className="text-sm text-gray-600">Trouvez de nouvelles opportunités</p>
            </div>
          </Link>

          <Link
            to="/prestataire/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200"
          >
            <div className="p-2 bg-green-100 rounded-lg mr-4">
              <i className="fas fa-user-edit text-green-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Mettre à jour le profil</h3>
              <p className="text-sm text-gray-600">Améliorez votre visibilité</p>
            </div>
          </Link>

          <Link
            to="/prestataire/demandes"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition duration-200"
          >
            <div className="p-2 bg-purple-100 rounded-lg mr-4">
              <i className="fas fa-list-alt text-purple-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Gérer les candidatures</h3>
              <p className="text-sm text-gray-600">Suivez vos postulations</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default PrestataireHome; 