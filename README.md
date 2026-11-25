# fab-skills

Coleccion de skills para agentes de inteligencia artificial de los proyectos CUN. Desplegable con [`npx skills`](https://www.skills.sh).

## Instalacion

```bash
npx skills add fabricaSoftwareCUN/fab-skills
```

### Instalar un skill especifico

```bash
npx skills add fabricaSoftwareCUN/fab-skills --skill google-adk-cun
```

### Instalar para un agente especifico

```bash
npx skills add fabricaSoftwareCUN/fab-skills --agent claude-code
npx skills add fabricaSoftwareCUN/fab-skills --agent cursor
npx skills add fabricaSoftwareCUN/fab-skills --agent antigravity
```

### Instalar AGENTS_EJEMPLO.md (obligatorio)

`AGENTS_EJEMPLO.md` es un archivo de la raiz del repositorio, **no un skill**: `npx skills add` no lo distribuye. Las skills describen dominios (Angular, NestJS, ADK, QA); `AGENTS_EJEMPLO.md` describe el comportamiento base del agente que las invoca. Sin el, las skills se instalan pero nadie obliga a usarlas.

Instalalo en uno de los dos alcances, segun a que quieras que aplique:

**Alcance global** — aplica a todas las sesiones del agente, en cualquier proyecto. Recomendado para el equipo CUN.

```bash
# opencode
curl -fsSL https://raw.githubusercontent.com/fabricaSoftwareCUN/fab-skills/main/AGENTS_EJEMPLO.md \
  -o ~/.config/opencode/AGENTS.md

# claude-code
curl -fsSL https://raw.githubusercontent.com/fabricaSoftwareCUN/fab-skills/main/AGENTS_EJEMPLO.md \
  -o ~/.claude/CLAUDE.md
```

**Alcance de repositorio** — aplica solo al proyecto en curso y viaja versionado con el. Recomendado cuando el proyecto necesita reglas propias que difieren del estandar CUN.

```bash
# desde la raiz del repositorio de trabajo
curl -fsSL https://raw.githubusercontent.com/fabricaSoftwareCUN/fab-skills/main/AGENTS_EJEMPLO.md \
  -o AGENTS.md
```

Reglas de instalacion:

- El archivo se instala **siempre con el nombre `AGENTS.md`** (o el que use tu agente), nunca como `AGENTS_EJEMPLO.md`. El sufijo `_EJEMPLO` solo existe en este catalogo para no colisionar con el `AGENTS.md` propio del repositorio.
- Si ya existe un `AGENTS.md` en el destino, **no lo sobrescribas a ciegas**: fusiona las secciones e integra las reglas que falten.
- Los dos alcances son compatibles y se acumulan. Ante conflicto, el `AGENTS.md` del repositorio manda sobre el global.
- Tras instalarlo, ajusta las secciones que dependan del proyecto (rutas, comandos de test, dominios activos) antes de la primera sesion.

## Skills disponibles

| Skill | Descripcion |
|-------|-------------|
| [backend-nest-hexagonal-cun](./backend-nest-hexagonal-cun/) | Skill base para construir proyectos backend en NestJS 12+ aplicando Arquitectura Hexagonal, Fastify, TypeORM 1.x, PostgreSQL 19, Swagger y Prometheus. Incluye reglas de despliegue alineadas con la normativa Outline de la Fabrica de Software CUN. |
| [front-angular-fab](./front-angular-fab/) | Skill principal del ecosistema Front Angular CUN. Arquitectura core/features/shared/layout, componentes standalone v22+, signals, interceptores HTTP funcionales, testing con Jest 30, Cypress 16 E2E, migracion Jasmine-a-Jest, mocking avanzado con Faker, y convenciones de codigo. Angular 22.3+, Node 26 LTS, TypeScript 6.0, ESLint 10 flat config. Angular CLI obligatorio (MCP `angular-cli` + `ng`). |
| [google-adk-cun](./google-adk-cun/) | Guia sobre Google Agent Development Kit (ADK). Creacion de agentes, herramientas, modelos, callbacks, streaming, graphs, despliegue y arquitectura. `google-adk` 2.x, `google-agents-cli` 1.16+ y la suite `google-agents-cli-*` obligatorios. Incluye politica de despliegue CUN adaptada a agentes ADK. |
| [memoria](./memoria/) | Protocolo para gestion de memoria en interacciones con el usuario. |
| [proyectos-tareas-cun](./proyectos-tareas-cun/) | Administracion de workspaces en Plane (proyectos.cunapp.pro). Gestion de proyectos, work items, ciclos, modulos, paginas, epics y mas. Requiere `PLANE_API_KEY` y `PLANE_WORKSPACE_SLUG`. |
| [qa-and-testing](./qa-and-testing/) | Protocolo de pruebas y calidad del codigo para proyectos CUN. Actua como Ingeniero de QA Senior y Arquitecto de Pruebas: genera pruebas, valida cobertura, documenta componentes y devuelve handoff estructurado al agente de desarrollo. Obligatorio al cerrar cada feature (gate de cierre) y antes de solicitar un PR (gate pre-PR). |
| [spec-driven-dev](./spec-driven-dev/) | Guia de Spec-Driven Development (SDD) basada en GitHub Spec Kit. Flujo de 3 fases: Especificar, Planificar, Tareas. Obligatorio si la tarea modifica codigo existente, afecta a mas de un archivo, altera contratos o APIs, o introduce logica nueva; exige PRD, historia de usuario o especificacion antes de desarrollar. |
| [ux-design](./ux-design/) | Principios de UX/UI y psicologia cognitiva aplicada al diseno. Leyes de UX, design tokens, accesibilidad WCAG 2.2, flujo de evaluacion y plantilla de design system. Principio fundamental de la Fabrica de Software CUN. |

## Normativa Outline

Las skills de este catalogo estan alineadas con la normativa oficial de la Fabrica de Software CUN publicada en Outline (`vsdocs.cunapp.pro`). Toda regla normativa esta copiada de forma integra en los archivos de las skills y en `AGENTS_EJEMPLO.md`, con la URL de origen y la fecha de alineacion. No se requiere ningun MCP para conocer o aplicar una regla: el texto completo vive en los archivos.

### Fuentes normativas

| Codigo | Documento | URL | Ultima edicion |
|--------|-----------|-----|----------------|
| POL-DEP | POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001, v1.0, Vigente) | https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU | 2026-09-14 |
| PROC-DEP | Politica de despliegue para aplicaciones (procedimiento tecnico de solicitud) | https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw | 2026-09-14 |
| STACK | Estandares, Arquitectura y Stack Tecnologico (v2.0) | https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ | 2026-07-29 |
| QA-MET | QA: Metodologia de Trabajo | https://vsdocs.cunapp.pro/doc/qa-metodologia-de-trabajo-JGQS4SnlYm | 2026-07-30 |
| CHECK | Checklist - Paso a produccion de App | https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP | 2026-05-21 |
| VER | Politica de Versionamiento (v1.0.0) | https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC | 2025-12-09 |
| INV | Lista de aplicaciones (inventario) | https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm | — |

Fecha de alineacion: **2026-11-25**.

### Regla de precedencia

1. **Outline vigente** (documento con fecha de edicion mas reciente).
2. **AGENTS.md del repositorio** (en lo que declare explicitamente).
3. **Skill CUN** (en lo que la normativa Outline no regula).
4. **Skill externa** (la de menor prioridad).

Las skills llevan copia integra de la normativa con fecha de alineacion. Si un desarrollador con acceso a Outline detecta una version posterior de cualquier documento, **manda Outline** y se abre una tarea para actualizar la skill. Los desarrolladores que no tienen acceso a Outline se apoyan en las copias integras que llevan las skills.

## Ramas y versionamiento

Resumen normativo (R4 a R8). El detalle operativo completo vive en la referencia de politica de despliegue de cada skill de dominio.

- **Ramas por ambiente (R4):** `develop`, `qa`, `stg`, `main`. Son ramas permanentes protegidas, sin commits directos. Cada rama corresponde a su ambiente: `develop` -> DEV, `qa` -> QA, `stg` -> STG, `main` -> PRO.
- **Ramas efimeras (R5):** formato `<tipo>/<ID_HU>-<slug-kebab>`. Tipos permitidos: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`. Equivalencias: `epic` -> `feature`; `fix`, `bug`, `improve` -> `bugfix`. Ejemplo: `feature/HU-123-login-google`.
- **Origen y destino (R6):** `feature`, `bugfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`: salen de `develop` y vuelven a `develop` por PR. `hotfix`: sale de `main` y vuelve a `main` **y** a `develop`. Promocion entre ambientes: `develop -> qa -> stg -> main`, siempre por PR. La rama efimera se elimina tras el merge.
- **Requisitos de PR (R7):** al menos un revisor del equipo; Tech Lead obligatorio en cambios de arquitectura y en todo PR hacia `stg` y `main`; CI en verde (lint, unitarias, Sonar); descripcion con el que y el porque, enlazada a la HU. DevOps verifica el checklist antes de `stg` y `main`.
- **Versionamiento (R8):** SemVer `X.Y.Z`. Sufijos por rama: `-alpha` en `develop`, `-beta` en `qa`, `-rc.N` en `stg`, estable en `main`. Proyecto nuevo inicia en `0.1.0`; primer release publico `1.0.0`. Tag `vX.Y.Z` en `main` creado automaticamente por CI al hacer merge desde `stg` o `hotfix`. `CHANGELOG.md` en formato Keep a Changelog.

### Resolucion de conflictos

Regla general: ante contradiccion gana el documento con fecha de edicion mas reciente. Cuando dos documentos tratan el mismo tema y uno es la politica dedicada, esta gobierna y el otro se considera informativo. Las resoluciones R1, R2, R4 a R8, R10 a R12 y R22 a R27 estan resumidas en esta seccion y en `## Politica de despliegue`; el detalle completo vive en las referencias de cada skill de dominio.

## Politica de despliegue

Resumen normativo (R1, R2, R9, R10, R11, R12, R22, R23, R24, R25, R26, R27). El detalle operativo completo vive en la referencia de politica de despliegue de cada skill de dominio:

- [backend-nest-hexagonal-cun/reference/13-politica-despliegue.md](./backend-nest-hexagonal-cun/reference/13-politica-despliegue.md)
- [front-angular-fab/reference/09-politica-despliegue.md](./front-angular-fab/reference/09-politica-despliegue.md)
- [google-adk-cun/reference/politica-despliegue.md](./google-adk-cun/reference/politica-despliegue.md)

Reglas duras:

- **R1 — Ventana de PRO:** unicamente **lunes habil**; si el lunes no es habil, el siguiente dia habil. Martes a viernes, fines de semana y festivos requieren excepcion autorizada (ver R2).
- **R2 — Autorizaciones:** QA y STG: responsable del proceso (solicitud al Tech Lead). PRO lunes habil: flujo estandar con aprobacion del QA en el hilo de correo y checklist aprobado por el Tech Lead, o solicitud directa del Coordinador por el canal debido. PRO martes a viernes: excepcion autorizada por el Vicerrector de Servicios Digitales. PRO sabado, domingo o festivo: excepcion con la autorizacion correspondiente (POL-DEP 28), bajo la autorizacion general del Vicerrector para toda excepcion al calendario (POL-DEP 11). Hotfix critico: Coordinador de la Fabrica.
- **R9 — Cobertura:** gate bloqueante 70 % en codigo nuevo, medido por SonarQube en la canalizacion; objetivo recomendado 85 % global en lineas y ramas.
- **R10 — `docker-compose.yml` no se versiona.** `.gitignore` incluye `docker-compose.yml`, `docker-compose.*.yml`, `compose.yml`, `compose.*.yml`, `*.sh`, `.env`, `.env.*`. El compose de desarrollo local existe solo sin versionar.
- **R11 — Variables de entorno:** `SNAKE_CASE`, sin espacios, sin comillas innecesarias, ordenadas por categoria. Se envian como adjunto `.txt` con tres bloques: `ENVS NUEVAS`, `ENVS MODIFICADAS`, `ENVS ELIMINADAS`. Nunca en el repositorio. Backend: validacion al arranque con `@nestjs/config` + `class-validator` + `class-transformer`.
- **R12 — Observabilidad:** todo backend expone `GET /metrics` en formato Prometheus con las cuatro senales de oro (trafico, errores 5xx, latencia p95/p99, saturacion) y metricas de negocio. Grafana para visualizacion. Frontend: eventos de telemetria (Google Analytics / GTM) y Core Web Vitals.
- **R22 — Accesibilidad:** WCAG 2.2 como referencia unica. Donde CHECK dice "WCAG 2.1" se copia como 2.2 con nota de origen.
- **R23 — Clasificacion de resultados:** `Aprobado` / `Aprobado con observaciones` / `Rechazado` se aplica solo a los resultados de los ambientes QA y STG. El handoff de feature de `qa-and-testing` mantiene su veredicto `APTO` / `NO APTO`.
- **R24 — Ejecucion del despliegue en ADK:** la solicitud sigue PROC-DEP (correo con PR, variables, ambiente). La ejecucion la realiza DevOps o el Tech Lead, bien con `agents-cli deploy`, bien con el workflow `main.yml` cuyo job de despliegue esta protegido por un GitHub Environment con aprobacion manual. El equipo de desarrollo no ejecuta `agents-cli deploy` contra QA, STG ni PRO por su cuenta.
- **R25 — Horario de solicitud:** las solicitudes se envian en dia habil entre 8:00 y 17:00. Tiempos orientativos de atencion: DEV, QA y STG de 1 h a 36 h; PRO de 2 h a 24 h. La ejecucion en PRO se programa siempre segun R1.
- **R26 — Subcarpetas por modulo en backend:** el arbol de STACK 3.2 es el minimo. Cuando el proyecto tiene varios modulos se permite `domain/entities/<modulo>/`, `domain/services/<modulo>/`, `domain/ports/out/<modulo>/`, `application/use-cases/<modulo>/`, `application/dtos/<modulo>/`, `infrastructure/adapters/<tipo>/<modulo>/` y `infrastructure/controllers/<modulo>/`.
- **R27 — Ubicacion de los DTOs:** un unico juego de DTOs en `application/dtos/<modulo>/`, decorados con `class-validator` y `@ApiProperty`. `domain` permanece libre de decoradores; los controladores de `infrastructure` reutilizan esos DTOs; no se duplican en infraestructura.

## Politica de repositorios

La Fabrica de Software CUN **prohibe el monorepo**. Cada proyecto se organiza en hasta tres repositorios independientes, uno por tecnologia:

| Repositorio | Tecnologia | Skill que lo gobierna |
|---|---|---|
| `<proyecto>-back` | NestJS + Arquitectura Hexagonal | [backend-nest-hexagonal-cun](./backend-nest-hexagonal-cun/) |
| `<proyecto>-front` | Angular + arquitectura FAB | [front-angular-fab](./front-angular-fab/) |
| `<proyecto>-adk` | Agentes Google ADK | [google-adk-cun](./google-adk-cun/) |

Reglas:

- Se crean **solo los repositorios que el proyecto necesite**. Los tres son el catalogo maximo de dominios, no un minimo obligatorio: un proyecto sin agente no crea `-adk`.
- Lo prohibido es **alojar dos tecnologias en el mismo repositorio**. La frontera es la tecnologia, no el numero de proyectos: un workspace Angular con la app y sus librerias Angular sigue siendo el repositorio de front y es valido.
- **Proyecto nuevo** planteado como monorepo: bloqueado. Se propone la separacion antes de escribir codigo.
- **Proyecto existente** que ya es monorepo: no bloquea el trabajo, pero se declara no conformidad y se registra la deuda de separacion en TASKS.md.

La directiva normativa vive en la seccion 8 de [`AGENTS_EJEMPLO.md`](./AGENTS_EJEMPLO.md) y se replica como regla dura en las tres skills de dominio, de modo que sigue aplicandose cuando se instala una skill suelta con `--skill` sin el `AGENTS.md` base.

## Skills externas obligatorias

Las cuatro skills CUN de `google-adk-cun`, `front-angular-fab`, `backend-nest-hexagonal-cun` y `spec-driven-dev` exigen, para aplicarse, que tambien esten instaladas las skills externas oficiales de sus respectivos proveedores. Esta seccion documenta cuales instalar y los comandos exactos.

Para inspeccionar el catalogo de un repositorio antes de instalar:

```bash
npx skills add <owner>/<repo> --list
```

### Google ADK — `google/agents-cli`

Obligatorio para cualquier trabajo con ADK. Las propias skills exigen, ademas de estar instaladas, el binario `agents-cli`.

```bash
npx skills add google/agents-cli
uv tool install google-agents-cli
agents-cli setup
```

Las 7 skills de la suite (`google-agents-cli-workflow`, `-scaffold`, `-adk-code`, `-eval`, `-deploy`, `-publish`, `-observability`) **no se distribuyen desde fab-skills**: la suite no se trae con `npx skills add fabricaSoftwareCUN/fab-skills`.

### Figma — subconjunto de consumo de disenos

`figma/mcp-server-guide` distribuye 12 skills. Para leer disenos y consumir la API de Figma, este es el nucleo obligatorio:

```bash
npx skills add figma/mcp-server-guide --skill figma-design-to-code
npx skills add figma/mcp-server-guide --skill figma-use
npx skills add figma/mcp-server-guide --skill figma-code-connect
```

- `figma-design-to-code` se autodeclara prerrequisito obligatorio antes de `get_design_context`. No esta instalado por defecto; sin el, la lectura de disenos produce codigo de referencia que la skill no contextualiza.
- `figma-use` es prerrequisito de cualquier `use_figma` que requiera JavaScript en el contexto del archivo.
- `figma-code-connect` mapea componentes Figma a snippets del codebase y alimenta los hints de `get_design_context`.

Las 9 restantes del repositorio son de escritura hacia Figma (`figma-generate-design`, `figma-generate-library`, `figma-generate-diagram`, `figma-create-new-file`, `figma-use-figjam`, `figma-use-slides`, `figma-use-motion`), de motion (`figma-implement-motion`) o especificas de iOS (`figma-swiftui`).

### Angular — `angular-developer`

```bash
npx skills add angular/skills --skill angular-developer
```

`angular-new-app` **no se declara obligatoria**: su comando normativo prescribe `--ai-config=agents`, valor inexistente en Angular CLI v22, y omite `--file-name-style-guide=2016`, sin el cual `ng generate` produce archivos que incumplen las convenciones FAB. La creacion de proyectos la gobierna la propia skill `front-angular-fab`.

**Precedencia**: `front-angular-fab` manda sobre `angular-developer` en arquitectura, nombrado, version minima y flags de `ng new` / `ng generate`. `angular-developer` aporta guia oficial del framework.

### Playwright — MCP de navegador para el agente; Cypress es el E2E del proyecto

`microsoft/playwright` distribuye 4 skills (`playwright-dev`, `playwright-devops`, `playwright-test-results`, `playwright-triage`), pero todas son **internas de su propio monorepo**: `playwright-dev` cubre como contribuir al codigo de Playwright; `playwright-test-results` consulta el DuckDB del CI de Microsoft Playwright con `repository = "microsoft/playwright"` fijo en el codigo.

No existe skill oficial para usar Playwright en proyectos ajenos. La automatizacion de navegador del agente se cubre con el **servidor MCP `playwright`** (`browser_navigate`, `browser_click`, `browser_snapshot`, etc.). La ejecucion de pruebas E2E del proyecto es propiedad de QA y usa **Cypress 16** conforme a STACK 8.3: la skill `qa-and-testing` del ecosistema CUN cubre ese flujo.

No ejecutes `npx skills add microsoft/playwright --skill playwright-dev`.

## Estructura

Cada skill es una carpeta con un archivo `SKILL.md` que contiene metadatos (frontmatter YAML) e instrucciones para el agente. Opcionalmente incluye subcarpetas como `reference/`, `scripts/`, `examples/`.

Ademas del catalogo, la raiz del repositorio contiene:

```text
fab-skills/
  .gitattributes       # Finales de linea LF en todos los archivos de texto
  AGENTS.md            # Reglas de trabajo sobre este repositorio
  AGENTS_EJEMPLO.md    # Comportamiento base del agente. No se distribuye con
                       # npx skills: instalar a mano en alcance global o de
                       # repositorio (ver "Instalar AGENTS_EJEMPLO.md")
  _template/           # Plantilla base (no se distribuye)
  specs/               # Especificaciones de cambios (no es un skill)
  backend-nest-hexagonal-cun/ # Skill de NestJS Hexagonal
    SKILL.md
    reference/
      01-arquitectura-estructura.md
      02-domain.md
      ... (13 archivos de referencia)
  front-angular-fab/   # Skill de Front Angular
    SKILL.md
    reference/
      01-arquitectura-proyecto.md
      02-componentes.md
      ... (9 archivos de referencia)
  google-adk-cun/      # Skill de Google ADK
    SKILL.md
    reference/
      agente-base.md
      buenas-practicas.md
      politica-despliegue.md
  memoria/             # Skill de memoria
    SKILL.md
  proyectos-tareas-cun/   # Skill de Proyectos y Tareas CUN
    SKILL.md
    reference/
      endpoints.md
  qa-and-testing/      # Skill de QA y Testing
    SKILL.md
    reference/
      qa-checklist-cierre.md
  spec-driven-dev/     # Skill de SDD
    SKILL.md
    reference/
      spec-driven-original.md
  ux-design/           # Skill de UX/UI Design
    SKILL.md
    reference/
      leyes-ux.md
```

### Estructura minima de un skill

El archivo `SKILL.md` debe contener:

1. **Frontmatter YAML** con campos obligatorios `name` y `description`.
2. Al menos una seccion de contenido con instrucciones para el agente.
3. El campo `name` debe coincidir con el nombre de la carpeta.

Verificacion manual antes de contribuir:

- `name` en frontmatter coincide con el nombre de la carpeta del skill.
- `description` no supera 1024 caracteres.
- `license: MIT` presente en el frontmatter.
- Valores de `metadata` son cadenas escalares (no listas ni objetos anidados).
- `SKILL.md` no supera 500 lineas.
- Finales de linea LF (`.gitattributes` fuerza `eol=lf`).

## Crear un skill nuevo

```bash
cp -r _template/ mi-nuevo-skill/
```

Editar `mi-nuevo-skill/SKILL.md`: reemplazar `name`, `description` y el contenido placeholder.

## Contribuir

1. Copiar `_template/` con el nombre del skill.
2. Editar `SKILL.md` con frontmatter `name` y `description`.
3. Incluir archivos de referencia en `reference/`.
4. Verificar manualmente la estructura (seccion "Estructura minima de un skill").
5. Abrir un PR.

## Licencia

MIT
