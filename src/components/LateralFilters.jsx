import React, { useState } from 'react';

const LateralFilters = ({ onFilterChange, filters = {} }) => {
  const [expandedSections, setExpandedSections] = useState({
    localisations: true,
    contrats: true,
    fonctions: true,
    secteurs: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const localisations = [
    { name: 'Afrique', count: 95 },
    { name: 'Amérique latine', count: 16 },
    { name: 'Asie', count: 20 },
    { name: 'Europe', count: 431 },
    { name: 'Moyen Orient', count: 24 },
    { name: 'Océanie', count: 1 },
    { name: 'Pakistan', count: 1 }
  ];

  const contrats = [
    { name: 'Contrat à Durée Déterminée', count: 247 },
    { name: 'Contrat à Durée Indéterminée', count: 170 }
  ];

  const fonctions = [
    { name: 'Autre', count: 149 },
    { name: 'Communication', count: 57 },
    { name: 'Direction et administration', count: 51 },
    { name: 'Dons & Collecte', count: 31 },
    { name: 'Expertise', count: 28 }
  ];

  const secteurs = [
    { name: 'agriculture', count: 13 },
    { name: 'Agriculture - environnement', count: 17 },
    { name: 'Alimentation & Nutrition', count: 30 },
    { name: 'Appui institutionnel, Décentralisation', count: 5 },
    { name: 'Autre', count: 55 },
    { name: 'Commerce équitable', count: 5 },
    { name: 'Développement économique et local', count: 47 },
    { name: 'Droit', count: 7 },
    { name: 'Droits humains', count: 173 },
    { name: 'Eau et assainissement', count: 60 },
    { name: 'Economie, Finance, Administration', count: 6 },
    { name: 'Education & Formation', count: 73 },
    { name: 'Environnement / Climat', count: 50 },
    { name: 'Genre', count: 36 },
    { name: 'Gestion crise & post-crise', count: 72 },
    { name: 'Informatique, Communication', count: 7 },
    { name: 'Migration', count: 107 },
    { name: 'Plaidoyer', count: 105 },
    { name: 'Ressources Humaines', count: 5 },
    { name: 'Santé', count: 172 },
    { name: 'Social', count: 185 }
  ];

  const renderFilterSection = (title, items, filterKey, showMore = false) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => toggleSection(filterKey)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
      >
        <span>{title}</span>
        <i className={`fas fa-chevron-${expandedSections[filterKey] ? 'up' : 'down'} text-gray-500`}></i>
      </button>
      
      {expandedSections[filterKey] && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="checkbox"
                checked={filters[filterKey]?.includes(item.name) || false}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleFilterChange(filterKey, [...(filters[filterKey] || []), item.name]);
                  } else {
                    handleFilterChange(filterKey, (filters[filterKey] || []).filter(f => f !== item.name));
                  }
                }}
                className="rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
              />
              <span className="text-sm text-gray-700 flex-1">{item.name}</span>
              <span className="text-xs text-gray-500">({item.count})</span>
            </label>
          ))}
          {showMore && (
            <button className="text-fuchsia-600 text-sm font-medium hover:text-fuchsia-800">
              Voir plus
            </button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
      
      {renderFilterSection('Localisations', localisations, 'localisations')}
      {renderFilterSection('Contrats', contrats, 'contrats')}
      {renderFilterSection('Fonctions', fonctions, 'fonctions', true)}
      {renderFilterSection('Secteur d\'activité', secteurs, 'secteurs')}
      
      {/* Bouton pour effacer tous les filtres */}
      {(filters.localisations?.length > 0 || filters.contrats?.length > 0 || 
        filters.fonctions?.length > 0 || filters.secteurs?.length > 0) && (
        <button
          onClick={() => {
            handleFilterChange('localisations', []);
            handleFilterChange('contrats', []);
            handleFilterChange('fonctions', []);
            handleFilterChange('secteurs', []);
          }}
          className="w-full mt-4 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Effacer tous les filtres
        </button>
      )}
    </div>
  );
};

export default LateralFilters; 