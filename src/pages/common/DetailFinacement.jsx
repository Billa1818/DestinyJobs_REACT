import React from 'react';
import { Link } from 'react-router-dom';

const DetailFinacement = () => {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/candidat" className="hover:text-fuchsia-600 transition duration-200">Accueil</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <Link to="/candidat/finacement" className="hover:text-fuchsia-600 transition duration-200">Financements</Link>
        <i className="fas fa-chevron-right text-xs"></i>
        <span className="text-gray-900">Détail du financement</span>
      </nav>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Main Content */}
        <div className="xl:w-2/3">
          {/* Funding Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-money-bill-wave text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fonds d'Innovation Entrepreneuriale</h1>
                    <p className="text-green-600 font-medium">Agence Nationale de Promotion des PME</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>Bénin</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    <span>Date limite : 30 juin 2024</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-users mr-2"></i>
                    <span>Entreprises éligibles</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                  Actif
                </span>
                <button className="text-gray-400 hover:text-fuchsia-600">
                  <i className="fas fa-heart"></i>
                </button>
              </div>
            </div>

            {/* Funding Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">50M FCFA</div>
                <div className="text-sm text-gray-600">Montant maximum</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">5 ans</div>
                <div className="text-sm text-gray-600">Durée de remboursement</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">2%</div>
                <div className="text-sm text-gray-600">Taux d'intérêt annuel</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <i className="fas fa-info-circle mr-2 text-fuchsia-600"></i>
              Description
            </h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Le Fonds d'Innovation Entrepreneuriale vise à soutenir les entrepreneurs béninois dans le développement 
                de leurs projets innovants. Ce programme offre un financement accessible aux PME et startups qui 
                contribuent à l'innovation technologique et au développement économique du Bénin.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les projets éligibles incluent le développement de solutions technologiques, l'innovation dans 
                les services, la transformation digitale des entreprises, et les projets à fort impact social.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Objectifs du programme :</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Encourager l'innovation technologique au Bénin</li>
                <li>Soutenir la création et le développement d'entreprises innovantes</li>
                <li>Faciliter l'accès au financement pour les PME</li>
                <li>Contribuer à la création d'emplois qualifiés</li>
                <li>Promouvoir l'entrepreneuriat chez les jeunes</li>
              </ul>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <i className="fas fa-check-circle mr-2 text-fuchsia-600"></i>
              Critères d'éligibilité
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Entreprises éligibles :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>PME enregistrées au Bénin depuis au moins 2 ans</li>
                  <li>Startups innovantes avec un projet viable</li>
                  <li>Entreprises de moins de 50 employés</li>
                  <li>Chiffre d'affaires annuel inférieur à 500M FCFA</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Projets éligibles :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Innovation technologique et digitale</li>
                  <li>Développement de nouveaux produits ou services</li>
                  <li>Modernisation des processus de production</li>
                  <li>Expansion commerciale et développement de marchés</li>
                  <li>Formation et développement des compétences</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Documents requis :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Plan d'affaires détaillé</li>
                  <li>États financiers des 2 dernières années</li>
                  <li>Extrait Kbis ou récépissé d'immatriculation</li>
                  <li>Justificatifs de domiciliation bancaire</li>
                  <li>CV des dirigeants et équipe de direction</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <i className="fas fa-clipboard-list mr-2 text-fuchsia-600"></i>
              Processus de candidature
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Préparation du dossier</h3>
                  <p className="text-gray-700 text-sm">
                    Rassemblez tous les documents requis et préparez votre plan d'affaires détaillé.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Soumission en ligne</h3>
                  <p className="text-gray-700 text-sm">
                    Complétez le formulaire de candidature et téléchargez tous les documents sur la plateforme.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Évaluation technique</h3>
                  <p className="text-gray-700 text-sm">
                    Le comité d'évaluation examine votre dossier et peut demander des informations complémentaires.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Entretien et présentation</h3>
                  <p className="text-gray-700 text-sm">
                    Présentez votre projet devant le jury et répondez aux questions des évaluateurs.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Décision finale</h3>
                  <p className="text-gray-700 text-sm">
                    Notification de la décision et signature du contrat de financement si accepté.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          {/* Apply Button */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-paper-plane mr-2 text-fuchsia-600"></i>
              Postuler maintenant
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Soumettez votre candidature pour ce programme de financement avant la date limite.
            </p>
            <button className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium">
              <i className="fas fa-edit mr-2"></i>Commencer ma candidature
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Temps estimé : 30-45 minutes
            </p>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-phone mr-2 text-fuchsia-600"></i>
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <i className="fas fa-envelope text-gray-400 mr-3"></i>
                <span className="text-gray-700 text-sm">contact@anpme.bj</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-phone text-gray-400 mr-3"></i>
                <span className="text-gray-700 text-sm">+229 21 30 12 34</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                <span className="text-gray-700 text-sm">Cotonou, Bénin</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-globe text-gray-400 mr-3"></i>
                <span className="text-gray-700 text-sm">www.anpme.bj</span>
              </div>
            </div>
          </div>

          {/* Similar Funding */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb mr-2 text-fuchsia-600"></i>
              Financements similaires
            </h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <h4 className="font-medium text-gray-900 text-sm">Fonds Jeunes Entrepreneurs</h4>
                <p className="text-xs text-gray-500 mb-2">Agence de Promotion des Investissements</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">25M FCFA</span>
                  <span className="text-xs text-gray-400">Il y a 2j</span>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <h4 className="font-medium text-gray-900 text-sm">Programme Innovation Tech</h4>
                <p className="text-xs text-gray-500 mb-2">Ministère du Numérique</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">100M FCFA</span>
                  <span className="text-xs text-gray-400">Il y a 5j</span>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <h4 className="font-medium text-gray-900 text-sm">Fonds PME Export</h4>
                <p className="text-xs text-gray-500 mb-2">Agence de Promotion du Commerce</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">75M FCFA</span>
                  <span className="text-xs text-gray-400">Il y a 1sem</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetailFinacement;