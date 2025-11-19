import { Injectable } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { MatchupResult } from '../../data/matchupInterface';

@Injectable({
  providedIn: 'root',
})
export class MatchupService {
  constructor() {}

  // Calcul de la capacité à survivre
  private calculateSurvivability(hero: HeroInterface): number {
    return (hero.pv * hero.esquive) / 100;
  }

  // Calcul du potentiel de dégâts
  private calculateBurstPotential(hero: HeroInterface): number {
    return (hero.attaque * hero.degats) / 100;
  }

  // Calcul de l'efficacité (équilibre offense/défense)
  private calculateEfficiency(hero: HeroInterface): number {
    return (hero.attaque + hero.esquive + hero.degats) / hero.pv;
  }

  // Calcul du taux de victoire entre deux héros
  private calculateWinRate(
    hero1: HeroInterface,
    hero2: HeroInterface
  ): { hero1WinRate: number; hero2WinRate: number } {
    const hero1Survivability = this.calculateSurvivability(hero1);
    const hero2Survivability = this.calculateSurvivability(hero2);

    const hero1Burst = this.calculateBurstPotential(hero1);
    const hero2Burst = this.calculateBurstPotential(hero2);

    const hero1Efficiency = this.calculateEfficiency(hero1);
    const hero2Efficiency = this.calculateEfficiency(hero2);

    // Calcul des avantages relatifs (normalisés entre 0 et 1)
    const survivalAdvantage = hero1Survivability / (hero1Survivability + hero2Survivability);
    const burstAdvantage = hero1Burst / (hero1Burst + hero2Burst);
    const efficiencyAdvantage = hero1Efficiency / (hero1Efficiency + hero2Efficiency);

    // Moyenne pondérée des avantages
    // 40% survivability, 40% burst, 20% efficiency
    const hero1WinChance =
      survivalAdvantage * 0.4 + burstAdvantage * 0.4 + efficiencyAdvantage * 0.2;

    // Conversion en pourcentage
    const hero1WinRate = Math.round(hero1WinChance * 100 * 100) / 100;
    const hero2WinRate = Math.round((100 - hero1WinRate) * 100) / 100;

    return { hero1WinRate, hero2WinRate };
  }

  // Analyse complète du matchup entre deux héros
  analyzeMatchup(hero1: HeroInterface, hero2: HeroInterface): MatchupResult {
    const winRates = this.calculateWinRate(hero1, hero2);

    return {
      hero1WinRate: winRates.hero1WinRate,
      hero2WinRate: winRates.hero2WinRate,

      hero1Stats: {
        attaque: hero1.attaque,
        esquive: hero1.esquive,
        degats: hero1.degats,
        pv: hero1.pv,
      },

      hero2Stats: {
        attaque: hero2.attaque,
        esquive: hero2.esquive,
        degats: hero2.degats,
        pv: hero2.pv,
      },

      hero1Metrics: {
        survivability: Math.round(this.calculateSurvivability(hero1) * 100) / 100,
        burstPotential: Math.round(this.calculateBurstPotential(hero1) * 100) / 100,
        efficiency: Math.round(this.calculateEfficiency(hero1) * 100) / 100,
      },

      hero2Metrics: {
        survivability: Math.round(this.calculateSurvivability(hero2) * 100) / 100,
        burstPotential: Math.round(this.calculateBurstPotential(hero2) * 100) / 100,
        efficiency: Math.round(this.calculateEfficiency(hero2) * 100) / 100,
      },
    };
  }
}
