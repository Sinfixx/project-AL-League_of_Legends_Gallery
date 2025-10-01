import { Injectable } from '@angular/core';
import { HeroInterface } from '../../data/heroInterface';
import { Observable, of } from 'rxjs';
import { MessageService } from './message';
import {
  Firestore,
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
export class WeaponService {
  // Map pour stocker les héros modifiés en session
  private modifiedHeroes: Map<number, HeroInterface> = new Map();

  // URL d'accès aux documents sur Firebase
  private static url = 'weapons';

  constructor(private firestore: Firestore, private messageService: MessageService) {}
  getWeapons(): Observable<HeroInterface[]> {
    // get a reference to the weapon collection
    const weaponCollection = collection(this.firestore, WeaponService.url);
    ///////////
    // Solution 1 : Transformation en une liste d'objets "prototype" de type Hero
    // get documents (data) from the collection using collectionData
    return collectionData(weaponCollection, { idField: 'id' }) as Observable<HeroInterface[]>;
  }

  getWeapon(id: string): Observable<HeroInterface> {
    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + '/' + id);
    ///////////
    // Solution 1 : Transformation en un objet "prototype" de type Hero // get documents (data) from the collection using collectionData
    return docData(weaponDocument, { idField: 'id' }) as Observable<HeroInterface>;
  }

  deleteWeapon(id: string): Promise<void> {
    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + '/' + id);
    //
    return deleteDoc(weaponDocument);
  }

  addWeapon(weapon: HeroInterface): Promise<void> {
    // Utiliser l'ID du héros comme identifiant de document
    const weaponDoc = doc(this.firestore, WeaponService.url, weapon.id.toString());

    // Créer le document avec l'ID spécifié
    return setDoc(weaponDoc, {
      name: weapon.name,
      attaque: weapon.attaque,
      esquive: weapon.esquive,
      degats: weapon.degats,
      pv: weapon.pv,
    }).then(() => {
      this.messageService.add(`WeaponService: added weapon id=${weapon.id}`);
    });
  }

  updateWeapon(weapon: HeroInterface): void {
    // Récupération du DocumentReference
    const weaponDocument = doc(this.firestore, WeaponService.url + '/' + weapon.id);
    // Update du document à partir du JSON et du documentReference
    let newWeaponJSON = {
      name: weapon.name,
      attaque: weapon.attaque,
      esquive: weapon.esquive,
      degats: weapon.degats,
      pv: weapon.pv,
    };
    updateDoc(weaponDocument, newWeaponJSON);
  }
}
