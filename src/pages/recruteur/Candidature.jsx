import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Candidature = () => {
  const [filters, setFilters] = useState({
    service: '',
    offre: '',
    date: '',
    statut: '',
    search: ''
  });

  const [candidats, setCandidats] = useState([
    {
      id: 1,
      nom: 'Amina Kone',
      email: 'amina.kone@email.com',
      service: 'emploi',
      offre: 'Développeur Full Stack Senior',
      statut: 'accepte',
      dateAcceptation: '2024-01-15',
      competences: ['React', 'Node.js', 'MongoDB'],
      experience: '5 ans',
      telephone: '+229 97 12 34 56',
      avatar: 'AK'
    },
    {
      id: 2,
      nom: 'Marc Dossou',
      email: 'marc.dossou@email.com',
      service: 'emploi',
      offre: 'Chef de projet IT',
      statut: 'en-cours',
      dateAcceptation: '2024-01-14',
      competences: ['Gestion de projet', 'Agile', 'Scrum'],
      experience: '7 ans',
      telephone: '+229 96 87 65 43',
      avatar: 'MD'
    },
    {
      id: 3,
      nom: 'Fatou Diallo',
      email: 'fatou.diallo@email.com',
      service: 'consultation',
      offre: 'Consultante Marketing Digital',
      statut: 'finalise',
      dateAcceptation: '2024-01-10',
      competences: ['Marketing Digital', 'SEO', 'Analytics'],
      experience: '4 ans',
      telephone: '+229 95 43 21 09',
      avatar: 'FD'
    }
  ]);

  const [filteredCandidats, setFilteredCandidats] = useState(candidats);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = candidats;

    if (filters.service) {
      filtered = filtered.filter(c => c.service === filters.service);
    }
    if (filters.offre) {
      filtered = filtered.filter(c => c.offre.includes(filters.offre));
    }
    if (filters.statut) {
      filtered = filtered.filter(c => c.statut === filters.statut);
    }
    if (filters.search) {
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.competences.some(comp => comp.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    setFilteredCandidats(filtered);
  };

  const resetFilters = () => {
    setFilters({
      service: '',
      offre: '',
      date: '',
      statut: '',
      search: ''
    });
    setFilteredCandidats(candidats);
  };

  const exportData = () => {
    console.log('Exporting candidats data:', filteredCandidats);
    // Ici vous ajouterez la logique d'export
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'accepte': return 'text-green-600 bg-green-100';
      case 'en-cours': return 'text-yellow-600 bg-yellow-100';
      case 'finalise': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'accepte': return 'Accepté';
      case 'en-cours': return 'En cours';
      case 'finalise': return 'Finalisé';
      default: return 'Inconnu';
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Candidats Acceptés</h1>
            <p className="text-gray-600">Gérez vos candidats acceptés pour vos différentes offres</p>
                </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border">
              <span className="text-sm text-gray-500">Total acceptés:</span>
              <span className="font-semibold text-fuchsia-600 ml-1">{filteredCandidats.length}</span>
                    </div>
                </div>
            </div>
        </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type de service */}
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de service</label>
              <select 
                name="service"
                value={filters.service}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              >
                            <option value="">Tous les services</option>
                            <option value="emploi">Emploi/Jobs</option>
                            <option value="consultation">Consultation</option>
                            <option value="financement">Financement</option>
                        </select>
                    </div>

            {/* Offre spécifique */}
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offre</label>
              <select 
                name="offre"
                value={filters.offre}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              >
                            <option value="">Toutes les offres</option>
                <option value="Développeur">Développeur Full Stack Senior</option>
                <option value="Chef de projet">Chef de projet IT</option>
                <option value="Consultante">Consultante Marketing Digital</option>
                        </select>
                    </div>

            {/* Date d'acceptation */}
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période d'acceptation</label>
              <select 
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              >
                            <option value="">Toutes les périodes</option>
                            <option value="7">7 derniers jours</option>
                            <option value="30">30 derniers jours</option>
                            <option value="90">3 derniers mois</option>
                        </select>
                    </div>

            {/* Statut */}
                    <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
              <select 
                name="statut"
                value={filters.statut}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              >
                            <option value="">Tous les statuts</option>
                            <option value="accepte">Accepté</option>
                            <option value="en-cours">En cours</option>
                            <option value="finalise">Finalisé</option>
                        </select>
                    </div>
                </div>
                
          {/* Search bar */}
          <div className="mt-4">
            <div className="relative">
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher par nom, email ou compétences..." 
                className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <i className="fas fa-search text-gray-400"></i>
                        </div>
                    </div>
                </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button 
              onClick={applyFilters}
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-filter mr-2"></i>Appliquer les filtres
                    </button>
            <button 
              onClick={resetFilters}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
            >
              <i className="fas fa-undo mr-2"></i>Réinitialiser
                    </button>
            <button 
              onClick={exportData}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              <i className="fas fa-download mr-2"></i>Exporter
                    </button>
                </div>
            </div>
        </div>

      {/* Candidats List */}
      <div className="space-y-4">
        {filteredCandidats.map((candidat) => (
          <div key={candidat.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition duration-200">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                {/* Candidat Info */}
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-fuchsia-600">{candidat.avatar}</span>
                                    </div>
                                </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{candidat.nom}</h3>
                        <p className="text-sm text-gray-600 mb-2">{candidat.email}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          <i className="fas fa-phone mr-1"></i>{candidat.telephone}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {candidat.competences.map((competence, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {competence}
                                            </span>
                          ))}
                                        </div>
                                    </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(candidat.statut)}`}>
                          {getStatusText(candidat.statut)}
                                        </span>
                        <p className="text-sm text-gray-500">
                          Accepté le {new Date(candidat.dateAcceptation).toLocaleDateString('fr-FR')}
                        </p>
                                </div>
                            </div>
                            
                    {/* Job Details */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Poste accepté</h4>
                          <p className="text-sm text-gray-600">{candidat.offre}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Expérience</h4>
                          <p className="text-sm text-gray-600">{candidat.experience}</p>
                        </div>
                            </div>
                        </div>
                                    </div>
                                </div>
                            </div>
                            
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
                <button className="flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200">
                  <i className="fas fa-eye mr-2"></i>Voir le profil complet
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                  <i className="fas fa-envelope mr-2"></i>Envoyer un message
                                </button>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200">
                  <i className="fas fa-calendar-check mr-2"></i>Planifier un entretien
                                </button>
                <button className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200">
                  <i className="fas fa-download mr-2"></i>Télécharger CV
                                </button>
                            </div>
                        </div>
                    </div>
        ))}
        </div>

      {/* Empty State */}
      {filteredCandidats.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-users text-3xl text-gray-400"></i>
            </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun candidat trouvé</h3>
          <p className="text-gray-600 mb-4">Aucun candidat ne correspond aux critères de recherche.</p>
          <button 
            onClick={resetFilters}
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
          >
            Réinitialiser les filtres
                </button>
        </div>
      )}
    </div>
  );
};

export default Candidature;