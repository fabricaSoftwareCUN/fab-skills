# Convenciones de nombrado

## Objetivo

Mantener consistencia en nombres de archivos, clases, interfaces y módulos.

## Archivos

| Tipo | Convención |
|---|---|
| Entidades de dominio | PascalCase |
| DTOs | PascalCase con sufijo `Dto` |
| Interfaces | PascalCase con prefijo `I` |
| Enums | PascalCase |
| Servicios | PascalCase con sufijo `Service` |
| Controladores | PascalCase con sufijo `Controller` |
| Mappers | PascalCase con sufijo `Mapper` |
| Adaptadores | PascalCase con sufijo `Adapter` |
| Módulos NestJS | kebab-case |

## Domain

| Elemento | Convención |
|---|---|
| Entidad | Clase pura del dominio |
| DTO | Interface o type |
| Enum | Sufijo `Enum` cuando ayude a claridad |
| Repositorio | Interface con prefijo `I` |
| Type auxiliar | Nombre descriptivo del concepto |

## Application

| Elemento | Convención |
|---|---|
| Servicio | Acción + entidad + `Service` |
| Puerto | Interface que describe capacidad |
| Mapper | Entidad o caso + `Mapper` |
| Módulo | `app-{module}.module.ts` |

## Infrastructure

| Elemento | Convención |
|---|---|
| Controller | Recurso + `Controller` |
| DTO de entrada | Acción + recurso + `RequestDto` |
| DTO de salida | Acción + recurso + `ResponseDto` |
| Entity TypeORM | Recurso + motor + `Entity` |
| Repository concreto | Recurso + `RepositoryImpl` |
| Adapter | Capacidad + `Adapter` |
| Módulo | `infra-{module}.module.ts` |

## Reglas generales

- Los nombres deben expresar intención de negocio.
- Evitar nombres genéricos como `Manager`, `Helper` o `Util` salvo que sean realmente técnicos.
- No nombrar puertos según tecnologías concretas.
- No nombrar entidades de dominio según tablas de base de datos.
- No mezclar nombres de infraestructura dentro de Domain.
