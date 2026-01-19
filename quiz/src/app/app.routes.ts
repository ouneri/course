import { Routes } from '@angular/router';
import { QuizForm } from './components/quiz-form/quiz-form';
import { Quiz } from './components/quiz/quiz';

export const routes: Routes = [
  { path: '', component: Quiz },
  { path: 'create', component: QuizForm },
];
