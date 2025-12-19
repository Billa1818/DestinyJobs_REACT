import api from './api';
import authService from './authService';

class ConversionService {
  /**
   * Vérifier si l'utilisateur peut devenir prestataire
   * @returns {Promise} - Réponse de vérification
   */
  async checkCanBecomeProvider() {
    try {
      const response = await api.get('/api/auth/become-provider/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      throw error;
    }
  }

  /**
   * Convertir l'utilisateur en prestataire
   * @param {Object} data - Données du prestataire
   * @returns {Promise} - Réponse de conversion
   */
  async becomeProvider(data) {
    try {
      const response = await api.post('/api/auth/become-provider/', {
        provider_type: data.provider_type || 'INDIVIDUAL',
        specializations: data.specializations || '',
        hourly_rate: data.hourly_rate || '0.00',
        daily_rate: data.daily_rate || '0.00',
        years_experience: data.years_experience || 0,
        availability: data.availability || 'AVAILABLE'
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la conversion en prestataire:', error);
      throw error;
    }
  }

  /**
   * Vérifier si l'utilisateur peut devenir candidat
   * @returns {Promise} - Réponse de vérification
   */
  async checkCanBecomeCandidate() {
    try {
      const response = await api.get('/api/auth/become-candidate/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      throw error;
    }
  }

  /**
   * Convertir l'utilisateur en candidat
   * @returns {Promise} - Réponse de conversion
   */
  async becomeCandidate() {
    try {
      const response = await api.post('/api/auth/become-candidate/', {});
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la conversion en candidat:', error);
      throw error;
    }
  }
}

const conversionService = new ConversionService();

export default conversionService;
