import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const PostulerOffre = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: 'immediate',
    additionalInfo: ''
  });

  useEffect(() => {
    fetchOfferAndCheckApplication();
  }, [id, user]);

  const fetchOfferAndCheckApplication = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'offre
      const offerData = await dataService.getOfferById(id);
      setOffer(offerData);

      // Vérifier si l'utilisateur a déjà postulé
      if (user) {
        const existingApplication = await dataService.checkUserApplication(user.id, id, 'offer');
        setAlreadyApplied(existingApplication);
      }
    } catch (error) {
      setError('Erreur lors du chargement de l\'offre');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.coverLetter.trim()) {
      setError('La lettre de motivation est requise');
      return false;
    }
    if (!formData.expectedSalary.trim()) {
      setError('Le salaire attendu est requis');
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
      const applicationData = {
        offerId: id,
        candidateId: user.id,
        candidateName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        coverLetter: formData.coverLetter,
        expectedSalary: formData.expectedSalary,
        availability: formData.availability,
        additionalInfo: formData.additionalInfo,
        status: 'en_attente',
        appliedAt: new Date().toISOString(),
        type: 'offer'
      };

      await dataService.createApplication(applicationData);
      
      // Rediriger vers la page de confirmation
      navigate(`/candidat/confirmation-candidature/${id}`);
    } catch (error) {
      console.error('Erreur lors de la candidature:', error);
      setError('Erreur lors de l\'envoi de la candidature');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Offre non trouvée</h2>
        <p className="text-gray-600 mb-4">L'offre que vous recherchez n'existe pas.</p>
        <Link 
          to="/candidat/offres"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Retour aux offres
        </Link>
      </div>
    );
  }

  if (alreadyApplied) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-green-600 text-2xl"></i>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidature déjà envoyée</h2>
        <p className="text-gray-600 mb-4">Vous avez déjà postulé à cette offre.</p>
        <Link 
          to="/candidat/mes-candidatures"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Voir mes candidatures
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Postuler à l'offre</h1>
            <p className="text-gray-600">{offer.title} - {offer.company}</p>
          </div>
          <Link 
            to={`/candidat/offres/${id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i>Retour
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Offer Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de l'offre</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500">Titre du poste</span>
            <p className="text-gray-900 font-medium">{offer.title}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Entreprise</span>
            <p className="text-gray-900">{offer.company}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Localisation</span>
            <p className="text-gray-900">{offer.location}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Type de contrat</span>
            <p className="text-gray-900">{offer.type}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Salaire</span>
            <p className="text-gray-900">{offer.salary || 'Non spécifié'}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Expérience</span>
            <p className="text-gray-900">{offer.experience || 'Non spécifiée'}</p>
          </div>
        </div>
        
        {offer.description && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-500">Description</span>
            <p className="text-gray-900 mt-1">{offer.description}</p>
          </div>
        )}
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-edit mr-2 text-fuchsia-600"></i>
            Formulaire de candidature
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Lettre de motivation */}
            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                Lettre de motivation *
              </label>
              <textarea
                id="coverLetter"
                name="coverLetter"
                required
                rows={8}
                value={formData.coverLetter}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Présentez-vous, expliquez votre motivation pour ce poste, vos compétences pertinentes..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Décrivez votre motivation, vos compétences et pourquoi vous êtes le candidat idéal pour ce poste.
              </p>
            </div>

            {/* Salaire attendu */}
            <div>
              <label htmlFor="expectedSalary" className="block text-sm font-medium text-gray-700 mb-2">
                Salaire attendu (FCFA) *
              </label>
              <input
                type="number"
                id="expectedSalary"
                name="expectedSalary"
                required
                min="0"
                value={formData.expectedSalary}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 800000"
              />
            </div>

            {/* Disponibilité */}
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                Disponibilité *
              </label>
              <select
                id="availability"
                name="availability"
                required
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="immediate">Immédiate</option>
                <option value="1_semaine">1 semaine</option>
                <option value="2_semaines">2 semaines</option>
                <option value="1_mois">1 mois</option>
                <option value="2_mois">2 mois</option>
                <option value="3_mois">3 mois</option>
              </select>
            </div>

            {/* Informations supplémentaires */}
            <div>
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Informations supplémentaires
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows={4}
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Informations complémentaires, questions, remarques..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Informations supplémentaires que vous souhaitez partager avec le recruteur.
              </p>
            </div>

            {/* Informations du candidat */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Informations du candidat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Nom complet :</span>
                  <p className="text-gray-900">{user.firstName} {user.lastName}</p>
                </div>
                <div>
                  <span className="text-gray-500">Email :</span>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                {user.profile?.phone && (
                  <div>
                    <span className="text-gray-500">Téléphone :</span>
                    <p className="text-gray-900">{user.profile.phone}</p>
                  </div>
                )}
                {user.profile?.location && (
                  <div>
                    <span className="text-gray-500">Localisation :</span>
                    <p className="text-gray-900">{user.profile.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/candidat/offres/${id}`)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {saving ? 'Envoi...' : 'Envoyer ma candidature'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostulerOffre; 