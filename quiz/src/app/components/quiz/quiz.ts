import {Component, signal, inject} from '@angular/core';
import { Quizinterface } from '../../interfaces/quiz.interface';
import {QuizService} from '../../services/quiz.service';



@Component({
  selector: 'app-quiz',
  imports: [],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
  standalone: true,
})
export class Quiz {

  quizService = inject(QuizService);

  addRandomQuiz() {
    const newQuizzez: Quizinterface = {
      id: Date.now(),
      title: 'Рандомный квиз',
      description: 'loremloremlorem',
      questions: [],
    };
    this.quizService.addQuiz(newQuizzez);
  }
}
