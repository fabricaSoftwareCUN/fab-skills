# Capa Infrastructure

## Responsabilidad

La capa Infrastructure adapta tecnologías externas hacia la aplicación. Contiene HTTP, persistencia, validaciones, documentación, configuración, repositorios concretos y adaptadores.

## Estructura

Conforme a STACK §3.2:

```text
infrastructure/
├── adapters/            # implementaciones de ports/out (persistence, http, messaging)
├── controllers/         # adaptadores de entrada HTTP, Swagger
├── persistence/<motor>/entities|migrations
├── modules/             # módulos NestJS que cablean dependencias
├── settings/            # ConfigModule, validación de env, conexión DB, logger
└── common/              # guards, interceptors, decorators, pipes, utils, metrics
```

## Controladores

Ubicación:

```text
infrastructure/controllers/
```

Reglas:

- Reciben solicitudes HTTP.
- Reutilizan los DTOs de `application/dtos/<modulo>/` (R27); no se duplican DTOs en infraestructura.
- Delegan la ejecución a casos de uso de aplicación.
- Usan mappers para transformar datos.
- Documentan endpoints con Swagger.
- No contienen lógica de negocio.
- No acceden directamente a repositorios si el caso de uso pertenece a Application.
- Se nombran con sufijo `.controller.ts`.

## DTOs

Los DTOs viven en `application/dtos/<modulo>/` y son reutilizados por los controladores de infraestructura (R27). No se duplica un juego de DTOs en infraestructura.

Reglas:

- Representan contratos HTTP y de comunicación entre capas.
- Usan validaciones con `class-validator` y `class-transformer`.
- Usan documentación con Swagger (`@ApiProperty`).
- Funcionan como primera línea de validación.
- Se nombran con sufijo `.dto.ts`.

## Persistencia

Estructura obligatoria:

```text
infrastructure/persistence/<motor>/
├── entities/          # entidades TypeORM (con decoradores)
└── migrations/        # migraciones de base de datos
```

Ejemplo con TypeORM/PostgreSQL:

```text
infrastructure/persistence/postgres/
├── entities/
│   └── user.orm-entity.ts
└── migrations/
    └── 1710000000000-CreateUsersTable.ts
```

## Entidades de persistencia

Reglas:

- Representan tablas, columnas y relaciones.
- Usan decoradores de TypeORM.
- Se nombran con sufijo `.orm-entity.ts`.
- No deben usarse como entidades de dominio.
- No deben retornarse directamente desde casos de uso.
- Deben mapearse hacia entidades de dominio.

## Repositorios de infraestructura

Ubicación:

```text
infrastructure/adapters/persistence/<motor>/
```

Reglas:

- Implementan interfaces definidas en `domain/ports/out/`.
- Usan TypeORM u otra tecnología concreta de persistencia.
- Transforman entidades de persistencia a entidades de dominio.
- Encapsulan consultas y detalles de almacenamiento.
- No exponen detalles técnicos a Application o Domain.
- Se nombran con sufijo `.adapter.ts` (por ejemplo: `postgres.user.repository.adapter.ts`).

## Adaptadores

Ubicación:

```text
infrastructure/adapters/
```

Reglas:

- Implementan puertos definidos en `domain/ports/out/`.
- Encapsulan SDKs, APIs externas, servicios cloud o librerías técnicas.
- Deben ubicarse en infraestructura.
- Deben evitar que Application conozca detalles externos.
- Se nombran con sufijo `.adapter.ts`.

## Módulos de infraestructura

Ubicación:

```text
infrastructure/modules/
```

Reglas:

- Importan el módulo de aplicación correspondiente.
- Declaran controladores.
- Registran providers concretos.
- Vinculan interfaces con implementaciones.
- Exportan providers cuando otros módulos los necesitan.

## Prohibiciones

- Colocar reglas de negocio en controladores.
- Retornar entidades de persistencia directamente.
- Saltarse mappers.
- Hacer que Application dependa de infraestructura.
- Duplicar lógica de casos de uso en controladores.
