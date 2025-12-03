import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import {
  Auth as FirebaseAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

interface DecodedToken {
  exp: number;
  email?: string;
  username?: string;
  roles?: string[];
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly TOKEN_KEY = 'auth_token';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router, private firebaseAuth: FirebaseAuth) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Écouter les changements d'état d'authentification
    onAuthStateChanged(this.firebaseAuth, (user) => {
      this.currentUserSubject.next(user);
      if (user) {
        // Sauvegarder le token Firebase
        user.getIdToken().then((token) => {
          this.saveToken(token);
        });
      } else {
        this.removeToken();
      }
    });
  }

  /**
   * Récupère l'utilisateur Firebase courant
   */
  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Inscription avec email et mot de passe
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Promise<UserCredential>
   */
  async register(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );
      return userCredential;
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Connexion avec email et mot de passe
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @returns Promise<boolean> - true si connexion réussie
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseAuth, email, password);

      // Obtenir le token Firebase
      const token = await userCredential.user.getIdToken();
      this.saveToken(token);

      return true;
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  async logout(): Promise<void> {
    try {
      await signOut(this.firebaseAuth);
      this.removeToken();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  /**
   * Sauvegarde le token dans le localStorage
   * @param token - Token JWT à sauvegarder
   */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Récupère le token depuis le localStorage
   * @returns string | null - Token ou null si non existant
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Supprime le token du localStorage
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Vérifie si le token est valide (non expiré)
   * @returns boolean - true si le token est valide
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return false;
      }

      // Vérifier si le token n'est pas expiré
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      return false;
    }
  }

  /**
   * Décode le token JWT
   * @param token - Token à décoder (optionnel, utilise le token courant par défaut)
   * @returns DecodedToken | null - Token décodé ou null
   */
  decodeToken(token?: string): DecodedToken | null {
    const tokenToUse = token || this.getToken();
    if (!tokenToUse) {
      return null;
    }

    try {
      return jwtDecode<DecodedToken>(tokenToUse);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * Récupère le nom d'utilisateur (email) depuis Firebase ou le token
   * @returns string | null - Email de l'utilisateur ou null
   */
  getUsername(): string | null {
    const user = this.currentUserValue;
    if (user) {
      return user.email;
    }
    const decoded = this.decodeToken();
    return decoded?.email || decoded?.username || null;
  }

  /**
   * Récupère les rôles de l'utilisateur
   * Par défaut, tous les utilisateurs ont le rôle 'user'
   * @returns string[] - Liste des rôles
   */
  getRoles(): string[] {
    return ['user'];
  }

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param role - Rôle à vérifier
   * @returns boolean - true si l'utilisateur a le rôle
   */
  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  /**
   * Vérifie si l'utilisateur a au moins un des rôles spécifiés
   * @param roles - Liste des rôles à vérifier
   * @returns boolean - true si l'utilisateur a au moins un des rôles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return roles.some((role) => userRoles.includes(role));
  }

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns boolean - true si connecté
   */
  isAuthenticated(): boolean {
    return this.currentUserValue !== null && this.isTokenValid();
  }

  /**
   * Gère les erreurs Firebase et retourne un message d'erreur approprié
   * @param error - Erreur Firebase
   * @returns Error - Erreur avec un message lisible
   */
  private handleAuthError(error: any): Error {
    let message = 'Une erreur est survenue';

    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'Cet email est déjà utilisé';
        break;
      case 'auth/invalid-email':
        message = 'Email invalide';
        break;
      case 'auth/operation-not-allowed':
        message = 'Opération non autorisée';
        break;
      case 'auth/weak-password':
        message = 'Le mot de passe est trop faible (minimum 6 caractères)';
        break;
      case 'auth/user-disabled':
        message = 'Ce compte a été désactivé';
        break;
      case 'auth/user-not-found':
        message = 'Aucun utilisateur trouvé avec cet email';
        break;
      case 'auth/wrong-password':
        message = 'Mot de passe incorrect';
        break;
      case 'auth/invalid-credential':
        message = 'Email ou mot de passe incorrect';
        break;
      case 'auth/too-many-requests':
        message = 'Trop de tentatives. Veuillez réessayer plus tard';
        break;
      default:
        message = error.message || 'Une erreur est survenue';
    }

    return new Error(message);
  }
}
