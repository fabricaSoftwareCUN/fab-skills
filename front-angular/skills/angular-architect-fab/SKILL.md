---
name: angular-architect-fab
description: Senior Angular architecture specialist for FAB (Fabrica Architecture Base) projects. Responsible for designing, generating, analyzing and extending Angular 17+ enterprise applications following CUN architectural conventions. Applies standalone architecture, scalable feature modularization, shared UI patterns, signals-based reactive state management, provider-based HTTP configuration, reusable mock strategies, strict typing, Jest testing standards, form validation utilities, interceptor orchestration, environment isolation and maintainable folder structures. Ensures consistency, scalability, testability and long-term maintainability across the entire Angular ecosystem.
---

# Angular Architect FAB - Skill

## Purpose

This skill guides the creation of Angular web projects using the **FAB Architecture** (Factory Architecture Base). An agent should use this skill to generate, analyze, or extend Angular projects from the CUN stack.

---

## STechnology Stack

| Technology        | Purpose                                |
| ----------------- | -------------------------------------- |
| Angular 17+       | Main framework (standalone components) |
| Angular Material  | Core UI components                     |
| Bootstrap 5       | Grid and CSS utilities                 |
| Jest              | Unit testing                           |
| TypeScript strict | Strict typing                          |

---

## Folder Structure

```
src/
├── app/
│   ├── core/                          # Infraestructura singleton
│   │   ├── config/
│   │   │   └── interceptors.ts        # Registro de interceptores HTTP
│   │   └── interceptors/
│   │       ├── loading/               # Spinner interceptor (request counter)
│   │       ├── auth/                  # Token injection + 401 refresh
│   │       └── error/                 # 5xx error handling
│   │
│   ├── shared/                        # Reutilizable en todos los módulos
│   │   ├── components/
│   │   │   ├── shared-button/
│   │   │   ├── shared-input/
│   │   │   ├── shared-select/
│   │   │   ├── shared-datepicker/
│   │   │   ├── spinner/
│   │   │   └── template-modal-alert/
│   │   ├── directives/
│   │   ├── pipes/
│   │   │   └── form-control.pipe.ts   # [formControl]="control | formControl"
│   │   ├── interfaces/
│   │   │   ├── auth.interface.ts
│   │   │   ├── user.interface.ts
│   │   │   └── ...
│   │   ├── mocks/
│   │   │   └── *.mock.ts              # Faker-js factories
│   │   ├── services/
│   │   │   ├── auth/                  # AuthService (token management)
│   │   │   ├── loading/               # Loading signal service
│   │   │   ├── error-service/         # Error handling
│   │   │   └── status-alert/          # SweetAlert custom alerts
│   │   └── utils/
│   │       ├── custom-validators.ts
│   │       ├── form-errors.ts
│   │       └── string-date.utils.ts
│   │
│   ├── modules/                       # Features de la aplicación
│   │   └── [feature-name]/
│   │       ├── layout/
│   │       │   └── [feature]-layout/  # Shell component (header + router-outlet + footer)
│   │       ├── routes/
│   │       │   └── [feature].routes.ts
│   │       └── modules/
│   │           ├── [sub-feature]/
│   │           │   ├── components/
│   │           │   ├── views/
│   │           │   ├── services/
│   │           │   ├── interfaces/
│   │           │   ├── mocks/
│   │           │   └── routes/
│   │           └── [sub-feature]/
│   │
│   ├── app.routes.ts                 # Rutas principales (Lazy loading)
│   ├── app.config.ts                 # Providers globales
│   └── app.ts                        # Componente raíz
│
├── environments/
│   └── environments.ts               # URLs de APIs, configs externas
└── styles.css                       # Estilos globales
```

---

## Rules

### Separation of Concerns Rule in Angular Components

Angular components must follow a strict separation of responsibilities to maintain a clean, scalable, and maintainable architecture.

Each file has a single responsibility:

- `.ts` → component logic and behavior
- `.html` → structure and template markup
- `.css` / `.scss` → visual styles

Avoid mixing logic, templates, and styles in the same file.  
Inline templates and inline styles should not be used for production components except for minimal demos or temporary prototypes.

This rule ensures:

- Better readability
- Easier maintenance
- Cleaner code reviews
- Improved scalability
- Consistent project structure
- Better collaboration between developers and AI agents

For validation patterns, see: [references/rules/components/component.md](references/rules/components/component.md).

## Architectural Patterns

### 1. Standalone Components

```typescript
@Component({
  selector: "app-my-component",
  standalone: true,
  imports: [CommonModule, MatButtonModule, FormControlPipe],
  templateUrl: "./my-component.html",
  styleUrl: "./my-component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent implements OnInit {
  private readonly service = inject(MyService);
}
```

### 2. Signal-Based State Management

```typescript
@Injectable({ providedIn: "root" })
export class MyService {
  // Writable signal con prefijo _ para mutable
  private readonly _itemsControl = signal<Item[]>([]);

  // Readonly accessor
  public readonly items: Signal<Item[]> = this._itemsControl.asReadonly();

  // Computed signal para estado derivado
  public readonly itemCount: Signal<number> = computed(
    () => this._itemsControl().length,
  );

  // httpResource para HTTP automático
  private readonly itemsResource = httpResource<Item[]>(
    () => `${this.url}/items`,
    { defaultValue: [] },
  );
}
```

### 3. Functional HTTP Interceptors

**loading.interceptor.ts:**

```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(Loading);
  loading.show();
  return next(req).pipe(finalize(() => loading.hide()));
};
```

**auth.interceptor.ts:**

```typescript
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  if (isAuthApi(req.url)) {
    return next(req);
  }

  const token = auth.getToken();
  const authReq = req.clone({
    headers: req.headers.set("Authorization", `Bearer ${token}`),
  });

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return auth.refreshToken().pipe(
          switchMap((newToken) =>
            next(
              req.clone({
                headers: req.headers.set("Authorization", `Bearer ${newToken}`),
              }),
            ),
          ),
        );
      }
      if (error.status >= 500) {
        inject(ErrorService).handle(error);
      }
      return throwError(() => error);
    }),
  );
};
```

### 4. Lazy-Loaded Routes

```typescript
// [feature].routes.ts
export const MyFeatureRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../views/my-feature/my-feature").then(
        (m) => m.MyFeatureComponent,
      ),
  },
];

// app.routes.ts
export const routes: Routes = [
  { path: "", redirectTo: "feature", pathMatch: "full" },
  ...MyFeatureRoutes,
  { path: "**", redirectTo: "feature" },
];
```

### 5. Layout con Hijos

```typescript
{
  path: 'feature',
  component: FeatureLayoutComponent,
  canActivate: [authGuard],
  children: [
    ...SubFeatureRoutes,
    { path: '**', redirectTo: 'sub-feature' }
  ]
}
```

### 6. inject() Over Constructor

```typescript
@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly appConfig = inject(APP_CONFIG);
}
```

### 7. DestroyRef para Cleanup

```typescript
export class MyComponent implements OnInit {
  private readonly destroy = inject(DestroyRef);

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroy)).subscribe();
  }
}
```

### 8. lastValueFrom para HTTP

```typescript
async getItems(): Promise<void> {
  try {
    const data = await lastValueFrom(
      this.http.get<Item[]>(`${this.url}/items`)
    );
    this._itemsControl.set(data);
  } catch (e) {
    this._itemsControl.set([]);
    if (e instanceof HttpErrorResponse) {
      controlAlertHttp(e);
    }
  }
}
```

---

## Coding Conventions

### TypeScript

- `strict: true`
- `noImplicitOverride: true`
- `strictTemplates: true`
- DO NOT use `any`
- Use the `_` prefix for writable private members: `_itemsControl`
- Interfaces WITHOUT the “I” prefix: `User`, not `IUser`

### Files

| Type       | Convention              | Example                     |
| ---------- | ----------------------- | --------------------------- |
| Components | PascalCase.component.ts | `my-component.component.ts` |
| Services   | PascalCase.service.ts   | `auth.service.ts`           |
| Interfaces | PascalCase.interface.ts | `user.interface.ts`         |
| Mocks      | PascalCase.mock.ts      | `user.mock.ts`              |
| Utils      | kebab-case.utils.ts     | `form-errors.utils.ts`      |
| Pipes      | PascalCase.pipe.ts      | `form-control.pipe.ts`      |
| Tests      | \*.spec.ts              | `auth.service.spec.ts`      |
| Templates  | kebab-case.html         | `my-component.html`         |

### Imports (order)

1. Angular core/external
2. Standalone Angular components/pipes
3. Third-party imports
4. Internal `@shared`, `@core`
5. Relative imports

---

## Mock Pattern

```typescript
// user.mock.ts
import { faker } from "@faker-js/faker";

faker.seed(123);

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  ...overrides,
});

export const createMockUsers = (count: number = 5): User[] =>
  Array.from({ length: count }, () => createMockUser());
```

---

## Required Core Services

### AuthService

- `login(credentials): Promise<TokenResponse>`
- `logout(): void`
- `getToken(): string`
- `refreshToken(): Observable<Token>`
- `isAuthenticated(): boolean`

### LoadingService

```typescript
// signals-based
const _loading = signal(false);
export const loading = _loading.asReadonly();
export const show = () => _loading.set(true);
export const hide = () => _loading.set(false);
```

### ErrorService

- `handle(error: HttpErrorResponse): void`
- `handleAlertHttp(error: HttpErrorResponse): void`

---

## Guards

| Guard                  | Purpose                        |
| ---------------------- | ------------------------------ |
| `auth.guard.ts`        | Protects authenticated routes  |
| `auth-logged.guard.ts` | Redirects if already logged in |
| `role.guard.ts`        | Role-based access              |

```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(["/login"]);
};
```

---

## Environments

```typescript
export const environment = {
  production: false,
  cdn: "https://apicdn.cunapp.pro/fabrica-utils",
  apiBase: {
    url: "https://api.example.com/api/v1",
    username: "USER",
    password: "PASS",
  },
  // ... Project-specific APIs
};
```

---

## Testing

### Jest Setup

- Use `@faker-js/faker` for mocks
- `jest.clearAllMocks()` in `afterEach`
- `httpMock.verify()` to verify requests
- Mocks in `**/*.mock.ts`

### Test Pattern

```typescript
describe("MyService", () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), MyService],
    });
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it("should fetch items", () => {
    const mockItems = createMockItems();

    service.getItems();

    const req = httpMock.expectOne("/api/items");
    req.flush(mockItems);

    expect(service.items()).toEqual(mockItems);
  });
});
```

---

## Form Validation

Use shared utilities in `@shared/utils/form/form-errors.ts`:

```typescript
// Template
<div *ngIf="isInvalidField('email', form)">
  {{ getFieldError('email', form) }}
</div>

// Do not access control.errors directly
```

---

## Common Angular Material Components

- `MatIconModule` - Icons
- `MatButtonModule` - Buttons
- `MatInputModule` - Inputs
- `MatSelectModule` - Select elements
- `MatPaginatorModule` - Pagination
- `MatExpansionModule` - Expandable panels
- `MatCheckboxModule` - Checkboxes
- `MatChipsModule` - Chips
- `MatDialogModule` - Dialogs
- `MatSnackBarModule` - Notifications

---

## List of Patterns to Implement per Project

When creating a new project, verify:

- [ ] Folder structure according to template
- [ ] Loading interceptor (request counter)
- [ ] Auth interceptor (token injection + 401 refresh)
- [ ] Error interceptor (5xx handling)
- [ ] AuthService with token management
- [ ] LoadingService with signals
- [ ] ErrorService with SweetAlert
- [ ] FormControlPipe
- [ ] Shared components (button, input, select, spinner, modal-alert)
- [ ] Guards (auth, auth-logged)
- [ ] Environments.ts with project APIs
- [ ] Lazy-loaded routes
- [ ] Layout component with header/footer
- [ ] OnPush in all components
- [ ] Mocks with faker-js
- [ ] Jest configured

---

## Required Project Context

To create a specific project, please provide:

1. **Project name**
2. **Brief description**
3. **List of APIs** (URLs, credentials)
4. **List of modules/features**
5. **External integrations** (Firebase, Zoho, etc.)
6. **Required shared components**
7. **Specific guards**
8. **Main routes**
9. **Additional rules** (if applicable)
