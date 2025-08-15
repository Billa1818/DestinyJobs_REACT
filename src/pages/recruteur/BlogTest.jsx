import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import blogService from '../../services/blogService';

const BlogTest = () => {
  const { isAuthenticated, user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (test, status, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runAllTests = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Récupération des catégories
      addTestResult('Catégories', 'running', 'Test en cours...');
      try {
        const categories = await blogService.getCategories();
        addTestResult('Catégories', 'success', `✅ ${categories.length} catégories récupérées`, categories);
      } catch (error) {
        addTestResult('Catégories', 'error', `❌ Erreur: ${error.message}`, error);
      }

      // Test 2: Articles publics
      addTestResult('Articles publics', 'running', 'Test en cours...');
      try {
        const publicPosts = await blogService.getPublicPosts({ page_size: 5 });
        addTestResult('Articles publics', 'success', `✅ ${publicPosts.results?.length || 0} articles publics récupérés`, publicPosts);
      } catch (error) {
        addTestResult('Articles publics', 'error', `❌ Erreur: ${error.message}`, error);
      }

      // Test 3: Articles en vedette
      addTestResult('Articles en vedette', 'running', 'Test en cours...');
      try {
        const featuredPosts = await blogService.getPublicFeaturedPosts();
        addTestResult('Articles en vedette', 'success', `✅ ${featuredPosts.results?.length || 0} articles en vedette récupérés`, featuredPosts);
      } catch (error) {
        addTestResult('Articles en vedette', 'error', `❌ Erreur: ${error.message}`, error);
      }

      // Test 4: Articles récents
      addTestResult('Articles récents', 'running', 'Test en cours...');
      try {
        const recentPosts = await blogService.getPublicRecentPosts();
        addTestResult('Articles récents', 'success', `✅ ${recentPosts.results?.length || 0} articles récents récupérés`, recentPosts);
      } catch (error) {
        addTestResult('Articles récents', 'error', `❌ Erreur: ${error.message}`, error);
      }

      // Test 5: Articles du recruteur (si connecté)
      if (isAuthenticated && user?.user_type === 'RECRUTEUR') {
        addTestResult('Mes articles', 'running', 'Test en cours...');
        try {
          const myPosts = await blogService.getMyPosts({ page_size: 5 });
          addTestResult('Mes articles', 'success', `✅ ${myPosts.results?.length || 0} de mes articles récupérés`, myPosts);
        } catch (error) {
          addTestResult('Mes articles', 'error', `❌ Erreur: ${error.message}`, error);
        }
      }

    } catch (error) {
      addTestResult('Tests généraux', 'error', `❌ Erreur générale: ${error.message}`, error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Test de l'API Blog</h1>
            <p className="text-gray-600 mt-1">Vérifiez que tous les endpoints de l'API blog fonctionnent correctement</p>
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
                  Lancer les tests
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
            Résultats des tests ({testResults.length})
          </h3>
        </div>
        
        {testResults.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-vial text-gray-400 text-4xl mb-4"></i>
            <p className="text-gray-500">Aucun test exécuté. Cliquez sur "Lancer les tests" pour commencer.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {testResults.map((result, index) => (
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
                          Voir les données
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
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
            <h3 className="text-sm font-medium text-blue-800">Informations sur l'API</h3>
            <div className="text-sm text-blue-700 mt-1 space-y-1">
              <p>• Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:8000'}</p>
              <p>• Endpoint principal: /api/blog/</p>
              <p>• Authentification: JWT Bearer Token</p>
              <p>• Format des données: JSON pour les requêtes, FormData pour les fichiers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogTest;
