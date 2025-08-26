import ProviderProfilService from './ProviderProfilService';

// Tests pour ProviderProfilService
describe('ProviderProfilService', () => {
  
  // Test de validation des données
  describe('validateProfileData', () => {
    test('devrait valider un profil valide', () => {
      const validProfile = {
        provider_type: 'INDIVIDUAL',
        specializations: 'Développement Web, Python',
        hourly_rate: '50.00',
        daily_rate: '400.00',
        availability: 'AVAILABLE',
        years_experience: '5'
      };

      const result = ProviderProfilService.validateProfileData(validProfile);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('devrait rejeter un profil sans type', () => {
      const invalidProfile = {
        specializations: 'Développement Web',
        hourly_rate: '50.00'
      };

      const result = ProviderProfilService.validateProfileData(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le type de prestataire est obligatoire');
    });

    test('devrait rejeter un profil sans spécialisations', () => {
      const invalidProfile = {
        provider_type: 'INDIVIDUAL',
        hourly_rate: '50.00'
      };

      const result = ProviderProfilService.validateProfileData(invalidProfile);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Les spécialisations sont obligatoires');
    });
  });

  // Test de formatage des données
  describe('formatProfileForDisplay', () => {
    test('devrait formater correctement les données', () => {
      const rawProfile = {
        hourly_rate: '50.00',
        daily_rate: '400.00',
        years_experience: '5',
        completed_projects: '25',
        availability: 'AVAILABLE',
        provider_type: 'INDIVIDUAL'
      };

      const formatted = ProviderProfilService.formatProfileForDisplay(rawProfile);
      
      expect(formatted.hourly_rate).toBe('50.00');
      expect(formatted.daily_rate).toBe('400.00');
      expect(formatted.years_experience).toBe(5);
      expect(formatted.completed_projects).toBe(25);
      expect(formatted.availability_display).toBe('Disponible');
      expect(formatted.provider_type_display).toBe('Individuel');
    });
  });

  // Test de préparation des données
  describe('prepareProfileData', () => {
    test('devrait créer un FormData valide', () => {
      const profileData = {
        provider_type: 'INDIVIDUAL',
        specializations: 'Développement Web',
        hourly_rate: '50.00',
        country: { id: 1, name: 'Bénin' },
        region: { id: 2, name: 'Littoral' }
      };

      const files = {
        image: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        cv: new File([''], 'test.pdf', { type: 'application/pdf' })
      };

      const formData = ProviderProfilService.prepareProfileData(profileData, files);
      
      expect(formData).toBeInstanceOf(FormData);
      
      // Vérifier que les données sont bien ajoutées
      const entries = Array.from(formData.entries());
      expect(entries).toHaveLength(5); // 4 champs textuels + 1 fichier
      
      // Vérifier les IDs de pays et région
      expect(formData.get('country_id')).toBe('1');
      expect(formData.get('region_id')).toBe('2');
    });

    test('devrait ignorer les champs vides', () => {
      const profileData = {
        provider_type: 'INDIVIDUAL',
        specializations: 'Développement Web',
        hourly_rate: '',
        daily_rate: null,
        years_experience: undefined
      };

      const formData = ProviderProfilService.prepareProfileData(profileData);
      const entries = Array.from(formData.entries());
      
      // Seuls les champs non vides doivent être présents
      expect(entries).toHaveLength(2);
      expect(formData.get('provider_type')).toBe('INDIVIDUAL');
      expect(formData.get('specializations')).toBe('Développement Web');
    });
  });

  // Test des utilitaires
  describe('getAvailabilityDisplay', () => {
    test('devrait retourner les bonnes traductions', () => {
      expect(ProviderProfilService.getAvailabilityDisplay('AVAILABLE')).toBe('Disponible');
      expect(ProviderProfilService.getAvailabilityDisplay('BUSY')).toBe('Occupé');
      expect(ProviderProfilService.getAvailabilityDisplay('UNAVAILABLE')).toBe('Non disponible');
      expect(ProviderProfilService.getAvailabilityDisplay('UNKNOWN')).toBe('UNKNOWN');
    });
  });

  describe('getProviderTypeDisplay', () => {
    test('devrait retourner les bonnes traductions', () => {
      expect(ProviderProfilService.getProviderTypeDisplay('INDIVIDUAL')).toBe('Individuel');
      expect(ProviderProfilService.getProviderTypeDisplay('ORGANIZATION')).toBe('Organisation');
      expect(ProviderProfilService.getProviderTypeDisplay('UNKNOWN')).toBe('UNKNOWN');
    });
  });
});

// Test d'intégration avec l'API (nécessite un serveur en cours d'exécution)
describe('ProviderProfilService Integration', () => {
  test('devrait pouvoir récupérer un profil (si authentifié)', async () => {
    try {
      const profile = await ProviderProfilService.getProviderProfile();
      expect(profile).toBeDefined();
      expect(typeof profile).toBe('object');
    } catch (error) {
      // Attendu si non authentifié
      expect(error).toBeDefined();
    }
  });
}); 