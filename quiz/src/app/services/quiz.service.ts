import {computed, Injectable, signal} from '@angular/core';
import {Quizinterface} from '../interfaces/quiz.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizService {

  private quizzesSignal = signal<Quizinterface[]>([
    { id: 1, title: 'Основы JavaScript', description: 'Проверка базовых знаний синтаксиса', questions: [] },
    { id: 2, title: 'Angular для начинающих', description: 'Компоненты, сервисы и сигналы', questions: [] },
    { id: 3, title: 'HTML и CSS', description: 'Верстка и стилизация веб-страниц', questions: [] },
    { id: 4, title: 'TypeScript', description: 'Типизация и интерфейсы', questions: [] },
    { id: 5, title: 'Git и GitHub', description: 'Работа с системой контроля версий', questions: [] },
    { id: 6, title: 'Node.js', description: 'Серверная разработка на JS', questions: [] },
    { id: 7, title: 'SQL базы данных', description: 'Запросы и структура таблиц', questions: [] },
    { id: 8, title: 'React vs Angular', description: 'Сравнение популярных фреймворков', questions: [] }
  ]);


  currentPage = signal(1);
  itemsPerPage = signal(4);
  totalPageCount = computed(() =>{

    const totalQuizez = this.quizzesSignal().length;

    const perPage: number =  this.itemsPerPage();

    return Math.ceil(totalQuizez / perPage);
  })

  paginatedQuizzes = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage()


    return this.quizzesSignal().slice(startIndex, endIndex);
  })

  nextPage() {
    if (this.currentPage() < this.totalPageCount()) {
      return this.currentPage.set(this.currentPage() + 1);
    }
    }

  prevPage() {
    if (this.currentPage() > 1){
      return this.currentPage.set(this.currentPage() - 1);
    }
  }

  onDelete(id: number) {
    this.quizzesSignal.update(list => {
      return list.filter(quiz => quiz.id !== id);
    });
  }

  addQuiz(newQuiz: Quizinterface) {
    this.quizzesSignal.update(list => {
      return [...list, newQuiz];
    })
  }
}
