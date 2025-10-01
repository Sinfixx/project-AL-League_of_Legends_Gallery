import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeaponService } from '../../services/weapons';
import { HEROES } from '../../../data/mock-heroes';
import { HeroInterface } from '../../../data/heroInterface';
import { WEAPONS } from '../../../data/mock-weapons';

@Component({
  selector: 'app-import-heroes',
  imports: [CommonModule],
  template: `
    <div class="import-container">
      <h2>Import des héros vers Firebase</h2>

      <div class="status">
        <p>Héros à importer: {{ totalHeroes }}</p>
        <p>Héros importés: {{ importedCount }}</p>
        <p>Erreurs: {{ errorCount }}</p>
      </div>

      <div class="actions">
        <button (click)="importAll()" [disabled]="isImporting" class="import-btn">
          {{ isImporting ? 'Import en cours...' : 'Importer tous les héros' }}
        </button>

        <button (click)="clearResults()" [disabled]="isImporting" class="clear-btn">
          Effacer les résultats
        </button>
      </div>

      <div class="results" *ngIf="results.length > 0">
        <h3>Résultats:</h3>
        <div *ngFor="let result of results" [class]="result.success ? 'success' : 'error'">
          {{ result.message }}
        </div>
      </div>

      <div class="heroes-list">
        <h3>Héros à importer:</h3>
        <div class="hero-card" *ngFor="let hero of heroesToImport">
          <strong>ID: {{ hero.id }} - {{ hero.name }}</strong> - A:{{ hero.attaque }} E:{{
            hero.esquive
          }}
          D:{{ hero.degats }} PV:{{ hero.pv }}
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .import-container {
        max-width: 800px;
        margin: 20px auto;
        padding: 25px;
        background-color: #2d2d2d;
        border-radius: 12px;
        color: #e0e0e0;
      }

      h2 {
        color: #4a90e2;
        text-align: center;
        margin-bottom: 20px;
      }

      .status {
        background-color: #1a1a1a;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .status p {
        margin: 5px 0;
        font-size: 1.1em;
      }

      .actions {
        display: flex;
        gap: 15px;
        margin-bottom: 20px;
      }

      .import-btn,
      .clear-btn {
        padding: 12px 25px;
        border: none;
        border-radius: 6px;
        font-size: 1em;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .import-btn {
        background: linear-gradient(135deg, #27ae60, #219a52);
        color: white;
      }

      .import-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #219a52, #1e8449);
        transform: translateY(-2px);
      }

      .import-btn:disabled {
        background: #555555;
        cursor: not-allowed;
        opacity: 0.7;
      }

      .clear-btn {
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
      }

      .clear-btn:hover:not(:disabled) {
        background: linear-gradient(135deg, #c0392b, #a93226);
        transform: translateY(-2px);
      }

      .results {
        background-color: #1a1a1a;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .results h3 {
        color: #4a90e2;
        margin-bottom: 10px;
      }

      .results div {
        padding: 8px;
        margin: 5px 0;
        border-radius: 4px;
      }

      .success {
        background-color: #27ae60;
        color: white;
      }

      .error {
        background-color: #e74c3c;
        color: white;
      }

      .heroes-list {
        background-color: #1a1a1a;
        padding: 15px;
        border-radius: 8px;
      }

      .heroes-list h3 {
        color: #4a90e2;
        margin-bottom: 15px;
      }

      .hero-card {
        background-color: #242424;
        padding: 10px;
        margin: 8px 0;
        border-radius: 6px;
        border-left: 4px solid #4a90e2;
      }
    `,
  ],
})
export class Import {
  heroesToImport = WEAPONS;
  totalHeroes = WEAPONS.length;
  importedCount = 0;
  errorCount = 0;
  isImporting = false;
  results: { message: string; success: boolean }[] = [];

  constructor(private weaponService: WeaponService) {}

  async importAll(): Promise<void> {
    this.isImporting = true;
    this.importedCount = 0;
    this.errorCount = 0;
    this.results = [];

    for (const weapon of this.heroesToImport) {
      try {
        // Garder l'objet hero complet avec son ID original
        await this.weaponService.addWeapon(weapon);

        this.importedCount++;
        this.results.push({
          message: `✅ ${weapon.name} (ID: ${weapon.id}) importé avec succès`,
          success: true,
        });

        // Petite pause pour éviter de surcharger Firebase
        await this.delay(200);
      } catch (error) {
        this.errorCount++;
        this.results.push({
          message: `❌ Erreur lors de l'import de ${weapon.name} (ID: ${weapon.id}): ${error}`,
          success: false,
        });
      }
    }

    this.isImporting = false;

    // Message final
    this.results.push({
      message: `🎯 Import terminé: ${this.importedCount} succès, ${this.errorCount} erreurs`,
      success: this.errorCount === 0,
    });
  }

  clearResults(): void {
    this.results = [];
    this.importedCount = 0;
    this.errorCount = 0;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
