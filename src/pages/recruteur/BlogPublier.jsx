import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BlogPublier = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    excerpt: '',
    content: '',
    image: '',
    tags: '',
    isPublished: false,
    isFeatured: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'recrutement', label: 'Recrutement', color: 'bg-blue-100 text-blue-800' },
    { value: 'entreprise', label: 'Vie d\'entreprise', color: 'bg-purple-100 text-purple-800' },
    { value: 'formation', label: 'Formation', color: 'bg-green-100 text-green-800' },
    { value: 'actualite', label: 'Actualités', color: 'bg-orange-100 text-orange-800' },
    { value: 'conseils', label: 'Conseils carrière', color: 'bg-pink-100 text-pink-800' },
    { value: 'tendances', label: 'Tendances', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Article soumis:', formData);
    alert('Article publié avec succès !');
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      title: '',
      category: '',
      excerpt: '',
      content: '',
      image: '',
      tags: '',
      isPublished: false,
      isFeatured: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <i className="fas fa-plus text-fuchsia-600 mr-3"></i>
              Publier un article
            </h1>
            <p className="text-gray-600">Créez et publiez des articles pour partager vos expertises et actualités</p>
          </div>
          <Link 
            to="/recruteur/blog/gerer" 
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200"
          >
            <i className="fas fa-list mr-2"></i>
            Gérer mes articles
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'article *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Entrez le titre de votre article..."
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image principale
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Laissez vide pour utiliser une image par défaut</p>
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Extrait/Description *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="3"
              required
              value={formData.excerpt}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
              placeholder="Résumez votre article en quelques lignes..."
            />
            <p className="text-xs text-gray-500 mt-1">Maximum 200 caractères</p>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Contenu de l'article *
            </label>
            <textarea
              id="content"
              name="content"
              rows="12"
              required
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
              placeholder="Rédigez votre article ici..."
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">Utilisez le formatage Markdown pour enrichir votre contenu</p>
              <div className="flex space-x-2">
                <button type="button" className="text-xs text-fuchsia-600 hover:text-fuchsia-800">
                  <i className="fas fa-bold mr-1"></i>Gras
                </button>
                <button type="button" className="text-xs text-fuchsia-600 hover:text-fuchsia-800">
                  <i className="fas fa-italic mr-1"></i>Italique
                </button>
                <button type="button" className="text-xs text-fuchsia-600 hover:text-fuchsia-800">
                  <i className="fas fa-link mr-1"></i>Lien
                </button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags/Mots-clés
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="recrutement, talents, entreprise, formation (séparés par des virgules)"
            />
            <p className="text-xs text-gray-500 mt-1">Séparez les tags par des virgules</p>
          </div>

          {/* Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Options de publication</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                  Publier immédiatement
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                  Mettre en vedette (article principal)
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.title && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu</h3>
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center mb-3">
                  {formData.category && (
                    <span className={`${categories.find(c => c.value === formData.category)?.color} px-2 py-1 rounded-full text-xs font-medium`}>
                      {categories.find(c => c.value === formData.category)?.label}
                    </span>
                  )}
                  <span className="text-gray-500 text-sm ml-3">
                    <i className="fas fa-calendar mr-1"></i>
                    {new Date().toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title}</h4>
                {formData.excerpt && (
                  <p className="text-gray-600 text-sm">{formData.excerpt}</p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Link 
              to="/recruteur/blog/gerer" 
              className="text-gray-600 hover:text-gray-800 transition duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Annuler
            </Link>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isPublished: false }))}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Sauvegarder en brouillon
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Publication...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    Publier l'article
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPublier; 