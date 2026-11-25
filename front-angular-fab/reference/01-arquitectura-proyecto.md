# Arquitectura de Proyecto Angular - Fabrica de Software CUN

Referencia arquitectonica para proyectos Angular de la Fabrica de Software CUN.
Basada en STACK 4.1 (Estandares, Arquitectura y Stack Tecnologico) y adaptada al contexto institucional.

## Stack tecnologico

| Tecnologia | Version minima | Proposito |
|---|---|---|
| Angular (`@angular/core`, `@angular/cli`) | 22.3 | Framework principal (componentes standalone) |
| Node.js | 26 LTS | Runtime de desarrollo y build |
| TypeScript | 6.0 (>=6.0 <6.1) | Tipado estricto. **No usar TypeScript 7** |
| Angular Material | ultima estable | Componentes UI base |
| Bootstrap 5 | ultima estable | Grid y utilidades CSS |
| Jest | 30 | Testing unitario |
| `jest-preset-angular` | 17 | Preset Jest para Angular |
| Cypress | 16 | E2E (propiedad de QA) |
| ESLint | 10 | Linting con flat config |
| `angular-eslint` | 22 | Reglas ESLint para Angular |

**Regla transversal**: verificar la version exacta con `npm view <paquete> version` antes de instalar y fijar la version exacta en manifiesto y lockfile.

## Estructura de carpetas

```text
src/
├── app/
│   ├── core/                    # singletons: auth, guards, interceptors, services globales, config
│   │   ├── guards/
│   │   │   ├── auth.guard.ts
│   │   │   ├── auth-logged.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── interceptors/
│   │   │   ├── loading.interceptor.ts
│   │   │   └── auth.interceptor.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── loading.service.ts
│   │   │   ├── error.service.ts
│   │   │   └── telemetry.service.ts
│   │   ├── models/
│   │   │   └── user.model.ts
│   │   └── core.config.ts
│   ├── features/                # lazy loaded, una carpeta por funcionalidad
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── views/
│   │   │   ├── services/
│   │   │   ├── interfaces/
│   │   │   ├── mocks/
│   │   │   └── auth.routes.ts
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── views/
│   │   │   ├── services/
│   │   │   ├── interfaces/
│   │   │   ├── mocks/
│   │   │   └── dashboard.routes.ts
│   │   └── users/
│   │       ├── components/
│   │       │   ├── user-list/
│   │       │   └── user-detail/
│   │       ├── views/
│   │       ├── services/
│   │       ├── interfaces/
│   │       ├── mocks/
│   │       └── users.routes.ts
│   ├── shared/                  # reutilizable en toda la app
│   │   ├── components/
│   │   │   ├── shared-button/
│   │   │   ├── shared-input/
│   │   │   ├── spinner/
│   │   │   └── loading-spinner/
│   │   ├── directives/
│   │   ├── pipes/
│   │   ├── interfaces/
│   │   ├── mocks/               # *.mock.ts con Faker-js
│   │   ├── services/
│   │   └── utils/
│   ├── layout/                  # header, footer, sidebar, nav
│   │   ├── header/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   └── layout.component.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.component.ts         # con --file-name-style-guide=2016 el CLI genera app.component.*, no app.ts
├── assets/
│   ├── images/
│   ├── fonts/
│   └── icons/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles.scss
```

> La carpeta `modules/` de FAB fue reemplazada por `features/` conforme a STACK 4.1.

## Patrones arquitectonicos

### 1. Componentes standalone

Los componentes se crean como standalone por defecto. No se usa `standalone: true` explicitamente en Angular v22+.

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
})
export class ExampleComponent {
  // Logica del componente
}
```

### 2. Gestion de estado con signals

```typescript
import { Component, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  private http = inject(HttpClient);

  // Estado local con signal
  searchTerm = signal('');
  selectedUser = signal<User | null>(null);

  // Recurso HTTP reactivo
  usersResource = httpResource<User[]>(() => ({
    url: '/api/users',
    params: { search: this.searchTerm() },
  }));

  // Valor computado derivado
  filteredUsers = computed(() => {
    const users = this.usersResource.value() ?? [];
    const term = this.searchTerm().toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(term));
  });

  totalUsers = computed(() => this.filteredUsers().length);
}
```

> `BehaviorSubject` solo para estado local simple ya existente; prohibido para estado global nuevo. NgRx o similar solo con justificacion del Tech Lead.

### 3. Interceptores HTTP funcionales

#### Loading interceptor

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  loadingService.show();
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
```

#### Auth interceptor con refresh token

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return authService.refreshToken().pipe(
          switchMap((newToken) => {
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
```

### 4. Rutas con lazy loading

Todas las features usan lazy loading via `loadComponent` o `loadChildren`.

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authLoggedGuard } from './core/guards/auth-logged.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [authLoggedGuard],
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/users/users.routes').then(m => m.USERS_ROUTES),
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
```

### 5. Layout con hijos

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.routes').then(m => m.USERS_ROUTES),
      },
    ],
  },
];
```

### 6. inject() sobre constructor

Usar siempre `inject()` en lugar de inyeccion por constructor.

```typescript
// CORRECTO
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
}

// INCORRECTO - No usar inyeccion por constructor
export class UserService {
  constructor(
    private http: HttpClient,       // NO
    private router: Router,         // NO
    private authService: AuthService // NO
  ) {}
}
```

### 7. DestroyRef para cleanup

```typescript
import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';

@Component({
  selector: 'app-live-feed',
  templateUrl: './live-feed.component.html',
  styleUrl: './live-feed.component.scss',
})
export class LiveFeedComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    interval(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshFeed());
  }

  private refreshFeed() {
    // Logica de actualizacion
  }
}
```

### 8. lastValueFrom para HTTP

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  async getUsers(): Promise<User[]> {
    return lastValueFrom(this.http.get<User[]>(this.apiUrl));
  }

  async getUserById(id: string): Promise<User> {
    return lastValueFrom(this.http.get<User>(`${this.apiUrl}/${id}`));
  }

  async createUser(user: CreateUserDto): Promise<User> {
    return lastValueFrom(this.http.post<User>(this.apiUrl, user));
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    return lastValueFrom(this.http.put<User>(`${this.apiUrl}/${id}`, user));
  }

  async deleteUser(id: string): Promise<void> {
    return lastValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}
```

### 9. Control de flujo moderno

Usar `@for` con `track` (cumple el requisito de `trackBy` de STACK 4.4). PROHIBIDO `*ngIf`, `*ngFor` (deprecados desde Angular 20).

```html
@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
} @empty {
  <p>No hay usuarios para mostrar</p>
}
```

### 10. Budgets en angular.json

```json
{
  "projects": {
    "mi-proyecto": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "aot": true,
              "optimization": true,
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "2mb",
                  "maximumError": "5mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kb",
                  "maximumError": "10kb"
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

### 11. Telemetria

Servicio de telemetria en `core/services/telemetry.service.ts` para eventos de Google Analytics / GTM y Core Web Vitals.

```typescript
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private router = inject(Router);

  trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, params);
    }
  }

  trackPageView(url: string): void {
    if (typeof gtag !== 'undefined') {
      gtag('config', 'GA_MEASUREMENT_ID', { page_path: url });
    }
  }
}
```

## Servicios obligatorios

### AuthService

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  private currentUser = signal<User | null>(null);
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.tokenSignal());

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        this.tokenSignal.set(response.token);
        this.currentUser.set(response.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.tokenSignal.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.token);
          this.tokenSignal.set(response.token);
        }),
        map((response) => response.token)
      );
  }
}
```

### LoadingService

```typescript
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private requestCount = signal(0);

  readonly isLoading = computed(() => this.requestCount() > 0);

  show(): void {
    this.requestCount.update(count => count + 1);
  }

  hide(): void {
    this.requestCount.update(count => Math.max(0, count - 1));
  }
}
```

### ErrorService

```typescript
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private snackBar = inject(MatSnackBar);

  handle(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[ErrorService]', error);
    this.snackBar.open(message, 'Cerrar', { duration: 5000 });
  }

  handleAlertHttp(error: HttpErrorResponse): void {
    let message: string;

    switch (error.status) {
      case 0:
        message = 'Sin conexion al servidor';
        break;
      case 400:
        message = error.error?.message ?? 'Solicitud invalida';
        break;
      case 401:
        message = 'No autorizado';
        break;
      case 403:
        message = 'Acceso denegado';
        break;
      case 404:
        message = 'Recurso no encontrado';
        break;
      case 500:
        message = 'Error interno del servidor';
        break;
      default:
        message = `Error HTTP: ${error.status}`;
    }

    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
```

## Guards

| Guard | Proposito |
|---|---|
| `auth.guard.ts` | Protege rutas que requieren autenticacion |
| `auth-logged.guard.ts` | Redirige al dashboard si el usuario ya tiene sesion activa |
| `role.guard.ts` | Restringe acceso segun el rol del usuario |

### Ejemplo de authGuard

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
```

### Ejemplo de authLoggedGuard

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authLoggedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
```

### Ejemplo de roleGuard

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.user();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    return router.createUrlTree(['/dashboard']);
  };
};
```

## Environments

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Mi Proyecto CUN',
  version: '1.0.0',
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.miproyecto.cun.edu.co/api',
  appName: 'Mi Proyecto CUN',
  version: '1.0.0',
};
```

> Los archivos en `environments/` nunca contienen secretos. Las credenciales y keys sensibles se gestionan via variables de entorno del contenedor o CI/CD.

## Angular Material - Modulos comunes

Modulos de Angular Material utilizados con frecuencia en proyectos CUN:

```typescript
// Importar en cada componente standalone segun necesidad
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
```

## Checklist de nuevo proyecto

Verificacion obligatoria al iniciar un proyecto Angular para la Fabrica de Software CUN:

1. [ ] Proyecto creado con `ng new` usando `--style=scss`, `--routing` y `--file-name-style-guide=2016`
2. [ ] Angular 22.3 o superior verificado con `ng version` y `list_projects`
3. [ ] Node.js 26 LTS verificado con `node --version`
4. [ ] TypeScript 6.0 verificado con `npx tsc --version` (>=6.0 <6.1, **no** 7)
5. [ ] Bloque `schematics` en `angular.json` con `type: component`, `style: scss` y `changeDetection: OnPush`
6. [ ] TypeScript configurado en modo `strict`
7. [ ] Estructura de carpetas `core/`, `features/`, `shared/`, `layout/` creada
8. [ ] Angular Material instalado y tema configurado
9. [ ] Bootstrap 5 instalado (solo grid y utilidades)
10. [ ] Jest 30 + `jest-preset-angular` 17 configurados como test runner
11. [ ] ESLint 10 + `angular-eslint` 22 con `eslint.config.js` (flat config)
12. [ ] Cypress 16 instalado para E2E
13. [ ] Archivos de environment creados (`environment.ts`, `environment.prod.ts`) sin secretos
14. [ ] `AuthService` implementado con login, logout, getToken, refreshToken
15. [ ] `LoadingService` implementado con signals
16. [ ] `ErrorService` implementado con handle y handleAlertHttp
17. [ ] `TelemetryService` implementado para Google Analytics / GTM y Core Web Vitals
18. [ ] Interceptor de loading configurado
19. [ ] Interceptor de autenticacion con refresh token configurado
20. [ ] Guards de autenticacion (`authGuard`, `authLoggedGuard`) implementados
21. [ ] Guard de roles (`roleGuard`) implementado
22. [ ] Rutas principales configuradas con lazy loading (`loadComponent` / `loadChildren`)
23. [ ] Layout base con header, sidebar y footer creado en `layout/`
24. [ ] Budgets configurados en `angular.json`
25. [ ] `aot: true` y `optimization: true` en configuracion de produccion
26. [ ] `Dockerfile` con imagen AWS del Tech Lead
27. [ ] `sonar-project.properties` y `main.yml` presentes
28. [ ] `.gitignore` conforme a R10
