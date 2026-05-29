# fab-skills

Coleccion de skills para agentes de inteligencia artificial de los proyectos CUN. Desplegable con [`npx skills`](https://www.skills.sh).

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
| [backend-nest-hexagonal-cun](./backend-nest-hexagonal-cun/) | Skill base para construir proyectos backend en NestJS aplicando Arquitectura Hexagonal, separacion por capas, reglas de dependencia, configuracion global, persistencia, documentacion Swagger y convenciones de estructura. |
| [front-angular-fab](./front-angular-fab/) | Skill principal del ecosistema Front Angular CUN. Arquitectura FAB, componentes standalone v20+, signals, interceptores HTTP, testing Jest, migracion Jasmine-a-Jest, mocking avanzado con Faker, y convenciones de codigo. |
| [google-adk-cun](./google-adk-cun/) | Guia sobre Google Agent Development Kit (ADK). Creacion de agentes, herramientas, modelos, callbacks, streaming, graphs, despliegue y arquitectura. |
| [memoria](./memoria/) | Protocolo para gestion de memoria en interacciones con el usuario. |
| [proyectos-tareas-cun](./proyectos-tareas-cun/) | Administracion de workspaces en Plane (proyectos.cunapp.pro). Gestion de proyectos, work items, ciclos, modulos, paginas, epics y mas. Requiere `PLANE_API_KEY` y `PLANE_WORKSPACE_SLUG`. |
| [spec-driven-dev](./spec-driven-dev/) | Guia de Spec-Driven Development (SDD) basada en GitHub Spec Kit. Flujo de 3 fases: Especificar, Planificar, Tareas. Convierte ideas en specs ejecutables con trazabilidad completa. |
| [ux-design](./ux-design/) | Principios de UX/UI y psicologia cognitiva aplicada al diseno. Leyes de UX, design tokens, accesibilidad WCAG 2.2, flujo de evaluacion y plantilla de design system. Principio fundamental de la Fabrica de Software CUN. |

## Estructura

Cada skill es una carpeta con un archivo `SKILL.md` que contiene metadatos (frontmatter YAML) e instrucciones para el agente. Opcionalmente incluye subcarpetas como `reference/`, `scripts/`, `examples/`.

```text
fab-skills/
  _template/           # Plantilla base (no se distribuye)
  backend-nest-hexagonal-cun/ # Skill de NestJS Hexagonal
    SKILL.md
    reference/
      01-arquitectura-estructura.md
      02-domain.md
      ... (13 archivos de referencia)
  front-angular-fab/   # Skill de Front Angular
    SKILL.md
    reference/
      01-arquitectura-proyecto.md
      02-componentes.md
      ... (9 archivos de referencia)
  google-adk-cun/      # Skill de Google ADK
    SKILL.md
    reference/
      agente-base.md
  memoria/             # Skill de memoria
    SKILL.md
  proyectos-tareas-cun/ # Skill de Proyectos y Tareas CUN
    SKILL.md
    reference/
      endpoints.md
  spec-driven-dev/     # Skill de SDD
    SKILL.md
    reference/
      spec-driven-original.md
  ux-design/           # Skill de UX/UI Design
    SKILL.md
    reference/
      leyes-ux.md
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
