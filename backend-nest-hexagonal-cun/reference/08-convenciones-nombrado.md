# Convenciones de nombrado

## Objetivo

Mantener consistencia en nombres de archivos, clases, interfaces y módulos, conforme a STACK §3.2.

## Archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Entidad de dominio | kebab-case con sufijo `.entity.ts` | `user.entity.ts` |
| Entidad TypeORM | kebab-case con sufijo `.orm-entity.ts` | `user.orm-entity.ts` |
| Puerto de repositorio | kebab-case con sufijo `.repository.port.ts` | `user.repository.port.ts` |
| Caso de uso | kebab-case con sufijo `.use-case.ts` | `create-user.use-case.ts` |
| DTO | kebab-case con sufijo `.dto.ts` | `create-user.dto.ts` |
| Mapper | kebab-case con sufijo `.mapper.ts` | `user.mapper.ts` |
| Controlador | kebab-case con sufijo `.controller.ts` | `user.controller.ts` |
| Adaptador | kebab-case con sufijo `.adapter.ts` | `postgres.user.repository.adapter.ts` |
| Servicio de dominio | kebab-case con sufijo `.domain-service.ts` | `user.domain-service.ts` |
| Módulo NestJS | kebab-case | `user.module.ts` |

## Domain

| Elemento | Convención |
|---|---|
| Entidad | Clase pura del dominio, PascalCase |
| Enum / Type | Nombre descriptivo del concepto de negocio |
| Puerto de salida | Interface con prefijo `I`, sufijo `RepositoryPort` |
| Puerto de entrada | Interface con prefijo `I`, sufijo `UseCasePort` (opcional) |
| Servicio de dominio | PascalCase con sufijo `DomainService` |

## Application

| Elemento | Convención |
|---|---|
| Caso de uso | Acción + entidad + `UseCase` |
| DTO | kebab-case con sufijo `.dto.ts`, PascalCase con sufijo `Dto` |
| Mapper | Entidad o caso + `Mapper` |
| Módulo | kebab-case |

## Infrastructure

| Elemento | Convención |
|---|---|
| Controller | Recurso + `Controller` |
| Entity TypeORM | Recurso + `OrmEntity` |
| Repository concreto | Recurso + `RepositoryAdapter` |
| Adapter | Capacidad + `Adapter` |
| Módulo | kebab-case |

## Reglas generales

- Los nombres deben expresar intención de negocio.
- Evitar nombres genéricos como `Manager`, `Helper` o `Util` salvo que sean realmente técnicos.
- No nombrar puertos según tecnologías concretas.
- No nombrar entidades de dominio según tablas de base de datos.
- No mezclar nombres de infraestructura dentro de Domain.
- Todos los archivos usan `kebab-case` en el nombre de archivo.
