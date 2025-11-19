import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeroInterface } from '../../../data/heroInterface';
import { HeroService } from '../../services/hero';
import { MessageService } from '../../services/message';

@Component({
  selector: 'app-hero-new',
  imports: [CommonModule, FormsModule],
  templateUrl: './hero-new.html',
  styleUrl: './hero-new.css',
})
export class HeroNew implements OnInit {
  hero: HeroInterface = {
    id: 0,
    name: '',
    attaque: 10,
    esquive: 10,
    degats: 10,
    pv: 10,
    weapon: undefined,
    data: '', // ID League of Legends
  };

  existingIds: number[] = [];
  isSubmitting: boolean = false;
  errorMessage: string = '';
  warningMessage: string = '';

  constructor(
    private heroService: HeroService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer tous les héros pour déterminer le prochain ID disponible
    this.heroService.getHeroes().subscribe((heroes) => {
      this.existingIds = heroes.map((h) => h.id);
      this.hero.id = this.getNextAvailableId();
    });
  }

  getNextAvailableId(): number {
    if (this.existingIds.length === 0) return 1;
    return Math.max(...this.existingIds) + 1;
  }

  // Calculer le total des statistiques
  getStatsTotal(): number {
    return this.hero.attaque + this.hero.esquive + this.hero.degats + this.hero.pv;
  }

  // Vérifier si le total des stats est valide
  isStatsTotalValid(): boolean {
    return this.getStatsTotal() <= 40;
  }

  validateHero(): boolean {
    this.errorMessage = '';

    if (!this.hero.name || this.hero.name.trim().length === 0) {
      this.errorMessage = 'Le nom du héros est requis.';
      return false;
    }

    if (this.hero.name.length < 2) {
      this.errorMessage = 'Le nom doit contenir au moins 2 caractères.';
      return false;
    }

    if (this.hero.attaque < 1) {
      this.errorMessage = "L'attaque doit être au minimum 1.";
      return false;
    }

    if (this.hero.esquive < 1) {
      this.errorMessage = "L'esquive doit être au minimum 1.";
      return false;
    }

    if (this.hero.degats < 1) {
      this.errorMessage = 'Les dégâts doivent être au minimum 1.';
      return false;
    }

    if (this.hero.pv < 1) {
      this.errorMessage = 'Les PV doivent être au minimum 1.';
      return false;
    }

    const total = this.getStatsTotal();
    if (total > 40) {
      this.errorMessage = `Le total des statistiques (${total}) ne doit pas dépasser 40.`;
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (!this.validateHero()) {
      return;
    }

    this.isSubmitting = true;

    this.heroService
      .addHero(this.hero)
      .then(() => {
        this.messageService.add(`Héros ${this.hero.name} créé avec succès !`);
        this.router.navigate(['/heroes']);
      })
      .catch((error) => {
        this.errorMessage = 'Erreur lors de la création du héros. Veuillez réessayer.';
        this.isSubmitting = false;
        console.error('Erreur:', error);
      });
  }

  onCancel(): void {
    this.router.navigate(['/heroes']);
  }
}
