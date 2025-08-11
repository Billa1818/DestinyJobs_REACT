import React, { useState } from 'react';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const initialScholarships = [
  {
    id: 1,
    name: 'Bourse Excellence IT 2024',
    domain: 'informatique',
    status: 'active',
    candidatures: 24,
    montant: '1,500,000 FCFA',
    deadline: '30 Déc 2024',
    deadlineLabel: 'Dans 5 jours',
    subtitle: 'Informatique & Technologies',
  },
  {
    id: 2,
    name: 'Bourse Médicale Avancée',
    domain: 'medecine',
    status: 'pending',
    candidatures: 0,
    montant: '2,000,000 FCFA',
    deadline: '15 Jan 2025',
    deadlineLabel: 'Dans 21 jours',
    subtitle: 'Médecine & Santé',
  },
  {
    id: 3,
    name: 'Bourse Ingénierie Mécanique',
    domain: 'ingenierie',
    status: 'active',
    candidatures: 18,
    montant: '1,200,000 FCFA',
    deadline: '20 Jan 2025',
    deadlineLabel: 'Dans 26 jours',
    subtitle: 'Ingénierie',
  },
  {
    id: 4,
    name: 'Bourse Commerce International',
    domain: 'commerce',
    status: 'closed',
    candidatures: 45,
    montant: '800,000 FCFA',
    deadline: '15 Déc 2024',
    deadlineLabel: 'Expirée',
    subtitle: 'Commerce & Gestion',
  },
];

const statusLabels = {
  active: { label: 'Active', color: 'green', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-400' },
  pending: { label: 'En validation', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400' },
  closed: { label: 'Fermée', color: 'red', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-400' },
  draft: { label: 'Brouillon', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-400' },
};

const domainLabels = {
  informatique: 'Informatique',
  medecine: 'Médecine',
  ingenierie: 'Ingénierie',
  commerce: 'Commerce',
};

const GestionBourse = () => {
  const [scholarships, setScholarships] = useState(initialScholarships);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [domain, setDomain] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    scholarshipId: null,
    scholarshipName: ''
  });

  const filtered = scholarships.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.subtitle && s.subtitle.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !status || s.status === status;
    const matchesDomain = !domain || s.domain === domain;
    return matchesSearch && matchesStatus && matchesDomain;
  });

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      scholarshipId: id,
      scholarshipName: name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      scholarshipId: null,
      scholarshipName: ''
    });
  };

  const confirmDelete = () => {
    if (deleteModal.scholarshipId) {
      setScholarships(scholarships.filter((s) => s.id !== deleteModal.scholarshipId));
      closeDeleteModal();
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-2 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-graduation-cap mr-2 text-destiny-gold"></i>
              Gestion des bourses
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez vos offres de bourses : modifier, supprimer, consulter les candidatures
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-destiny-gold bg-opacity-10 p-3 rounded-lg">
              <i className="fas fa-cogs text-2xl text-destiny-gold"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check text-green-600 text-sm"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Actives</p>
              <p className="text-xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-yellow-600 text-sm"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-blue-600 text-sm"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Candidatures</p>
              <p className="text-xl font-semibold text-gray-900">247</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-ban text-red-600 text-sm"></i>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Fermées</p>
              <p className="text-xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Rechercher une bourse..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold w-full sm:w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Active</option>
              <option value="pending">En attente</option>
              <option value="closed">Fermée</option>
              <option value="draft">Brouillon</option>
            </select>
            <select
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-destiny-gold focus:border-destiny-gold"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="">Tous les domaines</option>
              <option value="informatique">Informatique</option>
              <option value="medecine">Médecine</option>
              <option value="ingenierie">Ingénierie</option>
              <option value="commerce">Commerce</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-destiny-gold text-white rounded-md hover:bg-yellow-600 transition duration-200 flex items-center whitespace-nowrap">
            <i className="fas fa-plus mr-2"></i>
            Nouvelle bourse
          </button>
        </div>
      </div>

      {/* Scholarships Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Mes bourses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bourse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidatures</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center`}>
                          <i className="fas fa-laptop-code text-blue-600"></i>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{s.name}</div>
                        <div className="text-sm text-gray-500">{s.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusLabels[s.status]?.bg || ''} ${statusLabels[s.status]?.text || ''}`}>
                      <div className={`w-1.5 h-1.5 ${statusLabels[s.status]?.dot || ''} rounded-full mr-1.5`}></div>
                      {statusLabels[s.status]?.label || s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">{s.candidatures}</div>
                    <div className="text-sm text-gray-500">candidatures</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{s.montant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{s.deadline}</div>
                    <div className={`text-sm ${s.status === 'closed' ? 'text-red-500' : 'text-green-500'}`}>{s.deadlineLabel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="Voir les candidatures">
                        <i className="fas fa-users"></i>
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900" title="Modifier">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900" title="Suspendre">
                        <i className="fas fa-pause"></i>
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                        onClick={() => openDeleteModal(s.id, s.name)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Précédent
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Affichage <span className="font-medium">1</span> à <span className="font-medium">{filtered.length}</span> de
                <span className="font-medium">{scholarships.length}</span> bourses
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="bg-destiny-gold border-destiny-gold text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  1
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  2
                </button>
                <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.scholarshipName}
        itemType="cette bourse"
      />
    </main>
  );
};

export default GestionBourse;