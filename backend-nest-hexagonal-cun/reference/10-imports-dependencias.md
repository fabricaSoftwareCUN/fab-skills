# Reglas de imports y dependencias

## Objetivo

Evitar acoplamiento incorrecto entre capas, conforme a la regla de dependencia de la Arquitectura Hexagonal (STACK §3.1).

## Domain

Solo puede importar:

- Funcionalidades nativas de TypeScript.
- Otras entidades del dominio (`domain/entities/`).
- Enums y types del dominio (`domain/entities/`).
- Puertos del dominio (`domain/ports/`).
- Servicios de dominio (`domain/services/`).

No puede importar:

- NestJS.
- TypeORM.
- Swagger.
- class-validator.
- ConfigModule.
- SDKs externos.
- Entidades de infraestructura.
- Servicios de aplicación.

## Application

Puede importar:

- Todo lo permitido del dominio.
- Puertos de dominio (`domain/ports/out/`, `domain/ports/in/`).
- Mappers de aplicación (`application/mappers/`).
- DTOs de aplicación (`application/dtos/`).
- Decoradores mínimos de NestJS necesarios para inyección.
- Herramientas de transformación cuando sean necesarias.

Excepcion R27: Application puede importar `class-validator`, `class-transformer` y `@nestjs/swagger` unicamente dentro de `application/dtos/<modulo>/`.

No puede importar:

- Controladores.
- Entidades TypeORM (`.orm-entity.ts`).
- Repositorios concretos.
- Adaptadores concretos.
- Configuración de infraestructura.
- SDKs externos directamente.

## Infrastructure

Puede importar:

- Domain.
- Application.
- NestJS.
- TypeORM.
- ConfigModule.
- Swagger.
- class-validator.
- SDKs externos.
- Librerías técnicas.
- `@willsoto/nestjs-prometheus` y `@prometheus-io/client`.

## Dirección permitida

```text
Infrastructure -> Application -> Domain
```

## Dirección prohibida

```text
Domain -> Application
Domain -> Infrastructure
Application -> Infrastructure
```

## Regla de inversión de dependencias

Cuando Application necesite una capacidad externa:

1. Define un puerto en `domain/ports/out/`.
2. Usa ese puerto en el caso de uso.
3. Implementa el puerto en `infrastructure/adapters/`.
4. Registra la implementación concreta en el módulo de infraestructura (`infrastructure/modules/`).
