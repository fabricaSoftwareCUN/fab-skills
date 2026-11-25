# Arquitectura y estructura base

## Objetivo

Definir la organización principal de un backend NestJS usando Arquitectura Hexagonal, conforme a la estructura obligatoria de STACK §3.2.

## Capas principales

### Domain

Es el núcleo del sistema. Contiene reglas de negocio, entidades puras, enums, types, puertos de entrada y salida, y servicios de dominio.

No debe depender de tecnologías externas.

### Application

Contiene los casos de uso. Orquesta el flujo de negocio usando entidades, DTOs, puertos e interfaces del dominio.

No debe conocer implementaciones concretas.

### Infrastructure

Contiene los detalles técnicos del sistema: HTTP, controladores, validaciones, Swagger, persistencia, adaptadores, configuración, logger, métricas y conexiones externas.

## Regla de dependencias

Las dependencias deben apuntar siempre hacia el centro:

```text
Infrastructure -> Application -> Domain
```

Reglas:

- Infrastructure puede importar Application y Domain.
- Application puede importar Domain.
- Domain no puede importar Application ni Infrastructure.
- Los detalles técnicos deben permanecer fuera de Domain.

## Estructura base obligatoria

Conforme a STACK §3.2 (mandatorio para todos los proyectos de backend):

```text
src/
├── main.ts
├── app.module.ts
├── domain/
│   ├── entities/            # clases puras, sin decoradores de ORM
│   ├── ports/
│   │   ├── in/              # opcional: contratos de casos de uso
│   │   └── out/             # contratos de repositorios y servicios externos
│   └── services/            # lógica de dominio pura
├── application/
│   ├── use-cases/<modulo>/
│   ├── dtos/<modulo>/
│   └── mappers/
└── infrastructure/
    ├── adapters/            # implementaciones de ports/out (persistence, http, messaging)
    ├── controllers/         # adaptadores de entrada HTTP, Swagger
    ├── persistence/<motor>/entities|migrations
    ├── modules/             # módulos NestJS que cablean dependencias
    ├── settings/            # ConfigModule, validación de env, conexión DB, logger
    └── common/              # guards, interceptors, decorators, pipes, utils, metrics
```

Las subcarpetas `settings/` y `common/` son permitidas y se conservan como parte de la estructura estandar.

El arbol mostrado es el minimo obligatorio. Cuando el proyecto tiene varios modulos se permiten subcarpetas por modulo (R26):

```text
domain/entities/<modulo>/
domain/services/<modulo>/
domain/ports/out/<modulo>/
application/use-cases/<modulo>/
application/dtos/<modulo>/
infrastructure/adapters/<tipo>/<modulo>/
infrastructure/controllers/<modulo>/
```

> **Nota:** La Fábrica de Software planea desarrollar schematics personalizados (`nest g feature <nombre>`) para generar automáticamente esta estructura. Hoy no están disponibles; se mencionan como herramienta futura.

## Módulos principales

### AppModule

Responsabilidades:

- Importar `InfrastructureModule` primero.
- Importar `ApplicationModule` después.
- No configurar `ConfigModule` directamente.

### InfrastructureModule

Responsabilidades:

- Ser global.
- Configurar `ConfigModule` con `isGlobal: true`.
- Registrar providers de base de datos.
- Cargar configuración global.
- Importar y exportar módulos de infraestructura.

### ApplicationModule

Responsabilidades:

- Ser global.
- Importar módulos de aplicación.
- Exportar servicios de aplicación.
- Mantener disponibles los casos de uso para infraestructura.

## Carpetas obligatorias

Deben existir siempre:

```text
src/domain
src/domain/entities
src/domain/ports
src/domain/ports/in
src/domain/ports/out
src/domain/services
src/application
src/application/use-cases
src/application/dtos
src/application/mappers
src/infrastructure
src/infrastructure/adapters
src/infrastructure/controllers
src/infrastructure/persistence
src/infrastructure/modules
src/infrastructure/settings
src/infrastructure/common
```

## Reglas críticas

- `InfrastructureModule` y `ApplicationModule` deben estar disponibles globalmente cuando el proyecto lo requiera.
- `ConfigModule.forRoot()` debe estar únicamente en infraestructura.
- `AppModule` no debe configurar variables de entorno.
- `InfrastructureModule` debe importarse antes que `ApplicationModule`.
- Los módulos específicos deben exportarse cuando otros módulos los necesiten.
- TypeORM usa migraciones con `synchronize: false` siempre.
- El endpoint `GET /metrics` debe estar expuesto desde `infrastructure/common/metrics`.
- Swagger UI en `/docs/dev-only/swagger` con prefijo global `/api/v1`.
