import { WeaponInterface } from './weaponInterface';

export const WEAPONS: WeaponInterface[] = [
  { id: 12, name: 'Créateur de failles', attaque: -1, esquive: -3, degats: 2, pv: 2 }, // -1-3+2+2 = 0 ✓
  { id: 13, name: "Lame d'infini", attaque: 4, esquive: -4, degats: 3, pv: -3 }, // 4-4+3-3 = 0 ✓
  { id: 15, name: 'Danseur fantôme', attaque: 2, esquive: 3, degats: -3, pv: -2 }, // 2+3-3-2 = 0 ✓
  { id: 16, name: 'Gage de Sterak', attaque: 1, esquive: -1, degats: -2, pv: 2 }, // 1-1-2+2 = 0 ✓
  { id: 17, name: 'Terminus', attaque: 3, esquive: 2, degats: -2, pv: -3 }, // 3+2-2-3 = 0 ✓
  { id: 18, name: 'Lame du roi déchu', attaque: 2, esquive: 1, degats: 1, pv: -4 }, // 2+1+1-4 = 0 ✓
  { id: 19, name: 'Danse de la mort', attaque: 1, esquive: 2, degats: 2, pv: -5 }, // 1+2+2-5 = 0 ✓
  { id: 20, name: 'Soif-de-sang', attaque: 3, esquive: -1, degats: 2, pv: -4 }, // 3-1+2-4 = 0 ✓
  { id: 21, name: 'Affliction de Liandry', attaque: 1, esquive: 0, degats: 2, pv: -3 }, // 1+0+2-3 = 0 ✓
  { id: 22, name: 'Bâton du vide', attaque: 4, esquive: -2, degats: 1, pv: -3 }, // 4-2+1-3 = 0 ✓
  { id: 23, name: 'Morellonomicon', attaque: 1, esquive: 1, degats: 3, pv: -5 }, // 1+1+3-5 = 0 ✓
  { id: 24, name: 'Sceptre de Rylai', attaque: 1, esquive: 2, degats: 2, pv: -5 }, // 1+2+2-5 = 0 ✓
  { id: 25, name: 'Coiffe de Rabadon', attaque: 0, esquive: 0, degats: 5, pv: -5 }, // 0+0+5-5 = 0 ✓
];
