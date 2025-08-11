import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContract, setSelectedContract] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Données simulées des emplois
  const jobs = [
    {
      id: 1,
      title: "Développeur Full Stack React/Node.js",
      company: "TechCorp Solutions",
      location: "Cotonou, Bénin",
      contract: "CDI",
      salary: "800,000 - 1,200,000 FCFA",
      experience: "3-5 ans",
      postedDate: "12 Jan 2024",
      deadline: "28 Jan 2024",
      description: "Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe de développement...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 2,
      title: "Chef de projet digital",
      company: "Digital Agency Bénin",
      location: "Porto-Novo, Bénin",
      contract: "CDI",
      salary: "1,200,000 - 1,800,000 FCFA",
      experience: "5-8 ans",
      postedDate: "10 Jan 2024",
      deadline: "25 Jan 2024",
      description: "Chef de projet digital pour gérer des projets web et applications mobiles...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 3,
      title: "Marketing Manager",
      company: "Innovation Hub",
      location: "Cotonou, Bénin",
      contract: "CDI",
      salary: "900,000 - 1,500,000 FCFA",
      experience: "4-6 ans",
      postedDate: "8 Jan 2024",
      deadline: "22 Jan 2024",
      description: "Marketing Manager pour développer et exécuter des stratégies marketing...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 4,
      title: "Comptable senior",
      company: "Cabinet Comptable Plus",
      location: "Abomey-Calavi, Bénin",
      contract: "CDD",
      salary: "600,000 - 900,000 FCFA",
      experience: "3-5 ans",
      postedDate: "5 Jan 2024",
      deadline: "20 Jan 2024",
      description: "Comptable senior pour gérer la comptabilité d'entreprises clientes...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 5,
      title: "Ingénieur agronome",
      company: "AgroTech Bénin",
      location: "Parakou, Bénin",
      contract: "CDI",
      salary: "700,000 - 1,100,000 FCFA",
      experience: "2-4 ans",
      postedDate: "3 Jan 2024",
      deadline: "18 Jan 2024",
      description: "Ingénieur agronome pour projets d'agriculture durable et innovation...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 6,
      title: "Stagiaire en communication",
      company: "Com Agency",
      location: "Cotonou, Bénin",
      contract: "Stage",
      salary: "150,000 - 250,000 FCFA",
      experience: "Étudiant",
      postedDate: "1 Jan 2024",
      deadline: "15 Jan 2024",
      description: "Stage en communication pour étudiants en dernière année...",
      logo: "https://via.placeholder.com/60x60"
    }
  ];

  const contracts = [
    { value: '', label: 'Tous les contrats' },
    { value: 'CDI', label: 'CDI' },
    { value: 'CDD', label: 'CDD' },
    { value: 'Stage', label: 'Stage' },
    { value: 'Alternance', label: 'Alternance' },
    { value: 'Freelance', label: 'Freelance' }
  ];

  const locations = [
    { value: '', label: 'Tous les lieux' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Porto-Novo', label: 'Porto-Novo' },
    { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
    { value: 'Parakou', label: 'Parakou' },
    { value: 'Kétou', label: 'Kétou' }
  ];

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesContract = !selectedContract || job.contract === selectedContract;
    const matchesLocation = !selectedLocation || job.location.includes(selectedLocation);
    
    return matchesSearch && matchesContract && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-briefcase text-fuchsia-600 mr-3"></i>
            Offres d'emploi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez des opportunités d'emploi dans divers secteurs. 
            Trouvez le poste qui correspond à vos compétences et aspirations.
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
                    placeholder="Rechercher un emploi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Contract Filter */}
              <div>
                <select
                  value={selectedContract}
                  onChange={(e) => setSelectedContract(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  {contracts.map(contract => (
                    <option key={contract.value} value={contract.value}>{contract.label}</option>
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
                  Emplois disponibles ({filteredJobs.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Trier par :</span>
                  <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                    <option>Plus récents</option>
                    <option>Salaire élevé</option>
                    <option>Expérience requise</option>
                  </select>
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun emploi trouvé</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <img src={job.logo} alt={job.company} className="w-16 h-16 rounded-lg object-cover" />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                <Link to={`/jobs/${job.id}`} className="hover:text-fuchsia-600 transition duration-200">
                                  {job.title}
                                </Link>
                              </h3>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                  <i className="fas fa-building mr-2"></i>
                                  {job.company}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-map-marker-alt mr-2"></i>
                                  {job.location}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-2"></i>
                                  {job.postedDate}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{job.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {job.salary}
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {job.contract}
                                </span>
                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {job.experience}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <span className="text-sm text-red-600 font-medium">
                                <i className="fas fa-clock mr-1"></i>
                                Limite : {job.deadline}
                              </span>
                              <Link 
                                to={`/jobs/${job.id}`}
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
        <h2 className="text-2xl font-bold mb-4">Vous cherchez un emploi ?</h2>
        <p className="text-lg mb-6 opacity-90">
          Rejoignez notre plateforme et trouvez l'emploi idéal pour votre carrière
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Créer un compte candidat
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

export default Jobs; 