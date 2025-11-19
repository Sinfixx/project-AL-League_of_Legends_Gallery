import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeaponInterface } from '../../../data/weaponInterface';
import { Router } from '@angular/router';
import { WeaponService } from '../../services/weapons';
import { Subscription } from 'rxjs';

// Validator personnalisé pour la somme totale (doit être 0)
function totalStatsValidator(control: any) {
  if (!control.value) return null;

  const total =
    (control.value.attaque || 0) +
    (control.value.esquive || 0) +
    (control.value.degats || 0) +
    (control.value.pv || 0);

  return total !== 0 ? { totalNotZero: { actual: total, expected: 0 } } : null;
}

@Component({
  selector: 'app-weapon-new',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './weapon-new.html',
  styleUrl: './weapon-new.css',
})
export class WeaponNew implements OnInit {
  weaponForm!: FormGroup;
  weapons: WeaponInterface[] = [];
  existingIds: number[] = [];
  idWarning: string = '';
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private weaponService: WeaponService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadWeapons();

    // Surveiller les changements du formulaire
    this.formSubscription = this.weaponForm.valueChanges.subscribe(() => {
      this.checkIdExists();
    });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  createForm(): void {
    this.weaponForm = this.fb.group(
      {
        id: [1, [Validators.required, Validators.min(1)]],
        name: ['', [Validators.required, Validators.minLength(2)]],
        attaque: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
        esquive: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
        degats: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
        pv: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
      },
      { validators: totalStatsValidator }
    );
  }

  loadWeapons(): void {
    this.weaponService.getWeapons().subscribe((weapons) => {
      this.weapons = weapons;
      this.existingIds = weapons.map((w) => Number(w.id));
      this.checkIdExists();
    });
  }

  checkIdExists(): void {
    const id = Number(this.weaponForm.get('id')?.value);
    if (this.existingIds.includes(id)) {
      this.idWarning = `⚠️ L'ID ${id} existe déjà. Choisissez un autre ID.`;
    } else {
      this.idWarning = '';
    }
  }

  getTotalStats(): number {
    const formValue = this.weaponForm.value;
    return (
      (formValue.attaque || 0) +
      (formValue.esquive || 0) +
      (formValue.degats || 0) +
      (formValue.pv || 0)
    );
  }

  incrementStat(stat: string): void {
    const currentValue = this.weaponForm.get(stat)?.value || 0;
    if (currentValue >= 5) return;

    this.weaponForm.patchValue({ [stat]: currentValue + 1 });
  }

  decrementStat(stat: string): void {
    const currentValue = this.weaponForm.get(stat)?.value || 0;
    if (currentValue <= -5) return;

    this.weaponForm.patchValue({ [stat]: currentValue - 1 });
  }

  resetStats(): void {
    this.weaponForm.patchValue({
      attaque: 0,
      esquive: 0,
      degats: 0,
      pv: 0,
    });
  }

  onSubmit(): void {
    if (this.weaponForm.valid && !this.idWarning) {
      const newWeapon: WeaponInterface = {
        ...this.weaponForm.value,
      };

      this.weaponService.addWeapon(newWeapon).then(() => {
        this.router.navigate(['/weapons']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/weapons']);
  }

  getStatBarWidth(value: number): number {
    return (Math.abs(value || 0) / 5) * 100;
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get idControl() {
    return this.weaponForm.get('id');
  }
  get nameControl() {
    return this.weaponForm.get('name');
  }
  get attaqueControl() {
    return this.weaponForm.get('attaque');
  }
  get esquiveControl() {
    return this.weaponForm.get('esquive');
  }
  get degatsControl() {
    return this.weaponForm.get('degats');
  }
  get pvControl() {
    return this.weaponForm.get('pv');
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.weaponForm.get(controlName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.weaponForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return `${controlName} est requis`;
    if (control.hasError('min')) {
      if (controlName === 'id') return "L'ID doit être au minimum 1";
      return `${controlName} doit être au minimum -5`;
    }
    if (control.hasError('max')) return `${controlName} ne peut pas dépasser 5`;
    if (control.hasError('minlength')) return 'Le nom doit contenir au moins 2 caractères';

    return '';
  }

  getStatClass(value: number): string {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  }
}
