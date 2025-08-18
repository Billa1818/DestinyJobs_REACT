import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';
import { Loader } from '../../components';
import NotFound from './NotFound';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  // États du composant
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const articleData = await blogService.getPublicPost(slug);
        setArticle(articleData);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        
        if (error.response?.status === 404 || error.response?.status === 403) {
          setError('NOT_FOUND');
        } else {
          setError('Erreur lors du chargement de l\'article');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Gérer le retour à la liste
  const handleBackToList = () => {
    navigate('/blog');
  };

  // Affichage du loader
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  // Affichage de l'erreur 404
  if (error === 'NOT_FOUND') {
    return <NotFound />;
  }

  // Affichage d'une autre erreur
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i className="fas fa-exclamation-circle text-red-400 text-4xl mb-4"></i>
          <h1 className="text-xl font-semibold text-red-800 mb-2">Erreur</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBackToList}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retour au blog
          </button>
        </div>
      </div>
    );
  }

  // Affichage de l'article
  if (!article) {
    return <NotFound />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">


      {/* Article */}
      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Image d'en-tête */}
        {article.featured_image && (
          <div className="w-full h-64 md:h-96 bg-gray-100">
            <img
              src={article.featured_image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenu de l'article */}
        <div className="p-6 md:p-8">
          {/* En-tête */}
          <header className="mb-8">
            {/* Catégorie et statut */}
            <div className="flex items-center space-x-3 mb-4">
              {article.category && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {article.category.name}
                </span>
              )}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                article.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                article.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {article.status_display || article.status}
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Extrait */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {article.excerpt}
              </p>
            )}

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-6">
                {/* Auteur */}
                {article.author && (
                  <div className="flex items-center">
                    <i className="fas fa-user mr-2"></i>
                    <span>{article.author.first_name} {article.author.last_name}</span>
                  </div>
                )}

                {/* Date de création */}
                <div className="flex items-center">
                  <i className="fas fa-calendar mr-2"></i>
                  <span>Créé le {formatDate(article.created_at)}</span>
                </div>

                {/* Date de publication */}
                {article.publish_date && (
                  <div className="flex items-center">
                    <i className="fas fa-paper-plane mr-2"></i>
                    <span>Publié le {formatDate(article.publish_date)}</span>
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="flex items-center space-x-4">
                {article.views_count > 0 && (
                  <div className="flex items-center">
                    <i className="fas fa-eye mr-2"></i>
                    <span>{article.views_count} vues</span>
                  </div>
                )}
                {article.likes_count > 0 && (
                  <div className="flex items-center">
                    <i className="fas fa-heart mr-2"></i>
                    <span>{article.likes_count} likes</span>
                  </div>
                )}
                {article.comments_count > 0 && (
                  <div className="flex items-center">
                    <i className="fas fa-comment mr-2"></i>
                    <span>{article.comments_count} commentaires</span>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Contenu principal */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Tags */}
          {article.tags_list && article.tags_list.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags_list.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description SEO */}
          {article.meta_description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description SEO</h3>
              <p className="text-sm text-gray-600">{article.meta_description}</p>
            </div>
          )}

          {/* Actions pour l'auteur */}
          {isAuthenticated && user?.id === article.author?.id && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions de l'auteur</h3>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/recruteur/creer-article?edit=${article.slug}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Modifier l'article
                </Link>
                <Link
                  to="/recruteur/blog-publier"
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                >
                  <i className="fas fa-list mr-2"></i>
                  Gérer mes articles
                </Link>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default BlogDetail; 