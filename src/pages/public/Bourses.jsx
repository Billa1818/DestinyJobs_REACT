import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';

const Bourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Données simulées des bourses
  const bourses = [
    {
      id: 1,
      title: "Bourse Master en Informatique",
      institution: "Université d'Abomey-Calavi",
      location: "Cotonou, Bénin",
      level: "Master",
      amount: "500,000 FCFA/an",
      duration: "2 ans",
      postedDate: "12 Jan 2024",
      deadline: "28 Jan 2024",
      description: "Bourse complète pour étudiants en informatique avec un excellent dossier académique...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 2,
      title: "Bourse Doctorat en Économie",
      institution: "Université de Parakou",
      location: "Parakou, Bénin",
      level: "Doctorat",
      amount: "800,000 FCFA/an",
      duration: "3 ans",
      postedDate: "10 Jan 2024",
      deadline: "25 Jan 2024",
      description: "Bourse de recherche pour doctorants en économie du développement...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 3,
      title: "Bourse Licence en Marketing",
      institution: "ESAE",
      location: "Cotonou, Bénin",
      level: "Licence",
      amount: "300,000 FCFA/an",
      duration: "3 ans",
      postedDate: "8 Jan 2024",
      deadline: "22 Jan 2024",
      description: "Bourse partielle pour étudiants en marketing et communication...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 4,
      title: "Bourse Ingénieur en Génie Civil",
      institution: "École Polytechnique d'Abomey-Calavi",
      location: "Abomey-Calavi, Bénin",
      level: "Ingénieur",
      amount: "600,000 FCFA/an",
      duration: "3 ans",
      postedDate: "5 Jan 2024",
      deadline: "20 Jan 2024",
      description: "Bourse pour étudiants en génie civil avec spécialisation en construction durable...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 5,
      title: "Bourse Master en Agronomie",
      institution: "Université Nationale d'Agriculture",
      location: "Kétou, Bénin",
      level: "Master",
      amount: "450,000 FCFA/an",
      duration: "2 ans",
      postedDate: "3 Jan 2024",
      deadline: "18 Jan 2024",
      description: "Bourse pour étudiants en agronomie spécialisés en agriculture durable...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 6,
      title: "Bourse Licence en Sciences de la Santé",
      institution: "Université des Sciences de la Santé",
      location: "Cotonou, Bénin",
      level: "Licence",
      amount: "400,000 FCFA/an",
      duration: "3 ans",
      postedDate: "1 Jan 2024",
      deadline: "15 Jan 2024",
      description: "Bourse pour étudiants en sciences de la santé et médecine préventive...",
      logo: "https://via.placeholder.com/60x60"
    }
  ];

  const levels = [
    { value: '', label: 'Tous les niveaux' },
    { value: 'Licence', label: 'Licence' },
    { value: 'Master', label: 'Master' },
    { value: 'Doctorat', label: 'Doctorat' },
    { value: 'Ingénieur', label: 'Ingénieur' },
    { value: 'Formation', label: 'Formation continue' }
  ];

  const locations = [
    { value: '', label: 'Tous les lieux' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Parakou', label: 'Parakou' },
    { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
    { value: 'Kétou', label: 'Kétou' },
    { value: 'Porto-Novo', label: 'Porto-Novo' }
  ];

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  const filteredBourses = bourses.filter(bourse => {
    const matchesSearch = bourse.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bourse.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bourse.institution.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = !selectedLevel || bourse.level === selectedLevel;
    const matchesLocation = !selectedLocation || bourse.location.includes(selectedLocation);
    
    return matchesSearch && matchesLevel && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-graduation-cap text-fuchsia-600 mr-3"></i>
            Bourses d'études
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez des opportunités de bourses d'études pour poursuivre votre formation. 
            Trouvez des financements adaptés à votre niveau et domaine d'études.
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
                    placeholder="Rechercher une bourse..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Level Filter */}
              <div>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
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
                  Bourses disponibles ({filteredBourses.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Trier par :</span>
                  <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                    <option>Plus récentes</option>
                    <option>Montant élevé</option>
                    <option>Durée courte</option>
                  </select>
                </div>
              </div>

              {filteredBourses.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune bourse trouvée</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBourses.map((bourse) => (
                    <div key={bourse.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <img src={bourse.logo} alt={bourse.institution} className="w-16 h-16 rounded-lg object-cover" />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                <Link to={`/bourses/${bourse.id}`} className="hover:text-fuchsia-600 transition duration-200">
                                  {bourse.title}
                                </Link>
                              </h3>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                  <i className="fas fa-university mr-2"></i>
                                  {bourse.institution}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-map-marker-alt mr-2"></i>
                                  {bourse.location}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-2"></i>
                                  {bourse.postedDate}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{bourse.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {bourse.amount}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {bourse.duration}
                                </span>
                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {bourse.level}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <span className="text-sm text-red-600 font-medium">
                                <i className="fas fa-clock mr-1"></i>
                                Limite : {bourse.deadline}
                              </span>
                              <Link 
                                to={`/bourses/${bourse.id}`}
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
        <h2 className="text-2xl font-bold mb-4">Vous cherchez une bourse ?</h2>
        <p className="text-lg mb-6 opacity-90">
          Rejoignez notre plateforme et trouvez la bourse idéale pour vos études
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Créer un compte étudiant
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

export default Bourses; 