import { Component, OnInit } from '@angular/core';
import { HeroInterface } from '../../../data/heroInterface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroDetail } from '../hero-detail/hero-detail';
//import { HEROES } from '../../../data/mock-heroes';
import { HeroService } from '../../services/hero';
import { MessageService } from '../../services/message';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-heroes',
  imports: [FormsModule, HeroDetail, CommonModule, RouterLink],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css',
})
export class Heroes implements OnInit {
  heroes: HeroInterface[] = [];
  selectedHero?: HeroInterface;

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
}

export class HeroesComponent {}
