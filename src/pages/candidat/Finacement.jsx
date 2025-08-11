import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Finacement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous les types');
  const [selectedAmount, setSelectedAmount] = useState('Tous les montants');
  const [selectedDuration, setSelectedDuration] = useState('Toutes les durées');

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-filter mr-2 text-fuchsia-600"></i>
              Filtres
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Mots-clés..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de financement</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  <option>Tous les types</option>
                  <option>Prêt bancaire</option>
                  <option>Microfinance</option>
                  <option>Subvention</option>
                  <option>Fonds d'investissement</option>
                  <option>Crowdfunding</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <select
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  <option>Tous les montants</option>
                  <option>0 - 1M FCFA</option>
                  <option>1M - 5M FCFA</option>
                  <option>5M - 20M FCFA</option>
                  <option>20M+ FCFA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  <option>Toutes les durées</option>
                  <option>0 - 1 an</option>
                  <option>1 - 3 ans</option>
                  <option>3 - 5 ans</option>
                  <option>5+ ans</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                    <span className="ml-2 text-sm text-gray-700">Agriculture</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                    <span className="ml-2 text-sm text-gray-700">Commerce</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                    <span className="ml-2 text-sm text-gray-700">Services</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                    <span className="ml-2 text-sm text-gray-700">Technologie</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" />
                    <span className="ml-2 text-sm text-gray-700">Artisanat</span>
                  </label>
                </div>
              </div>

              <button className="w-full bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200">
                <i className="fas fa-search mr-2"></i>Appliquer les filtres
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financements</h1>
                <p className="text-gray-600 mt-1">Découvrez les opportunités de financement pour votre projet</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
                  <option>Plus récents</option>
                  <option>Montant élevé</option>
                  <option>Taux avantageux</option>
                  <option>Date limite</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-gray-600">Financements disponibles</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-gray-600">Institutions partenaires</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">89</div>
                <div className="text-sm text-gray-600">Projets financés</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">2.5M</div>
                <div className="text-sm text-gray-600">FCFA montant moyen</div>
              </div>
            </div>
          </div>

          {/* Funding List */}
          <div className="space-y-4">
            {/* Funding Card 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-seedling text-green-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Prêt Agricole Jeunes Entrepreneurs</h3>
                      <p className="text-green-600 font-medium">Banque Agricole du Bénin</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Agriculture</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Prêt bancaire</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">18-35 ans</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-money-bill mr-2"></i>
                      <span>500K - 5M FCFA</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-percentage mr-2"></i>
                      <span>8.5% annuel</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar mr-2"></i>
                      <span>1-3 ans</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Programme spécialement conçu pour les jeunes entrepreneurs agricoles. 
                    Taux préférentiel et accompagnement technique inclus.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-red-500 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-finacement" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>

            {/* Funding Card 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-laptop text-blue-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Fonds Innovation Tech</h3>
                      <p className="text-blue-600 font-medium">Agence Nationale de Promotion des PME</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Technologie</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Subvention</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">PME</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-money-bill mr-2"></i>
                      <span>10M - 50M FCFA</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-percentage mr-2"></i>
                      <span>2% annuel</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar mr-2"></i>
                      <span>5 ans</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Soutien aux projets innovants dans le secteur technologique. 
                    Accompagnement technique et mentorat inclus.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-blue-600 hover:text-blue-700 transition duration-200">
                    <i className="fas fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-finacement" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>

            {/* Funding Card 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-store text-purple-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Microfinance Femmes Entrepreneures</h3>
                      <p className="text-purple-600 font-medium">CLCAM Bénin</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Commerce</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">Microfinance</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Femmes</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-money-bill mr-2"></i>
                      <span>50K - 2M FCFA</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-percentage mr-2"></i>
                      <span>12% annuel</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar mr-2"></i>
                      <span>6-24 mois</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Programme dédié aux femmes entrepreneures. 
                    Accompagnement personnalisé et formation en gestion.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-purple-600 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-finacement" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>

            {/* Funding Card 4 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-industry text-orange-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Crédit PME Développement</h3>
                      <p className="text-orange-600 font-medium">Ecobank Bénin</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">Industrie</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Prêt bancaire</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">PME</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-money-bill mr-2"></i>
                      <span>5M - 50M FCFA</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-percentage mr-2"></i>
                      <span>10% annuel</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <i className="fas fa-calendar mr-2"></i>
                      <span>3-7 ans</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4">
                    Financement pour le développement et l'expansion des PME. 
                    Garanties flexibles et accompagnement bancaire.
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-orange-600 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-finacement" className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition duration-200">
                    Voir détails
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="bg-white text-fuchsia-600 border border-fuchsia-600 px-6 py-3 rounded-lg hover:bg-fuchsia-50 transition duration-200">
              <i className="fas fa-plus mr-2"></i>Charger plus de financements
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Finacement;
