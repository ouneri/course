import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, tap } from 'rxjs';
import { Quizinterface } from '../interfaces/quiz.interface';
import { API_BASE_URL } from './api.config';

interface QuizApiModel {
  id: number;
  name: string;
  description: string;
  items: unknown[];
}

interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private quizzesSignal = signal<Quizinterface[]>([]);
  totalCount = signal(0);
  isLoading = signal(false);
  error = signal<string | null>(null);

  currentPage = signal(1);
  itemsPerPage = signal(4);
  totalPageCount = computed(() => {
    const totalQuizez = this.totalCount();
    const perPage: number = this.itemsPerPage();
    return Math.max(1, Math.ceil(totalQuizez / perPage));
  });

  paginatedQuizzes = computed(() => this.quizzesSignal());

  constructor(private http: HttpClient) {
    this.loadQuizzes();
  }

  nextPage() {
    if (this.currentPage() < this.totalPageCount()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadQuizzes();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadQuizzes();
    }
  }

  loadQuizzes() {
    this.isLoading.set(true);
    this.error.set(null);
    this.http
      .get<PagedResult<QuizApiModel>>(`${API_BASE_URL}/api/quizes`, {
        params: {
          pageNumber: this.currentPage(),
          pageSize: this.itemsPerPage(),
        },
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          if (error?.status === 401) {
            this.error.set('Требуется авторизация для просмотра квизов.');
          } else {
            this.error.set('Не удалось загрузить квизы. Проверьте сервер.');
          }
          this.quizzesSignal.set([]);
          this.totalCount.set(0);
          this.isLoading.set(false);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }
        const items = response.items.map((quiz) => ({
          id: quiz.id,
          title: quiz.name,
          description: quiz.description,
          questions: [],
        }));
        this.quizzesSignal.set(items);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      });
  }

  addQuiz(name: string, description: string) {
    return this.http
      .post<QuizApiModel>(
        `${API_BASE_URL}/api/quizes`,
        {
          name,
          description,
          items: [],
        },
        { withCredentials: true }
      )
      .pipe(
        tap(() => this.loadQuizzes()),
        map(() => true),
        catchError((error) => {
          if (error?.status === 401) {
            this.error.set('Сначала войдите в аккаунт.');
          } else {
            this.error.set('Не удалось создать квиз.');
          }
          return of(false);
        })
      );
  }
}
