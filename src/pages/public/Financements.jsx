import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';
import FinancementPagination from '../../components/FinancementPagination';
import financementService from '../../services/financementService';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';

const Financements = () => {
  // États existants conservés
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Nouveaux états pour l'API
  const [financements, setFinancements] = useState([]);
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
    sector: '',
    target: '',
    min_amount: '',
    max_amount: '',
    no_guarantee: null,
    grace_period_available: null,
    country: '',
    region: '',
    geographic_zone: '',
    sort_by: 'post_date',
    sort_order: 'desc'
  });

  // Contexte d'authentification
  const { isAuthenticated, user } = useAuth();

  // Charger les offres de financement depuis l'API
  const loadFinancements = async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await financementService.getPublicFundingOffers(filters, page, pagination.pageSize);
      
      // Formater les données de l'API
      const formattedFinancements = (response.results || []).map(formatFinancementData);
      setFinancements(formattedFinancements);
      
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        totalCount: response.count
      }));
    } catch (err) {
      console.error('Erreur lors du chargement des financements:', err);
      setError('Erreur lors du chargement des offres de financement');
      setFinancements([]);
    } finally {
      setLoading(false);
    }
  };

  // Formater les données de l'API
  const formatFinancementData = (apiFinancement) => {
    return {
      id: apiFinancement.id,
      title: apiFinancement.title || 'Titre non disponible',
      institution: apiFinancement.recruiter?.company_name || 'Institution non spécifiée',
      location: apiFinancement.geographic_zone || apiFinancement.recruiter?.region?.name || 'Localisation non spécifiée',
      type: apiFinancement.target?.name || 'Type non spécifié',
      amount: apiFinancement.min_amount && apiFinancement.max_amount 
        ? `${apiFinancement.min_amount.toLocaleString()} - ${apiFinancement.max_amount.toLocaleString()} FCFA`
        : apiFinancement.min_amount 
          ? `À partir de ${apiFinancement.min_amount.toLocaleString()} FCFA`
          : apiFinancement.max_amount
            ? `Jusqu'à ${apiFinancement.max_amount.toLocaleString()} FCFA`
            : 'Montant non spécifié',
      duration: apiFinancement.repayment_duration ? `${apiFinancement.repayment_duration} mois` : 'Durée non spécifiée',
      postedDate: apiFinancement.post_date ? new Date(apiFinancement.post_date).toLocaleDateString('fr-FR') : null,
      deadline: apiFinancement.application_deadline 
        ? new Date(apiFinancement.application_deadline).toLocaleDateString('fr-FR') 
        : null,
      description: apiFinancement.description || 'Description non disponible',
      logo: apiFinancement.recruiter?.logo 
        ? (apiFinancement.recruiter.logo.startsWith('http') 
            ? apiFinancement.recruiter.logo 
            : `http://localhost:8000${apiFinancement.recruiter.logo}`)
        : "https://via.placeholder.com/60x60",
      
      // Attributs supplémentaires de l'API
      sector: apiFinancement.sector?.name || null,
      target: apiFinancement.target?.name || null,
      conditions: apiFinancement.conditions || null,
      requirements: apiFinancement.requirements || null,
      documents_required: apiFinancement.documents_required || null,
      interest_rate: apiFinancement.interest_rate || null,
      grace_period: apiFinancement.grace_period || null,
      guarantee_required: apiFinancement.guarantee_required || null,
      is_urgent: apiFinancement.is_urgent || false,
      status: apiFinancement.status || null,
      views_count: apiFinancement.views_count || 0,
      applications_count: apiFinancement.applications_count || 0,
      
      // Informations du recruteur
      recruiter_info: {
        company_name: apiFinancement.recruiter?.company_name || null,
        company_description: apiFinancement.recruiter?.description || null,
        company_sector: apiFinancement.recruiter?.sector || null,
        company_size: apiFinancement.recruiter?.company_size || null,
        website: apiFinancement.recruiter?.website || null,
        country: apiFinancement.recruiter?.country?.name || null,
        region: apiFinancement.recruiter?.region?.name || null
      }
    };
  };

  // Charger les financements au montage du composant
  useEffect(() => {
    loadFinancements(1, apiFilters);
  }, []);

  // Mettre à jour les filtres API quand les filtres locaux changent
  useEffect(() => {
    const newApiFilters = {
      ...apiFilters,
      query: searchTerm,
      sector: selectedType,
      geographic_zone: selectedLocation
    };
    
    setApiFilters(newApiFilters);
    
    // Recharger avec les nouveaux filtres (sans recherche automatique)
    if (selectedType || selectedLocation) {
      loadFinancements(1, newApiFilters);
    }
  }, [selectedType, selectedLocation]);

  // Détecter quand la zone de recherche est vidée
  useEffect(() => {
    // Si la zone de recherche est vide et qu'il y avait une recherche active
    if (searchTerm === '' && apiFilters.query) {
      const newApiFilters = {
        ...apiFilters,
        query: '',
        sector: selectedType,
        geographic_zone: selectedLocation
      };
      
      setApiFilters(newApiFilters);
      // Recharger toutes les données sans recherche
      loadFinancements(1, newApiFilters);
    }
  }, [searchTerm]);

  // Gestion du changement de page
  const handlePageChange = (page) => {
    loadFinancements(page, apiFilters);
  };

  // Gestion du changement de taille de page
  const handlePageSizeChange = (newPageSize) => {
    setPagination(prev => ({ ...prev, pageSize: newPageSize }));
    loadFinancements(1, apiFilters);
  };

  // Fonction de recherche manuelle
  const handleSearch = () => {
    const newApiFilters = {
      ...apiFilters,
      query: searchTerm,
      sector: selectedType,
      geographic_zone: selectedLocation
    };
    
    setApiFilters(newApiFilters);
    loadFinancements(1, newApiFilters);
  };

  const types = [
    { value: '', label: 'Tous les types' },
    { value: 'Subvention', label: 'Subvention' },
    { value: 'Prêt', label: 'Prêt' },
    { value: 'Microcrédit', label: 'Microcrédit' },
    { value: 'Garantie', label: 'Garantie' },
    { value: 'Investissement', label: 'Investissement' }
  ];

  const locations = [
    { value: '', label: 'Tous les lieux' },
    { value: 'Bénin', label: 'Bénin' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Porto-Novo', label: 'Porto-Novo' },
    { value: 'Parakou', label: 'Parakou' }
  ];

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  const filteredFinancements = financements.filter(financement => {
    const matchesSearch = financement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         financement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         financement.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || financement.type === selectedType;
    const matchesLocation = !selectedLocation || financement.location.includes(selectedLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile-First */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              <i className="fas fa-money-bill-wave text-fuchsia-600 mr-2 sm:mr-3"></i>
              Financements
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2">
              Découvrez des opportunités de financement pour vos projets. 
              Trouvez des subventions, prêts et investissements adaptés à vos besoins.
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
                  placeholder="Rechercher un financement, une institution..."
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
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Tous types</option>
              <option value="Subvention">Subvention</option>
              <option value="Prêt">Prêt</option>
              <option value="Microcrédit">Microcrédit</option>
              <option value="Garantie">Garantie</option>
              <option value="Investissement">Investissement</option>
            </select>
            
            {/* Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-sm whitespace-nowrap bg-white"
            >
              <option value="">Tous lieux</option>
              <option value="Bénin">Bénin</option>
              <option value="Cotonou">Cotonou</option>
              <option value="Porto-Novo">Porto-Novo</option>
              <option value="Parakou">Parakou</option>
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
                  Financements disponibles
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.totalCount} financement{pagination.totalCount !== 1 ? 's' : ''} trouvé{pagination.totalCount !== 1 ? 's' : ''}
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

            {/* Financements List */}
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
                  onClick={() => loadFinancements(1, apiFilters)}
                  className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm"
                >
                  Réessayer
                </button>
              </div>
            ) : financements.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-gray-400 text-xl"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun financement trouvé</h3>
                <p className="text-gray-600 text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              <div className="space-y-4">
                {financements.map((financement) => (
                  <div key={financement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
                    {/* Financement Card Header */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        {/* Institution Logo */}
                        <div className="flex-shrink-0">
                          {financement.logo ? (
                            <img 
                              src={financement.logo} 
                              alt={financement.institution} 
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-200 bg-white" 
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback logo si pas d'image ou erreur */}
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-md ${financement.logo ? 'hidden' : 'flex'}`}>
                            <i className="fas fa-building text-white text-lg sm:text-xl"></i>
                          </div>
                        </div>
                        
                        {/* Financement Content */}
                        <div className="flex-1 min-w-0">
                          {/* Financement Title */}
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-fuchsia-600 transition-colors duration-200">
                            <Link to={`/financements/${financement.id}`} className="hover:text-fuchsia-600">
                              {financement.title}
                            </Link>
                          </h3>
                          
                          {/* Institution & Location */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 mb-3">
                            <span className="flex items-center text-sm text-gray-600">
                              <i className="fas fa-building mr-2 text-fuchsia-500"></i>
                              {financement.institution}
                            </span>
                            {financement.location && (
                              <span className="flex items-center text-sm text-gray-600">
                                <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                                {financement.location}
                              </span>
                            )}
                          </div>
                          
                          {/* Financement Description - Une seule ligne */}
                          <p className="text-gray-700 text-sm sm:text-base mb-4 line-clamp-1">
                            {financement.description}
                          </p>
                          
                          {/* Tags Row */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium border border-purple-200">
                              {financement.amount}
                            </span>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg text-xs font-medium border border-blue-200">
                              {financement.duration}
                            </span>
                            <span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium border border-green-200">
                              {financement.type}
                            </span>
                            {financement.is_urgent && (
                              <span className="bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium border border-red-200">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                Urgent
                              </span>
                            )}
                          </div>

                          {/* Meta Information */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            {/* Left Side - Date & Applications */}
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {financement.postedDate && (
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-1"></i>
                                  {financement.postedDate}
                                </span>
                              )}
                              {financement.applications_count > 0 && (
                                <span className="flex items-center">
                                  <i className="fas fa-users mr-1"></i>
                                  {financement.applications_count} demande{financement.applications_count !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>

                            {/* Right Side - Deadline & Action */}
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                              {financement.deadline && (
                                <span className="text-xs text-red-600 font-medium flex items-center">
                                  <i className="fas fa-clock mr-1"></i>
                                  Limite : {financement.deadline}
                                </span>
                              )}
                              <Link 
                                to={`/financements/${financement.id}`}
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
                <FinancementPagination
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
                  Parcourez nos offres de financement et trouvez le soutien financier idéal pour votre projet
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
                  Vous avez un projet ?
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-fuchsia-100 mb-6 opacity-90 px-2">
                  Rejoignez notre plateforme et trouvez le financement idéal pour votre projet
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

export default Financements; 