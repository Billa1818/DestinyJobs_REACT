import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';

const PostulerConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    proposedBudget: '',
    timeline: '',
    methodology: '',
    experience: '',
    additionalInfo: ''
  });

  useEffect(() => {
    if (user && user.role !== 'prestataire') {
      setError('Accès non autorisé. Seuls les prestataires peuvent postuler aux consultations.');
      return;
    }
    fetchConsultationAndCheckApplication();
  }, [id, user]);

  const fetchConsultationAndCheckApplication = async () => {
    try {
      setLoading(true);
      
      // Récupérer la consultation
      const consultationData = await dataService.getConsultationById(id);
      setConsultation(consultationData);

      // Vérifier si l'utilisateur a déjà postulé
      if (user) {
        const existingApplication = await dataService.checkUserApplication(user.id, id, 'consultation');
        setAlreadyApplied(existingApplication);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la consultation:', error);
      // Au lieu d'afficher une erreur, on continue pour permettre la création
      setError('Erreur lors du chargement de la consultation. Vous pouvez quand même postuler.');
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
    if (!formData.proposedBudget.trim()) {
      setError('Le budget proposé est requis');
      return false;
    }
    if (!formData.timeline.trim()) {
      setError('Le délai proposé est requis');
      return false;
    }
    if (!formData.methodology.trim()) {
      setError('La méthodologie est requise');
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
        consultationId: parseInt(id),
        userId: user.id,
        proposal: formData.coverLetter,
        proposedBudget: formData.proposedBudget,
        timeline: formData.timeline,
        methodology: formData.methodology,
        experience: formData.experience,
        additionalInfo: formData.additionalInfo,
        status: 'en_attente',
        appliedAt: new Date().toISOString()
      };

      await dataService.submitConsultationApplication(applicationData);
      
      // Rediriger vers la page des demandes
      navigate('/prestataire/demandes');
    } catch (error) {
      console.error('Erreur lors de la candidature:', error);
      let errorMessage = 'Erreur lors de l\'envoi de la candidature';
      
      if (error.message.includes('400')) {
        errorMessage = 'Données invalides. Vérifiez vos informations.';
      } else if (error.message.includes('409')) {
        errorMessage = 'Vous avez déjà postulé à cette consultation.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
      } else {
        errorMessage = `Erreur: ${error.message}`;
      }
      
      setError(errorMessage);
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

  // Si la consultation n'est pas trouvée, on affiche quand même le formulaire
  // avec les informations disponibles
  if (!consultation) {
    return (
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Postuler à la consultation</h1>
              <p className="text-gray-600">Consultation #{id}</p>
            </div>
            <Link 
              to="/prestataire/consultations"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <i className="fas fa-arrow-left mr-2"></i>Retour
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <i className="fas fa-edit mr-2 text-fuchsia-600"></i>
              Proposition de service
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
                  placeholder="Présentez-vous, expliquez votre approche pour cette mission, vos compétences pertinentes..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Décrivez votre motivation, votre approche et pourquoi vous êtes le prestataire idéal pour cette mission.
                </p>
              </div>

              {/* Budget proposé */}
              <div>
                <label htmlFor="proposedBudget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget proposé (FCFA) *
                </label>
                <input
                  type="number"
                  id="proposedBudget"
                  name="proposedBudget"
                  required
                  min="0"
                  value={formData.proposedBudget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  placeholder="Ex: 800000"
                />
              </div>

              {/* Délai proposé */}
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  Délai proposé *
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  required
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un délai</option>
                  <option value="1_semaine">1 semaine</option>
                  <option value="2_semaines">2 semaines</option>
                  <option value="1_mois">1 mois</option>
                  <option value="2_mois">2 mois</option>
                  <option value="3_mois">3 mois</option>
                  <option value="6_mois">6 mois</option>
                </select>
              </div>

              {/* Méthodologie */}
              <div>
                <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                  Méthodologie proposée *
                </label>
                <textarea
                  id="methodology"
                  name="methodology"
                  required
                  rows={6}
                  value={formData.methodology}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                  placeholder="Décrivez votre approche méthodologique, les étapes de travail, les livrables..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Expliquez votre méthodologie de travail, les étapes que vous proposez et les livrables attendus.
                </p>
              </div>

              {/* Expérience pertinente */}
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience pertinente
                </label>
                <textarea
                  id="experience"
                  name="experience"
                  rows={4}
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                  placeholder="Décrivez vos expériences similaires, projets réalisés, références..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Partagez vos expériences similaires, projets réalisés et références pertinentes.
                </p>
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
                  Informations supplémentaires que vous souhaitez partager avec le client.
                </p>
              </div>

              {/* Informations du prestataire */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Informations du prestataire</h3>
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
                onClick={() => navigate('/prestataire/consultations')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
              >
                {saving ? 'Envoi...' : 'Envoyer ma proposition'}
              </button>
            </div>
          </form>
        </div>
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
        <p className="text-gray-600 mb-4">Vous avez déjà postulé à cette consultation.</p>
        <Link 
          to="/prestataire/demandes"
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200"
        >
          Voir mes demandes
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Postuler à la consultation</h1>
                         <p className="text-gray-600">{consultation.title}</p>
          </div>
          <Link 
            to={`/prestataire/consultation/${id}`}
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

      {/* Consultation Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails de la consultation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
                         <span className="text-sm font-medium text-gray-500">Titre</span>
             <p className="text-gray-900 font-medium">{consultation.title}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Client</span>
            <p className="text-gray-900">{consultation.client}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Durée</span>
            <p className="text-gray-900">{consultation.duration}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Budget</span>
            <p className="text-gray-900">{consultation.budget}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Localisation</span>
            <p className="text-gray-900">{consultation.client}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-500">Date limite</span>
            <p className="text-gray-900">{new Date(consultation.createdAt).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        
        {consultation.description && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-500">Description</span>
            <p className="text-gray-900 mt-1">{consultation.description}</p>
          </div>
        )}

        {consultation.requirements && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-500">Compétences requises</span>
            <p className="text-gray-900 mt-1">{consultation.requirements}</p>
          </div>
        )}
      </div>

      {/* Application Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-edit mr-2 text-fuchsia-600"></i>
            Proposition de service
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
                placeholder="Présentez-vous, expliquez votre approche pour cette mission, vos compétences pertinentes..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Décrivez votre motivation, votre approche et pourquoi vous êtes le prestataire idéal pour cette mission.
              </p>
            </div>

            {/* Budget proposé */}
            <div>
              <label htmlFor="proposedBudget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget proposé (FCFA) *
              </label>
              <input
                type="number"
                id="proposedBudget"
                name="proposedBudget"
                required
                min="0"
                value={formData.proposedBudget}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                placeholder="Ex: 800000"
              />
            </div>

            {/* Délai proposé */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Délai proposé *
              </label>
              <select
                id="timeline"
                name="timeline"
                required
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
              >
                <option value="">Sélectionner un délai</option>
                <option value="1_semaine">1 semaine</option>
                <option value="2_semaines">2 semaines</option>
                <option value="1_mois">1 mois</option>
                <option value="2_mois">2 mois</option>
                <option value="3_mois">3 mois</option>
                <option value="6_mois">6 mois</option>
              </select>
            </div>

            {/* Méthodologie */}
            <div>
              <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
                Méthodologie proposée *
              </label>
              <textarea
                id="methodology"
                name="methodology"
                required
                rows={6}
                value={formData.methodology}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Décrivez votre approche méthodologique, les étapes de travail, les livrables..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Expliquez votre méthodologie de travail, les étapes que vous proposez et les livrables attendus.
              </p>
            </div>

            {/* Expérience pertinente */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Expérience pertinente
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={4}
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-y"
                placeholder="Décrivez vos expériences similaires, projets réalisés, références..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Partagez vos expériences similaires, projets réalisés et références pertinentes.
              </p>
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
                Informations supplémentaires que vous souhaitez partager avec le client.
              </p>
            </div>

            {/* Informations du prestataire */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Informations du prestataire</h3>
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
               onClick={() => navigate(`/prestataire/consultation/${id}`)}
               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
             >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50"
            >
              {saving ? 'Envoi...' : 'Envoyer ma proposition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostulerConsultation; 