import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dataService } from '../../services/dataService';

const Finacement = () => {
  const [financements, setFinancements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous les types');
  const [selectedAmount, setSelectedAmount] = useState('Tous les montants');
  const [selectedDuration, setSelectedDuration] = useState('Toutes les durées');
  const [selectedSectors, setSelectedSectors] = useState([]);

  useEffect(() => {
    fetchFinancements();
  }, []);

  const fetchFinancements = async () => {
    try {
      setLoading(true);
      const financementsData = await dataService.getFinancements({ isActive: true });
      setFinancements(financementsData);
    } catch (error) {
      setError('Erreur lors du chargement des financements');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSectorChange = (sector) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const filteredFinancements = financements.filter(financement => {
    const matchesSearch = financement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         financement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'Tous les types' || financement.type === selectedType;
    
    const matchesAmount = selectedAmount === 'Tous les montants' || 
      (selectedAmount === '0 - 1M FCFA' && parseInt(financement.maxAmount) <= 1000000) ||
      (selectedAmount === '1M - 5M FCFA' && parseInt(financement.minAmount) >= 1000000 && parseInt(financement.maxAmount) <= 5000000) ||
      (selectedAmount === '5M - 20M FCFA' && parseInt(financement.minAmount) >= 5000000 && parseInt(financement.maxAmount) <= 20000000) ||
      (selectedAmount === '20M+ FCFA' && parseInt(financement.minAmount) >= 20000000);
    
    const matchesDuration = selectedDuration === 'Toutes les durées' ||
      (selectedDuration === '0 - 1 an' && parseInt(financement.repaymentPeriod) <= 12) ||
      (selectedDuration === '1 - 3 ans' && parseInt(financement.repaymentPeriod) >= 12 && parseInt(financement.repaymentPeriod) <= 36) ||
      (selectedDuration === '3 - 5 ans' && parseInt(financement.repaymentPeriod) >= 36 && parseInt(financement.repaymentPeriod) <= 60) ||
      (selectedDuration === '5+ ans' && parseInt(financement.repaymentPeriod) >= 60);
    
    const matchesSector = selectedSectors.length === 0 || selectedSectors.includes(financement.sector);
    
    return matchesSearch && matchesType && matchesAmount && matchesDuration && matchesSector;
  });

  const stats = {
    total: financements.length,
    institutions: new Set(financements.map(f => f.contactInfo.split('@')[1]?.split('.')[0] || 'Unknown')).size,
    funded: financements.reduce((sum, f) => sum + (f.applications || 0), 0),
    averageAmount: financements.length > 0 
      ? Math.round(financements.reduce((sum, f) => sum + parseInt(f.maxAmount), 0) / financements.length / 1000000 * 10) / 10
      : 0
  };

  if (loading) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </main>
    );
  }

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
                  <option>Capital-risque</option>
                  <option>Microcrédit</option>
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
                  {['Agriculture', 'Commerce', 'Services', 'Technologie', 'Innovation', 'Artisanat'].map(sector => (
                    <label key={sector} className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedSectors.includes(sector)}
                        onChange={() => handleSectorChange(sector)}
                        className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500" 
                      />
                      <span className="ml-2 text-sm text-gray-700">{sector}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('Tous les types');
                  setSelectedAmount('Tous les montants');
                  setSelectedDuration('Toutes les durées');
                  setSelectedSectors([]);
                }}
                className="w-full bg-fuchsia-600 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-refresh mr-2"></i>Réinitialiser les filtres
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
                <div className="text-2xl font-bold text-green-600">{stats.total}</div>
                <div className="text-sm text-gray-600">Financements disponibles</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.institutions}</div>
                <div className="text-sm text-gray-600">Institutions partenaires</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.funded}</div>
                <div className="text-sm text-gray-600">Projets financés</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{stats.averageAmount}M</div>
                <div className="text-sm text-gray-600">FCFA montant moyen</div>
              </div>
            </div>
          </div>

          {/* Funding List */}
          <div className="space-y-4">
            {filteredFinancements.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <i className="fas fa-search text-gray-400 text-4xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun financement trouvé</h3>
                <p className="text-gray-600">Essayez de modifier vos critères de recherche</p>
              </div>
            ) : (
              filteredFinancements.map((financement) => (
                <div key={financement.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                          <i className="fas fa-seedling text-green-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{financement.title}</h3>
                          <p className="text-green-600 font-medium">{financement.contactInfo.split('@')[0]}@{financement.contactInfo.split('@')[1]?.split('.')[0]}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{financement.sector}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{financement.type}</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">{financement.targetAudience}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-money-bill mr-2"></i>
                          <span>{parseInt(financement.minAmount).toLocaleString()} - {parseInt(financement.maxAmount).toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-percentage mr-2"></i>
                          <span>{financement.interestRate}% annuel</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <i className="fas fa-calendar mr-2"></i>
                          <span>{financement.repaymentPeriod} mois</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4">
                        {financement.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button className="text-gray-400 hover:text-red-500 transition duration-200">
                        <i className="far fa-heart"></i>
                      </button>
                      <Link 
                        to={`/financements/${financement.id}`}
                        className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 text-sm"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {filteredFinancements.length > 0 && (
            <div className="text-center mt-8">
              <button className="bg-white text-fuchsia-600 border border-fuchsia-600 px-6 py-3 rounded-lg hover:bg-fuchsia-50 transition duration-200">
                <i className="fas fa-plus mr-2"></i>Charger plus de financements
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Finacement;
