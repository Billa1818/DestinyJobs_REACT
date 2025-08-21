import React from 'react';
import { Link } from 'react-router-dom';

const ConsultationCompatibilityDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-comments text-blue-600 mr-3"></i>
            Compatibilité IA pour les Consultations
          </h1>
          <p className="text-lg text-gray-600">
            Découvrez comment notre IA analyse votre compatibilité avec les offres de consultation
          </p>
        </div>

        {/* Fonctionnalités spécifiques aux consultations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-user-tie text-4xl text-blue-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyse d'Expertise IA</h3>
              <p className="text-gray-600">
                Évaluation intelligente de votre expertise métier et de votre portfolio
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-brain text-4xl text-purple-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Scoring Automatique</h3>
              <p className="text-gray-600">
                Score de compatibilité basé sur des critères de consultation avancés
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-clock text-4xl text-green-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Disponibilité</h3>
              <p className="text-gray-600">
                Analyse intelligente de votre disponibilité et de votre planning
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center">
              <i className="fas fa-lightbulb text-4xl text-yellow-600 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Recommandations</h3>
              <p className="text-gray-600">
                Conseils personnalisés pour optimiser votre candidature
              </p>
            </div>
          </div>
        </div>

        {/* Critères d'analyse pour les consultations */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Critères d'Analyse IA pour les Consultations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-blue-700 mb-3">
                <i className="fas fa-graduation-cap mr-2"></i>
                Expertise Métier
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Niveau d'expertise dans le domaine</li>
                <li>• Compétences techniques requises</li>
                <li>• Expérience professionnelle</li>
                <li>• Certifications et formations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-green-700 mb-3">
                <i className="fas fa-briefcase mr-2"></i>
                Portfolio et Réalisations
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Qualité des projets réalisés</li>
                <li>• Pertinence des expériences</li>
                <li>• Résultats obtenus</li>
                <li>• Témoignages clients</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-purple-700 mb-3">
                <i className="fas fa-calendar-check mr-2"></i>
                Disponibilité et Planning
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Capacité à répondre aux besoins</li>
                <li>• Flexibilité du planning</li>
                <li>• Délais de réalisation</li>
                <li>• Gestion des priorités</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-yellow-700 mb-3">
                <i className="fas fa-coins mr-2"></i>
                Tarifs et Références
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Adéquation des tarifs</li>
                <li>• Qualité des références</li>
                <li>• Satisfaction client</li>
                <li>• Recommandations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Comment ça marche pour les Consultations ?
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cliquez sur "Postuler"</h3>
                <p className="text-gray-600">
                  Sur n'importe quelle offre de consultation, cliquez sur le bouton "Postuler" 
                  pour commencer l'analyse IA de compatibilité.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Analyse IA Spécialisée</h3>
                <p className="text-gray-600">
                  Notre IA analyse votre expertise, votre portfolio et évalue 
                  la compatibilité avec les exigences de la consultation.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Score de Compatibilité</h3>
                <p className="text-gray-600">
                  Recevez un score précis de votre compatibilité avec la consultation, 
                  basé sur des critères d'expertise avancés.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Recommandations Métier</h3>
                <p className="text-gray-600">
                  Obtenez des conseils personnalisés pour améliorer votre candidature et 
                  maximiser vos chances d'obtenir la consultation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Exemple de redirection */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            <i className="fas fa-route mr-2"></i>
            Redirection Automatique
          </h2>
          <p className="text-blue-700 mb-4">
            Quand vous cliquez sur "Postuler" dans une consultation, vous êtes automatiquement 
            redirigé vers l'analyse de compatibilité IA :
          </p>
          <div className="bg-blue-100 rounded-lg p-4 font-mono text-sm text-blue-800">
            /ia-compatibility/{'{id}'}/consultation
          </div>
          <p className="text-blue-600 text-sm mt-2">
            L'IA analysera votre profil et calculera votre score de compatibilité avec cette consultation.
          </p>
        </div>

        {/* Types de consultation supportés */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Types de Consultation Supportés
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-laptop-code text-3xl text-blue-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Technique</h3>
              <p className="text-sm text-gray-600">Développement, infrastructure, sécurité</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-chart-line text-3xl text-green-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Stratégique</h3>
              <p className="text-sm text-gray-600">Conseil, audit, transformation</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-users text-3xl text-purple-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Organisationnelle</h3>
              <p className="text-sm text-gray-600">RH, formation, management</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-balance-scale text-3xl text-yellow-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Juridique</h3>
              <p className="text-sm text-gray-600">Conformité, réglementation, contrats</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-globe text-3xl text-red-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Marketing</h3>
              <p className="text-sm text-gray-600">Communication, digital, événementiel</p>
            </div>

            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <i className="fas fa-cogs text-3xl text-gray-600 mb-3"></i>
              <h3 className="font-semibold text-gray-900 mb-2">Autres</h3>
              <p className="text-sm text-gray-600">Tous domaines d'expertise</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-blue-600 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Prêt à tester l'IA pour les Consultations ?</h2>
            <p className="text-lg mb-6">
              Découvrez votre score de compatibilité IA sur nos offres de consultation
            </p>
            <div className="space-x-4">
              <Link
                to="/consultations"
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition duration-200"
              >
                <i className="fas fa-search mr-2"></i>
                Voir les consultations
              </Link>
              <Link
                to="/candidat"
                className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition duration-200"
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

export default ConsultationCompatibilityDemo; 