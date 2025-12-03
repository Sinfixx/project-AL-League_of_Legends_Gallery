import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from './auth';

/**
 * Intercepteur JWT qui ajoute automatiquement le token
 * dans le header Authorization de chaque requête HTTP sortante
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  // Si un token existe et est valide, on l'ajoute au header
  if (token && authService.isTokenValid()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
