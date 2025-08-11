import React, { useState } from 'react';

const ApiTest = () => {
  const [testUserId, setTestUserId] = useState('test-user-123');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      console.log('🧪 Test de l\'API avec userId:', testUserId);
      
      // Test 1: Endpoint direct
      console.log('📡 Test 1: Endpoint direct');
      const response1 = await fetch(`/api/auth/public/candidates/${testUserId}/`);
      console.log('📊 Réponse 1:', response1.status, response1.statusText);
      
      const contentType1 = response1.headers.get('content-type');
      console.log('📄 Content-Type 1:', contentType1);
      
      let data1;
      try {
        if (contentType1 && contentType1.includes('application/json')) {
          data1 = await response1.json();
          console.log('✅ Données JSON 1:', data1);
        } else {
          const text1 = await response1.text();
          console.log('📝 Texte 1:', text1.substring(0, 200));
          data1 = { type: 'text', content: text1.substring(0, 200) };
        }
      } catch (parseError) {
        console.error('❌ Erreur parsing 1:', parseError);
        data1 = { type: 'error', error: parseError.message };
      }

      // Test 2: Avec headers
      console.log('📡 Test 2: Avec headers');
      const response2 = await fetch(`/api/auth/public/candidates/${testUserId}/`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('📊 Réponse 2:', response2.status, response2.statusText);
      
      const contentType2 = response2.headers.get('content-type');
      console.log('📄 Content-Type 2:', contentType2);
      
      let data2;
      try {
        if (contentType2 && contentType2.includes('application/json')) {
          data2 = await response2.json();
          console.log('✅ Données JSON 2:', data2);
        } else {
          const text2 = await response2.text();
          console.log('📝 Texte 2:', text2.substring(0, 200));
          data2 = { type: 'text', content: text2.substring(0, 200) };
        }
      } catch (parseError) {
        console.error('❌ Erreur parsing 2:', parseError);
        data2 = { type: 'error', error: parseError.message };
      }

      setApiResponse({
        test1: { status: response1.status, data: data1 },
        test2: { status: response2.status, data: data2 }
      });

    } catch (err) {
      console.error('❌ Erreur générale:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            <i className="fas fa-vial mr-2 text-blue-600"></i>
            Test de l'API des Profils Publics
          </h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID de test:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testUserId}
                onChange={(e) => setTestUserId(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez un userId pour tester"
              />
              <button
                onClick={testApi}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-play mr-2"></i>
                )}
                Tester l'API
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {apiResponse && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <i className="fas fa-info-circle text-blue-600 mr-2"></i>
                  Résultats des Tests
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Test 1 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Test 1: Endpoint Direct</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          apiResponse.test1.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {apiResponse.test1.status}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> 
                        <span className="ml-2 text-gray-600">{apiResponse.test1.data.type}</span>
                      </div>
                      <div>
                        <span className="font-medium">Données:</span>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(apiResponse.test1.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Test 2 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Test 2: Avec Headers</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Status:</span> 
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          apiResponse.test2.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {apiResponse.test2.status}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> 
                        <span className="ml-2 text-gray-600">{apiResponse.test2.data.type}</span>
                      </div>
                      <div>
                        <span className="font-medium">Données:</span>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(apiResponse.test2.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  <i className="fas fa-lightbulb text-blue-600 mr-2"></i>
                  Analyse des Résultats
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Status 200</strong> : L'endpoint répond correctement</li>
                  <li>• <strong>Content-Type application/json</strong> : La réponse est en JSON</li>
                  <li>• <strong>Status 404</strong> : L'endpoint existe mais l'utilisateur n'est pas trouvé</li>
                  <li>• <strong>Status 403</strong> : L'endpoint existe mais l'accès est refusé</li>
                  <li>• <strong>Status 500</strong> : Erreur serveur</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="fas fa-code text-gray-600 mr-2"></i>
            Endpoints Testés
          </h3>
          <div className="space-y-2 text-sm font-mono bg-gray-50 p-4 rounded">
            <div>GET /api/auth/public/candidates/{'{userId}'}/</div>
            <div className="text-gray-500">Teste la récupération d'un profil candidat public</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 