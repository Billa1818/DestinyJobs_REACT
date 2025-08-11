import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShareModal = ({ isOpen, onClose, isLoggedIn = false, title = "Partager cette offre" }) => {
  const navigate = useNavigate();
  const [useProfileInfo, setUseProfileInfo] = useState(false);
  const [motivationLetter, setMotivationLetter] = useState('');
  const [cvFile, setCvFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simuler un délai de soumission
    setTimeout(() => {
      alert('Candidature envoyée avec succès !');
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Découvrez cette offre : ${title}`,
        url: window.location.href
      });
    } else {
      // Fallback pour copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            <i className="fas fa-share-alt text-fuchsia-600 mr-2"></i>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isLoggedIn ? (
            // Modal pour utilisateur non connecté
            <div className="text-center">
              <div className="mb-6">
                <i className="fas fa-user-lock text-6xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connexion requise
                </h3>
                <p className="text-gray-600 mb-6">
                  Vous devez être connecté pour postuler à cette offre. Connectez-vous ou créez un compte pour continuer.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose();
                    // Rediriger vers la page de connexion
                    navigate('/login');
                  }}
                  className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Se connecter
                </button>
                
                <button
                  onClick={() => {
                    onClose();
                    // Rediriger vers la page d'inscription
                    navigate('/register');
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Créer un compte
                </button>
              </div>
            </div>
          ) : (
            // Modal pour utilisateur connecté
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <i className="fas fa-paper-plane text-fuchsia-600 mr-2"></i>
                  Postuler à cette offre
                </h3>
                
                {/* Option pour utiliser les infos du profil */}
                <div className="mb-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useProfileInfo}
                      onChange={(e) => setUseProfileInfo(e.target.checked)}
                      className="w-4 h-4 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500"
                    />
                    <span className="text-sm text-gray-700">
                      Utiliser mon CV et les informations de mon profil
                    </span>
                  </label>
                </div>

                {/* Lettre de motivation */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-file-alt text-fuchsia-600 mr-2"></i>
                    Lettre de motivation *
                  </label>
                  <textarea
                    required
                    value={motivationLetter}
                    onChange={(e) => setMotivationLetter(e.target.value)}
                    placeholder="Rédigez votre lettre de motivation..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 resize-none"
                    rows="6"
                  />
                </div>

                {/* Upload CV si pas d'utilisation du profil */}
                {!useProfileInfo && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <i className="fas fa-file-upload text-fuchsia-600 mr-2"></i>
                      CV (PDF, DOC, DOCX) *
                    </label>
                    <input
                      required
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100"
                    />
                    {cvFile && (
                      <p className="text-sm text-green-600 mt-1">
                        <i className="fas fa-check mr-1"></i>
                        {cvFile.name} sélectionné
                      </p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane mr-2"></i>
                        Envoyer ma candidature
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200 font-medium"
                  >
                    <i className="fas fa-share mr-2"></i>
                    Partager
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal; 