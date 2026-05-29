---
name: backend-nest-hexagonal-cun
description: Skill base de la Fabrica de Software CUN para construir proyectos backend en NestJS aplicando Arquitectura Hexagonal, separación por capas, reglas de dependencia, configuración global, persistencia, documentación Swagger y convenciones de estructura.
license: MIT
---

# Skill base: Backend NestJS con Arquitectura Hexagonal de la Fabrica de Software CUN

## Propósito

Usa esta skill cuando se deba crear, revisar, documentar o estandarizar un backend en **NestJS** bajo el patrón de **Arquitectura Hexagonal** o **Ports & Adapters**.

El objetivo es mantener el dominio independiente de frameworks, separar los casos de uso de los detalles técnicos y organizar la infraestructura como una capa adaptadora.

## Principio rector

Toda decisión técnica debe preservar esta regla:

```text
Infrastructure → Application → Domain
```

Las dependencias siempre apuntan hacia el centro. El dominio nunca debe depender de aplicación ni de infraestructura.

## Cómo usar esta skill

Antes de crear o modificar un proyecto backend, consulta las referencias según la funcionalidad requerida:

1. [Arquitectura y estructura base](reference/01-arquitectura-estructura.md)
2. [Capa Domain](reference/02-domain.md)
3. [Capa Application](reference/03-application.md)
4. [Capa Infrastructure](reference/04-infrastructure.md)
5. [Settings, configuración y bases de datos](reference/05-settings-bases-datos.md)
6. [Common, adaptadores y recursos compartidos](reference/06-common-adaptadores.md)
7. [Flujo de petición y mapeo entre capas](reference/07-flujo-peticion-mappers.md)
8. [Convenciones de nombrado](reference/08-convenciones-nombrado.md)
9. [Swagger y documentación API](reference/09-swagger-documentacion.md)
10. [Reglas de imports y dependencias](reference/10-imports-dependencias.md)
11. [Checklist de creación de módulos](reference/11-checklist-modulos.md)
12. [Anti-patrones y buenas prácticas](reference/12-antipatrones-buenas-practicas.md)

## Reglas obligatorias de alto nivel

- Separar siempre el proyecto en `domain`, `application` e `infrastructure`.
- Mantener `domain` libre de frameworks, ORM, validadores, Swagger y dependencias externas.
- Implementar los casos de uso en `application`.
- Implementar controladores, persistencia, adaptadores, validaciones y configuración en `infrastructure`.
- Usar interfaces para desacoplar repositorios y servicios externos.
- Mapear siempre entre capas mediante mappers.
- Validar datos en la frontera de entrada, no dentro del dominio.
- Documentar la API desde infraestructura usando Swagger.
- Centralizar configuración, bases de datos y logger en `infrastructure/settings`.
- Centralizar guards, interceptors, decoradores, utilidades y adaptadores comunes en `infrastructure/common`.

## Estructura mínima esperada

```text
src/
├── app.module.ts
├── main.ts
├── domain/
├── application/
└── infrastructure/
    ├── infrastructure.module.ts
    ├── settings/
    └── common/
```

## Criterio de aceptación

Una implementación cumple la skill si:

- El dominio contiene solo negocio puro.
- La aplicación orquesta casos de uso sin conocer tecnología concreta.
- La infraestructura adapta HTTP, bases de datos, servicios externos y configuración.
- No existen dependencias invertidas.
- Los controladores no contienen lógica de negocio.
- Los repositorios concretos implementan contratos definidos hacia el centro.
- Los DTOs de infraestructura validan y documentan la entrada.
- Los mappers separan los modelos de cada capa.
