import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap, timeout } from 'rxjs';
import { API_BASE_URL } from './api.config';

interface AuthMeResponse {
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private userIdSignal = signal<number | null>(null);
  isAuthenticated = computed(() => this.userIdSignal() !== null);
  userId = computed(() => this.userIdSignal());

  refreshSession() {
    return this.http
      .get<AuthMeResponse>(`${API_BASE_URL}/api/auth/me`, { withCredentials: true })
      .pipe(
        tap((response) => this.userIdSignal.set(response.userId)),
        map(() => true),
        catchError(() => {
          this.userIdSignal.set(null);
          return of(false);
        })
      );
  }

  login(username: string, password: string) {
    return this.http
      .post(`${API_BASE_URL}/api/auth/login`, { username, password }, { withCredentials: true })
      .pipe(
        timeout(8000),
        tap(() => this.refreshSession().subscribe())
      );
  }

  register(username: string, password: string) {
    return this.http
      .post(`${API_BASE_URL}/api/auth/register`, { username, password }, { withCredentials: true })
      .pipe(
        timeout(8000),
        tap(() => this.refreshSession().subscribe())
      );
  }

  logout() {
    return this.http
      .post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.userIdSignal.set(null)),
        catchError(() => {
          this.userIdSignal.set(null);
          return of(null);
        })
      );
  }
}
