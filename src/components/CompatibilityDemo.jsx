import React from 'react';
import { Link } from 'react-router-dom';

const CompatibilityDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-robot text-fuchsia-600 mr-3"></i>
            Système de Compatibilité IA - Version 2.0
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez notre nouvelle API unifiée pour l'analyse de compatibilité IA
          </p>
        </div>

        {/* Nouvelle API Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            <i className="fas fa-info-circle mr-2"></i>
            Nouvelle API Unifiée
          </h2>
          <p className="text-blue-800 mb-4">
            Nous utilisons maintenant un <strong>endpoint unique</strong> pour tous les types d'offres :
          </p>
          <div className="bg-blue-100 rounded-lg p-4 font-mono text-sm text-blue-900">
            POST /api/applications/ai/calculate-compatibility/
          </div>
        </div>

        {/* Fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-chart-line text-4xl text-fuchsia-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Score Unifié</h3>
              <p className="text-gray-600">
                Un seul endpoint pour tous les types d'offres avec analyse IA avancée
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-brain text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">IA Améliorée</h3>
              <p className="text-gray-600">
                Nouveaux critères d'analyse spécifiques à chaque type d'offre
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-save text-4xl text-green-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sauvegarde Auto</h3>
              <p className="text-gray-600">
                Les scores sont automatiquement sauvegardés en base de données
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-shield-alt text-4xl text-purple-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sécurité Renforcée</h3>
              <p className="text-gray-600">
                Permissions granulaires : RECRUTEUR, ADMIN uniquement
              </p>
            </div>
          </div>
        </div>

        {/* Nouveaux critères d'analyse */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Nouveaux Critères d'Analyse
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Emplois */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                <i className="fas fa-briefcase mr-2"></i>
                Emplois (JOB)
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Compétences techniques</li>
                <li>• Expérience professionnelle</li>
                <li>• Formation</li>
                <li>• Localisation</li>
                <li>• Salaire</li>
                <li>• Culture d'entreprise</li>
              </ul>
            </div>

            {/* Consultations */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-600 mb-3">
                <i className="fas fa-comments mr-2"></i>
                Consultations
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Expertise métier</li>
                <li>• Portfolio</li>
                <li>• Disponibilité</li>
                <li>• Tarifs</li>
                <li>• Références</li>
              </ul>
            </div>

            {/* Financements */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-yellow-600 mb-3">
                <i className="fas fa-money-bill-wave mr-2"></i>
                Financements
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Plan d'affaires</li>
                <li>• Profil financier</li>
                <li>• Garanties</li>
                <li>• Rentabilité</li>
                <li>• Évaluation du risque</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nouvelle échelle de scores */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Nouvelle Échelle de Scores
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full mr-3"></div>
                <span className="font-medium">90-100 : Excellente compatibilité</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-400 rounded-full mr-3"></div>
                <span className="font-medium">80-89 : Très bonne compatibilité</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-500 rounded-full mr-3"></div>
                <span className="font-medium">70-79 : Bonne compatibilité</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-400 rounded-full mr-3"></div>
                <span className="font-medium">60-69 : Compatibilité moyenne</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full mr-3"></div>
                <span className="font-medium">50-59 : Compatibilité faible</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-600 rounded-full mr-3"></div>
                <span className="font-medium">0-49 : Compatibilité très faible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Comment ça marche ?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cliquez sur "Postuler"</h3>
                <p className="text-gray-600">
                  Sur n'importe quelle offre, cliquez sur le bouton "Postuler" pour commencer l'analyse IA.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyse IA Unifiée</h3>
                <p className="text-gray-600">
                  Notre nouveau système utilise un endpoint unique pour analyser tous les types d'offres.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Critères Spécifiques</h3>
                <p className="text-gray-600">
                  Chaque type d'offre est analysé selon des critères adaptés et pertinents.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Sauvegarde Automatique</h3>
                <p className="text-gray-600">
                  Votre score est automatiquement sauvegardé et accessible dans votre profil.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-fuchsia-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Prêt à tester la nouvelle API ?</h2>
            <p className="text-lg mb-6">
              Découvrez votre score de compatibilité IA avec notre système unifié
            </p>
            <div className="space-x-4">
              <Link
                to="/jobs"
                className="inline-block bg-white text-fuchsia-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
              >
                <i className="fas fa-search mr-2"></i>
                Voir les offres
              </Link>
              <Link
                to="/candidat"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-fuchsia-600 transition duration-200"
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

export default CompatibilityDemo; 