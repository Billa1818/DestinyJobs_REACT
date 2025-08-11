// Export de tous les services
export { default as api } from './api';
export { default as authService } from './authService';
export { default as profileService } from './profileService';
export { default as jobService } from './jobService';
export { default as consultationService } from './consultationService';
export { default as notificationService } from './notificationService';

// Export des types et constantes utiles
export const USER_TYPES = {
  CANDIDAT: 'CANDIDAT',
  RECRUTEUR: 'RECRUTEUR',
  PRESTATAIRE: 'PRESTATAIRE',
  ADMIN: 'ADMIN'
};

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  REVIEWING: 'REVIEWING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN'
};

export const COMPANY_SIZES = {
  STARTUP: 'STARTUP',
  SMALL: 'SMALL',
  MEDIUM: 'MEDIUM',
  LARGE: 'LARGE',
  ENTERPRISE: 'ENTERPRISE'
};

export const PROVIDER_TYPES = {
  INDIVIDUAL: 'INDIVIDUAL',
  ORGANIZATION: 'ORGANIZATION'
};

export const AVAILABILITY_STATUS = {
  AVAILABLE: 'AVAILABLE',
  BUSY: 'BUSY',
  UNAVAILABLE: 'UNAVAILABLE'
};

export const PROFILE_VISIBILITY = {
  PUBLIC: 'PUBLIC',
  RECRUITERS_ONLY: 'RECRUITERS_ONLY',
  PRIVATE: 'PRIVATE'
};

export const AUTH_PROVIDERS = {
  EMAIL: 'EMAIL',
  FACEBOOK: 'FACEBOOK',
  GOOGLE: 'GOOGLE',
  LINKEDIN: 'LINKEDIN'
}; 