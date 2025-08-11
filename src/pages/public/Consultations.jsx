import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SidebarFilter from '../../components/SidebarFilter';

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  // Données simulées des consultations
  const consultations = [
    {
      id: 1,
      title: "Expertise en transformation digitale pour PME",
      client: "Innovation Hub Bénin",
      location: "Cotonou, Bénin",
      category: "Stratégie",
      budget: "2,000,000 - 3,500,000 FCFA",
      duration: "3-6 mois",
      experience: "5+ ans",
      postedDate: "12 Jan 2024",
      deadline: "28 Jan 2024",
      description: "Nous recherchons un expert en transformation digitale pour accompagner notre PME dans sa transition numérique...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 2,
      title: "Audit marketing digital et stratégie de croissance",
      client: "Marketing Pro Bénin",
      location: "Porto-Novo, Bénin",
      category: "Marketing",
      budget: "1,500,000 - 2,500,000 FCFA",
      duration: "2-4 mois",
      experience: "3+ ans",
      postedDate: "10 Jan 2024",
      deadline: "25 Jan 2024",
      description: "Audit complet de notre stratégie marketing digitale et recommandations pour améliorer notre présence en ligne...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 3,
      title: "Optimisation des processus RH et formation",
      client: "TechCorp Solutions",
      location: "Cotonou, Bénin",
      category: "RH",
      budget: "1,800,000 - 2,800,000 FCFA",
      duration: "4-6 mois",
      experience: "4+ ans",
      postedDate: "8 Jan 2024",
      deadline: "22 Jan 2024",
      description: "Optimisation de nos processus RH et mise en place d'un programme de formation continue...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 4,
      title: "Stratégie de développement commercial",
      client: "Commerce Plus",
      location: "Abomey-Calavi, Bénin",
      category: "Commerce",
      budget: "2,500,000 - 4,000,000 FCFA",
      duration: "6-8 mois",
      experience: "6+ ans",
      postedDate: "5 Jan 2024",
      deadline: "20 Jan 2024",
      description: "Développement d'une stratégie commerciale pour étendre notre marché et augmenter nos ventes...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 5,
      title: "Conseil en gestion financière et comptabilité",
      client: "Finance Expert",
      location: "Cotonou, Bénin",
      category: "Finance",
      budget: "1,200,000 - 2,000,000 FCFA",
      duration: "2-3 mois",
      experience: "4+ ans",
      postedDate: "3 Jan 2024",
      deadline: "18 Jan 2024",
      description: "Audit financier et mise en place de processus comptables optimisés pour notre PME...",
      logo: "https://via.placeholder.com/60x60"
    },
    {
      id: 6,
      title: "Stratégie de communication et relations publiques",
      client: "Com Agency",
      location: "Porto-Novo, Bénin",
      category: "Communication",
      budget: "1,600,000 - 2,600,000 FCFA",
      duration: "3-5 mois",
      experience: "3+ ans",
      postedDate: "1 Jan 2024",
      deadline: "15 Jan 2024",
      description: "Développement d'une stratégie de communication globale et gestion des relations publiques...",
      logo: "https://via.placeholder.com/60x60"
    }
  ];

  const categories = [
    { value: '', label: 'Toutes les catégories' },
    { value: 'Stratégie', label: 'Stratégie' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'RH', label: 'Ressources Humaines' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Communication', label: 'Communication' }
  ];

  const locations = [
    { value: '', label: 'Tous les lieux' },
    { value: 'Cotonou', label: 'Cotonou' },
    { value: 'Porto-Novo', label: 'Porto-Novo' },
    { value: 'Abomey-Calavi', label: 'Abomey-Calavi' },
    { value: 'Parakou', label: 'Parakou' }
  ];

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Filtres appliqués:', filters);
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || consultation.category === selectedCategory;
    const matchesLocation = !selectedLocation || consultation.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-handshake text-fuchsia-600 mr-3"></i>
            Consultations
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez des opportunités de consultation et d'expertise dans divers domaines. 
            Trouvez des missions qui correspondent à vos compétences et à votre expérience.
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
                    placeholder="Rechercher une consultation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
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
                  Consultations disponibles ({filteredConsultations.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Trier par :</span>
                  <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                    <option>Plus récentes</option>
                    <option>Budget élevé</option>
                    <option>Durée courte</option>
                  </select>
                </div>
              </div>

              {filteredConsultations.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune consultation trouvée</h3>
                  <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConsultations.map((consultation) => (
                    <div key={consultation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                      <div className="flex items-start space-x-4">
                        <img src={consultation.logo} alt={consultation.client} className="w-16 h-16 rounded-lg object-cover" />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                <Link to={`/consultations/${consultation.id}`} className="hover:text-fuchsia-600 transition duration-200">
                                  {consultation.title}
                                </Link>
                              </h3>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                <span className="flex items-center">
                                  <i className="fas fa-building mr-2"></i>
                                  {consultation.client}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-map-marker-alt mr-2"></i>
                                  {consultation.location}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-2"></i>
                                  {consultation.postedDate}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{consultation.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {consultation.budget}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {consultation.duration}
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {consultation.experience}
                                </span>
                                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {consultation.category}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-end space-y-2">
                              <span className="text-sm text-red-600 font-medium">
                                <i className="fas fa-clock mr-1"></i>
                                Limite : {consultation.deadline}
                              </span>
                              <Link 
                                to={`/consultations/${consultation.id}`}
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
        <h2 className="text-2xl font-bold mb-4">Vous êtes consultant ?</h2>
        <p className="text-lg mb-6 opacity-90">
          Rejoignez notre plateforme et trouvez des missions qui correspondent à vos compétences
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Créer un compte consultant
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

export default Consultations; 