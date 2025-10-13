import { Injectable } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { WeaponInterface } from '../../data/weaponInterface';
import { Observable, of } from 'rxjs';
import { MessageService } from './message';
import {
  Firestore,
  addDoc,
  setDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // Map pour stocker les héros modifiés en session
  private modifiedHeroes: Map<number, HeroInterface> = new Map();

  // URL d'accès aux documents sur Firebase
  private static url = 'heroes';

  constructor(private firestore: Firestore, private messageService: MessageService) {}

  getHeroes(): Observable<HeroInterface[]> {
    const heroCollection = collection(this.firestore, HeroService.url);
    return collectionData(heroCollection, { idField: 'id' }) as Observable<HeroInterface[]>;
  }

  getHero(id: string): Observable<HeroInterface> {
    const heroDocument = doc(this.firestore, HeroService.url + '/' + id);
    return docData(heroDocument, { idField: 'id' }) as Observable<HeroInterface>;
  }

  deleteHero(id: string): Promise<void> {
    const heroDocument = doc(this.firestore, HeroService.url + '/' + id);
    return deleteDoc(heroDocument);
  }

  addHero(hero: HeroInterface): Promise<void> {
    const heroDoc = doc(this.firestore, HeroService.url, hero.id.toString());

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

  associateWeaponToHero(heroId: string, weaponId: string | null): Promise<void> {
    const heroDocument = doc(this.firestore, HeroService.url + '/' + heroId);

    return updateDoc(heroDocument, { weapon: weaponId }).then(() => {
      this.messageService.add(`HeroService: associated weapon ${weaponId} to hero id=${heroId}`);
    });
  }

  updateHero(hero: HeroInterface): void {
    const heroDocument = doc(this.firestore, HeroService.url + '/' + hero.id);
    let newHeroJSON = {
      name: hero.name,
      attaque: hero.attaque,
      esquive: hero.esquive,
      degats: hero.degats,
      pv: hero.pv,
      weapon: hero.weapon || null,
    };
    updateDoc(heroDocument, newHeroJSON);
  }

  // Méthode pour valider si une arme peut être équipée
  canEquipWeapon(hero: HeroInterface, weapon: WeaponInterface): boolean {
    const newAttaque = hero.attaque + weapon.attaque;
    const newEsquive = hero.esquive + weapon.esquive;
    const newDegats = hero.degats + weapon.degats;
    const newPv = hero.pv + weapon.pv;

    return newAttaque >= 1 && newEsquive >= 1 && newDegats >= 1 && newPv >= 1;
  }

  // Méthode pour calculer les stats finales avec une arme
  calculateFinalStats(hero: HeroInterface, weapon: WeaponInterface | null): HeroInterface {
    if (!weapon) return hero;

    return {
      ...hero,
      attaque: hero.attaque + weapon.attaque,
      esquive: hero.esquive + weapon.esquive,
      degats: hero.degats + weapon.degats,
      pv: hero.pv + weapon.pv,
    };
  }
}
