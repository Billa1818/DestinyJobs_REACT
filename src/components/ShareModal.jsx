import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ShareModal = ({ isOpen, onClose, isLoggedIn = false, title = "Partager cette offre" }) => {
    const navigate = useNavigate();
    const [useProfileInfo, setUseProfileInfo] = useState(false);
    const [motivationLetter, setMotivationLetter] = useState('');
    const [cvFile, setCvFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

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

    // Copier le lien
    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        });
    };

    // Partager sur les réseaux sociaux
    const shareOnNetwork = (platform) => {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Découvrez cette offre : ${title}`);
        let shareUrl;

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${text}%20${url}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                break;
            case 'email':
                shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${text}%20${url}`;
                break;
            default:
                return;
        }

        window.open(shareUrl, '_blank', 'width=600,height=400');
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
                        // Modal pour utilisateur non connecté - Uniquement partage
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    <i className="fas fa-share-alt text-fuchsia-600 mr-2"></i>
                                    Partager cette offre
                                </h3>
                                <p className="text-gray-600 text-sm mb-6">
                                    Partagez cette opportunité avec vos amis et votre réseau
                                </p>
                            </div>

                            {/* Copier le lien */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <i className="fas fa-link text-fuchsia-600 mr-2"></i>
                                    Copier le lien de l'offre
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={window.location.href}
                                        readOnly
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-600"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${copiedLink
                                            ? 'bg-green-600 text-white'
                                            : 'bg-fuchsia-600 text-white hover:bg-fuchsia-700'
                                            }`}
                                    >
                                        <i className={`fas ${copiedLink ? 'fa-check' : 'fa-copy'} mr-1`}></i>
                                        {copiedLink ? 'Copié !' : 'Copier'}
                                    </button>
                                </div>
                            </div>

                            {/* Réseaux sociaux */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    <i className="fas fa-share-nodes text-fuchsia-600 mr-2"></i>
                                    Partager sur les réseaux sociaux
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => shareOnNetwork('facebook')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium text-sm"
                                    >
                                        <i className="fab fa-facebook-f"></i>
                                        Facebook
                                    </button>
                                    <button
                                        onClick={() => shareOnNetwork('twitter')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition duration-200 font-medium text-sm"
                                    >
                                        <i className="fab fa-twitter"></i>
                                        Twitter
                                    </button>
                                    <button
                                        onClick={() => shareOnNetwork('linkedin')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-200 font-medium text-sm"
                                    >
                                        <i className="fab fa-linkedin-in"></i>
                                        LinkedIn
                                    </button>
                                    <button
                                        onClick={() => shareOnNetwork('whatsapp')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 font-medium text-sm"
                                    >
                                        <i className="fab fa-whatsapp"></i>
                                        WhatsApp
                                    </button>
                                    <button
                                        onClick={() => shareOnNetwork('telegram')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 font-medium text-sm"
                                    >
                                        <i className="fab fa-telegram"></i>
                                        Telegram
                                    </button>
                                    <button
                                        onClick={() => shareOnNetwork('email')}
                                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 font-medium text-sm"
                                    >
                                        <i className="fas fa-envelope"></i>
                                        Email
                                    </button>
                                </div>
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