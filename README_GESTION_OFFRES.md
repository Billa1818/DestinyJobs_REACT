# Gestion des Offres d'Emploi - Recruteurs

## Vue d'ensemble

Le composant `GestionOffre.jsx` permet aux recruteurs de gérer leurs offres d'emploi de manière complète et intuitive. Il utilise les nouvelles API du `jobService.js` pour interagir avec le backend.

## Fonctionnalités principales

### 1. **Affichage des offres**
- Liste paginée des offres du recruteur
- Informations détaillées : titre, description, statut, type de contrat, expérience requise, salaire, mode de travail
- Statistiques en temps réel : candidatures, vues, priorité, type de promotion

### 2. **Filtrage et recherche**
- **Recherche textuelle** : recherche dans le titre et la description (filtrage local)
- **Filtres API** : statut, type de contrat, expérience requise, mode de travail
- **Filtrage intelligent** : délai de 500ms pour éviter les requêtes excessives

### 3. **Gestion des offres**
- **Modifier** : redirection vers le formulaire de modification
- **Supprimer** : suppression avec confirmation
- **Mettre en pause/Réactiver** : basculer entre PUBLISHED et CLOSED
- **Aperçu** : ouvrir l'offre dans un nouvel onglet

### 4. **Statistiques détaillées**
- Vue d'ensemble avec compteurs visuels
- Répartition par statut avec barres de progression
- Informations supplémentaires (urgent, sponsorisé, moyennes)

### 5. **Pagination avancée**
- Navigation par pages avec indicateurs visuels
- Sélecteur de page direct
- Informations sur les éléments affichés

## Structure des composants

### Composants principaux

#### `GestionOffre.jsx`
- Composant principal de gestion des offres
- Gère l'état, les filtres, la pagination et les actions

#### `JobStats.jsx`
- Affiche les statistiques des offres
- Calculs en temps réel des métriques

#### `Pagination.jsx`
- Composant de pagination réutilisable
- Navigation intuitive avec indicateurs visuels

#### `Notification.jsx`
- Système de notifications pour les actions utilisateur
- Types : succès, erreur, avertissement, info

### Services

#### `jobService.js`
Nouvelles méthodes ajoutées :

```javascript
// Récupération des offres du recruteur
async getMyJobOffers(filters = {})

// Détail complet d'une offre
async getJobOfferDetail(offerId)

// Création d'offre
async createJobOffer(jobData)

// Mise à jour d'offre
async updateJobOffer(offerId, updateData)

// Suppression d'offre
async deleteJobOffer(offerId)

// Recherche avancée
async searchJobOffers(searchParams)
```

## États et gestion des données

### États locaux
```javascript
const [offres, setOffres] = useState([]);                    // Offres chargées
const [filteredOffres, setFilteredOffres] = useState([]);    // Offres filtrées
const [loading, setLoading] = useState(true);                // État de chargement
const [error, setError] = useState(null);                    // Erreurs
const [filters, setFilters] = useState({...});              // Filtres actifs
const [pagination, setPagination] = useState({...});        // État de pagination
```

### Gestion des filtres
- **Filtres locaux** : recherche textuelle (instantanée)
- **Filtres API** : statut, contrat, expérience, mode (avec délai)
- **Synchronisation** : les filtres API réinitialisent la pagination

## Cycle de vie des offres

### Statuts supportés
1. **`DRAFT`** - Brouillon (non visible)
2. **`PENDING_APPROVAL`** - En attente d'approbation admin
3. **`APPROVED`** - Approuvée par l'admin
4. **`PUBLISHED`** - Publiée et visible publiquement
5. **`REJECTED`** - Refusée par l'admin
6. **`EXPIRED`** - Expirée (date dépassée)
7. **`CLOSED`** - Fermée manuellement

### Actions selon le statut
| Statut | Modifier | Supprimer | Mettre en pause | Visibilité |
|--------|----------|-----------|-----------------|------------|
| `DRAFT` | ✅ | ✅ | ❌ | Privée |
| `PENDING_APPROVAL` | ✅ | ✅ | ❌ | Privée |
| `APPROVED` | ✅ | ✅ | ✅ | Publique |
| `PUBLISHED` | ✅ | ✅ | ✅ | Publique |
| `REJECTED` | ✅ | ✅ | ❌ | Privée |
| `EXPIRED` | ✅ | ✅ | ❌ | Privée |
| `CLOSED` | ✅ | ✅ | ✅ | Privée |

## Gestion des erreurs

### Types d'erreurs gérées
- **Erreurs de chargement** : affichage avec bouton de retry
- **Erreurs d'action** : notifications toast avec messages détaillés
- **Erreurs de validation** : messages d'erreur spécifiques

### Système de notifications
```javascript
showNotification('success', 'Offre supprimée avec succès');
showNotification('error', 'Erreur lors de la suppression');
showNotification('warning', 'Attention, action irréversible');
showNotification('info', 'Chargement en cours...');
```

## Performance et optimisation

### Stratégies d'optimisation
1. **Délai de filtrage** : 500ms pour éviter les requêtes excessives
2. **Pagination** : chargement par lots de 20 offres
3. **Filtrage local** : recherche textuelle sans requête API
4. **Mise en cache** : réutilisation des données chargées

### Gestion de la mémoire
- Nettoyage des timers de filtrage
- Réinitialisation des états lors du démontage
- Gestion des abonnements API

## Responsive design

### Breakpoints supportés
- **Mobile** : < 640px - Layout vertical, boutons empilés
- **Tablet** : 640px - 1024px - Layout hybride
- **Desktop** : > 1024px - Layout horizontal complet

### Adaptations mobiles
- Filtres empilés verticalement
- Boutons d'action adaptés aux écrans tactiles
- Statistiques en grille 2x3 sur mobile

## Tests et validation

### Points de test recommandés
1. **Chargement initial** : vérifier l'état de chargement
2. **Filtrage** : tester tous les types de filtres
3. **Pagination** : navigation entre les pages
4. **Actions** : modifier, supprimer, mettre en pause
5. **Gestion d'erreurs** : simuler des erreurs réseau
6. **Responsive** : tester sur différentes tailles d'écran

### Validation des données
- Vérification des types de données reçues
- Gestion des valeurs nulles/undefined
- Formatage des dates et nombres
- Validation des statuts et enums

## Dépendances

### Packages requis
```json
{
  "react": "^18.0.0",
  "react-router-dom": "^6.0.0",
  "tailwindcss": "^3.0.0"
}
```

### Composants externes
- `DeleteConfirmationModal` : modal de confirmation de suppression
- `FontAwesome` : icônes (classes CSS)

## Utilisation

### Import et utilisation
```javascript
import GestionOffre from './pages/recruteur/GestionOffre';

// Dans le routeur
<Route path="/recruteur/gestion-offres" element={<GestionOffre />} />
```

### Prérequis
- Utilisateur authentifié avec le rôle RECRUTEUR
- Token d'authentification valide
- Accès aux API `/api/jobs/job-offers/`

## Maintenance et évolutions

### Améliorations futures
1. **Tri avancé** : par date, candidatures, vues
2. **Export** : CSV, PDF des offres
3. **Bulk actions** : actions en lot sur plusieurs offres
4. **Analytics** : graphiques de performance des offres
5. **Notifications push** : alertes en temps réel

### Points d'attention
- Vérifier la compatibilité des nouvelles API
- Maintenir la cohérence des statuts
- Optimiser les performances sur de grandes listes
- Tester la gestion des erreurs réseau

---

## Support et contact

Pour toute question ou problème lié à la gestion des offres, consulter :
- La documentation API du backend
- Les logs de la console navigateur
- Les erreurs réseau dans les outils de développement 