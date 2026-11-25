---
name: backend-nest-hexagonal-cun
description: Skill base de la Fabrica de Software CUN para construir proyectos backend en NestJS 12+ con Arquitectura Hexagonal, Fastify, TypeORM 1.x, PostgreSQL 19, Swagger y Prometheus. Incluye reglas de despliegue alineadas con la normativa Outline de la Fabrica de Software CUN.
license: MIT
---

# Skill base: Backend NestJS con Arquitectura Hexagonal de la Fabrica de Software CUN

## Proposito

Usa esta skill cuando se deba crear, revisar, documentar o estandarizar un backend en **NestJS** bajo el patron de **Arquitectura Hexagonal** o **Ports & Adapters**.

El objetivo es mantener el dominio independiente de frameworks, separar los casos de uso de los detalles tecnicos y organizar la infraestructura como una capa adaptadora.

## Principio rector

Toda decision tecnica debe preservar esta regla:

```text
Infrastructure -> Application -> Domain
```

Las dependencias siempre apuntan hacia el centro. El dominio nunca debe depender de aplicacion ni de infraestructura.

## Versiones del stack (pisos exigidos)

| Componente | Piso | Nota |
|---|---|---|
| Node.js | 26 LTS | TypeORM 1.1 exige >= 24.11 |
| NestJS (`@nestjs/core`, `@nestjs/cli`) | 12 | Sustituye al piso 11 |
| TypeScript | 6.0 | **No** usar TypeScript 7 |
| TypeORM | 1.1 | Con `@nestjs/typeorm` 12 |
| PostgreSQL | 19 | |
| `@nestjs/config` | 12 | |
| `@nestjs/swagger` | 12 | |
| `@nestjs/platform-fastify` | 12 | Adaptador HTTP por defecto |
| `@nestjs/cache-manager` | 12 | Cache Redis |
| `@willsoto/nestjs-prometheus` | 7 | Peer `@prometheus-io/client` 0.16; no usar `prom-client` |
| Redis | ultima estable | Cache |
| Jest | 30 | |
| `class-validator` | 0.15 | |

**Regla transversal:** verificar la version exacta mas reciente con `npm view <paquete> version` antes de instalar y fijar la version exacta en `package.json` y lockfile.

## Como usar esta skill

Antes de crear o modificar un proyecto backend, consulta las referencias segun la funcionalidad requerida:

1. [Arquitectura y estructura base](reference/01-arquitectura-estructura.md)
2. [Capa Domain](reference/02-domain.md)
3. [Capa Application](reference/03-application.md)
4. [Capa Infrastructure](reference/04-infrastructure.md)
5. [Settings, configuracion y bases de datos](reference/05-settings-bases-datos.md)
6. [Common, adaptadores y recursos compartidos](reference/06-common-adaptadores.md)
7. [Flujo de peticion y mapeo entre capas](reference/07-flujo-peticion-mappers.md)
8. [Convenciones de nombrado](reference/08-convenciones-nombrado.md)
9. [Swagger y documentacion API](reference/09-swagger-documentacion.md)
10. [Reglas de imports y dependencias](reference/10-imports-dependencias.md)
11. [Checklist de creacion de modulos](reference/11-checklist-modulos.md)
12. [Anti-patrones y buenas practicas](reference/12-antipatrones-buenas-practicas.md)
13. [Politica de despliegue para aplicaciones](reference/13-politica-despliegue.md)

## Uso obligatorio del CLI de NestJS

- Version minima: **NestJS 12**. Verificar como primera accion en `package.json` (`@nestjs/core`) y con `nest --version`. Proyecto nuevo por debajo de 12 esta prohibido; proyecto existente no bloquea el trabajo pero genera advertencia de no conformidad y deuda registrada.
- El CLI es `@nestjs/cli` (binario `nest`). Si no esta disponible: `npm i -g @nestjs/cli`.
- Prohibido crear a mano lo que el CLI genera: proyectos con `nest new`, y modulos, controladores, servicios, guards, interceptores y pipes con `nest generate`.
- El CLI genera la estructura por defecto de NestJS, no la hexagonal. Tras generar, los archivos se reubican en `domain`, `application` e `infrastructure` conforme a [01-arquitectura-estructura.md](reference/01-arquitectura-estructura.md). La regla de dependencias prevalece sobre la disposicion por defecto del CLI.
- Descubrir opciones de un schematic con `nest generate <schematic> --help` antes de usarlo. Prohibido improvisar flags.
- La Fabrica de Software desarrollara schematics personalizados (`nest g feature <nombre>`) para generar la estructura hexagonal completa. Hoy no estan disponibles; se mencionan como herramienta futura.

## Gate de especificacion

Si la tarea introduce o modifica capacidad funcional, exige antes PRD, historia de usuario o especificacion escrita, y aplica Spec-Driven Development conforme a la skill `spec-driven-dev`. SDD es obligatorio cuando la tarea modifica codigo existente, afecta a mas de un archivo, altera contratos o APIs, o introduce logica algoritmica o condicional nueva. Un cambio de contrato en `domain` o en un DTO de `application/dtos` cumple el tercer disparador por definicion.

## Reglas obligatorias de alto nivel

- **Un repositorio por tecnologia. Monorepo prohibido.** El backend vive en su propio repositorio `<proyecto>-back` y no comparte repositorio con el front (`<proyecto>-front`) ni con el agente ADK (`<proyecto>-adk`). Proyecto nuevo planteado como monorepo: bloqueado. Proyecto existente que ya es monorepo: no bloquea el trabajo, pero se declara no conformidad y se registra la deuda de separacion en TASKS.md.
- Separar siempre el proyecto en `domain`, `application` e `infrastructure`.
- Mantener `domain` libre de frameworks, ORM, validadores, Swagger y dependencias externas.
- Implementar los casos de uso en `application`.
- Implementar controladores, persistencia, adaptadores, validaciones y configuracion en `infrastructure`.
- Usar interfaces para desacoplar repositorios y servicios externos.
- Mapear siempre entre capas mediante mappers.
- Validar datos en la frontera de entrada, no dentro del dominio.
- Documentar la API desde infraestructura usando Swagger; los DTOs documentados con `@ApiProperty` viven en `application/dtos/<modulo>/` (R27).
- Centralizar configuracion, bases de datos y logger en `infrastructure/settings`.
- Centralizar guards, interceptors, decoradores, utilidades, metricas y adaptadores comunes en `infrastructure/common`.

## Reglas tecnicas obligatorias

- **Adaptador HTTP:** Fastify por defecto (`@nestjs/platform-fastify`). Express solo si una dependencia lo exige; la decision se documenta en el README del proyecto.
- **Prefijo global:** todas las APIs bajo `/api/v1` via `app.setGlobalPrefix('api/v1')`.
- **Swagger:** UI en `/docs/dev-only/swagger` con `SwaggerModule.setup('docs/dev-only/swagger', app, document)`. Decoradores obligatorios: `@ApiTags`, `@ApiOperation`, `@ApiResponse`, `@ApiProperty`.
- **Metricas:** endpoint `GET /metrics` con `@willsoto/nestjs-prometheus` y peer `@prometheus-io/client` 0.16. Exponer las cuatro senales de oro (trafico, errores 5xx, latencia p95/p99, saturacion) y metricas de negocio. No usar `prom-client`.
- **Configuracion:** `@nestjs/config` con `ConfigModule.forRoot({ isGlobal: true })` y clase de validacion con `class-validator`/`class-transformer` en el bootstrap.
- **Persistencia:** TypeORM 1.x con migraciones; `synchronize: false` siempre. Flujo: generar migracion, revisarla, aplicarla en despliegue.
- **Cache:** `@nestjs/cache-manager` con Redis cuando aplique.
- **Seguridad DB:** minimo privilegio, TLS en transito, `pgcrypto` para columnas sensibles.
- **Build produccion:** `tsconfig` con `removeComments: true` y `sourceMap: false`.
- **Contenerizacion:** Dockerfile multi-etapa optimizado para produccion.

## Estructura minima esperada

El arbol mostrado es el minimo obligatorio (STACK §3.2). Cuando el proyecto tiene varios modulos se permiten subcarpetas por modulo (R26):

```text
domain/entities/<modulo>/
domain/services/<modulo>/
domain/ports/out/<modulo>/
application/use-cases/<modulo>/
application/dtos/<modulo>/
infrastructure/adapters/<tipo>/<modulo>/
infrastructure/controllers/<modulo>/
```

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
    ├── adapters/            # implementaciones de ports/out
    ├── controllers/         # adaptadores de entrada HTTP, Swagger
    ├── persistence/<motor>/entities|migrations
    ├── modules/             # modulos NestJS que cablean dependencias
    ├── settings/            # ConfigModule, validacion de env, conexion DB, logger
    └── common/              # guards, interceptors, decorators, pipes, utils, metrics
```

## Reglas de despliegue

- El proyecto DEBE incluir un `Dockerfile` funcional con la imagen publica AWS del Tech Lead, build multi-etapa.
- Incluir configuracion de **SonarQube** (`sonar-project.properties`) y `main.yml` para CI/CD (GitHub Actions).
- `.gitignore` conforme a R10: excluir `docker-compose.yml`, `docker-compose.*.yml`, `compose.yml`, `compose.*.yml`, `*.sh`, `.env`, `.env.*`.
- Variables de entorno en formato `SNAKE_CASE`, sanitizadas, ordenadas por categoria y enviadas como adjunto `.txt` con bloques `ENVS NUEVAS / ENVS MODIFICADAS / ENVS ELIMINADAS`. Nunca en el repositorio.
- Proyectos con Oracle: incluir `instant-client` en el Dockerfile con host `cundb01`.
- El Swagger de la API debe estar registrado en el [inventario de aplicaciones](https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm).
- No se despliega a produccion sin [checklist aprobado](https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP).
- **Despliegue a PRO solo en lunes habil**; si el lunes no es habil, el siguiente dia habil. QA y STG: solicitud al Tech Lead. PRO lunes habil: aprobacion del QA en el hilo de correo y checklist aprobado por el Tech Lead, o solicitud directa del Coordinador por el canal debido. PRO martes a viernes: Vicerrector de Servicios Digitales. PRO sabado, domingo o festivo: autorizacion correspondiente bajo la autorizacion general del Vicerrector. Hotfix critico: Coordinador de la Fabrica.
- Cobertura: gate bloqueante de **70 % en codigo nuevo** (SonarQube); objetivo recomendado del equipo: **85 % global**.
- Rama por ambiente: `develop` (DEV), `qa` (QA), `stg` (STG), `main` (PRO). Ramas efimeras: `<tipo>/<ID_HU>-<slug-kebab>`. SemVer con sufijos por rama y tag `vX.Y.Z` en `main`.
- Consultar la referencia completa: [13-politica-despliegue.md](reference/13-politica-despliegue.md).

## Fuentes normativas

| Codigo | Documento | URL | Ultima edicion |
|---|---|---|---|
| POL-DEP | POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001, v1.0) | https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU | 2026-09-14 |
| PROC-DEP | Politica de despliegue para aplicaciones | https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw | 2026-09-14 |
| STACK | Estandares, Arquitectura y Stack Tecnologico (v2.0) | https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ | 2026-07-29 |
| CHECK | Checklist - Paso a produccion de App | https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP | 2026-05-21 |
| VER | Politica de Versionamiento (v1.0.0) | https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC | 2025-12-09 |
| INV | Lista de aplicaciones (inventario) | https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm | — |

Fecha de alineacion: 2026-11-25.

## Criterio de aceptacion

Una implementacion cumple la skill si:

- El backend vive en su propio repositorio `<proyecto>-back`; no comparte repositorio con front ni con el agente ADK.
- El proyecto corre sobre NestJS 12 o superior, Node 26 LTS, TypeScript 6.0, TypeORM 1.1, PostgreSQL 19.
- La estructura y los artefactos se generaron con el CLI de Nest, no a mano.
- El dominio contiene solo negocio puro.
- La aplicacion orquesta casos de uso sin conocer tecnologia concreta.
- La infraestructura adapta HTTP, bases de datos, servicios externos y configuracion.
- No existen dependencias invertidas.
- Los controladores no contienen logica de negocio.
- Los repositorios concretos implementan contratos definidos hacia el centro.
- Los DTOs de `application/dtos/<modulo>/` validan y documentan la entrada.
- Los mappers separan los modelos de cada capa.
- El proyecto incluye `Dockerfile` multi-etapa, `sonar-project.properties` y `main.yml`.
- `.gitignore` excluye `docker-compose.yml`, `docker-compose.*.yml`, `compose.yml`, `compose.*.yml`, `*.sh`, `.env`, `.env.*`.
- Las variables de entorno estan sanitizadas y se envian como adjunto `.txt` con los tres bloques obligatorios.
- El endpoint `GET /metrics` expone las cuatro senales de oro y metricas de negocio.
- Swagger UI disponible en `/docs/dev-only/swagger` con prefijo global `/api/v1`.
- TypeORM usa migraciones con `synchronize: false`.
- Cobertura de codigo nuevo >= 70 % (gate SonarQube).
- Despliegue a PRO solo en lunes habil (R1).
