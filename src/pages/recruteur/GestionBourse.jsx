import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const GestionBourse = () => {
  const { user } = useAuth();
  const [bourses, setBourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBourses, setSelectedBourses] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    niveau: '',
    domaine: ''
  });

  useEffect(() => {
    fetchBourses();
  }, [user]);

  const fetchBourses = async () => {
    try {
      setLoading(true);
      const boursesData = await dataService.getScholarships({ recruiterId: user.id });
      setBourses(boursesData);
    } catch (error) {
      setError('Erreur lors du chargement des bourses');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBourse = async (bourseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bourse ? Cette action est irréversible.')) {
      try {
        await dataService.deleteScholarship(bourseId);
        setBourses(bourses.filter(b => b.id !== bourseId));
      } catch (error) {
        setError('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleStatus = async (bourseId, currentStatus) => {
    try {
      const newStatus = currentStatus ? false : true;
      await dataService.updateScholarship(bourseId, { isActive: newStatus });
      setBourses(bourses.map(b => 
        b.id === bourseId ? { ...b, isActive: newStatus } : b
      ));
    } catch (error) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDuplicateBourse = async (bourseId) => {
    try {
      const originalBourse = bourses.find(b => b.id === bourseId);
      if (!originalBourse) return;

      const duplicatedBourse = {
        ...originalBourse,
        titre: `${originalBourse.titre} (Copie)`,
        isActive: false,
        applications: 0,
        createdAt: new Date().toISOString()
      };

      delete duplicatedBourse.id;
      const newBourse = await dataService.createScholarship(duplicatedBourse);
      setBourses([...bourses, newBourse]);
    } catch (error) {
      setError('Erreur lors de la duplication');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedBourses.length === 0) return;

    try {
      const promises = selectedBourses.map(bourseId => {
        switch (bulkAction) {
          case 'activate':
            return dataService.updateScholarship(bourseId, { isActive: true });
          case 'deactivate':
            return dataService.updateScholarship(bourseId, { isActive: false });
          case 'delete':
            return dataService.deleteScholarship(bourseId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      if (bulkAction === 'delete') {
        setBourses(bourses.filter(b => !selectedBourses.includes(b.id)));
      } else {
        setBourses(bourses.map(b => 
          selectedBourses.includes(b.id) 
            ? { ...b, isActive: bulkAction === 'activate' }
            : b
        ));
      }
      
      setSelectedBourses([]);
      setBulkAction('');
    } catch (error) {
      setError('Erreur lors de l\'action en lot');
    }
  };

  const handleSelectAll = () => {
    if (selectedBourses.length === filteredBourses.length) {
      setSelectedBourses([]);
    } else {
      setSelectedBourses(filteredBourses.map(b => b.id));
    }
  };

  const handleSelectBourse = (bourseId) => {
    setSelectedBourses(prev => 
      prev.includes(bourseId) 
        ? prev.filter(id => id !== bourseId)
        : [...prev, bourseId]
    );
  };

  const filteredBourses = bourses.filter(bourse => {
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && bourse.isActive) ||
      (filters.status === 'inactive' && !bourse.isActive);
    
    const matchesSearch = !filters.search || 
      bourse.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
      bourse.domaine.toLowerCase().includes(filters.search.toLowerCase());

    const matchesNiveau = !filters.niveau || bourse.niveau === filters.niveau;
    const matchesDomaine = !filters.domaine || bourse.domaine === filters.domaine;

    return matchesStatus && matchesSearch && matchesNiveau && matchesDomaine;
  });

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  const getNiveauColor = (niveau) => {
    const colors = {
      'licence': 'bg-blue-100 text-blue-800',
      'master': 'bg-purple-100 text-purple-800',
      'doctorat': 'bg-green-100 text-green-800'
    };
    return colors[niveau] || 'bg-gray-100 text-gray-800';
  };

  const getNiveauText = (niveau) => {
    const niveaux = {
      'licence': 'Licence',
      'master': 'Master',
      'doctorat': 'Doctorat'
    };
    return niveaux[niveau] || niveau;
  };

  const getDomaineColor = (domaine) => {
    const colors = {
      'informatique': 'bg-orange-100 text-orange-800',
      'ingenierie': 'bg-indigo-100 text-indigo-800',
      'medecine': 'bg-red-100 text-red-800',
      'droit': 'bg-yellow-100 text-yellow-800',
      'economie': 'bg-pink-100 text-pink-800',
      'autres': 'bg-gray-100 text-gray-800'
    };
    return colors[domaine] || 'bg-gray-100 text-gray-800';
  };

  const getDomaineText = (domaine) => {
    const domaines = {
      'informatique': 'Informatique',
      'ingenierie': 'Ingénierie',
      'medecine': 'Médecine',
      'droit': 'Droit',
      'economie': 'Économie',
      'autres': 'Autres'
    };
    return domaines[domaine] || domaine;
  };

  const getDureeText = (duree) => {
    return `${duree} an${duree > 1 ? 's' : ''}`;
  };

  const stats = {
    total: bourses.length,
    active: bourses.filter(b => b.isActive).length,
    inactive: bourses.filter(b => !b.isActive).length,
    totalApplications: bourses.reduce((sum, b) => sum + (b.applications || 0), 0)
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Gestion des bourses</h1>
            <p className="text-gray-600">Gérez vos bourses d'études publiées</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link 
              to="/recruteur/creer-bourse"
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer une bourse
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
              <i className="fas fa-graduation-cap text-fuchsia-600"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total bourses</p>
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
              <p className="text-sm text-gray-500">Bourses actives</p>
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
              <p className="text-sm text-gray-500">Bourses inactives</p>
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
              placeholder="Titre ou domaine..."
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
            <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 mb-2">
              Niveau
            </label>
            <select
              id="niveau"
              value={filters.niveau}
              onChange={(e) => setFilters(prev => ({ ...prev, niveau: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les niveaux</option>
              <option value="licence">Licence</option>
              <option value="master">Master</option>
              <option value="doctorat">Doctorat</option>
            </select>
          </div>
          <div>
            <label htmlFor="domaine" className="block text-sm font-medium text-gray-700 mb-2">
              Domaine
            </label>
            <select
              id="domaine"
              value={filters.domaine}
              onChange={(e) => setFilters(prev => ({ ...prev, domaine: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            >
              <option value="">Tous les domaines</option>
              <option value="informatique">Informatique</option>
              <option value="ingenierie">Ingénierie</option>
              <option value="medecine">Médecine</option>
              <option value="droit">Droit</option>
              <option value="economie">Économie</option>
              <option value="autres">Autres</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ status: '', search: '', niveau: '', domaine: '' })}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedBourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedBourses.length} bourse(s) sélectionnée(s)
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
              onClick={() => setSelectedBourses([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Bourses List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="fas fa-graduation-cap mr-2 text-fuchsia-600"></i>
              Bourses ({filteredBourses.length})
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSelectAll}
                className="text-sm text-fuchsia-600 hover:text-fuchsia-800"
              >
                {selectedBourses.length === filteredBourses.length ? 'Désélectionner tout' : 'Sélectionner tout'}
              </button>
            </div>
          </div>
        </div>

        {filteredBourses.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-graduation-cap text-gray-400 text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune bourse trouvée</h3>
            <p className="text-gray-600 mb-4">
              {bourses.length === 0 
                ? "Vous n'avez pas encore créé de bourses."
                : "Aucune bourse ne correspond à vos critères de recherche."
              }
            </p>
            <Link 
              to="/recruteur/creer-bourse"
              className="inline-flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
            >
              <i className="fas fa-plus mr-2"></i>Créer votre première bourse
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBourses.map((bourse) => (
              <div key={bourse.id} className="p-6 hover:bg-gray-50 transition duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <input
                        type="checkbox"
                        checked={selectedBourses.includes(bourse.id)}
                        onChange={() => handleSelectBourse(bourse.id)}
                        className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                      />
                      <h3 className="text-lg font-semibold text-gray-900">{bourse.titre}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bourse.isActive)}`}>
                        {getStatusText(bourse.isActive)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNiveauColor(bourse.niveau)}`}>
                        {getNiveauText(bourse.niveau)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDomaineColor(bourse.domaine)}`}>
                        {getDomaineText(bourse.domaine)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <i className="fas fa-money-bill-wave mr-2 text-fuchsia-600"></i>
                        <span>{bourse.montant?.toLocaleString()} FCFA</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock mr-2 text-fuchsia-600"></i>
                        <span>{getDureeText(bourse.duree)}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2 text-fuchsia-600"></i>
                        <span>{bourse.applications || 0} candidature(s)</span>
                      </div>
                    </div>
                    {bourse.dateLimite && (
                      <div className="text-sm text-gray-600">
                        <i className="fas fa-calendar mr-2 text-fuchsia-600"></i>
                        <span>Limite: {new Date(bourse.dateLimite).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Link
                      to={`/recruteur/postulations-bourses/${bourse.id}`}
                      className="px-3 py-1 text-sm text-fuchsia-600 hover:text-fuchsia-800 border border-fuchsia-300 rounded hover:bg-fuchsia-50 transition duration-200"
                      title="Voir les candidatures"
                    >
                      <i className="fas fa-eye mr-1"></i>Voir
                    </Link>
                    <Link
                      to={`/recruteur/modifier-bourse/${bourse.id}`}
                      className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded hover:bg-blue-50 transition duration-200"
                      title="Modifier la bourse"
                    >
                      <i className="fas fa-edit mr-1"></i>Modifier
                    </Link>
                    <button
                      onClick={() => handleDuplicateBourse(bourse.id)}
                      className="px-3 py-1 text-sm text-green-600 hover:text-green-800 border border-green-300 rounded hover:bg-green-50 transition duration-200"
                      title="Dupliquer la bourse"
                    >
                      <i className="fas fa-copy mr-1"></i>Dupliquer
                    </button>
                    <button
                      onClick={() => handleToggleStatus(bourse.id, bourse.isActive)}
                      className={`px-3 py-1 text-sm border rounded transition duration-200 ${
                        bourse.isActive
                          ? 'text-red-600 border-red-300 hover:bg-red-50'
                          : 'text-green-600 border-green-300 hover:bg-green-50'
                      }`}
                      title={bourse.isActive ? 'Désactiver la bourse' : 'Activer la bourse'}
                    >
                      <i className={`fas ${bourse.isActive ? 'fa-pause' : 'fa-play'} mr-1`}></i>
                      {bourse.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDeleteBourse(bourse.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50 transition duration-200"
                      title="Supprimer la bourse"
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

export default GestionBourse;