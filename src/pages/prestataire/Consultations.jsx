import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Toutes les villes');
  const [pays, setPays] = useState('Tous les pays'); // Nouveau filtre par pays
  const [serviceType, setServiceType] = useState({
    developpement: false,
    formation: false,
    consultation: false,
    design: false
  });
  const [experienceLevel, setExperienceLevel] = useState({
    debutant: false,
    intermediaire: false,
    senior: false
  });
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const data = await dataService.getConsultations();
      console.log('Consultations récupérées:', data);
      setConsultations(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des consultations:', error);
      setError('Erreur lors du chargement des consultations');
    } finally {
      setLoading(false);
    }
  };

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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <div className="relative">
                  <select 
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={pays}
                    onChange={(e) => setPays(e.target.value)}
                  >
                    <option>Tous les pays</option>
                    <option>Bénin</option>
                    <option>Togo</option>
                    <option>Côte d'Ivoire</option>
                    <option>Sénégal</option>
                    <option>Mali</option>
                    <option>Burkina Faso</option>
                    <option>Niger</option>
                    <option>Guinée</option>
                    <option>Cameroun</option>
                    <option>Ghana</option>
                  </select>
                  <i className="fas fa-globe absolute left-3 top-3 text-gray-400"></i>
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
            {loading ? (
              <p>Chargement des consultations...</p>
            ) : error ? (
              <p>{error}</p>
            ) : consultations.length === 0 ? (
              <p>Aucune consultation trouvée.</p>
            ) : (
              consultations.map((consultation) => (
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
                            <span>{consultation.client}</span>
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
                            <span>{new Date(consultation.createdAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                          consultation.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {consultation.isActive ? 'Actif' : 'Inactif'}
                        </span>
                        <button className="text-gray-400 hover:text-orange-600">
                          <i className="fas fa-heart"></i>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-2">{consultation.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {consultation.requirements && consultation.requirements.map((skill, index) => (
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
              ))
            )}
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