import { Injectable } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { Observable, of } from 'rxjs';
import { MessageService } from './message';
import { HEROES } from '../../data/mock-heroes';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // Map pour stocker les héros modifiés en session
  private modifiedHeroes: Map<number, HeroInterface> = new Map();

  constructor(private messageService: MessageService) {}

  getHeroes(): Observable<HeroInterface[]> {
    const heroes: Observable<HeroInterface[]> = new Observable((observer) => {
      // Mélanger les héros originaux avec les modifications
      const updatedHeroes = HEROES.map((hero) => {
        const modifiedHero = this.modifiedHeroes.get(hero.id);
        return modifiedHero || hero;
      });

      observer.next(updatedHeroes.slice(0, 2));
      setTimeout(() => {
        observer.next(updatedHeroes);
        observer.complete();
      }, 300);
    });
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  getHero(id: number): Observable<HeroInterface> {
    // Vérifier s'il y a une version modifiée
    const modifiedHero = this.modifiedHeroes.get(id);
    if (modifiedHero) {
      this.messageService.add(`HeroService: fetched modified hero id=${id}`);
      return of({ ...modifiedHero });
    }

    // Sinon retourner l'original
    const hero = HEROES.find((h) => h.id === id);
    if (hero) {
      this.messageService.add(`HeroService: fetched hero id=${id}`);
      return of({ ...hero });
    }

    return of({} as HeroInterface);
  }

  // Sauvegarder les modifications en session
  updateHero(hero: HeroInterface): void {
    this.modifiedHeroes.set(hero.id, { ...hero });
    this.messageService.add(`HeroService: saved hero id=${hero.id} in session`);
  }
}
