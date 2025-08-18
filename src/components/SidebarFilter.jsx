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
      { id: 'algerie', label: 'Algérie', count: 12 },
      { id: 'angola', label: 'Angola', count: 8 },
      { id: 'benin', label: 'Bénin', count: 15 },
      { id: 'botswana', label: 'Botswana', count: 6 },
      { id: 'burkina-faso', label: 'Burkina Faso', count: 18 },
      { id: 'burundi', label: 'Burundi', count: 9 },
      { id: 'cameroun', label: 'Cameroun', count: 22 },
      { id: 'cap-vert', label: 'Cap-Vert', count: 4 },
      { id: 'republique-centrafricaine', label: 'République centrafricaine', count: 7 },
      { id: 'comores', label: 'Comores', count: 3 },
      { id: 'congo', label: 'Congo', count: 11 },
      { id: 'republique-democratique-congo', label: 'République démocratique du Congo', count: 25 },
      { id: 'cote-divoire', label: 'Côte d\'Ivoire', count: 19 },
      { id: 'djibouti', label: 'Djibouti', count: 5 },
      { id: 'egypte', label: 'Égypte', count: 28 },
      { id: 'erythree', label: 'Érythrée', count: 4 },
      { id: 'ethiopie', label: 'Éthiopie', count: 31 },
      { id: 'gabon', label: 'Gabon', count: 8 },
      { id: 'gambie', label: 'Gambie', count: 6 },
      { id: 'ghana', label: 'Ghana', count: 24 },
      { id: 'guinee', label: 'Guinée', count: 12 },
      { id: 'guinee-bissau', label: 'Guinée-Bissau', count: 5 },
      { id: 'guinee-equatoriale', label: 'Guinée équatoriale', count: 4 },
      { id: 'kenya', label: 'Kenya', count: 35 },
      { id: 'lesotho', label: 'Lesotho', count: 3 },
      { id: 'liberia', label: 'Libéria', count: 8 },
      { id: 'libye', label: 'Libye', count: 9 },
      { id: 'madagascar', label: 'Madagascar', count: 14 },
      { id: 'malawi', label: 'Malawi', count: 11 },
      { id: 'mali', label: 'Mali', count: 16 },
      { id: 'mauritanie', label: 'Mauritanie', count: 7 },
      { id: 'maurice', label: 'Maurice', count: 6 },
      { id: 'maroc', label: 'Maroc', count: 26 },
      { id: 'mozambique', label: 'Mozambique', count: 13 },
      { id: 'namibie', label: 'Namibie', count: 5 },
      { id: 'niger', label: 'Niger', count: 12 },
      { id: 'nigeria', label: 'Nigeria', count: 42 },
      { id: 'rwanda', label: 'Rwanda', count: 17 },
      { id: 'sao-tome-et-principe', label: 'São Tomé-et-Principe', count: 2 },
      { id: 'senegal', label: 'Sénégal', count: 21 },
      { id: 'seychelles', label: 'Seychelles', count: 3 },
      { id: 'sierra-leone', label: 'Sierra Leone', count: 9 },
      { id: 'somalie', label: 'Somalie', count: 6 },
      { id: 'afrique-du-sud', label: 'Afrique du Sud', count: 38 },
      { id: 'soudan', label: 'Soudan', count: 15 },
      { id: 'soudan-du-sud', label: 'Soudan du Sud', count: 7 },
      { id: 'swaziland', label: 'Eswatini (Swaziland)', count: 4 },
      { id: 'tanzanie', label: 'Tanzanie', count: 19 },
      { id: 'tchad', label: 'Tchad', count: 10 },
      { id: 'togo', label: 'Togo', count: 13 },
      { id: 'tunisie', label: 'Tunisie', count: 20 },
      { id: 'ouganda', label: 'Ouganda', count: 23 },
      { id: 'zambie', label: 'Zambie', count: 12 },
      { id: 'zimbabwe', label: 'Zimbabwe', count: 14 }
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