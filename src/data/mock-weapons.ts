import { WeaponInterface } from './weaponInterface';

export const WEAPONS: WeaponInterface[] = [
  { id: 102, name: 'Créateur de failles', attaque: -1, esquive: -3, degats: 2, pv: 2 }, // -1-3+2+2 = 0 ✓
  { id: 103, name: "Lame d'infini", attaque: 4, esquive: -4, degats: 3, pv: -3 }, // 4-4+3-3 = 0 ✓
  { id: 105, name: 'Danseur fantôme', attaque: 2, esquive: 3, degats: -3, pv: -2 }, // 2+3-3-2 = 0 ✓
  { id: 106, name: 'Gage de Sterak', attaque: 1, esquive: -1, degats: -2, pv: 2 }, // 1-1-2+2 = 0 ✓
  { id: 107, name: 'Terminus', attaque: 3, esquive: 2, degats: -2, pv: -3 }, // 3+2-2-3 = 0 ✓
  { id: 108, name: 'Lame du roi déchu', attaque: 2, esquive: 1, degats: 1, pv: -4 }, // 2+1+1-4 = 0 ✓
  { id: 109, name: 'Danse de la mort', attaque: 1, esquive: 2, degats: 2, pv: -5 }, // 1+2+2-5 = 0 ✓
  { id: 110, name: 'Soif-de-sang', attaque: 3, esquive: -1, degats: 2, pv: -4 }, // 3-1+2-4 = 0 ✓
  { id: 111, name: 'Affliction de Liandry', attaque: 1, esquive: 0, degats: 2, pv: -3 }, // 1+0+2-3 = 0 ✓
  { id: 112, name: 'Bâton du vide', attaque: 4, esquive: -2, degats: 1, pv: -3 }, // 4-2+1-3 = 0 ✓
  { id: 113, name: 'Morellonomicon', attaque: 1, esquive: 1, degats: 3, pv: -5 }, // 1+1+3-5 = 0 ✓
  { id: 114, name: 'Sceptre de Rylai', attaque: 1, esquive: 2, degats: 2, pv: -5 }, // 1+2+2-5 = 0 ✓
  { id: 115, name: 'Coiffe de Rabadon', attaque: 0, esquive: 0, degats: 5, pv: -5 }, // 0+0+5-5 = 0 ✓
];
