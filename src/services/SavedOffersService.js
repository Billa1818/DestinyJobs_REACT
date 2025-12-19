import api from './api';
import jobService from './jobService';
import consultationService from './consultationService';
import financementService from './financementService';
import bourseService from './bourseService';

const SavedOffersService = {
  /**
   * Ajouter une offre aux favoris
   * @param {string} offer_type - Type d'offre (JOB, CONSULTATION, FUNDING, SCHOLARSHIP)
   * @param {string} offer_id - ID de l'offre
   * @returns {object} - Offre sauvegardée
   */
  addToSavedOffers: async (offer_type, offer_id) => {
    try {
      const response = await api.post('/api/applications/saved/', {
        offer_type,
        offer_id,
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les offres sauvegardées
   * @param {number} page - Numéro de page (optionnel)
   * @param {number} limit - Limite par page (optionnel)
   * @returns {object} - Liste des offres sauvegardées
   */
  getSavedOffers: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/applications/saved/', {
        params: {
          page,
          limit,
        },
      });
      // Gérer les deux formats possibles: tableau direct ou objet avec results/count
      if (Array.isArray(response.data)) {
        return {
          results: response.data,
          count: response.data.length,
        };
      }
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris:', error);
      throw error;
    }
  },

  /**
   * Supprimer une offre des favoris
   * @param {string} saved_offer_id - ID de l'offre sauvegardée
   * @returns {void}
   */
  removeSavedOffer: async (saved_offer_id) => {
    try {
      await api.delete(`/api/applications/saved/${saved_offer_id}/`);
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      throw error;
    }
  },

  /**
   * Vérifier si une offre est dans les favoris
   * @param {string} offer_type - Type d'offre
   * @param {string} offer_id - ID de l'offre
   * @returns {boolean} - True si l'offre est sauvegardée
   */
  isSaved: async (offer_type, offer_id) => {
    try {
      const response = await api.get('/api/applications/saved/', {
        params: {
          offer_type,
          offer_id,
        },
      });
      return response.data.count > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
      return false;
    }
  },

  /**
   * Obtenir le nombre d'offres sauvegardées
   * @returns {number} - Nombre d'offres sauvegardées
   */
  getSavedOffersCount: async () => {
    try {
      const response = await api.get('/api/applications/saved/');
      return response.data.count || 0;
    } catch (error) {
      console.error('Erreur lors du comptage des favoris:', error);
      return 0;
    }
  },

  /**
   * Récupérer les offres sauvegardées avec leurs détails complètes
   * @param {number} page - Numéro de page (optionnel)
   * @param {number} limit - Limite par page (optionnel)
   * @returns {object} - Liste des offres sauvegardées avec détails
   */
  getSavedOffersWithDetails: async (page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/applications/saved/', {
        params: {
          page,
          limit,
        },
      });
      
      // Gérer les deux formats possibles: tableau direct ou objet avec results/count
      let formattedResponse;
      if (Array.isArray(response.data)) {
        formattedResponse = {
          results: response.data,
          count: response.data.length,
        };
      } else {
        formattedResponse = response.data;
      }
      
      const savedOffers = formattedResponse.results || [];

      // Récupérer les détails pour chaque offre
      const offersWithDetails = await Promise.all(
        savedOffers.map(async (savedOffer) => {
          try {
            let offerDetails = null;

            // Récupérer les détails selon le type d'offre
            switch (savedOffer.offer_type) {
              case 'JOB':
                offerDetails = await jobService.getPublicJobOfferDetail(savedOffer.offer_id);
                break;
              case 'CONSULTATION':
                offerDetails = await consultationService.getPublicConsultationDetail(savedOffer.offer_id);
                break;
              case 'FUNDING':
                offerDetails = await financementService.getFundingOfferDetail(savedOffer.offer_id);
                break;
              case 'SCHOLARSHIP':
                offerDetails = await bourseService.getPublicScholarshipDetail(savedOffer.offer_id);
                break;
              default:
                console.warn(`Type d'offre inconnu: ${savedOffer.offer_type}`);
            }

            return {
              ...savedOffer,
              details: offerDetails,
            };
          } catch (error) {
            console.error(`Erreur lors de la récupération des détails de l'offre ${savedOffer.offer_id}:`, error);
            return {
              ...savedOffer,
              details: null,
              detailsError: true,
            };
          }
        })
      );

      return {
        results: offersWithDetails,
        count: formattedResponse.count,
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des favoris avec détails:', error);
      throw error;
    }
  },
};

export default SavedOffersService;
