import { Component, OnInit } from '@angular/core';
import { HeroInterface } from '../../../data/heroInterface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroService } from '../../services/hero';
import { MessageService } from '../../services/message';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-heroes',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css',
})
export class Heroes implements OnInit {
  heroes: HeroInterface[] = [];
  selectedHero?: HeroInterface;
  sortBy: string = 'id';
  sortOrder: boolean = true; // true for ascending, false for descending

  constructor(private heroService: HeroService, private messageService: MessageService) {}

  onSelect(hero: HeroInterface): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  sortHeroes(): void {
    this.heroes.sort((a, b) => {
      let comparison = 0;
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'attaque':
          comparison = a.attaque - b.attaque;
          break;
        case 'esquive':
          comparison = a.esquive - b.esquive;
          break;
        case 'degats':
          comparison = a.degats - b.degats;
          break;
        case 'pv':
          comparison = a.pv - b.pv;
          break;
        case 'id':
        default:
          comparison = a.id - b.id;
      }
      return this.sortOrder ? comparison : -comparison;
    });
  }
}

export class HeroesComponent {}
