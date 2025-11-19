import { Component, OnInit } from '@angular/core';
import { HeroInterface } from '../../../data/heroInterface';
import { HeroService } from '../../services/hero';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  heroes: HeroInterface[] = [];
  heroBackgroundUrls: Map<number, string> = new Map();
  failedUrls: Set<string> = new Set();

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes.slice(0, 3);
      // Initialiser les URLs pour chaque héros
      this.heroes.forEach((hero) => {
        this.heroBackgroundUrls.set(hero.id, this.getBackgroundUrl(hero.name, false));
      });
    });
  }

  getBackgroundUrl(heroName: string, withSuffix: boolean): string {
    const nameLower = heroName.toLowerCase();
    const basePath = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${nameLower}/skins/base/images/${nameLower}_splash_centered_0`;

    if (withSuffix) {
      return `${basePath}.${nameLower}.jpg`;
    } else {
      return `${basePath}.jpg`;
    }
  }

  onImageError(heroId: number, heroName: string): void {
    const currentUrl = this.heroBackgroundUrls.get(heroId);

    // Si on n'a pas encore testé l'URL avec suffixe
    if (currentUrl && !this.failedUrls.has(currentUrl)) {
      this.failedUrls.add(currentUrl);
      // Essayer avec le suffixe .{nom}
      this.heroBackgroundUrls.set(heroId, this.getBackgroundUrl(heroName, true));
    }
  }

  getHeroBackgroundStyle(heroId: number): string {
    const url = this.heroBackgroundUrls.get(heroId);
    return url ? `url('${url}')` : 'none';
  }
}
