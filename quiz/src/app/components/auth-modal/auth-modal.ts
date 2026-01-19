import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auth-modal.html',
  styleUrl: './auth-modal.scss',
})
export class AuthModal {
  @Input() mode: AuthMode = 'login';
  @Output() closed = new EventEmitter<void>();

  username = '';
  password = '';
  error: string | null = null;
  isSubmitting = false;

  constructor(private authService: AuthService) {}

  switchMode(next: AuthMode) {
    this.mode = next;
    this.error = null;
  }

  close() {
    this.closed.emit();
  }

  submit() {
    const username = this.username.trim();
    const password = this.password.trim();

    if (!username || !password) {
      this.error = 'Введите логин и пароль.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    if (this.mode === 'login') {
      this.authService
        .login(username, password)
        .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            this.closed.emit();
          },
          error: () => {
            this.error = 'Неверный логин или пароль.';
          },
        });
      return;
    }

    this.authService
      .register(username, password)
      .pipe(
        switchMap(() => this.authService.login(username, password)),
        finalize(() => (this.isSubmitting = false))
      )
      .subscribe({
        next: () => {
          this.closed.emit();
        },
        error: () => {
          this.error = 'Не удалось зарегистрироваться.';
        },
      });
  }
}
