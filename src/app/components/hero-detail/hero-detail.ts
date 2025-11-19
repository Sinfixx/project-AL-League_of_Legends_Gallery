import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeroInterface } from '../../../data/heroInterface';
import { WeaponInterface } from '../../../data/weaponInterface';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../../services/hero';
import { WeaponService } from '../../services/weapons';
import { Subscription, combineLatest } from 'rxjs';

// Validator personnalisé pour la somme totale
function totalPointsValidator(control: any) {
  if (!control.value) return null;

  const total =
    (control.value.attaque || 0) +
    (control.value.esquive || 0) +
    (control.value.degats || 0) +
    (control.value.pv || 0);

  return total > 40 ? { totalExceeded: { actual: total, max: 40 } } : null;
}

@Component({
  selector: 'app-hero-detail',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './hero-detail.html',
  styleUrl: './hero-detail.css',
})
export class HeroDetail implements OnInit, OnDestroy {
  @Input() hero?: HeroInterface;
  heroForm!: FormGroup;
  weapons: WeaponInterface[] = [];
  selectedWeapon?: WeaponInterface;
  finalStats?: HeroInterface;
  private originalHero?: HeroInterface;
  private formSubscription?: Subscription;
  backgroundUrl: string = '';
  private useSuffix: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public heroService: HeroService,
    private weaponService: WeaponService,
    private location: Location
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  createForm(): void {
    this.heroForm = this.fb.group(
      {
        id: [{ value: 0, disabled: true }],
        name: ['', [Validators.required, Validators.minLength(2)]],
        data: [''], // ID League of Legends
        attaque: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        esquive: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        degats: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        pv: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        weapon: [''], // Ajout du contrôle pour l'arme
      },
      { validators: totalPointsValidator }
    );

    // Surveiller les changements du formulaire
    this.formSubscription = this.heroForm.valueChanges.subscribe(() => {
      this.onFormChange();
    });
  }

  loadData(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    // Charger le héros et les armes en parallèle
    combineLatest([this.heroService.getHero(id), this.weaponService.getWeapons()]).subscribe(
      ([hero, weapons]) => {
        this.hero = { ...hero };
        this.originalHero = { ...hero };
        this.weapons = weapons;

        this.heroForm.patchValue(hero);

        // Si le héros a une arme, la sélectionner
        if (hero.weapon) {
          this.selectedWeapon = this.weapons.find((w) => w.id.toString() === hero.weapon);
          this.heroForm.patchValue({ weapon: hero.weapon });
        }

        // Initialiser l'URL de fond
        this.backgroundUrl = this.getBackgroundUrl(hero.name);

        this.updateFinalStats();
      }
    );
  }

  onFormChange(): void {
    if (this.hero) {
      const formValue = this.heroForm.value;
      this.hero = {
        ...this.hero,
        name: formValue.name,
        attaque: formValue.attaque,
        esquive: formValue.esquive,
        degats: formValue.degats,
        pv: formValue.pv,
        weapon: formValue.weapon,
      };

      this.updateFinalStats();
    }
  }

  onWeaponChange(): void {
    const weaponId = this.heroForm.get('weapon')?.value;

    if (weaponId) {
      this.selectedWeapon = this.weapons.find((w) => w.id.toString() === weaponId);
    } else {
      this.selectedWeapon = undefined;
    }

    this.updateFinalStats();
  }

  updateFinalStats(): void {
    if (this.hero) {
      this.finalStats = this.heroService.calculateFinalStats(
        this.hero,
        this.selectedWeapon || null
      );
    }
  }

  canEquipSelectedWeapon(): boolean {
    if (!this.hero || !this.selectedWeapon) return true;
    return this.heroService.canEquipWeapon(this.hero, this.selectedWeapon);
  }

  getEquipmentError(): string {
    if (!this.hero || !this.selectedWeapon || this.canEquipSelectedWeapon()) return '';

    const newStats = this.heroService.calculateFinalStats(this.hero, this.selectedWeapon);
    const errors: string[] = [];

    if (newStats.attaque < 1) errors.push(`Attaque (${newStats.attaque})`);
    if (newStats.esquive < 1) errors.push(`Esquive (${newStats.esquive})`);
    if (newStats.degats < 1) errors.push(`Dégâts (${newStats.degats})`);
    if (newStats.pv < 1) errors.push(`PV (${newStats.pv})`);

    return `Cette arme rendrait ces stats < 1: ${errors.join(', ')}`;
  }

  saveHero(): void {
    if (this.heroForm.valid && this.hero && this.canEquipSelectedWeapon()) {
      const heroToSave: HeroInterface = {
        ...this.hero,
        ...this.heroForm.value,
        id: this.hero.id,
      };

      this.heroService.updateHero(heroToSave);

      // Associer l'arme si elle a changé
      const weaponId = this.heroForm.get('weapon')?.value || null;
      if (weaponId !== this.originalHero?.weapon) {
        this.heroService.associateWeaponToHero(this.hero.id.toString(), weaponId);
      }

      this.hero = heroToSave;
    }
  }

  onSubmit(): void {
    this.saveHero();
    this.goBack();
  }

  getTotalPoints(): number {
    const formValue = this.heroForm.value;
    return (
      (formValue.attaque || 0) +
      (formValue.esquive || 0) +
      (formValue.degats || 0) +
      (formValue.pv || 0)
    );
  }

  getRemainingPoints(): number {
    return 40 - this.getTotalPoints();
  }

  incrementStat(stat: string): void {
    if (this.getRemainingPoints() <= 0) return;

    const currentValue = this.heroForm.get(stat)?.value || 0;
    this.heroForm.patchValue({ [stat]: currentValue + 1 });
  }

  decrementStat(stat: string): void {
    const currentValue = this.heroForm.get(stat)?.value || 0;
    if (currentValue <= 1) return;

    this.heroForm.patchValue({ [stat]: currentValue - 1 });
  }

  resetStats(): void {
    if (this.originalHero) {
      this.heroForm.patchValue(this.originalHero);
      this.hero = { ...this.originalHero };
      this.selectedWeapon = this.weapons.find((w) => w.id.toString() === this.originalHero?.weapon);
      this.updateFinalStats();
    }
  }

  goBack(): void {
    this.location.back();
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get nameControl() {
    return this.heroForm.get('name');
  }
  get attaqueControl() {
    return this.heroForm.get('attaque');
  }
  get esquiveControl() {
    return this.heroForm.get('esquive');
  }
  get degatsControl() {
    return this.heroForm.get('degats');
  }
  get pvControl() {
    return this.heroForm.get('pv');
  }
  get weaponControl() {
    return this.heroForm.get('weapon');
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.heroForm.get(controlName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.heroForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return `${controlName} est requis`;
    if (control.hasError('min')) return `${controlName} doit être au minimum 1`;
    if (control.hasError('max')) return `${controlName} ne peut pas dépasser 40`;
    if (control.hasError('minlength')) return 'Le nom doit contenir au moins 2 caractères';

    return '';
  }

  getBackgroundUrl(heroName: string): string {
    const nameLower = heroName.toLowerCase().replaceAll("'", '').replaceAll("'", '');
    const basePath = `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/assets/characters/${nameLower}/skins/base/images/${nameLower}_splash_uncentered_0`;

    if (this.useSuffix) {
      return `${basePath}.${nameLower}.jpg`;
    } else {
      return `${basePath}.jpg`;
    }
  }

  onBackgroundError(): void {
    if (!this.useSuffix && this.hero) {
      this.useSuffix = true;
      this.backgroundUrl = this.getBackgroundUrl(this.hero.name);
    }
  }

  getBackgroundStyle(): string {
    return this.backgroundUrl ? `url('${this.backgroundUrl}')` : 'none';
  }
}
