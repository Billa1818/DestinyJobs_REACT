import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SavedOffersService from '../services/SavedOffersService';

const SavedOfferButton = ({ offerId, offerType, className = '' }) => {
  const { user, isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [savedOfferId, setSavedOfferId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Vérifier si l'utilisateur est un candidat, un recruteur ou un prestataire
  const isEligible = isAuthenticated && user && (user.user_type === 'CANDIDAT' || user.user_type === 'RECRUTEUR' || user.user_type === 'PRESTATAIRE');

  useEffect(() => {
    if (isEligible && !initialized) {
      checkIfSaved();
    }
  }, [offerId, offerType, isEligible, initialized]);

  const checkIfSaved = async () => {
    try {
      console.log('🔍 Vérification si l\'offre est sauvegardée...', { offerId, offerType });
      
      // Récupérer toutes les offres sauvegardées avec limite élevée
      const response = await SavedOffersService.getSavedOffers(1, 100);
      console.log('📊 Réponse API:', response);
      
      const allSavedOffers = response.results || [];
      console.log('📋 Offres sauvegardées:', allSavedOffers);
      
      // Chercher l'offre actuelle dans la liste
      const savedOffer = allSavedOffers.find(
        offer => offer.offer_id === offerId && offer.offer_type === offerType
      );
      
      console.log('🎯 Offre trouvée?', savedOffer);
      
      if (savedOffer) {
        setIsSaved(true);
        setSavedOfferId(savedOffer.id);
        console.log('✅ Offre est sauvegardée avec ID:', savedOffer.id);
      } else {
        setIsSaved(false);
        setSavedOfferId(null);
        console.log('❌ Offre n\'est pas sauvegardée');
      }
      
      setInitialized(true);
    } catch (err) {
      console.error('❌ Erreur lors de la vérification des favoris:', err);
      setInitialized(true);
    }
  };

  const handleToggleSave = async () => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour ajouter aux favoris.');
      return;
    }

    if (!isEligible) {
      alert('Seuls les candidats, recruteurs et prestataires peuvent ajouter aux favoris.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (isSaved && savedOfferId) {
        // L'offre est déjà sauvegardée, on la retire
        console.log('🗑️ Suppression de l\'offre ID:', savedOfferId);
        await SavedOffersService.removeSavedOffer(savedOfferId);
        console.log('✅ Offre supprimée avec succès');
        setIsSaved(false);
        setSavedOfferId(null);
      } else {
        // L'offre n'est pas sauvegardée, on l'ajoute
        console.log('➕ Ajout de l\'offre:', { offerType, offerId });
        const response = await SavedOffersService.addToSavedOffers(offerType, offerId);
        console.log('✅ Offre ajoutée avec succès:', response);
        setIsSaved(true);
        setSavedOfferId(response.id);
      }
    } catch (err) {
      console.error('❌ Erreur complète:', err.response?.data || err.message);
      console.error('Détails:', err);
      setError('Impossible elle est déjà ajoutée aux favoris.');
    } finally {
      setLoading(false);
    }
  };

  // Ne pas afficher le bouton si l'utilisateur n'est pas éligible
  if (!isEligible) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleToggleSave}
        disabled={loading}
        className={`border transition duration-200 font-medium flex items-center justify-center gap-2 ${
          isSaved
            ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        <i className={`${isSaved ? 'fas fa-heart' : 'far fa-heart'}`}></i>
        {isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      </button>
      
      {error && (
        <div className="text-sm text-red-600 mt-2">
          {error}
        </div>
      )}
    </>
  );
};

export default SavedOfferButton;
