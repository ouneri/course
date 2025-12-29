import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {Quiz} from './components/quiz/quiz';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Quiz, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('quiz');
}
