import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';

const BlogImageTest = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Test simple de création d'article sans image
  const testCreateWithoutImage = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const testData = {
        title: 'Test Article - ' + new Date().toISOString(),
        category: '1', // Assurez-vous que cette catégorie existe
        excerpt: 'Article de test pour vérifier la création sans image',
        content: '<p>Contenu de test pour vérifier que la création fonctionne sans image.</p>',
        status: 'DRAFT',
        tags: 'test, blog, api'
      };

      const response = await blogService.createPost(testData);
      setResult({
        success: true,
        data: response,
        message: 'Article créé avec succès sans image !'
      });

    } catch (error) {
      console.error('Erreur lors du test:', error);
      setError({
        message: 'Erreur lors de la création',
        details: error.response?.data || error.message,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  // Test de création avec image (simulation)
  const testCreateWithImage = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Créer un fichier de test (simulation)
      const testFile = new File(['test image content'], 'test-image.jpg', { type: 'image/jpeg' });
      
      const formData = new FormData();
      formData.append('title', 'Test Article avec Image - ' + new Date().toISOString());
      formData.append('category', '1');
      formData.append('excerpt', 'Article de test avec image simulée');
      formData.append('content', '<p>Contenu de test avec image.</p>');
      formData.append('status', 'DRAFT');
      formData.append('tags', 'test, blog, image, api');
      formData.append('featured_image', testFile);

      const response = await blogService.createPost(formData);
      setResult({
        success: true,
        data: response,
        message: 'Article créé avec succès avec image simulée !'
      });

    } catch (error) {
      console.error('Erreur lors du test avec image:', error);
      setError({
        message: 'Erreur lors de la création avec image',
        details: error.response?.data || error.message,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
  };

  // Test de récupération des catégories
  const testCategories = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const categories = await blogService.getCategories();
      setResult({
        success: true,
        data: categories,
        message: `Catégories récupérées avec succès (${categories.length} trouvées)`
      });

    } catch (error) {
      console.error('Erreur lors du test des catégories:', error);
      setError({
        message: 'Erreur lors de la récupération des catégories',
        details: error.response?.data || error.message,
        status: error.response?.status
      });
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Test de l'API Blog - Images</h1>
            <p className="text-gray-600 mt-1">Testez la création d'articles avec et sans images</p>
          </div>
        </div>
      </div>

      {/* Boutons de test */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tests disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={testCategories}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              <i className="fas fa-list mr-2"></i>
              Test Catégories
            </button>
            
            <button
              onClick={testCreateWithoutImage}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50"
            >
              <i className="fas fa-file-alt mr-2"></i>
              Test Sans Image
            </button>
            
            <button
              onClick={testCreateWithImage}
              disabled={loading}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-200 disabled:opacity-50"
            >
              <i className="fas fa-image mr-2"></i>
              Test Avec Image
            </button>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-fuchsia-600 mb-4"></i>
            <p className="text-gray-600">Test en cours...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex">
            <i className="fas fa-exclamation-circle text-red-400 mr-3 mt-0.5"></i>
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error.message}</p>
              {error.status && (
                <p className="text-sm text-red-600 mt-1">Statut: {error.status}</p>
              )}
              {error.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                    Voir les détails
                  </summary>
                  <pre className="mt-2 p-3 bg-red-100 rounded-lg text-xs overflow-x-auto">
                    {JSON.stringify(error.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6">
          <div className="flex">
            <i className="fas fa-check-circle text-green-400 mr-3 mt-0.5"></i>
            <div>
              <h3 className="text-sm font-medium text-green-800">Succès</h3>
              <p className="text-sm text-green-700 mt-1">{result.message}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-green-600 hover:text-green-800">
                  Voir les données
                </summary>
                <pre className="mt-2 p-3 bg-green-100 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      )}

      {/* Informations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <div className="flex">
          <i className="fas fa-info-circle text-blue-400 mr-3 mt-0.5"></i>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Instructions de test</h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>1. <strong>Test Catégories</strong> : Vérifie que les catégories sont accessibles</p>
              <p>2. <strong>Test Sans Image</strong> : Crée un article sans image (devrait fonctionner)</p>
              <p>3. <strong>Test Avec Image</strong> : Crée un article avec image simulée</p>
              <p>• Assurez-vous d\'avoir au moins une catégorie avec l\'ID 1 dans votre base de données</p>
              <p>• Les tests créent des articles en mode "DRAFT" pour éviter la publication automatique</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogImageTest;
