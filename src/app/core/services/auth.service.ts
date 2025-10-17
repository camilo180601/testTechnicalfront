import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user$ = new BehaviorSubject<User | null>(null);
  private tokenKey = 'docuu_access_token';

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    if (token) this.loadProfile().subscribe({ error: () => this.logout() });
  }

  login(email: string, password: string) {
    return this.http.post<{ access_token: string }>(`${environment.apiBase}/auth/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem(this.tokenKey, res.access_token);
        this.loadProfile().subscribe();
      }));
  }

  logout() {
    return this.http.post<{ access_token: string }>(`${environment.apiBase}/auth/logout`, { token: this.getToken() })
      .pipe(tap(res => {
        localStorage.removeItem(this.tokenKey);
        this.loadProfile().subscribe();
        this.user$.next(null);
      }));
  }

  getToken() { return localStorage.getItem(this.tokenKey); }

  loadProfile() {
    return this.http.get<User>(`${environment.apiBase}/auth/me`)
      .pipe(tap(u => this.user$.next(u)));
  }

  getUser$() { return this.user$.asObservable(); }

  isLoggedIn() { return !!this.getToken(); }
}
