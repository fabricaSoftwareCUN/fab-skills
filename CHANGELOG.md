# Changelog

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
