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
  faMoneyBillWave
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import financementCandidatureService from '../../services/FinancementCandidatureService';

const FinancementCandidature = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des candidatures...</p>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="space-y-6">
          {applications && applications.length > 0 ? (
            applications.map((candidature) => {
              const offer = candidature.funding_offer;
              const application = candidature.application;
              const candidate = candidature.candidate_profile;
              const aiAnalysis = candidature.ai_analysis;
              
              const isUrgentOffer = isUrgent(offer?.closing_date);
              const daysUntilClosing = getDaysUntilClosing(offer?.closing_date);
              
              return (
                <div key={candidature.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    {/* En-tête de la candidature */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="p-3 bg-fuchsia-100 rounded-lg">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-fuchsia-600 text-xl" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {offer?.title || 'Titre non disponible'}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center">
                                <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                                {offer?.recruiter?.company_name || 'Entreprise non spécifiée'}
                              </span>
                              
                              <span className="flex items-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                                {offer?.geographic_zone || offer?.region?.name || 'Localisation non spécifiée'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Statut uniquement */}
                      <div className="flex flex-col items-end gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${financementCandidatureService.getStatusColor(application?.status)}`}>
                          {financementCandidatureService.getStatusText(application?.status)}
                        </span>
                      </div>
                    </div>

                    {/* Détails essentiels uniquement */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Montant demandé</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatAmount(candidature.requested_amount)}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Taux d'intérêt</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {offer?.annual_interest_rate ? `${offer.annual_interest_rate}%` : 'N/A'}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Date de candidature</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(application?.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Analyse IA */}
                    {aiAnalysis && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-lg font-semibold text-blue-900 flex items-center">
                            <FontAwesomeIcon icon={faStar} className="mr-2 text-blue-600" />
                            Analyse IA
                          </h4>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {aiAnalysis.score?.toFixed(1)}%
                            </div>
                            <div className="text-sm text-blue-700">Score de compatibilité</div>
                          </div>
                        </div>
                        
                        {aiAnalysis.factors && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-800">
                                {aiAnalysis.factors.experience_match || 0}%
                              </div>
                              <div className="text-sm text-blue-700">Expérience</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-800">
                                {aiAnalysis.factors.skills_match || 0}%
                              </div>
                              <div className="text-sm text-blue-700">Compétences</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-semibold text-blue-800">
                                {aiAnalysis.factors.motivation_score || 0}%
                              </div>
                              <div className="text-sm text-blue-700">Motivation</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Informations de candidature */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Date de candidature</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(application?.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Actions simplifiées */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                      <Link
                        to={`/public/detail-financement/${offer?.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        Voir l'offre
                      </Link>
                      
                      <Link
                        to={`/candidat/candidature-financement/${candidature.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-fuchsia-600 text-white text-sm font-medium rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                      >
                        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                        Voir ma candidature
                      </Link>
                    </div>
                  </div>
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
      </div>
    </div>
  );
};

export default FinancementCandidature;
