import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BlogGerer = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Données simulées des articles
  const [articles, setArticles] = useState([
    {
      id: 1,
      title: "Comment attirer les meilleurs talents dans votre entreprise",
      category: "recrutement",
      categoryLabel: "Recrutement",
      status: "published",
      statusLabel: "Publié",
      statusColor: "bg-green-100 text-green-800",
      date: "15 Jan 2024",
      views: 1247,
      likes: 87,
      isFeatured: true,
      excerpt: "Dans un marché du travail de plus en plus compétitif, attirer et retenir les meilleurs talents est devenu un défi majeur..."
    },
    {
      id: 2,
      title: "Créer une culture d'entreprise positive et inclusive",
      category: "entreprise",
      categoryLabel: "Vie d'entreprise",
      status: "draft",
      statusLabel: "Brouillon",
      statusColor: "bg-yellow-100 text-yellow-800",
      date: "12 Jan 2024",
      views: 0,
      likes: 0,
      isFeatured: false,
      excerpt: "Une culture d'entreprise forte est l'un des facteurs les plus importants pour attirer et retenir les talents..."
    },
    {
      id: 3,
      title: "L'importance de la formation continue en entreprise",
      category: "formation",
      categoryLabel: "Formation",
      status: "published",
      statusLabel: "Publié",
      statusColor: "bg-green-100 text-green-800",
      date: "10 Jan 2024",
      views: 892,
      likes: 98,
      isFeatured: false,
      excerpt: "Investir dans la formation de vos équipes n'est plus une option mais une nécessité..."
    },
    {
      id: 4,
      title: "Tendances du marché de l'emploi en 2024",
      category: "actualite",
      categoryLabel: "Actualités",
      status: "pending",
      statusLabel: "En attente",
      statusColor: "bg-blue-100 text-blue-800",
      date: "8 Jan 2024",
      views: 0,
      likes: 0,
      isFeatured: false,
      excerpt: "Le marché de l'emploi connaît des transformations importantes. Analysons les secteurs en croissance..."
    }
  ]);

  const handleStatusChange = (articleId, newStatus) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        const statusLabels = {
          'published': 'Publié',
          'draft': 'Brouillon',
          'pending': 'En attente'
        };
        const statusColors = {
          'published': 'bg-green-100 text-green-800',
          'draft': 'bg-yellow-100 text-yellow-800',
          'pending': 'bg-blue-100 text-blue-800'
        };
        return {
          ...article,
          status: newStatus,
          statusLabel: statusLabels[newStatus],
          statusColor: statusColors[newStatus]
        };
      }
      return article;
    }));
  };

  const handleDelete = (articleId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setArticles(prev => prev.filter(article => article.id !== articleId));
    }
  };

  const handleToggleFeatured = (articleId) => {
    setArticles(prev => prev.map(article => {
      if (article.id === articleId) {
        return { ...article, isFeatured: !article.isFeatured };
      }
      return article;
    }));
  };

  const filteredArticles = articles.filter(article => {
    const matchesFilter = selectedFilter === 'all' || article.status === selectedFilter;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status) => {
    return articles.filter(article => status === 'all' || article.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <i className="fas fa-edit text-fuchsia-600 mr-3"></i>
              Gérer mes articles
            </h1>
            <p className="text-gray-600">Gérez vos articles publiés, brouillons et articles en attente</p>
          </div>
          <Link 
            to="/recruteur/blog/publier" 
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvel article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-file-alt text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-lg font-semibold text-gray-900">{articles.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-check text-green-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Publiés</p>
              <p className="text-lg font-semibold text-gray-900">{getStatusCount('published')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <i className="fas fa-edit text-yellow-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Brouillons</p>
              <p className="text-lg font-semibold text-gray-900">{getStatusCount('draft')}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-clock text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-lg font-semibold text-gray-900">{getStatusCount('pending')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              <input
                type="text"
                placeholder="Rechercher dans mes articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="lg:w-48">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="all">Tous les articles</option>
              <option value="published">Publiés</option>
              <option value="draft">Brouillons</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes articles</h3>
          
          {filteredArticles.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-file-alt text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-500">Aucun article trouvé</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredArticles.map((article) => (
                <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className={`${article.statusColor} px-2 py-1 rounded-full text-xs font-medium mr-2`}>
                          {article.statusLabel}
                        </span>
                        {article.isFeatured && (
                          <span className="bg-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded-full text-xs font-medium">
                            <i className="fas fa-star mr-1"></i>Vedette
                          </span>
                        )}
                        <span className="text-gray-500 text-sm ml-auto">
                          <i className="fas fa-calendar mr-1"></i>
                          {article.date}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <i className="fas fa-eye mr-1"></i>
                          {article.views} vues
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-heart mr-1"></i>
                          {article.likes} likes
                        </span>
                        <span className="flex items-center">
                          <i className="fas fa-tag mr-1"></i>
                          {article.categoryLabel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/recruteur/blog/editer/${article.id}`}
                        className="text-fuchsia-600 hover:text-fuchsia-800 p-2 rounded-md hover:bg-fuchsia-50 transition duration-200"
                        title="Modifier"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      
                      <button
                        onClick={() => handleToggleFeatured(article.id)}
                        className={`p-2 rounded-md transition duration-200 ${
                          article.isFeatured 
                            ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={article.isFeatured ? 'Retirer des vedettes' : 'Mettre en vedette'}
                      >
                        <i className="fas fa-star"></i>
                      </button>
                      
                      <div className="relative group">
                        <button className="text-gray-400 hover:text-gray-600 p-2 rounded-md hover:bg-gray-50 transition duration-200">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible z-10">
                          <div className="py-1">
                            {article.status === 'draft' && (
                              <button
                                onClick={() => handleStatusChange(article.id, 'published')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                              >
                                <i className="fas fa-check mr-2"></i>Publier
                              </button>
                            )}
                            {article.status === 'published' && (
                              <button
                                onClick={() => handleStatusChange(article.id, 'draft')}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                              >
                                <i className="fas fa-eye-slash mr-2"></i>Dépublier
                              </button>
                            )}
                            <Link
                              to={`/blog/article/${article.id}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-fuchsia-50 hover:text-fuchsia-600"
                            >
                              <i className="fas fa-eye mr-2"></i>Voir
                            </Link>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <i className="fas fa-trash mr-2"></i>Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogGerer; 