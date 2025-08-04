import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LateralFilters from '../../components/LateralFilters';

const Finacement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Données d'exemple de financements
  const financements = [
    {
      id: "1",
      title: "Financement projet agricole",
      organization: "FIDA",
      amount: "5,000,000 FCFA",
      duration: "18 mois",
      description: "Financement pour projets agricoles innovants dans les zones rurales...",
      contractType: "Contrat à Durée Déterminée",
      function: "Direction et administration",
      sector: "agriculture",
      location: "Cotonou, Bénin",
      deadline: "2024-02-28"
    },
    {
      id: "2",
      title: "Subvention énergie renouvelable",
      organization: "Banque Mondiale",
      amount: "15,000,000 FCFA",
      duration: "24 mois",
      description: "Financement pour projets d'énergie solaire et éolienne...",
      contractType: "Contrat à Durée Indéterminée",
      function: "Expertise",
      sector: "Environnement / Climat",
      location: "Lomé, Togo",
      deadline: "2024-03-15"
    },
    {
      id: "3",
      title: "Microcrédit entrepreneuriat",
      organization: "Fonds Africain de Développement",
      amount: "2,500,000 FCFA",
      duration: "12 mois",
      description: "Microcrédit pour jeunes entrepreneurs et PME...",
      contractType: "Contrat à Durée Déterminée",
      function: "Autre",
      sector: "Développement économique et local",
      location: "Abidjan, Côte d'Ivoire",
      deadline: "2024-01-31"
    }
  ];

  const filteredFinancements = financements.filter(financement => {
    // Filtre de recherche
    const matchesSearch = financement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         financement.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         financement.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtres latéraux
    const matchesLocalisation = !filters.localisations?.length || 
                               filters.localisations.some(loc => financement.location?.includes(loc));
    const matchesContrat = !filters.contrats?.length || 
                          filters.contrats.includes(financement.contractType);
    const matchesFonction = !filters.fonctions?.length || 
                           filters.fonctions.includes(financement.function);
    const matchesSecteur = !filters.secteurs?.length || 
                          filters.secteurs.includes(financement.sector);
    
    return matchesSearch && matchesLocalisation && matchesContrat && matchesFonction && matchesSecteur;
  });

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <i className="fas fa-money-bill-wave text-fuchsia-600 mr-3"></i>
            Financements
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez des opportunités de financement pour vos projets. 
            Trouvez le soutien financier qui correspond à vos besoins.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="relative max-w-2xl mx-auto">
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                  <input
                    type="text"
            placeholder="Rechercher un financement..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>

      {/* Main Content with Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lateral Filters */}
        <div className="lg:col-span-1">
          <LateralFilters onFilterChange={handleFilterChange} filters={filters} />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Financements disponibles ({filteredFinancements.length})
                </h2>
              <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Trier par :</span>
                  <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
                    <option>Plus récentes</option>
                  <option>Montant élevé</option>
                  <option>Date limite</option>
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
                        <div className="w-16 h-16 bg-fuchsia-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-money-bill-wave text-fuchsia-600 text-xl"></i>
                        </div>
                        
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
                                  {financement.organization}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-map-marker-alt mr-2"></i>
                                  {financement.location}
                                </span>
                                <span className="flex items-center">
                                  <i className="fas fa-calendar mr-2"></i>
                                  Limite : {new Date(financement.deadline).toLocaleDateString('fr-FR')}
                                </span>
                              </div>
                              
                              <p className="text-gray-700 mb-4">{financement.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-fuchsia-100 text-fuchsia-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {financement.amount}
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                  {financement.duration}
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                  Subvention
                                </span>
                        </div>
                      </div>
                      
                            <div className="flex flex-col items-end space-y-2">
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
      <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-lg p-8 text-white text-center mt-6">
        <h2 className="text-2xl font-bold mb-4">Vous êtes un organisme de financement ?</h2>
        <p className="text-lg mb-6 opacity-90">
          Publiez vos opportunités de financement et soutenez les projets innovants
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/signup" 
            className="bg-white text-fuchsia-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition duration-200 font-medium"
          >
            Créer un compte organisme
          </Link>
          <Link 
            to="/contact" 
            className="border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-fuchsia-600 transition duration-200 font-medium"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Finacement;
