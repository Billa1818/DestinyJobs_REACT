import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';

const Financements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Données simulées des financements
  const financements = [
    {
      id: 1,
      title: "Fonds d'investissement pour startups innovantes",
      institution: "Fonds National de Développement",
      location: "Bénin",
      type: "Subvention",
      amount: "5,000,000 - 50,000,000 FCFA",
      duration: "12-24 mois",
      postedDate: "12 Jan 2024",
      deadline: "28 Jan 2024",
      description: "Fonds destiné aux startups innovantes dans les secteurs technologiques, agricoles et de l'énergie renouvelable...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 2,
      title: "Prêt PME à taux préférentiel",
      institution: "Banque de l'Habitat du Bénin",
      location: "Bénin",
      type: "Prêt",
      amount: "10,000,000 - 100,000,000 FCFA",
      duration: "60 mois",
      postedDate: "10 Jan 2024",
      deadline: "25 Jan 2024",
      description: "Prêt à taux préférentiel pour les PME du secteur manufacturier et des services...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 3,
      title: "Microcrédit pour entrepreneurs ruraux",
      institution: "FECECAM",
      location: "Bénin",
      type: "Microcrédit",
      amount: "500,000 - 5,000,000 FCFA",
      duration: "12-36 mois",
      postedDate: "8 Jan 2024",
      deadline: "22 Jan 2024",
      description: "Microcrédit spécialement conçu pour les entrepreneurs ruraux et les agriculteurs...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 4,
      title: "Fonds de garantie pour exportateurs",
      institution: "Fonds de Garantie des PME",
      location: "Bénin",
      type: "Garantie",
      amount: "20,000,000 - 200,000,000 FCFA",
      duration: "24-48 mois",
      postedDate: "5 Jan 2024",
      deadline: "20 Jan 2024",
      description: "Fonds de garantie pour faciliter l'accès au crédit des PME exportatrices...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 5,
      title: "Subvention pour projets environnementaux",
      institution: "Ministère de l'Environnement",
      location: "Bénin",
      type: "Subvention",
      amount: "2,000,000 - 20,000,000 FCFA",
      duration: "12-18 mois",
      postedDate: "3 Jan 2024",
      deadline: "18 Jan 2024",
      description: "Subvention pour projets de protection de l'environnement et de développement durable...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 6,
      title: "Fonds d'innovation technologique",
      institution: "Agence Nationale de l'Innovation",
      location: "Bénin",
      type: "Subvention",
      amount: "1,000,000 - 10,000,000 FCFA",
      duration: "6-12 mois",
      postedDate: "1 Jan 2024",
      deadline: "15 Jan 2024",
      description: "Fonds pour soutenir l'innovation technologique et la transformation digitale...",
      logo: "https://via.placeholder.com/60x60"
    }
  ];

  const types = [
    { value: '', label: 'Tous les types' },
    { value: 'Subvention', label: 'Subvention' },
    { value: 'Prêt', label: 'Prêt' },
    { value: 'Microcrédit', label: 'Microcrédit' },
    { value: 'Garantie', label: 'Garantie' },
    { value: 'Investissement', label: 'Investissement' }
  ];

  const locations = [
    { value: '', label: 'Tous les lieux' },
    { value: 'Bénin', label: 'Bénin' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Porto-Novo', label: 'Porto-Novo' },
    { value: 'Parakou', label: 'Parakou' }
  ];

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  const filteredFinancements = financements.filter(financement => {
    const matchesSearch = financement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         financement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         financement.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || financement.type === selectedType;
    const matchesLocation = !selectedLocation || financement.location.includes(selectedLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-money-bill-wave text-fuchsia-600 mr-3"></i>
            Financements
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez des opportunités de financement pour vos projets. 
            Trouvez des subventions, prêts et investissements adaptés à vos besoins.
          </p>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filter */}
        <div className="lg:w-1/4">
          <SidebarFilter 
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Rechercher un financement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Type Filter */}
              <div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Location Filter */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  {locations.map(location => (
                    <option key={location.value} value={location.value}>{location.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Financements disponibles ({filteredFinancements.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Trier par :</span>
                  <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                    <option>Plus récents</option>
                    <option>Montant élevé</option>
                    <option>Durée courte</option>
                  </select>
                </div>
              </div>

              {filteredFinancements.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun financement trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFinancements.map((financement) => (
                    <div key={financement.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <img src={financement.logo} alt={financement.institution} className="w-16 h-16 rounded-lg object-cover" />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                <Link to={`/financements/${financement.id}`} className="hover:text-fuchsia-600 transition duration-200">
                                  {financement.title}
                                </Link>
                              </h3>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                  <i className="fas fa-building mr-2"></i>
                                  {financement.institution}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-map-marker-alt mr-2"></i>
                                  {financement.location}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-2"></i>
                                  {financement.postedDate}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{financement.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {financement.amount}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {financement.duration}
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {financement.type}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <span className="text-sm text-red-600 font-medium">
                                <i className="fas fa-clock mr-1"></i>
                                Limite : {financement.deadline}
                              </span>
                              <Link 
                                to={`/financements/${financement.id}`}
                                className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm font-medium"
                              >
                                Voir les détails
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Vous avez un projet ?</h2>
        <p className="text-lg mb-6 opacity-90">
          Rejoignez notre plateforme et trouvez le financement idéal pour votre projet
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Créer un compte
          </Link>
          <Link 
            to="/contact" 
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Financements; 