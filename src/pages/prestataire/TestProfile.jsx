import React, { useState } from 'react';
import ProviderProfilService from '../../services/ProviderProfilService';

const TestProfile = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Test simple avec des données minimales
  const testSimpleUpdate = async () => {
    try {
      setLoading(true);
      setTestResult('Test en cours...');

      // Données de test minimales
      const testData = {
        provider_type: 'INDIVIDUAL',
        specializations: 'Test spécialisations',
        hourly_rate: '50.00',
        daily_rate: '400.00',
        availability: 'AVAILABLE',
        years_experience: '5'
      };

      // Aucun fichier pour ce test
      const testFiles = {};

      console.log('🧪 Données de test:', testData);
      console.log('🧪 Fichiers de test:', testFiles);

      // Préparer les données
      const formData = ProviderProfilService.prepareProfileData(testData, testFiles);

      console.log('🧪 FormData préparé:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // Tester la validation
      const validation = ProviderProfilService.validateProfileData(testData);
      console.log('🧪 Validation:', validation);

      if (!validation.isValid) {
        setTestResult(`❌ Validation échouée: ${validation.errors.join(', ')}`);
        return;
      }

      // Tenter la mise à jour
      const result = await ProviderProfilService.updateProviderProfile(formData);
      console.log('🧪 Résultat API:', result);
      
      setTestResult('✅ Test réussi ! Profil mis à jour.');
    } catch (error) {
      console.error('🧪 Erreur de test:', error);
      setTestResult(`❌ Erreur: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  // Test avec récupération du profil
  const testGetProfile = async () => {
    try {
      setLoading(true);
      setTestResult('Récupération du profil...');

      const profile = await ProviderProfilService.getProviderProfile();
      console.log('🧪 Profil récupéré:', profile);
      
      setTestResult(`✅ Profil récupéré: ${profile.provider_type || 'Type non défini'}`);
    } catch (error) {
      console.error('🧪 Erreur récupération:', error);
      setTestResult(`❌ Erreur récupération: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🧪 Test ProviderProfilService</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testGetProfile}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Test en cours...' : 'Test Récupération Profil'}
        </button>
        
        <button
          onClick={testSimpleUpdate}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
        >
          {loading ? 'Test en cours...' : 'Test Mise à Jour Simple'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Résultat du test:</h3>
        <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
      </div>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-yellow-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> Ce composant de test vous permet de vérifier que le service fonctionne correctement.
              Vérifiez la console du navigateur pour plus de détails.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestProfile; 