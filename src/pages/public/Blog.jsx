import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import blogService from '../../services/blogService';
import BlogPagination from '../../components/BlogPagination';
import Loader from '../../components/Loader';
import { useAuth } from '../../contexts/AuthContext';

const Blog = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  // États pour l'API
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10
  });

  const [apiFilters, setApiFilters] = useState({
    search: '',
    category: '',
    is_featured: null,
    author: '',
    ordering: '-publish_date'
  });

  // États pour les données de référence
  const [categories, setCategories] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [popularArticles, setPopularArticles] = useState([]);

  // Fonction pour charger les articles depuis l'API
  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.getPublicBlogPosts(
        apiFilters,
        pagination.currentPage,
        pagination.pageSize
      );
      
      const formattedArticles = response.results.map(apiArticle => 
        formatArticleData(apiArticle)
      );
      
      setArticles(formattedArticles);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(response.count / pagination.pageSize),
        totalCount: response.count
      }));
    } catch (err) {
      console.error('Erreur lors du chargement des articles:', err);
      setError('Erreur lors du chargement des articles');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour charger les catégories
  const loadCategories = async () => {
    try {
      const response = await blogService.getPublicCategories();
      setCategories(response.results || response);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setCategories([]);
    }
  };

  // Fonction pour charger l'article en vedette
  const loadFeaturedArticle = async () => {
    try {
      const response = await blogService.getPublicFeaturedPosts();
      if (response.results && response.results.length > 0) {
        setFeaturedArticle(formatArticleData(response.results[0]));
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'article vedette:', err);
    }
  };

  // Fonction pour charger les articles populaires
  const loadPopularArticles = async () => {
    try {
      const response = await blogService.getMostViewedPosts(1, 3);
      const formattedPopular = response.results.map(apiArticle => ({
        id: apiArticle.id,
        title: apiArticle.title,
        image: apiArticle.featured_image || apiArticle.images?.[0]?.image || null,
        views: apiArticle.views_count || 0
      }));
      setPopularArticles(formattedPopular);
    } catch (err) {
      console.error('Erreur lors du chargement des articles populaires:', err);
      setPopularArticles([]);
    }
  };

  // Fonction pour formater les données de l'API
  const formatArticleData = (apiArticle) => {
    return {
      id: apiArticle.id,
      title: apiArticle.title || 'Titre non spécifié',
      category: apiArticle.category?.id || '',
      categoryLabel: apiArticle.category?.name || 'Catégorie non spécifiée',
      categoryColor: getCategoryColor(apiArticle.category?.name),
      date: apiArticle.publish_date ? new Date(apiArticle.publish_date).toLocaleDateString('fr-FR') : 'Date non spécifiée',
      author: apiArticle.author?.first_name && apiArticle.author?.last_name ? 
        `${apiArticle.author.first_name} ${apiArticle.author.last_name}` : 
        apiArticle.author?.username || 'Auteur non spécifié',
      authorImage: "https://via.placeholder.com/24x24", // Placeholder pour l'instant
      image: apiArticle.featured_image || (apiArticle.images && apiArticle.images.length > 0 ? apiArticle.images[0].image : null),
      excerpt: apiArticle.excerpt || 'Extrait non disponible',
      views: apiArticle.views_count || 0,
      comments: apiArticle.comments_count || 0,
      slug: apiArticle.slug || '',
      isFeatured: apiArticle.is_featured || false
    };
  };

  // Fonction pour obtenir la couleur de catégorie
  const getCategoryColor = (categoryName) => {
    const colors = {
      'Recrutement': 'bg-blue-100 text-blue-800',
      'Vie d\'entreprise': 'bg-purple-100 text-purple-800',
      'Formation': 'bg-green-100 text-green-800',
      'Actualités': 'bg-orange-100 text-orange-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[categoryName] || colors.default;
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
    setApiFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Gestionnaire de changement de catégorie
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setApiFilters(prev => ({ 
      ...prev, 
      category: category || '',
      currentPage: 1 
    }));
  };

  // Gestionnaire de changement de tri
  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    let ordering = '-publish_date'; // Par défaut
    
    switch (sortValue) {
      case 'recent':
        ordering = '-publish_date';
        break;
      case 'popular':
        ordering = '-views_count';
        break;
      case 'trending':
        ordering = '-views_count';
        break;
      default:
        ordering = '-publish_date';
    }
    
    setApiFilters(prev => ({ ...prev, ordering }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  // Charger les données au montage et lors des changements de filtres
  useEffect(() => {
    loadArticles();
  }, [pagination.currentPage, pagination.pageSize, apiFilters]);

  // Charger les données de référence au montage
  useEffect(() => {
    loadCategories();
    loadFeaturedArticle();
    loadPopularArticles();
  }, []);

  // Réinitialiser la recherche quand le terme de recherche est effacé
  useEffect(() => {
    if (!searchTerm) {
      setApiFilters(prev => ({ ...prev, search: '' }));
    }
  }, [searchTerm]);

  const handleShare = (articleId) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour partager un article. Veuillez vous connecter.');
      return;
    }
    
    // Simuler le partage
    alert('Article partagé avec succès !');
  };

  const handleNewsletterSubscribe = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      alert(`Merci ! Vous êtes maintenant abonné à notre newsletter avec l'email : ${email}`);
      e.target.email.value = '';
    }
  };

  if (loading && articles.length === 0) {
    return <Loader />;
  }

  if (error && articles.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadArticles}
          className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <div className="text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Blog Destiny Jobs</h1>
          <p className="text-gray-600 text-lg">Découvrez les dernières actualités et conseils carrière</p>
        </div>
      </div>

      {/* Featured Article */}
      {featuredArticle && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 group hover:shadow-xl transition-all duration-300">
        <div className="relative">
            {featuredArticle.image ? (
              <img 
                src={featuredArticle.image} 
                alt="Article vedette" 
                className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-64 lg:h-80 bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <i className="fas fa-newspaper text-white text-6xl opacity-80"></i>
              </div>
            )}
            
            {/* Badge "À la Une" */}
            <div className="absolute top-6 left-6">
              <span className="bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm">
                <i className="fas fa-crown mr-2"></i>
                À la Une
              </span>
            </div>

            {/* Overlay avec gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex items-end">
              <div className="p-6 lg:p-8 text-white w-full">
                {/* Catégorie */}
                <div className="mb-3">
                  <span className={`${featuredArticle.categoryColor} px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm bg-opacity-90`}>
                    {featuredArticle.categoryLabel}
                  </span>
                </div>

                {/* Titre */}
                <h2 className="text-2xl lg:text-4xl font-bold mb-3 leading-tight group-hover:text-fuchsia-200 transition-colors duration-300">
                  {featuredArticle.title}
                </h2>

                {/* Extrait */}
                <p className="text-gray-200 text-sm lg:text-base mb-6 leading-relaxed max-w-3xl opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {featuredArticle.excerpt}
                </p>

                {/* Meta informations */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-200 mb-4 sm:mb-0">
                <span className="flex items-center">
                      <i className="fas fa-calendar-alt mr-2 text-fuchsia-300"></i>
                      {featuredArticle.date}
                </span>
                <span className="flex items-center">
                      <i className="fas fa-user mr-2 text-fuchsia-300"></i>
                      {featuredArticle.author}
                </span>
                <span className="flex items-center">
                      <i className="fas fa-eye mr-2 text-blue-300"></i>
                      {featuredArticle.views} vues
                </span>
                  </div>

                  {/* Bouton lire plus */}
                  <Link 
                    to={`/blog/${featuredArticle.slug}`}
                    className="bg-white text-fuchsia-600 hover:bg-fuchsia-50 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 inline-flex items-center"
                  >
                    Lire l'article
                    <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-200"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                <input 
                  type="text" 
                  placeholder="Rechercher des articles..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-2 bg-fuchsia-600 text-white px-3 py-1 rounded text-sm hover:bg-fuchsia-700 transition duration-200"
                >
                  Rechercher
                </button>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="lg:w-48">
              <select 
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="">Toutes catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div className="lg:w-48">
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                <option value="recent">Plus récents</option>
                <option value="popular">Plus populaires</option>
                <option value="trending">Tendances</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Articles Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
        {/* Main Articles Column */}
        <div className="xl:col-span-3 space-y-6">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
            </div>
          ) : (
            articles.map((article) => (
              <article key={article.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-fuchsia-200 transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex flex-col lg:flex-row">
                  {/* Image Section */}
                  <div className="lg:w-2/5 relative overflow-hidden">
                    {article.image ? (
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-48 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-48 lg:h-full bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <i className="fas fa-newspaper text-white text-5xl opacity-80"></i>
                </div>
                    )}
                    {/* Badge de catégorie sur l'image */}
                    <div className="absolute top-4 left-4">
                      <span className={`${article.categoryColor} px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm bg-opacity-90`}>
                      {article.categoryLabel}
                    </span>
                    </div>
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-between">
                    {/* Header */}
                    <div className="mb-4">
                      {/* Meta informations */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <i className="fas fa-calendar-alt mr-2 text-fuchsia-500"></i>
                            {article.date}
                          </span>
                          <span className="flex items-center">
                            <i className="fas fa-eye mr-2 text-blue-500"></i>
                            {article.views} vues
                          </span>
                        </div>
                        {article.isFeatured && (
                          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                            <i className="fas fa-star mr-1"></i>
                            Vedette
                          </span>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-fuchsia-600 transition-colors duration-200 leading-tight">
                        <Link to={`/blog/${article.slug}`} className="hover:text-fuchsia-600">
                    {article.title}
                        </Link>
                  </h3>

                      {/* Extrait */}
                      <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center justify-between">
                        {/* Auteur */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                            {article.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{article.author}</p>
                            <p className="text-xs text-gray-500">Auteur</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                          {/* Bouton partager */}
                      <button 
                        onClick={() => handleShare(article.id)}
                            className="flex items-center space-x-2 bg-gray-50 hover:bg-fuchsia-50 text-gray-600 hover:text-fuchsia-600 px-4 py-2 rounded-lg transition-all duration-200 group/btn"
                      >
                            <i className="fas fa-share-alt group-hover/btn:scale-110 transition-transform duration-200"></i>
                            <span className="text-sm font-medium">Partager</span>
                      </button>

                          {/* Bouton lire plus */}
                          <Link 
                            to={`/blog/${article.slug}`}
                            className="bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            Lire plus
                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-200"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:w-80 xl:w-80 2xl:w-96">
          {/* Popular Articles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-fire text-orange-500 mr-2"></i>
              Articles populaires
            </h3>
            <div className="space-y-4">
              {popularArticles.map((article) => (
                <div key={article.id} className="flex items-start space-x-3">
                  {article.image ? (
                  <img src={article.image} alt="Article" className="w-15 h-15 rounded object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-15 h-15 rounded bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-newspaper text-white text-lg"></i>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <h4 className="font-medium text-gray-900 text-sm mb-1 hover:text-fuchsia-600 cursor-pointer line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500">
                      <i className="fas fa-eye text-blue-400 mr-1"></i>
                      <span>{article.views} vues</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Catégories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <a 
                  key={category.id}
                  href="#" 
                  className="flex items-center justify-between text-gray-700 hover:text-fuchsia-600 transition-colors duration-200"
                >
                  <span>{category.name}</span>
                  <span className="text-sm text-gray-500">{category.posts_count || 0}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Newsletter</h3>
            <p className="text-sm mb-4 text-fuchsia-100">Recevez les derniers articles directement dans votre boîte mail</p>
            <form onSubmit={handleNewsletterSubscribe} className="space-y-3">
              <input 
                type="email" 
                name="email"
                placeholder="Votre email" 
                className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500"
                required
              />
              <button 
                type="submit"
                className="w-full bg-white text-fuchsia-600 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <BlogPagination
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
  );
};

export default Blog;