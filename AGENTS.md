# Configuration et standards du projet DestinyJobs REACT

## Architecture des URLs d'API

### Helper utilitaire
Tous les appels API doivent utiliser le helper centralisé situé dans `src/utils/urlHelper.js`:

```javascript
import { buildImageUrl, getApiBaseUrl } from '../../utils/urlHelper';

// Pour les images et fichiers:
const imageUrl = buildImageUrl(relativePath); // Résout port 8000 automatiquement

// Pour les appels API en fetch:
const url = `${getApiBaseUrl()}/api/endpoint/`;
```

### Configuration
L'URL de base de l'API est définie par:
- Variable d'environnement: `VITE_API_BASE_URL`
- Default: `http://localhost:8000`

### Problèmes courants
**❌ À ÉVITER:**
```javascript
// Hard-coded URLs
`http://localhost:8000${imagePath}`
`http://localhost:8000/api/endpoint/`
```

**✅ À FAIRE:**
```javascript
// Utiliser les helpers
buildImageUrl(imagePath)
`${getApiBaseUrl()}/api/endpoint/`
```

## Fichiers clés du projet

### Services
- `src/services/api.js` - Instance axios avec interceptors (authentification, tokens)
- `src/services/profileService.js` - Gestion des profils utilisateurs
- `src/services/authService.js` - Authentification et autorisation

### Composants réutilisables
- `src/components/headers/RecruteurHeader.jsx` - Header pour recruteurs
- `src/components/headers/CandidatHeader.jsx` - Header pour candidats
- `src/components/LoadingSpinner.jsx` - Spinner de chargement

### Pages par rôle
- `src/pages/recruteur/` - Pages spécifiques aux recruteurs
- `src/pages/candidat/` - Pages spécifiques aux candidats
- `src/pages/prestataire/` - Pages spécifiques aux prestataires
- `src/pages/public/` - Pages publiques accessibles à tous

## Environnement

### Variables d'environnement (voir .env)
```
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=DestinyJobs
```

### Développement
```bash
npm install
npm run dev  # Démarre sur http://localhost:3000
```

### Build production
```bash
npm run build
npm run preview
```

## Git workflow
- Branch main: production-ready
- Créer des branches pour chaque feature: `feature/nom-feature`
- Faire des commits atomiques avec messages clairs
- Créer des PRs pour review avant merge

## Standards de code

### Imports
- Utiliser les chemins absolus depuis src/
- Grouper par: React → Services → Utils → Composants → Styles

### Nommage
- Components: PascalCase (`MyComponent.jsx`)
- Fichiers: camelCase (`myFile.js`)
- Services: camelCase (`myService.js`)
- Constants: UPPER_SNAKE_CASE

### Formatage
- ESLint et Prettier configurés
- Lancer avant commit: `npm run lint`

## Points d'attention

### 1. Authentification
- Les tokens sont stockés en cookies (HTTPONLY de préférence)
- L'API auto-refresh via interceptors
- Vérifier toujours `isAuthenticated` avant afficher du contenu sensible

### 2. Images et fichiers
- Toujours utiliser `buildImageUrl()` pour les chemins relatifs
- Vérifier que l'URL commence pas par 'http' avant d'appliquer le helper

### 3. Appels API
- **TOUJOURS** utiliser les services (jobService, profileService, etc.) plutôt que fetch
- Les services utilisent axios via `src/services/api.js`
- Authentification gérée automatiquement par les interceptors
- Erreurs 401/402 gérées globalement par les interceptors

**❌ À ÉVITER:**
```javascript
// Fetch direct - pas recommandé
const response = await fetch(`${getApiBaseUrl()}/api/jobs/`);
const token = authService.getAccessToken(); // Manipulation manuelle
```

**✅ À FAIRE:**
```javascript
// Via service avec axios
import jobService from '../../services/jobService';

const data = await jobService.getPublicJobOffers();
// Token et erreurs gérés automatiquement
```

### 4. État global
- AuthContext pour l'authentification (`src/contexts/AuthContext.jsx`)
- Prop drilling ou Context API pour l'état local
- Éviter Redux sauf si nécessaire

## Changelog de migration

### Changements récents (2024-12-24)
- ✅ Centralisation des URLs d'API dans `src/utils/urlHelper.js`
- ✅ Migration de 25+ fichiers vers `buildImageUrl()` et `getApiBaseUrl()`
- ✅ Suppression des hard-coded `localhost:8000` en dehors des configs
- ✅ Préparation pour multi-environnements (dev/staging/prod)
