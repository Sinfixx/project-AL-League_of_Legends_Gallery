import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sign',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign.html',
  styleUrl: './sign.css',
})
export class Sign {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: Auth, private router: Router) {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    // Réinitialiser les messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validation basique
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Veuillez entrer une adresse email valide';
      return;
    }

    // Validation du mot de passe
    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    // Vérification de la correspondance des mots de passe
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;

    try {
      // Créer le compte avec Firebase
      await this.authService.register(this.email, this.password);

      // Afficher un message de succès
      this.successMessage = 'Compte créé avec succès ! Redirection...';

      // Rediriger vers le dashboard après 1.5 secondes
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500);
    } catch (error: any) {
      this.errorMessage = error.message || "Une erreur est survenue lors de l'inscription";
      console.error("Erreur d'inscription:", error);
    } finally {
      this.isLoading = false;
    }
  }
}
