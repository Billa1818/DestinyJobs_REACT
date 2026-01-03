# Fermeture des Offres Expirées - Résumé des modifications

## Services API ajoutés

### 1. **jobService.js**
```javascript
async closeExpiredJobOffer(offerId) {
  // POST /api/jobs/job-offers/<uuid:pk>/close-expired/
}
```

### 2. **consultationService.js**
```javascript
async closeExpiredConsultationOffer(offerId) {
  // POST /api/jobs/consultation-offers/<uuid:pk>/close-expired/
}
```

### 3. **financementService.js**
```javascript
async closeExpiredFundingOffer(offerId) {
  // POST /api/jobs/funding-offers/<uuid:pk>/close-expired/
}
```

## Pages modifiées

### 1. **GestionOffre.jsx** (Offres d'emploi)
- ✅ Méthode `handleCloseExpired()` ajoutée
- ✅ Bouton "Fermer" visible uniquement si `offre.status === 'EXPIRED'`
- ✅ Couleur orange (#fuchsia-600 → #orange-600)
- ✅ Icône : `fa-times-circle`

### 2. **GestionConsultation.jsx** (Consultations)
- ✅ Méthode `handleCloseExpired()` ajoutée
- ✅ Bouton "Fermer" visible uniquement si `consultation.status === 'EXPIRED'`
- ✅ Couleur orange
- ✅ Icône : `fa-times-circle`

### 3. **GestionFinancement.jsx** (Financements)
- ✅ Méthode `handleCloseExpired()` ajoutée
- ✅ Bouton "Fermer" visible uniquement si `funding.status === 'EXPIRED'`
- ✅ Couleur orange
- ✅ Icône : `fa-times-circle`

## Comportement du bouton "Fermer"

1. **Affichage** : Uniquement pour les offres avec le statut `EXPIRED`
2. **Action** : Appelle l'endpoint `/close-expired/` du backend
3. **Réponse** : 
   - Succès : notification "Offre fermée avec succès"
   - Erreur : notification avec message d'erreur
4. **Rafraîchissement** : La liste se recharge après 1 seconde

## Utilisation côté frontend

### Exemple : Fermer une offre d'emploi expirée
```javascript
await jobService.closeExpiredJobOffer(offerId);
```

### Exemple : Fermer une consultation expirée
```javascript
await consultationService.closeExpiredConsultationOffer(offerId);
```

### Exemple : Fermer un financement expiré
```javascript
await consultationService.closeExpiredFundingOffer(offerId); // via consultationService
```

## Notes importantes

- Le bouton "Fermer" **n'apparaît que si le statut est exactement `'EXPIRED'`**
- Les services gèrent automatiquement les erreurs et les notifications
- L'API backend retourne une erreur 402 si l'utilisateur n'a pas les droits
- Le modal PaymentRequiredModal s'affichera automatiquement si erreur 402

## Tests recommandés

1. Créer une offre avec une date d'expiration dans le passé
2. Vérifier que le statut affiche "Expirée"
3. Vérifier que le bouton "Fermer" apparaît
4. Cliquer sur "Fermer" et vérifier le succès
5. Répéter pour consultations et financements
