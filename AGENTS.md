# AGENTS.md

## Alcance del repositorio
- Este repo no es una app ejecutable: es un catalogo de skills para `npx skills`.
- Cada skill vive en una carpeta de primer nivel con `SKILL.md` y, opcionalmente, `reference/`.
- Skills distribuidas: `backend-nest-hexagonal-cun`, `front-angular-fab`, `google-adk-cun`, `memoria`, `proyectos-tareas-cun`, `qa-and-testing`, `spec-driven-dev`, `ux-design`.
- `_template/` es plantilla local y no contenido final.
- `specs/` contiene especificaciones de cambios y no es un skill.

## Flujo correcto para agregar o editar skills
- Para crear un skill nuevo, parte de la plantilla: `cp -r _template/ <nombre-skill>/`.
- El frontmatter de `<nombre-skill>/SKILL.md` debe incluir `name`, `description` y `license`.
- El valor `name` en frontmatter debe coincidir exactamente con el nombre de la carpeta del skill.
- Si agregas referencias locales, colocalas dentro de `reference/` del skill (singular, no plural).

## Verificacion manual antes de cerrar cambios
- `name` en frontmatter coincide con el nombre de la carpeta del skill.
- `description` no supera 1024 caracteres y no esta vacia.
- `license: MIT` presente en el frontmatter.
- Valores de `metadata` son cadenas escalares (no listas ni objetos anidados).
- `SKILL.md` no supera 500 lineas.
- Finales de linea LF: `.gitattributes` fuerza `eol=lf` en todos los archivos de texto.

## Convenciones practicas del repo
- Mantener `README.md` alineado con skills disponibles y comandos de instalacion reales.
- Registrar cambios funcionales en `CHANGELOG.md` por version.
- Carpeta de referencias siempre en singular: `reference/`, nunca `references/`.
- Frontmatter minimo: `name`, `description`, `license: MIT`.
- Fecha de alineacion normativa: 2026-11-25. Las skills llevan copia integra de la normativa Outline con fecha de alineacion; si Outline cambia, actualizar las copias en las skills y en `AGENTS_EJEMPLO.md`.
- No hay CI ni linters configurados en el repo: la verificacion de estructura es manual.
