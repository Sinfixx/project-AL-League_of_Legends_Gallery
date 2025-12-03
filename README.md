# Project AL - League of Legends Gallery (Tour of Heroes)

Application web développée avec Angular 20 permettant la gestion complète de héros, d'armes et de matchups dans l'univers de League of Legends.

## Table des matières

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture technique](#architecture-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Commandes disponibles](#commandes-disponibles)
- [Structure du projet](#structure-du-projet)
- [Système d'authentification](#système-dauthentification)
- [Services et Guards](#services-et-guards)
- [Configuration Firebase](#configuration-firebase)
- [Développement](#développement)

## Présentation

Tour of Heroes est une application Angular réalisée dans le cadre de la ressource R5.05 permettant de gérer une collection de héros et leurs armes associées. L'application offre une interface pour consulter, créer, modifier et supprimer des entités, ainsi que pour analyser les matchups entre différents héros.
Elle a été faite sur le thème du jeu League of Legends de Riot Games.

## Fonctionnalités

### Gestion des héros

- Consultation de la liste complète des héros avec leurs statistiques
- Affichage détaillé de chaque héros (nom, points de vie, force, arme équipée)
- Création de nouveaux héros avec validation des données
- Modification des héros existants
- Suppression de héros
- Recherche et filtrage des héros

### Gestion des armes

- Liste des armes disponibles avec leurs caractéristiques
- Détails d'une arme (nom, type, dégâts, portée)
- Création de nouvelles armes
- Modification des armes existantes
- Suppression d'armes
- Association des armes aux héros

### Analyse des matchups

- Consultation des matchups entre héros à la manière des analyses sur League of Legends
- Calcul automatique des avantages et désavantages
- Analyse basée sur les statistiques
- Visualisation des résultats de combats

### Dashboard

- Vue d'ensemble de la galerie des champions
- Accès rapide aux héros principaux
- Statistiques générales de l'application

### Import de données

- Import de données JSON pour peupler la base de données
- Validation des données importées
- Gestion des erreurs d'import

### Système de messages

- Affichage des notifications utilisateur
- Messages de succès, d'erreur et d'information
- Historique des actions effectuées

## Architecture technique

### Technologies principales

- **Angular 20.3.2** - Framework front-end
- **TypeScript 5.9.2** - Langage de programmation
- **Firebase** - Backend as a Service
  - Firebase Authentication - Gestion des utilisateurs
  - Firebase Firestore - Base de données NoSQL
- **RxJS 7.8** - Programmation réactive
- **Angular Router** - Navigation et routing
- **Angular Forms** - Gestion des formulaires

### Bibliothèques d'authentification

- **@auth0/angular-jwt 5.2.0** - Gestion des tokens JWT
- **jwt-decode 4.0.0** - Décodage des tokens JWT

### Outils de développement

- **Angular CLI 20.3.3** - Interface en ligne de commande
- **Karma** - Test runner
- **Jasmine** - Framework de tests unitaires
- **Prettier** - Formatage du code

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** (version 9 ou supérieure)
- **Angular CLI** (version 20 ou supérieure)

Pour installer Angular CLI globalement :

```bash
npm install -g @angular/cli
```

## Installation

1. Clonez le dépôt :

```bash
git clone https://github.com/Sinfixx/torrejoc-ToH2025.git
cd torrejoc-ToH2025
```

2. Installez les dépendances :

```bash
npm install
```

3. Vérifiez que Firebase est correctement configuré dans `src/app/app.config.ts`

## Commandes disponibles

### Serveur de développement

Démarrer le serveur de développement local :

```bash
npm start
```

ou

```bash
ng serve
```

L'application sera accessible à l'adresse `http://localhost:4200/`. Les modifications du code source entraîneront automatiquement un rechargement de l'application.

### Build de production

Compiler le projet pour la production :

```bash
npm run build
```

ou

```bash
ng build
```

Les fichiers compilés seront générés dans le répertoire `dist/`. Le build de production optimise automatiquement l'application pour les performances.

### Mode watch

Compiler le projet en mode surveillance (développement) :

```bash
npm run watch
```

ou

```bash
ng build --watch --configuration development
```

### Tests unitaires

Exécuter les tests unitaires avec Karma :

```bash
npm test
```

ou

```bash
ng test
```

### Génération de code

Générer un nouveau composant :

```bash
ng generate component nom-du-composant
```

Générer un nouveau service :

```bash
ng generate service nom-du-service
```

Pour voir toutes les options de génération disponibles :

```bash
ng generate --help
```

## Structure du projet

```
torrejoc-ToH2025/
├── src/
│   ├── app/
│   │   ├── components/           # Composants de l'application
│   │   │   ├── dashboard/        # Page d'accueil
│   │   │   ├── heroes/           # Liste des héros
│   │   │   ├── hero-detail/      # Détails d'un héros
│   │   │   ├── hero-new/         # Création d'un héros
│   │   │   ├── weapons/          # Liste des armes
│   │   │   ├── weapon-detail/    # Détails d'une arme
│   │   │   ├── weapon-new/       # Création d'une arme
│   │   │   ├── matchup/          # Analyse des matchups
│   │   │   ├── import/           # Import de données
│   │   │   ├── login/            # Page de connexion
│   │   │   ├── sign/             # Page d'inscription
│   │   │   ├── forbidden/        # Page d'accès refusé
│   │   │   └── messages/         # Composant de messages
│   │   │
│   │   ├── services/             # Services de l'application
│   │   │   ├── auth.ts           # Service d'authentification
│   │   │   ├── hero.ts           # Service de gestion des héros
│   │   │   ├── weapons.ts        # Service de gestion des armes
│   │   │   ├── matchup.ts        # Service de matchups
│   │   │   ├── message.ts        # Service de messages
│   │   │   └── jwt.interceptor.ts # Intercepteur HTTP JWT
│   │   │
│   │   ├── guards/               # Guards de routing
│   │   │   └── auth.guard.ts     # Guard d'authentification
│   │   │
│   │   ├── data/                 # Interfaces et données mock
│   │   │   ├── heroInterface.ts  # Interface Hero
│   │   │   ├── weaponInterface.ts # Interface Weapon
│   │   │   ├── matchupInterface.ts # Interface Matchup
│   │   │   ├── mock-heroes.ts    # Données de test héros
│   │   │   └── mock-weapons.ts   # Données de test armes
│   │   │
│   │   ├── app.config.ts         # Configuration de l'application
│   │   ├── app.routes.ts         # Configuration du routing
│   │   ├── app.ts                # Composant principal
│   │   ├── app.html              # Template principal
│   │   └── app.css               # Styles globaux
│   │
│   ├── environments/             # Configuration des environnements
│   │   ├── environment.ts        # Environnement de production
│   │   └── environment.development.ts # Environnement de développement
│   │
│   ├── index.html                # Point d'entrée HTML
│   ├── main.ts                   # Point d'entrée TypeScript
│   └── styles.css                # Styles globaux
│
├── public/                       # Ressources statiques
├── angular.json                  # Configuration Angular
├── package.json                  # Dépendances npm
├── tsconfig.json                 # Configuration TypeScript
└── README.md                     # Ce fichier
```

## Système d'authentification

L'application intègre un système d'authentification complet basé sur Firebase Authentication avec les composants suivants :

### Service d'authentification (`auth.ts`)

Le service d'authentification centralise toute la logique de gestion des utilisateurs :

- **Inscription** : création de nouveaux comptes via email et mot de passe
- **Connexion** : authentification des utilisateurs existants
- **Déconnexion** : fermeture de session et nettoyage du token
- **Gestion du token JWT** : sauvegarde, récupération et validation du token dans localStorage
- **Validation du token** : vérification de l'expiration et de la validité
- **Décodage du token** : extraction des informations utilisateur
- **Gestion d'état** : Observable RxJS pour suivre l'état de connexion en temps réel
- **Gestion des erreurs** : messages d'erreur Firebase traduits en français

### Fonctionnalités du service

```typescript
// Méthodes principales
register(email: string, password: string): Promise<UserCredential>
login(email: string, password: string): Promise<boolean>
logout(): Promise<void>
isAuthenticated(): boolean
isTokenValid(): boolean
getToken(): string | null
getUsername(): string | null
```

### Guard d'authentification (`auth.guard.ts`)

Le guard protège les routes de l'application en vérifiant l'authentification de l'utilisateur :

- Bloque l'accès aux routes protégées pour les utilisateurs non connectés
- Vérifie la présence d'un token valide en localStorage
- Gère l'initialisation Firebase (permet l'accès si un token valide existe même si Firebase n'est pas encore initialisé)
- Redirige vers `/forbidden` en cas d'accès non autorisé
- Permet la navigation directe via URL pour les utilisateurs authentifiés

### Intercepteur JWT (`jwt.interceptor.ts`)

L'intercepteur HTTP ajoute automatiquement le token d'authentification à toutes les requêtes sortantes :

- Récupère le token depuis localStorage
- Ajoute le header `Authorization: Bearer <token>` aux requêtes HTTP
- Exclut les requêtes vers les routes publiques (login, sign)
- Fonctionne de manière transparente pour tous les services

### Pages d'authentification

#### Page de connexion (`/login`)

- Formulaire avec email et mot de passe
- Validation côté client
- Messages d'erreur en français
- Redirection automatique après connexion
- Lien vers la page d'inscription

#### Page d'inscription (`/sign`)

- Formulaire avec email, mot de passe et confirmation
- Validation de format d'email
- Validation de force du mot de passe (minimum 6 caractères)
- Vérification de correspondance des mots de passe
- Messages d'erreur Firebase traduits
- Création automatique du compte dans Firebase
- Redirection après inscription réussie

#### Page d'accès refusé (`/forbidden`)

- Affichée lorsqu'un utilisateur non authentifié tente d'accéder à une route protégée
- Lien direct vers la page de connexion

### Flux d'authentification

1. L'utilisateur accède à `/login` ou `/sign`
2. Après soumission du formulaire, Firebase authentifie l'utilisateur
3. Un token JWT est généré et sauvegardé dans localStorage
4. L'utilisateur est redirigé vers le dashboard
5. Le guard vérifie l'authentification pour chaque navigation
6. L'intercepteur ajoute le token aux requêtes HTTP
7. À la déconnexion, le token est supprimé et l'utilisateur est redirigé vers `/login`

### Sécurité

- Les mots de passe doivent contenir au moins 6 caractères (exigence Firebase)
- Les tokens JWT sont vérifiés côté client avant chaque navigation
- Les tokens expirés sont automatiquement détectés
- Les sessions sont persistantes grâce au localStorage
- L'état d'authentification est synchronisé en temps réel avec Firebase

## Services et Guards

### Services principaux

#### HeroService (`hero.ts`)

Gère toutes les opérations CRUD sur les héros :

- `getHeroes()` : récupère la liste des héros
- `getHero(id)` : récupère un héros spécifique
- `addHero(hero)` : crée un nouveau héros
- `updateHero(hero)` : met à jour un héros existant
- `deleteHero(id)` : supprime un héros

#### WeaponsService (`weapons.ts`)

Gère les opérations sur les armes :

- `getWeapons()` : récupère la liste des armes
- `getWeapon(id)` : récupère une arme spécifique
- `addWeapon(weapon)` : crée une nouvelle arme
- `updateWeapon(weapon)` : met à jour une arme
- `deleteWeapon(id)` : supprime une arme

#### MatchupService (`matchup.ts`)

Calcule et gère les matchups entre héros :

- Analyse des avantages/désavantages
- Calcul des scores de combat
- Comparaison des statistiques

#### MessageService (`message.ts`)

Affiche les notifications utilisateur :

- `add(message)` : ajoute un message
- `clear()` : efface tous les messages
- Stockage de l'historique des actions

### Guards

#### AuthGuard (`auth.guard.ts`)

Protège toutes les routes nécessitant une authentification :

- Vérifie la présence d'un utilisateur connecté
- Vérifie la validité du token JWT
- Autorise l'accès même pendant l'initialisation Firebase (si token valide)
- Redirige vers `/forbidden` si non authentifié

## Configuration Firebase

L'application utilise Firebase pour l'authentification et le stockage des données. La configuration est centralisée dans `app.config.ts` :

```typescript
provideFirebaseApp(() =>
  initializeApp({
    projectId: 'torrejoctoh2025',
    appId: '1:1071901123515:web:df39958c34e33111dd1a9e',
    storageBucket: 'torrejoctoh2025.firebasestorage.app',
    apiKey: 'AIzaSyDtoOf67K8VlcHQhjYVQlV_t8OSVHHAFVY',
    authDomain: 'torrejoctoh2025.firebaseapp.com',
    messagingSenderId: '1071901123515',
  })
),
  provideFirestore(() => getFirestore()),
  provideAuth(() => getAuth());
```

### Services Firebase utilisés

- **Firebase Authentication** : gestion des utilisateurs avec email/mot de passe
- **Firebase Firestore** : base de données NoSQL pour stocker les héros et armes

## Développement

### Routing

L'application utilise le système de routing Angular avec protection des routes :

**Routes publiques :**

- `/login` : connexion
- `/sign` : inscription
- `/forbidden` : accès refusé

**Routes protégées (nécessitent une authentification) :**

- `/dashboard` : page d'accueil
- `/heroes` : liste des héros
- `/detail/:id` : détails d'un héros
- `/heroes/new` : création d'un héros
- `/weapons` : liste des armes
- `/weapon/:id` : détails d'une arme
- `/weapons/new` : création d'une arme
- `/matchup` : analyse des matchups
- `/import` : import de données

### Conventions de code

Le projet utilise Prettier pour le formatage automatique du code :

- Largeur de ligne maximale : 100 caractères
- Guillemets simples pour JavaScript/TypeScript
- Parser Angular pour les templates HTML

### Architecture modulaire

L'application suit une architecture modulaire avec :

- Composants standalone (Angular 20+)
- Services injectables avec `providedIn: 'root'`
- Guards fonctionnels (`CanActivateFn`)
- Intercepteurs HTTP fonctionnels
- Séparation claire des responsabilités (présentation, logique métier, données)

### Styles

- Système de design cohérent avec palette de couleurs personnalisée
- Thème sombre moderne
- Animations et transitions fluides
- Design responsive (mobile, tablette, desktop)
- Composants réutilisables

### Bonnes pratiques implémentées

- Programmation réactive avec RxJS
- Typage fort avec TypeScript
- Gestion centralisée de l'état d'authentification
- Gestion des erreurs avec messages utilisateur
- Validation des formulaires
- Lazy loading potentiel (structure préparée)
- Tests unitaires configurés

## Ressources complémentaires

- [Documentation Angular](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [Firebase Documentation](https://firebase.google.com/docs)
- [RxJS Documentation](https://rxjs.dev)

## Auteur

Projet développé dans le cadre du module R5.05

## Licence

Cyrian Torrejon A21
Ce projet est à usage éducatif.
