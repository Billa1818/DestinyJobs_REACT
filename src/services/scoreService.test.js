/**
 * Tests pour le scoreService - Version 2.0 avec nouvelle API unifiée
 */

import scoreService from './scoreService';

// Mock de l'API pour les tests
jest.mock('./api', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

describe('ScoreService - Nouvelle API Unifiée', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('convertOfferTypeToAPI', () => {
    it('devrait convertir les types d\'offre en format API', () => {
      expect(scoreService.convertOfferTypeToAPI('emploi')).toBe('JOB');
      expect(scoreService.convertOfferTypeToAPI('consultation')).toBe('CONSULTATION');
      expect(scoreService.convertOfferTypeToAPI('financement')).toBe('FUNDING');
      expect(scoreService.convertOfferTypeToAPI('bourse')).toBe('FUNDING');
    });

    it('devrait gérer les types en majuscules', () => {
      expect(scoreService.convertOfferTypeToAPI('JOB')).toBe('JOB');
      expect(scoreService.convertOfferTypeToAPI('CONSULTATION')).toBe('CONSULTATION');
      expect(scoreService.convertOfferTypeToAPI('FUNDING')).toBe('FUNDING');
    });

    it('devrait gérer les types mixtes', () => {
      expect(scoreService.convertOfferTypeToAPI('Emploi')).toBe('JOB');
      expect(scoreService.convertOfferTypeToAPI('Consultation')).toBe('CONSULTATION');
      expect(scoreService.convertOfferTypeToAPI('Financement')).toBe('FUNDING');
    });

    it('devrait lever une erreur pour les types invalides', () => {
      expect(() => scoreService.convertOfferTypeToAPI('invalid')).toThrow('Type d\'offre invalide');
      expect(() => scoreService.convertOfferTypeToAPI('')).toThrow('Type d\'offre invalide');
      expect(() => scoreService.convertOfferTypeToAPI(null)).toThrow('Type d\'offre invalide');
    });
  });

  describe('calculateCompatibility', () => {
    it('devrait calculer la compatibilité pour un emploi', async () => {
      // Arrange
      const candidateId = 'candidat-uuid-123';
      const offerId = 'offre-uuid-456';
      const offerType = 'emploi';
      
      const mockResponse = {
        data: {
          success: true,
          compatibility_score: 85.5,
          recommendation: 'RECOMMEND',
          detailed_scores: {
            skill_match: 90,
            experience_match: 85,
            location_match: 80,
            salary_match: 85,
            culture_match: 90
          },
          analysis_date: '2025-08-18T22:38:06.000000Z',
          score_saved: true
        }
      };

      const { default: api } = require('./api');
      api.post.mockResolvedValue(mockResponse);

      // Act
      const result = await scoreService.calculateCompatibility(candidateId, offerId, offerType);

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        '/api/applications/ai/calculate-compatibility/',
        {
          candidate_id: candidateId,
          offer_id: offerId,
          offer_type: 'JOB'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('devrait calculer la compatibilité pour une consultation', async () => {
      // Arrange
      const candidateId = 'candidat-uuid-123';
      const offerId = 'consultation-uuid-789';
      const offerType = 'consultation';
      
      const mockResponse = {
        data: {
          success: true,
          compatibility_score: 78.0,
          recommendation: 'CONSIDER',
          detailed_scores: {
            expertise_match: 75,
            portfolio_match: 80,
            availability_match: 70,
            rates_match: 85,
            references_match: 78
          }
        }
      };

      const { default: api } = require('./api');
      api.post.mockResolvedValue(mockResponse);

      // Act
      const result = await scoreService.calculateCompatibility(candidateId, offerId, offerType);

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        '/api/applications/ai/calculate-compatibility/',
        {
          candidate_id: candidateId,
          offer_id: offerId,
          offer_type: 'CONSULTATION'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('devrait calculer la compatibilité pour un financement', async () => {
      // Arrange
      const candidateId = 'candidat-uuid-123';
      const offerId = 'funding-uuid-101';
      const offerType = 'financement';
      
      const mockResponse = {
        data: {
          success: true,
          compatibility_score: 92.0,
          recommendation: 'RECOMMEND',
          detailed_scores: {
            business_plan_match: 95,
            financial_profile_match: 90,
            guarantees_match: 88,
            profitability_match: 92,
            risk_assessment: 94
          }
        }
      };

      const { default: api } = require('./api');
      api.post.mockResolvedValue(mockResponse);

      // Act
      const result = await scoreService.calculateCompatibility(candidateId, offerId, offerType);

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        '/api/applications/ai/calculate-compatibility/',
        {
          candidate_id: candidateId,
          offer_id: offerId,
          offer_type: 'FUNDING'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('devrait gérer les erreurs de validation', async () => {
      // Arrange
      const candidateId = 'candidat-uuid-123';
      const offerId = 'offre-uuid-456';
      const offerType = 'emploi';
      
      const mockError = {
        response: {
          status: 400,
          data: { error: 'Type d\'offre invalide. Utilisez JOB, CONSULTATION ou FUNDING' }
        }
      };

      const { default: api } = require('./api');
      api.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        scoreService.calculateCompatibility(candidateId, offerId, offerType)
      ).rejects.toThrow('Erreur de validation: Type d\'offre invalide. Utilisez JOB, CONSULTATION ou FUNDING');
    });

    it('devrait gérer les erreurs d\'accès interdit', async () => {
      // Arrange
      const candidateId = 'candidat-uuid-123';
      const offerId = 'offre-uuid-456';
      const offerType = 'emploi';
      
      const mockError = {
        response: {
          status: 403,
          data: { error: 'Vous ne pouvez analyser que vos propres offres' }
        }
      };

      const { default: api } = require('./api');
      api.post.mockRejectedValue(mockError);

      // Act & Assert
      await expect(
        scoreService.calculateCompatibility(candidateId, offerId, offerType)
      ).rejects.toThrow('Accès interdit. Vous ne pouvez analyser que vos propres offres.');
    });
  });

  describe('Méthodes de compatibilité (rétrocompatibilité)', () => {
    it('devrait maintenir la rétrocompatibilité avec analyzeJobCompatibility', async () => {
      // Arrange
      const candidateId = 'candidat-uuid-123';
      const jobOfferId = 'offre-uuid-456';
      
      const mockResponse = {
        data: { compatibility_score: 85.5 }
      };

      const { default: api } = require('./api');
      api.post.mockResolvedValue(mockResponse);

      // Act
      const result = await scoreService.analyzeJobCompatibility(candidateId, jobOfferId);

      // Assert
      expect(api.post).toHaveBeenCalledWith(
        '/api/applications/ai/calculate-compatibility/',
        {
          candidate_id: candidateId,
          offer_id: jobOfferId,
          offer_type: 'JOB'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 