---
name: front-angular-fab
description: >-
  Skill principal del ecosistema Front Angular de la Fabrica de Software CUN.
  Cubre arquitectura FAB (core/shared/modules), componentes standalone v20+,
  signals, interceptores HTTP funcionales, testing con Jest, migracion
  Jasmine-a-Jest, mocking avanzado con Faker, y convenciones de codigo.
  Activar cuando se cree, analice, extienda o pruebe un proyecto Angular CUN.
license: MIT
---

# Front Angular - Fabrica de Software CUN

## Proposito

Establecer el marco de trabajo para proyectos Angular de la Fabrica de Software CUN.
Aplica arquitectura FAB (Fabrica Architecture Base), componentes standalone, gestion de estado reactiva con signals, testing con Jest y convenciones estrictas de codigo.

## Cuando usar

- Crear un proyecto Angular nuevo para la CUN.
- Analizar o extender un proyecto Angular existente de la CUN.
- Generar o corregir componentes, servicios, guards, interceptores o pipes.
- Escribir, mejorar o corregir pruebas unitarias con Jest.
- Migrar de Jasmine + Karma a Jest.
- Revisar o aplicar convenciones de arquitectura y codigo.

## Principios obligatorios

1. **Separacion de responsabilidades**: `.ts` = logica, `.html` = plantilla, `.css` = estilos. NUNCA inline.
2. **Tipado estricto**: `strict: true`, PROHIBIDO `any`.
3. **Desacoplamiento UI-HTTP**: la UI no llama HTTP directamente; los servicios lo hacen.
4. **Estado reactivo predecible**: signals, computed, httpResource. Sin BehaviorSubject nuevo.
5. **Pruebas obligatorias**: minimo 85% cobertura, casos exitosos y de error.

## Stack tecnologico

| Tecnologia | Proposito |
|---|---|
| Angular 17+ / 20+ | Framework principal (standalone por defecto) |
| Angular Material | Componentes UI base |
| Bootstrap 5 | Grid y utilidades CSS |
| Jest | Testing unitario |
| TypeScript strict | Tipado estricto |
| Faker-js | Mock data determinista |

## Reglas de arquitectura

### Estructura de carpetas FAB

```text
src/
  app/
    core/                    # Infraestructura singleton
      config/interceptors.ts
      interceptors/          # loading, auth, error
    shared/                  # Reutilizable en todos los modulos
      components/            # shared-button, shared-input, spinner, etc.
      directives/
      pipes/
      interfaces/
      mocks/                 # *.mock.ts con Faker-js
      services/              # auth, loading, error-service, status-alert
      utils/                 # custom-validators, form-errors, string-date
    modules/                 # Features de la aplicacion
      [feature]/
        layout/
        routes/
        modules/[sub-feature]/
          components/ views/ services/ interfaces/ mocks/ routes/
    app.routes.ts
    app.config.ts
    app.ts
  environments/
  styles.css
```

### Patrones clave

- **Standalone por defecto**: en Angular v20+, no usar `standalone: true` explicitamente.
- **OnPush siempre**: `changeDetection: ChangeDetectionStrategy.OnPush` en todos los componentes.
- **inject() sobre constructor**: `private readonly http = inject(HttpClient)`.
- **Signals para estado**: `signal()`, `computed()`, `httpResource()`.
- **Lazy loading**: `loadComponent` en rutas.
- **DestroyRef para cleanup**: `takeUntilDestroyed(this.destroy)`.
- **Interceptores funcionales**: `HttpInterceptorFn`.

### Reglas de componentes

- NUNCA inline HTML/CSS en el decorador `@Component`.
- SIEMPRE usar `templateUrl` y `styleUrl`.
- Signal inputs: `input()`, `input.required()`, con `transform`.
- Signal outputs: `output()`, `outputFromObservable()`.
- Proyeccion de contenido solo para layouts reutilizables (cards, modals, panels).
- Sintaxis nativa de control flow: `@if`, `@for`, `@switch`. PROHIBIDO `*ngIf`, `*ngFor`.
- Bindings directos de clase/estilo. PROHIBIDO `ngClass`, `ngStyle`.
- `NgOptimizedImage` para imagenes estaticas.

## Reglas de testing

- **Leer antes de escribir**: el agente DEBE leer `.ts` (y `.html` para componentes) antes de generar tests.
- **APIs modernas**: `provideHttpClient()` + `provideHttpClientTesting()`. PROHIBIDO `HttpClientTestingModule`.
- **httpResource**: `TestBed.tick()` -> `expectOne()` -> `flush()` -> `await whenStable()`.
- **Effects con errores**: simular con `req.flush(..., { status })`, probar positivos y negativos.
- **Mocking centralizado**: factories en `shared/mocks/`, patron `overrides?: Partial<T>`, Faker con `seed()`.
- **Animaciones en Jest**: PROHIBIDO `NoopAnimationsModule` / `BrowserAnimationsModule`. Usar mock.

## Convenciones de codigo

| Tipo | Convencion | Ejemplo |
|---|---|---|
| Componentes | kebab-case.component.ts | `my-component.component.ts` |
| Servicios | kebab-case.service.ts | `auth.service.ts` |
| Interfaces | kebab-case.interface.ts | `user.interface.ts` |
| Mocks | kebab-case.mock.ts | `user.mock.ts` |
| Utils | kebab-case.utils.ts | `form-errors.utils.ts` |
| Tests | *.spec.ts | `auth.service.spec.ts` |

### Orden de imports

1. Angular core / externos
2. Componentes / pipes standalone
3. Terceros
4. Internos `@shared`, `@core`
5. Relativos

### TypeScript

- `strict: true`, `noImplicitOverride: true`, `strictTemplates: true`
- Prefijo `_` para miembros privados mutables: `_itemsControl`
- Interfaces SIN prefijo `I`: `User`, no `IUser`

## Flujo de trabajo

1. Identificar la funcionalidad objetivo.
2. Consultar la referencia correspondiente segun el tema.
3. Aplicar reglas de esta skill antes de implementar.
4. Validar contra criterios de calidad.

## Criterios de calidad

- Coherencia con arquitectura FAB.
- Separacion estricta .ts / .html / .css.
- Cobertura minima 85% con tests deterministas.
- Sin APIs deprecadas (Angular o testing).
- Consistencia de convenciones en nombres e imports.

## Referencia local

| Archivo | Descripcion |
|---|---|
| [01-arquitectura-proyecto.md](reference/01-arquitectura-proyecto.md) | Arquitectura FAB, estructura de carpetas, patrones, servicios obligatorios, guards, environments y checklist de proyecto |
| [02-componentes.md](reference/02-componentes.md) | Componentes standalone v20+, signal inputs/outputs, proyeccion de contenido, hooks, sintaxis de plantilla, NgOptimizedImage |
| [03-patrones-componentes.md](reference/03-patrones-componentes.md) | Patrones avanzados: model inputs, view/content queries, comunicacion, servicios compartidos, @defer, directivas, error boundaries |
| [04-testing-jest.md](reference/04-testing-jest.md) | Reglas de testing con Jest, flujo de generacion, cobertura, animaciones, HTTP, httpResource, effects, mocking |
| [05-migracion-jest.md](reference/05-migracion-jest.md) | Guia de migracion Jasmine + Karma a Jest, dependencias, configuracion, patrones, ejemplo completo |
| [06-mocking-avanzado.md](reference/06-mocking-avanzado.md) | Factory functions, Faker determinista, patron de overrides, mocking de dependencias, anti-patrones |
| [07-http-testing.md](reference/07-http-testing.md) | HttpClient moderno, httpResource, effects con errores, HttpTestingController, casos negativos |
| [08-convenciones-codigo.md](reference/08-convenciones-codigo.md) | TypeScript strict, convencion de archivos, orden de imports, formularios, validacion de templates |
