---
name: front-angular-fab
description: Skill principal del ecosistema Front Angular Fabrica de Software CUN. Define conceptos, reglas globales e instrucciones de orquestacion para arquitectura, componentes y testing en proyectos Angular.
---

# Front Angular Fabrica de Software CUN

## Proposito

Establecer el marco unico de trabajo para proyectos Front Angular Fabrica de Software CUN.

## Alcance

- Estandares globales de arquitectura, componentes y calidad.
- Criterios para seleccionar skills especializadas.
- Politica de consulta de referencias por funcionalidad.

## Principios obligatorios

- Todo artefacto debe mantener separacion de responsabilidades.
- El tipado debe ser estricto y sin uso de `any`.
- La UI debe permanecer desacoplada de llamadas HTTP directas.
- El estado reactivo debe ser predecible, testeable y mantenible.
- Las pruebas unitarias deben cubrir casos exitosos y de error.

## Flujo de trabajo

1. Identificar la funcionalidad objetivo.
2. Consultar la carpeta de referencias correspondiente.
3. Aplicar reglas globales de esta skill antes de implementar.
4. Validar consistencia tecnica contra criterios minimos de calidad.

## Politica de referencias

- Consultar referencias por funcionalidad, no por conveniencia.
- Priorizar reglas de mayor criticidad tecnica antes de codificar.
- Si hay conflicto entre referencias, prevalece esta skill principal.

## Criterios minimos de calidad

- Coherencia arquitectonica con Fabrica de Software CUN.
- Consistencia de convenciones de nombres e imports.
- Cobertura y determinismo en pruebas unitarias.
- Ausencia de APIs deprecadas en Angular y testing.

## Referencias por funcionalidad

- `references/arquitectura/`
- `references/componentes/`
- `references/formularios/`
- `references/http/`
- `references/testing-jest/`
- `references/mocking/`
- `references/migracion/`
- `references/errores-reactivos/`
