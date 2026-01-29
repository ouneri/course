import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';

type QuestionFormSelect = { type: 'select'; options: string[] };
type QuestionFormText = { type: 'text'; placeholder: string };
type QuestionForm = QuestionFormSelect | QuestionFormText;

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
  questions: QuestionForm[] = [{ type: 'select', options: ['', ''] }];
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

  addQuestion(type: 'select' | 'text') {
    if (type === 'select') {
      this.questions.push({ type: 'select', options: ['', ''] });
    } else {
      this.questions.push({ type: 'text', placeholder: '' });
    }
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addOption(questionIndex: number) {
    const q = this.questions[questionIndex];
    if (q.type === 'select') {
      q.options.push('');
    }
  }

  removeOption(questionIndex: number, optionIndex: number) {
    const q = this.questions[questionIndex];
    if (q.type === 'select' && q.options.length > 2) {
      q.options.splice(optionIndex, 1);
    }
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

    const preparedItems: ({ type: 'select'; options: string[] } | { type: 'text'; placeholder: string })[] = [];

    for (const question of this.questions) {
      if (question.type === 'select') {
        const options = question.options.map((o) => o.trim()).filter(Boolean);
        if (options.length < 2) {
          this.error = 'В вопросе с выбором варианта должно быть минимум 2 варианта.';
          return;
        }
        preparedItems.push({ type: 'select', options });
      } else {
        const placeholder = question.placeholder.trim();
        if (!placeholder) {
          this.error = 'У текстового вопроса заполните подсказку (placeholder).';
          return;
        }
        preparedItems.push({ type: 'text', placeholder });
      }
    }

    this.isSubmitting = true;
    this.error = null;

    this.quizService.addQuiz(name, description, preparedItems).subscribe((success) => {
      this.isSubmitting = false;
      if (!success) {
        this.error = 'Не удалось создать квиз.';
        return;
      }
      this.router.navigateByUrl('/');
    });
  }
}
