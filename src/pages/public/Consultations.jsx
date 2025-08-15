import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';
import ConsultationPagination from '../../components/ConsultationPagination';
import consultationService from '../../services/consultationService';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';

const Consultations = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // États pour l'API
  const [consultations, setConsultations] = useState([]);
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
    consultation_type: '',
    expertise_sector: '',
    delivery_mode: '',
    pricing_type: '',
    price_min: '',
    price_max: '',
    client_type: '',
    is_urgent: null,
    country: '',
    region: '',
    sort_by: 'post_date',
    sort_order: 'desc'
  });

  // Fonction pour charger les consultations depuis l'API
  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await consultationService.getPublicConsultationOffers(
        apiFilters,
        pagination.currentPage,
        pagination.pageSize
      );
      
      const formattedConsultations = response.results.map(apiConsultation => 
        formatConsultationData(apiConsultation)
      );
      
      setConsultations(formattedConsultations);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        totalCount: response.count
      }));
    } catch (err) {
      console.error('Erreur lors du chargement des consultations:', err);
      setError('Erreur lors du chargement des consultations');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater les données de l'API
  const formatConsultationData = (apiConsultation) => {
    return {
      id: apiConsultation.id,
      title: apiConsultation.title || 'Titre non spécifié',
      client: apiConsultation.recruiter?.company_name || 'Entreprise non spécifiée',
      location: apiConsultation.recruiter?.region?.name || apiConsultation.recruiter?.country?.name || null,
      category: apiConsultation.consultation_type?.name || 'Catégorie non spécifiée',
      budget: apiConsultation.price ? `${apiConsultation.price} FCFA` : 'Prix non spécifié',
      duration: apiConsultation.estimated_duration || 'Durée non spécifiée',
      experience: apiConsultation.required_experience_years ? `${apiConsultation.required_experience_years}+ ans` : 'Expérience non spécifiée',
      postedDate: apiConsultation.created_at ? new Date(apiConsultation.created_at).toLocaleDateString('fr-FR') : 'Date non spécifiée',
      deadline: apiConsultation.application_deadline ? new Date(apiConsultation.application_deadline).toLocaleDateString('fr-FR') : 'Date limite non spécifiée',
      description: apiConsultation.description || 'Description non disponible',
      logo: apiConsultation.recruiter?.logo ? 
        (apiConsultation.recruiter.logo.startsWith('http') ? apiConsultation.recruiter.logo : `http://localhost:8000${apiConsultation.recruiter.logo}`) : 
        null,
      deliveryMode: apiConsultation.delivery_mode || 'Mode non spécifié',
      pricingType: apiConsultation.pricing_type || 'Tarification non spécifiée',
      isUrgent: apiConsultation.is_urgent || false,
      clientType: apiConsultation.client_type || 'Type de client non spécifié',
      expertiseSector: apiConsultation.expertise_sector || 'Secteur non spécifié'
    };
  };

  // Gestionnaire de changement de page
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  // Gestionnaire de changement de taille de page
  const handlePageSizeChange = (pageSize) => {
    setPagination(prev => ({ ...prev, pageSize, currentPage: 1 }));
  };

  // Gestionnaire de recherche
  const handleSearch = () => {
    setApiFilters(prev => ({ ...prev, query: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Gestionnaire de changement de catégorie
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setApiFilters(prev => ({ 
      ...prev, 
      consultation_type: category || '',
      currentPage: 1 
    }));
  };

  // Gestionnaire de changement de localisation
  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setApiFilters(prev => ({ 
      ...prev, 
      region: location || '',
      currentPage: 1 
    }));
  };

  // Charger les consultations au montage et lors des changements de filtres
  useEffect(() => {
    loadConsultations();
  }, [pagination.currentPage, pagination.pageSize, apiFilters]);

  // Réinitialiser la recherche quand le terme de recherche est effacé
  useEffect(() => {
    if (!searchTerm) {
      setApiFilters(prev => ({ ...prev, query: '' }));
    }
  }, [searchTerm]);

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  // Filtrage des consultations basé sur l'état local (pour la recherche instantanée)
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = !searchTerm || 
      consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.client.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || consultation.category === selectedCategory;
    const matchesLocation = !selectedLocation || (consultation.location && consultation.location.includes(selectedLocation));
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadConsultations}
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
              <i className="fas fa-handshake text-fuchsia-600 mr-2 sm:mr-3"></i>
              Consultations
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Découvrez des opportunités de consultation et d'expertise dans divers domaines. 
              Trouvez des missions qui correspondent à vos compétences et à votre expérience.
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
                  placeholder="Rechercher une consultation, une entreprise..."
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
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Toutes catégories</option>
              <option value="Stratégie">Stratégie</option>
              <option value="Marketing">Marketing</option>
              <option value="RH">Ressources Humaines</option>
              <option value="Commerce">Commerce</option>
              <option value="Finance">Finance</option>
              <option value="Communication">Communication</option>
            </select>
            
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Tous lieux</option>
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Kaolack">Kaolack</option>
              <option value="Ziguinchor">Ziguinchor</option>
            </select>

            {/* Sort Filter */}
            <select 
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('_');
                setApiFilters(prev => ({ ...prev, sort_by: sortBy, sort_order: sortOrder }));
              }}
            >
              <option value="post_date_desc">Plus récentes</option>
              <option value="post_date_asc">Plus anciennes</option>
              <option value="price_desc">Prix élevé</option>
              <option value="price_asc">Prix bas</option>
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
                  Consultations disponibles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.totalCount} consultation{pagination.totalCount !== 1 ? 's' : ''} trouvée{pagination.totalCount !== 1 ? 's' : ''}
                </p>
              </div>
              
              {/* Desktop Sort - Hidden on Mobile */}
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-500">Trier par :</span>
                <select 
                  className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('_');
                    setApiFilters(prev => ({ ...prev, sort_by: sortBy, sort_order: sortOrder }));
                  }}
                >
                  <option value="post_date_desc">Plus récentes</option>
                  <option value="post_date_asc">Plus anciennes</option>
                  <option value="price_desc">Prix élevé</option>
                  <option value="price_asc">Prix bas</option>
                </select>
              </div>
            </div>

            {/* Consultations List */}
            {filteredConsultations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune consultation trouvée</h3>
                <p className="text-gray-600 text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConsultations.map((consultation) => (
                  <div key={consultation.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
                    {/* Consultation Card Header */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Client Logo */}
                        <div className="flex-shrink-0">
                          {consultation.logo ? (
                            <img 
                              src={consultation.logo} 
                              alt={consultation.client} 
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200 bg-white" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback logo si pas d'image ou erreur */}
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-md ${consultation.logo ? 'hidden' : 'flex'}`}>
                            <i className="fas fa-handshake text-white text-lg sm:text-xl"></i>
                          </div>
                        </div>
                        
                        {/* Consultation Content */}
                        <div className="flex-1 min-w-0">
                          {/* Consultation Title */}
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors duration-200">
                            <Link to={`/consultations/${consultation.id}`} className="hover:text-fuchsia-600">
                              {consultation.title}
                            </Link>
                          </h3>
                          
                          {/* Client & Location */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mb-3">
                            <span className="flex items-center text-sm text-gray-600">
                              <i className="fas fa-building mr-2 text-fuchsia-500"></i>
                              {consultation.client}
                            </span>
                            {consultation.location && (
                              <span className="flex items-center text-sm text-gray-600">
                                <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                                {consultation.location}
                              </span>
                            )}
                          </div>
                          
                          {/* Consultation Description - Une seule ligne */}
                          <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-1">
                            {consultation.description}
                          </p>
                          
                          {/* Tags Row */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-fuchsia-50 text-fuchsia-700 px-2 py-1 rounded-lg text-xs font-medium border border-fuchsia-200">
                              {consultation.budget}
                            </span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-200">
                              {consultation.duration}
                            </span>
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium border border-green-200">
                              {consultation.experience}
                            </span>
                            <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-lg text-xs font-medium border border-orange-200">
                              {consultation.category}
                            </span>
                            {consultation.isUrgent && (
                              <span className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium border border-red-200">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                Urgent
                              </span>
                            )}
                          </div>

                          {/* Meta Information */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            {/* Left Side - Date */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <i className="fas fa-calendar mr-1"></i>
                                {consultation.postedDate}
                              </span>
                            </div>

                            {/* Right Side - Deadline & Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              {consultation.deadline && (
                                <span className="text-xs text-red-600 font-medium flex items-center">
                                  <i className="fas fa-clock mr-1"></i>
                                  Limite : {consultation.deadline}
                                </span>
                              )}
                              <Link 
                                to={`/consultations/${consultation.id}`}
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
                <ConsultationPagination
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4">
              Vous êtes consultant ?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-fuchsia-100 mb-6 opacity-90 px-2">
              Rejoignez notre plateforme et trouvez des missions qui correspondent à vos compétences
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              {isAuthenticated ? (
                <Link 
                  to="/prestataire/home" 
                  className="bg-white text-fuchsia-600 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center"
                >
                  Mon espace prestataire
                </Link>
              ) : (
                <Link 
                  to="/signup" 
                  className="bg-white text-fuchsia-600 px-4 sm:px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center"
                >
                  Créer un compte consultant
                </Link>
              )}
              <Link 
                to="/contact" 
                className="border border-white text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium text-sm sm:text-base flex items-center justify-center"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultations; 