import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeroInterface } from '../../../data/heroInterface';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../../services/hero';
import { Subscription } from 'rxjs';

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
  private originalHero?: HeroInterface;
  private formSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.getHero();
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
        attaque: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        esquive: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        degats: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
        pv: [1, [Validators.required, Validators.min(1), Validators.max(40)]],
      },
      { validators: totalPointsValidator }
    );

    // Surveiller les changements du formulaire
    this.formSubscription = this.heroForm.valueChanges.subscribe(() => {
      this.onFormChange();
    });
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => {
      this.hero = { ...hero };
      this.originalHero = { ...hero };
      this.heroForm.patchValue(hero);
    });
  }

  onFormChange(): void {
    // Mettre à jour l'objet hero avec les valeurs du formulaire
    if (this.hero) {
      const formValue = this.heroForm.value;
      this.hero = {
        ...this.hero,
        name: formValue.name,
        attaque: formValue.attaque,
        esquive: formValue.esquive,
        degats: formValue.degats,
        pv: formValue.pv,
      };
    }
  }

  saveHero(): void {
    if (this.heroForm.valid && this.hero) {
      // Créer l'objet hero final avec toutes les valeurs
      const heroToSave: HeroInterface = {
        ...this.hero,
        ...this.heroForm.value,
        id: this.hero.id, // Préserver l'ID
      };

      // Sauvegarder via le service
      this.heroService.updateHero(heroToSave);

      // Mettre à jour l'objet local
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

  // Vérifier si un contrôle a une erreur spécifique
  hasError(controlName: string, errorType: string): boolean {
    const control = this.heroForm.get(controlName);
    return !!(control && control.hasError(errorType) && (control.dirty || control.touched));
  }

  // Obtenir le message d'erreur pour un contrôle
  getErrorMessage(controlName: string): string {
    const control = this.heroForm.get(controlName);
    if (!control || !control.errors) return '';

    if (control.hasError('required')) return `${controlName} est requis`;
    if (control.hasError('min')) return `${controlName} doit être au minimum 1`;
    if (control.hasError('max')) return `${controlName} ne peut pas dépasser 40`;
    if (control.hasError('minlength')) return 'Le nom doit contenir au moins 2 caractères';

    return '';
  }
}
