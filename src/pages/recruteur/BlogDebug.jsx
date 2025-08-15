import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';

const BlogDebug = () => {
  const { isAuthenticated, user } = useAuth();
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const runDebugTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Endpoint principal des articles
      console.log('🔍 Test 1: Endpoint principal des articles');
      try {
        const response = await blogService.getMyPosts();
        results.mainEndpoint = {
          success: true,
          data: response,
          count: response.count || 0,
          results: response.results || []
        };
        console.log('✅ Endpoint principal:', response);
      } catch (error) {
        results.mainEndpoint = {
          success: false,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        };
        console.error('❌ Endpoint principal:', error);
      }

      // Test 2: Endpoint des catégories
      console.log('🔍 Test 2: Endpoint des catégories');
      try {
        const categories = await blogService.getCategories();
        results.categories = {
          success: true,
          data: categories,
          count: categories.length || 0
        };
        console.log('✅ Catégories:', categories);
      } catch (error) {
        results.categories = {
          success: false,
          error: error.message,
          status: error.response?.status
        };
        console.error('❌ Catégories:', error);
      }

      // Test 3: Test direct de l'API
      console.log('🔍 Test 3: Test direct de l\'API');
      try {
        const response = await fetch('/api/blog/posts/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        results.directAPI = {
          success: true,
          status: response.status,
          data: data,
          count: data.count || 0,
          results: data.results || []
        };
        console.log('✅ API directe:', data);
      } catch (error) {
        results.directAPI = {
          success: false,
          error: error.message
        };
        console.error('❌ API directe:', error);
      }

      // Test 4: Test avec différents endpoints
      console.log('🔍 Test 4: Test avec différents endpoints');
      const endpoints = [
        '/api/blog/posts/',
        '/api/blog/my-posts/',
        '/api/blog/recruiter-posts/',
        '/api/blog/posts/recruiter/'
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          });
          const data = await response.json();
          results[endpoint] = {
            success: true,
            status: response.status,
            data: data,
            count: data.count || 0,
            results: data.results || []
          };
          console.log(`✅ ${endpoint}:`, data);
        } catch (error) {
          results[endpoint] = {
            success: false,
            error: error.message
          };
          console.error(`❌ ${endpoint}:`, error);
        }
      }

    } catch (error) {
      console.error('❌ Erreur générale:', error);
      results.generalError = error.message;
    } finally {
      setLoading(false);
    }

    setDebugInfo(results);
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Debug - API Blog</h1>
            <p className="text-gray-600 mt-1">Débogage complet de l\'API blog pour identifier le problème</p>
          </div>
          <button
            onClick={runDebugTests}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Tests en cours...
              </span>
            ) : (
              <span>
                <i className="fas fa-bug mr-2"></i>
                Lancer les tests de debug
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Informations utilisateur */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Informations utilisateur</h3>
        <div className="text-sm text-blue-700">
          <p><strong>Type:</strong> {user?.user_type}</p>
          <p><strong>ID:</strong> {user?.id}</p>
          <p><strong>Token présent:</strong> {localStorage.getItem('token') ? 'Oui' : 'Non'}</p>
        </div>
      </div>

      {/* Résultats des tests */}
      {Object.keys(debugInfo).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Résultats des tests de debug</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {Object.entries(debugInfo).map(([key, result]) => (
              <div key={key} className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{key}</h4>
                
                {result.success ? (
                  <div className="text-green-700">
                    <p>✅ Succès</p>
                    <p>Statut: {result.status || 'N/A'}</p>
                    <p>Nombre d'articles: {result.count || 0}</p>
                    {result.results && result.results.length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-green-600 hover:text-green-800">
                          Voir les articles
                        </summary>
                        <pre className="mt-2 p-3 bg-green-100 rounded-lg text-xs overflow-x-auto">
                          {JSON.stringify(result.results, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ) : (
                  <div className="text-red-700">
                    <p>❌ Erreur</p>
                    <p>Message: {result.error}</p>
                    {result.status && <p>Statut HTTP: {result.status}</p>}
                    {result.data && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                          Voir les détails de l'erreur
                        </summary>
                        <pre className="mt-2 p-3 bg-red-100 rounded-lg text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Instructions de debug</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>1. Cliquez sur "Lancer les tests de debug"</p>
          <p>2. Vérifiez la console du navigateur pour les logs détaillés</p>
          <p>3. Regardez les résultats ci-dessus pour identifier le problème</p>
          <p>4. Vérifiez que l\'endpoint retourne bien des articles</p>
        </div>
      </div>
    </div>
  );
};

export default BlogDebug;
