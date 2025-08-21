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
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import EmploiCandidatureRecentService from '../../services/EmploiCandidatureRecentService';
import Loader from '../../components/Loader';

const EmploiCandidature = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [successMessage, setSuccessMessage] = useState('');

  // Charger les candidatures
  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Chargement des candidatures...');
      const response = await EmploiCandidatureRecentService.getJobApplications(filters);
      
      console.log('✅ Candidatures chargées:', response);
      setApplications(response.applications || []);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      setError(`Erreur lors du chargement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Charger les candidatures au montage du composant
  useEffect(() => {
    loadApplications();
  }, []);

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

  // Afficher le loader
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mes candidatures</h1>
            <p className="text-gray-600">Suivez l'état de vos candidatures aux offres d'emploi</p>
          </div>
          <Link 
            to="/candidat/offre"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />Nouvelle candidature
          </Link>
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
      {applications && applications.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FontAwesomeIcon icon={faList} className="text-blue-600 text-lg" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
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
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Rechercher par titre d'offre ou entreprise..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
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
        </div>
      </div>

      {/* Liste des candidatures */}
      {filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    {/* Logo de l'entreprise */}
                    <div className="flex-shrink-0">
                      {application.job_offer?.recruiter?.logo ? (
                        <img
                          src={application.job_offer.recruiter.logo}
                          alt={`Logo ${application.job_offer.recruiter.company_name}`}
                          className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                          <FontAwesomeIcon icon={faBuilding} className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </div>

                    {/* Détails de l'offre */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {application.job_offer?.title || 'Titre non disponible'}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.application?.status)}`}>
                          {getStatusText(application.application?.status)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2">
                        <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-400" />
                        {application.job_offer?.recruiter?.company_name || 'Entreprise non spécifiée'}
                      </p>
                      
                      {/* Informations essentielles de l'offre */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-gray-400" />
                          <span className="truncate">
                            {application.job_offer?.location || 'Localisation non spécifiée'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FontAwesomeIcon icon={faBriefcase} className="mr-2 text-gray-400" />
                          <span className="truncate">
                            {application.job_offer?.contract_type || 'Type non spécifié'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FontAwesomeIcon icon={faUser} className="mr-2 text-gray-400" />
                          <span className="truncate">
                            {application.job_offer?.experience_required || 'Expérience non spécifiée'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-400" />
                          <span className="truncate">
                            {application.job_offer?.work_mode || 'Mode non spécifié'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Salaire et autres détails */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                          <span>
                            Postulé le {formatDate(application.application?.created_at)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Date de clôture et urgence */}
                      {application.job_offer?.application_deadline && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <FontAwesomeIcon icon={faHourglassHalf} className="mr-2 text-gray-400" />
                          <span className={application.job_offer?.is_urgent_closing ? 'text-red-600 font-medium' : ''}>
                            Clôture le {formatDate(application.job_offer.application_deadline)}
                            {application.job_offer?.is_urgent_closing && ' (URGENT)'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Actions simplifiées */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-4">
                  <Link
                    to={`/candidat/detail-offre/${application.job_offer?.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-700 bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Voir l'offre
                  </Link>
                  
                  <Link
                    to={`/candidat/candidature-emploi/${application.application?.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-fuchsia-600 text-white text-sm font-medium rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                  >
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                    Voir ma candidature
                  </Link>
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default EmploiCandidature; 