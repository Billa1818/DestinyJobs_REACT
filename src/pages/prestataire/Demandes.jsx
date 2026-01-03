import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faEye,
  faMapMarkerAlt,
  faClock,
  faStar,
  faChartLine,
  faCalendarAlt,
  faUser,
  faBuilding,
  faBriefcase,
  faHourglassHalf,
  faList,
  faCheck,
  faLightbulb,
  faThumbsUp,
  faThumbsDown,
  faInbox,
  faSyncAlt,
  faTag,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import consultationDemandesService from '../../services/consultationDemandesService';
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

const Demandes = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  
  // États pour les filtres
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [ordering, setOrdering] = useState('-created_at');
  
  // États pour la pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  // Charger les demandes au montage du composant
  useEffect(() => {
    loadDemandes();
  }, []);

  // Charger les demandes depuis l'API
  const loadDemandes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des demandes...');
      const demandesData = await consultationDemandesService.getConsultationDemandes();
      
      console.log('✅ Demandes chargées:', demandesData);
      setDemandes(demandesData || []);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des demandes:', error);
      setError(`Erreur lors du chargement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour construire l'URL complète des images
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return buildImageUrl(imagePath);
  };

  // Filtrer les demandes
  const filteredDemandes = demandes.filter(demande => {
    const matchesSearch = !filters.search ||
      demande.consultation_offer?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      demande.application?.applicant?.first_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      demande.application?.applicant?.last_name?.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = !filters.status || demande.application?.status === filters.status;

    return matchesSearch && matchesStatus;
  });

  // Calculer les statistiques
  const stats = {
    total: demandes.length,
    pending: demandes.filter(d => d.application?.status === 'PENDING').length,
    shortlisted: demandes.filter(d => d.application?.status === 'SHORTLISTED').length,
    accepted: demandes.filter(d => d.application?.status === 'ACCEPTED').length
  };

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
      'WITHDRAWN': 'bg-gray-100 text-gray-800'
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
      'WITHDRAWN': 'Retirée'
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
    loadDemandes();
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({ search: '', status: '' });
    setOrdering('-created_at');
    setTimeout(() => loadDemandes(), 0);
  };

  // Marquer comme vue
  const markAsViewed = async (applicationId) => {
    try {
      await consultationDemandesService.markDemandeAsViewed(applicationId);
      setSuccessMessage('Demande marquée comme vue');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadDemandes();
    } catch (error) {
      console.error('❌ Erreur:', error);
      setError('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Demandes de consultation
            </h1>
            <p className="text-gray-600">Gérez les candidatures pour vos consultations</p>
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
      {!loading && demandes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FontAwesomeIcon icon={faList} className="text-blue-600 text-lg" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.shortlisted}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.accepted}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FontAwesomeIcon icon={faFilter} className="mr-3 text-orange-600" />
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
                  placeholder="Titre, candidat..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="SHORTLISTED">Pré-sélectionnée</option>
                <option value="ACCEPTED">Acceptée</option>
                <option value="REJECTED">Refusée</option>
                <option value="WITHDRAWN">Retirée</option>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-200 flex items-center font-medium"
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

      {/* Liste des demandes */}
      {loading ? (
        <div className="py-12">
          <LoadingSpinner variant="inline" size="lg" text="Chargement de vos demandes..." />
        </div>
      ) : filteredDemandes.length > 0 ? (
        <div className="space-y-4">
          {filteredDemandes.map((demande) => {
            const aiAnalysis = demande.ai_analysis;
            const compatibilityScore = aiAnalysis?.compatibility_score ? parseFloat(aiAnalysis.compatibility_score) : 0;
            const scoreColors = getScoreColor(compatibilityScore);
            const isExpanded = expandedId === demande.id;

            const applicant = demande.application?.applicant;
            const consultation = demande.consultation_offer;
            const candidateName = applicant ? `${applicant.first_name} ${applicant.last_name}` : 'Candidat inconnu';

            return (
              <div key={demande.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* En-tête */}
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    {/* Photo du candidat */}
                    <div className="flex-shrink-0">
                      {consultation.company_logo ? (
                        <img
                          src={getImageUrl(consultation.company_logo)}
                          alt={candidateName}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <FontAwesomeIcon icon={faUser} className="text-gray-400 text-2xl" />
                        </div>
                      )}
                    </div>

                    {/* Titre et Badges */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {consultation?.title || 'Titre non disponible'}
                      </h3>

                      {/* Badges de statut et score */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(demande.application?.status)}`}>
                          {getStatusText(demande.application?.status)}
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
                        {consultation?.region?.name || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 font-medium mb-1">Secteur</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faGlobe} className="mr-2 text-gray-400" />
                        {consultation?.company_details?.sector || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 font-medium mb-1">Entreprise</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center">
                        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-400" />
                        {consultation?.company_details?.company_name || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Bouton pour afficher plus */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : demande.id)}
                    className="w-full py-2 text-orange-600 font-semibold hover:bg-orange-50 rounded transition duration-200 flex items-center justify-center"
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
                    {/* Dates et informations */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-green-600 font-medium mb-1">Postulé le</p>
                        <p className="text-sm font-semibold text-green-900">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                          {formatDate(demande.application?.created_at)}
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium mb-1">Jours écoulés</p>
                        <p className="text-sm font-bold text-blue-900">
                          <FontAwesomeIcon icon={faClock} className="mr-2" />
                          {demande.application?.days_since_application || 0} jours
                        </p>
                      </div>

                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium mb-1">Statut</p>
                        <p className="text-sm font-semibold text-purple-900">
                          {demande.application?.viewed_at ? 'Vue' : 'Non vue'}
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
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/consultations/${consultation?.id}`)}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Voir la consultation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faInbox} className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune demande trouvée</h3>
          <p className="text-gray-500 mb-6">
            {demandes.length === 0
              ? "Vous n'avez pas encore reçu de demandes de consultation."
              : "Aucune demande ne correspond à vos critères de recherche."
            }
          </p>
          </div>
          )}
          </div>
          );
          };
          
          export default Demandes;