import React, { useState } from 'react';

const SidebarFilter = ({ onFilterChange, activeFilters = {} }) => {
  const [expandedSections, setExpandedSections] = useState({
    localisations: false,
    contrats: false,
    fonctions: false,
    secteurs: false
  });

  const filterData = {
    localisations: [
      { id: 'afrique', label: 'Afrique', count: 98 },
      { id: 'amerique-latine', label: 'Amérique latine', count: 18 },
      { id: 'asie', label: 'Asie', count: 20 },
      { id: 'europe', label: 'Europe', count: 433 },
      { id: 'moyen-orient', label: 'Moyen Orient', count: 24 },
      { id: 'oceanie', label: 'Océanie', count: 1 },
      { id: 'pakistan', label: 'Pakistan', count: 1 }
    ],
    contrats: [
      { id: 'cdd', label: 'Contrat à Durée Déterminée', count: 250 },
      { id: 'cdi', label: 'Contrat à Durée Indéterminée', count: 174 },
      { id: 'stage', label: 'Stage ou Alternance', count: 106 },
      { id: 'volontariat', label: 'Contrat de volontariat', count: 26 },
      { id: 'benevole', label: 'Activité bénévole', count: 15 }
    ],
    fonctions: [
      { id: 'autre', label: 'Autre', count: 150 },
      { id: 'communication', label: 'Communication', count: 58 },
      { id: 'direction', label: 'Direction et administration', count: 53 },
      { id: 'dons', label: 'Dons & Collecte', count: 32 },
      { id: 'expertise', label: 'Expertise', count: 29 },
      { id: 'formation', label: 'Formation', count: 30 },
      { id: 'gestion-projets', label: 'Gestion de projets et programmes', count: 183 },
      { id: 'management', label: 'Management & Administration', count: 73 },
      { id: 'medical', label: 'Medical', count: 27 },
      { id: 'plaidoyer', label: 'Plaidoyer et Recherches', count: 34 },
      { id: 'projets-numeriques', label: 'Projets numériques', count: 14 },
      { id: 'responsable-zone', label: 'Responsable zone géographique', count: 18 },
      { id: 'rh-finances', label: 'RH et Finances', count: 79 },
      { id: 'services-logistique', label: 'Services généraux et Logistique', count: 43 },
      { id: 'suivi-evaluation', label: 'Suivi Evaluation', count: 19 },
      { id: 'technicien', label: 'Technicien spécialisé', count: 39 },
      { id: 'travail-social', label: 'Travail social', count: 100 }
    ],
    secteurs: [
      { id: 'agriculture', label: 'Agriculture', count: 13 },
      { id: 'agriculture-environnement', label: 'Agriculture - environnement', count: 18 },
      { id: 'alimentation', label: 'Alimentation & Nutrition', count: 30 },
      { id: 'appui-institutionnel', label: 'Appui institutionnel, Décentralisation', count: 5 },
      { id: 'autre-secteur', label: 'Autre', count: 56 },
      { id: 'commerce-equitable', label: 'Commerce équitable', count: 5 },
      { id: 'developpement-economique', label: 'Développement économique et local', count: 48 },
      { id: 'droit', label: 'Droit', count: 7 },
      { id: 'droits-humains', label: 'Droits humains', count: 174 },
      { id: 'eau-assainissement', label: 'Eau et assainissement', count: 60 },
      { id: 'economie-finance', label: 'Economie, Finance, Administration', count: 6 },
      { id: 'education-formation', label: 'Education & Formation', count: 74 },
      { id: 'environnement-climat', label: 'Environnement / Climat', count: 52 },
      { id: 'genre', label: 'Genre', count: 37 },
      { id: 'gestion-crise', label: 'Gestion crise & post-crise', count: 75 },
      { id: 'informatique-communication', label: 'Informatique, Communication', count: 7 },
      { id: 'migration', label: 'Migration', count: 108 },
      { id: 'plaidoyer-secteur', label: 'Plaidoyer', count: 104 },
      { id: 'ressources-humaines', label: 'Ressources Humaines', count: 5 },
      { id: 'sante', label: 'Santé', count: 173 },
      { id: 'social', label: 'Social', count: 185 }
    ]
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (category, filterId, checked) => {
    const currentFilters = activeFilters[category] || [];
    let newFilters;
    
    if (checked) {
      newFilters = [...currentFilters, filterId];
    } else {
      newFilters = currentFilters.filter(id => id !== filterId);
    }

    const updatedFilters = {
      ...activeFilters,
      [category]: newFilters
    };

    onFilterChange(updatedFilters);
  };

  const renderFilterSection = (category, title, items) => {
    const isExpanded = expandedSections[category];
    const activeFiltersForCategory = activeFilters[category] || [];

    return (
      <div className="mb-6">
        <button
          onClick={() => toggleSection(category)}
          className="w-full flex items-center justify-between text-left font-semibold text-gray-900 mb-3 hover:text-fuchsia-600 transition-colors"
        >
          <span>{title}</span>
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-sm transition-transform`}></i>
        </button>
        
        {isExpanded && (
          <div className="space-y-2">
            {items.map((item) => (
              <label key={item.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={activeFiltersForCategory.includes(item.id)}
                  onChange={(e) => handleFilterChange(category, item.id, e.target.checked)}
                  className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                />
                <span className="flex-1 text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          <i className="fas fa-filter mr-2 text-fuchsia-600"></i>
          Filtres
        </h3>
        <button
          onClick={() => onFilterChange({})}
          className="text-sm text-fuchsia-600 hover:text-fuchsia-800 font-medium"
        >
          Réinitialiser
        </button>
      </div>

      {renderFilterSection('localisations', 'Localisations', filterData.localisations)}
      {renderFilterSection('contrats', 'Contrats', filterData.contrats)}
      {renderFilterSection('fonctions', 'Fonctions', filterData.fonctions)}
      {renderFilterSection('secteurs', 'Secteur d\'activité', filterData.secteurs)}

      {/* Résumé des filtres actifs */}
      {Object.keys(activeFilters).some(category => activeFilters[category]?.length > 0) && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Filtres actifs :</h4>
          <div className="space-y-2">
            {Object.entries(activeFilters).map(([category, filters]) => 
              filters?.map(filterId => {
                const item = filterData[category]?.find(item => item.id === filterId);
                return item ? (
                  <div key={`${category}-${filterId}`} className="flex items-center justify-between bg-fuchsia-50 p-2 rounded">
                    <span className="text-sm text-fuchsia-800">{item.label}</span>
                    <button
                      onClick={() => handleFilterChange(category, filterId, false)}
                      className="text-fuchsia-600 hover:text-fuchsia-800"
                    >
                      <i className="fas fa-times text-xs"></i>
                    </button>
                  </div>
                ) : null;
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarFilter; 