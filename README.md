# Destiny Jobs - Plateforme d'emploi React

Une plateforme moderne de recherche d'emploi et de services pour l'Afrique, construite avec React.

## 🚀 Fonctionnalités

- **Système de routage décentralisé** : Organisation modulaire des routes par type d'utilisateur
- **Layout responsive** : Interface adaptée à tous les appareils
- **Multi-types d'utilisateurs** : Candidats, Recruteurs, Prestataires
- **Paramètres personnalisés** : Interface de configuration spécifique à chaque type d'utilisateur
- **Design moderne** : Interface utilisateur moderne avec Tailwind CSS

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
├── hooks/              # Hooks personnalisés
├── layouts/            # Layouts de l'application
│   └── BaseLayout.jsx  # Layout principal avec header, sidebar et footer
├── pages/              # Pages de l'application
│   ├── candidat/       # Pages spécifiques aux candidats
│   ├── prestataire/    # Pages spécifiques aux prestataires
│   ├── public/         # Pages publiques
│   ├── recruteur/      # Pages spécifiques aux recruteurs
│   └── user/           # Pages utilisateur (auth, settings)
│       └── settings/   # Paramètres par type d'utilisateur
│           ├── Candidats.jsx
│           ├── Recruteur.jsx
│           └── Prestataire.jsx
├── routers/            # Système de routage décentralisé
│   ├── index.jsx       # Routeur principal
│   ├── authRoutes.jsx  # Routes d'authentification
│   ├── userRoutes.jsx  # Routes utilisateur
│   ├── candidatRoutes.jsx
│   ├── recruteurRoutes.jsx
│   ├── prestataireRoutes.jsx
│   └── publicRoutes.jsx
├── services/           # Services API
├── store/              # Gestion d'état (Redux/Zustand)
├── App.jsx             # Composant racine
├── main.jsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🛠️ Technologies utilisées

- **React 19** : Framework principal
- **React Router DOM 7** : Routage
- **Tailwind CSS** : Framework CSS
- **Font Awesome** : Icônes
- **Vite** : Build tool

## 🚀 Installation et démarrage

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd destiny-jobs-react
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

## 🎯 Système de routage

Le projet utilise un système de routage décentralisé organisé par type d'utilisateur :

### Routes publiques
- `/home` - Page d'accueil
- `/jobs` - Offres d'emploi
- `/formations` - Formations
- `/blog` - Blog
- `/about` - À propos
- `/contact` - Contact

### Routes d'authentification
- `/login` - Connexion
- `/signup` - Inscription générale
- `/signup/:type` - Inscription par type (candidat, recruteur, prestataire)
- `/reset-password` - Réinitialisation de mot de passe
- `/search-accounts` - Recherche de comptes

### Routes utilisateur
- `/settings` - Paramètres généraux
- `/settings/candidats` - Paramètres candidat
- `/settings/recruteur` - Paramètres recruteur
- `/settings/prestataire` - Paramètres prestataire

### Routes spécifiques par type
- `/candidat/*` - Pages candidat
- `/recruteur/*` - Pages recruteur
- `/prestataire/*` - Pages prestataire

## 🎨 Composants principaux

### BaseLayout
Layout principal qui inclut :
- Header avec navigation responsive
- Sidebar avec widgets
- Footer
- Gestion des menus mobiles

### Paramètres utilisateur
Chaque type d'utilisateur a ses propres paramètres :

#### Candidat
- Profil personnel
- CV & Documents
- Préférences de recherche
- Notifications
- Sécurité

#### Recruteur
- Informations entreprise
- Profil personnel
- Facturation
- Notifications
- Sécurité

#### Prestataire
- Services proposés
- Profil professionnel
- Tarification
- Notifications
- Sécurité

## 🔧 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la build de production
- `npm run lint` - Lance le linter ESLint

## 📱 Responsive Design

L'application est entièrement responsive avec :
- Design mobile-first
- Navigation adaptative
- Menus hamburger pour mobile
- Grilles flexibles
- Touch targets optimisés

## 🎯 Prochaines étapes

- [ ] Intégration d'une API backend
- [ ] Système d'authentification complet
- [ ] Gestion d'état avec Redux/Zustand
- [ ] Tests unitaires et d'intégration
- [ ] Optimisation des performances
- [ ] PWA (Progressive Web App)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

- Email : contact@destinyjobs.careers
- Site web : https://destinyjobs.careers
# DS
