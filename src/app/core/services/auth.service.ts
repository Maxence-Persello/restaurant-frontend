import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly JWT_TOKEN = 'JWT_TOKEN';

  constructor(
    readonly http: HttpClient,
    readonly router: Router
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    const credentials = { email, password };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.saveToken(response.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.JWT_TOKEN, token);
  }
}
