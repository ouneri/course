import { Component, effect, inject } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { Quizinterface } from '../../interfaces/quiz.interface';



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
  selectedOptions: Record<string, string> = {};
  activeQuiz: Quizinterface | null = null;
  showThankYou = false;

  constructor() {
    effect(() => {
      if (this.authService.isAuthenticated()) {
        this.quizService.loadQuizzes();
      }
    });
  }

  optionKey(quizId: number, itemId: number) {
    return `${quizId}:${itemId}`;
  }

  optionGroupName(quizId: number, itemId: number) {
    return `quiz-${quizId}-item-${itemId}`;
  }

  openQuiz(quiz: Quizinterface) {
    this.activeQuiz = quiz;
    this.showThankYou = false;
  }

  closeQuiz() {
    this.activeQuiz = null;
  }

  selectOption(quizId: number, itemId: number, option: string) {
    this.selectedOptions[this.optionKey(quizId, itemId)] = option;
  }

  isSelected(quizId: number, itemId: number, option: string) {
    return this.selectedOptions[this.optionKey(quizId, itemId)] === option;
  }

  handleOptionSelect(quiz: Quizinterface, itemId: number, option: string) {
    this.selectOption(quiz.id, itemId, option);
    if (!this.isQuizCompleted(quiz)) {
      return;
    }

    const quizzes = this.quizService.paginatedQuizzes();
    const currentIndex = quizzes.findIndex((item) => item.id === quiz.id);
    const nextQuiz = currentIndex >= 0 ? quizzes[currentIndex + 1] : null;

    if (nextQuiz) {
      this.openQuiz(nextQuiz);
      return;
    }

    this.closeQuiz();
    this.showThankYou = true;
  }

  private isQuizCompleted(quiz: Quizinterface) {
    if (quiz.items.length === 0) {
      return true;
    }
    return quiz.items.every((item) => {
      const key = this.optionKey(quiz.id, item.id);
      return Boolean(this.selectedOptions[key]);
    });
  }

  totalQuizzes() {
    return this.quizService.paginatedQuizzes().length;
  }

  currentQuizIndex(quiz: Quizinterface) {
    return this.quizService
      .paginatedQuizzes()
      .findIndex((item) => item.id === quiz.id);
  }

  quizProgressPercent(quiz: Quizinterface) {
    const total = this.totalQuizzes();
    const index = this.currentQuizIndex(quiz);
    if (total <= 0 || index < 0) {
      return 0;
    }
    return Math.round(((index + 1) / total) * 100);
  }
}
