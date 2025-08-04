import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Bourse = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Tous les niveaux');
  const [selectedCountry, setSelectedCountry] = useState('Tous les pays');
  const [selectedField, setSelectedField] = useState('Tous les domaines');

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Scrollable Content Column */}
        <div className="lg:w-2/3">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Bourses d'études</h1>
                <p className="text-gray-600 mt-1">Découvrez les opportunités de financement pour vos études</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
                  <option>Plus récentes</option>
                  <option>Montant élevé</option>
                  <option>Date limite</option>
                  <option>Pays</option>
                </select>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Mots-clés..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <option>Tous les niveaux</option>
                  <option>Licence</option>
                  <option>Master</option>
                  <option>Doctorat</option>
                  <option>Formation professionnelle</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  <option>Tous les pays</option>
                  <option>France</option>
                  <option>Canada</option>
                  <option>Belgique</option>
                  <option>Suisse</option>
                  <option>États-Unis</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Domaine</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                >
                  <option>Tous les domaines</option>
                  <option>Informatique</option>
                  <option>Ingénierie</option>
                  <option>Commerce</option>
                  <option>Médecine</option>
                  <option>Arts</option>
                </select>
              </div>
            </div>
          </div>

          {/* Scholarships List */}
          <div className="space-y-4">
            {/* Scholarship Card 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-graduation-cap text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bourse Excellence France</h3>
                      <p className="text-blue-600 font-medium">Ambassade de France au Bénin</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Master</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">France</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Tous domaines</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-money-bill mr-2"></i>
                    <span>15,000€/an + logement</span>
                    <i className="fas fa-calendar ml-4 mr-2"></i>
                    <span>Date limite : 15 mars 2024</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Programme de bourses d'excellence pour les étudiants béninois souhaitant poursuivre 
                    leurs études en France. Couvre les frais de scolarité, l'hébergement et une allocation mensuelle.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-red-500 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-bourse" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>

            {/* Scholarship Card 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-leaf text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bourse Commonwealth</h3>
                      <p className="text-green-600 font-medium">Commonwealth Scholarship Commission</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Master/Doctorat</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Royaume-Uni</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Développement durable</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-money-bill mr-2"></i>
                    <span>Frais complets + allocation</span>
                    <i className="fas fa-calendar ml-4 mr-2"></i>
                    <span>Date limite : 30 avril 2024</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Bourses pour les étudiants des pays du Commonwealth dans les domaines liés au développement 
                    durable, changement climatique et innovation technologique.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-green-600 hover:text-green-700 transition duration-200">
                    <i className="fas fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-bourse" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>

            {/* Scholarship Card 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-university text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bourse Chevening</h3>
                      <p className="text-purple-600 font-medium">Gouvernement britannique</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Master</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Royaume-Uni</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Leadership</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-money-bill mr-2"></i>
                    <span>Frais complets + 1,200£/mois</span>
                    <i className="fas fa-calendar ml-4 mr-2"></i>
                    <span>Date limite : 2 novembre 2024</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Programme de bourses pour les futurs leaders mondiaux. Couvre les frais de scolarité, 
                    l'hébergement et une allocation mensuelle. Ouvert à tous les domaines d'études.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-purple-600 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-bourse" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>

            {/* Scholarship Card 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-microscope text-orange-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Bourse VLIR-UOS</h3>
                      <p className="text-orange-600 font-medium">Coopération belge</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Master</span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Belgique</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Sciences</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-money-bill mr-2"></i>
                    <span>Frais complets + 1,150€/mois</span>
                    <i className="fas fa-calendar ml-4 mr-2"></i>
                    <span>Date limite : 1 février 2024</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Bourses pour les étudiants des pays en développement dans les domaines scientifiques 
                    et technologiques. Programme de master en anglais dans les universités flamandes.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-orange-600 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-bourse" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="bg-white text-fuchsia-600 border border-fuchsia-600 px-6 py-3 rounded-lg hover:bg-fuchsia-50 transition duration-200">
              <i className="fas fa-plus mr-2"></i>Charger plus de bourses
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-chart-bar mr-2 text-fuchsia-600"></i>
              Statistiques
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bourses disponibles</span>
                <span className="font-semibold text-fuchsia-600">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pays partenaires</span>
                <span className="font-semibold text-green-600">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Candidats acceptés</span>
                <span className="font-semibold text-blue-600">89</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Taux de réussite</span>
                <span className="font-semibold text-purple-600">68%</span>
              </div>
            </div>
          </div>

          {/* Application Tips */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-lightbulb mr-2 text-fuchsia-600"></i>
              Conseils de candidature
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Préparez tôt</h4>
                  <p className="text-xs text-gray-600">Commencez votre candidature 6 mois à l'avance</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Documents complets</h4>
                  <p className="text-xs text-gray-600">Vérifiez que tous les documents sont fournis</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Lettre de motivation</h4>
                  <p className="text-xs text-gray-600">Rédigez une lettre personnalisée et convaincante</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <i className="fas fa-check-circle text-green-600 mt-1"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Références solides</h4>
                  <p className="text-xs text-gray-600">Choisissez des références qui vous connaissent bien</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-bolt mr-2 text-fuchsia-600"></i>
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link to="/candidat/postuler" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-paper-plane text-fuchsia-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Postuler à une bourse</h4>
                  <p className="text-xs text-gray-500">Commencer une candidature</p>
                </div>
              </Link>
              
              <Link to="/candidat/profil" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-user text-green-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Compléter mon profil</h4>
                  <p className="text-xs text-gray-500">Améliorer mes chances</p>
                </div>
              </Link>
              
              <Link to="/formations" className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-fuchsia-50 hover:border-fuchsia-300 transition duration-200">
                <i className="fas fa-graduation-cap text-purple-600 mr-3"></i>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Voir les formations</h4>
                  <p className="text-xs text-gray-500">Préparer mes études</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Bourse;
