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
| [backend-nest-hexagonal-cun](./backend-nest-hexagonal-cun/) | Skill base para construir proyectos backend en NestJS aplicando Arquitectura Hexagonal, separacion por capas, reglas de dependencia, configuracion global, persistencia, documentacion Swagger y convenciones de estructura. **NestJS 11+ y CLI de Nest obligatorios.** |
| [front-angular-fab](./front-angular-fab/) | Skill principal del ecosistema Front Angular CUN. Arquitectura FAB, componentes standalone v22+, signals, interceptores HTTP, testing Jest, migracion Jasmine-a-Jest, mocking avanzado con Faker, y convenciones de codigo. **Angular 22+ y Angular CLI obligatorios (MCP `angular-cli` + `ng`).** |
| [google-adk-cun](./google-adk-cun/) | Guia sobre Google Agent Development Kit (ADK). Creacion de agentes, herramientas, modelos, callbacks, streaming, graphs, despliegue y arquitectura. **`agents-cli` y la suite `google-agents-cli-*` obligatorios.** |
| [memoria](./memoria/) | Protocolo para gestion de memoria en interacciones con el usuario. |
| [proyectos-tareas-cun](./proyectos-tareas-cun/) | Administracion de workspaces en Plane (proyectos.cunapp.pro). Gestion de proyectos, work items, ciclos, modulos, paginas, epics y mas. Requiere `PLANE_API_KEY` y `PLANE_WORKSPACE_SLUG`. |
| [spec-driven-dev](./spec-driven-dev/) | Guia de Spec-Driven Development (SDD) basada en GitHub Spec Kit. Flujo de 3 fases: Especificar, Planificar, Tareas. **Obligatorio** si la tarea modifica codigo existente, afecta a mas de un archivo, altera contratos o APIs, o introduce logica nueva; exige PRD, historia de usuario o especificacion antes de desarrollar. |
| [ux-design](./ux-design/) | Principios de UX/UI y psicologia cognitiva aplicada al diseno. Leyes de UX, design tokens, accesibilidad WCAG 2.2, flujo de evaluacion y plantilla de design system. Principio fundamental de la Fabrica de Software CUN. |

## Skills externas obligatorias

Las cuatro skills CUN de `google-adk-cun`, `front-angular-fab`, `backend-nest-hexagonal-cun` y `spec-driven-dev` exigen, para aplicarse, que tambien esten instaladas las skills externas oficiales de sus respectivos proveedores. Esta seccion documenta cuales instalar y los comandos exactos.

Para inspeccionar el catalogo de un repositorio antes de instalar:

```bash
npx skills add <owner>/<repo> --list
```

### Google ADK — `google/agents-cli`

Obligatorio para cualquier trabajo con ADK. Las propias skills exigen, ademas de estar instaladas, el binario `agents-cli`.

```bash
npx skills add google/agents-cli
uv tool install google-agents-cli
agents-cli setup
```

Las 7 skills de la suite (`google-agents-cli-workflow`, `-scaffold`, `-adk-code`, `-eval`, `-deploy`, `-publish`, `-observability`) **no se distribuyen desde fab-skills**: la suite no se trae con `npx skills add fabricaSoftwareCUN/fab-skills`.

### Figma — subconjunto de consumo de diseños

`figma/mcp-server-guide` distribuye 12 skills. Para leer disenos y consumir la API de Figma, este es el nucleo obligatorio:

```bash
npx skills add figma/mcp-server-guide --skill figma-design-to-code
npx skills add figma/mcp-server-guide --skill figma-use
npx skills add figma/mcp-server-guide --skill figma-code-connect
```

- `figma-design-to-code` se autodeclara prerrequisito obligatorio antes de `get_design_context`. No esta instalado por defecto; sin el, la lectura de disenos produce codigo de referencia que la skill no contextualiza.
- `figma-use` es prerrequisito de cualquier `use_figma` que requiera JavaScript en el contexto del archivo.
- `figma-code-connect` mapea componentes Figma a snippets del codebase y alimenta los hints de `get_design_context`.

Las 9 restantes del repositorio son de escritura hacia Figma (`figma-generate-design`, `figma-generate-library`, `figma-generate-diagram`, `figma-create-new-file`, `figma-use-figjam`, `figma-use-slides`, `figma-use-motion`), de motion (`figma-implement-motion`) o especificas de iOS (`figma-swiftui`).

### Angular — `angular-developer`

```bash
npx skills add angular/skills --skill angular-developer
```

`angular-new-app` **no se declara obligatoria**: su comando normativo prescribe `--ai-config=agents`, valor inexistente en Angular CLI v22, y omite `--file-name-style-guide=2016`, sin el cual `ng generate` produce archivos que incumplen las convenciones FAB. La creacion de proyectos la gobierna la propia skill `front-angular-fab`.

**Precedencia**: `front-angular-fab` manda sobre `angular-developer` en arquitectura, nombrado, version minima y flags de `ng new` / `ng generate`. `angular-developer` aporta guia oficial del framework.

### Playwright — no instalar; usa el MCP y `qa-and-testing`

`microsoft/playwright` distribuye 4 skills (`playwright-dev`, `playwright-devops`, `playwright-test-results`, `playwright-triage`), pero todas son **internas de su propio monorepo**: `playwright-dev` cubre como contribuir al codigo de Playwright; `playwright-test-results` consulta el DuckDB del CI de Microsoft Playwright con `repository = "microsoft/playwright"` fijo en el codigo.

No existe skill oficial para usar Playwright en proyectos ajenos. La automatizacion de navegador se cubre con el **servidor MCP `playwright`** (`browser_navigate`, `browser_click`, `browser_snapshot`, etc.). La ejecucion de pruebas queda fuera de esa skill: la skill `qa-and-testing` del ecosistema CUN cubre ese flujo.

No ejecutes `npx skills add microsoft/playwright --skill playwright-dev`.

## Estructura

Cada skill es una carpeta con un archivo `SKILL.md` que contiene metadatos (frontmatter YAML) e instrucciones para el agente. Opcionalmente incluye subcarpetas como `reference/`, `scripts/`, `examples/`.

Ademas del catalogo, la raiz del repositorio contiene:

```text
fab-skills/
  AGENTS.md            # Reglas de trabajo sobre este repositorio
  AGENTS_EJEMPLO.md    # Plantilla adoptable por proyectos CUN
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
      buenas-practicas.md
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
