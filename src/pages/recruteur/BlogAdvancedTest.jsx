import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';

const BlogAdvancedTest = () => {
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const addTestResult = (test, status, message, data = null, error = null) => {
    setResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    try {
      // Test 1: Création SANS image (JSON)
      addTestResult('Création sans image', 'running', 'Test en cours...');
      try {
        const testData = {
          title: 'Test Article JSON - ' + new Date().toISOString(),
          category: '1',
          excerpt: 'Article de test sans image (Content-Type: application/json)',
          content: '<p>Contenu de test pour vérifier la création en JSON.</p>',
          status: 'DRAFT',
          is_featured: false,
          meta_description: 'Test JSON sans image',
          tags: 'test, json, sans-image'
        };

        const response = await blogService.createPost(testData);
        addTestResult('Création sans image', 'success', '✅ Article créé avec succès en JSON !', response);
      } catch (error) {
        addTestResult('Création sans image', 'error', `❌ Erreur: ${error.message}`, null, error);
      }

      // Test 2: Création AVEC image (FormData)
      addTestResult('Création avec image', 'running', 'Test en cours...');
      try {
        // Créer un fichier de test
        const testFile = new File(['fake image content'], 'test-image.jpg', { type: 'image/jpeg' });
        
        const formData = new FormData();
        formData.append('title', 'Test Article FormData - ' + new Date().toISOString());
        formData.append('category', '1');
        formData.append('excerpt', 'Article de test avec image (Content-Type: multipart/form-data)');
        formData.append('content', '<p>Contenu de test avec image simulée.</p>');
        formData.append('status', 'DRAFT');
        formData.append('is_featured', 'false');
        formData.append('meta_description', 'Test FormData avec image');
        formData.append('tags', 'test, formdata, avec-image');
        formData.append('featured_image', testFile);

        const response = await blogService.createPost(formData);
        addTestResult('Création avec image', 'success', '✅ Article créé avec succès en FormData !', response);
      } catch (error) {
        addTestResult('Création avec image', 'error', `❌ Erreur: ${error.message}`, null, error);
      }

      // Test 3: Récupération des catégories
      addTestResult('Catégories', 'running', 'Test en cours...');
      try {
        const categories = await blogService.getCategories();
        addTestResult('Catégories', 'success', `✅ ${categories.length} catégories récupérées`, categories);
      } catch (error) {
        addTestResult('Catégories', 'error', `❌ Erreur: ${error.message}`, null, error);
      }

      // Test 4: Articles publics
      addTestResult('Articles publics', 'running', 'Test en cours...');
      try {
        const publicPosts = await blogService.getPublicPosts({ page_size: 3 });
        addTestResult('Articles publics', 'success', `✅ ${publicPosts.results?.length || 0} articles publics récupérés`, publicPosts);
      } catch (error) {
        addTestResult('Articles publics', 'error', `❌ Erreur: ${error.message}`, null, error);
      }

      // Test 5: Articles en vedette
      addTestResult('Articles en vedette', 'running', 'Test en cours...');
      try {
        const featuredPosts = await blogService.getPublicFeaturedPosts();
        addTestResult('Articles en vedette', 'success', `✅ ${featuredPosts.results?.length || 0} articles en vedette récupérés`, featuredPosts);
      } catch (error) {
        addTestResult('Articles en vedette', 'error', `❌ Erreur: ${error.message}`, null, error);
      }

    } catch (error) {
      addTestResult('Tests généraux', 'error', `❌ Erreur générale: ${error.message}`, null, error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '⏳';
      default: return '❓';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'running': return 'text-yellow-600';
      default: return 'text-gray-600';
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Test Avancé de l'API Blog</h1>
            <p className="text-gray-600 mt-1">Tests complets selon la documentation officielle</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearResults}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              <i className="fas fa-trash mr-2"></i>
              Effacer
            </button>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? (
                <span>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Tests en cours...
                </span>
              ) : (
                <span>
                  <i className="fas fa-play mr-2"></i>
                  Lancer tous les tests
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Résultats des tests */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Résultats des tests ({results.length})
          </h3>
        </div>
        
        {results.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-vial text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500">Aucun test exécuté. Cliquez sur "Lancer tous les tests" pour commencer.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">{getStatusIcon(result.status)}</span>
                      <h4 className={`font-semibold ${getStatusColor(result.status)}`}>
                        {result.test}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {result.timestamp}
                      </span>
                    </div>
                    <p className="text-gray-700">{result.message}</p>
                    
                    {result.data && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-fuchsia-600 hover:text-fuchsia-800">
                          Voir les données de réponse
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}

                    {result.error && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                          Voir les détails de l'erreur
                        </summary>
                        <div className="mt-2 p-3 bg-red-50 rounded-lg text-xs">
                          <p className="text-red-800 font-semibold mb-2">Erreur détaillée :</p>
                          <p className="text-red-700 mb-2">Message: {result.error.message}</p>
                          {result.error.response?.status && (
                            <p className="text-red-700 mb-2">Statut: {result.error.response.status}</p>
                          )}
                          {result.error.response?.data && (
                            <pre className="text-red-700 overflow-x-auto">
                              {JSON.stringify(result.error.response.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Informations sur l'API */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex">
          <i className="fas fa-info-circle text-blue-400 mr-3 mt-0.5"></i>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Documentation de l'API</h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p><strong>Test 1 - Sans image :</strong> Content-Type: application/json</p>
              <p><strong>Test 2 - Avec image :</strong> Content-Type: multipart/form-data</p>
              <p><strong>Format des images :</strong> JPG, PNG, GIF, WebP, SVG (max 5MB)</p>
              <p><strong>Dimensions recommandées :</strong> 1200x630 pixels (ratio 1.91:1)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé des tests */}
      {results.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Résumé des tests</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {results.filter(r => r.status === 'success').length}
              </div>
              <div className="text-gray-600">Tests réussis</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {results.filter(r => r.status === 'error').length}
              </div>
              <div className="text-gray-600">Tests échoués</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {results.filter(r => r.status === 'running').length}
              </div>
              <div className="text-gray-600">En cours</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdvancedTest;
