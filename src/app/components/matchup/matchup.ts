import { Component, OnInit } from '@angular/core';
import { HeroInterface } from '../../../data/heroInterface';
import { MatchupResult } from '../../../data/matchupInterface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroService } from '../../services/hero';
import { MatchupService } from '../../services/matchup';
import { MessageService } from '../../services/message';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-matchup',
  imports: [FormsModule, CommonModule],
  templateUrl: './matchup.html',
  styleUrl: './matchup.css',
})
export class Matchup implements OnInit {
  heroes: HeroInterface[] = [];
  selectedHero1?: HeroInterface;
  selectedHero2?: HeroInterface;
  matchupResult?: MatchupResult;

  constructor(
    private heroService: HeroService,
    private matchupService: MatchupService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  onHero1Select(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const heroId = selectElement.value;
    this.selectedHero1 = this.heroes.find((h) => h.id.toString() === heroId);
    this.analyzeMatchup();
  }

  onHero2Select(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const heroId = selectElement.value;
    this.selectedHero2 = this.heroes.find((h) => h.id.toString() === heroId);
    this.analyzeMatchup();
  }

  analyzeMatchup(): void {
    if (this.selectedHero1 && this.selectedHero2) {
      this.matchupResult = this.matchupService.analyzeMatchup(
        this.selectedHero1,
        this.selectedHero2
      );
      this.messageService.add(
        `Matchup analyzed: ${this.selectedHero1.name} vs ${this.selectedHero2.name}`
      );
    }
  }

  // Méthode pour calculer le pourcentage de la barre (pour les stats)
  getStatBarPercentage(stat1: number, stat2: number, isHero1: boolean): number {
    const total = stat1 + stat2;
    if (total === 0) return 50;
    return isHero1 ? (stat1 / total) * 100 : (stat2 / total) * 100;
  }

  // Méthode pour déterminer si une barre doit être noire (dominée)
  isBarDominated(stat1: number, stat2: number, isHero1: boolean): boolean {
    if (stat1 === stat2) return false; // Égalité, pas de noir
    return isHero1 ? stat1 < stat2 : stat2 < stat1;
  }
}
