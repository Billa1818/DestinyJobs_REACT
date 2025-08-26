import React, { useState } from 'react';
import ProviderProfilService from '../../services/ProviderProfilService';

const DebugProfile = () => {
  const [debugInfo, setDebugInfo] = useState('');
  const [testData, setTestData] = useState({
    provider_type: 'INDIVIDUAL',
    specializations: 'Test spécialisations',
    hourly_rate: '50.00',
    daily_rate: '400.00',
    availability: 'AVAILABLE',
    years_experience: '5',
    // Ces champs ne doivent PAS être envoyés s'ils sont vides
    image: null,
    cv: null,
    portfolio: null,
    organization_logo: null
  });

  const [testFiles, setTestFiles] = useState({});

  const runDebugTest = async () => {
    try {
      setDebugInfo('🔍 Début du test de débogage...\n\n');

      // 1. Afficher les données de test
      setDebugInfo(prev => prev + '📊 Données de test:\n');
      setDebugInfo(prev => prev + JSON.stringify(testData, null, 2) + '\n\n');

      // 2. Afficher les fichiers
      setDebugInfo(prev => prev + '📁 Fichiers de test:\n');
      setDebugInfo(prev => prev + JSON.stringify(testFiles, null, 2) + '\n\n');

      // 3. Tester la validation
      setDebugInfo(prev => prev + '✅ Test de validation:\n');
      const validation = ProviderProfilService.validateProfileData(testData);
      setDebugInfo(prev => prev + JSON.stringify(validation, null, 2) + '\n\n');

      if (!validation.isValid) {
        setDebugInfo(prev => prev + '❌ Validation échouée, arrêt du test\n');
        return;
      }

      // 4. Préparer le FormData
      setDebugInfo(prev => prev + '📤 Préparation du FormData:\n');
      const formData = ProviderProfilService.prepareProfileData(testData, testFiles);
      
      setDebugInfo(prev => prev + '📋 Contenu du FormData:\n');
      for (let [key, value] of formData.entries()) {
        setDebugInfo(prev => prev + `  ${key}: ${value} (type: ${typeof value})\n`);
      }
      setDebugInfo(prev => prev + '\n');

      // 5. Vérifier qu'aucun champ de fichier n'est présent avec une valeur vide
      const fileFields = ['image', 'cv', 'portfolio', 'organization_logo'];
      let hasEmptyFileFields = false;
      
      for (let [key, value] of formData.entries()) {
        if (fileFields.includes(key) && (value === '' || value === 'null' || value === null)) {
          hasEmptyFileFields = true;
          setDebugInfo(prev => prev + `⚠️  ATTENTION: Champ fichier vide détecté: ${key} = ${value}\n`);
        }
      }

      if (hasEmptyFileFields) {
        setDebugInfo(prev => prev + '\n❌ PROBLÈME DÉTECTÉ: Des champs de fichiers vides sont présents!\n');
        setDebugInfo(prev => prev + '💡 Solution: Vérifier la méthode prepareProfileData\n');
        return;
      }

      setDebugInfo(prev => prev + '✅ Aucun champ de fichier vide détecté\n\n');

      // 6. Tenter l'envoi à l'API
      setDebugInfo(prev => prev + '🚀 Tentative d\'envoi à l\'API...\n');
      
      try {
        const result = await ProviderProfilService.updateProviderProfile(formData);
        setDebugInfo(prev => prev + '✅ API appelée avec succès!\n');
        setDebugInfo(prev => prev + '📄 Réponse: ' + JSON.stringify(result, null, 2) + '\n');
      } catch (apiError) {
        setDebugInfo(prev => prev + '❌ Erreur API: ' + apiError.message + '\n');
        if (apiError.response) {
          setDebugInfo(prev => prev + '📊 Détails: ' + JSON.stringify(apiError.response.data, null, 2) + '\n');
        }
      }

    } catch (error) {
      setDebugInfo(prev => prev + '💥 Erreur générale: ' + error.message + '\n');
    }
  };

  const addTestFile = (field) => {
    // Créer un fichier de test
    const testFile = new File(['contenu de test'], `test_${field}.txt`, { type: 'text/plain' });
    setTestFiles(prev => ({ ...prev, [field]: testFile }));
    setDebugInfo(prev => prev + `📁 Fichier de test ajouté pour ${field}: ${testFile.name}\n`);
  };

  const clearDebug = () => {
    setDebugInfo('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔍 Debug ProviderProfilService</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panneau de contrôle */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">🎮 Contrôles de test</h2>
          
          <div className="space-y-4">
            <button
              onClick={runDebugTest}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              🚀 Lancer le test de débogage
            </button>
            
            <button
              onClick={clearDebug}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              🗑️ Effacer le débogage
            </button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">📁 Ajouter des fichiers de test:</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addTestFile('image')}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
              >
                + Image
              </button>
              <button
                onClick={() => addTestFile('cv')}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
              >
                + CV
              </button>
              <button
                onClick={() => addTestFile('portfolio')}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
              >
                + Portfolio
              </button>
              <button
                onClick={() => addTestFile('organization_logo')}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
              >
                + Logo
              </button>
            </div>
          </div>
        </div>

        {/* Affichage des données de test */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">📊 Données de test actuelles</h2>
          
          <div className="space-y-2">
            <div>
              <strong>Type:</strong> {testData.provider_type}
            </div>
            <div>
              <strong>Spécialisations:</strong> {testData.specializations}
            </div>
            <div>
              <strong>Taux horaire:</strong> {testData.hourly_rate} FCFA
            </div>
            <div>
              <strong>Fichiers:</strong> {Object.keys(testFiles).filter(k => testFiles[k]).length} fichier(s) sélectionné(s)
            </div>
          </div>
        </div>
      </div>

      {/* Zone de débogage */}
      <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">🔍 Log de débogage</h3>
          <span className="text-xs text-gray-400">Console en temps réel</span>
        </div>
        <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
          {debugInfo || 'Cliquez sur "Lancer le test de débogage" pour commencer...'}
        </pre>
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <i className="fas fa-info-circle text-yellow-400"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Instructions:</strong> Ce composant vous permet de déboguer le service ProviderProfilService.
              Utilisez-le pour identifier les problèmes avec les champs de fichiers et la préparation des données.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugProfile; 