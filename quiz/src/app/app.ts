import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AuthModal } from './components/auth-modal/auth-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AuthModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('quiz');
  authModalOpen = false;
  authMode: 'login' | 'register' = 'login';
  accountMenuOpen = false;

  constructor(public authService: AuthService) {
    this.authService.refreshSession().subscribe();
  }

  toggleAccountMenu() {
    this.accountMenuOpen = !this.accountMenuOpen;
  }

  closeAccountMenu() {
    this.accountMenuOpen = false;
  }

  openAuthFromMenu(mode: 'login' | 'register') {
    this.authMode = mode;
    this.accountMenuOpen = false;
    this.authModalOpen = true;
  }

  closeAuth() {
    this.authModalOpen = false;
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
