import { Component, effect, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
  standalone: true,
})
export class Quiz {

  quizService = inject(QuizService);
  authService = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.quizService.loadQuizzes();
      }
    });
  }
}
