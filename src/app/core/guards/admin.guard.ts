import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Note : Pour une vraie sécurité, l'AuthService devrait exposer une méthode
// comme `getCurrentUser()` qui retourne l'utilisateur et son rôle.
// Ici, nous simulons la vérification du rôle.

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(readonly authService: AuthService, readonly router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    return true;
  }
}
