# Reglas de imports y dependencias

## Objetivo

Evitar acoplamiento incorrecto entre capas.

## Domain

Solo puede importar:

- Funcionalidades nativas de TypeScript.
- Otras entidades del dominio.
- DTOs del dominio.
- Enums del dominio.
- Types del dominio.
- Interfaces de repositorio del dominio.

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
- Puertos de aplicación.
- Mappers de aplicación.
- Decoradores mínimos de NestJS necesarios para inyección.
- Herramientas de transformación cuando sean necesarias.

No puede importar:

- Controladores.
- DTOs de infraestructura.
- Entidades TypeORM.
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

## Dirección permitida

```text
Infrastructure → Application → Domain
```

## Dirección prohibida

```text
Domain → Application
Domain → Infrastructure
Application → Infrastructure
```

## Regla de inversión de dependencias

Cuando Application necesite una capacidad externa:

1. Define un puerto o interfaz.
2. Usa ese puerto en el servicio de aplicación.
3. Implementa el puerto en Infrastructure.
4. Registra la implementación concreta en el módulo de infraestructura.
