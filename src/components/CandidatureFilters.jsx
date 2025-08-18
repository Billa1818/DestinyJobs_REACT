import React from 'react';

const CandidatureFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onReset,
  showPriorityFilter = true,
  showStatusFilter = true,
  showSearchFilter = true
}) => {
  const statusOptions = [
    { value: '', label: 'Tous les statuts' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'VIEWED', label: 'Vue' },
    { value: 'SHORTLISTED', label: 'Sélectionnée' },
    { value: 'REJECTED', label: 'Refusée' },
    { value: 'INTERVIEW', label: 'Entretien' },
    { value: 'ACCEPTED', label: 'Acceptée' }
  ];

  const priorityOptions = [
    { value: '', label: 'Toutes les priorités' },
    { value: 'HIGH', label: 'Haute priorité' },
    { value: 'NORMAL', label: 'Priorité normale' },
    { value: 'LOW', label: 'Basse priorité' }
  ];

  const orderingOptions = [
    { value: '-created_at', label: 'Plus récentes' },
    { value: 'created_at', label: 'Plus anciennes' },
    { value: '-priority', label: 'Priorité décroissante' },
    { value: 'priority', label: 'Priorité croissante' },
    { value: 'status', label: 'Par statut' }
  ];

  const handleFilterChange = (filterName, value) => {
    onFilterChange(filterName, value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch();
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-4 lg:p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Barre de recherche */}
          {showSearchFilter && (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                  <input 
                    type="text" 
                    placeholder="Rechercher par nom, email..." 
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-fuchsia-600 text-white px-6 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
              >
                Rechercher
              </button>
            </div>
          )}

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtre par statut */}
            {showStatusFilter && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                <select
                  id="status"
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtre par priorité */}
            {showPriorityFilter && (
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priorité
                </label>
                <select
                  id="priority"
                  value={filters.priority || ''}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filtre par tri */}
            <div>
              <label htmlFor="ordering" className="block text-sm font-medium text-gray-700 mb-1">
                Trier par
              </label>
              <select
                id="ordering"
                value={filters.ordering || '-created_at'}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                {orderingOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Bouton de réinitialisation */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidatureFilters; 