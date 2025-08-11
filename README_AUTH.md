# Système d'Authentification - DestinyJobs

## Vue d'ensemble

Le système d'authentification est maintenant configuré avec les composants suivants :

### 🔧 Architecture

1. **Service API** (`src/services/api.js`)
   - Configuration Axios avec base URL
   - Gestion automatique des tokens JWT
   - Intercepteurs pour les requêtes et réponses
   - Refresh automatique des tokens expirés

2. **Service d'authentification** (`src/services/authService.js`)
   - `register()` - Inscription des utilisateurs
   - `login()` - Connexion utilisateur
   - `logout()` - Déconnexion
   - `refreshToken()` - Renouvellement des tokens
   - `getCurrentUser()` - Récupération du profil utilisateur

3. **Contexte d'authentification** (`src/contexts/AuthContext.jsx`)
   - État global d'authentification
   - Gestion de la persistance des tokens
   - Redirection automatique selon le type d'utilisateur
   - Vérification du token au chargement

4. **Composant de route protégée** (`src/components/auth/ProtectedRoute.jsx`)
   - Protection des routes nécessitant une authentification
   - Redirection vers /login si non authentifié

### 📝 Pages d'authentification

1. **Connexion** (`src/pages/user/Login.jsx`)
   - Champ login (email ou nom d'utilisateur)
   - Champ mot de passe avec visibilité toggle
   - Case "Se souvenir de moi"
   - Boutons sociaux (Google, LinkedIn) - à configurer
   - États de chargement et validation

2. **Inscription** (`src/pages/user/Signup.jsx`)
   - Sélection du type d'utilisateur (CANDIDAT, RECRUTEUR, PRESTATAIRE)
   - Champs : nom d'utilisateur, email, téléphone, mot de passe
   - Confirmation de mot de passe
   - Acceptation des conditions d'utilisation
   - Newsletter optionnelle
   - Boutons sociaux - à configurer

### 🚀 Types d'utilisateurs

- **CANDIDAT** : Candidats à l'emploi
- **RECRUTEUR** : Recruteurs/Entreprises  
- **PRESTATAIRE** : Prestataires de services

### 🔐 Sécurité

- Tokens JWT avec refresh automatique
- Validation côté client
- Gestion sécurisée des mots de passe
- Protection CSRF
- Stockage sécurisé des tokens

### 📡 API Endpoints utilisés

- `POST /accounts/register/` - Inscription
- `POST /accounts/login/` - Connexion
- `POST /accounts/logout/` - Déconnexion
- `POST /accounts/refresh/` - Renouvellement token
- `GET /accounts/profile/` - Profil utilisateur

### 🎯 Redirection après authentification

- **CANDIDAT** → `/candidat`
- **RECRUTEUR** → `/recruteur/dashboard`
- **PRESTATAIRE** → `/prestataire/home`

### 🛠️ Configuration requise

1. Configurez la variable d'environnement `VITE_API_BASE_URL` dans votre `.env`
2. Assurez-vous que votre API backend respecte les endpoints documentés
3. Installez les dépendances : `react-hot-toast` pour les notifications

### 📱 Utilisation

```jsx
// Dans un composant
import { useAuth } from '../contexts/AuthContext';

function MonComposant() {
  const { user, login, logout, isAuthenticated, isLoading } = useAuth();
  
  // Utiliser les fonctions d'authentification
}
```

### 🔄 État global

L'état d'authentification est disponible dans toute l'application via le contexte :
- `user` : Informations de l'utilisateur connecté
- `isAuthenticated` : État de connexion
- `isLoading` : État de chargement
- `login()`, `register()`, `logout()` : Fonctions d'authentification

### 🚨 Gestion d'erreurs

- Toutes les erreurs sont affichées via react-hot-toast
- Messages d'erreur en français
- Gestion des erreurs réseau et serveur
- Validation des formulaires côté client

### 🎨 Interface utilisateur

- Design moderne avec Tailwind CSS
- États de chargement visuels
- Feedback utilisateur en temps réel
- Responsive design
- Icônes Font Awesome

Le système est maintenant prêt à être utilisé ! 🎉
