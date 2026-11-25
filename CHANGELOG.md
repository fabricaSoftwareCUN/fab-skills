# Changelog

## [0.18.0] - 2026-11-25

### Agregado
- `front-angular-fab/scripts/set-envs.mjs`: script Node ESM sin dependencias que genera `src/environments/environment.ts` y `environment.prod.ts` a partir de variables `NG_APP_*` (precedencia: `process.env` > `.env` > `.env.example`). Incluye parser propio de `.env` con eliminacion de BOM y tratamiento de valor vacio como ausente, mapa `camel(envKey) -> envKey` para resolucion de nombres, tipado y validacion por `environment.model.ts` (solo `string`, `number`, `boolean`; falla con mensaje que nombra la propiedad), anotacion `AppEnvironment` en el archivo generado, verificacion de nombres sensibles por tokens (R28) con sufijo `_PUBLIC` y flag `--allow-sensitive-names`, advertencia para claves no declaradas en el modelo, modo `--check` con las mismas validaciones que la ejecucion real, y flag `--root`.
- `front-angular-fab/reference/10-envs-environments.md`: procedimiento completo de variables de entorno y environments en Angular. Incluye R28, tabla de artefactos, script de referencia, `package.json` con `envs`/`prebuild`/`prestart`, ejemplos de `.env.example` y `environment.model.ts`, lineas de `.gitignore`, bloques de CI y Docker, nota de solicitud `.txt` y tabla de errores frecuentes.
- `specs/envs-frontend/outline-politica.md`: texto listo para pegar en Outline (PROC-DEP, nueva subseccion "Variables de entorno en frontend Angular").
- `front-angular-fab/SKILL.md`: paso 0.d en "Flujo de trabajo" (copiar `scripts/set-envs.mjs`, crear `.env.example` y `environment.model.ts`, anadir scripts npm, `!.env.example` y lineas de `.gitignore`, ejecutar `npm run envs`); regla en "Reglas de despliegue"; criterio en "Criterios de calidad"; fila en tabla de referencia local; arbol con `scripts/set-envs.mjs`, `.env.example`, `.env` y `environment.model.ts`.
- `README.md`: fila de `front-angular-fab` menciona `npm run envs`; resumen de "Politica de despliegue" incluye R28; arbol de estructura incluye `front-angular-fab/scripts/set-envs.mjs` y `reference/10-envs-environments.md`.
- `AGENTS_EJEMPLO.md`, `backend-nest-hexagonal-cun/SKILL.md`, `backend-nest-hexagonal-cun/reference/13-politica-despliegue.md`, `google-adk-cun/reference/politica-despliegue.md`, `specs/alineacion-outline/spec.md`: fecha de PROC-DEP actualizada a 2026-11-25 (edicion principal, fuera del alcance de esta entrega).

### Modificado
- `front-angular-fab/reference/01-arquitectura-proyecto.md`: seccion "Environments" reescrita al modelo de archivos generados (`npm run envs`); item 13 del checklist de nuevo proyecto actualizado.
- `front-angular-fab/reference/09-politica-despliegue.md`: bloque `.gitignore` anade `!.env.example` y los dos archivos generados; Dockerfile con `ARG`/`ENV` por variable `NG_APP_*`; job `build` de `main.yml` con bloque `env:` y paso `node scripts/set-envs.mjs --check`; job `docker` con `--build-arg` por variable `NG_APP_*`; nota de solicitud `.txt` incluye `NG_APP_*`; checklist CHECK actualizado; fecha de PROC-DEP actualizada a 2026-11-25.
- `front-angular-fab/SKILL.md`: fecha de PROC-DEP en tabla de fuentes actualizada a 2026-11-25.
- `README.md`: fecha de PROC-DEP en tabla de fuentes normativas actualizada a 2026-11-25.

### Fuente
- Spec: `specs/envs-frontend/spec.md` (generacion de `environments/` desde `.env` en proyectos Angular). Extiende `specs/alineacion-outline/spec.md` (R10, R11, R14). PROC-DEP actualizado 2026-11-25 con la subseccion "Variables de entorno en frontend Angular".

## [0.17.0] - 2026-11-25

### Agregado
- `.gitattributes` en la raiz: `* text=auto eol=lf`. Fuerza finales de linea LF en todos los archivos de texto del repositorio.
- `google-adk-cun/reference/politica-despliegue.md`: politica de despliegue de la Fabrica de Software CUN adaptada a agentes ADK. Flujo de ambientes `DESARROLLO -> QA -> STG -> PRO`, calendario PRO (lunes habil), hotfix, rollback, checklists, matriz de autorizaciones y proceso de solicitud por correo. Fuentes: POL-DEP, PROC-DEP, CHECK, VER, INV.
- `README.md`: nueva seccion `## Normativa Outline` con la tabla de fuentes normativas (codigo, titulo, URL, ultima edicion), la regla de precedencia (Outline > AGENTS.md del repositorio > skill CUN > skill externa) y la nota de que las skills llevan copia integra de la normativa con fecha de alineacion 2026-11-25.
- `README.md`: nueva seccion `## Ramas y versionamiento` con el resumen normativo R4 a R8 (ramas por ambiente, ramas efimeras, origen y destino, requisitos de PR, SemVer con sufijos y tag automatico).
- `README.md`: nueva seccion `## Politica de despliegue` con el resumen normativo R1, R2, R10, R11, R12 y remision a las tres referencias de dominio (backend, front, ADK).
- `README.md`: verificacion manual de estructura en `### Estructura minima de un skill` (name = carpeta, description <= 1024, license MIT, metadata escalar, <= 500 lineas, LF).
- `AGENTS.md`: nuevas convenciones — fecha de alineacion 2026-11-25 y obligacion de actualizar las copias de las skills cuando Outline cambie; `.gitattributes` fuerza LF; valores de `metadata` deben ser cadenas escalares; `specs/` contiene especificaciones y no es un skill.
- `AGENTS_EJEMPLO.md`: seccion 8 ampliada con modelo de ramas (R4 a R8) y reglas duras de despliegue (R1, R2, R10, R11, R12); nueva seccion 9 "Normativa de la Fabrica de Software" con tabla de fuentes Outline y regla de precedencia.

### Modificado
- `README.md`: tabla de skills disponibles actualizada con versiones alineadas al stack 2026-11-25. Backend: NestJS 12+, Node 26 LTS, TypeScript 6.0, TypeORM 1.x, PostgreSQL 19, Jest 30, `@willsoto/nestjs-prometheus` 7. Front: Angular 22.3+, Node 26 LTS, TypeScript 6.0, Jest 30, Cypress 16, ESLint 10 flat config. ADK: `google-adk` 2.x, `google-agents-cli` 1.16+.
- `README.md`: seccion `### Playwright` reescrita: Cypress 16 es la herramienta E2E del proyecto para Angular (STACK 8.3); Playwright se usa solo como MCP de automatizacion de navegador para el agente.
- `README.md`: arbol de estructura actualizado — anadidos `.gitattributes`, `specs/`, `google-adk-cun/reference/politica-despliegue.md`; eliminado `scripts/`.
- `README.md`: seccion `## Contribuir` paso 4 sustituye la ejecucion del validador por la verificacion manual de estructura.
- `README.md`: seccion `## Politica de despliegue` refleja las resoluciones R22 a R27: WCAG 2.2 como referencia unica de accesibilidad; clases de resultado (`Aprobado` / `Aprobado con observaciones` / `Rechazado`) aplicadas solo a ambientes QA y STG; en ADK la solicitud va por correo y la ejecucion la realizan DevOps o el Tech Lead con `agents-cli deploy` o el job de `main.yml` protegido por aprobacion manual; horario de solicitud 8:00-17:00 en dias habiles; subcarpetas por modulo permitidas en backend; DTOs unicos en `application/dtos` con `class-validator` y `@ApiProperty`.
- `backend-nest-hexagonal-cun/SKILL.md`: piso NestJS 12, Node 26 LTS, TypeScript 6.0, TypeORM 1.1, PostgreSQL 19, Jest 30, `@willsoto/nestjs-prometheus` 7; adaptador Fastify por defecto; prefijo global `/api/v1`; Swagger en `/docs/dev-only/swagger`; endpoint `GET /metrics` obligatorio; cobertura gate 70 % codigo nuevo (SonarQube) y objetivo 85 % global.
- `backend-nest-hexagonal-cun/reference/13-politica-despliegue.md`: reescrito desde POL-FSW-DEP-001 con flujo de ambientes, calendario PRO, hotfix, rollback, checklists por rol, matriz de autorizaciones y matriz de calendario.
- `front-angular-fab/SKILL.md`: piso Angular 22.3, Node 26 LTS, TypeScript 6.0, Jest 30, Cypress 16, ESLint 10 flat config; estructura `core/features/shared/layout`; cobertura gate 70 % codigo nuevo y objetivo 85 % global; nota de precedencia corregida (la skill manda solo en lo que la normativa Outline no regula).
- `front-angular-fab/reference/09-politica-despliegue.md`: reescrito desde POL-FSW-DEP-001 con el mismo contenido normativo que backend adaptado a frontend.
- `backend-nest-hexagonal-cun/reference/01-arquitectura-estructura.md` a `reference/12-antipatrones-buenas-practicas.md`: arbol de STACK 3.2 con subcarpetas por modulo (R26); prefijo global `/api/v1`; Swagger en `/docs/dev-only/swagger` (R15); Fastify por defecto (R20); TypeORM 1.x con migraciones y `synchronize: false`; PostgreSQL 19; Redis cache; metricas Prometheus con `@willsoto/nestjs-prometheus` y endpoint `/health`; unico juego de DTOs en `application/dtos` con `class-validator` y `@ApiProperty` (R27).
- `front-angular-fab/reference/01-arquitectura-proyecto.md`: estructura `core/features/shared/layout` (R14), lazy loading, budgets en `angular.json`, telemetria Google Analytics / GTM y Core Web Vitals (R12).
- `front-angular-fab/reference/02-componentes.md`: ruta de generacion con `--file-name-style-guide=2016` y nombres `feature.type.ts`.
- `front-angular-fab/reference/04-testing-jest.md`: Jest 30, cobertura R9 (gate 70 % codigo nuevo, objetivo 85 % global), Cypress 16 E2E.
- `front-angular-fab/reference/05-migracion-jest.md`: dependencias Jest 30 (`jest@30`, `jest-preset-angular@17`, `@types/jest@30`, `@angular-builders/jest@22`, `@faker-js/faker@10`).
- `front-angular-fab/reference/08-convenciones-codigo.md`: ESLint 10 flat config `eslint.config.js` (R19), nombrado kebab-case 2016, Angular Material.
- `google-adk-cun/reference/agente-base.md`: version `google-adk` 2.15.1, flujo de despliegue con `main.yml` y GitHub Environment de aprobacion manual (R24), compose local no versionado (R10).
- `google-adk-cun/SKILL.md`: versiones `google-adk` 2.x y `google-agents-cli` 1.16+; enlaces de streaming corregidos (`https://adk.dev/live/index.md`, `https://adk.dev/live/get-started/index.md`, `https://adk.dev/live/get-started/streaming-python/index.md`); nueva referencia local `politica-despliegue.md`.
- `qa-and-testing/SKILL.md`: fuentes normativas Outline en lugar de `testing.google.com`; cobertura R9 (gate 70 % codigo nuevo, objetivo 85 % global); E2E con Cypress; `metadata.sources` convertido de lista YAML a cadena escalar.
- `qa-and-testing/reference/qa-checklist-cierre.md`: contenido alineado con QA-MET, CHECK y STACK 8.3; fuentes Outline.
- `spec-driven-dev/SKILL.md`: `metadata.sources` convertido de lista YAML a cadena escalar.
- `ux-design/SKILL.md`: `metadata.sources` convertido de lista YAML a cadena escalar.

### Eliminado
- `scripts/validate.sh` y la carpeta `scripts/`: el validador de estructura se elimina a peticion del usuario. La verificacion de estructura es manual: `name` = carpeta, `description` <= 1024 caracteres, `license: MIT`, `metadata` con valores escalares, `SKILL.md` <= 500 lineas, finales de linea LF (`.gitattributes`).

### Corregido
- `qa-and-testing/SKILL.md`, `spec-driven-dev/SKILL.md`, `ux-design/SKILL.md`: `metadata.sources` era una lista YAML; normalizado a cadena escalar conforme a la regla de frontmatter.
- `google-adk-cun/SKILL.md`: enlaces de streaming de ADK corregidos a rutas vigentes (`adk.dev/live/...`).
- `qa-and-testing/SKILL.md` y `qa-and-testing/reference/qa-checklist-cierre.md`: referencias a `testing.google.com` sustituidas por fuentes normativas Outline (QA-MET, CHECK, VER, POL-DEP, STACK).

### Fuente
- Documentos Outline: [POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001)](https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU), [Politica de despliegue para aplicaciones](https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw), [Estandares, Arquitectura y Stack Tecnologico](https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ), [QA: Metodologia de Trabajo](https://vsdocs.cunapp.pro/doc/qa-metodologia-de-trabajo-JGQS4SnlYm), [Checklist - Paso a produccion de App](https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP), [Politica de Versionamiento](https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC), [Lista de aplicaciones](https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm).
- Resolucion de conflictos entre documentos (gana el mas reciente): R1 (ventana PRO lunes habil), R4 (ramas por ambiente), R8 (SemVer con sufijos), R9 (cobertura 70 % gate / 85 % objetivo), R10 (`docker-compose.yml` no versionado), R22 (WCAG 2.2 referencia unica), R23 (clases de resultado solo para ambientes), R24 (ejecucion ADK por DevOps/Tech Lead), R25 (horario de solicitud 8:00-17:00), R26 (subcarpetas por modulo en backend), R27 (DTOs unicos en `application/dtos`).

## [0.16.0] - 2026-08-08

### Agregado
- Politica de repositorios de la Fabrica de Software CUN: **monorepo prohibido**. Cada proyecto se organiza en hasta tres repositorios independientes, uno por tecnologia (`<proyecto>-back` NestJS, `<proyecto>-front` Angular, `<proyecto>-adk` agentes ADK). Se crean solo los que el proyecto necesite. La frontera es la tecnologia y no el numero de proyectos: un workspace Angular con la app y sus librerias Angular sigue siendo el repositorio de front y es valido. Tratamiento diferenciado: proyecto nuevo planteado como monorepo queda bloqueado; proyecto existente que ya es monorepo no bloquea el trabajo, pero se declara no conformidad y se registra la deuda de separacion en TASKS.md. La directiva se inserta en cinco puntos para que aplique tanto con el `AGENTS.md` base como con skills instaladas sueltas:
  - `AGENTS_EJEMPLO.md`: primera viñeta de la seccion 8 (Git y repositorio). Fuente normativa.
  - `README.md`: nueva seccion `## Politica de repositorios` con la tabla repositorio/tecnologia/skill y las cuatro reglas de aplicacion.
  - `backend-nest-hexagonal-cun/SKILL.md`: viñeta en "Reglas obligatorias de alto nivel" y criterio en "Criterio de aceptacion".
  - `front-angular-fab/SKILL.md`: subseccion "Un repositorio por tecnologia" al inicio de "Reglas de arquitectura" y criterio en "Criterios de calidad".
  - `google-adk-cun/SKILL.md`: cuarta regla dura de la seccion "Uso obligatorio de agents-cli"; `agents-cli scaffold create` se ejecuta en `<proyecto>-adk`, nunca dentro del repositorio de front o back.

## [0.15.0] - 2026-08-08

### Agregado
- Skill `qa-and-testing`: protocolo de pruebas y calidad del codigo para proyectos CUN. SKILL.md preserva el cuerpo original (rol Ingeniero de QA Senior, 3 pasos, formato de salida) y anade una seccion "Activacion obligatoria" con dos gates duros: cierre de feature (estado `review`) y pre-PR (`git push` o solicitud de PR). Disparadores verificables en el diff, exenciones explicitas (documentacion, cosmeticos, one-shot), insumo previo (codigo, diff, spec, comandos del proyecto) y contrato de salida del handoff con veredicto `APTO`/`NO APTO` y firma explicita. Frontmatter ampliado con `description` de obligatoriedad y bloque `metadata` (`version`, `category`, `sources`).
- Skill `qa-and-testing/reference/qa-checklist-cierre.md`: checklist operativo de los dos gates. Gate de cierre (cobertura >=85%, linter, build, contratos, criterios de aceptacion, trazabilidad) y Gate pre-PR (sincronizacion documental, estado del repo, validaciones externas, seguridad y compliance, handoff al PR). Incluye flujo operativo de los dos gates y su relacion con `spec-driven-dev`, las skills de framework y `memoria`.

- `README.md`: nueva subseccion `### Instalar AGENTS_EJEMPLO.md (obligatorio)` en `## Instalacion`. Documenta que el archivo no lo distribuye `npx skills` por ser de raiz y no un skill, y da los comandos de instalacion para los dos alcances: global (`~/.config/opencode/AGENTS.md`, `~/.claude/CLAUDE.md`) y de repositorio (`AGENTS.md` en la raiz del proyecto). Incluye cuatro reglas de instalacion: renombrado obligatorio a `AGENTS.md`, prohibicion de sobrescribir a ciegas, acumulacion de alcances con precedencia del repositorio sobre el global, y ajuste de secciones dependientes del proyecto antes de la primera sesion.

### Modificado
- `README.md`: nueva fila `qa-and-testing` en la tabla de skills disponibles (descripcion con clausula de obligatoriedad al cerrar feature y antes de PR) y nuevo bloque `qa-and-testing/` en el arbol de `## Estructura`.
- `README.md`: comentario de `AGENTS_EJEMPLO.md` en el arbol de `## Estructura` ampliado para advertir que no se distribuye y remitir a la seccion de instalacion.
- `AGENTS.md`: anadida `qa-and-testing` a la lista de skills distribuidas.

## [0.14.0] - 2026-08-07

### Agregado
- `AGENTS_EJEMPLO.md` en la raiz: plantilla de comportamiento del agente con 8 secciones (identidad, flujo de trabajo con paso 2 de insumo funcional, dominios con skill y CLI autorizados, memoria, razonamiento, subagentes, seguridad, git). Es la base que los proyectos CUN copian a su propio `AGENTS.md`; este repositorio conserva su `AGENTS.md` limitado a las convenciones del catalogo.
- `README.md`: seccion `## Skills externas obligatorias` que documenta los comandos de instalacion para `google/agents-cli`, `figma/mcp-server-guide` (subconjunto de consumo de disenos) y `angular/skills` (solo `angular-developer`), con advertencia de no instalar `microsoft/playwright` y la clausula de precedencia frente a `front-angular-fab`.
- `README.md`: el arbol de `## Estructura` menciona explicitamente `AGENTS.md` y `AGENTS_EJEMPLO.md` en la raiz.

### Corregido
- `AGENTS.md` restaurado al alcance de su versiom antes de la 0.13.0: las 4 secciones de convenciones del repositorio. El contenido de comportamiento del agente no desaparece: pasa a `AGENTS_EJEMPLO.md`. Los gates de CLI, pisos de version y SDD obligatorios viven en las cuatro skills distribuidas (`google-adk-cun`, `front-angular-fab`, `backend-nest-hexagonal-cun`, `spec-driven-dev`), que no se tocan.

## [0.13.0] - 2026-08-07

### Agregado
- `AGENTS.md`: reconstruido sobre la base de comportamiento del agente (8 secciones) conservando las convenciones del repositorio como seccion 9.
  - Nuevo paso 2 del flujo de trabajo, **Insumo funcional**: antes de desarrollar una feature se exige PRD, historia de usuario o especificacion escrita. Sin ese insumo no se escribe codigo; si el usuario no lo aporta, se redacta un borrador con la fase 1 de `spec-driven-dev` y se espera aprobacion explicita.
  - Nueva subseccion **Dominios con skill y CLI autorizados**: Angular (`front-angular-fab`, MCP `angular-cli` + `ng`, piso 22+), NestJS (`backend-nest-hexagonal-cun`, `@nestjs/cli`, piso 11+) y ADK (`google-adk-cun` + suite `google-agents-cli-*`, `agents-cli`), con reglas duras por dominio.
- Skill `google-adk-cun`: seccion "Uso obligatorio de agents-cli" (prerrequisito, tabla fase/skill/comando, tres reglas duras y prohibiciones) y seccion "Comandos rapidos" con los 14 comandos del CLI.
- Skill `front-angular-fab`: seccion "Uso obligatorio del Angular CLI" con jerarquia MCP/`ng`, verificacion de version, defaults obligatorios de schematics (`ng new --file-name-style-guide=2016` y bloque `schematics` en `angular.json`) y regla de degradacion sin MCP.
- Skill `backend-nest-hexagonal-cun`: secciones "Uso obligatorio del CLI de NestJS" y "Gate de especificacion".
- Skill `spec-driven-dev`: seccion "Aplicacion obligatoria" con los cuatro disparadores de riesgo y el gate de insumo funcional previo.

### Modificado
- Piso de version **Angular 22+** en `front-angular-fab`: frontmatter, principio 6 nuevo, stack tecnologico, patrones, tabla de referencias y las referencias 01, 02 y 05. Proyecto nuevo por debajo de 22 queda prohibido; proyecto existente genera advertencia de no conformidad y deuda.
- Piso de version **NestJS 11+** en `backend-nest-hexagonal-cun`: frontmatter y criterios de aceptacion.
- SDD deja de ser opcional: el criterio de activacion pasa de estimacion de esfuerzo a cuatro criterios de riesgo verificables en el diff.
- `reference/01-arquitectura-proyecto.md`: checklist de nuevo proyecto ampliado con verificacion de version y bloque `schematics`; numeracion corregida.
- `README.md`: tabla de skills alineada con las descripciones nuevas; arbol de estructura completado con `buenas-practicas.md`.

### Corregido
- `front-angular-fab/reference/05-migracion-jest.md`: las dependencias eran incompatibles con Angular 22. `jest@^29.7.0` -> `^30.0.0`, `jest-preset-angular@^14.4.0` -> `^17.0.0`, `@types/jest@^29.5.0` -> `^30.0.0`, `@angular-builders/jest@^17.0.0` -> `^22.0.0`, `@faker-js/faker@^9.0.0` -> `^10.0.0`.
- `front-angular-fab/reference/05-migracion-jest.md`: la clave de configuracion era `setupFilesAfterSetup`, que no existe en Jest. Corregida a `setupFilesAfterEnv`; tal como estaba, el archivo de setup nunca se ejecutaba.
- `front-angular-fab/SKILL.md`: contradiccion de extension de estilos. Declaraba `.css` mientras las 26 ocurrencias de `reference/` usaban `.scss`. Normalizado a `.scss` en principio 1, arbol de carpetas y criterios de calidad.
- `spec-driven-dev/SKILL.md`: referencia rota a la skill `desarrollo`, que no se distribuye en este catalogo.
- `spec-driven-dev/SKILL.md`: retirada la fila "Proyecto CUN con trazabilidad formal", cuyo disparador no estaba definido en ninguna parte y por tanto nunca se activaba.
- `AGENTS.md`: referencia cruzada de la seccion 6 al gate de pruebas, desplazada por la insercion del paso 2.

## [0.12.0] - 2026-05-29

### Agregado
- Skill `backend-nest-hexagonal-cun`: nueva referencia `reference/13-politica-despliegue.md`.
  - Politica de despliegue CUN adaptada a backend: Dockerfile con imagen AWS, Oracle instant-client/cundb01, SonarQube, CI/CD, sanitizacion de variables de entorno, proceso de solicitud por correo, horarios, checklist pre-despliegue.
  - SKILL.md: nueva seccion "Reglas de despliegue", criterios de aceptacion ampliados con requisitos de despliegue.
- Skill `front-angular-fab`: nueva referencia `reference/09-politica-despliegue.md`.
  - Politica de despliegue CUN adaptada a frontend Angular: Dockerfile, SonarQube, CI/CD, variables via environments + contenedor, proceso de solicitud, horarios, checklist pre-despliegue.
  - SKILL.md: nueva seccion "Reglas de despliegue", criterios de calidad ampliados, tabla de referencia actualizada.
- README.md: conteos de archivos de referencia actualizados (backend 13, frontend 9).

### Fuente
- Documento Outline: [Politica de despliegue para aplicaciones](https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw).

## [0.11.0] - 2026-05-28

### Modificado
- Skill `front-angular-fab`: reescritura completa de SKILL.md y referencias.
  - SKILL.md: de 56 lineas (1.9 KB) a 159 lineas (5.5 KB). Consolidacion de 3 skills fuente (angular-architect-fab, angular-component-fab, angular-jest-testing).
  - Eliminadas 8 refs stubs en `references/` (subcarpetas con archivos de 8 lineas).
  - Creadas 8 refs sustanciales en `reference/` (singular): 3327 lineas, 84 KB total.
    - `01-arquitectura-proyecto.md`: arquitectura FAB, estructura carpetas, 8 patrones, servicios, guards, checklist.
    - `02-componentes.md`: standalone v20+, signal inputs/outputs, proyeccion contenido, hooks, control flow.
    - `03-patrones-componentes.md`: model inputs, view/content queries, comunicacion, @defer, directivas, error boundaries.
    - `04-testing-jest.md`: framework Jest, flujo generacion tests, cobertura 85%, HTTP, httpResource, effects.
    - `05-migracion-jest.md`: guia Jasmine+Karma a Jest, dependencias, configuracion, patrones, ejemplo completo.
    - `06-mocking-avanzado.md`: factory functions, Faker determinista, overrides, anti-patrones.
    - `07-http-testing.md`: HttpClient moderno, httpResource, effects con errores, casos negativos.
    - `08-convenciones-codigo.md`: TypeScript strict, archivos, imports, formularios, validacion templates.
- Skill `backend-nest-hexagonal-cun`: carpeta de refs renombrada de `references/` a `reference/` (alineado con convencion). 12 rutas actualizadas en SKILL.md.
- AGENTS.md: reescrito. Lista completa de 7 skills distribuidas. Frontmatter minimo incluye `license`. Regla explicita: `reference/` singular.
- README.md: tabla de skills y arbol de estructura actualizados.
- `_template/SKILL.md`: agregado `license: MIT` al frontmatter de ejemplo.

### Corregido
- Inconsistencia `references/` vs `reference/`: normalizado a singular en todas las skills.
- AGENTS.md: decia "solo google-adk-cun se distribuye" cuando hay 7 skills activas.
- Frontmatter: agregado `license: MIT` a `backend-nest-hexagonal-cun` y `google-adk-cun`.
- LICENSE: copyright actualizado a `2025-2026`.


## [0.10.0] - 2026-05-28

### Agregado
- Skill `backend-nest-hexagonal-cun`: skill base para construir proyectos backend en NestJS con Arquitectura Hexagonal.
  - SKILL.md con proposito, principio rector, reglas obligatorias, estructura minima y criterios de aceptacion.
  - 12 archivos de referencia en `references/`: arquitectura, domain, application, infrastructure, settings, common, flujo de peticion, convenciones de nombrado, Swagger, imports, checklist de modulos y anti-patrones.
- Skill `front-angular-fab`: marco de trabajo para proyectos Front Angular Fabrica de Software CUN.
  - SKILL.md con principios, flujo de trabajo, politica de referencias y criterios de calidad.
  - 8 archivos de referencia en `references/`: arquitectura, componentes, formularios, HTTP, testing-jest, mocking, migracion y errores-reactivos.
- README.md: actualizado con skills nuevos en tabla y arbol de estructura.

### Eliminado
- Skill `front-angular`: eliminada carpeta y sub-skills (angular-architect-fab, angular-component-fab, angular-jest-testing). Reemplazada por `front-angular-fab`.

## [0.9.0] - 2026-05-22

### Cambiado
- Skill `plane-cun-api` renombrada a `proyectos-tareas-cun`. Carpeta, frontmatter y documentacion actualizados.

## [0.8.2] - 2026-05-22

### Corregido
- Skill `plane-cun-api`: corregidos errores de conexion reportados.
  - Advertencia explicita: instancia self-hosted, no usar api.plane.so.
  - Advertencia: no existen endpoints de work-items a nivel workspace (requieren project_id).
  - Agregada seccion de verificacion de conexion con `GET /users/me/`.
  - Agregado flujo operativo recomendado para consultar tareas del usuario.
  - Endpoint `/users/me/` agregado a reference/endpoints.md.

## [0.8.1] - 2026-05-22

### Cambiado
- Skill `spec-driven-dev`: traducido `reference/spec-driven-original.md` de ingles a espanol para mantener consistencia de idioma en todo el repositorio.

## [0.8.0] - 2026-05-22

### Agregado
- Skill `ux-design`: principios de UX/UI y psicologia cognitiva aplicada al diseno de interfaces.
  - Principio fundamental de la Fabrica de Software CUN.
  - 10 leyes de UX fundamentales organizadas por categoria (toma de decisiones, percepcion, memoria, comportamiento).
  - Principios de UI: jerarquia visual, Gestalt, grids, consistencia, responsive/mobile-first.
  - Sistema de diseno: arquitectura de design tokens en 3 niveles (W3C), color, tipografia, espaciado, animacion.
  - Accesibilidad: WCAG 2.2 AA como nivel minimo obligatorio.
  - Flujo de trabajo de 4 pasos: Auditar, Diagnosticar, Proponer, Verificar.
  - Gates de calidad: visual, interaccion, consistencia.
  - Plantilla `design.md` para crear design systems desde cero.
  - reference/leyes-ux.md: catalogo expandido de 20+ leyes con ejemplos practicos y CSS.

## [0.7.0] - 2026-05-22

### Agregado
- Skill `spec-driven-dev`: guia de Spec-Driven Development basada en GitHub Spec Kit.
  - Flujo de 3 fases: Especificar, Planificar, Tareas.
  - Integracion documentada con artefactos nativos del agente (implementation_plan.md, task.md).
  - Tabla de formatos de contratos por tipo de proyecto (OpenAPI, TS, SQL, gRPC, etc.).
  - Plantillas mejoradas con criterios de terminado y dependencias.
  - Secciones "Cuando NO usar" y gates de calidad.
  - reference/spec-driven-original.md con documento fuente de GitHub Spec Kit.

## [0.6.0] - 2026-05-22

### Modificado
- Skill `google-adk-cun`: mejoras operativas en SKILL.md.
  - Nueva seccion "Regla de consulta obligatoria" con flujo de validacion en docs antes de codificar.
  - Instruccion de consultar buenas-practicas.md antes de implementar agentes.

### Agregado
- `google-adk-cun/reference/buenas-practicas.md`: anti-patrones, convenciones para subagentes, contrato de estado, reglas de calidad, checklist de aceptacion y plantilla de implementacion.

## [0.5.0] - 2026-05-22

### Agregado
- Skill `plane-cun-api`: administracion del workspace "vsd" en Plane (proyectos.cunapp.pro).
  - SKILL.md con configuracion, prerequisitos de API key, reglas, autenticacion, paginacion, rate limiting y ejemplos.
  - reference/endpoints.md con endpoints organizados alfabeticamente por recurso (13 secciones).

## [0.4.0] - 2026-05-22

### Agregado
- Skill `memoria`: protocolo para gestion de memoria en interacciones con el usuario.
  - Identificacion de usuario, recuperacion de memoria, categorizacion de informacion y actualizacion del grafo de conocimiento.

## [0.3.0] - 2026-05-22

### Agregado
- Plantilla base `_template/` con estructura minima de skill (SKILL.md + reference/).
- Script `scripts/validate.sh` para validacion de estructura de skills.
  - Verifica existencia de SKILL.md, frontmatter YAML, campos obligatorios y coincidencia de nombre.
- README.md: secciones "Crear un skill nuevo", "Validacion" y estructura actualizada.

## [0.2.0] - 2026-05-21

### Modificado
- Skill `google-adk-cun`: reescritura completa de SKILL.md
  - Corregida numeracion de secciones (faltaba seccion 4).
  - Completadas secciones vacias: Runtime/arquitectura y Despliegue.
  - Agregadas secciones: Modelos, Streaming, Graphs/Workflows.
  - Expandidas URLs de documentacion oficial verificadas contra adk.dev/llms-full.txt.
  - Vinculado archivo de referencia local agente-base.md con tabla de referencia.
  - Mejoradas instrucciones para el agente.
- Referencia `agente-base.md`: eliminado texto residual al final.
- README.md: actualizada org a fabricaSoftwareCUN.

## [0.1.0] - 2026-05-21

### Agregado
- Skill `google-adk-cun`: guia de referencia para Google Agent Development Kit.
  - SKILL.md con indice tematico y enlaces a documentacion oficial.
  - Referencia `agente-base.md` con contexto operativo para proyectos ADK.
