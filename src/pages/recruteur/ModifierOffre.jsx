import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const ModifierOffre = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [offer, setOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Temps plein',
    salary: '',
    experience: '',
    education: '',
    description: '',
    requirements: '',
    benefits: '',
    isActive: true
  });

  useEffect(() => {
    fetchOffer();
  }, [id]);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const offerData = await dataService.getOfferById(id);
      
      // Vérifier que l'offre appartient au recruteur connecté
      if (offerData.recruiterId !== user.id) {
        setError('Vous n\'êtes pas autorisé à modifier cette offre');
        return;
      }
      
      setOffer(offerData);
      setFormData({
        title: offerData.title || '',
        company: offerData.company || '',
        location: offerData.location || '',
        type: offerData.type || 'Temps plein',
        salary: offerData.salary || '',
        experience: offerData.experience || '',
        education: offerData.education || '',
        description: offerData.description || '',
        requirements: Array.isArray(offerData.requirements) ? offerData.requirements.join('\n') : offerData.requirements || '',
        benefits: Array.isArray(offerData.benefits) ? offerData.benefits.join('\n') : offerData.benefits || '',
        isActive: offerData.isActive !== undefined ? offerData.isActive : true
      });
    } catch (error) {
      console.error('Erreur lors du chargement de l\'offre:', error);
      setError('Erreur lors du chargement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updatedOfferData = {
        ...formData,
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        benefits: formData.benefits.split('\n').filter(benefit => benefit.trim())
      };

      await dataService.updateOffer(id, updatedOfferData);
      navigate('/recruteur/gestion-offres');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError('Erreur lors de la mise à jour de l\'offre');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ? Cette action est irréversible.')) {
      try {
        setSaving(true);
        await dataService.deleteOffer(id);
        navigate('/recruteur/gestion-offres');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de l\'offre');
      } finally {
        setSaving(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </div>
    );
  }

  if (error && !offer) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate('/recruteur/gestion-offres')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Retour à la gestion des offres
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Modifier l'offre</h1>
            <p className="text-gray-600">Modifiez les informations de votre offre d'emploi</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50"
            >
              <i className="fas fa-trash mr-2"></i>Supprimer l'offre
            </button>
            <Link
              to="/recruteur/gestion-offres"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 text-center"
            >
              Annuler
            </Link>
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
            <i className="fas fa-edit mr-2 text-fuchsia-600"></i>
            Informations de l'offre
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Titre du poste */}
            <div className="lg:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre du poste *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: Développeur Full Stack Senior"
              />
            </div>

            {/* Entreprise */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Nom de votre entreprise"
              />
            </div>

            {/* Localisation */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Localisation *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: Cotonou, Bénin"
              />
            </div>

            {/* Type de contrat */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type de contrat *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="Temps plein">Temps plein</option>
                <option value="Temps partiel">Temps partiel</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            {/* Salaire */}
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
                Salaire
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 800K - 1.2M FCFA"
              />
            </div>

            {/* Expérience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Expérience requise
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="Débutant">Débutant</option>
                <option value="1-2 ans">1-2 ans</option>
                <option value="3-5 ans">3-5 ans</option>
                <option value="5-7 ans">5-7 ans</option>
                <option value="7+ ans">7+ ans</option>
              </select>
            </div>

            {/* Niveau d'études */}
            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'études
              </label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner</option>
                <option value="Bac">Bac</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
              </select>
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description du poste *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Décrivez les responsabilités et missions du poste..."
              />
            </div>

            {/* Compétences requises */}
            <div className="lg:col-span-2">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Compétences requises (une par ligne)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                rows={4}
                value={formData.requirements}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="React&#10;Node.js&#10;MongoDB&#10;Git"
              />
            </div>

            {/* Avantages */}
            <div className="lg:col-span-2">
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Avantages et bénéfices (un par ligne)
              </label>
              <textarea
                id="benefits"
                name="benefits"
                rows={4}
                value={formData.benefits}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Assurance santé&#10;Formation continue&#10;Télétravail&#10;Équipement fourni"
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
                  Offre active (visible par les candidats)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/recruteur/gestion-offres')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifierOffre; 