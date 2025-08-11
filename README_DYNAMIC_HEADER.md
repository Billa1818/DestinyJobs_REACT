# Système de Headers Dynamiques - Destiny Jobs

## Vue d'ensemble

Ce projet implémente un système de headers dynamiques qui affiche automatiquement le bon header selon le statut de l'utilisateur connecté.

## Architecture

### Composants principaux

1. **`DynamicHeader`** (`src/components/DynamicHeader.jsx`)
   - Composant central qui détermine quel header afficher
   - Utilise le contexte d'authentification pour détecter le statut de l'utilisateur
   - Affiche automatiquement le header approprié

2. **Headers spécifiques**
   - `PublicHeader` : Pour les utilisateurs non connectés
   - `CandidatHeader` : Pour les candidats connectés
   - `RecruteurHeader` : Pour les recruteurs connectés
   - `PrestataireHeader` : Pour les prestataires connectés

### Logique de sélection

Le `DynamicHeader` utilise la propriété `user.user_type` du contexte d'authentification pour déterminer quel header afficher :

```javascript
const userType = user.user_type?.toLowerCase();

switch (userType) {
  case 'candidat':
    return <CandidatHeader />;
  case 'recruteur':
    return <RecruteurHeader />;
  case 'prestataire':
    return <PrestataireHeader />;
  default:
    return <PublicHeader />;
}
```

## Utilisation

### Dans les layouts

Tous les layouts utilisent maintenant le `DynamicHeader` au lieu des headers statiques :

```javascript
import DynamicHeader from '../components/DynamicHeader';

const MyLayout = () => {
  return (
    <div>
      <DynamicHeader />
      {/* Contenu du layout */}
    </div>
  );
};
```

### Layouts modifiés

- ✅ `PublicLayout` - Utilise `DynamicHeader`
- ✅ `BaseLayout` - Utilise `DynamicHeader`
- ✅ `CandidatLayout` - Utilise `DynamicHeader`
- ✅ `RecruteurLayout` - Utilise `DynamicHeader`
- ✅ `PrestataireLayout` - Utilise `DynamicHeader`

## Avantages

1. **Cohérence** : Tous les layouts utilisent le même système de header
2. **Maintenance** : Un seul composant à modifier pour changer la logique
3. **Flexibilité** : Facile d'ajouter de nouveaux types d'utilisateurs
4. **UX** : L'utilisateur voit toujours le header approprié à son statut

## Test et débogage

### Composants de test

1. **`HeaderStatus`** : Affiche le statut actuel de l'utilisateur
2. **`UserTypeTester`** : Permet de simuler différents types d'utilisateurs

### Utilisation des composants de test

```javascript
import HeaderStatus from '../../components/HeaderStatus';
import UserTypeTester from '../../components/UserTypeTester';

// Dans votre composant
<HeaderStatus />
<UserTypeTester />
```

## Structure des données utilisateur

Le système attend que l'objet utilisateur ait la structure suivante :

```javascript
{
  user_type: 'candidat' | 'recruteur' | 'prestataire',
  email: 'user@example.com',
  // ... autres propriétés
}
```

## Gestion des erreurs

- Si `user_type` est `undefined` ou `null`, le header public est affiché
- Si le type n'est pas reconnu, un avertissement est affiché dans la console
- Pendant le chargement, un header temporaire avec animation est affiché

## Extensibilité

Pour ajouter un nouveau type d'utilisateur :

1. Créer le nouveau header (ex: `AdminHeader`)
2. L'importer dans `DynamicHeader`
3. Ajouter le cas dans le switch :

```javascript
case 'admin':
  return <AdminHeader />;
```

## Dépendances

- React Context API (AuthContext)
- React Router pour la navigation
- Tailwind CSS pour le styling

## Notes importantes

- Le système fonctionne uniquement si l'utilisateur est connecté
- Les headers sont affichés de manière conditionnelle selon le statut
- Le composant `DynamicHeader` doit être utilisé dans tous les layouts
- Les composants de test sont optionnels et peuvent être supprimés en production 