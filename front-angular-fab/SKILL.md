---
name: front-angular-fab
description: >-
  Skill principal del ecosistema Front Angular de la Fabrica de Software CUN.
  Cubre arquitectura FAB (core/shared/modules), componentes standalone v22+,
  signals, interceptores HTTP funcionales, testing con Jest, migracion
  Jasmine-a-Jest, mocking avanzado con Faker, y convenciones de codigo.
  Activar cuando se cree, analice, extienda o pruebe un proyecto Angular CUN.
  Angular 22+ es obligatorio y todo trabajo se ejecuta con el Angular CLI:
  servidor MCP angular-cli para descubrimiento, estandares, documentacion y
  ejecucion de targets; binario ng para generacion de codigo.
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

1. **Separacion de responsabilidades**: `.ts` = logica, `.html` = plantilla, `.scss` = estilos. NUNCA inline.
2. **Tipado estricto**: `strict: true`, PROHIBIDO `any`.
3. **Desacoplamiento UI-HTTP**: la UI no llama HTTP directamente; los servicios lo hacen.
4. **Estado reactivo predecible**: signals, computed, httpResource. Sin BehaviorSubject nuevo.
5. **Pruebas obligatorias**: minimo 85% cobertura, casos exitosos y de error.
6. **Version minima Angular 22**: proyecto nuevo por debajo de 22 esta prohibido; proyecto existente por debajo de 22 no bloquea el trabajo pero genera advertencia de no conformidad y deuda registrada.

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

**Precedencia ante conflicto**: API, sintaxis y comportamiento del framework los manda `get_best_practices` / `search_documentation`, que son especificos de version. Arquitectura FAB, estructura de carpetas, nombrado, cobertura y despliegue los manda esta skill.

**Degradacion sin MCP**: si el servidor `angular-cli` no esta disponible se usa `ng` en shell manteniendo el orden — `ng version` y lectura de `angular.json` en lugar de `list_projects`. Nunca se omite el descubrimiento previo.

### Verificacion de version (primera accion)

- Entorno del agente: `ng version` debe reportar CLI 22 o superior. Si no, `npm i -g @angular/cli@latest`.
- Proyecto: `list_projects` devuelve `frameworkVersion`. Si es menor que 22, el proyecto no cumple; la accion correctiva es `ng update @angular/core@22 @angular/cli@22`, registrada como deuda.

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

| Tecnologia | Proposito |
|---|---|
| Angular 22+ (obligatorio) | Framework principal (standalone por defecto) |
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
  styles.scss
```

### Patrones clave

- **Standalone por defecto**: en Angular v22+, no usar `standalone: true` explicitamente.
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

0. Ejecutar `list_projects` y `get_best_practices(workspacePath)`. Verificar que el proyecto esta en Angular 22 o superior.
0.b. Si el proyecto no existe, crearlo con `ng new` segun los flags normativos y fijar el bloque `schematics` en `angular.json`.
0.c. Gate de especificacion: si la tarea introduce o modifica capacidad funcional, exige antes PRD, historia de usuario o especificacion escrita, y aplica Spec-Driven Development conforme a la skill `spec-driven-dev`.
1. Identificar la funcionalidad objetivo.
2. Consultar la referencia correspondiente segun el tema.
3. Aplicar reglas de esta skill antes de implementar.
4. Validar contra criterios de calidad.

## Reglas de despliegue

- El proyecto DEBE incluir un `Dockerfile` funcional con la imagen publica AWS del Tech Lead.
- Incluir configuracion de **SonarQube** y `main.yml` para CI/CD.
- `docker-compose.yml` y `*.sh` NUNCA deben subirse al repositorio.
- Variables de entorno a nivel de contenedor/CI en formato `SNAKE_CASE`, sanitizadas y ordenadas.
- La URL del frontend debe estar registrada en el [inventario de aplicaciones](https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm).
- No se despliega a produccion sin [checklist aprobado](https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP).
- **No hay despliegues productivos los viernes** salvo aprobacion extraordinaria.
- Consultar la referencia completa: [09-politica-despliegue.md](reference/09-politica-despliegue.md).

## Criterios de calidad

- Coherencia con arquitectura FAB.
- Separacion estricta .ts / .html / .scss.
- Angular 22 o superior.
- Codigo generado con schematics del CLI, no escrito a mano.
- `angular.json` contiene el bloque `schematics` con `type`, `style` y `changeDetection`.
- Cobertura minima 85% con tests deterministas.
- Sin APIs deprecadas (Angular o testing).
- Consistencia de convenciones en nombres e imports.
- Proyecto incluye `Dockerfile`, `sonar-project.properties` y `main.yml`.
- `docker-compose.yml` y `*.sh` excluidos del repositorio.
- Variables de entorno sanitizadas segun politica de despliegue.

## Referencia local

| Archivo | Descripcion |
|---|---|
| [01-arquitectura-proyecto.md](reference/01-arquitectura-proyecto.md) | Arquitectura FAB, estructura de carpetas, patrones, servicios obligatorios, guards, environments y checklist de proyecto |
| [02-componentes.md](reference/02-componentes.md) | Componentes standalone v22+, signal inputs/outputs, proyeccion de contenido, hooks, sintaxis de plantilla, NgOptimizedImage |
| [03-patrones-componentes.md](reference/03-patrones-componentes.md) | Patrones avanzados: model inputs, view/content queries, comunicacion, servicios compartidos, @defer, directivas, error boundaries |
| [04-testing-jest.md](reference/04-testing-jest.md) | Reglas de testing con Jest, flujo de generacion, cobertura, animaciones, HTTP, httpResource, effects, mocking |
| [05-migracion-jest.md](reference/05-migracion-jest.md) | Guia de migracion Jasmine + Karma a Jest, dependencias, configuracion, patrones, ejemplo completo |
| [06-mocking-avanzado.md](reference/06-mocking-avanzado.md) | Factory functions, Faker determinista, patron de overrides, mocking de dependencias, anti-patrones |
| [07-http-testing.md](reference/07-http-testing.md) | HttpClient moderno, httpResource, effects con errores, HttpTestingController, casos negativos |
| [08-convenciones-codigo.md](reference/08-convenciones-codigo.md) | TypeScript strict, convencion de archivos, orden de imports, formularios, validacion de templates |
| [09-politica-despliegue.md](reference/09-politica-despliegue.md) | Politica de despliegue CUN: Dockerfile, CI/CD, variables de entorno, proceso de solicitud, horarios, checklist produccion |
