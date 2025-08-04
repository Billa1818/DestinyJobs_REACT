import React from 'react';
import { Link } from 'react-router-dom';

const DetailBourse = () => {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Column */}
        <div className="lg:w-2/3">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link to="/candidat" className="hover:text-fuchsia-600 transition duration-200">Accueil</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link to="/bourses" className="hover:text-fuchsia-600 transition duration-200">Bourses</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-gray-900">Détail de la bourse</span>
          </nav>

          {/* Scholarship Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <i className="fas fa-graduation-cap text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bourse Excellence France</h1>
                    <p className="text-blue-600 font-medium">Ambassade de France au Bénin</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>France</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-calendar mr-2"></i>
                    <span>Date limite : 15 mars 2024</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <i className="fas fa-users mr-2"></i>
                    <span>Étudiants éligibles</span>
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

            {/* Scholarship Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">15,000€</div>
                <div className="text-sm text-gray-600">Montant annuel</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">2 ans</div>
                <div className="text-sm text-gray-600">Durée du programme</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Frais de scolarité</div>
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
                Le programme de bourses d'excellence de l'Ambassade de France au Bénin vise à soutenir 
                les étudiants béninois les plus méritants dans leurs études supérieures en France. 
                Cette bourse couvre l'intégralité des frais de scolarité, l'hébergement et une allocation mensuelle.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les candidats sélectionnés bénéficient d'un accompagnement personnalisé, d'une formation 
                linguistique intensive et d'un réseau d'anciens étudiants pour faciliter leur intégration 
                dans le système universitaire français.
              </p>
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Avantages de la bourse :</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Frais de scolarité entièrement pris en charge</li>
                <li>Hébergement en résidence universitaire</li>
                <li>Allocation mensuelle de 1,200€</li>
                <li>Assurance santé complète</li>
                <li>Formation linguistique intensive</li>
                <li>Accompagnement administratif</li>
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
                <h3 className="font-semibold text-gray-900 mb-2">Profil académique :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Être titulaire d'un baccalauréat ou équivalent</li>
                  <li>Avoir un excellent dossier académique (moyenne ≥ 15/20)</li>
                  <li>Être admis dans une université française</li>
                  <li>Maîtriser le français (niveau B2 minimum)</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Critères personnels :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Être de nationalité béninoise</li>
                  <li>Être âgé de moins de 25 ans</li>
                  <li>Justifier de ressources financières limitées</li>
                  <li>Montrer une motivation claire pour les études en France</li>
                </ul>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">Documents requis :</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Formulaire de candidature complété</li>
                  <li>CV détaillé en français</li>
                  <li>Lettre de motivation</li>
                  <li>Relevés de notes et diplômes</li>
                  <li>Attestation de ressources financières</li>
                  <li>Lettres de recommandation</li>
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
                    Rassemblez tous les documents requis et préparez votre lettre de motivation.
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
                    Complétez le formulaire de candidature et téléchargez tous les documents.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Évaluation académique</h3>
                  <p className="text-gray-700 text-sm">
                    Le comité d'évaluation examine votre dossier académique et votre motivation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Entretien de motivation</h3>
                  <p className="text-gray-700 text-sm">
                    Présentez votre projet d'études devant le jury de sélection.
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
                    Notification de la décision et accompagnement pour les démarches administratives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Apply Button */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-paper-plane mr-2 text-fuchsia-600"></i>
              Postuler maintenant
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Soumettez votre candidature pour cette bourse d'excellence avant la date limite.
            </p>
            <button className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium">
              <i className="fas fa-edit mr-2"></i>Commencer ma candidature
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Temps estimé : 45-60 minutes
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
                <span className="text-gray-700 text-sm">bourses@ambafrance-bj.org</span>
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
                <span className="text-gray-700 text-sm">www.ambafrance-bj.org</span>
              </div>
            </div>
          </div>

          {/* Similar Scholarships */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb mr-2 text-fuchsia-600"></i>
              Bourses similaires
            </h3>
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <h4 className="font-medium text-gray-900 text-sm">Bourse Commonwealth</h4>
                <p className="text-xs text-gray-500 mb-2">Commonwealth Scholarship Commission</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">Frais complets</span>
                  <span className="text-xs text-gray-400">Il y a 2j</span>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <h4 className="font-medium text-gray-900 text-sm">Bourse Chevening</h4>
                <p className="text-xs text-gray-500 mb-2">Gouvernement britannique</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">Frais complets</span>
                  <span className="text-xs text-gray-400">Il y a 5j</span>
                </div>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg hover:border-fuchsia-300 transition duration-200">
                <h4 className="font-medium text-gray-900 text-sm">Bourse VLIR-UOS</h4>
                <p className="text-xs text-gray-500 mb-2">Coopération belge</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-green-600 font-medium">Frais complets</span>
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

export default DetailBourse;