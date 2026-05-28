# Arquitectura Fabrica de Software CUN

## Objetivo

Definir la arquitectura base para proyectos Angular Fabrica de Software CUN con enfoque en mantenibilidad, escalabilidad y testabilidad.

## Instrucciones

- Separar responsabilidades entre `core`, `shared` y funcionalidades de negocio.
- Aplicar carga diferida y organizacion por dominio.
- Centralizar reglas transversales en interceptores, guards y servicios comunes.
- Mantener estado reactivo tipado y sin acoplamiento a la capa visual.

## Reglas

- No usar `any` en dominio ni infraestructura.
- Mantener convenciones de nombres e imports consistentes.
- Evitar APIs deprecadas para HTTP y testing.
