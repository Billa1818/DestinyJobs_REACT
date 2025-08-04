import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BlogCategories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Recrutement', slug: 'recrutement', color: 'bg-blue-100 text-blue-800', count: 24, isActive: true },
    { id: 2, name: 'Vie d\'entreprise', slug: 'entreprise', color: 'bg-purple-100 text-purple-800', count: 18, isActive: true },
    { id: 3, name: 'Formation', slug: 'formation', color: 'bg-green-100 text-green-800', count: 15, isActive: true },
    { id: 4, name: 'Actualités', slug: 'actualite', color: 'bg-orange-100 text-orange-800', count: 12, isActive: true },
    { id: 5, name: 'Conseils carrière', slug: 'conseils', color: 'bg-pink-100 text-pink-800', count: 8, isActive: true },
    { id: 6, name: 'Tendances', slug: 'tendances', color: 'bg-indigo-100 text-indigo-800', count: 6, isActive: false }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    color: 'bg-blue-100 text-blue-800'
  });

  const colorOptions = [
    { value: 'bg-blue-100 text-blue-800', label: 'Bleu', preview: 'bg-blue-100 text-blue-800' },
    { value: 'bg-purple-100 text-purple-800', label: 'Violet', preview: 'bg-purple-100 text-purple-800' },
    { value: 'bg-green-100 text-green-800', label: 'Vert', preview: 'bg-green-100 text-green-800' },
    { value: 'bg-orange-100 text-orange-800', label: 'Orange', preview: 'bg-orange-100 text-orange-800' },
    { value: 'bg-pink-100 text-pink-800', label: 'Rose', preview: 'bg-pink-100 text-pink-800' },
    { value: 'bg-indigo-100 text-indigo-800', label: 'Indigo', preview: 'bg-indigo-100 text-indigo-800' },
    { value: 'bg-red-100 text-red-800', label: 'Rouge', preview: 'bg-red-100 text-red-800' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Jaune', preview: 'bg-yellow-100 text-yellow-800' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      // Update existing category
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, ...formData }
          : cat
      ));
      setEditingCategory(null);
    } else {
      // Add new category
      const newCategory = {
        id: Date.now(),
        ...formData,
        count: 0,
        isActive: true
      };
      setCategories(prev => [...prev, newCategory]);
    }
    
    // Reset form
    setFormData({ name: '', slug: '', color: 'bg-blue-100 text-blue-800' });
    setShowAddForm(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      color: category.color
    });
    setShowAddForm(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    }
  };

  const handleToggleActive = (categoryId) => {
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, isActive: !cat.isActive }
        : cat
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              <i className="fas fa-tags text-fuchsia-600 mr-3"></i>
              Gérer les catégories
            </h1>
            <p className="text-gray-600">Organisez vos articles avec des catégories personnalisées</p>
          </div>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingCategory(null);
              setFormData({ name: '', slug: '', color: 'bg-blue-100 text-blue-800' });
            }}
            className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            Nouvelle catégorie
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  placeholder="Ex: Recrutement"
                />
              </div>
              
              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  placeholder="Ex: recrutement"
                />
                <p className="text-xs text-gray-500 mt-1">URL-friendly version du nom</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                Couleur *
              </label>
              <select
                id="color"
                name="color"
                required
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <span className={`${formData.color} px-3 py-1 rounded-full text-sm font-medium`}>
                  Aperçu de la couleur
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingCategory(null);
                  setFormData({ name: '', slug: '', color: 'bg-blue-100 text-blue-800' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                {editingCategory ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories existantes</h3>
          
          {categories.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-tags text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-500">Aucune catégorie créée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200">
                  <div className="flex items-center space-x-4">
                    <span className={`${category.color} px-3 py-1 rounded-full text-sm font-medium`}>
                      {category.name}
                    </span>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{category.count}</span> articles
                    </div>
                    <div className="text-xs text-gray-400">
                      Slug: {category.slug}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(category.id)}
                      className={`p-2 rounded-md transition duration-200 ${
                        category.isActive 
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={category.isActive ? 'Désactiver' : 'Activer'}
                    >
                      <i className={`fas fa-${category.isActive ? 'check-circle' : 'circle'}`}></i>
                    </button>
                    
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-fuchsia-600 hover:text-fuchsia-800 p-2 rounded-md hover:bg-fuchsia-50 transition duration-200"
                      title="Modifier"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50 transition duration-200"
                      title="Supprimer"
                      disabled={category.count > 0}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Usage Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          <i className="fas fa-lightbulb text-blue-600 mr-2"></i>
          Conseils d'utilisation
        </h3>
        <div className="space-y-2 text-sm text-blue-800">
          <p>• Les catégories aident à organiser vos articles et améliorent la navigation</p>
          <p>• Choisissez des noms clairs et descriptifs pour vos catégories</p>
          <p>• Vous ne pouvez pas supprimer une catégorie qui contient des articles</p>
          <p>• Désactivez temporairement une catégorie au lieu de la supprimer</p>
        </div>
      </div>
    </div>
  );
};

export default BlogCategories; 