import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-quiz-form',
  imports: [FormsModule],
  templateUrl: './quiz-form.html',
  styleUrl: './quiz-form.scss',
  standalone: true,
})
export class QuizForm {
  name = '';
  description = '';
  error: string | null = null;
  isSubmitting = false;

  constructor(
    private quizService: QuizService,
    private authService: AuthService,
    private router: Router
  ) {}

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  submit() {
    if (!this.isAuthenticated()) {
      this.error = 'Сначала войдите в аккаунт.';
      return;
    }
    const name = this.name.trim();
    const description = this.description.trim();

    if (!name || !description) {
      this.error = 'Заполните название и описание.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.quizService.addQuiz(name, description).subscribe((success) => {
      this.isSubmitting = false;
      if (!success) {
        this.error = 'Не удалось создать квиз.';
        return;
      }
      this.router.navigateByUrl('/');
    });
  }
}
