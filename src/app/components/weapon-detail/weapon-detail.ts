import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeaponInterface } from '../../../data/weaponInterface';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
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
  selector: 'app-weapon-detail',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './weapon-detail.html',
  styleUrl: './weapon-detail.css',
})
export class WeaponDetail implements OnInit, OnDestroy {
  @Input() weapon?: WeaponInterface;
  weaponForm!: FormGroup;
  private originalWeapon?: WeaponInterface;
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private weaponService: WeaponService,
    private location: Location
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getWeapon();
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  createForm(): void {
    this.weaponForm = this.fb.group(
      {
        id: [{ value: 0, disabled: true }],
        name: ['', [Validators.required, Validators.minLength(2)]],
        attaque: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
        esquive: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
        degats: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
        pv: [0, [Validators.required, Validators.min(-5), Validators.max(5)]],
      },
      { validators: totalStatsValidator }
    );

    // Surveiller les changements du formulaire
    this.formSubscription = this.weaponForm.valueChanges.subscribe(() => {
      this.onFormChange();
    });
  }

  getWeapon(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.weaponService.getWeapon(id).subscribe((weapon) => {
      this.weapon = { ...weapon };
      this.originalWeapon = { ...weapon };
      this.weaponForm.patchValue(weapon);
    });
  }

  onFormChange(): void {
    // Mettre à jour l'objet weapon avec les valeurs du formulaire
    if (this.weapon) {
      const formValue = this.weaponForm.value;
      this.weapon = {
        ...this.weapon,
        name: formValue.name,
        attaque: formValue.attaque,
        esquive: formValue.esquive,
        degats: formValue.degats,
        pv: formValue.pv,
      };
    }
  }

  saveWeapon(): void {
    if (this.weaponForm.valid && this.weapon) {
      // Créer l'objet weapon final avec toutes les valeurs
      const weaponToSave: WeaponInterface = {
        ...this.weapon,
        ...this.weaponForm.value,
        id: this.weapon.id, // Préserver l'ID
      };

      // Sauvegarder via le service
      this.weaponService.updateWeapon(weaponToSave);

      // Mettre à jour l'objet local
      this.weapon = weaponToSave;
    }
  }

  onSubmit(): void {
    this.saveWeapon();
    this.goBack();
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
    if (this.originalWeapon) {
      this.weaponForm.patchValue(this.originalWeapon);
      this.weapon = { ...this.originalWeapon };
    }
  }

  goBack(): void {
    this.saveWeapon();
    this.location.back();
  }

  getStatBarWidth(value: number): number {
    return (Math.abs(value || 0) / 5) * 100;
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
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

  // Vérifier si un contrôle a une erreur spécifique
  hasError(controlName: string, errorType: string): boolean {
    const control = this.weaponForm.get(controlName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  // Obtenir le message d'erreur pour un contrôle
  getErrorMessage(controlName: string): string {
    const control = this.weaponForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return `${controlName} est requis`;
    if (control.hasError('min')) return `${controlName} doit être au minimum -5`;
    if (control.hasError('max')) return `${controlName} ne peut pas dépasser 5`;
    if (control.hasError('minlength')) return 'Le nom doit contenir au moins 2 caractères';

    return '';
  }

  // Méthode utilitaire pour obtenir la classe CSS d'une stat
  getStatClass(value: number): string {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  }
}
