# Changelog

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
