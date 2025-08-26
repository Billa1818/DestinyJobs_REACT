# Services de Profil Utilisateur - ProviderProfilService

Ce document décrit les nouveaux services ajoutés au `ProviderProfilService` pour gérer les informations du profil utilisateur depuis l'endpoint `/api/auth/profile/`.

## 🆕 Nouveaux Services Ajoutés

### 1. Récupération du Profil Utilisateur
```javascript
async getUserProfile()
```
**Endpoint :** `GET /api/auth/profile/`  
**Description :** Récupère les informations complètes de l'utilisateur connecté  
**Retour :** Objet contenant toutes les informations du profil utilisateur  
**Authentification :** JWT Token requis

## 📊 Structure des Données Retournées

### Réponse de l'API `/api/auth/profile/`
```json
{
  "id": "f605d492-4fd8-42f4-ac51-c4c629f7e0a0",
  "username": "billa2007",
  "email": "billa111@gmail.com",
  "first_name": "Billa",
  "last_name": "ASSOUMA",
  "user_type": "PRESTATAIRE",
  "phone": "0153400160",
  "is_approved": false,
  "email_verified": false,
  "last_activity": "2025-08-22T13:32:45.402918Z",
  "social_avatar": null,
  "created_at": "2025-08-20T22:47:08.999390Z",
  "updated_at": "2025-08-22T13:32:45.403172Z"
}
```

### Champs Disponibles
- **`id`** : Identifiant unique de l'utilisateur
- **`username`** : Nom d'utilisateur
- **`email`** : Adresse email
- **`first_name`** : Prénom
- **`last_name`** : Nom de famille
- **`user_type`** : Type de compte (PRESTATAIRE, RECRUTEUR, etc.)
- **`phone`** : Numéro de téléphone
- **`is_approved`** : Statut d'approbation du compte
- **`email_verified`** : Statut de vérification de l'email
- **`last_activity`** : Dernière activité de l'utilisateur
- **`social_avatar`** : Avatar social (optionnel)
- **`created_at`** : Date de création du compte
- **`updated_at`** : Date de dernière mise à jour

## 🔄 Intégration dans le Composant Profile.jsx

### États Ajoutés
```javascript
const [userProfile, setUserProfile] = useState(null);
const [loadingUserProfile, setLoadingUserProfile] = useState(false);
```

### Fonctions Ajoutées
- `loadUserProfile()` - Charge le profil utilisateur depuis l'API
- `getUserInfo()` - Récupère et formate les informations utilisateur

### Logique de Chargement
1. **Au montage :** Chargement automatique du profil utilisateur
2. **Affichage :** Informations affichées dans la sidebar avec indicateurs de chargement
3. **Gestion d'erreurs :** Messages d'erreur appropriés en cas d'échec

## 🎯 Fonctionnalités Ajoutées

### Section "Informations du compte"
- Affichage complet des informations du profil utilisateur
- Statuts visuels pour l'approbation et la vérification email
- Dates formatées en français
- Bouton de demande de vérification email

### Indicateurs Visuels
- **Statut d'approbation :** Vert (Approuvé) / Orange (En attente)
- **Email vérifié :** Vert (Vérifié) / Rouge (Non vérifié)
- **Chargement :** Spinner animé pendant le chargement

### Bouton de Vérification Email
- Affiché uniquement si l'email n'est pas vérifié
- Intégré avec la fonction `requestEmailVerification` existante
- Désactivé pendant l'envoi

## 🧪 Utilisation

### Dans le Composant React
```javascript
import ProviderProfilService from '../services/ProviderProfilService';

// Charger le profil utilisateur
const loadUserProfile = async () => {
  try {
    setLoadingUserProfile(true);
    const userData = await ProviderProfilService.getUserProfile();
    setUserProfile(userData);
  } catch (err) {
    console.error('Erreur lors du chargement du profil utilisateur:', err);
  } finally {
    setLoadingUserProfile(false);
  }
};
```

### Accès aux Données
```javascript
// Informations de base
const username = userProfile.username;
const fullName = `${userProfile.first_name} ${userProfile.last_name}`;
const email = userProfile.email;

// Statuts
const isApproved = userProfile.is_approved;
const emailVerified = userProfile.email_verified;

// Dates
const lastActivity = new Date(userProfile.last_activity);
const memberSince = new Date(userProfile.created_at);
```

## 🔧 Configuration

### Headers Requis
```javascript
Authorization: Bearer <jwt_token>
```

### Gestion des Erreurs
- Erreurs 401 : Token JWT invalide ou expiré
- Erreurs 500 : Erreurs serveur
- Fallback gracieux en cas d'échec

## 📱 Interface Utilisateur

### Affichage dans la Sidebar
- **Section dédiée** : "Informations du compte" avec icône
- **Layout responsive** : Adapté aux différentes tailles d'écran
- **Couleurs contextuelles** : Vert/Orange/Rouge selon les statuts
- **Formatage des dates** : Format français localisé

### Intégration avec l'Existant
- **Profile Summary** : Indicateurs de chargement et statuts
- **Quick Actions** : Boutons d'action rapide
- **Statistics** : Statistiques du profil prestataire

## 📝 Notes Importantes

1. **Authentification :** L'endpoint nécessite un token JWT valide
2. **Chargement :** Le profil utilisateur est chargé au montage du composant
3. **Séparation :** Les informations utilisateur sont gérées séparément du profil prestataire
4. **Fallback :** En cas d'échec de chargement, les sections utilisateur sont masquées
5. **Performance :** Les données sont chargées une seule fois au montage

## 🔍 Dépannage

### Problèmes Courants
- **Profil non chargé :** Vérifier l'authentification et l'endpoint `/api/auth/profile/`
- **Erreur de chargement :** Vérifier la validité du token JWT
- **Données manquantes :** Vérifier la structure de la réponse API

### Logs de Débogage
Les services incluent des logs détaillés pour faciliter le débogage :
- 👤 Chargement du profil utilisateur
- ❌ Gestion des erreurs
- 📊 Affichage des données récupérées

## 🚀 Améliorations Futures

### Fonctionnalités Potentielles
- **Édition du profil** : Modification des informations utilisateur
- **Changement de mot de passe** : Interface de modification du mot de passe
- **Notifications** : Gestion des préférences de notification
- **Sécurité** : Historique des connexions et activités 