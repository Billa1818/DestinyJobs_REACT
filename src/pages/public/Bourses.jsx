import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';
import BoursePagination from '../../components/BoursePagination';
import bourseService from '../../services/bourseService';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';

const Bourses = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // États pour l'API
  const [bourses, setBourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 20
  });

  const [apiFilters, setApiFilters] = useState({
    query: '',
    required_level: '',
    geographic_zone: '',
    scholarship_type: '',
    study_domain: '',
    organization_type: '',
    amount_min: '',
    amount_max: '',
    full_funding: null,
    partial_funding: null,
    accommodation_included: null,
    travel_expenses_included: null,
    sort_by: 'post_date',
    sort_order: 'desc'
  });

  // Charger les bourses depuis l'API
  const loadBourses = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await bourseService.getPublicScholarships(filters, page, pagination.pageSize);
      
      // Formater les données de l'API
      const formattedBourses = (response.results || []).map(formatBourseData);
      setBourses(formattedBourses);
      
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        totalCount: response.count
      }));
    } catch (err) {
      console.error('Erreur lors du chargement des bourses:', err);
      setError('Erreur lors du chargement des bourses');
      setBourses([]);
    } finally {
      setLoading(false);
    }
  };

  // Formater les données de l'API
  const formatBourseData = (apiBourse) => {
    return {
      id: apiBourse.id,
      title: apiBourse.title || 'Titre non disponible',
      institution: apiBourse.organization_name || apiBourse.recruiter?.company_name || 'Institution non spécifiée',
      location: apiBourse.geographic_zone || apiBourse.recruiter?.region?.name || null,
      level: apiBourse.required_level || 'Niveau non spécifié',
      amount: apiBourse.scholarship_amount 
        ? `${apiBourse.scholarship_amount.toLocaleString()} FCFA/an`
        : 'Montant non spécifié',
      duration: apiBourse.duration || 'Durée non spécifiée',
      postedDate: apiBourse.post_date ? new Date(apiBourse.post_date).toLocaleDateString('fr-FR') : null,
      deadline: apiBourse.application_deadline 
        ? new Date(apiBourse.application_deadline).toLocaleDateString('fr-FR') 
        : null,
      description: apiBourse.description || 'Description non disponible',
      logo: (() => {
        // Essayer plusieurs sources pour le logo
        if (apiBourse.logo) {
          return apiBourse.logo.startsWith('http') ? apiBourse.logo : `http://localhost:8000${apiBourse.logo}`;
        }
        if (apiBourse.recruiter?.logo) {
          return apiBourse.recruiter.logo.startsWith('http') ? apiBourse.recruiter.logo : `http://localhost:8000${apiBourse.recruiter.logo}`;
        }
        if (apiBourse.organization_logo) {
          return apiBourse.organization_logo.startsWith('http') ? apiBourse.organization_logo : `http://localhost:8000${apiBourse.organization_logo}`;
        }
        // Fallback vers une image par défaut
        return "https://via.placeholder.com/60x60/6366f1/ffffff?text=B";
      })(),
      
      // Attributs supplémentaires de l'API
      scholarship_type: apiBourse.scholarship_type?.name || null,
      study_domain: apiBourse.study_domain?.name || null,
      organization_type: apiBourse.organization_type?.name || null,
      full_funding: apiBourse.full_funding || false,
      partial_funding: apiBourse.partial_funding || false,
      accommodation_included: apiBourse.accommodation_included || false,
      travel_expenses_included: apiBourse.travel_expenses_included || false,
      views_count: apiBourse.views_count || 0,
      applications_count: apiBourse.applications_count || 0
    };
  };

  // Charger les bourses au montage du composant
  useEffect(() => {
    loadBourses(1, apiFilters);
  }, []);

  // Mettre à jour les filtres API quand les filtres locaux changent
  useEffect(() => {
    const newApiFilters = {
      ...apiFilters,
      query: searchTerm,
      required_level: selectedLevel,
      geographic_zone: selectedLocation
    };
    
    setApiFilters(newApiFilters);
    
    // Recharger avec les nouveaux filtres (sans recherche automatique)
    if (selectedLevel || selectedLocation) {
      loadBourses(1, newApiFilters);
    }
  }, [selectedLevel, selectedLocation]);

  // Détecter quand la zone de recherche est vidée
  useEffect(() => {
    // Si la zone de recherche est vide et qu'il y avait une recherche active
    if (searchTerm === '' && apiFilters.query) {
      const newApiFilters = {
        ...apiFilters,
        query: '',
        required_level: selectedLevel,
        geographic_zone: selectedLocation
      };
      
      setApiFilters(newApiFilters);
      // Recharger toutes les données sans recherche
      loadBourses(1, newApiFilters);
    }
  }, [searchTerm]);

  // Gestion du changement de page
  const handlePageChange = (page) => {
    loadBourses(page, apiFilters);
  };

  // Gestion du changement de taille de page
  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize }));
    loadBourses(1, apiFilters);
  };

  // Fonction de recherche manuelle
  const handleSearch = () => {
    const newApiFilters = {
      ...apiFilters,
      query: searchTerm,
      required_level: selectedLevel,
      geographic_zone: selectedLocation
    };
    
    setApiFilters(newApiFilters);
    loadBourses(1, newApiFilters);
  };

  const levels = [
    { value: '', label: 'Tous les niveaux' },
    { value: 'Licence', label: 'Licence' },
    { value: 'Master', label: 'Master' },
    { value: 'Doctorat', label: 'Doctorat' },
    { value: 'Ingénieur', label: 'Ingénieur' },
    { value: 'Formation', label: 'Formation continue' }
  ];

  const locations = [
    { value: '', label: 'Tous les lieux' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Parakou', label: 'Parakou' },
    { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
    { value: 'Kétou', label: 'Kétou' },
    { value: 'Porto-Novo', label: 'Porto-Novo' }
  ];

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  const filteredBourses = bourses.filter(bourse => {
    const matchesSearch = bourse.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bourse.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bourse.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || bourse.level === selectedLevel;
    const matchesLocation = !selectedLocation || bourse.location.includes(selectedLocation);
    
    return matchesSearch && matchesLevel && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile-First */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              <i className="fas fa-graduation-cap text-fuchsia-600 mr-2 sm:mr-3"></i>
              Bourses d'études
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Découvrez des opportunités de bourses d'études pour poursuivre votre formation. 
              Trouvez des financements adaptés à votre niveau et domaine d'études.
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
                  placeholder="Rechercher une bourse, une institution..."
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
            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Tous niveaux</option>
              <option value="Licence">Licence</option>
              <option value="Master">Master</option>
              <option value="Doctorat">Doctorat</option>
              <option value="Ingénieur">Ingénieur</option>
              <option value="Formation">Formation continue</option>
            </select>
            
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Tous lieux</option>
              <option value="Cotonou">Cotonou</option>
              <option value="Parakou">Parakou</option>
              <option value="Abomey-Calavi">Abomey-Calavi</option>
              <option value="Kétou">Kétou</option>
              <option value="Porto-Novo">Porto-Novo</option>
            </select>

            {/* Sort Filter */}
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white">
              <option>Plus récents</option>
              <option>Montant élevé</option>
              <option>Durée courte</option>
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
                  Bourses disponibles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.totalCount} bourse{pagination.totalCount !== 1 ? 's' : ''} trouvée{pagination.totalCount !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Desktop Sort - Hidden on Mobile */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-500">Trier par :</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500">
                  <option>Plus récents</option>
                  <option>Montant élevé</option>
                  <option>Durée courte</option>
                </select>
              </div>
            </div>

            {/* Bourses List */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
                <p className="text-gray-600 text-sm mb-4">{error}</p>
                <button 
                  onClick={() => loadBourses(1, apiFilters)}
                  className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm"
                >
                  Réessayer
                </button>
              </div>
            ) : bourses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune bourse trouvée</h3>
                <p className="text-gray-600 text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bourses.map((bourse) => (
                  <div key={bourse.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
                    {/* Bourse Card Header */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Institution Logo */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                            <i className="fas fa-graduation-cap text-white text-lg sm:text-xl"></i>
                          </div>
                        </div>
                        
                        {/* Bourse Content */}
                        <div className="flex-1 min-w-0">
                          {/* Bourse Title */}
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors duration-200">
                            <Link to={`/bourses/${bourse.id}`} className="hover:text-fuchsia-600">
                              {bourse.title}
                            </Link>
                          </h3>
                          
                          {/* Institution & Location */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mb-3">
                            <span className="flex items-center text-sm text-gray-600">
                              <i className="fas fa-building mr-2 text-fuchsia-500"></i>
                              {bourse.institution}
                            </span>
                            {bourse.location && (
                              <span className="flex items-center text-sm text-gray-600">
                                <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                                {bourse.location}
                              </span>
                            )}
                          </div>
                          
                          {/* Bourse Description - Une seule ligne */}
                          <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-1">
                            {bourse.description}
                          </p>
                          
                          {/* Tags Row */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200">
                              {bourse.amount}
                            </span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-200">
                              {bourse.duration}
                            </span>
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium border border-green-200">
                              {bourse.level}
                            </span>
                            {bourse.full_funding && (
                              <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-medium border border-yellow-200">
                                <i className="fas fa-star mr-1"></i>
                                Financement complet
                              </span>
                            )}
                            {bourse.accommodation_included && (
                              <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg text-xs font-medium border border-indigo-200">
                                <i className="fas fa-bed mr-1"></i>
                                Hébergement inclus
                              </span>
                            )}
                            {bourse.travel_expenses_included && (
                              <span className="bg-pink-50 text-pink-700 px-2 py-1 rounded-lg text-xs font-medium border border-pink-200">
                                <i className="fas fa-plane mr-1"></i>
                                Frais de voyage inclus
                              </span>
                            )}
                          </div>

                          {/* Meta Information */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            {/* Left Side - Date & Applications */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {bourse.postedDate && (
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-1"></i>
                                  {bourse.postedDate}
                                </span>
                              )}
                              {bourse.applications_count > 0 && (
                                <span className="flex items-center">
                                  <i className="fas fa-users mr-1"></i>
                                  {bourse.applications_count} candidature{bourse.applications_count !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>

                            {/* Right Side - Deadline & Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              {bourse.deadline && (
                                <span className="text-xs text-red-600 font-medium flex items-center">
                                  <i className="fas fa-clock mr-1"></i>
                                  Limite : {bourse.deadline}
                                </span>
                              )}
                              <Link 
                                to={`/bourses/${bourse.id}`}
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
                <BoursePagination
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
                  Parcourez nos bourses d'études et trouvez le financement idéal pour votre formation
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
                  Vous cherchez une bourse ?
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-fuchsia-100 mb-6 opacity-90 px-2">
                  Rejoignez notre plateforme et trouvez la bourse idéale pour vos études
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

export default Bourses; 