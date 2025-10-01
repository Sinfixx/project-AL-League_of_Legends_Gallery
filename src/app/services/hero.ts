import { Injectable } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { Observable, of } from 'rxjs';
import { MessageService } from './message';
import { HEROES } from '../../data/mock-heroes';
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
    // get a reference to the hero collection
    const heroCollection = collection(this.firestore, HeroService.url);
    ///////////
    // Solution 1 : Transformation en une liste d'objets "prototype" de type Hero
    // get documents (data) from the collection using collectionData
    return collectionData(heroCollection, { idField: 'id' }) as Observable<HeroInterface[]>;
  }

  getHero(id: string): Observable<HeroInterface> {
    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + '/' + id);
    ///////////
    // Solution 1 : Transformation en un objet "prototype" de type Hero // get documents (data) from the collection using collectionData
    return docData(heroDocument, { idField: 'id' }) as Observable<HeroInterface>;
  }

  deleteHero(id: string): Promise<void> {
    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + '/' + id);
    //
    return deleteDoc(heroDocument);
  }

  addHero(hero: HeroInterface): Promise<void> {
    // Utiliser l'ID du héros comme identifiant de document
    const heroDoc = doc(this.firestore, HeroService.url, hero.id.toString());

    // Créer le document avec l'ID spécifié
    return setDoc(heroDoc, {
      name: hero.name,
      attaque: hero.attaque,
      esquive: hero.esquive,
      degats: hero.degats,
      pv: hero.pv,
    }).then(() => {
      this.messageService.add(`HeroService: added hero id=${hero.id}`);
    });
  }

  updateHero(hero: HeroInterface): void {
    // Récupération du DocumentReference
    const heroDocument = doc(this.firestore, HeroService.url + '/' + hero.id);
    // Update du document à partir du JSON et du documentReference
    let newHeroJSON = {
      name: hero.name,
      attaque: hero.attaque,
      esquive: hero.esquive,
      degats: hero.degats,
      pv: hero.pv,
    };
    updateDoc(heroDocument, newHeroJSON);
  }
}
