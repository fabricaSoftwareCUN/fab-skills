# Changelog

## [0.12.0] - 2026-05-29

### Agregado
- Skill `backend-nest-hexagonal-cun`: nueva referencia `reference/13-politica-despliegue.md`.
  - Politica de despliegue CUN adaptada a backend: Dockerfile con imagen AWS, Oracle instant-client/cundb01, SonarQube, CI/CD, sanitizacion de variables de entorno, proceso de solicitud por correo, horarios, checklist pre-despliegue.
  - SKILL.md: nueva seccion "Reglas de despliegue", criterios de aceptacion ampliados con requisitos de despliegue.
- Skill `front-angular-fab`: nueva referencia `reference/09-politica-despliegue.md`.
  - Politica de despliegue CUN adaptada a frontend Angular: Dockerfile, SonarQube, CI/CD, variables via environments + contenedor, proceso de solicitud, horarios, checklist pre-despliegue.
  - SKILL.md: nueva seccion "Reglas de despliegue", criterios de calidad ampliados, tabla de referencia actualizada.
- README.md: conteos de archivos de referencia actualizados (backend 13, frontend 9).

### Fuente
- Documento Outline: [Politica de despliegue para aplicaciones](https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw).

## [0.11.0] - 2026-05-28

### Modificado
- Skill `front-angular-fab`: reescritura completa de SKILL.md y referencias.
  - SKILL.md: de 56 lineas (1.9 KB) a 159 lineas (5.5 KB). Consolidacion de 3 skills fuente (angular-architect-fab, angular-component-fab, angular-jest-testing).
  - Eliminadas 8 refs stubs en `references/` (subcarpetas con archivos de 8 lineas).
  - Creadas 8 refs sustanciales en `reference/` (singular): 3327 lineas, 84 KB total.
    - `01-arquitectura-proyecto.md`: arquitectura FAB, estructura carpetas, 8 patrones, servicios, guards, checklist.
    - `02-componentes.md`: standalone v20+, signal inputs/outputs, proyeccion contenido, hooks, control flow.
    - `03-patrones-componentes.md`: model inputs, view/content queries, comunicacion, @defer, directivas, error boundaries.
    - `04-testing-jest.md`: framework Jest, flujo generacion tests, cobertura 85%, HTTP, httpResource, effects.
    - `05-migracion-jest.md`: guia Jasmine+Karma a Jest, dependencias, configuracion, patrones, ejemplo completo.
    - `06-mocking-avanzado.md`: factory functions, Faker determinista, overrides, anti-patrones.
    - `07-http-testing.md`: HttpClient moderno, httpResource, effects con errores, casos negativos.
    - `08-convenciones-codigo.md`: TypeScript strict, archivos, imports, formularios, validacion templates.
- Skill `backend-nest-hexagonal-cun`: carpeta de refs renombrada de `references/` a `reference/` (alineado con convencion). 12 rutas actualizadas en SKILL.md.
- AGENTS.md: reescrito. Lista completa de 7 skills distribuidas. Frontmatter minimo incluye `license`. Regla explicita: `reference/` singular.
- README.md: tabla de skills y arbol de estructura actualizados.
- `_template/SKILL.md`: agregado `license: MIT` al frontmatter de ejemplo.

### Corregido
- Inconsistencia `references/` vs `reference/`: normalizado a singular en todas las skills.
- AGENTS.md: decia "solo google-adk-cun se distribuye" cuando hay 7 skills activas.
- Frontmatter: agregado `license: MIT` a `backend-nest-hexagonal-cun` y `google-adk-cun`.
- LICENSE: copyright actualizado a `2025-2026`.


## [0.10.0] - 2026-05-28

### Agregado
- Skill `backend-nest-hexagonal-cun`: skill base para construir proyectos backend en NestJS con Arquitectura Hexagonal.
  - SKILL.md con proposito, principio rector, reglas obligatorias, estructura minima y criterios de aceptacion.
  - 12 archivos de referencia en `references/`: arquitectura, domain, application, infrastructure, settings, common, flujo de peticion, convenciones de nombrado, Swagger, imports, checklist de modulos y anti-patrones.
- Skill `front-angular-fab`: marco de trabajo para proyectos Front Angular Fabrica de Software CUN.
  - SKILL.md con principios, flujo de trabajo, politica de referencias y criterios de calidad.
  - 8 archivos de referencia en `references/`: arquitectura, componentes, formularios, HTTP, testing-jest, mocking, migracion y errores-reactivos.
- README.md: actualizado con skills nuevos en tabla y arbol de estructura.

### Eliminado
- Skill `front-angular`: eliminada carpeta y sub-skills (angular-architect-fab, angular-component-fab, angular-jest-testing). Reemplazada por `front-angular-fab`.

## [0.9.0] - 2026-05-22

### Cambiado
- Skill `plane-cun-api` renombrada a `proyectos-tareas-cun`. Carpeta, frontmatter y documentacion actualizados.

## [0.8.2] - 2026-05-22

### Corregido
- Skill `plane-cun-api`: corregidos errores de conexion reportados.
  - Advertencia explicita: instancia self-hosted, no usar api.plane.so.
  - Advertencia: no existen endpoints de work-items a nivel workspace (requieren project_id).
  - Agregada seccion de verificacion de conexion con `GET /users/me/`.
  - Agregado flujo operativo recomendado para consultar tareas del usuario.
  - Endpoint `/users/me/` agregado a reference/endpoints.md.

## [0.8.1] - 2026-05-22

### Cambiado
- Skill `spec-driven-dev`: traducido `reference/spec-driven-original.md` de ingles a espanol para mantener consistencia de idioma en todo el repositorio.

## [0.8.0] - 2026-05-22

### Agregado
- Skill `ux-design`: principios de UX/UI y psicologia cognitiva aplicada al diseno de interfaces.
  - Principio fundamental de la Fabrica de Software CUN.
  - 10 leyes de UX fundamentales organizadas por categoria (toma de decisiones, percepcion, memoria, comportamiento).
  - Principios de UI: jerarquia visual, Gestalt, grids, consistencia, responsive/mobile-first.
  - Sistema de diseno: arquitectura de design tokens en 3 niveles (W3C), color, tipografia, espaciado, animacion.
  - Accesibilidad: WCAG 2.2 AA como nivel minimo obligatorio.
  - Flujo de trabajo de 4 pasos: Auditar, Diagnosticar, Proponer, Verificar.
  - Gates de calidad: visual, interaccion, consistencia.
  - Plantilla `design.md` para crear design systems desde cero.
  - reference/leyes-ux.md: catalogo expandido de 20+ leyes con ejemplos practicos y CSS.

## [0.7.0] - 2026-05-22

### Agregado
- Skill `spec-driven-dev`: guia de Spec-Driven Development basada en GitHub Spec Kit.
  - Flujo de 3 fases: Especificar, Planificar, Tareas.
  - Integracion documentada con artefactos nativos del agente (implementation_plan.md, task.md).
  - Tabla de formatos de contratos por tipo de proyecto (OpenAPI, TS, SQL, gRPC, etc.).
  - Plantillas mejoradas con criterios de terminado y dependencias.
  - Secciones "Cuando NO usar" y gates de calidad.
  - reference/spec-driven-original.md con documento fuente de GitHub Spec Kit.

## [0.6.0] - 2026-05-22

### Modificado
- Skill `google-adk-cun`: mejoras operativas en SKILL.md.
  - Nueva seccion "Regla de consulta obligatoria" con flujo de validacion en docs antes de codificar.
  - Instruccion de consultar buenas-practicas.md antes de implementar agentes.

### Agregado
- `google-adk-cun/reference/buenas-practicas.md`: anti-patrones, convenciones para subagentes, contrato de estado, reglas de calidad, checklist de aceptacion y plantilla de implementacion.

## [0.5.0] - 2026-05-22

### Agregado
- Skill `plane-cun-api`: administracion del workspace "vsd" en Plane (proyectos.cunapp.pro).
  - SKILL.md con configuracion, prerequisitos de API key, reglas, autenticacion, paginacion, rate limiting y ejemplos.
  - reference/endpoints.md con endpoints organizados alfabeticamente por recurso (13 secciones).

## [0.4.0] - 2026-05-22

### Agregado
- Skill `memoria`: protocolo para gestion de memoria en interacciones con el usuario.
  - Identificacion de usuario, recuperacion de memoria, categorizacion de informacion y actualizacion del grafo de conocimiento.

## [0.3.0] - 2026-05-22

### Agregado
- Plantilla base `_template/` con estructura minima de skill (SKILL.md + reference/).
- Script `scripts/validate.sh` para validacion de estructura de skills.
  - Verifica existencia de SKILL.md, frontmatter YAML, campos obligatorios y coincidencia de nombre.
- README.md: secciones "Crear un skill nuevo", "Validacion" y estructura actualizada.

## [0.2.0] - 2026-05-21

### Modificado
- Skill `google-adk-cun`: reescritura completa de SKILL.md
  - Corregida numeracion de secciones (faltaba seccion 4).
  - Completadas secciones vacias: Runtime/arquitectura y Despliegue.
  - Agregadas secciones: Modelos, Streaming, Graphs/Workflows.
  - Expandidas URLs de documentacion oficial verificadas contra adk.dev/llms-full.txt.
  - Vinculado archivo de referencia local agente-base.md con tabla de referencia.
  - Mejoradas instrucciones para el agente.
- Referencia `agente-base.md`: eliminado texto residual al final.
- README.md: actualizada org a fabricaSoftwareCUN.

## [0.1.0] - 2026-05-21

### Agregado
- Skill `google-adk-cun`: guia de referencia para Google Agent Development Kit.
  - SKILL.md con indice tematico y enlaces a documentacion oficial.
  - Referencia `agente-base.md` con contexto operativo para proyectos ADK.
