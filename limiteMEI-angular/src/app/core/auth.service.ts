import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
  role: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'limitemei_token';
  private readonly userKey = 'limitemei_user';
  readonly user = signal<AuthResponse | null>(this.readUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, senha: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, senha })
      .pipe(tap(response => this.storeSession(response)));
  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(tap(response => this.storeSession(response)));
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response));
    this.user.set(response);
  }

  private readUser(): AuthResponse | null {
    const value = localStorage.getItem(this.userKey);
    if (!value) return null;
    try {
      return JSON.parse(value) as AuthResponse;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
