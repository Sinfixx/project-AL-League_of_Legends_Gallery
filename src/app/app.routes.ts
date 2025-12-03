import { Routes } from '@angular/router';
import { Heroes } from './components/heroes/heroes';
import { Dashboard } from './components/dashboard/dashboard';
import { HeroDetail } from './components/hero-detail/hero-detail';
import { Import } from './components/import/import';
import { Weapons } from './components/weapons/weapons';
import { WeaponDetail } from './components/weapon-detail/weapon-detail';
import { Matchup } from './components/matchup/matchup';
import { HeroNew } from './components/hero-new/hero-new';
import { WeaponNew } from './components/weapon-new/weapon-new';
import { Login } from './components/login/login';
import { Sign } from './components/sign/sign';
import { authGuard } from './guards/auth.guard';
import { Forbidden } from './components/forbidden/forbidden';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'sign', component: Sign },
  { path: 'forbidden', component: Forbidden },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'heroes', component: Heroes, canActivate: [authGuard] },
  { path: 'detail/:id', component: HeroDetail, canActivate: [authGuard] },
  { path: 'import', component: Import, canActivate: [authGuard] },
  { path: 'weapons', component: Weapons, canActivate: [authGuard] },
  { path: 'weapon/:id', component: WeaponDetail, canActivate: [authGuard] },
  { path: 'weapons/new', component: WeaponNew, canActivate: [authGuard] },
  { path: 'matchup', component: Matchup, canActivate: [authGuard] },
  { path: 'heroes/new', component: HeroNew, canActivate: [authGuard] },
];
