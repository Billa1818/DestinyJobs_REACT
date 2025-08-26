import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicUserSearchService from '../../services/PublicUserSearchService';

const NosUtilisateur = () => {
  // États pour les données
  const [users, setUsers] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filtersApplied, setFiltersApplied] = useState({});
  
  // États pour l'interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour les filtres
  const [filters, setFilters] = useState(PublicUserSearchService.getDefaultFilters());
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers();
  }, [currentPage, pageSize]);

  // Charger les utilisateurs depuis l'API
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchFilters = {
        ...filters,
        page: currentPage,
        page_size: pageSize
      };
      
      const response = await PublicUserSearchService.searchUsers(searchFilters);
      
      setUsers(response.results || []);
      setPagination(response.pagination || {});
      setFiltersApplied(response.filters_applied || {});
      
      // Formater les utilisateurs pour l'affichage
      const formatted = response.results?.map(user => 
        PublicUserSearchService.formatUserForDisplay(user)
      ).filter(user => user !== null) || [];
      
      setFormattedUsers(formatted);
      
      console.log('✅ Utilisateurs chargés:', formatted.length);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement des utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres
  const applyFilters = () => {
    setCurrentPage(1); // Retour à la première page
    loadUsers();
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    const defaultFilters = PublicUserSearchService.getDefaultFilters();
    setFilters(defaultFilters);
    setCurrentPage(1);
    setPageSize(20);
    // Charger avec les filtres par défaut
    setTimeout(() => loadUsers(), 100);
  };

  // Gérer le changement de page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Gérer le changement de taille de page
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // Gérer le changement de filtre
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Formater le nombre de résultats
  const formatResultsCount = () => {
    if (!pagination.total_count) return '0 résultat';
    if (pagination.total_count === 1) return '1 résultat';
    return `${pagination.total_count} résultats`;
  };

  // Rendu des filtres
  const renderFilters = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-filter mr-2 text-fuchsia-600"></i>
          Filtres de recherche
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
        >
          {showFilters ? 'Masquer' : 'Afficher'} les filtres
        </button>
      </div>

      {showFilters && (
        <div className="space-y-4">
          {/* Première ligne de filtres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type d'utilisateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type d'utilisateur
              </label>
              <select
                value={filters.user_type}
                onChange={(e) => handleFilterChange('user_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value="all">Tous les types</option>
                <option value="CANDIDAT">Candidats</option>
                <option value="PRESTATAIRE">Prestataires</option>
                <option value="RECRUTEUR">Recruteurs</option>
              </select>
            </div>

            {/* Recherche textuelle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nom, username, compétences..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            {/* Compétences */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compétences
              </label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                placeholder="Python, React, Marketing..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>

          {/* Deuxième ligne de filtres */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Expérience minimum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expérience min (années)
              </label>
              <input
                type="number"
                value={filters.experience_min}
                onChange={(e) => handleFilterChange('experience_min', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            {/* Expérience maximum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expérience max (années)
              </label>
              <input
                type="number"
                value={filters.experience_max}
                onChange={(e) => handleFilterChange('experience_max', e.target.value)}
                placeholder="20"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>

            {/* Disponibilité (pour prestataires) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilité
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              >
                <option value="">Toutes</option>
                <option value="AVAILABLE">Disponible</option>
                <option value="BUSY">Occupé</option>
                <option value="UNAVAILABLE">Non disponible</option>
              </select>
            </div>

            {/* Tarif horaire max (pour prestataires) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarif max (€/h)
              </label>
              <input
                type="number"
                value={filters.hourly_rate_max}
                onChange={(e) => handleFilterChange('hourly_rate_max', e.target.value)}
                placeholder="100"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
            >
              <i className="fas fa-undo mr-2"></i>
              Réinitialiser
            </button>
            
            <button
              onClick={applyFilters}
              className="px-6 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-search mr-2"></i>
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Rendu de la pagination
  const renderPagination = () => {
    if (!pagination.total_pages || pagination.total_pages <= 1) return null;

    return (
      <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Affichage de {((currentPage - 1) * pageSize) + 1} à {Math.min(currentPage * pageSize, pagination.total_count)} sur {pagination.total_count} résultats
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Sélecteur de taille de page */}
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          >
            <option value={10}>10 par page</option>
            <option value={20}>20 par page</option>
            <option value={50}>50 par page</option>
          </select>

          {/* Navigation des pages */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.has_previous}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
              let pageNum;
              if (pagination.total_pages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.total_pages - 2) {
                pageNum = pagination.total_pages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={`page-${i}-${pageNum}`}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    currentPage === pageNum
                      ? 'bg-fuchsia-600 text-white border-fuchsia-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.has_next}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Rendu d'une carte utilisateur
  const renderUserCard = (user) => (
    <div key={user.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition duration-200">
      {/* En-tête de la carte */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center ${PublicUserSearchService.getUserTypeColor(user.userType)}`}>
            <i className={`${PublicUserSearchService.getUserTypeIcon(user.userType)} text-xl`}></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{user.displayName}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${PublicUserSearchService.getUserTypeColor(user.userType)} bg-opacity-10`}>
                {user.userTypeDisplay}
              </span>
              {user.userType === 'PRESTATAIRE' && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.availabilityColor} bg-opacity-10`}>
                  {user.availability}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right text-sm text-gray-500">
          <div>Inscrit {PublicUserSearchService.formatDate(user.createdAt)}</div>
          <div>Actif {PublicUserSearchService.formatDate(user.lastActivity)}</div>
        </div>
      </div>

      {/* Informations principales */}
      <div className="space-y-3 mb-4">
        {user.userType === 'PRESTATAIRE' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tarif horaire:</span>
              <span className="font-medium text-green-600">{user.hourlyRate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expérience:</span>
              <span className="font-medium">{user.yearsExperience} ans</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Projets réalisés:</span>
              <span className="font-medium">{user.completedProjects}</span>
            </div>
          </>
        )}

        {user.userType === 'CANDIDAT' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Expérience:</span>
              <span className="font-medium">{user.yearsExperience} ans</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Compétences:</span>
              <span className="font-medium">{user.skills}</span>
            </div>
          </>
        )}

        {user.userType === 'RECRUTEUR' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Entreprise:</span>
              <span className="font-medium">{user.companyName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Secteur:</span>
              <span className="font-medium">{user.sector}</span>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Localisation:</span>
          <span className="font-medium">{user.location}</span>
        </div>
      </div>

      {/* Compétences/Spécialisations */}
      {user.skills && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Compétences:</h4>
          <div className="flex flex-wrap gap-2">
            {(() => {
              // Gérer les différents formats de compétences
              let skillsArray = [];
              
              if (Array.isArray(user.skills)) {
                // Si c'est déjà un tableau
                skillsArray = user.skills;
              } else if (typeof user.skills === 'string') {
                // Si c'est une chaîne, la diviser par virgules
                skillsArray = user.skills.split(',').map(s => s.trim()).filter(s => s);
              } else if (user.specializations && typeof user.specializations === 'string') {
                // Fallback vers specializations si skills n'est pas disponible
                skillsArray = user.specializations.split(',').map(s => s.trim()).filter(s => s);
              }
              
              // Afficher seulement les 5 premières compétences
              const displaySkills = skillsArray.slice(0, 5);
              const remainingCount = skillsArray.length - 5;
              
              return (
                <>
                  {displaySkills.map((skill, index) => (
                    <span
                      key={`skill-${user.id}-${index}-${skill}`}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                  {remainingCount > 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                      +{remainingCount} autres
                    </span>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <Link
          to={`/profile/${user.id}`}
          className="text-fuchsia-600 hover:text-fuchsia-800 font-medium text-sm"
        >
          <i className="fas fa-eye mr-1"></i>
          Voir le profil
        </Link>
        
        {user.userType === 'PRESTATAIRE' && (
          <Link
            to={`/consultations?provider=${user.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            <i className="fas fa-handshake mr-1"></i>
            Contacter
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Découvrez nos utilisateurs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explorez notre communauté de professionnels, candidats et recruteurs. 
            Trouvez les talents qui correspondent à vos besoins ou découvrez de nouvelles opportunités.
          </p>
        </div>

        {/* Filtres */}
        {renderFilters()}

        {/* Statistiques et actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {loading ? 'Chargement...' : formatResultsCount()}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-fuchsia-600 hover:text-fuchsia-800 font-medium"
            >
              <i className="fas fa-filter mr-2"></i>
              {showFilters ? 'Masquer' : 'Afficher'} les filtres
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          // Affichage de chargement
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-sm p-6">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Affichage d'erreur
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur lors du chargement
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadUsers}
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-redo mr-2"></i>
              Réessayer
            </button>
          </div>
        ) : formattedUsers.length === 0 ? (
          // Aucun résultat
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-undo mr-2"></i>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          // Liste des utilisateurs
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {formattedUsers.map((user, index) => (
                <div key={`user-${user.id}-${index}`}>
                  {renderUserCard(user)}
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default NosUtilisateur;
