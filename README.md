# fab-skills

Coleccion de skills para agentes de inteligencia artificial. Desplegable con [`npx skills`](https://www.skills.sh).

[![skills.sh](https://skills.sh/b/fabricaSoftwareCUN/fab-skills)](https://skills.sh/fabricaSoftwareCUN/fab-skills)

## Instalacion

```bash
npx skills add fabricaSoftwareCUN/fab-skills
```

### Instalar un skill especifico

```bash
npx skills add fabricaSoftwareCUN/fab-skills --skill google-adk-cun
```

### Instalar para un agente especifico

```bash
npx skills add fabricaSoftwareCUN/fab-skills --agent claude-code
npx skills add fabricaSoftwareCUN/fab-skills --agent cursor
npx skills add fabricaSoftwareCUN/fab-skills --agent antigravity
```

## Skills disponibles

| Skill | Descripcion |
|-------|-------------|
| [google-adk-cun](./google-adk-cun/) | Guia sobre Google Agent Development Kit (ADK). Creacion de agentes, herramientas, modelos, callbacks, streaming, graphs, despliegue y arquitectura. |

## Estructura

Cada skill es una carpeta con un archivo `SKILL.md` que contiene metadatos (frontmatter YAML) e instrucciones para el agente. Opcionalmente incluye subcarpetas como `reference/`, `scripts/`, `examples/`.

```text
fab-skills/
  _template/           # Plantilla base (no se distribuye)
  google-adk-cun/      # Skill de ejemplo
    SKILL.md
    reference/
      agente-base.md
  scripts/
    validate.sh        # Validacion de estructura
```

### Estructura minima de un skill

El archivo `SKILL.md` debe contener:

1. **Frontmatter YAML** con campos obligatorios `name` y `description`.
2. Al menos una seccion de contenido con instrucciones para el agente.
3. El campo `name` debe coincidir con el nombre de la carpeta.

## Crear un skill nuevo

```bash
cp -r _template/ mi-nuevo-skill/
```

Editar `mi-nuevo-skill/SKILL.md`: reemplazar `name`, `description` y el contenido placeholder.

## Validacion

Verifica que todos los skills cumplan la estructura requerida:

```bash
bash scripts/validate.sh
```

## Contribuir

1. Copiar `_template/` con el nombre del skill.
2. Editar `SKILL.md` con frontmatter `name` y `description`.
3. Incluir archivos de referencia en `reference/`.
4. Ejecutar `bash scripts/validate.sh` para verificar.
5. Abrir un PR.

## Licencia

MIT
