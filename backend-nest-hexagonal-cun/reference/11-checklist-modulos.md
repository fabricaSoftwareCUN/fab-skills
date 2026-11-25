# Checklist de creación de módulos

## Objetivo

Verificar que cada nuevo módulo respete la arquitectura hexagonal conforme a STACK §3.2.

## Domain

Validar:

- Existe carpeta del modulo en `domain/entities/<modulo>/` (o `domain/entities/` directamente si hay un solo modulo).
- Existe entidad o clase de dominio cuando el caso lo requiere.
- Existen enums o types si el negocio los necesita.
- Existe puerto de repositorio en `domain/ports/out/` (o `domain/ports/out/<modulo>/`) si hay persistencia.
- Existe servicio de dominio en `domain/services/<modulo>/` (o `domain/services/`) si hay logica de negocio pura.
- La capa no importa frameworks ni infraestructura.

## Application

Validar:

- Existen casos de uso en `application/use-cases/<modulo>/` (o `application/use-cases/` directamente si hay un solo modulo).
- Cada caso de uso tiene una unica responsabilidad.
- Los casos de uso inyectan interfaces (puertos), no implementaciones.
- Existen DTOs en `application/dtos/<modulo>/` (o `application/dtos/`) cuando se requiere comunicacion entre capas.
- Existen mappers en `application/mappers/` si se requiere transformacion.
- No se importa infraestructura.

## Infrastructure

Validar:

- Existe controlador en `infrastructure/controllers/` (o `infrastructure/controllers/<modulo>/`) si el modulo expone HTTP.
- Existen DTOs en `application/dtos/<modulo>/` con validaciones (`class-validator`).
- Los DTOs estan documentados con Swagger (`@ApiProperty`).
- Existen entidades de persistencia en `infrastructure/persistence/<motor>/entities/` si hay base de datos.
- Existen migraciones en `infrastructure/persistence/<motor>/migrations/`.
- Existe adaptador de repositorio en `infrastructure/adapters/` si hay persistencia.
- El adaptador implementa el puerto del dominio.
- Existen mappers entre persistencia y dominio.
- Existe modulo en `infrastructure/modules/` que registra providers concretos.

## Flujo

Validar:

- El controlador delega al caso de uso.
- El caso de uso ejecuta la lógica de aplicación.
- El dominio contiene las reglas esenciales.
- La infraestructura implementa detalles técnicos.
- La respuesta no expone entidades de persistencia.
- No se saltan mappers entre capas.

## Configuración

Validar:

- Las variables de entorno están centralizadas en `infrastructure/settings/`.
- La base de datos se configura desde `settings`.
- Swagger se configura desde infraestructura.
- Logger se configura desde infraestructura.
- Métricas Prometheus están expuestas en `/metrics`.
- Health check endpoint disponible.

## Resultado esperado

El módulo debe poder evolucionar sin que cambios en base de datos, HTTP o SDKs externos obliguen a modificar el dominio.
