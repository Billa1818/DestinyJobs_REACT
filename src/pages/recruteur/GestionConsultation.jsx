import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';

const initialConsultations = [
  {
    id: 1,
    title: 'Audit Marketing Digital',
    type: 'marketing',
    status: 'active',
    mode: 'À distance',
    duration: '2-3 jours',
    description: "Analyse complète de votre stratégie marketing digital avec recommandations personnalisées...",
    demandes: 8,
    enCours: 3,
    prix: '65K',
    vues: 156,
    date: '15 juin 2025',
    maj: 'il y a 2 jours',
  },
  {
    id: 2,
    title: "Formation Gestion d'Équipe",
    type: 'strategie',
    status: 'pending',
    mode: 'Présentiel',
    duration: '1 semaine',
    description: "Formation complète sur les techniques de management et leadership d'équipe...",
    demandes: 2,
    enCours: 0,
    prix: '85K',
    vues: 43,
    date: '20 juin 2025',
    maj: 'En attente de validation',
  },
  {
    id: 3,
    title: 'Conseil Stratégie Financière',
    type: 'finance',
    status: 'paused',
    mode: 'Hybride',
    duration: '3 mois',
    description: "Accompagnement stratégique pour optimiser la gestion financière de votre entreprise...",
    demandes: 1,
    enCours: 0,
    prix: '120K',
    vues: 89,
    date: '10 juin 2025',
    maj: 'Mise en pause il y a 3 jours',
  },
];

const typeLabels = {
  strategie: 'Stratégie',
  marketing: 'Marketing',
  finance: 'Finance',
  rh: 'RH',
  juridique: 'Juridique',
  it: 'IT & Digital',
};

const statusLabels = {
  active: { label: 'Active', color: 'green' },
  pending: { label: 'En attente', color: 'yellow' },
  paused: { label: 'En pause', color: 'gray' },
  draft: { label: 'Brouillon', color: 'gray' },
  expired: { label: 'Expirée', color: 'red' },
};

const GestionConsultation = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState(initialConsultations);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    consultationId: null,
    consultationName: ''
  });

  const filtered = consultations.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !status || c.status === status;
    const matchesType = !type || c.type === type;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openDeleteModal = (id, name) => {
    setDeleteModal({
      isOpen: true,
      consultationId: id,
      consultationName: name
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      consultationId: null,
      consultationName: ''
    });
  };

  const confirmDelete = () => {
    if (deleteModal.consultationId) {
      setConsultations(consultations.filter((c) => c.id !== deleteModal.consultationId));
      closeDeleteModal();
    }
  };

  const handleModifier = (id) => {
    // Redirection vers la page de modification
    console.log('Navigating to edit consultation page with ID:', id);
    navigate(`/recruteur/creer-consultation?edit=${id}`, { replace: true });
  };

  const handleApercu = (id) => {
    // Ouvrir l'aperçu dans un nouvel onglet
    window.open(`/consultations/${id}`, '_blank');
  };

  const handleMettreEnPause = (id) => {
    const consultation = consultations.find(c => c.id === id);
    if (consultation) {
      const newStatus = consultation.status === 'paused' ? 'active' : 'paused';
      setConsultations(prev => prev.map(c => 
        c.id === id ? { ...c, status: newStatus } : c
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
              <i className="fas fa-briefcase mr-2 text-fuchsia-600"></i>
              Mes Consultations
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Gérez vos offres de consultation et suivez leur performance
            </p>
          </div>
          <div className="hidden sm:block">
            <Link 
              to="/recruteur/creer-consultation"
              className="bg-fuchsia-600 text-white px-4 py-2 rounded-lg hover:bg-fuchsia-700 transition duration-200 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvelle consultation
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
                placeholder="Rechercher une consultation..."
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
              <option value="active">Actives</option>
              <option value="pending">En attente</option>
              <option value="paused">En pause</option>
              <option value="draft">Brouillons</option>
              <option value="expired">Expirées</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-600 focus:border-fuchsia-600"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="strategie">Stratégie</option>
              <option value="marketing">Marketing</option>
              <option value="finance">Finance</option>
              <option value="rh">RH</option>
              <option value="juridique">Juridique</option>
              <option value="it">IT & Digital</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div className="space-y-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex flex-col lg:flex-row justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{c.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{typeLabels[c.type] || c.type}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{c.mode}</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">{c.duration}</span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">{c.prix}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      c.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : c.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : c.status === 'paused'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <i className="fas fa-circle text-xs mr-1"></i>
                      {statusLabels[c.status].label}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-fuchsia-600">{c.demandes}</div>
                    <div className="text-xs text-gray-500">Demandes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{c.enCours}</div>
                    <div className="text-xs text-gray-500">En cours</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{c.prix}</div>
                    <div className="text-xs text-gray-500">Prix</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{c.vues}</div>
                    <div className="text-xs text-gray-500">Vues</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span><i className="fas fa-calendar-plus mr-1"></i>Créée le {c.date}</span>
                  <span><i className="fas fa-info-circle mr-1"></i>{c.maj}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-200">
              <Link 
                to={`/recruteur/postulations-consultations/${c.id}`}
                className="flex items-center px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
              >
                <i className="fas fa-users mr-2"></i>Voir demandes ({c.demandes})
              </Link>
              <button 
                onClick={() => handleModifier(c.id)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                <i className="fas fa-edit mr-2"></i>Modifier
              </button>
              <button 
                onClick={() => handleApercu(c.id)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                <i className="fas fa-eye mr-2"></i>Aperçu
              </button>
              <button 
                onClick={() => handleMettreEnPause(c.id)}
                className={`flex items-center px-4 py-2 rounded-md transition duration-200 ${
                  c.status === 'paused' 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                <i className={`mr-2 ${c.status === 'paused' ? 'fas fa-play' : 'fas fa-pause'}`}></i>
                {c.status === 'paused' ? 'Réactiver' : 'Mettre en pause'}
              </button>
              <button 
                onClick={() => openDeleteModal(c.id, c.title)}
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
            <i className="fas fa-briefcase text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation trouvée</h3>
          <p className="text-gray-600 mb-4">Aucune consultation ne correspond aux critères de recherche.</p>
          <Link 
            to="/recruteur/creer-consultation"
            className="px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200"
          >
            Créer votre première consultation
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemName={deleteModal.consultationName}
        itemType="cette consultation"
      />
    </div>
  );
};

export default GestionConsultation;