# Spec: alineacion de fab-skills con la normativa Outline de la Fabrica de Software CUN

Fecha de alineacion: 2026-11-25. Rama: `feat/alineacion-outline-despliegue`.

## 1. Objetivo

Las skills del catalogo deben reflejar la normativa vigente publicada en Outline (`vsdocs.cunapp.pro`), que es imperativa y la revisa el Tech Lead. Los desarrolladores instalan las skills y `AGENTS_EJEMPLO.md` en su propio harness y **no tienen acceso al MCP de Outline**: todo lo normativo se copia integro en los archivos de las skills, con la URL de origen y la fecha de alineacion. Ninguna skill puede depender de una herramienta MCP para conocer una regla.

Resultado esperado: un desarrollador con una skill instalada deja el proyecto **listo para solicitar despliegue** sin consultar nada fuera de la skill.

## 2. Fuentes normativas (Outline) y fecha de ultima edicion

| Codigo | Documento | URL | Ultima edicion |
|---|---|---|---|
| POL-DEP | POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001, v1.0, Vigente) | https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU | 2026-09-14 |
| PROC-DEP | Politica de despliegue para aplicaciones (procedimiento tecnico de solicitud) | https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw | 2026-09-14 |
| STACK | Estandares, Arquitectura y Stack Tecnologico (v2.0) | https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ | 2026-07-29 |
| QA-MET | QA: Metodologia de Trabajo | https://vsdocs.cunapp.pro/doc/qa-metodologia-de-trabajo-JGQS4SnlYm | 2026-07-30 |
| CHECK | Checklist - Paso a produccion de App | https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP | 2026-05-21 |
| VER | Politica de Versionamiento (v1.0.0) | https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC | 2025-12-09 |
| INV | Lista de aplicaciones (inventario) | https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm | — |

Documentos descartados: "Solicitud de Despliegues en Produccion" (plantilla generica sin adaptar, 2025-09) y "Flujo de desarrollo de aplicaciones" (solo contiene un tablero Figma incrustado).

## 3. Resolucion de conflictos entre documentos

Regla general: ante contradiccion gana el documento con fecha de edicion mas reciente. Cuando dos documentos tratan el mismo tema y uno es la politica dedicada, esta gobierna y el otro se considera informativo.

| # | Tema | Decision | Justificacion |
|---|---|---|---|
| R1 | Ventana de PRO | **Lunes habil**; si el lunes no es habil, el siguiente dia habil. Martes a viernes, fines de semana y festivos requieren excepcion. | POL-DEP (2026-09-14, politica formal) sustituye el "lunes a jueves, nunca viernes" de PROC-DEP. |
| R2 | Autorizaciones | QA y STG: responsable del proceso (solicitud al Tech Lead). PRO lunes habil: flujo estandar con aprobacion del QA en el hilo de correo y checklist aprobado por el Tech Lead, o solicitud directa del Coordinador por el canal debido. PRO martes a viernes: **Vicerrector de Servicios Digitales**. PRO sabado, domingo o festivo: autorizacion correspondiente (§28), bajo la autorizacion general del Vicerrector para toda excepcion al calendario (§11). Hotfix critico: **Coordinador de la Fabrica**. | Matriz §28 y §11 de POL-DEP; canal, copia a QA y alternativa del Coordinador de PROC-DEP, que POL-DEP no contradice. |
| R3 | Flujo de ambientes | `DESARROLLO -> QA -> STG -> PRO`, progresivo y unidireccional. | POL-DEP §5. |
| R4 | Modelo de ramas | **Ramas por ambiente** (VER §5): `develop`, `qa`, `stg`, `main`. GitHub Flow de STACK §8.1 queda sustituido. | GitHub Flow (una sola `main`) no puede representar el flujo de cuatro ambientes que exige POL-DEP, mas reciente. Nombres en minuscula: Git distingue mayusculas y VER los muestra en mayuscula solo como titulo. |
| R5 | Nombre de ramas efimeras | `<tipo>/<ID_HU>-<slug-kebab>`. Ejemplo: `feature/HU-123-login-google`. Tipos: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`. Equivalencias: `epic`->`feature`; `fix`, `bug`, `improve`->`bugfix`. | QA-MET §3 propone `<Asunto>: <ID_HU>-<Titulo_HU>`, invalido en Git (`:` y espacios). Se conserva su catalogo de tipos con el formato de STACK §8.1 y VER §5.2. |
| R6 | Origen y destino | `feature`, `bugfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`: salen de `develop` y vuelven a `develop` por PR. `hotfix`: sale de `main` y vuelve a `main` **y** a `develop`. Promocion: `develop -> qa -> stg -> main`, siempre por PR. Ramas permanentes protegidas, sin commits directos. Rama efimera se elimina tras el merge. | VER §5.2 y §5.3. |
| R7 | Requisitos de PR | Al menos un revisor del equipo; Tech Lead obligatorio en cambios de arquitectura y en todo PR hacia `stg` y `main`; CI en verde (lint, unitarias, Sonar); descripcion con el que y el porque, enlazada a la HU. DevOps verifica el checklist antes de `stg` y `main`. | STACK §8.1 y VER §9. |
| R8 | Versionamiento | SemVer `X.Y.Z`. Sufijos por rama: `-alpha` en `develop`, `-beta` en `qa`, `-rc.N` en `stg`, estable en `main`. Proyecto nuevo inicia en `0.1.0`; primer release publico `1.0.0`. Tag `vX.Y.Z` en `main` creado automaticamente por CI al hacer merge desde `stg` o `hotfix`. `CHANGELOG.md` en formato Keep a Changelog. | VER es la politica dedicada; POL-DEP exige "version identificada"; CHECK y STACK citan SemVer. El esquema `X.Y.Z.P` de QA-MET §4 queda sustituido. |
| R9 | Cobertura | Gate bloqueante: **70 % en codigo nuevo**, medido por SonarQube en la canalizacion. Objetivo recomendado del equipo: 85 % global en lineas y ramas. | CHECK §3.1 es el unico umbral oficial; el 85 % de las skills pasa a objetivo. |
| R10 | `docker-compose.yml` | **No se versiona.** `.gitignore` incluye `docker-compose.yml`, `docker-compose.*.yml`, `compose.yml`, `compose.*.yml`, `*.sh`, `.env`, `.env.*`. El compose de desarrollo local existe solo sin versionar. | PROC-DEP (2026-09-14) prohibe subirlo; STACK §3.5 (2026-07-29) lo pedia. |
| R11 | Variables de entorno | `SNAKE_CASE`, sin espacios, sin comillas innecesarias, ordenadas por categoria. Se envian como adjunto `.txt` con tres bloques: `ENVS NUEVAS`, `ENVS MODIFICADAS`, `ENVS ELIMINADAS`. Nunca en el repositorio. Backend: validacion al arranque con `@nestjs/config` + `class-validator` + `class-transformer`. | PROC-DEP y STACK §3.4. |
| R12 | Observabilidad | Todo backend expone **`GET /metrics`** en formato Prometheus con las cuatro senales de oro (trafico, errores 5xx, latencia p95/p99, saturacion) y metricas de negocio. Grafana para visualizacion. Frontend: eventos de telemetria (Google Analytics / GTM) y Core Web Vitals. | STACK §7; CHECK §4 y §6. Herramientas genericas del checklist (New Relic, Datadog, ELK, Sentry) se sustituyen por el stack oficial. |
| R13 | Estructura backend | Arbol de STACK §3.2 (ver §5.2 de esta spec). Se conservan `infrastructure/common` e `infrastructure/settings` como subcarpetas permitidas que STACK no prohibe. | STACK §3.2 es mandatorio ("todos los proyectos de backend deben seguir la siguiente estructura"). |
| R14 | Estructura frontend | Arbol de STACK §4.1: `core/`, `features/`, `shared/`, `layout/`, `assets/`, `environments/`. La carpeta `modules/` de FAB pasa a `features/`. | STACK §4.1. |
| R15 | Swagger | UI en `/docs/dev-only/swagger`. API versionada bajo prefijo global `/api/v1`. Decoradores obligatorios: `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`. | STACK §3.3: el texto normativo fija la ruta; el fragmento de codigo (`api-docs`) es un ejemplo. |
| R16 | E2E | Cypress para Angular. Playwright se usa solo como MCP de automatizacion de navegador para el agente, no como framework E2E del proyecto. | STACK §8.3. |
| R17 | Estado en Angular | Signals por defecto (`signal`, `computed`, `httpResource`). `BehaviorSubject` permitido unicamente para estado local simple ya existente; prohibido para estado global nuevo. NgRx o similar solo con justificacion del Tech Lead. | STACK §4.2 + practicas de Angular 22. |
| R18 | Control de flujo | `@for (...; track ...)` cumple el requisito de `trackBy` de STACK §4.4. `*ngFor` y `*ngIf` estan deprecados desde Angular 20 y quedan prohibidos. | STACK §4.4 + Angular 22. |
| R19 | ESLint | Configuracion plana `eslint.config.js` compartida y versionada. ESLint 10 no soporta `.eslintrc.json`. | STACK §4.3 pide ESLint compartido; el formato lo impone la version. |
| R20 | Adaptador HTTP de NestJS | Fastify por defecto en proyectos nuevos. Express solo si una dependencia lo exige; la decision se documenta en el README del proyecto. | STACK §3.5. |
| R21 | Repositorios | Un repositorio por tecnologia; monorepo prohibido (ya vigente en 0.16.0). Se mantiene. | AGENTS_EJEMPLO §8. |
| R22 | Accesibilidad | **WCAG 2.2** como referencia unica. Donde CHECK §10 dice "WCAG 2.1" se copia como 2.2 con nota de origen. | QA-MET (2026-07-30) es mas reciente que CHECK (2026-05-21); la skill `ux-design` ya usa 2.2. |
| R24 | Ejecucion del despliegue en ADK | La solicitud sigue PROC-DEP (correo con PR, variables, ambiente). La ejecucion la realiza DevOps o el Tech Lead, bien con `agents-cli deploy`, bien con el workflow `main.yml` cuyo job de despliegue esta protegido por un GitHub Environment con aprobacion manual. El equipo de desarrollo no ejecuta `agents-cli deploy` contra QA, STG ni PRO por su cuenta; puede usarlo contra su entorno de desarrollo. El archivo de referencia de ADK se llama `reference/politica-despliegue.md` (la skill no usa prefijos numericos). | POL-DEP §24 y §26 (la Fabrica gestiona tecnicamente los despliegues); PROC-DEP (canal de solicitud); la skill `google-adk-cun` exige aprobacion humana explicita. |
| R25 | Horario de solicitud | Las solicitudes se envian en dia habil entre 8:00 y 17:00 (PROC-DEP). Tiempos orientativos de atencion: DEV, QA y STG de 1 h a 36 h; PRO de 2 h a 24 h. La **ejecucion** en PRO se programa siempre segun R1; la hora exacta se define por caso (POL-DEP §19). | PROC-DEP "Disposicion horaria" en lo que POL-DEP no sustituye. |
| R26 | Subcarpetas por modulo en backend | El arbol de STACK §3.2 es el minimo. Cuando el proyecto tiene varios modulos se permite `domain/entities/<modulo>/`, `domain/services/<modulo>/`, `domain/ports/out/<modulo>/`, `application/use-cases/<modulo>/`, `application/dtos/<modulo>/`, `infrastructure/adapters/<tipo>/<modulo>/` y `infrastructure/controllers/<modulo>/`. Todos los archivos de la skill describen la misma regla. | STACK §3.2 ya usa `use-cases/user/` y `dtos/user/`. |
| R27 | Ubicacion de los DTOs | Un unico juego de DTOs en `application/dtos/<modulo>/`, decorados con `class-validator` y `@ApiProperty`. `domain` permanece libre de decoradores; `application` puede depender de `class-validator`, `class-transformer` y `@nestjs/swagger` solo en sus DTOs. Los controladores de `infrastructure` reutilizan esos DTOs; no se duplican en infraestructura. | STACK §3.2 (DTOs en `application/dtos`) y §3.3 (`@ApiProperty` obligatorio en los DTOs). |
| R23 | Clasificacion de resultados | `Aprobado` / `Aprobado con observaciones` / `Rechazado` se aplica solo a los resultados de los ambientes QA (POL-DEP §6.4) y STG (§7.4), con dos listas literales separadas. El handoff de feature de `qa-and-testing` mantiene su veredicto `APTO` / `NO APTO`. | POL-DEP clasifica ambientes, no features. |

## 4. Versiones del stack (estables verificadas el 2026-11-25 con `npm view` y PyPI)

| Componente | Version estable | Piso exigido por las skills | Nota |
|---|---|---|---|
| Node.js | 26.13.1 (LTS Krypton) | 26 LTS | Nest 12 exige >= 20; TypeORM 1.1 exige >= 24.11 |
| Angular (`@angular/core`, `@angular/cli`) | 22.3.0 | 22.3 | — |
| TypeScript | 6.0.x | 6.0 | Angular 22.3 exige `>=6.0 <6.1`; Nest CLI 12 usa `~6.0.2`. **No** usar TypeScript 7 |
| NestJS (`@nestjs/core`, `@nestjs/cli`) | 12.6.2 / 12.0.15 | 12 | Sustituye al piso 11 |
| `@nestjs/swagger` | 12.1.2 | 12 | — |
| `@nestjs/config` | 12.1.1 | 12 | — |
| `@nestjs/platform-fastify` | 12.6.2 | 12 | — |
| `@nestjs/typeorm` | 12.0.3 | 12 | peer `typeorm ^0.3.0 || ^1.0.0` |
| TypeORM | 1.1.3 | 1.1 | — |
| `@nestjs/cache-manager` | 12.0.5 | 12 | cache Redis |
| `@willsoto/nestjs-prometheus` | 7.0.0 | 7 | peer `@prometheus-io/client ^0.16` (0.16.1). No usar `prom-client` |
| PostgreSQL | 19 | 19 | — |
| Redis | ultima estable | — | cache |
| Jest | 30.5.2 | 30 | — |
| `jest-preset-angular` | 17.0.3 | 17 | peer Angular 20-22, Jest 30 |
| Cypress | 16.3.0 | 16 | E2E Angular |
| ESLint / `angular-eslint` | 10.15.0 / 22.8.0 | 10 / 22 | flat config |
| `class-validator` | 0.15.1 | 0.15 | — |
| `google-adk` (Python) | 2.15.1 | 2.x | — |
| `google-agents-cli` | 1.16.0 | 1.16 | — |

Regla transversal: las skills fijan el **piso** (version mayor) y exigen verificar la version exacta con `npm view <paquete> version` o `pip index versions` antes de instalar; se fija la version exacta en el manifiesto y lockfile.

## 5. Contenido normativo consolidado (texto que se copia en las skills)

### 5.1 Politica de despliegue (comun a back, front y adk)

Cada skill de dominio lleva un archivo `reference/<NN>-politica-despliegue.md` con estas secciones, en este orden:

1. Encabezado con fuentes (POL-DEP, PROC-DEP, CHECK, INV) y fecha de alineacion.
2. Flujo estandar `DESARROLLO -> QA -> STG -> PRO` y definiciones: QA, STG, PRO, despliegue, rollback, hotfix (criterio de criticidad y lista de lo que **no** es hotfix), despliegue urgente, ventana, freeze.
3. Modelo de ramas y versionamiento (R4 a R8) con tabla rama/ambiente/sufijo.
4. Requisitos tecnicos obligatorios antes de solicitar despliegue:
   - `Dockerfile` funcional con la imagen publica AWS del Tech Lead; build multi-etapa.
   - `sonar-project.properties` y `main.yml` (GitHub Actions) con lint, unitarias, cobertura y analisis Sonar; tag automatico en `main`.
   - `.gitignore` conforme a R10.
   - Variables de entorno conforme a R11.
   - Registro en el inventario (INV): Swagger del backend; URL del frontend; endpoint del agente.
   - Observabilidad conforme a R12 (backend: `/metrics`).
   - Particularidades del dominio (Oracle `instant-client` y host `cundb01` en backend; `environments/` en Angular; `agents-cli deploy` en ADK).
5. Condiciones por ambiente (POL-DEP §6, §7, §8) y clasificacion del resultado: `Aprobado`, `Aprobado con observaciones`, `Rechazado`.
6. Calendario (R1), excepciones (§11), hotfix (§12: autorizacion, informacion minima, flujo), diferencia hotfix vs urgente (§13), freeze (§15), bloqueo automatico (§33).
7. Proceso de solicitud por correo (PROC-DEP): primera vez y subsiguientes, campos obligatorios, formato `.txt` de variables, reglas por ambiente (R2).
8. Rollback (§20) y validacion posterior a PRO (§21).
9. Checklist previo a PRO (POL-DEP §36 integrado con CHECK, filtrado por rol Desarrollador/QA/DevOps/PO) y checklist de hotfix (§37).
10. Matriz de autorizaciones (§28) y matriz de calendario (§29).

### 5.2 Estructura backend (STACK §3.2 + subcarpetas permitidas)

```text
src/
├── main.ts
├── app.module.ts
├── domain/
│   ├── entities/            # clases puras, sin decoradores de ORM
│   ├── ports/
│   │   ├── in/              # opcional: contratos de casos de uso
│   │   └── out/             # contratos de repositorios y servicios externos
│   └── services/            # logica de dominio pura
├── application/
│   ├── use-cases/<modulo>/
│   ├── dtos/<modulo>/
│   └── mappers/
└── infrastructure/
    ├── adapters/            # implementaciones de ports/out (persistence, http, messaging)
    ├── controllers/         # adaptadores de entrada HTTP, Swagger
    ├── persistence/<motor>/entities|migrations
    ├── modules/             # modulos NestJS que cablean dependencias
    ├── settings/            # ConfigModule, validacion de env, conexion DB, logger
    └── common/              # guards, interceptors, decorators, pipes, utils, metrics
```

Reglas: dependencias `Infrastructure -> Application -> Domain`; `domain` sin NestJS, ORM, validadores ni Swagger; TypeORM con migraciones, `synchronize: false` siempre; `@nestjs/config` con clase de validacion; prefijo `/api/v1`; Swagger en `/docs/dev-only/swagger`; `/metrics` via `@willsoto/nestjs-prometheus`; Fastify por defecto; `CacheModule` con Redis cuando aplique; `tsconfig` de produccion con `removeComments` y sin `sourceMap`.

### 5.3 Estructura frontend (STACK §4.1 adaptado a FAB)

```text
src/
├── app/
│   ├── core/                # singletons: auth, guards, interceptors, services globales, config
│   ├── features/<feature>/  # lazy loaded: components/ views/ services/ interfaces/ mocks/ <feature>.routes.ts
│   ├── shared/              # components, directives, pipes, interfaces, mocks (Faker), utils
│   ├── layout/              # header, footer, sidebar, nav
│   ├── app.routes.ts
│   ├── app.config.ts
│   └── app.component.ts     # con --file-name-style-guide=2016 el CLI genera app.component.*, no app.ts
├── assets/                  # images, fonts, icons
├── environments/            # environment.ts, environment.prod.ts (sin secretos)
└── styles.scss
```

Reglas: standalone, `OnPush`, `inject()`, signals, lazy loading de todas las features (`loadComponent`/`loadChildren`), budgets en `angular.json`, `aot` y `optimization` en produccion, `@for` con `track`, ESLint flat compartido, Jest 30 unitarias, Cypress E2E, Google Analytics/GTM y Core Web Vitals, nombrado `feature.type.ts` en kebab-case (`--file-name-style-guide=2016`).

### 5.4 QA (QA-MET, CHECK, STACK §8.3)

- Piramide: unitarias (desarrolladores), integracion (desarrolladores + QA), E2E (QA; Cypress en Angular).
- Etapas de QA: diseno de casos, preparacion de entorno, ejecucion, registro de errores, correccion, regresion, revision y cierre.
- Plan de pruebas por tipo con herramienta y responsable (unitarias, integracion, funcionales, aceptacion, regresion, rendimiento con JMeter o K6 y GTmetrix, accesibilidad WCAG 2.2 con PageSpeed Insights y A-Checks, medicion con Google Analytics / Zoho PageSense).
- Estimacion: casos por dificultad baja/media/alta (5/10/15 min) + 20 % de margen.
- Resultado de QA y STG: `Aprobado`, `Aprobado con observaciones`, `Rechazado`.
- Gates: cierre de feature (antes de `review` -> `done`) y pre-PR hacia `develop`; gate de promocion (PR `develop->qa`, `qa->stg`, `stg->main`) con checklist CHECK por rol.
- Cobertura segun R9.

### 5.5 AGENTS_EJEMPLO.md (autocontenido, sin MCP)

- §3 tabla de dominios: pisos Angular 22.3+, NestJS 12+, Node 26 LTS, TypeScript 6.0, PostgreSQL 19, `google-agents-cli` 1.16+.
- §8 Git y repositorio: anadir R4 a R8 (ramas, nombres, promocion, PR, SemVer, tags, CHANGELOG) y un resumen de R1, R2, R9, R10, R11 y R12 como reglas duras de despliegue, mas la definicion de hotfix de POL-DEP §3.7 con la lista de lo que no es hotfix, con remision a la referencia de la skill del dominio para el detalle. El documento es un resumen normativo; la copia integra vive en las skills.
- Nueva §9 "Normativa de la Fabrica de Software": tabla con las siete fuentes Outline de la seccion 2 (codigo, titulo, URL, fecha) y regla de precedencia: Outline vigente > `AGENTS.md` del repositorio > skill CUN > skill externa. Las skills llevan copia integra de la normativa con fecha de alineacion; si el desarrollador tiene acceso a Outline y detecta una version posterior, manda Outline y se abre una tarea para actualizar la skill. No se exige ningun MCP.
- Nota de precedencia en `front-angular-fab/SKILL.md` corregida: la skill manda solo en lo que la normativa Outline no regula.

## 6. Cambios por archivo

| Area | Archivos | Cambio |
|---|---|---|
| Raiz | `AGENTS_EJEMPLO.md` | §3, §8, nueva §9 segun 5.5 |
| Raiz | `.gitattributes` (nuevo) | `* text=auto eol=lf` |
| Raiz | `scripts/validate.sh` | **Eliminado** por decision del usuario (2026-11-25). No se sustituye por otro validador en el repositorio; las comprobaciones estructurales (frontmatter, `name` = carpeta, `description` <= 1024, `license`, `metadata` escalar, <= 500 lineas, LF) se documentan en `AGENTS.md` y `README.md` como verificacion manual |
| Raiz | `README.md`, `CHANGELOG.md` (0.17.0), `AGENTS.md` | Reflejar nuevas referencias, versiones, Cypress, reglas de ramas, fuentes Outline |
| backend | `SKILL.md`, `reference/01` a `13` | Estructura 5.2; versiones §4; `/metrics`; Fastify; Swagger R15; `/api/v1`; `13-politica-despliegue.md` reescrito segun 5.1; checklist de modulos y antipatrones coherentes con la nueva estructura |
| front | `SKILL.md`, `reference/01`, `04`, `05`, `08`, `09` | Estructura 5.3; versiones §4; Cypress; ESLint flat; cobertura R9; `09-politica-despliegue.md` reescrito segun 5.1; nota de precedencia |
| qa | `SKILL.md`, `reference/qa-checklist-cierre.md` | Contenido 5.4; `metadata.sources` como cadena; fuentes Outline en lugar de `testing.google.com` |
| adk | `SKILL.md`, `reference/politica-despliegue.md` (nuevo), `reference/agente-base.md` | Referencia de despliegue 5.1 adaptada a ADK; enlaces de streaming corregidos (`https://adk.dev/live/index.md`, `https://adk.dev/live/get-started/index.md`, `https://adk.dev/live/get-started/streaming-python/index.md`); versiones `google-adk` 2.x y `google-agents-cli` 1.16 |

## 7. Criterios de aceptacion

1. Verificacion estructural manual en verde: cada `SKILL.md` tiene frontmatter valido, `name` igual a su carpeta, `license: MIT`, `metadata` solo con valores escalares, sin CR. (El validador `scripts/validate.sh` fue eliminado.)
2. Ningun `SKILL.md` supera 500 lineas ni 1024 caracteres de `description`; todos tienen `license: MIT`.
3. Ningun archivo de las skills menciona el MCP de Outline como requisito. Toda regla de despliegue, ramas, versiones y cobertura esta copiada en texto dentro de la skill, con URL de origen y fecha de alineacion.
4. Las tres skills de dominio y `AGENTS_EJEMPLO.md` contienen, de forma literal y coherente entre si: ventana de PRO lunes habil; matriz de autorizaciones; definicion de hotfix; ramas `develop`/`qa`/`stg`/`main`; formato `<tipo>/<ID_HU>-<slug>`; SemVer con sufijos por rama y tag `vX.Y.Z`; cobertura 70 % nuevo (gate) / 85 % objetivo; `.gitignore` R10; formato `.txt` de variables.
5. Backend: `SKILL.md` exige `GET /metrics` con `@willsoto/nestjs-prometheus`, Fastify por defecto, Swagger en `/docs/dev-only/swagger`, prefijo `/api/v1`, TypeORM 1.x con migraciones y `synchronize: false`, piso NestJS 12, Node 26, PostgreSQL 19, TypeScript 6.0.
6. Frontend: `SKILL.md` exige Angular 22.3+, Jest 30, Cypress 16, ESLint flat, carpeta `features/` y `layout/`, lazy loading, budgets, `@for` con `track`.
7. Todos los enlaces `https://adk.dev/...` de `google-adk-cun/SKILL.md` responden 200.
8. `grep -rn "viernes" */` no devuelve ninguna regla de calendario distinta a la de R1 (la mencion de viernes solo puede aparecer como dia fuera de ventana).
9. `grep -rn "NestJS 11" */ AGENTS_EJEMPLO.md README.md` no devuelve resultados.
10. `README.md` y `CHANGELOG.md` describen los cambios; `AGENTS.md` del repo menciona la fecha de alineacion y la obligacion de actualizar las copias cuando Outline cambie.
