import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const CreeConsultation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    titre: '',
    domaine: '',
    duree: '',
    budget: '',
    localisation: '',
    description: '',
    competences: '',
    dateLimite: '',
    isActive: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.titre.trim()) {
      setError('Le titre de la consultation est requis');
      return false;
    }
    if (!formData.domaine) {
      setError('Le domaine est requis');
      return false;
    }
    if (!formData.duree) {
      setError('La durée est requise');
      return false;
    }
    if (!formData.budget) {
      setError('Le budget est requis');
      return false;
    }
    if (!formData.localisation.trim()) {
      setError('La localisation est requise');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La description est requise');
      return false;
    }
    if (!formData.competences.trim()) {
      setError('Les compétences requises sont requises');
      return false;
    }
    if (!formData.dateLimite) {
      setError('La date limite est requise');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const consultationData = {
        ...formData,
        recruiterId: user.id,
        budget: parseInt(formData.budget),
        applications: 0
      };

      await dataService.createConsultation(consultationData);
      navigate('/recruteur/gestion-consultations');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError('Erreur lors de la création de la consultation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Créer une consultation</h1>
            <p className="text-gray-600">Publiez une mission de consultation pour trouver des experts</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/recruteur/gestion-consultations')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>Retour
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-plus mr-2 text-fuchsia-600"></i>
            Informations de la consultation
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Titre de la consultation */}
            <div className="lg:col-span-2">
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la consultation *
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                required
                value={formData.titre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: Consultant en Stratégie Digitale"
              />
            </div>

            {/* Domaine */}
            <div>
              <label htmlFor="domaine" className="block text-sm font-medium text-gray-700 mb-2">
                Domaine *
              </label>
              <select
                id="domaine"
                name="domaine"
                required
                value={formData.domaine}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="strategie">Stratégie</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="technologie">Technologie</option>
                <option value="rh">Ressources Humaines</option>
                <option value="autres">Autres</option>
              </select>
            </div>

            {/* Durée */}
            <div>
              <label htmlFor="duree" className="block text-sm font-medium text-gray-700 mb-2">
                Durée *
              </label>
              <select
                id="duree"
                name="duree"
                required
                value={formData.duree}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="1-mois">1 mois</option>
                <option value="3-mois">3 mois</option>
                <option value="6-mois">6 mois</option>
                <option value="1-an">1 an</option>
                <option value="ponctuel">Ponctuel</option>
              </select>
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget (FCFA) *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                required
                min="0"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 1000000"
              />
            </div>

            {/* Localisation */}
            <div>
              <label htmlFor="localisation" className="block text-sm font-medium text-gray-700 mb-2">
                Localisation *
              </label>
              <input
                type="text"
                id="localisation"
                name="localisation"
                required
                value={formData.localisation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: Cotonou, Remote, Hybride"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description de la mission *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Décrivez la mission, les objectifs, le contexte..."
              />
            </div>

            {/* Compétences requises */}
            <div className="lg:col-span-2">
              <label htmlFor="competences" className="block text-sm font-medium text-gray-700 mb-2">
                Compétences requises *
              </label>
              <textarea
                id="competences"
                name="competences"
                required
                rows={4}
                value={formData.competences}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Listez les compétences et expériences requises..."
              />
            </div>

            {/* Date limite */}
            <div className="lg:col-span-2">
              <label htmlFor="dateLimite" className="block text-sm font-medium text-gray-700 mb-2">
                Date limite de candidature *
              </label>
              <input
                type="date"
                id="dateLimite"
                name="dateLimite"
                required
                value={formData.dateLimite}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              />
            </div>

            {/* Statut */}
            <div className="lg:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                  Publier immédiatement (rendre visible par les candidats)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/recruteur/gestion-consultations')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {saving ? 'Création...' : 'Créer la consultation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreeConsultation;
