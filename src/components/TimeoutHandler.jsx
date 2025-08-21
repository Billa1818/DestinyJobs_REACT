import React from 'react';

const TimeoutHandler = ({ error, onRetry, onCancel }) => {
  const isTimeoutError = error?.message?.includes('temps') || 
                        error?.message?.includes('timeout') ||
                        error?.code === 'ECONNABORTED';

  if (!isTimeoutError) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center">
        <i className="fas fa-clock text-yellow-500 text-4xl mb-4"></i>
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Analyse IA en cours...
        </h2>
        <p className="text-yellow-700 mb-4">
          L'analyse de compatibilité IA prend plus de temps que prévu. 
          Cela peut arriver lors de l'analyse de profils complexes.
        </p>
        
        <div className="bg-yellow-100 rounded-lg p-3 mb-4 text-left">
          <h3 className="font-medium text-yellow-800 mb-2">
            <i className="fas fa-lightbulb mr-2"></i>
            Solutions :
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Attendre quelques instants et réessayer</li>
            <li>• Vérifier votre connexion internet</li>
            <li>• Essayer à un moment moins chargé</li>
          </ul>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-yellow-300 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-100 transition duration-200"
          >
            Annuler
          </button>
          <button
            onClick={onRetry}
            className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-200"
          >
            <i className="fas fa-redo mr-2"></i>
            Réessayer
          </button>
        </div>
        
        <p className="text-xs text-yellow-600 mt-3">
          ⏱️ L'analyse IA peut prendre jusqu'à 2 minutes pour les profils complexes
        </p>
      </div>
    </div>
  );
};

export default TimeoutHandler; 