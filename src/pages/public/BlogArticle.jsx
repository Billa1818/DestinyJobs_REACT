import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import blogService from '../../services/blogService';

const BlogArticle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les données de l'API
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // Charger l'article au montage du composant
  useEffect(() => {
    if (slug) {
      loadArticle();
    }
  }, [slug]);

  // Charger l'article depuis l'API
  const loadArticle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger le détail de l'article
      const articleData = await blogService.getPublicPostDetail(slug);
      setArticle(articleData);

      // Charger les articles similaires
      const relatedResponse = await blogService.getPublicPosts({
        category: articleData.category?.id,
        page_size: 3,
        ordering: '-publish_date'
      });
      
      // Exclure l'article actuel des articles similaires
      const filteredRelated = relatedResponse.results?.filter(a => a.slug !== slug) || [];
      setRelatedArticles(filteredRelated);

    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      
      if (error.response?.status === 404 || error.response?.status === 403) {
        // Rediriger vers la page 404 pour les articles non trouvés ou non accessibles
        navigate('/404', { replace: true });
        return;
      }
      
      setError('Erreur lors du chargement de l\'article. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Gérer le like d'un article
  const handleLike = async () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour liker un article. Veuillez vous connecter.');
      return;
    }
    
    try {
      const response = await blogService.toggleLike(slug);
      
      if (response.liked) {
        setLiked(true);
        setArticle(prev => ({ ...prev, likes_count: response.likes_count }));
      } else {
        setLiked(false);
        setArticle(prev => ({ ...prev, likes_count: response.likes_count }));
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
      alert('Erreur lors du like. Veuillez réessayer.');
    }
  };

  // Gérer le partage d'un article
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error);
    }
  };

  // Gérer la sauvegarde d'un article
  const handleSave = () => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour sauvegarder un article.');
      return;
    }
    alert('Article sauvegardé dans vos favoris !');
  };

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-fuchsia-600 mb-4"></i>
            <p className="text-gray-600">Chargement de l'article...</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher une erreur si le chargement a échoué
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadArticle}
            className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Si pas d'article, ne rien afficher
  if (!article) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex mb-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-fuchsia-600">
              <i className="fas fa-home mr-2"></i>
              Accueil
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <Link to="/blog" className="text-sm font-medium text-gray-700 hover:text-fuchsia-600">
                Blog
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <i className="fas fa-chevron-right text-gray-400 mx-2"></i>
              <span className="text-sm font-medium text-gray-500">{article.title}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {article.featured_image && (
          <img src={article.featured_image} alt={article.title} className="w-full h-64 lg:h-80 object-cover" />
        )}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-medium">
              {article.category?.name || 'Sans catégorie'}
            </span>
            <span className="text-gray-500 text-sm ml-4">
              <i className="fas fa-calendar mr-1"></i>
              {new Date(article.publish_date || article.created_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="text-gray-500 text-sm ml-4">
              <i className="fas fa-clock mr-1"></i>
              {Math.ceil((article.content?.length || 0) / 200)} min de lecture
            </span>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
          <p className="text-lg text-gray-600 mb-6">{article.excerpt}</p>
          
          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">{article.author?.username || 'Auteur inconnu'}</h3>
              <p className="text-sm text-gray-600">Auteur de l'article</p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 ${
                  liked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className={`fas fa-heart ${liked ? 'text-red-600' : ''}`}></i>
                <span>{article.likes_count || 0}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-share"></i>
                <span>Partager</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200"
              >
                <i className="fas fa-bookmark"></i>
                <span>Sauvegarder</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <i className="fas fa-eye mr-1"></i>
                {article.views_count || 0} vues
              </span>
              <span className="flex items-center">
                <i className="fas fa-comment mr-1"></i>
                {article.comments_count || 0} commentaires
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div 
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          {article.tags_list && article.tags_list.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                <i className="fas fa-tags text-fuchsia-600 mr-2"></i>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags_list.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              <i className="fas fa-user text-fuchsia-600 mr-2"></i>
              À propos de l'auteur
            </h3>
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-2">{article.author?.username || 'Auteur inconnu'}</h4>
              <p className="text-sm text-gray-600 mb-4">Auteur de l'article</p>
              <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm">
                Voir le profil
              </button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Newsletter</h3>
            <p className="text-sm mb-4 text-fuchsia-100">Recevez les derniers articles directement dans votre boîte mail</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500"
              />
              <button className="w-full bg-white text-fuchsia-600 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium">
                S'abonner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <i className="fas fa-comments text-fuchsia-600 mr-2"></i>
          Commentaires ({article.comments_count || 0})
        </h2>
        
        {!isLoggedIn ? (
          <div className="text-center py-8">
            <i className="fas fa-lock text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500 mb-4">Connectez-vous pour laisser un commentaire</p>
            <Link 
              to="/login" 
              className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <textarea 
                  placeholder="Ajoutez votre commentaire..." 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none"
                  rows="3"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200">
                    Publier
                  </button>
                </div>
              </div>
            </div>
            
            {/* Ici vous pouvez ajouter l'affichage des commentaires existants */}
            <div className="text-center py-4 text-gray-500">
              <p>Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
            </div>
          </div>
        )}
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            <i className="fas fa-newspaper text-fuchsia-600 mr-2"></i>
            Articles similaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArticles.map((relatedArticle) => (
              <div key={relatedArticle.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                {relatedArticle.featured_image && (
                  <img src={relatedArticle.featured_image} alt="Article" className="w-full h-32 object-cover" />
                )}
                <div className="p-4">
                  <span className="bg-fuchsia-100 text-fuchsia-800 px-2 py-1 rounded-full text-xs font-medium">
                    {relatedArticle.category?.name || 'Sans catégorie'}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-2">
                    <Link to={`/blog/${relatedArticle.slug}`}>
                      {relatedArticle.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{relatedArticle.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(relatedArticle.publish_date || relatedArticle.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span>{Math.ceil((relatedArticle.content?.length || 0) / 200)} min de lecture</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogArticle;
