import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';
import { Loader } from '../../components';

const CreeArticle = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  
  // États du composant
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSlug, setEditSlug] = useState(null);

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    status: 'PENDING',
    meta_description: '',
    tags: ''
  });

  // Vérifier l'authentification et les permissions
  useEffect(() => {
    if (!isAuthenticated || user?.user_type !== 'RECRUTEUR') {
      navigate('/login');
      return;
    }
    
    // Vérifier si on est en mode édition
    const editSlug = searchParams.get('edit');
    if (editSlug) {
      setIsEditing(true);
      setEditSlug(editSlug);
      fetchArticleData(editSlug);
    }
    
    fetchCategories();
  }, [isAuthenticated, user, navigate, searchParams]);

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const data = await blogService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  // Récupérer les données d'un article existant
  const fetchArticleData = async (slug) => {
    try {
      setLoading(true);
      const articleData = await blogService.getMyPost(slug);
      
      setFormData({
        title: articleData.title || '',
        category: articleData.category?.id || '',
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        status: articleData.status || 'PENDING',
        meta_description: articleData.meta_description || '',
        tags: articleData.tags || ''
      });

      if (articleData.featured_image) {
        setImagePreview(articleData.featured_image);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestion de la sélection d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validation du type de fichier
      if (!file.type.startsWith('image/')) {
        setError('Veuillez sélectionner un fichier image valide (JPEG, PNG, GIF, etc.)');
        return;
      }

      // Validation de la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille de l\'image ne doit pas dépasser 5MB');
        return;
      }

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  // Supprimer l'image sélectionnée
  const handleRemoveImage = () => {
    setImagePreview(null);
    const fileInput = document.getElementById('featured_image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validation des champs obligatoires
      if (!formData.title.trim()) {
        throw new Error('Le titre est obligatoire');
      }
      if (!formData.category) {
        throw new Error('La catégorie est obligatoire');
      }
      if (!formData.excerpt.trim()) {
        throw new Error('L\'extrait est obligatoire');
      }
      if (!formData.content.trim()) {
        throw new Error('Le contenu est obligatoire');
      }

      let result;
      const imageFile = document.getElementById('featured_image')?.files[0];

      if (isEditing) {
        // Mise à jour d'un article existant
        result = await blogService.updatePost(editSlug, formData, imageFile);
        setSuccessMessage(`Article "${result.title}" modifié avec succès !`);
      } else {
        // Création d'un nouvel article
        if (imageFile) {
          result = await blogService.createPostWithImage(formData, imageFile);
        } else {
          result = await blogService.createPost(formData);
        }
        setSuccessMessage('Article créé avec succès !');
      }

      // Redirection après un délai
      setTimeout(() => {
        navigate('/recruteur/blog-publier', { replace: true });
      }, 2000);

    } catch (error) {
      if (error.response?.data) {
        // Erreur de l'API
        const apiError = error.response.data;
        if (typeof apiError === 'object') {
          const errorMessages = Object.keys(apiError).map(key => 
            `${key}: ${Array.isArray(apiError[key]) ? apiError[key].join(', ') : apiError[key]}`
          );
          setError(`Erreurs de validation: ${errorMessages.join(' | ')}`);
        } else {
          setError(apiError.message || apiError);
        }
      } else {
        // Erreur locale
        setError(error.message || 'Une erreur est survenue lors de la création de l\'article');
      }
    } finally {
      setLoading(false);
    }
  };

  // Annuler et retourner à la liste
  const handleCancel = () => {
    navigate('/recruteur/blog-publier', { replace: true });
  };

  if (loading && !isEditing) {
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
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier l\'article' : 'Créer un nouvel article'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing ? 'Modifiez votre article de blog' : 'Rédigez et publiez un nouvel article de blog'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages d'erreur et de succès */}
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

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <i className="fas fa-check-circle text-green-400 mt-0.5"></i>
            <div className="ml-3">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informations de base et Image */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de base */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <i className="fas fa-edit mr-3 text-fuchsia-600"></i>
                Informations de base
              </h2>
              
              <div className="space-y-6">
                {/* Titre */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                    Titre de l'article *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 text-lg"
                    placeholder="Entrez le titre de votre article"
                    required
                  />
                </div>

                {/* Catégorie */}
                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                    Catégorie *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    required
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Extrait */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-3">
                    Extrait/Résumé *
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                    placeholder="Résumé court de votre article (visible dans les aperçus)"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Description courte qui résume le contenu de votre article
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image d'en-tête - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <i className="fas fa-image mr-3 text-fuchsia-600"></i>
                Image d'en-tête
              </h2>
              
              <div className="space-y-4">
                {/* Upload d'image */}
                <div>
                  <label htmlFor="featured_image" className="block text-sm font-semibold text-gray-700 mb-3">
                    Image d'en-tête
                  </label>
                  <input
                    type="file"
                    id="featured_image"
                    name="featured_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Formats: JPEG, PNG, GIF, WebP, SVG<br/>
                    Taille max: 5MB<br/>
                    Dimensions recommandées: 1200x630px
                  </p>
                </div>

                {/* Aperçu de l'image */}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contenu principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-file-text mr-3 text-fuchsia-600"></i>
            Contenu de l'article
          </h2>
          
          <div className="space-y-6">
            {/* Contenu principal */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-3">
                Contenu de l'article *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="16"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 font-mono text-sm"
                placeholder="Contenu complet de votre article..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Utilisez le formatage Markdown pour une meilleure présentation
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Métadonnées et options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <i className="fas fa-cog mr-3 text-fuchsia-600"></i>
            Métadonnées et options
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description SEO */}
            <div className="md:col-span-2">
              <label htmlFor="meta_description" className="block text-sm font-semibold text-gray-700 mb-3">
                Description SEO
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="Description pour les moteurs de recherche (optionnel)"
              />
              <p className="text-xs text-gray-500 mt-2">
                Description courte qui apparaîtra dans les résultats de recherche
              </p>
            </div>

            {/* Tags */}
            <div className="md:col-span-2">
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-3">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                placeholder="tag1, tag2, tag3 (séparés par des virgules)"
              />
              <p className="text-xs text-gray-500 mt-2">
                Mots-clés pour catégoriser votre article
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Actions du formulaire */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-8 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {isEditing ? 'Modification...' : 'Création...'}
                </span>
              ) : (
                <span>
                  <i className={`${isEditing ? 'fas fa-save' : 'fas fa-plus'} mr-2`}></i>
                  {isEditing ? 'Modifier l\'article' : 'Créer l\'article'}
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreeArticle; 