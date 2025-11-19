import { Routes } from '@angular/router';
import { Heroes } from './components/heroes/heroes';
import { Dashboard } from './components/dashboard/dashboard';
import { HeroDetail } from './components/hero-detail/hero-detail';
import { Import } from './components/import/import';
import { Weapons } from './components/weapons/weapons';
import { WeaponDetail } from './components/weapon-detail/weapon-detail';
import { Matchup } from './components/matchup/matchup';
import { HeroNew } from './components/hero-new/hero-new';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'heroes', component: Heroes },
  { path: 'detail/:id', component: HeroDetail },
  { path: 'import', component: Import },
  { path: 'weapons', component: Weapons },
  { path: 'weapon/:id', component: WeaponDetail },
  { path: 'matchup', component: Matchup },
  { path: 'heroes/new', component: HeroNew },
];
