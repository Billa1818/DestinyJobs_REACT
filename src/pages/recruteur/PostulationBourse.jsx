import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PostulationBourse = () => {
  const [filters, setFilters] = useState({
    bourse: '',
    statut: '',
    date: '',
    search: ''
  });

  const [postulations, setPostulations] = useState([
    {
      id: 1,
      candidat: 'Amina Kone',
      email: 'amina.kone@email.com',
      bourse: 'Bourse d\'excellence IT',
      statut: 'en-attente',
      datePostulation: '2024-01-15',
      montant: '500,000 FCFA',
      niveau: 'Master',
      specialite: 'Informatique',
      telephone: '+229 97 12 34 56',
      avatar: 'AK',
      documents: ['CV', 'Lettre de motivation', 'Relevés de notes'],
      notes: 'Candidat très prometteur avec un excellent dossier académique'
    },
    {
      id: 2,
      candidat: 'Marc Dossou',
      email: 'marc.dossou@email.com',
      bourse: 'Bourse entrepreneuriat',
      statut: 'accepte',
      datePostulation: '2024-01-14',
      montant: '750,000 FCFA',
      niveau: 'Licence',
      specialite: 'Gestion',
      telephone: '+229 96 87 65 43',
      avatar: 'MD',
      documents: ['CV', 'Business Plan', 'Recommandations'],
      notes: 'Projet entrepreneurial innovant avec un potentiel commercial élevé'
    },
    {
      id: 3,
      candidat: 'Fatou Diallo',
      email: 'fatou.diallo@email.com',
      bourse: 'Bourse recherche scientifique',
      statut: 'refuse',
      datePostulation: '2024-01-10',
      montant: '1,000,000 FCFA',
      niveau: 'Doctorat',
      specialite: 'Biologie',
      telephone: '+229 95 43 21 09',
      avatar: 'FD',
      documents: ['CV', 'Projet de recherche', 'Publications'],
      notes: 'Dossier incomplet, manque de publications récentes'
    },
    {
      id: 4,
      candidat: 'Kofi Mensah',
      email: 'kofi.mensah@email.com',
      bourse: 'Bourse d\'excellence IT',
      statut: 'en-attente',
      datePostulation: '2024-01-12',
      montant: '500,000 FCFA',
      niveau: 'Master',
      specialite: 'Intelligence Artificielle',
      telephone: '+229 94 56 78 90',
      avatar: 'KM',
      documents: ['CV', 'Lettre de motivation', 'Relevés de notes'],
      notes: 'Profil intéressant en IA, à approfondir'
    }
  ]);

  const [filteredPostulations, setFilteredPostulations] = useState(postulations);
  const [selectedPostulation, setSelectedPostulation] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    let filtered = postulations;

    if (filters.bourse) {
      filtered = filtered.filter(p => p.bourse.includes(filters.bourse));
    }
    if (filters.statut) {
      filtered = filtered.filter(p => p.statut === filters.statut);
    }
    if (filters.search) {
      filtered = filtered.filter(p => 
        p.candidat.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.specialite.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredPostulations(filtered);
  };

  const resetFilters = () => {
    setFilters({
      bourse: '',
      statut: '',
      date: '',
      search: ''
    });
    setFilteredPostulations(postulations);
  };

  const updateStatus = (id, newStatus) => {
    setPostulations(prev => 
      prev.map(p => p.id === id ? { ...p, statut: newStatus } : p)
    );
    setFilteredPostulations(prev => 
      prev.map(p => p.id === id ? { ...p, statut: newStatus } : p)
    );
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'accepte': return 'text-green-600 bg-green-100';
      case 'refuse': return 'text-red-600 bg-red-100';
      case 'en-attente': return 'text-yellow-600 bg-yellow-100';
      case 'en-cours': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'accepte': return 'Accepté';
      case 'refuse': return 'Refusé';
      case 'en-attente': return 'En attente';
      case 'en-cours': return 'En cours';
      default: return 'Inconnu';
    }
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Postulations Bourses</h1>
          <p className="text-gray-600">Gérez les candidatures aux bourses d'études</p>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Nom, email, spécialité..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bourse</label>
              <select
                name="bourse"
                value={filters.bourse}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Toutes les bourses</option>
                <option value="Bourse d'excellence IT">Bourse d'excellence IT</option>
                <option value="Bourse entrepreneuriat">Bourse entrepreneuriat</option>
                <option value="Bourse recherche scientifique">Bourse recherche scientifique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="statut"
                value={filters.statut}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="en-attente">En attente</option>
                <option value="accepte">Accepté</option>
                <option value="refuse">Refusé</option>
                <option value="en-cours">En cours</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <i className="fas fa-file-alt text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{postulations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <i className="fas fa-clock text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {postulations.filter(p => p.statut === 'en-attente').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Acceptées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {postulations.filter(p => p.statut === 'accepte').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <i className="fas fa-times text-red-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refusées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {postulations.filter(p => p.statut === 'refuse').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des postulations */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Liste des postulations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bourse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPostulations.map((postulation) => (
                  <tr key={postulation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-fuchsia-600 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">{postulation.avatar}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{postulation.candidat}</div>
                          <div className="text-sm text-gray-500">{postulation.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{postulation.bourse}</div>
                      <div className="text-sm text-gray-500">{postulation.specialite} - {postulation.niveau}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {postulation.montant}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(postulation.statut)}`}>
                        {getStatusText(postulation.statut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(postulation.datePostulation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPostulation(postulation)}
                          className="text-fuchsia-600 hover:text-fuchsia-900"
                        >
                          Voir détails
                        </button>
                        {postulation.statut === 'en-attente' && (
                          <>
                            <button
                              onClick={() => updateStatus(postulation.id, 'accepte')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Accepter
                            </button>
                            <button
                              onClick={() => updateStatus(postulation.id, 'refuse')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de détails */}
        {selectedPostulation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Détails de la postulation</h3>
                  <button
                    onClick={() => setSelectedPostulation(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xl"></i>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-fuchsia-600 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">{selectedPostulation.avatar}</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">{selectedPostulation.candidat}</h4>
                      <p className="text-gray-500">{selectedPostulation.email}</p>
                      <p className="text-gray-500">{selectedPostulation.telephone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bourse</label>
                      <p className="text-gray-900">{selectedPostulation.bourse}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Montant</label>
                      <p className="text-gray-900">{selectedPostulation.montant}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Niveau</label>
                      <p className="text-gray-900">{selectedPostulation.niveau}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Spécialité</label>
                      <p className="text-gray-900">{selectedPostulation.specialite}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Statut</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPostulation.statut)}`}>
                        {getStatusText(selectedPostulation.statut)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date de postulation</label>
                      <p className="text-gray-900">{new Date(selectedPostulation.datePostulation).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documents fournis</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPostulation.documents.map((doc, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          <i className="fas fa-file-alt mr-2"></i>
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{selectedPostulation.notes}</p>
                  </div>

                  {selectedPostulation.statut === 'en-attente' && (
                    <div className="flex space-x-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          updateStatus(selectedPostulation.id, 'accepte');
                          setSelectedPostulation(null);
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                      >
                        <i className="fas fa-check mr-2"></i>
                        Accepter
                      </button>
                      <button
                        onClick={() => {
                          updateStatus(selectedPostulation.id, 'refuse');
                          setSelectedPostulation(null);
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                      >
                        <i className="fas fa-times mr-2"></i>
                        Refuser
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostulationBourse;
