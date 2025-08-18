import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';
import JobPagination from '../../components/JobPagination';
import jobService from '../../services/jobService';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';

const Jobs = () => {
  // États existants conservés
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Contexte d'authentification
  const { isAuthenticated, user } = useAuth();

  // Nouveaux états pour l'API
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20
  });

  // États pour les filtres API
  const [apiFilters, setApiFilters] = useState({
    query: '',
    contract_type: '',
    location: '',
    department: '',
    category: '',
    experience_required: '',
    work_mode: '',
    salary_min: '',
    salary_max: '',
    is_urgent: false,
    is_sponsored: false,
    sort_by: 'post_date',
    sort_order: 'desc'
  });

  // Charger les offres d'emploi depuis l'API
  const loadJobs = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await jobService.getPublicJobOffers(filters, page, pagination.pageSize);
      
      setJobs(response.results || []);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        totalCount: response.count
      }));
    } catch (err) {
      console.error('Erreur lors du chargement des offres:', err);
      setError('Erreur lors du chargement des offres d\'emploi');
      setJobs([]); // Aucune donnée simulée
    } finally {
      setLoading(false);
    }
  };

  // Charger les offres au montage du composant
  useEffect(() => {
    loadJobs(1, apiFilters);
  }, []);

  // Mettre à jour les filtres API quand les filtres locaux changent
  useEffect(() => {
    const newApiFilters = {
      ...apiFilters,
      contract_type: selectedContract,
      location: selectedLocation
    };
    
    setApiFilters(newApiFilters);
    
    // Recharger avec les nouveaux filtres (sans recherche automatique)
    if (selectedContract || selectedLocation) {
      loadJobs(1, newApiFilters);
    }
  }, [selectedContract, selectedLocation]);

  // Détecter quand la zone de recherche est vidée
  useEffect(() => {
    // Si la zone de recherche est vide et qu'il y avait une recherche active
    if (searchTerm === '' && apiFilters.query) {
      const newApiFilters = {
        ...apiFilters,
        query: '',
        contract_type: selectedContract,
        location: selectedLocation
      };
      
      setApiFilters(newApiFilters);
      // Recharger toutes les données sans recherche
      loadJobs(1, newApiFilters);
    }
  }, [searchTerm]);

  // Fonction de recherche manuelle
  const handleSearch = () => {
    const newApiFilters = {
      ...apiFilters,
      query: searchTerm,
      contract_type: selectedContract,
      location: selectedLocation
    };
    
    setApiFilters(newApiFilters);
    loadJobs(1, newApiFilters);
  };

  // Gestion du changement de page
  const handlePageChange = (page) => {
    loadJobs(page, apiFilters);
  };

  // Gestion du changement de taille de page
  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize }));
    loadJobs(1, apiFilters);
  };

  // Gestion des filtres du sidebar (conservée)
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
    
    // Appliquer les filtres du sidebar à l'API
    const newApiFilters = {
      ...apiFilters,
      ...filters
    };
    setApiFilters(newApiFilters);
    loadJobs(1, newApiFilters);
  };

  // Fonction pour formater les données de l'API
  const formatJobData = (apiJob) => {
    return {
      id: apiJob.id,
      title: apiJob.title || apiJob.position_name || 'Titre non disponible',
      company: apiJob.recruiter?.company_name || 'Entreprise non spécifiée',
      location: apiJob.location || 'Localisation non spécifiée',
      contract: apiJob.contract_type || 'Type non spécifié',
      salary: apiJob.salary_min && apiJob.salary_max 
        ? `${apiJob.salary_min.toLocaleString()} - ${apiJob.salary_max.toLocaleString()} FCFA`
        : apiJob.salary_min 
          ? `À partir de ${apiJob.salary_min.toLocaleString()} FCFA`
          : 'Salaire non spécifié',
      experience: apiJob.experience_required || 'Expérience non spécifiée',
      postedDate: apiJob.post_date ? new Date(apiJob.post_date).toLocaleDateString('fr-FR') : null,
      deadline: apiJob.application_deadline || apiJob.closing_date 
        ? new Date(apiJob.application_deadline || apiJob.closing_date).toLocaleDateString('fr-FR') 
        : null,
      description: apiJob.description || 'Description non disponible',
      logo: apiJob.recruiter?.logo 
        ? (apiJob.recruiter.logo.startsWith('http') 
            ? apiJob.recruiter.logo 
            : `http://localhost:8000${apiJob.recruiter.logo}`)
        : "https://via.placeholder.com/60x60",
      // Données supplémentaires de l'API
      views_count: apiJob.views_count || 0,
      applications_count: apiJob.applications_count || 0,
      is_urgent: apiJob.is_urgent || false,
      is_sponsored: apiJob.is_sponsored || false,
      work_mode: apiJob.work_mode || null
    };
  };

  // Utiliser les données formatées de l'API
  const displayJobs = jobs.map(formatJobData);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader size="lg" text="Chargement des offres d'emploi..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-red-600 text-4xl mb-4">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => loadJobs(1, apiFilters)}
          className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile-First */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              <i className="fas fa-briefcase text-fuchsia-600 mr-2 sm:mr-3"></i>
            Offres d'emploi
          </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
            Découvrez des opportunités d'emploi dans divers secteurs. 
            Trouvez le poste qui correspond à vos compétences et aspirations.
          </p>
        </div>
      </div>
        </div>

      {/* Search Bar Mobile-First */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
                <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                  placeholder="Rechercher un emploi, une entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm sm:text-base"
                  />
                </div>
              </div>
              
            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-fuchsia-600 text-white px-6 py-3 rounded-xl hover:bg-fuchsia-700 transition duration-200 font-medium flex items-center justify-center text-sm sm:text-base"
            >
              <i className="fas fa-search mr-2"></i>
              Rechercher
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filters Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8 lg:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {/* Contract Filter */}
                <select
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Tous contrats</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="STAGE">Stage</option>
              <option value="ALTERNANCE">Alternance</option>
              <option value="FREELANCE">Freelance</option>
              <option value="INTERIM">Intérim</option>
                </select>
              
              {/* Location Filter */}
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Tous lieux</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Kaolack">Kaolack</option>
              <option value="Ziguinchor">Ziguinchor</option>
              <option value="Touba">Touba</option>
            </select>

            {/* Sort Filter */}
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white">
              <option>Plus récents</option>
              <option>Salaire élevé</option>
              <option>Expérience requise</option>
                </select>
              </div>
            </div>
          </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar - Hidden on Mobile */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="sticky top-6">
              <SidebarFilter 
                onFilterChange={handleFilterChange}
                activeFilters={activeFilters}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Emplois disponibles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.totalCount} offre{pagination.totalCount !== 1 ? 's' : ''} trouvée{pagination.totalCount !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Desktop Sort - Hidden on Mobile */}
              <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Trier par :</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                    <option>Plus récents</option>
                    <option>Salaire élevé</option>
                    <option>Expérience requise</option>
                  </select>
                </div>
              </div>

            {/* Jobs List */}
            {displayJobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun emploi trouvé</h3>
                <p className="text-gray-600 text-sm">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                <div className="space-y-4">
                {displayJobs.map((job) => (
                  <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
                    {/* Job Card Header */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Company Logo */}
                        <div className="flex-shrink-0">
                          {job.logo ? (
                            <img 
                              src={job.logo} 
                              alt={job.company} 
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200 bg-white" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback logo si pas d'image ou erreur */}
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center ${job.logo ? 'hidden' : 'flex'}`}>
                            <i className="fas fa-building text-white text-lg sm:text-xl"></i>
                          </div>
                        </div>
                        
                        {/* Job Content */}
                        <div className="flex-1 min-w-0">
                          {/* Job Title */}
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors duration-200">
                            <Link to={`/jobs/${job.id}`} className="hover:text-fuchsia-600">
                                  {job.title}
                                </Link>
                              </h3>
                              
                          {/* Company & Location */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mb-3">
                            <span className="flex items-center text-sm text-gray-600">
                              <i className="fas fa-building mr-2 text-fuchsia-500"></i>
                                  {job.company}
                                </span>
                            <span className="flex items-center text-sm text-gray-600">
                              <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                                  {job.location}
                                </span>
                          </div>
                          
                          {/* Job Description - Une seule ligne */}
                          <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-1">
                            {job.description}
                          </p>
                          
                          {/* Tags Row */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-200">
                              {job.salary}
                            </span>
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium border border-green-200">
                              {job.contract}
                            </span>
                            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-lg text-xs font-medium border border-orange-200">
                              {job.experience}
                            </span>
                            {job.is_urgent && (
                              <span className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium border border-red-200">
                                <i className="fas fa-exclamation-triangle mr-1"></i>Urgent
                              </span>
                            )}
                            {job.work_mode && (
                              <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-medium border border-indigo-200">
                                <i className="fas fa-laptop mr-1"></i>{job.work_mode}
                              </span>
                            )}
                          </div>

                          {/* Meta Information */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            {/* Left Side - Date & Applications */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {job.postedDate && (
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-1"></i>
                                  {job.postedDate}
                                </span>
                              )}
                              {job.applications_count > 0 && (
                                <span className="flex items-center">
                                  <i className="fas fa-users mr-1"></i>
                                  {job.applications_count} candidature{job.applications_count !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            
                            {/* Right Side - Deadline & Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              {job.deadline && (
                                <span className="text-xs text-red-600 font-medium flex items-center">
                                <i className="fas fa-clock mr-1"></i>
                                Limite : {job.deadline}
                              </span>
                              )}
                              <Link 
                                to={`/jobs/${job.id}`}
                                className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm font-medium text-center"
                              >
                                Voir les détails
                              </Link>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <JobPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalCount={pagination.totalCount}
                  pageSize={pagination.pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
            </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section Mobile-First */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 mt-8">
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {isAuthenticated ? (
              // Utilisateur connecté
              <>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Bienvenue sur Destiny Jobs !
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-fuchsia-100 mb-6 opacity-90 px-2">
                  Parcourez nos offres d'emploi et postulez aux opportunités qui correspondent à votre profil
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link 
                    to="/candidat" 
                    className="bg-white text-fuchsia-600 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center"
                  >
                    <i className="fas fa-user mr-2"></i>
                    Mon espace candidat
                  </Link>
                  <Link 
                    to="/contact" 
                    className="border border-white text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Nous contacter
                  </Link>
                </div>
              </>
            ) : (
              // Utilisateur non connecté
              <>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Vous cherchez un emploi ?
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-fuchsia-100 mb-6 opacity-90 px-2">
          Rejoignez notre plateforme et trouvez l'emploi idéal pour votre carrière
        </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link 
            to="/signup" 
                    className="bg-white text-fuchsia-600 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center"
          >
                    <i className="fas fa-user-plus mr-2"></i>
            Créer un compte candidat
          </Link>
          <Link 
            to="/contact" 
                    className="border border-white text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center"
          >
                    <i className="fas fa-envelope mr-2"></i>
            Nous contacter
          </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs; 