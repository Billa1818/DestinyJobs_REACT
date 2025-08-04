import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const GestionOffre = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    type: '',
    experience: ''
  });

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const offersData = await dataService.getOffers({ recruiterId: user.id });
      setOffers(offersData);
    } catch (error) {
      setError('Erreur lors du chargement des offres');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) {
      try {
        await dataService.deleteOffer(offerId);
        setOffers(offers.filter(offer => offer.id !== offerId));
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleStatus = async (offerId, currentStatus) => {
    try {
      const newStatus = currentStatus ? false : true;
      await dataService.updateOffer(offerId, { isActive: newStatus });
      setOffers(offers.map(offer => 
        offer.id === offerId ? { ...offer, isActive: newStatus } : offer
      ));
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDuplicateOffer = async (offerId) => {
    try {
      const originalOffer = offers.find(offer => offer.id === offerId);
      if (!originalOffer) return;

      const duplicatedOffer = {
        ...originalOffer,
        title: `${originalOffer.title} (Copie)`,
        isActive: false,
        applications: 0,
        createdAt: new Date().toISOString()
      };

      delete duplicatedOffer.id; // Supprimer l'ID pour créer une nouvelle offre
      const newOffer = await dataService.createOffer(duplicatedOffer);
      setOffers([...offers, newOffer]);
    } catch (error) {
      setError('Erreur lors de la duplication');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOffers.length === 0) return;

    try {
      const promises = selectedOffers.map(offerId => {
        switch (bulkAction) {
          case 'activate':
            return dataService.updateOffer(offerId, { isActive: true });
          case 'deactivate':
            return dataService.updateOffer(offerId, { isActive: false });
          case 'delete':
            return dataService.deleteOffer(offerId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      if (bulkAction === 'delete') {
        setOffers(offers.filter(offer => !selectedOffers.includes(offer.id)));
      } else {
        setOffers(offers.map(offer => 
          selectedOffers.includes(offer.id) 
            ? { ...offer, isActive: bulkAction === 'activate' }
            : offer
        ));
      }
      
      setSelectedOffers([]);
      setBulkAction('');
    } catch (error) {
      setError('Erreur lors de l\'action en lot');
    }
  };

  const handleSelectAll = () => {
    if (selectedOffers.length === filteredOffers.length) {
      setSelectedOffers([]);
    } else {
      setSelectedOffers(filteredOffers.map(offer => offer.id));
    }
  };

  const handleSelectOffer = (offerId) => {
    setSelectedOffers(prev => 
      prev.includes(offerId) 
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };

  const filteredOffers = offers.filter(offer => {
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && offer.isActive) ||
      (filters.status === 'inactive' && !offer.isActive);
    
    const matchesSearch = !filters.search || 
      offer.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      offer.company.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType = !filters.type || offer.type === filters.type;
    const matchesExperience = !filters.experience || offer.experience === filters.experience;

    return matchesStatus && matchesSearch && matchesType && matchesExperience;
  });

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Temps plein': 'bg-blue-100 text-blue-800',
      'Temps partiel': 'bg-yellow-100 text-yellow-800',
      'CDD': 'bg-orange-100 text-orange-800',
      'Stage': 'bg-purple-100 text-purple-800',
      'Freelance': 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: offers.length,
    active: offers.filter(o => o.isActive).length,
    inactive: offers.filter(o => !o.isActive).length,
    totalApplications: offers.reduce((sum, o) => sum + (o.applications || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des offres</h1>
            <p className="text-gray-600">Gérez vos offres d'emploi publiées</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/recruteur/creer-offre"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer une offre
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-fuchsia-100 rounded-lg">
              <i className="fas fa-briefcase text-fuchsia-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total offres</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <i className="fas fa-check-circle text-green-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Offres actives</p>
              <p className="text-lg font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <i className="fas fa-pause-circle text-red-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Offres inactives</p>
              <p className="text-lg font-semibold text-gray-900">{stats.inactive}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <i className="fas fa-users text-blue-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Candidatures</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalApplications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              placeholder="Titre ou entreprise..."
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Statut
            </label>
            <select
              id="status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actives</option>
              <option value="inactive">Inactives</option>
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="Temps plein">Temps plein</option>
              <option value="Temps partiel">Temps partiel</option>
              <option value="CDD">CDD</option>
              <option value="Stage">Stage</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
              Expérience
            </label>
            <select
              id="experience"
              value={filters.experience}
              onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Toutes</option>
              <option value="Débutant">Débutant</option>
              <option value="1-2 ans">1-2 ans</option>
              <option value="3-5 ans">3-5 ans</option>
              <option value="5-7 ans">5-7 ans</option>
              <option value="7+ ans">7+ ans</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', search: '', type: '', experience: '' })}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOffers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedOffers.length} offre(s) sélectionnée(s)
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-blue-300 rounded text-sm"
              >
                <option value="">Actions en lot</option>
                <option value="activate">Activer</option>
                <option value="deactivate">Désactiver</option>
                <option value="delete">Supprimer</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Appliquer
              </button>
            </div>
            <button
              onClick={() => setSelectedOffers([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Offers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
              Offres ({filteredOffers.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                {selectedOffers.length === filteredOffers.length ? 'Désélectionner tout' : 'Sélectionner tout'}
              </button>
            </div>
          </div>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-briefcase text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune offre trouvée</h3>
            <p className="text-gray-600 mb-4">
              {offers.length === 0 
                ? "Vous n'avez pas encore créé d'offres d'emploi."
                : "Aucune offre ne correspond à vos critères de recherche."
              }
            </p>
            <Link 
              to="/recruteur/creer-offre"
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer votre première offre
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="p-6 hover:bg-gray-50 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedOffers.includes(offer.id)}
                        onChange={() => handleSelectOffer(offer.id)}
                        className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{offer.title}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(offer.isActive)}`}>
                        {getStatusText(offer.isActive)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(offer.type)}`}>
                        {offer.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <i className="fas fa-building mr-2 text-fuchsia-600"></i>
                        <span>{offer.company}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
                        <span>{offer.location}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2 text-fuchsia-600"></i>
                        <span>{offer.applications || 0} candidature(s)</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
                        <span>{offer.type}</span>
                      </div>
                      {offer.salary && (
                        <div className="flex items-center">
                          <i className="fas fa-money-bill-wave mr-2 text-fuchsia-600"></i>
                          <span>{offer.salary}</span>
                        </div>
                      )}
                      {offer.experience && (
                        <div className="flex items-center">
                          <i className="fas fa-chart-line mr-2 text-fuchsia-600"></i>
                          <span>{offer.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/recruteur/postulations-offres/${offer.id}`}
                      className="px-3 py-1 text-sm text-fuchsia-600 hover:text-fuchsia-800 border border-fuchsia-300 rounded hover:bg-fuchsia-50 transition duration-200"
                      title="Voir les candidatures"
                    >
                      <i className="fas fa-eye mr-1"></i>Voir
                    </Link>
                    <Link
                      to={`/recruteur/modifier-offre/${offer.id}`}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition duration-200"
                      title="Modifier l'offre"
                    >
                      <i className="fas fa-edit mr-1"></i>Modifier
                    </Link>
                    <button
                      onClick={() => handleDuplicateOffer(offer.id)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition duration-200"
                      title="Dupliquer l'offre"
                    >
                      <i className="fas fa-copy mr-1"></i>Dupliquer
                    </button>
                    <button
                      onClick={() => handleToggleStatus(offer.id, offer.isActive)}
                      className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                        offer.isActive
                          ? 'text-red-600 border-red-300 hover:bg-red-50'
                          : 'text-green-600 border-green-300 hover:bg-green-50'
                      }`}
                      title={offer.isActive ? 'Désactiver l\'offre' : 'Activer l\'offre'}
                    >
                      <i className={`fas ${offer.isActive ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                      {offer.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition duration-200"
                      title="Supprimer l'offre"
                    >
                      <i className="fas fa-trash mr-1"></i>Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionOffre;