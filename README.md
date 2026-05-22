# fab-skills

Coleccion de skills para agentes de inteligencia artificial. Desplegable con [`npx skills`](https://www.skills.sh).

[![skills.sh](https://skills.sh/b/fab-cun/fab-skills)](https://skills.sh/fab-cun/fab-skills)

## Instalacion

```bash
npx skills add fab-cun/fab-skills
```

### Instalar un skill especifico

```bash
npx skills add fab-cun/fab-skills --skill google-adk-cun
```

### Instalar para un agente especifico

```bash
npx skills add fab-cun/fab-skills --agent claude-code
npx skills add fab-cun/fab-skills --agent cursor
npx skills add fab-cun/fab-skills --agent antigravity
```

## Skills disponibles

| Skill | Descripcion |
|-------|-------------|
| [google-adk-cun](./google-adk-cun/) | Guia sobre Google Agent Development Kit (ADK). Creacion de agentes, herramientas, callbacks, despliegue y arquitectura. |

## Estructura

Cada skill es una carpeta con un archivo `SKILL.md` que contiene metadatos (frontmatter YAML) e instrucciones para el agente. Opcionalmente incluye subcarpetas como `reference/`, `scripts/`, `examples/`.

```text
fab-skills/
  google-adk-cun/
    SKILL.md
    reference/
      agente-base.md
```

## Contribuir

1. Crear una carpeta con el nombre del skill.
2. Agregar un `SKILL.md` con frontmatter `name` y `description`.
3. Incluir archivos de referencia en `reference/`.
4. Abrir un PR.

## Licencia

MIT
