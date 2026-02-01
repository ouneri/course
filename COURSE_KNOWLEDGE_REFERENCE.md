# Справочник по курсу: технологии и приёмы для собеседования

Документ составлен по проекту course-main. Здесь собраны концепции, которые ты использовал в квизе (Angular + .NET), в портфолио (TypeScript + Vite) и в бэкенде (Clean Architecture, Docker). Каждый раздел можно использовать для повторения перед собеседованием.

---

## 1. Angular

### 1.1. Standalone-компоненты

**Что это:** Компоненты без NgModule — объявляют `standalone: true` и сами перечисляют `imports` (модули или другие standalone-компоненты/директивы/пайпы).

**Где у тебя:** Все компоненты в `quiz/` — `Quiz`, `QuizForm`, `AuthModal`, `App`.

**Пример:**
```typescript
@Component({
  selector: 'app-quiz',
  imports: [FormsModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
  standalone: true,
})
export class Quiz { ... }
```

**На собеседовании:** Standalone упрощает дерево модулей, позволяет импортировать только нужное и удобен для ленивой загрузки маршрутов.

---

### 1.2. Signals (signal, computed)

**Что это:** Реактивное примитивное значение. `signal(initial)` — хранилище; `computed(() => ...)` — производное значение; вызов `signal()` в шаблоне или в `computed` подписывается на изменения.

**Где у тебя:** `AuthService` (userId, isAuthenticated), `QuizService` (quizzes, totalCount, isLoading, error, totalPageCount, paginatedQuizzes).

**Пример:**
```typescript
private userIdSignal = signal<number | null>(null);
isAuthenticated = computed(() => this.userIdSignal() !== null);
userId = computed(() => this.userIdSignal());
// обновление:
this.userIdSignal.set(response.userId);
```

**На собеседовании:** Signals дают точечные обновления без Zone.js, меньше лишних проверок изменений и хорошо сочетаются с `effect()` и новым control flow.

---

### 1.3. inject()

**Что это:** Функция внедрения зависимостей: получаешь сервис без конструктора. Удобно в полях класса и в функциях (inject-only context).

**Где у тебя:** `Quiz` (QuizService, AuthService), `AuthService` (HttpClient).

**Пример:**
```typescript
export class Quiz {
  quizService = inject(QuizService);
  authService = inject(AuthService);
}
```

**На собеседовании:** `inject()` можно вызывать только в определённых контекстах (конструктор, инициализатор полей, фабрика провайдера). В остальных местах — классический constructor DI.

---

### 1.4. effect()

**Что это:** Побочный эффект при изменении прочитанных внутри signals. Запускается после рендера; по умолчанию не синхронный.

**Где у тебя:** В `Quiz` — при смене `isAuthenticated()` вызывается `loadQuizzes()`.

**Пример:**
```typescript
constructor() {
  effect(() => {
    if (this.authService.isAuthenticated()) {
      this.quizService.loadQuizzes();
    }
  });
}
```

**На собеседовании:** В effect нельзя синхронно менять signal — иначе возможна бесконечная петля. Для инициализации данных при появлении условия (как у тебя с авторизацией) — типичный кейс.

---

### 1.5. Роутинг (Router, Routes, routerLink)

**Что это:** Маршрутизация по URL. `Routes` задаёт path → component; `routerLink` и `Router.navigateByUrl` — переходы; `RouterOutlet` — место для подключаемого компонента.

**Где у тебя:** `app.routes.ts` ('' → Quiz, 'create' → QuizForm), `app.html` (routerLink, router-outlet), `provideRouter(routes)` в `app.config.ts`.

**Пример:**
```typescript
export const routes: Routes = [
  { path: '', component: Quiz },
  { path: 'create', component: QuizForm },
];
```

**На собеседовании:** Роуты регистрируются через `provideRouter`. Lazy load — `loadComponent: () => import('...')`. Guard'ы и resolve — для проверки доступа и предзагрузки данных.

---

### 1.6. HttpClient и withCredentials

**Что это:** Сервис для HTTP-запросов. `withCredentials: true` отправляет и сохраняет cookies (нужно для cookie-based auth и CORS с credentials).

**Где у тебя:** Все вызовы API в `AuthService` и `QuizService` с `{ withCredentials: true }`.

**Пример:**
```typescript
this.http.get<AuthMeResponse>(`${API_BASE_URL}/api/auth/me`, { withCredentials: true })
```

**На собеседовании:** Без `withCredentials` браузер не шлёт cookies на другой origin. На бэкенде при этом должен быть CORS с `AllowCredentials()` и конкретный `WithOrigins` (не `*`).

---

### 1.7. RxJS (pipe, операторы)

**Что это:** Библиотека реактивных потоков. `Observable` + операторы в `pipe()` для трансформации, обработки ошибок и побочных эффектов.

**Где у тебя:** В `AuthService` и `QuizService`: `tap`, `map`, `catchError`, `of`, `switchMap`, `throwError`, `timeout`, `finalize`.

**Кратко по операторам:**
- **tap** — побочный эффект (логирование, set signal), данные проходят дальше без изменений.
- **map** — преобразование каждого элемента.
- **catchError** — обработать ошибку и вернуть новый Observable (например `of(null)` или `of(false)`).
- **switchMap** — переключиться на другой Observable (например после login вызвать refreshSession).
- **timeout** — ошибка, если поток не выдал значение за заданное время.
- **finalize** — выполнить код при завершении или ошибке (например выключить isSubmitting).
- **of** — создать Observable из значения.
- **throwError** — Observable, который сразу выдаёт ошибку.

**На собеседовании:** Разница между switchMap, mergeMap, concatMap, exhaustMap (отмена, параллельность, порядок). Подписки нужно отменять (unsubscribe или использование async pipe / takeUntilDestroyed).

---

### 1.8. Формы (FormsModule, ngModel)

**Что это:** Template-driven формы: двусторонний биндинг через `[(ngModel)]`, не нужна явная форма в коде (в отличие от Reactive Forms).

**Где у тебя:** `AuthModal` (логин/пароль), `QuizForm` (название, описание, вопросы/варианты), `Quiz` (текстовые ответы, выбранные варианты).

**Пример:**
```html
<input type="text" [(ngModel)]="username" name="username" />
```

**На собеседовании:** Для ngModel нужен `name` (или NgModel с именем). Reactive Forms (FormBuilder, FormGroup, FormControl) дают больше контроля и удобны для сложной валидации и динамических полей.

---

### 1.9. @Input и @Output (EventEmitter)

**Что это:** `@Input()` — свойство, задаётся снаружи; `@Output()` — EventEmitter для события наружу.

**Где у тебя:** `AuthModal`: `@Input() mode`, `@Output() closed`.

**Пример:**
```typescript
@Input() mode: AuthMode = 'login';
@Output() closed = new EventEmitter<void>();
close() {
  this.closed.emit();
}
```

**В шаблоне родителя:**
```html
<app-auth-modal [mode]="authMode" (closed)="closeAuth()"></app-auth-modal>
```

**На собеседовании:** Односторонний биндинг данных вниз (`[prop]`), события вверх (`(event)`). EventEmitter под капотом — Observable.

---

### 1.10. Новый синтаксис шаблонов (@if, @for, track)

**Что это:** Управление потоком в шаблоне без *ngIf / *ngFor. `@if (condition) { ... }`, `@for (item of list; track item.id) { ... }`, при необходимости `@else`.

**Где у тебя:** Во всех шаблонах quiz: списки квизов, вопросы, варианты, модалки, сообщения об ошибках.

**Пример:**
```html
@if (authService.isAuthenticated()) {
  <div class="quiz-container">...</div>
} @else {
  <p>Сначала войдите.</p>
}

@for (item of quizService.paginatedQuizzes(); track item.id) {
  <div class="quiz-card">...</div>
} @empty {
  <p>Квизы не найдены.</p>
}
```

**На собеседовании:** `track` обязателен в @for для производительности (как в *ngFor). Новый синтаксис не требует импорта CommonModule для этих директив.

---

### 1.11. ApplicationConfig и провайдеры

**Что это:** Конфигурация приложения через объект с `providers`. В твоём проекте — роутер и HttpClient.

**Где у тебя:** `app.config.ts`.

**Пример:**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

**На собеседовании:** Вместо NgModule с imports/declarations — набор провайдеров. `provideHttpClient()` даёт HttpClient; для interceptors есть `withInterceptors()`.

---

### 1.12. Стили компонентов (styleUrl, SCSS)

**Что это:** Стили, замкнутые на компонент (scoped). Подключение через `styleUrl` (один файл) или `styles` (массив строк). В проекте используется SCSS (переменные, вложенность).

**Где у тебя:** У каждого компонента свой `.scss`: `quiz.scss`, `quiz-form.scss`, `auth-modal.scss`, `app.scss`.

**На собеседовании:** View encapsulation (Emulated по умолчанию — атрибуты на хосте). Глобальные стили — в `styles.scss` или в корневом компоненте.

---

## 2. TypeScript

### 2.1. Интерфейсы и типы

**Что это:** Описание формы объекта. `interface` — расширяемый контракт; `type` — псевдоним типа, может быть union/intersection.

**Где у тебя:** `quiz.interface.ts` (Quizinterface, QuizItemSelect, QuizItemText), интерфейсы API в сервисах (PagedResult, QuizApiModel и т.д.), в portfolio_web — skill.interface, theme.interface.

**Пример:**
```typescript
export interface Quizinterface {
  id: number;
  title: string;
  description: string;
  items: QuizItem[];
}
```

**На собеседовании:** Когда использовать type vs interface. Readonly, optional (`?`), index signatures.

---

### 2.2. Union-типы (Discriminated union)

**Что это:** Значение может быть одним из нескольких типов. У тебя — «размеченное» объединение по полю `type`: разные поля в зависимости от типа.

**Где у тебя:** `QuizItem = QuizItemSelect | QuizItemText`, в форме вопросов — select vs text.

**Пример:**
```typescript
export type QuizItemSelect = { id: number; type: 'select'; options: string[] };
export type QuizItemText = { id: number; type: 'text'; placeholder: string };
export type QuizItem = QuizItemSelect | QuizItemText;
// в коде:
if (item.type === 'select') {
  item.options; // OK
} else {
  item.placeholder; // OK
}
```

**На собеседовании:** TypeScript сужает тип по проверке поля (type guard). Так удобно описывать полиморфные данные из API.

---

## 3. .NET / C# Backend (Clean Architecture)

### 3.1. Слои приложения

**Что это:** Разделение на Domain, Application, Infrastructure, Web.API.

- **Domain** — сущности и интерфейсы репозиториев, без зависимостей от фреймворков.
- **Application (Use Cases)** — интерфейсы и реализации сценариев, зависят только от Domain.
- **Infrastructure** — реализация репозиториев и сервисов (БД, память, внешние API).
- **Web.API** — контроллеры, модели запросов/ответов, фильтры, middleware; зависит от Application и Infrastructure.

**Где у тебя:** Папки CMQuiz.Domain, CMQuiz.Application, CMQuiz.Infrastructure, CMQuiz.Web.API.

**На собеседовании:** Зависимости направлены внутрь: API → Application → Domain. Infrastructure реализует интерфейсы из Domain/Application. Так бизнес-логика не привязана к БД и HTTP.

---

### 3.2. Use Cases (сценарии)

**Что это:** Один сценарий = один интерфейс + реализация. Метод вида `ExecuteAsync(Request)` возвращает результат. Контроллер только вызывает use case и маппит в HTTP-модель.

**Где у тебя:** ILoginUseCase, IRegisterUseCase, IGetQuizzesUseCase, ICreateQuizUseCase и т.д. в Application; реализации в UseCases.

**Пример:**
```csharp
public interface ILoginUseCase
{
    Task<string?> ExecuteAsync(LoginRequest request);
}
```

**На собеседовании:** Use case инкапсулирует шаги (проверка пользователя, создание сессии). Тестировать можно без контроллеров, подменяя репозитории.

---

### 3.3. Репозитории (Repository pattern)

**Что это:** Абстракция доступа к данным. Интерфейс в Domain (например IUserRepository), реализация в Infrastructure (InMemoryUserRepository). Приложение не знает, откуда берутся данные.

**Где у тебя:** IUserRepository, IQuizRepository, IQuizResponseRepository; InMemory* реализации.

**Пример:**
```csharp
public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User> CreateAsync(User user);
    Task<User?> GetByIdAsync(int id);
}
```

**На собеседовании:** Репозиторий = «коллекция в памяти» с методами Get/Create/Update/Delete. Удобно подменять in-memory на EF Core или другой источник без смены use case.

---

### 3.4. ASP.NET Core Controllers

**Что это:** Классы с атрибутами маршрутизации и методами действий. [ApiController] включает автоматическую модель валидации и ответы 400. [Route("api/...")], [HttpGet], [HttpPost], [FromBody], [FromQuery].

**Где у тебя:** AuthController, QuizController, QuizResponseController.

**На собеседовании:** Разница между [FromBody], [FromQuery], [FromRoute]. Возврат ActionResult<T> даёт типизированный результат и коды (Ok, NotFound, Unauthorized, Conflict).

---

### 3.5. Фильтры (Authorization Filter)

**Что это:** Код, выполняемый до или после действия. IAuthorizationFilter проверяет доступ; при неудаче задаёт context.Result (например UnauthorizedObjectResult), и действие не выполняется.

**Где у тебя:** AuthorizeFilter — читает cookie sessionId, проверяет через SessionService, при успехе заполняет HttpContext.User (ClaimsPrincipal), иначе 401.

**Пример:**
```csharp
public void OnAuthorization(AuthorizationFilterContext context)
{
    var sessionId = context.HttpContext.Request.Cookies["sessionId"];
    // ...
    context.HttpContext.User = new ClaimsPrincipal(identity);
}
```

**На собеседовании:** Порядок: Authorization → Resource → Action → Exception → Result. Фильтр можно вешать глобально, на контроллер или на действие через атрибут.

---

### 3.6. Кастомный атрибут [Authorize]

**Что это:** Атрибут, который подключает твой AuthorizeFilter к действию или контроллеру. Реализуется через ServiceFilterAttribute.

**Где у тебя:** `[Authorize]` на GetMe и на QuizController, QuizResponseController.

**На собеседовании:** В ASP.NET Core по умолчанию [Authorize] использует политики и JWT/Cookie scheme. У тебя — свой фильтр по cookie и сессиям.

---

### 3.7. Cookie-based аутентификация и сессии

**Что это:** После логина сервер выставляет cookie (sessionId). Дальнейшие запросы отправляют cookie; сервер по sessionId находит userId (в памяти или в хранилище).

**Где у тебя:** AuthController — при успешном login ставит cookie; GetMe и защищённые эндпоинты читают cookie; SessionService хранит sessionId → userId в памяти; logout удаляет cookie и сессию.

**На собеседовании:** HttpOnly cookie недоступна из JS (защита от XSS). SameSite уменьшает риск CSRF. Для мобильных/SPA часто используют JWT в заголовке вместо cookie.

---

### 3.8. CORS (Cross-Origin Resource Sharing)

**Что это:** Браузер блокирует запросы с одного origin (например localhost:4200) на другой (localhost:5000), если сервер не разрешил. CORS-заголовки с сервера разрешают нужные origins, методы и заголовки.

**Где у тебя:** Program.cs — WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:4200"), AllowAnyMethod, AllowAnyHeader, AllowCredentials().

**На собеседовании:** AllowCredentials() и cookie работают только с конкретным WithOrigins (не "*"). Preflight (OPTIONS) запрос браузер шлёт сам при «сложных» запросах.

---

### 3.9. Swagger / OpenAPI

**Что это:** Документация и UI для API. Генерируется из контроллеров и моделей; можно вызывать эндпоинты из браузера.

**Где у тебя:** AddSwaggerGen, UseSwagger, UseSwaggerUI в Program.cs. Доступ по адресу /swagger.

**На собеседовании:** Swagger описывает контракт API (модели, коды ответов). Полиморфные модели (наследование) настраиваются через UseAllOfForInheritance / UseOneOfForPolymorphism.

---

### 3.10. Dependency Injection (AddScoped, регистрация)

**Что это:** Контейнер создаёт и подставляет зависимости. AddScoped — один экземпляр на запрос; AddSingleton — на всё приложение; AddTransient — новый при каждом запросе.

**Где у тебя:** AddInfrastructure() регистрирует репозитории и SessionService; AddScoped для Use Cases и AuthorizeFilter.

**На собеседовании:** Scope = один запрос. Контроллеры и фильтры получают зависимости через конструктор. Интерфейс в одном слое, реализация — в другом, регистрируется в API или Infrastructure.

---

### 3.11. Records, required, init (C#)

**Что это:** record — тип с равенством по значению; `required` — свойство обязательно при инициализации; `init` — сеттер только при инициализации.

**Где у тебя:** Модели и сущности в Domain/Web.API (Quiz, User, QuizItem, DTO).

**На собеседовании:** record подходит для DTO и неизменяемых данных. with-expression для копии с изменениями.

---

### 3.12. Claims и ClaimsPrincipal

**Что это:** Удостоверение пользователя как набор «утверждений» (claim). ClaimsIdentity — набор claims с типом аутентификации; ClaimsPrincipal — один или несколько identity. В фильтре ты заполняешь User для доступа к userId в контроллере.

**Где у тебя:** AuthorizeFilter создаёт Claim(ClaimTypes.NameIdentifier, userId), ClaimsIdentity, ClaimsPrincipal и присваивает context.HttpContext.User.

**На собеседовании:** В контролере: User.FindFirst(ClaimTypes.NameIdentifier)?.Value. Claims используют и для JWT (там claims приходят из токена).

---

## 4. Docker

### 4.1. Dockerfile и многостадийная сборка

**Что это:** Инструкции для образа. Multi-stage: одна стадия (build) компилирует приложение, другая (final) копирует только результат и запускает его — в образ не попадают SDK и исходники.

**Где у тебя:** CMQuiz.Web.API/Dockerfile — base (runtime), build (restore + build), publish, final (копия publish, ENTRYPOINT dotnet).

**Пример:**
```dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ...
RUN dotnet restore ...
RUN dotnet build ...

FROM base AS final
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CMQuiz.Web.API.dll"]
```

**На собеседовании:** Каждая FROM — новая стадия. COPY --from=stage берёт файлы из другой стадии. Итоговый образ содержит только runtime и приложение, что уменьшает размер и поверхность атаки.

---

### 4.2. Docker Compose (compose.yaml)

**Что это:** Описание сервисов и их сборки/запуска. Один файл — образ, порты, переменные, сети.

**Где у тебя:** compose.yaml в CMQuiz: сервис cmquiz, build из Dockerfile, порты 5000:8080.

**Пример:**
```yaml
services:
  cmquiz:
    image: cmquiz
    build:
      context: .
      dockerfile: CMQuiz.Web.API/Dockerfile
    ports:
      - 5000:8080
```

**На собеседовании:** Порты задаются как host:container. context — каталог сборки; при необходимости можно подключать volumes и environment для конфигурации.

---

## 5. Vite (portfolio_web)

### 5.1. Конфигурация (defineConfig, build, server)

**Что это:** Сборщик и dev-сервер. defineConfig — типизированная конфигурация; build.outDir, build.rollupOptions; server.port, server.open.

**Где у тебя:** vite.config.ts — outDir: 'dist', sourcemap, alias (@, @types), server port 3000, open: true.

**На собеседовании:** Vite использует esbuild для dev и Rollup для production. HMR быстрый за счёт нативных модулей. Alias упрощает импорты.

---

## 6. REST API (общее)

### 6.1. Методы и коды ответов

**Что это:** GET — получение; POST — создание/действие. 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 409 Conflict.

**Где у тебя:** login → 200/401, register → 200/409, get quizes → 200, create quiz → 200, и т.д.

**На собеседовании:** Идемпотентность GET; POST для создания ресурса и для операций с телом. 401 — не авторизован, 403 — нет прав. 409 — конфликт (например, пользователь уже есть).

---

### 6.2. Пагинация

**Что это:** Список отдаётся по страницам: параметры pageNumber и pageSize; в ответе — items + totalCount (и при необходимости pageNumber, pageSize).

**Где у тебя:** GET /api/quizes?pageNumber=1&pageSize=10, модель PagedResult<T>.

**На собеседовании:** Нужна для больших списков. Курсорная пагинация (after/before) удобна для бесконечной ленты; offset (pageNumber) — для «страниц».

---

## 7. Краткий чек-лист для собеседования

- **Angular:** Standalone, signals, computed, effect, inject; роутинг; HttpClient + withCredentials; RxJS (tap, map, catchError, switchMap, timeout, finalize); FormsModule, ngModel; @Input/@Output; новый синтаксис @if/@for с track.
- **TypeScript:** Интерфейсы и типы, union-типы, discriminated union по полю type.
- **.NET:** Clean Architecture (Domain, Application, Infrastructure, Web.API); Use Cases; репозитории; контроллеры и атрибуты; фильтр авторизации и [Authorize]; cookie + сессии; CORS с credentials; Swagger; DI (Scoped); records, required, init; ClaimsPrincipal.
- **Docker:** Dockerfile multi-stage; compose.yaml, порты, build.
- **REST:** Методы, коды ответов, пагинация, cookie-based auth.

Удачи на собеседовании.
