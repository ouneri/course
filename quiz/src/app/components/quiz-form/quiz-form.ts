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
  questions: { options: string[] }[] = [{ options: ['', ''] }];
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

  addQuestion() {
    this.questions.push({ options: ['', ''] });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addOption(questionIndex: number) {
    this.questions[questionIndex].options.push('');
  }

  removeOption(questionIndex: number, optionIndex: number) {
    this.questions[questionIndex].options.splice(optionIndex, 1);
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

    if (this.questions.length === 0) {
      this.error = 'Добавьте хотя бы один вопрос.';
      return;
    }

    const preparedQuestions = this.questions.map((question) => ({
      options: question.options.map((option) => option.trim()).filter(Boolean),
    }));

    const hasInvalidOptions = preparedQuestions.some(
      (question) => question.options.length < 2
    );

    if (hasInvalidOptions) {
      this.error = 'В каждом вопросе должно быть минимум 2 варианта.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.quizService.addQuiz(name, description, preparedQuestions).subscribe((success) => {
      this.isSubmitting = false;
      if (!success) {
        this.error = 'Не удалось создать квиз.';
        return;
      }
      this.router.navigateByUrl('/');
    });
  }
}
