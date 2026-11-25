---
name: front-angular-fab
description: >-
  Skill principal del ecosistema Front Angular de la Fabrica de Software CUN.
  Cubre arquitectura core/features/shared/layout, componentes standalone v22+,
  signals, interceptores HTTP funcionales, testing con Jest 30, migracion
  Jasmine-a-Jest, mocking avanzado con Faker, y convenciones de codigo.
  Activar cuando se cree, analice, extienda o pruebe un proyecto Angular CUN.
  Angular 22.3+ es obligatorio y todo trabajo se ejecuta con el Angular CLI:
  servidor MCP angular-cli para descubrimiento, estandares, documentacion y
  ejecucion de targets; binario ng para generacion de codigo.
license: MIT
---

# Front Angular - Fabrica de Software CUN

## Proposito

Establecer el marco de trabajo para proyectos Angular de la Fabrica de Software CUN.
Aplica arquitectura core/features/shared/layout, componentes standalone, gestion de estado reactiva con signals, testing con Jest y convenciones estrictas de codigo.

## Cuando usar

- Crear un proyecto Angular nuevo para la CUN.
- Analizar o extender un proyecto Angular existente de la CUN.
- Generar o corregir componentes, servicios, guards, interceptores o pipes.
- Escribir, mejorar o corregir pruebas unitarias con Jest.
- Migrar de Jasmine + Karma a Jest.
- Revisar o aplicar convenciones de arquitectura y codigo.

## Principios obligatorios

1. **Separacion de responsabilidades**: `.ts` = logica, `.html` = plantilla, `.scss` = estilos. NUNCA inline.
2. **Tipado estricto**: `strict: true`, PROHIBIDO `any`.
3. **Desacoplamiento UI-HTTP**: la UI no llama HTTP directamente; los servicios lo hacen.
4. **Estado reactivo predecible**: signals, computed, httpResource. Sin BehaviorSubject nuevo para estado global.
5. **Pruebas obligatorias**: gate bloqueante de 70% en codigo nuevo (SonarQube); objetivo recomendado 85% global.
6. **Version minima Angular 22.3**: proyecto nuevo por debajo de 22.3 esta prohibido; proyecto existente por debajo de 22.3 no bloquea el trabajo pero genera advertencia de no conformidad y deuda registrada.

## Uso obligatorio del Angular CLI

Prohibido crear a mano lo que el CLI genera con un schematic: componentes, servicios, guards, interceptores, pipes y directivas se generan siempre con `ng generate`.

### Jerarquia de herramientas

| Necesidad | Herramienta obligatoria |
|---|---|
| Descubrir workspace, proyectos, builders, prefix, framework y test runner | MCP `list_projects` — primera accion, siempre |
| Estandares del framework para la version exacta | MCP `get_best_practices(workspacePath)` — antes de escribir o modificar codigo |
| Consulta de API o concepto | MCP `search_documentation(query, version)` |
| build, test, lint, e2e | MCP `run_target` |
| serve | MCP `devserver_start` -> `devserver_wait_for_build` (tras **cada** cambio) -> `devserver_stop` |
| Migracion a OnPush o zoneless | MCP `onpush_zoneless_migration` (solo lectura, un paso por llamada) |
| Crear workspace, generar codigo, actualizar version, anadir librerias | Binario `ng`: `new`, `generate`, `update`, `add` |
| Descubrir schematics de un paquete | `ng generate <paquete>: --help` |

**Precedencia ante conflicto**: esta skill gobierna unicamente lo que la normativa Outline no regula. La normativa Outline (copiada en [09-politica-despliegue.md](reference/09-politica-despliegue.md) y en este archivo) gobierna despliegue, ramas, versiones, cobertura y estructura. API, sintaxis y comportamiento del framework los manda `get_best_practices` / `search_documentation`, que son especificos de version.

**Degradacion sin MCP**: si el servidor `angular-cli` no esta disponible se usa `ng` en shell manteniendo el orden — `ng version` y lectura de `angular.json` en lugar de `list_projects`. Nunca se omite el descubrimiento previo.

### Verificacion de version (primera accion)

- Entorno del agente: `ng version` debe reportar CLI 22.3 o superior. Si no, `npm i -g @angular/cli@latest`.
- Proyecto: `list_projects` devuelve `frameworkVersion`. Si es menor que 22.3, el proyecto no cumple; la accion correctiva es `ng update @angular/core@22 @angular/cli@22`, registrada como deuda.

### Defaults obligatorios de schematics

Los defaults del CLI no coinciden con las reglas FAB. Sin fijarlos, `ng generate` produce codigo que viola esta skill en silencio.

```bash
ng new <app> --style=scss --routing --prefix=<prefijo> --file-name-style-guide=2016
```

- `--file-name-style-guide=2016` produce `my-component.component.ts`. El default `2025` genera `my-component.ts`, incompatible con las convenciones de nombrado de FAB.
- `--ai-config` acepta `claude-code`, `cursor`, `gemini-cli`, `none`, `open-ai-codex` y `vscode`. La eleccion es del equipo.
- `--test-runner` solo admite `karma` y `vitest`, con default `vitest`. **Jest no es una opcion del CLI**: el proyecto se crea con el runner disponible y se migra segun [05-migracion-jest.md](reference/05-migracion-jest.md).

Tras `ng new`, fijar los defaults en `angular.json` para que todo `ng generate` posterior herede las reglas FAB:

```json
"schematics": {
  "@schematics/angular:component": {
    "type": "component",
    "style": "scss",
    "changeDetection": "OnPush"
  }
}
```

Verificacion posterior con `list_projects`: si `styleLanguage` no es `scss` o `unitTestFramework` no es `jest`, el proyecto no cumple esta skill.

## Stack tecnologico

| Tecnologia | Version minima | Proposito |
|---|---|---|
| Angular (`@angular/core`, `@angular/cli`) | 22.3 | Framework principal (standalone por defecto) |
| Node.js | 26 LTS | Runtime de desarrollo y build |
| TypeScript | 6.0 (>=6.0 <6.1) | Tipado estricto. **No usar TypeScript 7** |
| Angular Material | ultima estable | Componentes UI base |
| Bootstrap 5 | ultima estable | Grid y utilidades CSS |
| Jest | 30 | Testing unitario |
| `jest-preset-angular` | 17 | Preset Jest para Angular (peer: Angular 20-22, Jest 30, jsdom >= 26) |
| Cypress | 16 | E2E (propiedad de QA) |
| ESLint | 10 | Linting con flat config `eslint.config.js` |
| `angular-eslint` | 22 | Reglas ESLint para Angular |
| Faker-js | ultima estable | Mock data determinista |

**Regla transversal**: verificar la version exacta con `npm view <paquete> version` antes de instalar y fijar la version exacta en manifiesto y lockfile.

## Reglas de arquitectura

### Un repositorio por tecnologia

**Monorepo prohibido.** El frontend vive en su propio repositorio `<proyecto>-front` y no comparte repositorio con el backend (`<proyecto>-back`) ni con el agente ADK (`<proyecto>-adk`). La frontera es la tecnologia, no el numero de proyectos: un workspace Angular con la app y sus librerias Angular sigue siendo el repositorio de front y es valido; alojar en el mismo repositorio codigo NestJS o el agente ADK, no lo es. Proyecto nuevo planteado como monorepo: bloqueado. Proyecto existente que ya es monorepo: no bloquea el trabajo, pero se declara no conformidad y se registra la deuda de separacion en TASKS.md.

### Estructura de carpetas

```text
src/
  app/
    core/                    # singletons: auth, guards, interceptors, services globales, config
      guards/
      interceptors/
      services/
      models/
    features/<feature>/      # lazy loaded: components/ views/ services/ interfaces/ mocks/ <feature>.routes.ts
    shared/                  # components, directives, pipes, interfaces, mocks (Faker), utils
    layout/                  # header, footer, sidebar, nav
    app.routes.ts
    app.config.ts
    app.component.ts              # con --file-name-style-guide=2016 el CLI genera app.component.*, no app.ts
  assets/                    # images, fonts, icons
  environments/              # environment.ts, environment.prod.ts (sin secretos)
  styles.scss
```

> La carpeta `modules/` de FAB fue reemplazada por `features/` conforme a STACK 4.1.

### Patrones clave

- **Standalone por defecto**: en Angular v22+, no usar `standalone: true` explicitamente.
- **OnPush siempre**: `changeDetection: ChangeDetectionStrategy.OnPush` en todos los componentes.
- **inject() sobre constructor**: `private readonly http = inject(HttpClient)`.
- **Signals para estado**: `signal()`, `computed()`, `httpResource()`. `BehaviorSubject` solo para estado local simple ya existente; prohibido para estado global nuevo. NgRx o similar solo con justificacion del Tech Lead.
- **Lazy loading**: `loadComponent` / `loadChildren` en rutas para todas las features.
- **DestroyRef para cleanup**: `takeUntilDestroyed(this.destroy)`.
- **Interceptores funcionales**: `HttpInterceptorFn`.
- **Control de flujo moderno**: `@for` con `track` (cumple el requisito de `trackBy` de STACK 4.4). PROHIBIDO `*ngIf`, `*ngFor` (deprecados desde Angular 20).
- **Budgets en `angular.json`**: definir limites de tamano para bundles.
- **Produccion**: `aot: true` y `optimization: true` en `angular.json`.
- **Imagenes**: `NgOptimizedImage` para imagenes estaticas.
- **Telemetria**: eventos de Google Analytics / GTM y Core Web Vitals conforme a STACK 7.3 y CHECK 4.

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
- **Cobertura**: gate bloqueante de 70% en codigo nuevo medido por SonarQube en la canalizacion; objetivo recomendado del equipo 85% global en lineas y ramas.
- **E2E**: Cypress 16, propiedad de QA. Ver [04-testing-jest.md](reference/04-testing-jest.md) y [09-politica-despliegue.md](reference/09-politica-despliegue.md).

## Convenciones de codigo

| Tipo | Convencion | Ejemplo |
|---|---|---|
| Componentes | kebab-case.component.ts | `my-component.component.ts` |
| Servicios | kebab-case.service.ts | `auth.service.ts` |
| Interfaces | kebab-case.interface.ts | `user.interface.ts` |
| Mocks | kebab-case.mock.ts | `user.mock.ts` |
| Utils | kebab-case.utils.ts | `form-errors.utils.ts` |
| Tests | *.spec.ts | `auth.service.spec.ts` |

Patron general: `feature.type.ts` en kebab-case, consistente con `--file-name-style-guide=2016`.

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

### ESLint

Configuracion plana obligatoria en `eslint.config.js` (ESLint 10 no soporta `.eslintrc.json`). Ver [08-convenciones-codigo.md](reference/08-convenciones-codigo.md).

## Flujo de trabajo

0. Ejecutar `list_projects` y `get_best_practices(workspacePath)`. Verificar que el proyecto esta en Angular 22.3 o superior.
0.b. Si el proyecto no existe, crearlo con `ng new` segun los flags normativos y fijar el bloque `schematics` en `angular.json`.
0.c. Gate de especificacion: si la tarea introduce o modifica capacidad funcional, exige antes PRD, historia de usuario o especificacion escrita, y aplica Spec-Driven Development conforme a la skill `spec-driven-dev`.
1. Identificar la funcionalidad objetivo.
2. Consultar la referencia correspondiente segun el tema.
3. Aplicar reglas de esta skill antes de implementar.
4. Validar contra criterios de calidad.

## Reglas de despliegue

- Flujo estandar: `DESARROLLO -> QA -> STG -> PRO`, progresivo y unidireccional.
- El proyecto DEBE incluir un `Dockerfile` funcional con la imagen publica AWS del Tech Lead.
- Incluir configuracion de **SonarQube** (`sonar-project.properties`) y `main.yml` para CI/CD.
- `.gitignore` conforme a R10: `docker-compose.yml`, `docker-compose.*.yml`, `compose.yml`, `compose.*.yml`, `*.sh`, `.env`, `.env.*`.
- Variables de entorno en formato `.txt` con bloques `ENVS NUEVAS / ENVS MODIFICADAS / ENVS ELIMINADAS`. Angular usa `environments/` sin secretos.
- Ramas por ambiente: `develop`, `qa`, `stg`, `main`. Ramas efimeras: `<tipo>/<ID_HU>-<slug-kebab>`.
- Versionamiento SemVer con sufijos por rama; tag `vX.Y.Z` en `main` creado automaticamente por CI.
- Cobertura: gate bloqueante 70% codigo nuevo (SonarQube); objetivo 85% global.
- La URL del frontend debe estar registrada en el inventario de aplicaciones.
- PRO solo en lunes habil (R1); si el lunes no es habil, el siguiente dia habil. Martes a viernes, fines de semana y festivos requieren excepcion.
- **R2 Autorizaciones**: QA y STG: responsable del proceso (solicitud al Tech Lead). PRO lunes habil: flujo estandar con aprobacion del QA en el hilo de correo y checklist aprobado por el Tech Lead, o solicitud directa del Coordinador por el canal debido. PRO martes a viernes: Vicerrector de Servicios Digitales. PRO sabado, domingo o festivo: autorizacion correspondiente (POL-DEP 28), bajo la autorizacion general del Vicerrector para toda excepcion al calendario (POL-DEP 11). Hotfix critico: Coordinador de la Fabrica.
- **R6 Origen y destino**: `feature`, `bugfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config` salen de `develop` y vuelven a `develop` por PR. `hotfix` sale de `main` y vuelve a `main` y a `develop`. Promocion: `develop -> qa -> stg -> main`, siempre por PR. Ramas permanentes protegidas, sin commits directos. Rama efimera se elimina tras el merge.
- **R7 Requisitos de PR**: al menos un revisor del equipo; Tech Lead obligatorio en cambios de arquitectura y en todo PR hacia `stg` y `main`; CI en verde (lint, unitarias, SonarQube); descripcion con el que y el porque, enlazada a la HU. DevOps verifica el checklist antes de `stg` y `main`.
- Consultar la referencia completa: [09-politica-despliegue.md](reference/09-politica-despliegue.md).

## Criterios de calidad

- El frontend vive en su propio repositorio `<proyecto>-front`; no comparte repositorio con back ni con el agente ADK.
- Coherencia con arquitectura core/features/shared/layout.
- Separacion estricta .ts / .html / .scss.
- Angular 22.3 o superior.
- Codigo generado con schematics del CLI, no escrito a mano.
- `angular.json` contiene el bloque `schematics` con `type`, `style` y `changeDetection`.
- Cobertura: gate 70% codigo nuevo (SonarQube); objetivo 85% global.
- Sin APIs deprecadas (Angular o testing).
- Consistencia de convenciones en nombres e imports.
- Proyecto incluye `Dockerfile`, `sonar-project.properties` y `main.yml`.
- `.gitignore` conforme a R10.
- Variables de entorno sanitizadas segun politica de despliegue.
- Lazy loading para todas las features.
- `@for` con `track` en listas.
- Budgets, `aot` y `optimization` en `angular.json`.
- Telemetria (Google Analytics / GTM y Core Web Vitals) configurada.

## Fuentes normativas

| Codigo | Documento | URL | Ultima edicion |
|---|---|---|---|
| POL-DEP | POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001, v1.0) | https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU | 2026-09-14 |
| PROC-DEP | Politica de despliegue para aplicaciones | https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw | 2026-09-14 |
| VER | Politica de Versionamiento (v1.0.0) | https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC | 2025-12-09 |
| CHECK | Checklist - Paso a produccion de App | https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP | 2026-05-21 |
| QA-MET | QA: Metodologia de Trabajo | https://vsdocs.cunapp.pro/doc/qa-metodologia-de-trabajo-JGQS4SnlYm | 2026-07-30 |
| STACK | Estandares, Arquitectura y Stack Tecnologico (v2.0) | https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ | 2026-07-29 |
| INV | Lista de aplicaciones (inventario) | https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm | — |

Fecha de alineacion: 2026-11-25.

## Referencia local

| Archivo | Descripcion |
|---|---|
| [01-arquitectura-proyecto.md](reference/01-arquitectura-proyecto.md) | Arquitectura, estructura de carpetas core/features/shared/layout, patrones, servicios obligatorios, guards, environments, budgets y checklist de proyecto |
| [02-componentes.md](reference/02-componentes.md) | Componentes standalone v22+, signal inputs/outputs, proyeccion de contenido, hooks, sintaxis de plantilla, NgOptimizedImage |
| [03-patrones-componentes.md](reference/03-patrones-componentes.md) | Patrones avanzados: model inputs, view/content queries, comunicacion, servicios compartidos, @defer, directivas, error boundaries |
| [04-testing-jest.md](reference/04-testing-jest.md) | Reglas de testing con Jest 30, flujo de generacion, cobertura R9, animaciones, HTTP, httpResource, effects, mocking, Cypress 16 E2E |
| [05-migracion-jest.md](reference/05-migracion-jest.md) | Guia de migracion Jasmine + Karma a Jest 30, dependencias, configuracion, patrones, ejemplo completo |
| [06-mocking-avanzado.md](reference/06-mocking-avanzado.md) | Factory functions, Faker determinista, patron de overrides, mocking de dependencias, anti-patrones |
| [07-http-testing.md](reference/07-http-testing.md) | HttpClient moderno, httpResource, effects con errores, HttpTestingController, casos negativos |
| [08-convenciones-codigo.md](reference/08-convenciones-codigo.md) | TypeScript strict, convencion de archivos, orden de imports, ESLint flat config, formularios, validacion de templates |
| [09-politica-despliegue.md](reference/09-politica-despliegue.md) | Politica de despliegue CUN: flujo, ramas, versionamiento, Dockerfile, CI/CD, variables de entorno, proceso de solicitud, calendario, checklist produccion |
