import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const GestionOffre = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: ''
  });

  const [offres, setOffres] = useState([
    {
      id: 1,
      titre: 'Développeur Full Stack Senior',
      description: 'Recherche développeur expérimenté pour rejoindre notre équipe tech...',
      categorie: 'emploi',
      typeContrat: 'CDI',
      salaire: '180K - 300K FCFA',
      localisation: 'Remote',
      statut: 'active',
      candidatures: 28,
      enCours: 12,
      entretiens: 3,
      vues: 245,
      dateCreation: '2024-01-10',
      dateExpiration: '2024-02-10'
    },
    {
      id: 2,
      titre: 'Chef de projet IT',
      description: 'Nous cherchons un chef de projet expérimenté pour diriger nos projets digitaux...',
      categorie: 'emploi',
      typeContrat: 'CDD',
      salaire: '250K - 400K FCFA',
      localisation: 'Cotonou',
      statut: 'pending',
      candidatures: 15,
      enCours: 8,
      entretiens: 2,
      vues: 180,
      dateCreation: '2024-01-12',
      dateExpiration: '2024-02-12'
    },
    {
      id: 3,
      titre: 'Consultant Marketing Digital',
      description: 'Expert en marketing digital pour accompagner nos clients...',
      categorie: 'consultation',
      typeContrat: 'Freelance',
      salaire: 'À négocier',
      localisation: 'Porto-Novo',
      statut: 'paused',
      candidatures: 8,
      enCours: 3,
      entretiens: 1,
      vues: 95,
      dateCreation: '2024-01-08',
      dateExpiration: '2024-02-08'
    }
  ]);

  const [filteredOffres, setFilteredOffres] = useState(offres);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    offreId: null,
    offreName: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'active': return 'Active';
      case 'pending': return 'En attente';
      case 'paused': return 'En pause';
      case 'draft': return 'Brouillon';
      case 'expired': return 'Expirée';
      default: return 'Inconnu';
    }
  };

  const getCategoryColor = (categorie) => {
    switch (categorie) {
      case 'emploi': return 'bg-blue-100 text-blue-800';
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'stage': return 'bg-green-100 text-green-800';
      case 'freelance': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (categorie) => {
    switch (categorie) {
      case 'emploi': return 'Emploi';
      case 'consultation': return 'Consultation';
      case 'stage': return 'Stage';
      case 'freelance': return 'Freelance';
      default: return 'Autre';
    }
  };

  const toggleOffreStatus = (id, newStatus) => {
    setOffres(prev => prev.map(offre => 
      offre.id === id ? { ...offre, statut: newStatus } : offre
    ));
  };

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      offreId: id,
      offreName: name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      offreId: null,
      offreName: ''
    });
  };

  const confirmDelete = () => {
    if (deleteModal.offreId) {
      setOffres(prev => prev.filter(offre => offre.id !== deleteModal.offreId));
      closeDeleteModal();
    }
  };

  const handleModifier = (id) => {
    // Redirection vers la page de modification
    console.log('Navigating to edit page with ID:', id);
    navigate(`/recruteur/creer-offre?edit=${id}`, { replace: true });
  };

  const handleApercu = (id) => {
    // Ouvrir l'aperçu dans un nouvel onglet
    window.open(`/jobs/${id}`, '_blank');
  };

  const handleMettreEnPause = (id) => {
    const offre = offres.find(o => o.id === id);
    if (offre) {
      const newStatus = offre.statut === 'paused' ? 'active' : 'paused';
      toggleOffreStatus(id, newStatus);
    }
  };

  useEffect(() => {
    let filtered = offres;

    if (filters.search) {
      filtered = filtered.filter(offre => 
        offre.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
        offre.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.status) {
      filtered = filtered.filter(offre => offre.statut === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(offre => offre.categorie === filters.category);
    }

    setFilteredOffres(filtered);
  }, [filters, offres]);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
              Mes Offres d'Emploi
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez vos offres d'emploi et suivez les candidatures
            </p>
          </div>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/creer-offre"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle offre
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher une offre..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select 
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="pending">En attente</option>
              <option value="paused">En pause</option>
              <option value="draft">Brouillons</option>
              <option value="expired">Expirées</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select 
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
            >
              <option value="">Toutes les catégories</option>
              <option value="emploi">Emploi/Jobs</option>
              <option value="consultation">Consultation</option>
              <option value="stage">Stage</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Job Offers List */}
      <div className="space-y-4">
        {filteredOffres.map((offre) => (
          <div key={offre.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{offre.titre}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(offre.categorie)}`}>
                        {getCategoryText(offre.categorie)}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{offre.typeContrat}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{offre.salaire}</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">{offre.localisation}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{offre.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(offre.statut)}`}>
                      <i className="fas fa-circle text-xs mr-1"></i>{getStatusText(offre.statut)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fuchsia-600">{offre.candidatures}</div>
                    <div className="text-xs text-gray-500">Candidatures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{offre.enCours}</div>
                    <div className="text-xs text-gray-500">En cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{offre.entretiens}</div>
                    <div className="text-xs text-gray-500">Entretiens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{offre.vues}</div>
                    <div className="text-xs text-gray-500">Vues</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {new Date(offre.dateCreation).toLocaleDateString('fr-FR')}</span>
                  <span><i className="fas fa-calendar-times mr-1"></i>Expire le {new Date(offre.dateExpiration).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
              <Link 
                to={`/recruteur/postulations-offres/${offre.id}`}
                className="flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-users mr-2"></i>Voir candidatures ({offre.candidatures})
              </Link>
              <button 
                onClick={() => handleModifier(offre.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <i className="fas fa-edit mr-2"></i>Modifier
              </button>
              <button 
                onClick={() => handleApercu(offre.id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                <i className="fas fa-eye mr-2"></i>Aperçu
              </button>
              <button 
                onClick={() => handleMettreEnPause(offre.id)}
                className={`flex items-center px-4 py-2 rounded-md transition duration-200 ${
                  offre.statut === 'paused' 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                <i className={`mr-2 ${offre.statut === 'paused' ? 'fas fa-play' : 'fas fa-pause'}`}></i>
                {offre.statut === 'paused' ? 'Réactiver' : 'Mettre en pause'}
              </button>
              <button 
                onClick={() => openDeleteModal(offre.id, offre.titre)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              >
                <i className="fas fa-trash mr-2"></i>Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOffres.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-briefcase text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
          <p className="text-gray-600 mb-4">Aucune offre ne correspond aux critères de recherche.</p>
          <Link 
            to="/recruteur/creer-offre"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
          >
            Créer votre première offre
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.offreName}
        itemType="cette offre"
      />
    </div>
  );
};

export default GestionOffre;