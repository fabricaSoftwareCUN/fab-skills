# Migracion de Jasmine + Karma a Jest (Angular 22+)

Guia paso a paso para migrar un proyecto Angular de Jasmine + Karma a Jest.

---

## Dependencias a eliminar

Desinstalar todos los paquetes relacionados con Karma y Jasmine:

```bash
npm uninstall \
  karma \
  karma-chrome-launcher \
  karma-coverage \
  karma-jasmine \
  karma-jasmine-html-reporter \
  @types/jasmine \
  jasmine-core
```

---

## Dependencias a agregar

Instalar Jest y sus complementos para Angular:

```bash
npm install --save-dev \
  jest@^30.0.0 \
  jest-preset-angular@^17.0.0 \
  @types/jest@^30.0.0 \
  ts-node@^10.9.0
```

> Las versiones son las exigidas por Angular 22: `jest-preset-angular@17` declara peer
> `@angular/core >=20.0.0 <23.0.0` y `jest ^30.0.0`. Bajar cualquiera de los tres rompe la resolucion.

Para generacion de datos de prueba (opcional pero recomendado):

```bash
npm install --save-dev @faker-js/faker@^10.0.0
```

---

## Archivos de configuracion

### jest.config.ts

Crear en la raiz del proyecto:

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.routes.ts',
    '!src/app/**/index.ts',
    '!src/main.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
};

export default config;
```

### src/setup-jest.ts

Crear el archivo de inicializacion:

```typescript
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv({
  errorOnUnknownElements: true,
  errorOnUnknownProperties: true,
});
```

> **Nota**: se usa `setupZonelessTestEnv` en lugar de `setupZoneTestEnv` porque los proyectos
> operan sin Zone.js. Reservar `setupZoneTestEnv` unicamente para proyectos que aun dependan de Zone.js.

### angular.json

Cambiar el builder de test en `angular.json`:

```json
{
  "projects": {
    "nombre-proyecto": {
      "architect": {
        "test": {
          "builder": "@angular-builders/jest:run",
          "options": {
            "configPath": "jest.config.ts"
          }
        }
      }
    }
  }
}
```

Instalar el builder:

```bash
npm install --save-dev @angular-builders/jest@^22.0.0
```

### package.json scripts

Actualizar la seccion de scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Patrones Jasmine a Jest

### Spies

```diff
- // Jasmine
- spyOn(service, 'getData').and.returnValue(of(mockData));
- expect(service.getData).toHaveBeenCalledTimes(1);

+ // Jest
+ jest.spyOn(service, 'getData').mockReturnValue(of(mockData));
+ expect(service.getData).toHaveBeenCalledTimes(1);
```

Equivalencias de spies:

| Jasmine                          | Jest                              |
|----------------------------------|-----------------------------------|
| `and.returnValue(val)`           | `.mockReturnValue(val)`           |
| `and.returnValues(a, b)`         | `.mockReturnValueOnce(a).mockReturnValueOnce(b)` |
| `and.callFake(fn)`               | `.mockImplementation(fn)`         |
| `and.throwError(err)`            | `.mockImplementation(() => { throw err; })` |
| `createSpy('name')`              | `jest.fn()`                       |
| `createSpyObj('name', ['m'])`    | `{ m: jest.fn() }`               |

### Async testing

```diff
- // Jasmine con fakeAsync
- it('test', fakeAsync(() => {
-   tick();
-   expect(result).toBe(true);
- }));

+ // Jest — usar async/await directamente
+ it('test', async () => {
+   TestBed.tick();
+   await TestBed.inject(ApplicationRef).whenStable();
+   expect(result).toBe(true);
+ });
```

### beforeEach / afterEach

La estructura se mantiene igual, pero agregar limpieza de mocks:

```typescript
afterEach(() => {
  jest.clearAllMocks();
});
```

### Done callback

```diff
- // Jasmine con done
- it('test', (done) => {
-   service.getData().subscribe(data => {
-     expect(data).toBeTruthy();
-     done();
-   });
- });

+ // Jest — preferir async/await
+ it('test', async () => {
+   const data = await firstValueFrom(service.getData());
+   expect(data).toBeTruthy();
+ });
```

---

## Migracion de testing HTTP

### Antes (HttpClientTestingModule — deprecado)

```typescript
// PROHIBIDO en proyectos nuevos
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [MiServicio],
  });
});
```

### Despues (providers modernos)

```typescript
// Enfoque correcto para Angular 16+
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      MiServicio,
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });

  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  httpMock.verify();
});
```

---

## Archivos a eliminar

Despues de completar la migracion, eliminar estos archivos del proyecto:

| Archivo              | Razon                                         |
|----------------------|-----------------------------------------------|
| `karma.conf.js`      | Configuracion de Karma, ya no necesaria        |
| `src/test.ts`        | Bootstrap de Karma/Jasmine, reemplazado por `setup-jest.ts` |
| `src/polyfills.ts`   | Si solo contenia Zone.js para testing          |

Verificar que `tsconfig.spec.json` no referencie archivos eliminados.

---

## Notas importantes

### NoopAnimationsModule prohibido

No importar `NoopAnimationsModule` ni `BrowserAnimationsModule` en tests Jest.
Usar mock directo:

```typescript
{ provide: AnimationBuilder, useValue: {} }
```

### Matchers

| Jasmine                        | Jest                              |
|--------------------------------|-----------------------------------|
| `toEqual(jasmine.any(Number))` | `expect.any(Number)`              |
| `jasmine.objectContaining()`   | `expect.objectContaining()`       |
| `jasmine.arrayContaining()`    | `expect.arrayContaining()`        |
| `toHaveBeenCalledWith()`       | `toHaveBeenCalledWith()` (igual)  |

### Limpieza de mocks

Agregar `jest.clearAllMocks()` en cada `afterEach` para evitar estado residual
entre tests:

```typescript
afterEach(() => {
  jest.clearAllMocks();
  httpMock.verify();
});
```

### Zone.js

Si el proyecto usa `setupZonelessTestEnv`, no es necesario importar `zone.js/testing`.
Eliminar cualquier referencia a Zone.js en archivos de test.

---

## Ejemplo completo antes / despues

### Antes (Jasmine + Karma)

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch users', () => {
    const mockUsers = [{ id: 1, name: 'Ana' }];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

### Despues (Jest + Angular 22+)

```typescript
import { TestBed, ApplicationRef } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { createMockUser } from '@shared/mocks/user.mock';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    jest.clearAllMocks();
    httpMock.verify();
  });

  it('debe obtener la lista de usuarios', async () => {
    const mockUsers = [createMockUser({ id: 1, name: 'Ana' })];

    // Disparar la peticion (si usa httpResource)
    TestBed.tick();

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);

    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.usersResource.value()).toEqual(mockUsers);
  });

  it('debe manejar error HTTP 500', async () => {
    TestBed.tick();

    const req = httpMock.expectOne('/api/users');
    req.flush(
      { message: 'Error interno del servidor' },
      { status: 500, statusText: 'Internal Server Error' }
    );

    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.usersResource.error()).toBeTruthy();
  });
});
```
