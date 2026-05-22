# AGENTS.md

## Alcance del repositorio
- Este repo no es una app ejecutable: es un catalogo de skills para `npx skills`.
- Cada skill vive en una carpeta de primer nivel con `SKILL.md` y, opcionalmente, `reference/`.
- Solo `google-adk-cun/` se distribuye hoy; `_template/` es plantilla local y no contenido final.

## Flujo correcto para agregar o editar skills
- Para crear un skill nuevo, parte de la plantilla: `cp -r _template/ <nombre-skill>/`.
- El frontmatter de `<nombre-skill>/SKILL.md` debe incluir `name` y `description`.
- El valor `name` en frontmatter debe coincidir exactamente con el nombre de la carpeta del skill.
- Si agregas referencias locales, colocalas dentro de `reference/` del skill.

## Verificacion obligatoria antes de cerrar cambios
- Ejecuta `bash scripts/validate.sh` desde la raiz del repo.
- El validador recorre carpetas de primer nivel y omite: `_template`, `.git`, `scripts`, `node_modules`, `dist`, `build`.
- Si el script falla, corrige estructura/frontmatter antes de considerar la tarea terminada.

## Convenciones practicas del repo
- Mantener `README.md` alineado con skills disponibles y comandos de instalacion reales.
- Registrar cambios funcionales en `CHANGELOG.md` por version.
- No hay CI ni linters configurados en el repo: la fuente de verdad para calidad estructural es `scripts/validate.sh`.
