import React, { useState, useEffect } from 'react';
import ProviderProfilService from '../../services/ProviderProfilService';

const EditUserInfoModal = ({ isOpen, onClose, onSaved, userProfile }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Charger les données du profil utilisateur au montage du modal
  useEffect(() => {
    if (isOpen && userProfile) {
      setFormData({
        username: userProfile.username || '',
        email: userProfile.email || '',
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        phone: userProfile.phone || ''
      });
      setError(null);
      setSuccess(null);
      setValidationErrors({});
    }
  }, [isOpen, userProfile]);

  // Gérer les changements de champs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur de ce champ si l'utilisateur commence à taper
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Valider les données
  const validateForm = () => {
    const errors = {};

    // Validation de l'email
    if (!formData.email) {
      errors.email = 'L\'adresse email est obligatoire';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'L\'adresse email est invalide';
      }
    }

    // Validation optionnelle du téléphone
    if (formData.phone && formData.phone.trim().length > 0) {
      const phoneRegex = /^\+?[0-9\s\-\.()]{7,}$/;
      if (!phoneRegex.test(formData.phone)) {
        errors.phone = 'Le numéro de téléphone est invalide';
      }
    }

    return errors;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valider
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Préparer les données
      const dataToSend = ProviderProfilService.prepareUserProfileData(formData);

      // Mettre à jour le profil utilisateur
      const response = await ProviderProfilService.updateUserProfile(dataToSend);

      setSuccess('Vos informations personnelles ont été mises à jour avec succès !');
      
      // Fermer le modal après un court délai
      setTimeout(() => {
        onClose();
        if (onSaved) {
          onSaved(response);
        }
      }, 1500);
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      
      // Gérer les erreurs de l'API
      if (err.response?.data) {
        const apiErrors = err.response.data;
        
        // Si c'est un objet avec des erreurs par champ
        if (typeof apiErrors === 'object' && !Array.isArray(apiErrors)) {
          setValidationErrors(apiErrors);
          setError('Veuillez corriger les erreurs dans le formulaire');
        } else if (apiErrors.detail) {
          setError(apiErrors.detail);
        } else if (apiErrors.error) {
          setError(apiErrors.error);
        } else {
          setError('Une erreur est survenue lors de la mise à jour. Veuillez réessayer.');
        }
      } else {
        setError('Une erreur est survenue lors de la mise à jour. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            <i className="fas fa-user-edit text-orange-600 mr-2"></i>
            Modifier mes informations
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Messages d'erreur globale */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm flex items-center">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </p>
          </div>
        )}

        {/* Message de succès */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm flex items-center">
              <i className="fas fa-check-circle mr-2"></i>
              {success}
            </p>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom d'utilisateur - Non modifiable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              readOnly
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="john_doe"
            />
            <p className="mt-1 text-xs text-gray-500">
              <i className="fas fa-lock mr-1"></i>
              Ce champ ne peut pas être modifié
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                validationErrors.email
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="john@example.com"
            />
            {validationErrors.email && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <i className="fas fa-times-circle mr-1"></i>
                {validationErrors.email}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              ⚠️ Si vous modifiez l'email, celui-ci devra être vérifié
            </p>
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Jean"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              placeholder="Dupont"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition ${
                validationErrors.phone
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
              placeholder="+221 90 123 4567"
            />
            {validationErrors.phone && (
              <p className="mt-1 text-xs text-red-600 flex items-center">
                <i className="fas fa-times-circle mr-1"></i>
                {validationErrors.phone}
              </p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserInfoModal;
