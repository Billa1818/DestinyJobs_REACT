import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Offre = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Toutes les villes');
  const [contractType, setContractType] = useState({
    cdi: false,
    cdd: false,
    stage: false,
    freelance: false
  });
  const [salaryRange, setSalaryRange] = useState('');
  const [experienceLevel, setExperienceLevel] = useState({
    debutant: false,
    intermediaire: false,
    senior: false
  });

  const handleContractTypeChange = (type) => {
    setContractType(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleExperienceLevelChange = (level) => {
    setExperienceLevel(prev => ({
      ...prev,
      [level]: !prev[level]
    }));
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          {/* Search Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Titre du poste, entreprise..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                <div className="relative">
                  <select 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option>Toutes les villes</option>
                    <option>Cotonou</option>
                    <option>Porto-Novo</option>
                    <option>Parakou</option>
                    <option>Abomey-Calavi</option>
                  </select>
                  <i className="fas fa-map-marker-alt absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>
              <button className="w-full bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200">
                <i className="fas fa-search mr-2"></i>Rechercher
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-filter mr-2 text-fuchsia-600"></i>Filtres
            </h3>
            
            {/* Contract Type */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Type de contrat</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={contractType.cdi}
                    onChange={() => handleContractTypeChange('cdi')}
                  />
                  <span className="ml-2 text-sm text-gray-600">CDI</span>
                  <span className="ml-auto text-xs text-gray-400">(45)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={contractType.cdd}
                    onChange={() => handleContractTypeChange('cdd')}
                  />
                  <span className="ml-2 text-sm text-gray-600">CDD</span>
                  <span className="ml-auto text-xs text-gray-400">(28)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={contractType.stage}
                    onChange={() => handleContractTypeChange('stage')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Stage</span>
                  <span className="ml-auto text-xs text-gray-400">(12)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={contractType.freelance}
                    onChange={() => handleContractTypeChange('freelance')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Freelance</span>
                  <span className="ml-auto text-xs text-gray-400">(8)</span>
                </label>
              </div>
            </div>

            {/* Salary Range */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Salaire (FCFA/mois)</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="salary" 
                    className="text-fuchsia-600 focus:ring-fuchsia-500"
                    value="moins-100k"
                    checked={salaryRange === 'moins-100k'}
                    onChange={(e) => setSalaryRange(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-600">Moins de 100,000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="salary" 
                    className="text-fuchsia-600 focus:ring-fuchsia-500"
                    value="100k-200k"
                    checked={salaryRange === '100k-200k'}
                    onChange={(e) => setSalaryRange(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-600">100,000 - 200,000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="salary" 
                    className="text-fuchsia-600 focus:ring-fuchsia-500"
                    value="200k-350k"
                    checked={salaryRange === '200k-350k'}
                    onChange={(e) => setSalaryRange(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-600">200,000 - 350,000</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="salary" 
                    className="text-fuchsia-600 focus:ring-fuchsia-500"
                    value="plus-350k"
                    checked={salaryRange === 'plus-350k'}
                    onChange={(e) => setSalaryRange(e.target.value)}
                  />
                  <span className="ml-2 text-sm text-gray-600">Plus de 350,000</span>
                </label>
              </div>
            </div>

            {/* Experience Level */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Niveau d'expérience</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={experienceLevel.debutant}
                    onChange={() => handleExperienceLevelChange('debutant')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Débutant (0-2 ans)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={experienceLevel.intermediaire}
                    onChange={() => handleExperienceLevelChange('intermediaire')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Intermédiaire (3-5 ans)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-fuchsia-600 focus:ring-fuchsia-500"
                    checked={experienceLevel.senior}
                    onChange={() => handleExperienceLevelChange('senior')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Senior (5+ ans)</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <button className="w-full text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium py-2 border border-fuchsia-200 rounded-lg hover:bg-fuchsia-50 transition duration-200">
              <i className="fas fa-times mr-2"></i>Effacer les filtres
            </button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Offres d'emploi</h1>
              <p className="text-gray-600 mt-1">93 offres trouvées</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <span className="text-sm text-gray-600">Trier par:</span>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent">
                <option>Plus récentes</option>
                <option>Plus anciennes</option>
                <option>Salaire élevé</option>
                <option>Salaire faible</option>
              </select>
            </div>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {/* Job Card 1 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-code text-fuchsia-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Développeur Full Stack Senior</h3>
                      <p className="text-fuchsia-600 font-medium">TechCorp Solutions</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded-full">React</span>
                    <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded-full">Node.js</span>
                    <span className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 text-xs rounded-full">MongoDB</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">CDI</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>Cotonou, Bénin</span>
                    <i className="fas fa-clock ml-4 mr-2"></i>
                    <span>Il y a 2h</span>
                    <i className="fas fa-money-bill ml-4 mr-2"></i>
                    <span>300,000 - 450,000 FCFA/mois</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Nous recherchons un développeur Full Stack Senior pour rejoindre notre équipe et contribuer au développement d'applications web modernes...
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-red-500 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-offre" className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-fuchsia-700 transition duration-200">
                    Voir l'offre
                  </Link>
                </div>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-chart-line text-green-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Marketing Manager</h3>
                      <p className="text-fuchsia-600 font-medium">StartupBJ</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Marketing</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Stratégie</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Analytics</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">CDD</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>Porto-Novo, Bénin</span>
                    <i className="fas fa-clock ml-4 mr-2"></i>
                    <span>Il y a 4h</span>
                    <i className="fas fa-money-bill ml-4 mr-2"></i>
                    <span>250,000 - 350,000 FCFA/mois</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Rejoignez notre équipe marketing dynamique et contribuez à la croissance de notre startup innovante...
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-fuchsia-600 hover:text-fuchsia-700 transition duration-200">
                    <i className="fas fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-offre" className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-fuchsia-700 transition duration-200">
                    Voir l'offre
                  </Link>
                </div>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                      <i className="fas fa-calculator text-purple-600"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Comptable Senior</h3>
                      <p className="text-fuchsia-600 font-medium">Finance+ Group</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Comptabilité</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Fiscalité</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Audit</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">CDI</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    <span>Parakou, Bénin</span>
                    <i className="fas fa-clock ml-4 mr-2"></i>
                    <span>Il y a 6h</span>
                    <i className="fas fa-money-bill ml-4 mr-2"></i>
                    <span>200,000 - 280,000 FCFA/mois</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-4">
                    Nous recherchons un comptable senior expérimenté pour rejoindre notre équipe financière...
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <button className="text-gray-400 hover:text-fuchsia-600 transition duration-200">
                    <i className="far fa-heart"></i>
                  </button>
                  <Link to="/candidat/detail-offre" className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-fuchsia-700 transition duration-200">
                    Voir l'offre
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="bg-white text-fuchsia-600 border border-fuchsia-600 px-6 py-3 rounded-lg hover:bg-fuchsia-50 transition duration-200">
              <i className="fas fa-plus mr-2"></i>Charger plus d'offres
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Offre;