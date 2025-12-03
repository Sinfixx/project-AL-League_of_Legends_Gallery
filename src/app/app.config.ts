import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { jwtInterceptor } from './services/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'torrejoctoh2025',
        appId: '1:1071901123515:web:df39958c34e33111dd1a9e',
        storageBucket: 'torrejoctoh2025.firebasestorage.app',
        apiKey: 'AIzaSyDtoOf67K8VlcHQhjYVQlV_t8OSVHHAFVY',
        authDomain: 'torrejoctoh2025.firebaseapp.com',
        messagingSenderId: '1071901123515',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
