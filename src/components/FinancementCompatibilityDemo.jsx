import React from 'react';
import { Link } from 'react-router-dom';

const FinancementCompatibilityDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-money-bill-wave text-green-600 mr-3"></i>
            Compatibilité IA pour les Financements
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez comment notre IA analyse votre compatibilité avec les offres de financement
          </p>
        </div>

        {/* Fonctionnalités spécifiques aux financements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-chart-line text-4xl text-green-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyse Financière IA</h3>
              <p className="text-gray-600">
                Évaluation intelligente de votre profil financier et de votre projet
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-brain text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scoring Automatique</h3>
              <p className="text-gray-600">
                Score de compatibilité basé sur des critères financiers avancés
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-shield-alt text-4xl text-purple-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Évaluation des Risques</h3>
              <p className="text-gray-600">
                Analyse intelligente du niveau de risque de votre projet
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-lightbulb text-4xl text-yellow-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recommandations</h3>
              <p className="text-gray-600">
                Conseils personnalisés pour améliorer votre dossier de financement
              </p>
            </div>
          </div>
        </div>

        {/* Critères d'analyse pour les financements */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Critères d'Analyse IA pour les Financements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-green-700 mb-3">
                <i className="fas fa-file-alt mr-2"></i>
                Plan d'Affaires
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Qualité et cohérence du business plan</li>
                <li>• Viabilité économique du projet</li>
                <li>• Stratégie de développement</li>
                <li>• Analyse de marché</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-700 mb-3">
                <i className="fas fa-chart-pie mr-2"></i>
                Profil Financier
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Capacité de remboursement</li>
                <li>• Historique financier</li>
                <li>• Garanties disponibles</li>
                <li>• Flux de trésorerie</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-purple-700 mb-3">
                <i className="fas fa-shield-alt mr-2"></i>
                Garanties et Sécurité
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Qualité des garanties proposées</li>
                <li>• Collatéral disponible</li>
                <li>• Assurance du projet</li>
                <li>• Protection des investisseurs</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-yellow-700 mb-3">
                <i className="fas fa-trending-up mr-2"></i>
                Rentabilité et Risque
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Potentiel de retour sur investissement</li>
                <li>• Évaluation du niveau de risque</li>
                <li>• Scénarios de rentabilité</li>
                <li>• Facteurs de risque identifiés</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Comment ça marche pour les Financements ?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cliquez sur "Postuler"</h3>
                <p className="text-gray-600">
                  Sur n'importe quelle offre de financement, cliquez sur le bouton "Postuler" 
                  pour commencer l'analyse IA de compatibilité.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyse IA Spécialisée</h3>
                <p className="text-gray-600">
                  Notre IA analyse votre profil financier, votre business plan et évalue 
                  la compatibilité avec les critères du financement.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Score de Compatibilité</h3>
                <p className="text-gray-600">
                  Recevez un score précis de votre compatibilité avec l'offre de financement, 
                  basé sur des critères financiers avancés.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Recommandations Financières</h3>
                <p className="text-gray-600">
                  Obtenez des conseils personnalisés pour améliorer votre dossier et 
                  maximiser vos chances d'obtenir le financement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemple de redirection */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            <i className="fas fa-route mr-2"></i>
            Redirection Automatique
          </h2>
          <p className="text-green-700 mb-4">
            Quand vous cliquez sur "Postuler" dans un financement, vous êtes automatiquement 
            redirigé vers l'analyse de compatibilité IA :
          </p>
          <div className="bg-green-100 rounded-lg p-4 font-mono text-sm text-green-800">
            /ia-compatibility/{'{id}'}/financement
          </div>
          <p className="text-green-600 text-sm mt-2">
            L'IA analysera votre profil et calculera votre score de compatibilité avec ce financement.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-green-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Prêt à tester l'IA pour les Financements ?</h2>
            <p className="text-lg mb-6">
              Découvrez votre score de compatibilité IA sur nos offres de financement
            </p>
            <div className="space-x-4">
              <Link
                to="/financements"
                className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
              >
                <i className="fas fa-search mr-2"></i>
                Voir les financements
              </Link>
              <Link
                to="/candidat"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition duration-200"
              >
                <i className="fas fa-user mr-2"></i>
                Mon profil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancementCompatibilityDemo; 