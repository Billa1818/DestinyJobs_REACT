import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const PostulationOffre = () => {
  const { id } = useParams();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    experience: '',
    offre: '',
    localisation: '',
    dateCandidature: '',
    note: '',
    competences: ''
  });

  const [candidatures, setCandidatures] = useState([
    {
      id: 1,
      nom: 'Aminata MOUSSA',
      titre: 'Consultante Senior en Stratégie',
      experience: '8 ans',
      statut: 'shortlisted',
      competences: ['MBA', 'Stratégie', 'Transformation', 'McKinsey'],
      email: 'aminata.moussa@email.com',
      telephone: '+229 97 12 34 56',
      dateCandidature: '2024-01-15',
      avatar: 'AM',
      note: 4.8,
      cv: true,
      lettre: true,
      offre: 'Consultant Senior en Stratégie',
      localisation: 'Cotonou, Bénin',
      niveauExperience: 'senior'
    },
    {
      id: 2,
      nom: 'Kouassi KONE',
      titre: 'Directeur Stratégique',
      experience: '12 ans',
      statut: 'reviewing',
      competences: ['Stratégie', 'Management', 'Finance', 'BCG'],
      email: 'kouassi.kone@email.com',
      telephone: '+229 96 87 65 43',
      dateCandidature: '2024-01-14',
      avatar: 'KK',
      note: 4.5,
      cv: true,
      lettre: false,
      offre: 'Directeur Stratégique',
      localisation: 'Porto-Novo, Bénin',
      niveauExperience: 'senior'
    },
    {
      id: 3,
      nom: 'Fatou DIALLO',
      titre: 'Consultante en Transformation',
      experience: '5 ans',
      statut: 'new',
      competences: ['Transformation', 'Digital', 'Agile', 'Bain'],
      email: 'fatou.diallo@email.com',
      telephone: '+229 95 43 21 09',
      dateCandidature: '2024-01-13',
      avatar: 'FD',
      note: 4.2,
      cv: true,
      lettre: true,
      offre: 'Consultant en Transformation',
      localisation: 'Abomey-Calavi, Bénin',
      niveauExperience: 'mid'
    },
    {
      id: 4,
      nom: 'Marc DOSSOU',
      titre: 'Analyste Stratégique',
      experience: '2 ans',
      statut: 'new',
      competences: ['Analyse', 'Excel', 'PowerPoint', 'Stratégie'],
      email: 'marc.dossou@email.com',
      telephone: '+229 94 56 78 90',
      dateCandidature: '2024-01-12',
      avatar: 'MD',
      note: 3.8,
      cv: true,
      lettre: true,
      offre: 'Analyste Stratégique',
      localisation: 'Parakou, Bénin',
      niveauExperience: 'junior'
    },
    {
      id: 5,
      nom: 'Rachelle HOUNGBO',
      titre: 'Consultante en Innovation',
      experience: '6 ans',
      statut: 'interview',
      competences: ['Innovation', 'Design Thinking', 'Startup', 'Digital'],
      email: 'rachelle.houngbo@email.com',
      telephone: '+229 93 45 67 89',
      dateCandidature: '2024-01-11',
      avatar: 'RH',
      note: 4.6,
      cv: true,
      lettre: true,
      offre: 'Consultant en Innovation',
      localisation: 'Cotonou, Bénin',
      niveauExperience: 'mid'
    }
  ]);

  const [filteredCandidatures, setFilteredCandidatures] = useState(candidatures);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const stats = {
    total: candidatures.length,
    enCours: candidatures.filter(c => c.statut === 'reviewing').length,
    preselectionne: candidatures.filter(c => c.statut === 'shortlisted').length,
    refuse: candidatures.filter(c => c.statut === 'rejected').length
  };

  const filteredStats = {
    total: filteredCandidatures.length,
    enCours: filteredCandidatures.filter(c => c.statut === 'reviewing').length,
    preselectionne: filteredCandidatures.filter(c => c.statut === 'shortlisted').length,
    refuse: filteredCandidatures.filter(c => c.statut === 'rejected').length
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = candidatures;

    if (filters.search) {
      filtered = filtered.filter(c => 
        c.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.competences.some(comp => comp.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.status) {
      filtered = filtered.filter(c => c.statut === filters.status);
    }

    if (filters.experience) {
      filtered = filtered.filter(c => c.niveauExperience === filters.experience);
    }

    if (filters.offre) {
      filtered = filtered.filter(c => c.offre.toLowerCase().includes(filters.offre.toLowerCase()));
    }

    if (filters.localisation) {
      filtered = filtered.filter(c => c.localisation.toLowerCase().includes(filters.localisation.toLowerCase()));
    }

    if (filters.competences) {
      filtered = filtered.filter(c => 
        c.competences.some(comp => comp.toLowerCase().includes(filters.competences.toLowerCase()))
      );
    }

    if (filters.note) {
      const noteValue = parseFloat(filters.note);
      filtered = filtered.filter(c => c.note >= noteValue);
    }

    setFilteredCandidatures(filtered);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: '',
      experience: '',
      offre: '',
      localisation: '',
      dateCandidature: '',
      note: '',
      competences: ''
    });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'new': return 'border-blue-500 bg-blue-50';
      case 'reviewing': return 'border-yellow-500 bg-yellow-50';
      case 'shortlisted': return 'border-green-500 bg-green-50';
      case 'interview': return 'border-purple-500 bg-purple-50';
      case 'rejected': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'new': return 'Nouvelle';
      case 'reviewing': return 'En évaluation';
      case 'shortlisted': return 'Présélectionnée';
      case 'interview': return 'Entretien programmé';
      case 'rejected': return 'Refusée';
      default: return 'Inconnu';
    }
  };

  const updateCandidatureStatus = (id, newStatus) => {
    setCandidatures(prev => prev.map(candidature => 
      candidature.id === id ? { ...candidature, statut: newStatus } : candidature
    ));
  };

  useEffect(() => {
    let filtered = candidatures;

    if (filters.search) {
      filtered = filtered.filter(candidature => 
        candidature.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidature.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
        candidature.competences.some(comp => comp.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.status) {
      filtered = filtered.filter(candidature => candidature.statut === filters.status);
    }

    if (filters.experience) {
      filtered = filtered.filter(candidature => {
        const exp = parseInt(candidature.experience);
        switch (filters.experience) {
          case 'junior': return exp <= 3;
          case 'mid': return exp > 3 && exp <= 7;
          case 'senior': return exp > 7;
          default: return true;
        }
      });
    }

    setFilteredCandidatures(filtered);
  }, [filters, candidatures]);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
                <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-users mr-2 text-purple-600"></i>
                        Candidatures - Consultant en Stratégie
                    </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Gérez et évaluez les candidatures reçues pour cette consultation
                    </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Consultation</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{stats.total} candidatures</span>
              <span className="text-xs text-gray-500">Publié le 8 juin 2025</span>
                    </div>
                </div>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/gestion-offres"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i>
                        Retour aux offres
            </Link>
                </div>
            </div>
        </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredStats.total}</div>
          <div className="text-xs text-gray-500">Candidatures filtrées</div>
          <div className="text-xs text-gray-400">sur {stats.total} total</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{filteredStats.enCours}</div>
          <div className="text-xs text-gray-500">En cours d'évaluation</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-green-600">{filteredStats.preselectionne}</div>
          <div className="text-xs text-gray-500">Présélectionné</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-600">{filteredStats.refuse}</div>
          <div className="text-xs text-gray-500">Refusées</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Filtres avancés</h3>
        </div>
        
        {/* Première ligne de filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nom, email, compétences..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="">Tous les statuts</option>
              <option value="new">Nouvelles</option>
              <option value="reviewing">En évaluation</option>
              <option value="shortlisted">Présélectionnées</option>
              <option value="interview">Entretien programmé</option>
              <option value="rejected">Refusées</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expérience</label>
            <select 
              name="experience"
              value={filters.experience}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="">Toute expérience</option>
              <option value="junior">Junior (0-3 ans)</option>
              <option value="mid">Confirmé (3-7 ans)</option>
              <option value="senior">Senior (7+ ans)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note minimum</label>
            <select 
              name="note"
              value={filters.note}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            >
              <option value="">Toutes les notes</option>
              <option value="4.5">4.5+ étoiles</option>
              <option value="4.0">4.0+ étoiles</option>
              <option value="3.5">3.5+ étoiles</option>
              <option value="3.0">3.0+ étoiles</option>
            </select>
          </div>
        </div>
        
        {/* Deuxième ligne de filtres */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offre</label>
            <input 
              type="text" 
              name="offre"
              value={filters.offre}
              onChange={handleFilterChange}
              placeholder="Rechercher par offre..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <input 
              type="text" 
              name="localisation"
              value={filters.localisation}
              onChange={handleFilterChange}
              placeholder="Ville, région..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Compétences</label>
            <input 
              type="text" 
              name="competences"
              value={filters.competences}
              onChange={handleFilterChange}
              placeholder="Rechercher par compétences..." 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <i className="fas fa-undo mr-2"></i>
              Réinitialiser
            </button>
          </div>
        </div>
        
        {/* Résultats du filtrage */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {filteredCandidatures.length} candidature(s) trouvée(s) sur {candidatures.length} total
            </span>
            <div className="flex space-x-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                <i className="fas fa-filter mr-1"></i>
                Filtres actifs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des candidatures */}
      <div className="space-y-4">
        {filteredCandidatures.map((candidature) => (
          <div key={candidature.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-fuchsia-500">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-fuchsia-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {candidature.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidature.nom}</h3>
                      <p className="text-sm text-gray-600">{candidature.titre}</p>
                      <p className="text-sm text-gray-600">{candidature.email}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm text-gray-500">
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {candidature.localisation}
                        </span>
                        <span className="text-sm text-gray-500">
                          <i className="fas fa-briefcase mr-1"></i>
                          {candidature.experience}
                        </span>
                        <span className="text-sm text-gray-500">
                          <i className="fas fa-briefcase mr-1"></i>
                          {candidature.offre}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidature.statut).replace('border-', 'bg-').replace('50', '100')}`}>
                      {getStatusText(candidature.statut)}
                    </span>
                    <div className="text-center">
                      <div className="text-lg font-bold text-fuchsia-600">{candidature.note}/5</div>
                      <div className="text-xs text-gray-500">Note</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Compétences</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidature.competences.map((competence, index) => (
                      <span key={index} className="px-2 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full text-xs">
                        {competence}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-sm font-bold text-gray-900">{candidature.experience}</div>
                    <div className="text-xs text-gray-500">Expérience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">{candidature.cv ? 'Oui' : 'Non'}</div>
                    <div className="text-xs text-gray-500">CV</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-600">{candidature.lettre ? 'Oui' : 'Non'}</div>
                    <div className="text-xs text-gray-500">Lettre</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-600">{candidature.competences.length}</div>
                    <div className="text-xs text-gray-500">Compétences</div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Candidature soumise le {new Date(candidature.dateCandidature).toLocaleDateString('fr-FR')}
                </div>
              </div>
              
              <div className="flex flex-row lg:flex-col gap-2 mt-4 lg:mt-0 lg:ml-4">
                <button className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200 text-sm">
                  <i className="fas fa-eye mr-1"></i>Voir détails
                </button>
                <button className="px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition duration-200 text-sm">
                  <i className="fas fa-file-pdf mr-1"></i>CV
                </button>
                <button className="px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition duration-200 text-sm">
                  <i className="fas fa-envelope mr-1"></i>Lettre
                </button>
                <button className="px-3 py-2 text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg transition duration-200 text-sm">
                  <i className="fas fa-chart-pie mr-1"></i>Compatibilité
                </button>
                <button className="px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition duration-200 text-sm">
                  <i className="fas fa-envelope mr-1"></i>Contacter
                </button>
                <button className="px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition duration-200 text-sm">
                  <i className="fas fa-sticky-note mr-1"></i>Note
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCandidatures.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-users text-3xl text-gray-400"></i>
                    </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune candidature trouvée</h3>
          <p className="text-gray-600 mb-4">Aucune candidature ne correspond aux critères de recherche.</p>
          <button 
            onClick={() => setFilters({ search: '', status: '', experience: '' })}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-200"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};

export default PostulationOffre;