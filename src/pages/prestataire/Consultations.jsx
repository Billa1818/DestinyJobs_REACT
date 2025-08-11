import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Toutes les villes');
  const [serviceType, setServiceType] = useState({
    developpement: false,
    formation: false,
    consultation: false,
    design: false
  });
  const [budgetRange, setBudgetRange] = useState('');
  const [experienceLevel, setExperienceLevel] = useState({
    debutant: false,
    intermediaire: false,
    senior: false
  });

  const handleServiceTypeChange = (type) => {
    setServiceType(prev => ({
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

  const [consultations] = useState([
    {
      id: 1,
      title: 'Développement d\'application mobile',
      client: 'TechStart Bénin',
      location: 'Cotonou, Bénin',
      budget: '500K - 800K FCFA',
      duration: '2-3 mois',
      type: 'Développement',
      description: 'Création d\'une application mobile pour la gestion des stocks...',
      skills: ['React Native', 'Node.js', 'MongoDB'],
      postedDate: 'Il y a 2 jours',
      status: 'Actif'
    },
    {
      id: 2,
      title: 'Formation en marketing digital',
      client: 'Digital Academy',
      location: 'Porto-Novo, Bénin',
      budget: '300K - 500K FCFA',
      duration: '1 mois',
      type: 'Formation',
      description: 'Formation complète en marketing digital pour une équipe de 15 personnes...',
      skills: ['Marketing Digital', 'Google Ads', 'Facebook Ads'],
      postedDate: 'Il y a 1 semaine',
      status: 'Actif'
    },
    {
      id: 3,
      title: 'Audit de sécurité informatique',
      client: 'Banque du Bénin',
      location: 'Cotonou, Bénin',
      budget: '1M - 1.5M FCFA',
      duration: '1-2 mois',
      type: 'Consultation',
      description: 'Audit complet de la sécurité informatique de notre infrastructure...',
      skills: ['Cybersécurité', 'Audit', 'ISO 27001'],
      postedDate: 'Il y a 3 jours',
      status: 'Actif'
    },
    {
      id: 4,
      title: 'Design d\'identité visuelle',
      client: 'StartupBJ',
      location: 'Abomey-Calavi, Bénin',
      budget: '200K - 400K FCFA',
      duration: '2-3 semaines',
      type: 'Design',
      description: 'Création de l\'identité visuelle complète pour une startup...',
      skills: ['Adobe Illustrator', 'Photoshop', 'Branding'],
      postedDate: 'Il y a 5 jours',
      status: 'Actif'
    }
  ]);

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
                    placeholder="Service, client..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition duration-200">
                <i className="fas fa-search mr-2"></i>Rechercher
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="fas fa-filter mr-2 text-orange-600"></i>Filtres
            </h3>
            
            {/* Service Type */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Type de service</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-orange-600 focus:ring-orange-500"
                    checked={serviceType.developpement}
                    onChange={() => handleServiceTypeChange('developpement')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Développement</span>
                  <span className="ml-auto text-xs text-gray-400">(15)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-orange-600 focus:ring-orange-500"
                    checked={serviceType.formation}
                    onChange={() => handleServiceTypeChange('formation')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Formation</span>
                  <span className="ml-auto text-xs text-gray-400">(8)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-orange-600 focus:ring-orange-500"
                    checked={serviceType.consultation}
                    onChange={() => handleServiceTypeChange('consultation')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Consultation</span>
                  <span className="ml-auto text-xs text-gray-400">(12)</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-orange-600 focus:ring-orange-500"
                    checked={serviceType.design}
                    onChange={() => handleServiceTypeChange('design')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Design</span>
                  <span className="ml-auto text-xs text-gray-400">(6)</span>
                </label>
              </div>
            </div>

            {/* Budget Range */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Budget</h4>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
              >
                <option value="">Tous les budgets</option>
                <option value="0-200k">0 - 200K FCFA</option>
                <option value="200k-500k">200K - 500K FCFA</option>
                <option value="500k-1m">500K - 1M FCFA</option>
                <option value="1m+">1M+ FCFA</option>
              </select>
            </div>

            {/* Experience Level */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Niveau d'expérience</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-orange-600 focus:ring-orange-500"
                    checked={experienceLevel.debutant}
                    onChange={() => handleExperienceLevelChange('debutant')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Débutant</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-orange-600 focus:ring-orange-500"
                    checked={experienceLevel.intermediaire}
                    onChange={() => handleExperienceLevelChange('intermediaire')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Intermédiaire</span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="rounded text-orange-600 focus:ring-orange-500"
                    checked={experienceLevel.senior}
                    onChange={() => handleExperienceLevelChange('senior')}
                  />
                  <span className="ml-2 text-sm text-gray-600">Senior</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
                <p className="text-gray-600 mt-1">Trouvez des opportunités de prestation de services</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Trier par:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Plus récentes</option>
                  <option>Budget élevé</option>
                  <option>Date limite</option>
                  <option>Localisation</option>
                </select>
              </div>
            </div>
          </div>

          {/* Consultations List */}
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="fas fa-briefcase text-orange-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 cursor-pointer">
                            <Link to={`/prestataire/consultation/${consultation.id}`}>
                              {consultation.title}
                            </Link>
                          </h3>
                          <p className="text-orange-600 font-medium">{consultation.client}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt mr-2"></i>
                          <span>{consultation.location}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-money-bill mr-2"></i>
                          <span>{consultation.budget}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-clock mr-2"></i>
                          <span>{consultation.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-calendar mr-2"></i>
                          <span>{consultation.postedDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        {consultation.status}
                      </span>
                      <button className="text-gray-400 hover:text-orange-600">
                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">{consultation.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {consultation.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Link 
                        to={`/prestataire/consultation/${consultation.id}`}
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                      >
                        Voir détails →
                      </Link>
                      <Link 
                        to={`/prestataire/consultation/${consultation.id}/postuler`}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200 text-sm"
                      >
                        Postuler
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
                <i className="fas fa-chevron-left mr-1"></i>
                Précédent
              </button>
              <button className="px-3 py-2 bg-orange-600 text-white rounded-md text-sm">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">3</button>
              <button className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50">
                Suivant
                <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Consultations; 