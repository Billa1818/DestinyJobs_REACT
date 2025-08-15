import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';

const BlogGererDocumentation = () => {
  const { isAuthenticated, user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.user_type === 'RECRUTEUR') {
      loadArticles();
    }
  }, [isAuthenticated, user]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await blogService.getMyPosts({ page_size: 10 });
      setArticles(response.results || []);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'DRAFT': { label: 'Brouillon', color: 'bg-gray-100 text-gray-800', description: 'Article en cours de rédaction' },
      'PENDING': { label: 'En attente d\'approbation', color: 'bg-yellow-100 text-yellow-800', description: 'Soumis pour validation' },
      'PUBLISHED': { label: 'Publié', color: 'bg-green-100 text-green-800', description: 'Article visible publiquement' },
      'REJECTED': { label: 'Refusé', color: 'bg-red-100 text-red-800', description: 'Article refusé par l\'équipe' },
      'ARCHIVED': { label: 'Archivé', color: 'bg-gray-100 text-gray-800', description: 'Article archivé' }
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800', description: 'Statut inconnu' };
  };

  if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
    return (
      <div className="w-full text-center py-8">
        <p className="text-red-600">Vous devez être connecté en tant que recruteur pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion du Blog - Documentation</h1>
            <p className="text-gray-600 mt-1">Interface de gestion selon la documentation officielle de l'API</p>
          </div>
          <div className="flex space-x-2">
            <Link
              to="/recruteur/blog/publier"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvel article
            </Link>
            <Link
              to="/recruteur/blog/gerer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <i className="fas fa-cog mr-2"></i>
              Gestion complète
            </Link>
          </div>
        </div>
      </div>

      {/* Documentation de l'API */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">📚 Documentation de l'API Blog</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-blue-800 mb-2">📝 Création d'articles</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Sans image</strong> : Content-Type: application/json</li>
              <li>• <strong>Avec image</strong> : Content-Type: multipart/form-data</li>
              <li>• <strong>Formats d'image</strong> : JPG, PNG, GIF, WebP, SVG (max 5MB)</li>
              <li>• <strong>Dimensions recommandées</strong> : 1200x630 pixels</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-blue-800 mb-2">🔄 Workflow des statuts</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>DRAFT</strong> → Brouillon (modifiable)</li>
              <li>• <strong>PENDING</strong> → En attente d'approbation</li>
              <li>• <strong>PUBLISHED</strong> → Publié (visible)</li>
              <li>• <strong>REJECTED</strong> → Refusé (modifiable)</li>
              <li>• <strong>ARCHIVED</strong> → Archivé</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistiques selon la documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-file-alt text-fuchsia-600 text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total articles</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-clock text-yellow-600 text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.filter(article => article.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-check-circle text-green-600 text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Publiés</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.filter(article => article.status === 'PUBLISHED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-star text-blue-600 text-2xl"></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En vedette</p>
              <p className="text-2xl font-bold text-gray-900">
                {articles.filter(article => article.is_featured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des articles selon la documentation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Articles du recruteur ({articles.length})
          </h3>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <i className="fas fa-spinner fa-spin text-4xl text-fuchsia-600 mb-4"></i>
            <p className="text-gray-600">Chargement des articles...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
            <p className="text-red-600">{error}</p>
          </div>
        ) : articles.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {articles.map((article) => {
              const statusInfo = getStatusInfo(article.status);
              
              return (
                <div key={article.id} className="p-4 hover:bg-gray-50 transition duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`${statusInfo.color} px-2 py-1 rounded-full text-xs font-medium`}>
                          {statusInfo.label}
                        </span>
                        {article.is_featured && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            En vedette
                          </span>
                        )}
                        {article.featured_image && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Avec image
                          </span>
                        )}
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {article.title}
                      </h4>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center">
                          <i className="fas fa-calendar mr-1"></i>
                          Créé le {new Date(article.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        {article.updated_at && article.updated_at !== article.created_at && (
                          <span className="flex items-center">
                            <i className="fas fa-edit mr-1"></i>
                            Modifié le {new Date(article.updated_at).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                        <span className="flex items-center">
                          <i className="fas fa-tag mr-1"></i>
                          {article.category?.name || 'Sans catégorie'}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-400">
                        {statusInfo.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        to={`/blog/${article.slug}`}
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                        title="Voir l'article"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                      
                      <Link
                        to={`/recruteur/blog/publier?edit=${article.slug}`}
                        className="text-green-600 hover:text-green-800 transition duration-200"
                        title="Modifier l'article"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-newspaper text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500 mb-4">Aucun article trouvé.</p>
            <Link
              to="/recruteur/blog/publier"
              className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              Créer votre premier article
            </Link>
          </div>
        )}
      </div>

      {/* Informations techniques */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Informations techniques</h3>
        
        <div className="text-sm text-gray-700 space-y-2">
          <p>• <strong>Endpoint principal</strong> : <code className="bg-gray-100 px-1 rounded">/api/blog/posts/</code></p>
          <p>• <strong>Méthode de récupération</strong> : <code className="bg-gray-100 px-1 rounded">blogService.getMyPosts()</code></p>
          <p>• <strong>Gestion des statuts</strong> : Selon la documentation officielle</p>
          <p>• <strong>Validation des images</strong> : Formats et tailles selon les spécifications</p>
          <p>• <strong>Workflow d'approbation</strong> : DRAFT → PENDING → PUBLISHED</p>
        </div>
      </div>
    </div>
  );
};

export default BlogGererDocumentation;
