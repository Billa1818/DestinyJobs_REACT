import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PrestataireDashboardService from '../../services/PrestataireDashboardService';
import consultationDemandesService from '../../services/consultationDemandesService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';
import {
  faSearch,
  faEye,
  faMapMarkerAlt,
  faClock,
  faChartLine,
  faCalendarAlt,
  faUser,
  faBuilding,
  faThumbsUp,
  faThumbsDown,
  faLightbulb,
  faGlobe,
  faStar,
  faCheck,
  faList
} from '@fortawesome/free-solid-svg-icons';

const PrestataireHome = () => {
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentOffers, setRecentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques personnelles
      const statsData = await PrestataireDashboardService.getMyApplicationStats();
      const formattedStats = PrestataireDashboardService.formatStatsForDisplay(statsData);
      setStats(formattedStats);

      // Charger les candidatures récentes
      const applicationsData = await consultationDemandesService.getConsultationDemandes();
      
      // Formater les candidatures selon le format backend
      const formattedApplications = applicationsData
        .slice(0, 5)
        .map(item => ({
          id: item.id,
          applicationId: item.application.id,
          consultationTitle: item.consultation_offer.title,
          consultationDescription: item.consultation_offer.description,
          candidateName: `${item.application.applicant.first_name} ${item.application.applicant.last_name}`,
          candidateUsername: item.application.applicant.username,
          candidateProfilePicture: item.candidate_profile?.profile_picture,
          status: item.application.status,
          consultationType: item.application.application_type,
          createdAt: item.application.created_at,
          viewedAt: item.application.viewed_at,
          daysSinceApplication: item.application.days_since_application,
          aiAnalysis: item.ai_analysis,
          aiCompatibilityScore: parseFloat(item.ai_analysis?.compatibility_score || 0),
          aiRecommendation: item.ai_analysis?.recommendations || '',
          aiStrengths: item.ai_analysis?.strengths || [],
          aiWeaknesses: item.ai_analysis?.weaknesses || [],
          skillMatchPercentage: item.ai_analysis?.skill_match_percentage,
          experienceMatchPercentage: item.ai_analysis?.experience_match_percentage,
          locationCompatibilityScore: item.ai_analysis?.location_compatibility_score,
          portfolio: item.portfolio,
          motivationLetter: item.motivation_letter,
          recruiterName: `${item.consultation_offer.recruiter.first_name} ${item.consultation_offer.recruiter.last_name}`,
          companyName: item.consultation_offer.company_details?.company_name || 'Non spécifié',
          companySector: item.consultation_offer.company_details?.sector || 'N/A',
          companyLogo: item.consultation_offer.company_logo,
          region: item.consultation_offer.region?.name || 'Non spécifié',
          country: item.consultation_offer.country?.name || 'Non spécifié',
          viewsCount: item.consultation_offer.views_count || 0,
          consultationId: item.consultation_offer.id
        }));
      
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return 'Non spécifié';
    return `${parseFloat(amount).toLocaleString('fr-FR')} FCFA`;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return buildImageUrl(imagePath);
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'PENDING': 'En attente',
      'SHORTLISTED': 'Pré-sélectionnée',
      'ACCEPTED': 'Acceptée',
      'REJECTED': 'Refusée',
      'WITHDRAWN': 'Retirée'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'SHORTLISTED': 'bg-blue-100 text-blue-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'WITHDRAWN': 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return { bg: 'bg-green-100', text: 'text-green-700', icon: 'text-green-600' };
    if (score >= 50) return { bg: 'bg-blue-100', text: 'text-blue-700', icon: 'text-blue-600' };
    if (score >= 30) return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: 'text-yellow-600' };
    return { bg: 'bg-red-100', text: 'text-red-700', icon: 'text-red-600' };
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Très bon match';
    if (score >= 50) return 'Bon match';
    if (score >= 30) return 'Match modéré';
    return 'Faible match';
  };

  const getOfferTypeIcon = (offerType) => {
    const icons = {
      'CONSULTATION': 'fas fa-comments',
      'FUNDING': 'fas fa-money-bill-wave',
      'JOB': 'fas fa-briefcase',
      'SCHOLARSHIP': 'fas fa-graduation-cap'
    };
    return icons[offerType] || 'fas fa-file-alt';
  };

  const getOfferTypeColor = (offerType) => {
    const colors = {
      'CONSULTATION': 'text-blue-600',
      'FUNDING': 'text-green-600',
      'JOB': 'text-orange-600',
      'SCHOLARSHIP': 'text-purple-600'
    };
    return colors[offerType] || 'text-gray-600';
  };

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
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FontAwesomeIcon icon={faList} className="text-blue-600 text-lg" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total candidatures</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-lg" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
                <p className="text-xs text-gray-500">{stats.pendingPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FontAwesomeIcon icon={faCheck} className="text-green-600 text-lg" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.acceptedApplications}</p>
                <p className="text-xs text-gray-500">{stats.acceptedPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FontAwesomeIcon icon={faChartLine} className="text-purple-600 text-lg" />
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
            {loading ? (
              <LoadingSpinner variant="inline" size="lg" text="Chargement des candidatures..." />
            ) : recentApplications.length > 0 ? (
              <div className="space-y-4">
                {recentApplications.map((application) => {
                  const scoreColors = getScoreColor(application.aiCompatibilityScore);
                  const isExpanded = expandedId === application.id;

                  return (
                    <div key={application.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                      {/* En-tête */}
                      <div className="p-4">
                        <div className="flex items-start space-x-3 mb-3">
                          {/* Photo du candidat */}
                          <div className="flex-shrink-0">
                            {application.candidateProfilePicture ? (
                              <img
                                src={getImageUrl(application.candidateProfilePicture)}
                                alt={application.candidateName}
                                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xl" />
                              </div>
                            )}
                          </div>

                          {/* Titre et Badges */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 mb-1">
                              {application.consultationTitle}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                              {application.candidateName}
                            </p>

                            {/* Badges de statut et score */}
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                                {getStatusDisplay(application.status)}
                              </span>
                              {!application.viewedAt && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Nouveau
                                </span>
                              )}
                              {application.aiAnalysis && (
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${scoreColors.bg} ${scoreColors.text}`}>
                                  <FontAwesomeIcon icon={faChartLine} className="mr-1" />
                                  {getScoreLabel(application.aiCompatibilityScore)} ({application.aiCompatibilityScore.toFixed(1)}%)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Ligne séparatrice */}
                        <div className="border-t border-gray-100 my-3"></div>

                        {/* Grille d'informations - VISIBLE TOUJOURS */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium mb-1">Localisation</p>
                            <p className="text-xs font-semibold text-gray-900 flex items-center">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-gray-400" />
                              {application.region}
                            </p>
                          </div>

                          <div className="p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium mb-1">Secteur</p>
                            <p className="text-xs font-semibold text-gray-900 flex items-center">
                              <FontAwesomeIcon icon={faGlobe} className="mr-1 text-gray-400" />
                              {application.companySector}
                            </p>
                          </div>

                          <div className="p-2 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 font-medium mb-1">Entreprise</p>
                            <p className="text-xs font-semibold text-gray-900 flex items-center">
                              <FontAwesomeIcon icon={faBuilding} className="mr-1 text-gray-400" />
                              {application.companyName}
                            </p>
                          </div>
                        </div>

                        {/* Bouton pour afficher plus */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : application.id)}
                          className="w-full py-2 text-orange-600 font-semibold hover:bg-orange-50 rounded transition duration-200 flex items-center justify-center text-sm"
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
                        <div className="border-t border-gray-100 p-4 bg-gray-50">
                          {/* Dates et informations */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <p className="text-xs text-green-600 font-medium mb-1">Postulé le</p>
                              <p className="text-xs font-semibold text-green-900">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                {formatDate(application.createdAt)}
                              </p>
                            </div>

                            <div className="p-2 bg-blue-50 rounded-lg">
                              <p className="text-xs text-blue-600 font-medium mb-1">Jours écoulés</p>
                              <p className="text-xs font-bold text-blue-900">
                                <FontAwesomeIcon icon={faClock} className="mr-1" />
                                {application.daysSinceApplication || 0} jours
                              </p>
                            </div>
                          </div>

                          {/* Analyse IA */}
                          {application.aiAnalysis && (
                            <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                              <div className="flex items-center mb-2">
                                <FontAwesomeIcon icon={faChartLine} className="text-indigo-600 mr-2" />
                                <h4 className="font-bold text-gray-900 text-sm">Analyse de compatibilité</h4>
                              </div>

                              {/* Détails des scores */}
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                <div className="text-xs">
                                  <p className="text-gray-600">Compétences</p>
                                  <p className="font-bold text-indigo-600">
                                    {application.skillMatchPercentage}%
                                  </p>
                                </div>
                                <div className="text-xs">
                                  <p className="text-gray-600">Expérience</p>
                                  <p className="font-bold text-indigo-600">
                                    {application.experienceMatchPercentage}%
                                  </p>
                                </div>
                                <div className="text-xs">
                                  <p className="text-gray-600">Localisation</p>
                                  <p className="font-bold text-indigo-600">
                                    {application.locationCompatibilityScore}%
                                  </p>
                                </div>
                              </div>

                              {/* Forces et Faiblesses */}
                              {(application.aiStrengths?.length > 0 || application.aiWeaknesses?.length > 0) && (
                                <div className="grid grid-cols-1 gap-2 text-xs mb-2">
                                  {application.aiStrengths?.length > 0 && (
                                    <div className="flex items-start">
                                      <FontAwesomeIcon icon={faThumbsUp} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="font-semibold text-gray-700">Forces:</p>
                                        <ul className="text-gray-600">
                                          {application.aiStrengths.map((s, i) => (
                                            <li key={i}>• {s}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                  {application.aiWeaknesses?.length > 0 && (
                                    <div className="flex items-start">
                                      <FontAwesomeIcon icon={faThumbsDown} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="font-semibold text-gray-700">À améliorer:</p>
                                        <ul className="text-gray-600">
                                          {application.aiWeaknesses.map((w, i) => (
                                            <li key={i}>• {w}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Recommandation */}
                              {application.aiRecommendation && (
                                <div className="p-2 bg-white rounded border border-indigo-200">
                                  <p className="text-xs font-semibold text-gray-700 flex items-center mb-1">
                                    <FontAwesomeIcon icon={faLightbulb} className="text-yellow-600 mr-2" />
                                    Recommandation
                                  </p>
                                  <p className="text-xs text-gray-600">{application.aiRecommendation}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link
                              to={`/consultations/${application.consultationId}`}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition duration-200"
                            >
                              <FontAwesomeIcon icon={faEye} className="mr-2" />
                              Voir la consultation
                            </Link>
                          </div>
                        </div>
                      )}
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
            {loading ? (
              <LoadingSpinner variant="inline" size="lg" text="Chargement des offres..." />
            ) : recentOffers.length > 0 ? (
              <div className="space-y-4">
                {recentOffers.map((offer) => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 flex-1">{offer.title}</h3>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${getOfferTypeColor(offer.offer_type)}`}>
                        <i className={`${getOfferTypeIcon(offer.offer_type)} mr-1`}></i>
                        {offer.offer_type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{offer.description}</p>
                    
                    <div className="space-y-1 mb-3">
                      {offer.budget && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Budget:</span> {formatAmount(offer.budget)}
                        </div>
                      )}
                      
                      {offer.deadline && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Date limite:</span> {formatDate(offer.deadline)}
                        </div>
                      )}

                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500">
                        Publié le {formatDate(offer.created_at)}
                      </div>
                      <Link
                        to={`/consultation/${offer.id}`}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                      >
                        Voir détails →
                      </Link>
                    </div>
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