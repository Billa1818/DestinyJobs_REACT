import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';
import { Loader } from '../../components';

const BlogPublier = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // États du composant
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [categories, setCategories] = useState([]);
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // Vérifier l'authentification et charger les données
  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, user, navigate]);

  // Charger toutes les données nécessaires
  const loadData = async (page = 1, size = pageSize) => {
    try {
      setLoading(true);
      
      // Construire les paramètres de requête
      const params = {
        page: page,
        page_size: size
      };
      
      // Ajouter les filtres si ils sont définis
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      
      const [articlesData, categoriesData] = await Promise.all([
        blogService.getMyPosts(params),
        blogService.getCategories()
      ]);
      
      // Mettre à jour les articles et la pagination
      setArticles(articlesData.results || articlesData);
      setTotalArticles(articlesData.count || 0);
      setTotalPages(Math.ceil((articlesData.count || 0) / size));
      setHasNext(!!articlesData.next);
      setHasPrevious(!!articlesData.previous);
      setCurrentPage(page);
      setPageSize(size);
      
      setCategories(categoriesData);
    } catch (error) {
      setError('Erreur lors du chargement des articles');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation de pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadData(newPage, pageSize);
    }
  };

  const handlePageSizeChange = (newSize) => {
    const newPageSize = parseInt(newSize);
    if (newPageSize >= 1 && newPageSize <= 50) {
      setPageSize(newPageSize);
      loadData(1, newPageSize); // Retour à la première page
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPrevious) {
      handlePageChange(currentPage - 1);
    }
  };

  // Filtrer les articles
  const handleFilterChange = () => {
    // Réinitialiser à la première page lors du changement de filtres
    loadData(1, pageSize);
  };

  // Effet pour recharger les données quand les filtres changent
  useEffect(() => {
    if (isAuthenticated && user) {
      loadData(currentPage, pageSize);
    }
  }, [searchTerm, selectedCategory, selectedStatus]);

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
    
  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'Brouillon';
      case 'PENDING':
        return 'En attente de publication';
      case 'PUBLISHED':
        return 'Publié';
      case 'REJECTED':
        return 'Refusé';
      default:
        return status;
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Obtenir les statistiques
  const getStats = () => {
    const total = articles.length;
    const drafts = articles.filter(a => a.status === 'DRAFT').length;
    const pending = articles.filter(a => a.status === 'PENDING').length;
    const published = articles.filter(a => a.status === 'PUBLISHED').length;
    const rejected = articles.filter(a => a.status === 'REJECTED').length;

    return { total, drafts, pending, published, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Articles</h1>
            <p className="text-gray-600 mt-1">Consultez et gérez vos articles de blog</p>
          </div>
          <Link 
            to="/recruteur/creer-article"
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition-colors duration-200 flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvel Article
          </Link>
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <i className="fas fa-exclamation-circle text-red-400 mt-0.5"></i>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-newspaper text-2xl text-fuchsia-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-edit text-2xl text-gray-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Brouillons</p>
              <p className="text-2xl font-bold text-gray-900">{stats.drafts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-clock text-2xl text-yellow-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-check-circle text-2xl text-green-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Publiés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-times-circle text-2xl text-red-600"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Refusés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              <input
                type="text"
                  placeholder="Rechercher des articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleFilterChange()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              />
              </div>
            </div>
            
            {/* Filtre par catégorie */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Toutes catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Filtre par statut */}
            <div className="lg:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  handleFilterChange();
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Tous statuts</option>
                <option value="DRAFT">Brouillons</option>
                <option value="PENDING">En attente</option>
                <option value="PUBLISHED">Publiés</option>
                <option value="REJECTED">Refusés</option>
              </select>
            </div>
          </div>
            </div>
          </div>

      {/* Liste des articles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Articles ({articles.length})
          </h3>
          </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-newspaper text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory || selectedStatus 
                ? 'Aucun article ne correspond à vos critères de recherche'
                : 'Vous n\'avez pas encore créé d\'articles de blog'
              }
            </p>
            {!searchTerm && !selectedCategory && !selectedStatus && (
              <Link
                to="/recruteur/creer-article"
                className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition-colors duration-200"
              >
                Créer votre premier article
              </Link>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div key={article.slug} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
                  {/* Image de l'article */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {article.featured_image ? (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <i className="fas fa-image text-gray-400 text-3xl"></i>
                      </div>
                    )}
                    
                    {/* Badges de statut et catégorie */}
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                      <span className={`${getStatusColor(article.status)} px-3 py-1 rounded-full text-xs font-medium shadow-sm`}>
                        {getStatusLabel(article.status)}
                      </span>
                      {article.category && (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                          {article.category.name}
                        </span>
                      )}
          </div>

                    {/* Actions rapides au survol */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex flex-col space-y-2">
                        <Link
                          to={`/blog/${article.slug}`}
                          className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-fuchsia-600 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                          title="Aperçu"
                        >
                          <i className="fas fa-eye text-sm"></i>
                        </Link>
                        <Link
                          to={`/recruteur/creer-article?edit=${article.slug}`}
                          className="bg-white/90 backdrop-blur-sm text-gray-700 hover:text-blue-600 p-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                          title="Modifier"
                        >
                          <i className="fas fa-edit text-sm"></i>
                        </Link>
              </div>
            </div>
          </div>

                  {/* Contenu de la carte */}
                  <div className="p-5">
                    {/* Titre */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight group-hover:text-fuchsia-600 transition-colors duration-200">
                      {article.title}
                    </h3>
                    
                    {/* Extrait */}
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                    
                    {/* Statistiques */}
                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{article.views_count || 0}</div>
                        <div className="text-xs text-gray-500">Vues</div>
              </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{article.likes_count || 0}</div>
                        <div className="text-xs text-gray-500">Likes</div>
              </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{article.comments_count || 0}</div>
                        <div className="text-xs text-gray-500">Commentaires</div>
            </div>
          </div>

                    {/* Informations temporelles */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <i className="fas fa-calendar mr-2"></i>
                        <span>Créé: {formatDate(article.created_at)}</span>
                      </div>
                      {article.updated_at && article.updated_at !== article.created_at && (
                        <div className="flex items-center">
                          <i className="fas fa-edit mr-2"></i>
                          <span>Modifié: {formatDate(article.updated_at)}</span>
                </div>
                )}
              </div>

                    {/* Actions principales */}
                    <div className="flex flex-col space-y-2">

                      {/* Actions secondaires */}
                      <div className="flex space-x-2">
            <Link 
                          to={`/blog/${article.slug}`}
                          className="flex-1 bg-fuchsia-50 text-fuchsia-700 hover:bg-fuchsia-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
            >
                          <i className="fas fa-eye mr-2"></i>
                          Aperçu
            </Link>
                        
                        <Link
                          to={`/recruteur/creer-article?edit=${article.slug}`}
                          className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
                        >
                          <i className="fas fa-edit mr-2"></i>
                          Modifier
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Informations de pagination */}
            <div className="text-sm text-gray-700">
              Page {currentPage} sur {totalPages} ({totalArticles} article{totalArticles > 1 ? 's' : ''} au total)
            </div>
            
            {/* Sélecteur de taille de page */}
            <div className="flex items-center space-x-2">
              <label htmlFor="page-size" className="text-sm text-gray-700">
                Articles par page :
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
            </div>
            
            {/* Navigation des pages */}
            <div className="flex items-center space-x-2">
              {/* Bouton précédent */}
              <button
                onClick={handlePreviousPage}
                disabled={!hasPrevious}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <i className="fas fa-chevron-left mr-1"></i>
                Précédent
              </button>
              
              {/* Numéros de page */}
              <div className="flex items-center space-x-1">
                {/* Première page */}
                {currentPage > 3 && (
                  <>
                    <button
                      onClick={() => handlePageChange(1)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                  </>
                )}
                
                {/* Pages autour de la page courante */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          pageNum === currentPage
                            ? 'bg-fuchsia-600 text-white border border-fuchsia-600'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}
                
                {/* Dernière page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(totalPages)}
                      className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              {/* Bouton suivant */}
              <button
                onClick={handleNextPage}
                disabled={!hasNext}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
                <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
};

export default BlogPublier; 