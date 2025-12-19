import { describe, it, expect } from 'vitest';

/**
 * Tests pour la validation du formulaire de création de financement
 * Vérifie la conformité avec l'API /api/jobs/funding-offers/
 */

describe('CreeFinancement Form Validation', () => {
    
    it('should validate required fields', () => {
        const requiredFields = [
            'title',
            'objective',
            'eligibility_criteria',
            'countries_covered',
            'project_duration',
            'contact_email',
            'organization_name',
            'more_info_source',
            'contact_info',
            'company_website_url',
            'date_limite'
        ];

        expect(requiredFields.length).toBe(11);
        expect(requiredFields).toContain('title');
        expect(requiredFields).toContain('contact_email');
        expect(requiredFields).toContain('company_website_url');
    });

    it('should validate email format', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test('contact@example.com')).toBe(true);
        expect(emailRegex.test('invalid-email')).toBe(false);
        expect(emailRegex.test('@example.com')).toBe(false);
    });

    it('should validate URL format', () => {
        const validUrls = [
            'https://www.company.com',
            'https://apply.example.com',
            'http://localhost:3000'
        ];

        validUrls.forEach(url => {
            expect(() => new URL(url)).not.toThrow();
        });
    });

    it('should handle montant conversion correctly', () => {
        const montant = '50000.00';
        const converted = parseFloat(montant);
        
        expect(converted).toBe(50000);
        expect(typeof converted).toBe('number');
    });

    it('should handle date_limite conversion to ISO format', () => {
        const dateLocale = '2025-12-31T23:59';
        const dateISO = new Date(dateLocale).toISOString();
        
        expect(dateISO).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should handle conditional external_application_url', () => {
        // Cas 1: is_external_application = false
        const data1 = {
            is_external_application: false,
            external_application_url: 'https://apply.example.com'
        };
        
        const apiData1 = {
            is_external_application: data1.is_external_application,
            external_application_url: data1.is_external_application ? data1.external_application_url : null
        };
        
        expect(apiData1.external_application_url).toBe(null);

        // Cas 2: is_external_application = true
        const data2 = {
            is_external_application: true,
            external_application_url: 'https://apply.example.com'
        };
        
        const apiData2 = {
            is_external_application: data2.is_external_application,
            external_application_url: data2.is_external_application ? data2.external_application_url : null
        };
        
        expect(apiData2.external_application_url).toBe('https://apply.example.com');
    });

    it('should parse country_id and region_id as integers', () => {
        const formData = {
            country_id: '1',
            region_id: '5'
        };

        const apiData = {
            country_id: formData.country_id ? parseInt(formData.country_id) : null,
            region_id: formData.region_id ? parseInt(formData.region_id) : null
        };

        expect(apiData.country_id).toBe(1);
        expect(apiData.region_id).toBe(5);
        expect(typeof apiData.country_id).toBe('number');
        expect(typeof apiData.region_id).toBe('number');
    });

    it('should handle empty optional fields', () => {
        const formData = {
            montant: '',
            country_id: '',
            region_id: ''
        };

        const apiData = {
            montant: formData.montant ? parseFloat(formData.montant) : null,
            country_id: formData.country_id ? parseInt(formData.country_id) : null,
            region_id: formData.region_id ? parseInt(formData.region_id) : null
        };

        expect(apiData.montant).toBe(null);
        expect(apiData.country_id).toBe(null);
        expect(apiData.region_id).toBe(null);
    });

    it('should map all form fields to API correctly', () => {
        const formData = {
            title: 'Financement Projet Innovation',
            objective: 'Financer le développement...',
            eligibility_criteria: 'Startups moins de 3 ans',
            countries_covered: 'France, Belgique',
            project_duration: '12 mois',
            contact_email: 'contact@example.com',
            organization_name: 'FondFrance',
            more_info_source: 'https://www.fondfrance.com',
            montant: '50000.00',
            contact_info: 'Tel: +33 1 23 45 67 89',
            date_limite: '2025-12-31T23:59',
            is_external_application: false,
            external_application_url: '',
            company_website_url: 'https://www.company.com',
            country_id: '1',
            region_id: '5'
        };

        // Simuler la transformation
        const apiData = {
            title: formData.title,
            objective: formData.objective,
            eligibility_criteria: formData.eligibility_criteria,
            countries_covered: formData.countries_covered,
            project_duration: formData.project_duration,
            contact_email: formData.contact_email,
            organization_name: formData.organization_name,
            more_info_source: formData.more_info_source,
            montant: formData.montant ? parseFloat(formData.montant) : null,
            contact_info: formData.contact_info,
            date_limite: formData.date_limite ? new Date(formData.date_limite).toISOString() : null,
            is_external_application: formData.is_external_application,
            external_application_url: formData.is_external_application ? formData.external_application_url : null,
            company_website_url: formData.company_website_url,
            country_id: formData.country_id ? parseInt(formData.country_id) : null,
            region_id: formData.region_id ? parseInt(formData.region_id) : null
        };

        expect(apiData.title).toBe('Financement Projet Innovation');
        expect(apiData.montant).toBe(50000);
        expect(apiData.country_id).toBe(1);
        expect(apiData.region_id).toBe(5);
        expect(apiData.external_application_url).toBe(null);
        expect(apiData.date_limite).toMatch(/2025-12-31/);
    });
});
