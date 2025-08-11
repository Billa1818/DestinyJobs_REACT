import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const initialFundings = [
  {
    id: 1,
    title: 'Microcrédit Femmes Entrepreneures',
    type: 'microcredit',
    status: 'active',
    tags: ['Microcrédit', 'Femmes', '500K - 5M FCFA', '6% taux'],
    description: "Financement spécialement conçu pour soutenir les femmes entrepreneurs dans leurs projets...",
    candidatures: 47,
    enCours: 12,
    approuves: 8,
    vues: 235,
    date: '10 juin 2025',
    deadline: '30 juillet 2025',
  },
  {
    id: 2,
    title: 'Subvention Startup Tech',
    type: 'subvention',
    status: 'pending',
    tags: ['Subvention', 'Tech', '2M - 15M FCFA', '0% remboursement'],
    description: "Programme de soutien financier pour les startups technologiques innovantes...",
    candidatures: 23,
    enCours: 0,
    approuves: 0,
    vues: 89,
    date: '18 juin 2025',
    deadline: 'En attente de validation',
  },
  {
    id: 3,
    title: 'Prêt Agricole Saison Sèche',
    type: 'pret_bancaire',
    status: 'paused',
    tags: ['Prêt bancaire', 'Agriculture', '1M - 10M FCFA', '8.5% taux'],
    description: "Financement spécialisé pour les activités agricoles pendant la saison sèche...",
    candidatures: 15,
    enCours: 3,
    approuves: 5,
    vues: 156,
    date: '5 juin 2025',
    deadline: 'Mise en pause il y a 2 jours',
  },
  {
    id: 4,
    title: 'Capital Risque Amorçage',
    type: 'capital_risque',
    status: 'active',
    tags: ['Capital risque', 'Innovation', '10M - 100M FCFA', 'Equity 15-25%'],
    description: "Investissement en capital pour startups innovantes en phase d'amorçage...",
    candidatures: 31,
    enCours: 8,
    approuves: 2,
    vues: 412,
    date: '25 mai 2025',
    deadline: '31 août 2025',
  },
];

const typeLabels = {
  microcredit: 'Microcrédit',
  pret_bancaire: 'Prêt bancaire',
  subvention: 'Subvention',
  capital_risque: 'Capital risque',
  crowdfunding: 'Crowdfunding',
  bourse: 'Bourse',
};

const statusLabels = {
  active: { label: 'Actif', color: 'green' },
  pending: { label: 'En attente', color: 'yellow' },
  paused: { label: 'En pause', color: 'gray' },
  draft: { label: 'Brouillon', color: 'gray' },
  expired: { label: 'Expiré', color: 'red' },
};

const GestionFinancement = () => {
  const navigate = useNavigate();
  const [fundings, setFundings] = useState(initialFundings);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    fundingId: null,
    fundingName: ''
  });

  const filtered = fundings.filter((f) => {
    const matchesSearch =
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || f.status === status;
    const matchesType = !type || f.type === type;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      fundingId: id,
      fundingName: name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      fundingId: null,
      fundingName: ''
    });
  };

  const confirmDelete = () => {
    if (deleteModal.fundingId) {
      setFundings(fundings.filter((f) => f.id !== deleteModal.fundingId));
      closeDeleteModal();
    }
  };

  const handleModifier = (id) => {
    // Redirection vers la page de modification
    console.log('Navigating to edit funding page with ID:', id);
    navigate(`/recruteur/creer-financement?edit=${id}`, { replace: true });
  };

  const handleApercu = (id) => {
    // Ouvrir l'aperçu dans un nouvel onglet
    window.open(`/financements/${id}`, '_blank');
  };

  const handleMettreEnPause = (id) => {
    const funding = fundings.find(f => f.id === id);
    if (funding) {
      const newStatus = funding.status === 'paused' ? 'active' : 'paused';
      setFundings(prev => prev.map(f => 
        f.id === id ? { ...f, status: newStatus } : f
      ));
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              <i className="fas fa-hand-holding-usd mr-2 text-fuchsia-600"></i>
              Mes Financements
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez vos offres de financement et suivez les candidatures
            </p>
          </div>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/creer-financement"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouveau financement
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
                placeholder="Rechercher un financement..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="pending">En attente</option>
              <option value="paused">En pause</option>
              <option value="draft">Brouillons</option>
              <option value="expired">Expirés</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="microcredit">Microcrédit</option>
              <option value="pret_bancaire">Prêt bancaire</option>
              <option value="subvention">Subvention</option>
              <option value="capital_risque">Capital risque</option>
              <option value="crowdfunding">Crowdfunding</option>
              <option value="bourse">Bourse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Funding List */}
      <div className="space-y-4">
        {filtered.map((f) => (
          <div key={f.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{f.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {typeLabels[f.type]}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                        {f.tags[0]}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {f.tags[1]}
                      </span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                        {f.tags[2]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{f.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      f.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : f.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : f.status === 'paused'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <i className="fas fa-circle text-xs mr-1"></i>
                      {statusLabels[f.status].label}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fuchsia-600">{f.candidatures}</div>
                    <div className="text-xs text-gray-500">Candidatures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{f.enCours}</div>
                    <div className="text-xs text-gray-500">En cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{f.approuves}</div>
                    <div className="text-xs text-gray-500">Approuvés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{f.vues}</div>
                    <div className="text-xs text-gray-500">Vues</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span><i className="fas fa-calendar-plus mr-1"></i>Créé le {f.date}</span>
                  <span><i className="fas fa-calendar-times mr-1"></i>Expire le {f.deadline}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
              <Link 
                to={`/recruteur/postulations-financements/${f.id}`}
                className="flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-users mr-2"></i>Voir candidatures ({f.candidatures})
              </Link>
              <button 
                onClick={() => handleModifier(f.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <i className="fas fa-edit mr-2"></i>Modifier
              </button>
              <button 
                onClick={() => handleApercu(f.id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                <i className="fas fa-eye mr-2"></i>Aperçu
              </button>
              <button 
                onClick={() => handleMettreEnPause(f.id)}
                className={`flex items-center px-4 py-2 rounded-md transition duration-200 ${
                  f.status === 'paused' 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                <i className={`mr-2 ${f.status === 'paused' ? 'fas fa-play' : 'fas fa-pause'}`}></i>
                {f.status === 'paused' ? 'Réactiver' : 'Mettre en pause'}
              </button>
              <button 
                onClick={() => openDeleteModal(f.id, f.title)}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
              >
                <i className="fas fa-trash mr-2"></i>Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-money-bill-wave text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun financement trouvé</h3>
          <p className="text-gray-600 mb-4">Aucun financement ne correspond aux critères de recherche.</p>
          <Link 
            to="/recruteur/creer-financement"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
          >
            Créer votre premier financement
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.fundingName}
        itemType="ce financement"
      />
    </div>
  );
};

export default GestionFinancement;