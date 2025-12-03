import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forbidden-container">
      <div class="forbidden-card">
        <div class="icon">🚫</div>
        <h1>Accès Refusé</h1>
        <p>Vous devez être connecté pour accéder à cette page.</p>
        <div class="actions">
          <button (click)="goToLogin()" class="btn btn-primary">Se connecter</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .forbidden-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        padding: 20px;
      }

      .forbidden-card {
        width: 100%;
        max-width: 500px;
        background-color: #2d2d2d;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        border: 1px solid #404040;
        padding: 40px;
        text-align: center;
      }

      .icon {
        font-size: 5em;
        margin-bottom: 20px;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      h1 {
        color: #ff6b6b;
        font-size: 2em;
        margin: 0 0 15px 0;
        font-weight: 700;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      p {
        color: #b0b0b0;
        font-size: 1.1em;
        margin: 0 0 20px 0;
        line-height: 1.6;
      }

      .actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
      }

      .btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 1em;
        font-weight: 600;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .btn-primary {
        background: linear-gradient(135deg, #4a90e2, #357abd);
        color: white;
        box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
      }

      .btn-primary:hover {
        background: linear-gradient(135deg, #357abd, #2d6399);
        box-shadow: 0 6px 20px rgba(74, 144, 226, 0.4);
        transform: translateY(-2px);
      }
    `,
  ],
})
export class Forbidden {
  constructor(private router: Router, private authService: Auth) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
