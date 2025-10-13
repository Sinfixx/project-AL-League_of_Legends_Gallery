# 📚 GUIDE DE RÉVISION ANGULAR - Tour of Heroes

> **Projet :** torrejoc-ToH2025  
> **Framework :** Angular 20+ (Standalone Components)  
> **Base de données :** Firebase Firestore  
> **Date :** Octobre 2025

---

## 🎯 Table des Matières

1. [Architecture Angular Moderne](#1️⃣-architecture-angular-moderne)
2. [Components & Templates](#2️⃣-components--templates)
3. [Services & Dependency Injection](#3️⃣-services--dependency-injection)
4. [Routing](#4️⃣-routing)
5. [Formulaires Réactifs](#5️⃣-formulaires-réactifs-reactive-forms)
6. [Observables & RxJS](#6️⃣-observables--rxjs)
7. [Firebase & Firestore](#7️⃣-firebase--firestore)
8. [Bonnes Pratiques](#8️⃣-bonnes-pratiques)
9. [Checklist pour le Contrôle](#🎯-checklist-pour-le-contrôle)
10. [Exemples d'Exercices](#📖-exemples-dexercices-types)

---

## 1️⃣ ARCHITECTURE ANGULAR MODERNE

### Concepts Clés

Votre projet utilise l'architecture **standalone** (Angular 14+), qui élimine le besoin de NgModules traditionnels.

### Fichier principal `main.ts`

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
```

**Points importants :**
- `bootstrapApplication()` lance l'application sans module
- Toute la configuration est centralisée dans `appConfig`
- Plus simple et plus moderne que l'approche NgModule

---

### Configuration `app.config.ts`

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),                    // ✅ Configuration du routing
    provideFirebaseApp(() => initializeApp({...})), // ✅ Firebase
    provideFirestore(() => getFirestore()),   // ✅ Firestore
  ],
};
```

**🎓 À retenir pour l'examen :**
- Les `providers` remplacent les imports des modules NgModule
- Chaque fonctionnalité (routing, Firebase, etc.) est configurée via des fonctions `provide*`
- Configuration centralisée et type-safe

---

## 2️⃣ COMPONENTS & TEMPLATES

### A. Anatomie d'un Component

**Exemple : `app.ts` (Root Component)**

```typescript
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Messages } from './components/messages/messages';

@Component({
  selector: 'app-root',                    // ✅ Tag HTML personnalisé
  imports: [RouterOutlet, RouterLink, Messages], // ✅ Imports standalone
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = 'Gallerie des Champions'; // ✅ Propriété accessible au template
}
```

**🎓 Points clés :**
1. **`selector`** : Définit le nom du tag HTML (`<app-root>`)
2. **`imports`** : Liste des components/directives nécessaires (mode standalone uniquement)
3. **`templateUrl` / `styleUrl`** : Fichiers externes pour le HTML et CSS
4. **Propriétés `protected/public`** : Accessibles dans le template HTML

---

### B. Directives Structurelles

#### Syntaxe Classique (Angular < 17)

**Exemple dans `heroes.html` :**

```html
<ul class="heroes">
  <li *ngFor="let hero of heroes">         <!-- ✅ Boucle sur un tableau -->
    <a routerLink="/detail/{{ hero.id }}">
      <span class="badge">{{ hero.id }}</span> {{ hero.name }}
    </a>
  </li>
</ul>
```

**Directives importantes :**
- **`*ngFor`** : Itération sur un tableau
- **`*ngIf`** : Affichage conditionnel
- **`*ngSwitch`** : Conditions multiples

---

#### Nouvelle Syntaxe (Angular 17+)

**Exemple moderne dans `hero-detail.html` :**

```html
@if (hero) {                              <!-- ✅ Nouvelle syntaxe plus claire -->
  <div class="hero-detail">
    <h2>{{ hero.name }} Details</h2>
  </div>
}

@if (selectedWeapon) {
  <div class="weapon-equipped">
    <span>🗡️ Arme équipée:</span> {{ selectedWeapon.name }}
  </div>
}
```

**Avantages :**
- Syntaxe plus proche de TypeScript
- Plus lisible
- Meilleure performance

---

### C. Property Binding & Event Binding

**Exemple de formulaire dans `hero-detail.html` :**

```html
<select 
  id="weapon" 
  formControlName="weapon"                    <!-- ✅ Reactive Form binding -->
  (change)="onWeaponChange()"                 <!-- ✅ Event binding -->
  [class.error]="!canEquipSelectedWeapon()"   <!-- ✅ Class binding conditionnel -->
  [disabled]="!hero"                          <!-- ✅ Property binding -->
>
  <option value="">Aucune arme</option>
  <option 
    *ngFor="let weapon of weapons" 
    [value]="weapon.id"
    [disabled]="!heroService.canEquipWeapon(hero, weapon)"
  >
    {{ weapon.name }}
  </option>
</select>
```

**Types de binding :**

| Type | Syntaxe | Exemple | Description |
|------|---------|---------|-------------|
| **Interpolation** | `{{ }}` | `{{ hero.name }}` | Affiche une valeur |
| **Property binding** | `[property]` | `[value]="hero.id"` | Lie une propriété |
| **Event binding** | `(event)` | `(click)="save()"` | Écoute un événement |
| **Two-way binding** | `[(ngModel)]` | `[(ngModel)]="hero.name"` | Binding bidirectionnel |
| **Class binding** | `[class.name]` | `[class.active]="isActive"` | Classe conditionnelle |
| **Style binding** | `[style.property]` | `[style.color]="color"` | Style dynamique |

---

### D. Template de Navigation

**Exemple : `app.html`**

```html
<h1>{{ title }}</h1>
<nav>
  <a routerLink="/dashboard">Hall des légendes</a>
  <a routerLink="/heroes">Champions</a>
  <a routerLink="/weapons">Armes</a>
</nav>
<router-outlet></router-outlet>           <!-- ✅ Affiche le component de la route active -->
<app-messages></app-messages>
```

**Points clés :**
- `routerLink` : Navigation déclarative
- `router-outlet` : Placeholder pour les components routés
- Les components custom (`<app-messages>`) sont utilisables directement

---

## 3️⃣ SERVICES & DEPENDENCY INJECTION

### A. Création d'un Service

**Exemple : `message.service.ts`**

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',                     // ✅ Singleton global automatique
})
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
```

**🎓 À retenir :**
- `@Injectable({ providedIn: 'root' })` : Le service est un singleton partagé dans toute l'app
- Pas besoin de le déclarer dans les providers (enregistrement automatique)
- Un seul exemplaire existe, toutes les injections partagent la même instance

---

### B. Injection dans un Component

**Exemple : `heroes.ts`**

```typescript
import { Component, OnInit } from '@angular/core';
import { HeroInterface } from '../../../data/heroInterface';
import { HeroService } from '../../services/hero';
import { MessageService } from '../../services/message';

@Component({
  selector: 'app-heroes',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css',
})
export class Heroes implements OnInit {
  heroes: HeroInterface[] = [];
  selectedHero?: HeroInterface;

  // ✅ Injection par le constructeur
  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  onSelect(hero: HeroInterface): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe((heroes) => (this.heroes = heroes));
  }

  ngOnInit(): void {
    this.getHeroes();                     // ✅ Appelé après l'initialisation
  }
}
```

---

### C. Cycle de Vie des Components

**Hooks importants :**

| Hook | Quand ? | Usage |
|------|---------|-------|
| **`ngOnInit()`** | Après le constructeur, une seule fois | Initialisation, appels API |
| **`ngOnDestroy()`** | Avant la destruction du component | Nettoyage, unsubscribe |
| **`ngOnChanges()`** | À chaque changement d'`@Input()` | Réagir aux changements |
| **`ngAfterViewInit()`** | Après l'initialisation de la vue | Manipuler le DOM |

**Exemple d'utilisation :**

```typescript
export class HeroDetail implements OnInit, OnDestroy {
  private formSubscription?: Subscription;

  ngOnInit(): void {
    this.loadData();
    this.formSubscription = this.heroForm.valueChanges.subscribe(...);
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();  // ✅ IMPORTANT : Évite les fuites mémoire
    }
  }
}
```

---

## 4️⃣ ROUTING

### A. Configuration des Routes

**Exemple : `app.routes.ts`**

```typescript
import { Routes } from '@angular/router';
import { Heroes } from './components/heroes/heroes';
import { Dashboard } from './components/dashboard/dashboard';
import { HeroDetail } from './components/hero-detail/hero-detail';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // ✅ Redirection par défaut
  { path: 'dashboard', component: Dashboard },
  { path: 'heroes', component: Heroes },
  { path: 'detail/:id', component: HeroDetail },            // ✅ Route avec paramètre
  { path: 'weapons', component: Weapons },
  { path: 'weapon/:id', component: WeaponDetail },
];
```

**🎓 Points clés :**
- **`path: ''`** : Route par défaut (racine)
- **`redirectTo`** : Redirige vers une autre route
- **`pathMatch: 'full'`** : La correspondance doit être exacte
- **`:id`** : Paramètre dynamique (accessible via `ActivatedRoute`)

---

### B. Navigation

#### 1. Navigation Déclarative (Template)

```html
<nav>
  <a routerLink="/dashboard">Hall des légendes</a>
  <a routerLink="/heroes">Champions</a>
  <a routerLink="/detail/{{ hero.id }}">Voir {{ hero.name }}</a>
</nav>
```

---

#### 2. Navigation Programmatique (TypeScript)

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

goToHero(id: number): void {
  this.router.navigate(['/detail', id]);
}

goBack(): void {
  this.location.back();                   // ✅ Retour en arrière dans l'historique
}
```

---

### C. Récupération des Paramètres de Route

**Exemple : `hero-detail.ts`**

```typescript
import { ActivatedRoute } from '@angular/router';

constructor(private route: ActivatedRoute) {}

ngOnInit(): void {
  // Méthode 1 : Snapshot (valeur actuelle, non-réactive)
  const id = String(this.route.snapshot.paramMap.get('id'));
  
  // Méthode 2 : Observable (réactif aux changements)
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    this.loadHero(id);
  });
}
```

**Quand utiliser quoi ?**
- **Snapshot** : Si le component est détruit/recréé à chaque navigation
- **Observable** : Si le component reste actif (paramètre change sans rechargement)

---

## 5️⃣ FORMULAIRES RÉACTIFS (Reactive Forms)

### A. Configuration du FormGroup

**Exemple : `hero-detail.ts`**

```typescript
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

export class HeroDetail implements OnInit {
  heroForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm(): void {
    this.heroForm = this.fb.group(
      {
        id: [{ value: 0, disabled: true }],               // ✅ Champ désactivé
        name: ['', [Validators.required, Validators.minLength(2)]], // ✅ Validateurs multiples
        attaque: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        esquive: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        degats: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        pv: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        weapon: [''],
      },
      { validators: totalPointsValidator }               // ✅ Validateur custom global
    );
  }
}
```

**🎓 Points clés :**
- **`FormBuilder`** : Service qui simplifie la création de formulaires
- **Syntaxe** : `[valeurInitiale, [validateurs], [validateursAsync]]`
- **Validateurs intégrés** : `required`, `minLength`, `min`, `max`, `email`, `pattern`
- **Validateurs au niveau groupe** : Option `{ validators: ... }`

---

### B. Validateurs Intégrés

| Validateur | Usage | Exemple |
|------------|-------|---------|
| `Validators.required` | Champ obligatoire | `['', Validators.required]` |
| `Validators.minLength(n)` | Longueur min | `['', Validators.minLength(3)]` |
| `Validators.maxLength(n)` | Longueur max | `['', Validators.maxLength(50)]` |
| `Validators.min(n)` | Valeur numérique min | `[0, Validators.min(1)]` |
| `Validators.max(n)` | Valeur numérique max | `[100, Validators.max(40)]` |
| `Validators.email` | Format email | `['', Validators.email]` |
| `Validators.pattern(regex)` | Expression régulière | `['', Validators.pattern(/^\d+$/)]` |

---

### C. Validateur Personnalisé

**Exemple de validateur de groupe dans votre projet :**

```typescript
// Validator personnalisé pour la somme totale
function totalPointsValidator(control: any) {
  if (!control.value) return null;

  const total =
    (control.value.attaque || 0) +
    (control.value.esquive || 0) +
    (control.value.degats || 0) +
    (control.value.pv || 0);

  return total > 40 
    ? { totalExceeded: { actual: total, max: 40 } }  // ✅ Retourne une erreur
    : null;                                           // ✅ null = valide
}
```

**Validateur de champ individuel :**

```typescript
function minPowerValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    return value < min 
      ? { minPower: { actual: value, required: min } }
      : null;
  };
}

// Usage
attaque: [1, [Validators.required, minPowerValidator(5)]]
```

---

### D. Utilisation dans le Template

```html
<form [formGroup]="heroForm" (ngSubmit)="onSubmit()">
  
  <!-- Input simple -->
  <input 
    type="text" 
    formControlName="name"
    [class.error]="heroForm.get('name')?.invalid && heroForm.get('name')?.touched"
  >
  
  <!-- Messages d'erreur -->
  @if (heroForm.get('name')?.hasError('required') && heroForm.get('name')?.touched) {
    <div class="error">Le nom est requis</div>
  }
  @if (heroForm.get('name')?.hasError('minlength')) {
    <div class="error">Minimum 2 caractères</div>
  }
  
  <!-- Select -->
  <select formControlName="weapon" (change)="onWeaponChange()">
    <option value="">Aucune arme</option>
    <option *ngFor="let weapon of weapons" [value]="weapon.id">
      {{ weapon.name }}
    </option>
  </select>
  
  <!-- Bouton de soumission -->
  <button type="submit" [disabled]="heroForm.invalid">
    Sauvegarder
  </button>
</form>
```

---

### E. Surveillance des Changements

```typescript
export class HeroDetail implements OnInit, OnDestroy {
  private formSubscription?: Subscription;

  createForm(): void {
    this.heroForm = this.fb.group({...});

    // ✅ Surveiller tous les changements du formulaire
    this.formSubscription = this.heroForm.valueChanges.subscribe(() => {
      this.onFormChange();
    });
    
    // ✅ Surveiller un champ spécifique
    this.heroForm.get('weapon')?.valueChanges.subscribe(weaponId => {
      this.updateWeapon(weaponId);
    });
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();  // ✅ IMPORTANT : Évite les fuites mémoire
  }
}
```

---

### F. Méthodes Utiles du FormGroup

```typescript
// Récupérer la valeur du formulaire
const formValue = this.heroForm.value;

// Définir la valeur complète (remplace tout)
this.heroForm.setValue({
  id: 1,
  name: 'Superman',
  attaque: 10,
  // ... tous les champs obligatoires
});

// Mettre à jour partiellement
this.heroForm.patchValue({
  name: 'Batman',
  attaque: 8
});

// Réinitialiser le formulaire
this.heroForm.reset();

// Vérifier la validité
if (this.heroForm.valid) {
  this.save();
}

// Obtenir un contrôle spécifique
const nameControl = this.heroForm.get('name');

// Marquer tous les champs comme touchés (affiche les erreurs)
this.heroForm.markAllAsTouched();
```

---

## 6️⃣ OBSERVABLES & RxJS

### A. Concept de Base

Un **Observable** est un flux de données asynchrones. C'est comme une Promesse qui peut émettre plusieurs valeurs dans le temps.

**Exemple dans `hero.service.ts` :**

```typescript
import { Observable } from 'rxjs';

getHeroes(): Observable<HeroInterface[]> {
  const heroCollection = collection(this.firestore, 'heroes');
  return collectionData(heroCollection, { idField: 'id' }) as Observable<HeroInterface[]>;
}

getHero(id: string): Observable<HeroInterface> {
  const heroDocument = doc(this.firestore, 'heroes/' + id);
  return docData(heroDocument, { idField: 'id' }) as Observable<HeroInterface>;
}
```

**Utilisation dans le Component :**

```typescript
this.heroService.getHeroes().subscribe((heroes) => {
  this.heroes = heroes;                   // ✅ Mise à jour quand les données arrivent
});
```

---

### B. Opérateurs RxJS Essentiels

#### 1. `combineLatest` - Combiner plusieurs Observables

**Exemple dans `hero-detail.ts` :**

```typescript
import { combineLatest } from 'rxjs';

loadData(): void {
  const id = String(this.route.snapshot.paramMap.get('id'));

  // ✅ Attend que les 2 Observables émettent au moins une fois
  combineLatest([
    this.heroService.getHero(id),
    this.weaponService.getWeapons()
  ]).subscribe(([hero, weapons]) => {     // ✅ Destructuration du tableau de résultats
    this.hero = { ...hero };
    this.weapons = weapons;
    this.heroForm.patchValue(hero);
  });
}
```

**Quand utiliser ?**
- Charger plusieurs données en parallèle
- Attendre que plusieurs sources soient prêtes

---

#### 2. `map` - Transformer les données

```typescript
import { map } from 'rxjs/operators';

getTopHeroes(): Observable<HeroInterface[]> {
  return this.getHeroes().pipe(
    map(heroes => heroes.slice(0, 3))     // ✅ Ne garde que les 3 premiers
  );
}

getHeroNames(): Observable<string[]> {
  return this.getHeroes().pipe(
    map(heroes => heroes.map(h => h.name)) // ✅ Extrait juste les noms
  );
}
```

---

#### 3. `filter` - Filtrer les valeurs

```typescript
import { filter } from 'rxjs/operators';

getStrongHeroes(): Observable<HeroInterface[]> {
  return this.getHeroes().pipe(
    map(heroes => heroes.filter(h => h.attaque > 10))
  );
}
```

---

#### 4. `of()` - Créer un Observable synchrone

```typescript
import { of } from 'rxjs';

// Retourner une valeur immédiate sous forme d'Observable
getMockHeroes(): Observable<HeroInterface[]> {
  return of(MOCK_HEROES);
}

// Utile pour les tests ou les fallbacks
getHeroes(): Observable<HeroInterface[]> {
  if (this.isOffline) {
    return of(this.cachedHeroes);
  }
  return this.http.get<HeroInterface[]>('/api/heroes');
}
```

---

### C. Gestion des Erreurs

```typescript
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

getHeroes(): Observable<HeroInterface[]> {
  return this.http.get<HeroInterface[]>('/api/heroes').pipe(
    catchError(error => {
      console.error('Erreur lors du chargement des héros:', error);
      this.messageService.add('Erreur de chargement');
      return of([]);                      // ✅ Retourne un tableau vide en cas d'erreur
    })
  );
}
```

---

### D. Unsubscribe - Éviter les Fuites Mémoire

**Méthode 1 : Unsubscribe manuel**

```typescript
export class HeroDetail implements OnDestroy {
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.heroService.getHero(id).subscribe(...);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();     // ✅ OBLIGATOIRE
  }
}
```

**Méthode 2 : Async pipe (automatique)**

```html
<!-- Le pipe async gère automatiquement le subscribe/unsubscribe -->
<div *ngFor="let hero of heroes$ | async">
  {{ hero.name }}
</div>
```

```typescript
export class Heroes {
  heroes$: Observable<HeroInterface[]>;

  ngOnInit(): void {
    this.heroes$ = this.heroService.getHeroes(); // Pas de subscribe !
  }
}
```

---

## 7️⃣ FIREBASE & FIRESTORE

### A. Configuration

**Dans `app.config.ts` :**

```typescript
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
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
  ],
};
```

---

### B. Structure du Service Firestore

**Exemple : `hero.service.ts`**

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private static url = 'heroes';          // ✅ Nom de la collection

  constructor(private firestore: Firestore) {}
}
```

---

### C. Opérations CRUD

#### 1. **READ - Lecture**

**a) Lire toute une collection**

```typescript
getHeroes(): Observable<HeroInterface[]> {
  const heroCollection = collection(this.firestore, HeroService.url);
  
  return collectionData(heroCollection, { 
    idField: 'id'                         // ✅ Ajoute l'ID du document dans l'objet
  }) as Observable<HeroInterface[]>;
}
```

**b) Lire un document spécifique**

```typescript
getHero(id: string): Observable<HeroInterface> {
  const heroDocument = doc(this.firestore, `${HeroService.url}/${id}`);
  
  return docData(heroDocument, { 
    idField: 'id' 
  }) as Observable<HeroInterface>;
}
```

---

#### 2. **CREATE - Création**

```typescript
addHero(hero: HeroInterface): Promise<void> {
  // Créer une référence de document avec un ID spécifique
  const heroDoc = doc(this.firestore, HeroService.url, hero.id.toString());

  // Créer le document avec setDoc
  return setDoc(heroDoc, {
    name: hero.name,
    attaque: hero.attaque,
    esquive: hero.esquive,
    degats: hero.degats,
    pv: hero.pv,
    weapon: hero.weapon || null,
  }).then(() => {
    this.messageService.add(`HeroService: added hero id=${hero.id}`);
  });
}
```

**Alternative : ID automatique**

```typescript
addHero(hero: HeroInterface): Promise<any> {
  const heroCollection = collection(this.firestore, HeroService.url);
  
  // addDoc génère un ID automatique
  return addDoc(heroCollection, {
    name: hero.name,
    attaque: hero.attaque,
    // ...
  });
}
```

---

#### 3. **UPDATE - Mise à jour**

**a) Mise à jour complète**

```typescript
updateHero(hero: HeroInterface): void {
  const heroDocument = doc(this.firestore, `${HeroService.url}/${hero.id}`);
  
  const newHeroJSON = {
    name: hero.name,
    attaque: hero.attaque,
    esquive: hero.esquive,
    degats: hero.degats,
    pv: hero.pv,
    weapon: hero.weapon || null,
  };
  
  updateDoc(heroDocument, newHeroJSON);
}
```

**b) Mise à jour partielle**

```typescript
associateWeaponToHero(heroId: string, weaponId: string | null): Promise<void> {
  const heroDocument = doc(this.firestore, `${HeroService.url}/${heroId}`);

  return updateDoc(heroDocument, { 
    weapon: weaponId                      // ✅ Met à jour uniquement le champ weapon
  }).then(() => {
    this.messageService.add(`Associated weapon ${weaponId} to hero ${heroId}`);
  });
}
```

---

#### 4. **DELETE - Suppression**

```typescript
deleteHero(id: string): Promise<void> {
  const heroDocument = doc(this.firestore, `${HeroService.url}/${id}`);
  
  return deleteDoc(heroDocument);
}
```

---

### D. Méthodes Métier

En plus du CRUD, les services contiennent la logique métier :

```typescript
// Méthode pour valider si une arme peut être équipée
canEquipWeapon(hero: HeroInterface, weapon: WeaponInterface): boolean {
  const newAttaque = hero.attaque + weapon.attaque;
  const newEsquive = hero.esquive + weapon.esquive;
  const newDegats = hero.degats + weapon.degats;
  const newPv = hero.pv + weapon.pv;

  // Toutes les stats doivent rester >= 1
  return newAttaque >= 1 && newEsquive >= 1 && newDegats >= 1 && newPv >= 1;
}

// Méthode pour calculer les stats finales avec une arme
calculateFinalStats(hero: HeroInterface, weapon: WeaponInterface | null): HeroInterface {
  if (!weapon) return hero;

  return {
    ...hero,                              // ✅ Spread operator : copie toutes les propriétés
    attaque: hero.attaque + weapon.attaque,
    esquive: hero.esquive + weapon.esquive,
    degats: hero.degats + weapon.degats,
    pv: hero.pv + weapon.pv,
  };
}
```

---

## 8️⃣ BONNES PRATIQUES

### A. Interfaces TypeScript

**Exemple : `heroInterface.ts`**

```typescript
export interface HeroInterface {
  id: number;
  name: string;
  attaque: number;
  esquive: number;
  degats: number;
  pv: number;
  weapon?: string;                        // ✅ ? = Propriété optionnelle
}
```

**Exemple : `weaponInterface.ts`**

```typescript
export interface WeaponInterface {
  id: number;
  name: string;
  attaque: number;
  esquive: number;
  degats: number;
  pv: number;
}
```

**Pourquoi utiliser des interfaces ?**
- ✅ **Typage fort** : Détecte les erreurs à la compilation
- ✅ **Autocomplétion** : L'IDE suggère les propriétés
- ✅ **Documentation** : Structure claire des données
- ✅ **Refactoring** : Renommer facilement les propriétés
- ✅ **Maintenabilité** : Code plus lisible

---

### B. Gestion des Abonnements (Subscriptions)

**❌ MAUVAISE pratique (fuite mémoire)**

```typescript
export class Heroes implements OnInit {
  ngOnInit() {
    this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
    });
    // ⚠️ L'abonnement n'est jamais annulé !
  }
}
```

**✅ BONNE pratique**

```typescript
export class Heroes implements OnInit, OnDestroy {
  private subscription?: Subscription;

  ngOnInit() {
    this.subscription = this.heroService.getHeroes().subscribe(heroes => {
      this.heroes = heroes;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();     // ✅ Nettoyage obligatoire
  }
}
```

**✅ MEILLEURE pratique (async pipe)**

```typescript
export class Heroes implements OnInit {
  heroes$!: Observable<HeroInterface[]>;

  ngOnInit() {
    this.heroes$ = this.heroService.getHeroes();
  }
}
```

```html
<li *ngFor="let hero of heroes$ | async">
  {{ hero.name }}
</li>
```

---

### C. Architecture en Couches

```
📁 src/
  📁 data/              ← Interfaces & données mock
    heroInterface.ts
    weaponInterface.ts
    mock-heroes.ts
    
  📁 app/
    📁 components/      ← Logique UI (présentation)
      📁 heroes/
        heroes.ts
        heroes.html
        heroes.css
        
    📁 services/        ← Logique métier & accès aux données
      hero.ts
      message.ts
      weapons.ts
      
    📁 environments/    ← Configuration par environnement
      environment.ts
      environment.development.ts
```

**Principe de séparation des responsabilités :**
- **Components** : Affichage et interaction utilisateur
- **Services** : Logique métier et accès aux données
- **Interfaces** : Définition des structures de données

---

### D. Immutabilité avec le Spread Operator

**✅ Créer une copie plutôt que modifier l'original**

```typescript
loadData(): void {
  this.heroService.getHero(id).subscribe(hero => {
    this.hero = { ...hero };              // ✅ Copie de l'objet
    this.originalHero = { ...hero };      // ✅ Sauvegarde de l'original
  });
}

calculateFinalStats(hero: HeroInterface, weapon: WeaponInterface): HeroInterface {
  return {
    ...hero,                              // ✅ Copie toutes les propriétés
    attaque: hero.attaque + weapon.attaque, // ✅ Puis écrase celles qu'on veut modifier
    esquive: hero.esquive + weapon.esquive,
  };
}
```

**Pourquoi ?**
- Évite les modifications inattendues
- Facilite le débogage
- Compatible avec OnPush change detection

---

### E. Conventions de Nommage

| Type | Convention | Exemple |
|------|------------|---------|
| **Component** | PascalCase | `HeroDetail`, `Dashboard` |
| **Service** | PascalCase + "Service" | `HeroService`, `MessageService` |
| **Interface** | PascalCase + "Interface" | `HeroInterface`, `WeaponInterface` |
| **Observable** | camelCase + "$" | `heroes$`, `selectedHero$` |
| **Méthode** | camelCase (verbe) | `getHeroes()`, `deleteHero()` |
| **Propriété** | camelCase | `selectedHero`, `heroForm` |
| **Constante** | UPPER_SNAKE_CASE | `MAX_POINTS`, `API_URL` |

---

### F. Gestion des Erreurs

```typescript
getHeroes(): Observable<HeroInterface[]> {
  return this.http.get<HeroInterface[]>('/api/heroes').pipe(
    tap(() => this.log('fetched heroes')),
    catchError(this.handleError<HeroInterface[]>('getHeroes', []))
  );
}

private handleError<T>(operation = 'operation', result?: T) {
  return (error: any): Observable<T> => {
    console.error(`${operation} failed: ${error.message}`);
    this.messageService.add(`${operation} failed: ${error.message}`);
    return of(result as T);
  };
}
```

---

## 🎯 CHECKLIST POUR LE CONTRÔLE

### ✅ Je dois savoir :

#### **Components**
- [ ] Créer un component standalone avec `@Component`
- [ ] Utiliser `imports` pour importer d'autres components
- [ ] Comprendre `selector`, `templateUrl`, `styleUrl`
- [ ] Utiliser `*ngFor` et `*ngIf` (ou `@for`, `@if`)
- [ ] Faire du property binding `[property]="value"`
- [ ] Faire du event binding `(event)="method()"`
- [ ] Utiliser l'interpolation `{{ value }}`

#### **Services & Injection**
- [ ] Créer un service avec `@Injectable({ providedIn: 'root' })`
- [ ] Injecter un service via le `constructor()`
- [ ] Comprendre le cycle de vie : `ngOnInit()`, `ngOnDestroy()`

#### **Routing**
- [ ] Configurer des routes dans `Routes[]`
- [ ] Créer une route avec paramètre (`:id`)
- [ ] Utiliser `routerLink` dans le template
- [ ] Récupérer un paramètre avec `ActivatedRoute`
- [ ] Utiliser `<router-outlet>` pour afficher les routes

#### **Formulaires Réactifs**
- [ ] Créer un `FormGroup` avec `FormBuilder`
- [ ] Ajouter des validateurs (`required`, `min`, `max`, etc.)
- [ ] Créer un validateur personnalisé
- [ ] Lier le formulaire au template avec `[formGroup]` et `formControlName`
- [ ] Surveiller les changements avec `valueChanges`
- [ ] Se désabonner dans `ngOnDestroy()`

#### **Observables & RxJS**
- [ ] Comprendre ce qu'est un Observable
- [ ] Souscrire à un Observable avec `.subscribe()`
- [ ] Utiliser `combineLatest` pour combiner plusieurs Observables
- [ ] Utiliser `map` pour transformer des données
- [ ] Créer un Observable synchrone avec `of()`
- [ ] Gérer le unsubscribe (manuel ou async pipe)

#### **Firebase & Firestore**
- [ ] Lire une collection avec `collection()` et `collectionData()`
- [ ] Lire un document avec `doc()` et `docData()`
- [ ] Créer un document avec `setDoc()`
- [ ] Mettre à jour avec `updateDoc()`
- [ ] Supprimer avec `deleteDoc()`

#### **Bonnes Pratiques**
- [ ] Créer et utiliser des interfaces TypeScript
- [ ] Gérer les fuites mémoire (unsubscribe)
- [ ] Séparer la logique UI (component) et métier (service)
- [ ] Utiliser le spread operator pour l'immutabilité
- [ ] Respecter les conventions de nommage

---

## 📖 EXEMPLES D'EXERCICES TYPES

### **Exercice 1 : Créer un nouveau component "Statistiques"**

**Objectif :** Afficher le nombre total de héros et d'armes

```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroInterface } from '../../../data/heroInterface';
import { WeaponInterface } from '../../../data/weaponInterface';
import { HeroService } from '../../services/hero';
import { WeaponService } from '../../services/weapons';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  template: `
    <div class="stats-container">
      <h2>📊 Statistiques</h2>
      <div class="stat-item">
        <span>Total Héros:</span>
        <strong>{{ heroes.length }}</strong>
      </div>
      <div class="stat-item">
        <span>Total Armes:</span>
        <strong>{{ weapons.length }}</strong>
      </div>
      <div class="stat-item">
        <span>Puissance moyenne:</span>
        <strong>{{ calculateAveragePower() }}</strong>
      </div>
    </div>
  `,
  styles: [`
    .stats-container {
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .stat-item {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
  `]
})
export class Stats implements OnInit {
  heroes: HeroInterface[] = [];
  weapons: WeaponInterface[] = [];

  constructor(
    private heroService: HeroService,
    private weaponService: WeaponService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.heroService.getHeroes(),
      this.weaponService.getWeapons()
    ]).subscribe(([heroes, weapons]) => {
      this.heroes = heroes;
      this.weapons = weapons;
    });
  }

  calculateAveragePower(): number {
    if (this.heroes.length === 0) return 0;
    
    const totalPower = this.heroes.reduce((sum, hero) => 
      sum + hero.attaque + hero.degats, 0
    );
    
    return Math.round(totalPower / this.heroes.length);
  }
}
```

---

### **Exercice 2 : Ajouter une route pour les statistiques**

**1. Ajouter la route dans `app.routes.ts` :**

```typescript
import { Stats } from './components/stats/stats';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'heroes', component: Heroes },
  { path: 'detail/:id', component: HeroDetail },
  { path: 'stats', component: Stats },       // ✅ Nouvelle route
  { path: 'weapons', component: Weapons },
  { path: 'weapon/:id', component: WeaponDetail },
];
```

**2. Ajouter le lien dans `app.html` :**

```html
<nav>
  <a routerLink="/dashboard">Hall des légendes</a>
  <a routerLink="/heroes">Champions</a>
  <a routerLink="/weapons">Armes</a>
  <a routerLink="/stats">Statistiques</a>  <!-- ✅ Nouveau lien -->
</nav>
```

---

### **Exercice 3 : Créer un validateur custom pour la puissance minimale**

**Objectif :** Un héros doit avoir une puissance totale (attaque + dégâts) d'au moins 10

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validateur de puissance minimale
export function minPowerValidator(minPower: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const attaque = control.value.attaque || 0;
    const degats = control.value.degats || 0;
    const totalPower = attaque + degats;

    return totalPower < minPower 
      ? { 
          minPower: { 
            actual: totalPower, 
            required: minPower 
          } 
        }
      : null;
  };
}

// Utilisation dans le component
createForm(): void {
  this.heroForm = this.fb.group(
    {
      name: ['', Validators.required],
      attaque: [1, [Validators.required, Validators.min(1)]],
      degats: [1, [Validators.required, Validators.min(1)]],
      esquive: [1, Validators.required],
      pv: [1, Validators.required],
    },
    { 
      validators: [
        totalPointsValidator,
        minPowerValidator(10)             // ✅ Validateur custom
      ] 
    }
  );
}
```

**Affichage de l'erreur dans le template :**

```html
@if (heroForm.hasError('minPower')) {
  <div class="error">
    ⚠️ Puissance insuffisante : 
    {{ heroForm.getError('minPower').actual }} / 
    {{ heroForm.getError('minPower').required }}
  </div>
}
```

---

### **Exercice 4 : Filtrer les héros par puissance**

**Créer un service de filtrage :**

```typescript
import { Injectable } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { HeroService } from './hero';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeroFilterService {
  constructor(private heroService: HeroService) {}

  getStrongHeroes(minAttack: number): Observable<HeroInterface[]> {
    return this.heroService.getHeroes().pipe(
      map(heroes => heroes.filter(hero => hero.attaque >= minAttack))
    );
  }

  getTopHeroesByPower(limit: number): Observable<HeroInterface[]> {
    return this.heroService.getHeroes().pipe(
      map(heroes => {
        // Trier par puissance totale décroissante
        const sorted = heroes.sort((a, b) => {
          const powerA = a.attaque + a.degats;
          const powerB = b.attaque + b.degats;
          return powerB - powerA;
        });
        
        // Ne garder que les X premiers
        return sorted.slice(0, limit);
      })
    );
  }

  searchHeroesByName(searchTerm: string): Observable<HeroInterface[]> {
    return this.heroService.getHeroes().pipe(
      map(heroes => 
        heroes.filter(hero => 
          hero.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }
}
```

---

### **Exercice 5 : Ajouter un système de recherche**

**Component avec recherche :**

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HeroInterface } from '../../../data/heroInterface';
import { HeroFilterService } from '../../services/hero-filter';

@Component({
  selector: 'app-hero-search',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="search-container">
      <h3>🔍 Rechercher un héros</h3>
      <input 
        type="text" 
        [formControl]="searchControl"
        placeholder="Nom du héros..."
      >
      
      <div class="results">
        @if (searchResults.length > 0) {
          <ul>
            <li *ngFor="let hero of searchResults">
              {{ hero.name }} (ATQ: {{ hero.attaque }})
            </li>
          </ul>
        } @else {
          <p>Aucun résultat</p>
        }
      </div>
    </div>
  `,
})
export class HeroSearch implements OnInit {
  searchControl = new FormControl('');
  searchResults: HeroInterface[] = [];

  constructor(private filterService: HeroFilterService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),                  // ✅ Attend 300ms après la saisie
      distinctUntilChanged(),             // ✅ Ignore si la valeur n'a pas changé
      switchMap(term => 
        this.filterService.searchHeroesByName(term || '')
      )
    ).subscribe(results => {
      this.searchResults = results;
    });
  }
}
```

---

## 🏆 CONSEILS FINAUX POUR LE CONTRÔLE

### **1. Comprendre le flux de données**
```
Component → Service → Firebase → Observable → Component
    ↓         ↓          ↓           ↓           ↓
   UI      Logique    BDD      Async Stream   Affichage
```

### **2. Penser "réactif"**
- Tout est asynchrone avec Angular
- Toujours utiliser `.subscribe()` pour les Observables
- Penser en termes de flux de données, pas d'événements ponctuels

### **3. Nettoyer les ressources**
```typescript
// ✅ TOUJOURS unsubscribe dans ngOnDestroy
ngOnDestroy(): void {
  this.subscription?.unsubscribe();
}

// ✅ OU utiliser le async pipe (gestion automatique)
heroes$ | async
```

### **4. Typer avec TypeScript**
```typescript
// ❌ MAL
heroes: any[];

// ✅ BIEN
heroes: HeroInterface[];
```

### **5. Séparer les responsabilités**
- **Components** : Gérer l'affichage et les interactions utilisateur
- **Services** : Contenir la logique métier et les appels API
- **Interfaces** : Définir les structures de données

### **6. Utiliser les outils d'Angular**
- **FormBuilder** pour les formulaires
- **RouterLink** pour la navigation
- **Dependency Injection** pour les services
- **RxJS operators** pour manipuler les données

### **7. Connaître les hooks de cycle de vie**
```typescript
ngOnInit()      // Initialisation (appels API)
ngOnDestroy()   // Nettoyage (unsubscribe)
ngOnChanges()   // Réagir aux changements d'inputs
```

### **8. Maîtriser les validateurs**
```typescript
// Intégrés
Validators.required
Validators.min(1)
Validators.max(40)
Validators.minLength(2)
Validators.email

// Custom
function myValidator(control: AbstractControl): ValidationErrors | null {
  return isValid ? null : { error: { ... } };
}
```

---

## 📝 RÉSUMÉ DES POINTS ESSENTIELS

### **Architecture**
- ✅ Application standalone (pas de NgModule)
- ✅ Configuration dans `app.config.ts`
- ✅ Bootstrap avec `bootstrapApplication()`

### **Components**
- ✅ Décorateur `@Component` avec `selector`, `imports`, `templateUrl`
- ✅ Directives : `*ngFor`, `*ngIf`, `@if`, `@for`
- ✅ Bindings : `{{ }}`, `[]`, `()`, `[()]`

### **Services**
- ✅ `@Injectable({ providedIn: 'root' })`
- ✅ Injection via `constructor()`
- ✅ Singleton global automatique

### **Routing**
- ✅ Configuration dans `Routes[]`
- ✅ Paramètres dynamiques avec `:id`
- ✅ Navigation avec `routerLink` ou `Router.navigate()`
- ✅ Récupération avec `ActivatedRoute`

### **Formulaires**
- ✅ `FormBuilder` pour créer des `FormGroup`
- ✅ Validateurs intégrés et personnalisés
- ✅ Binding avec `[formGroup]` et `formControlName`
- ✅ Surveillance avec `valueChanges`

### **Observables**
- ✅ Flux asynchrone de données
- ✅ `.subscribe()` pour consommer
- ✅ Operators : `map`, `filter`, `combineLatest`
- ✅ Toujours `unsubscribe` ou utiliser `async pipe`

### **Firebase**
- ✅ `collection()` + `collectionData()` pour lire
- ✅ `doc()` + `docData()` pour un document
- ✅ `setDoc()` pour créer
- ✅ `updateDoc()` pour modifier
- ✅ `deleteDoc()` pour supprimer

---

## 🎓 BONNE CHANCE POUR VOTRE CONTRÔLE ! 🚀

**Derniers conseils :**
- Relisez votre propre code source
- Testez les exemples de ce guide
- Comprenez POURQUOI, pas seulement COMMENT
- Pratiquez en créant de petits exercices
- N'hésitez pas à consulter la documentation officielle d'Angular

**Ressources utiles :**
- [Documentation Angular](https://angular.dev/)
- [RxJS Documentation](https://rxjs.dev/)
- [Firebase Angular Documentation](https://github.com/angular/angularfire)

---

*Guide créé à partir du projet Tour of Heroes - Octobre 2025*
