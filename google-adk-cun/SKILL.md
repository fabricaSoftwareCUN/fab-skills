---
name: google-adk-cun
description: Guia sobre el Google Agent Development Kit (ADK). Usa esta skill cuando el usuario pregunte sobre creacion de agentes, uso de herramientas, streaming, callbacks, tutoriales, despliegue o arquitectura con Google ADK. Todo trabajo sobre un agente ADK se ejecuta obligatoriamente con el CLI agents-cli (google-agents-cli) y su suite de skills.
license: MIT
---

# Skill de Google ADK

Esta skill referencia los recursos oficiales del Google Agent Development Kit (ADK). Relaciona los temas de la documentacion con enlaces a los recursos y archivos de referencia locales.

## Como usarla

Identifica la tarea o interes del usuario y consulta la seccion tematica correspondiente. Cada seccion incluye enlaces a la documentacion oficial y, cuando aplica, a archivos de referencia locales.

## Instrucciones

- Consulta la seccion tematica relevante para obtener las URLs de documentacion y codigo de ejemplo.
- Usa la URL de `adk.dev/llms-full.txt` para obtener la documentacion completa en texto plano cuando necesites contexto profundo.
- Lee los archivos de referencia locales (`reference/`) cuando el usuario trabaje con proyectos ADK de la CUN.
- Prioriza proporcionar codigo de ejemplo en Python al explicar un concepto.
- Si el usuario pregunta sobre la plantilla base de agente ADK para mesa de ayuda, carga `reference/agente-base.md`.
- Consulta `reference/buenas-practicas.md` antes de implementar, modificar o revisar agentes ADK.
- Consulta `reference/politica-despliegue.md` antes de solicitar o ejecutar cualquier despliegue del agente.
- Precedencia: esta skill aporta el **contexto CUN** (plantilla base, buenas practicas locales); el **procedimiento** lo dicta la suite `google-agents-cli-*`. Ante conflicto, manda la suite.
- Los comandos `adk web` y `adk api_server` que aparecen en `reference/agente-base.md` son runtime local dentro del contenedor. No sustituyen a `agents-cli` en el ciclo de vida del agente.

## Uso obligatorio de agents-cli

Todo trabajo sobre un agente ADK se ejecuta con `agents-cli`. Crear la estructura del proyecto a mano, sustituir la evaluacion por una prueba suelta o desplegar sin aprobacion humana estan prohibidos.

### Prerrequisito (primera accion)

```bash
agents-cli info          # confirma CLI y proyecto
uv tool install google-agents-cli   # si el CLI no esta instalado
uvx google-agents-cli setup         # instala la suite de skills
```

La suite `google-agents-cli-*` **no se distribuye desde fab-skills**: `npx skills add fabricaSoftwareCUN/fab-skills --skill google-adk-cun` no la trae. Si falta, se instala; no se omite el flujo.

### Fase, skill y comando

| Fase | Skill a cargar ANTES | Comando |
|---|---|---|
| Diseno | — | escribir `.agents-cli-spec.md` |
| Recetas | `google-agents-cli-adk-code` | consultar el indice de `references/samples.md` |
| Scaffold | `google-agents-cli-scaffold` | `agents-cli scaffold create <nombre>` o `agents-cli scaffold enhance .` |
| Build | `google-agents-cli-adk-code` | `agents-cli run "prompt"`, `agents-cli playground` |
| Evaluacion | `google-agents-cli-eval` | `agents-cli eval run` (o `eval generate` + `eval grade`) |
| Despliegue | `google-agents-cli-deploy` | `agents-cli deploy` |
| Publicacion | `google-agents-cli-publish` | `agents-cli publish gemini-enterprise` |
| Observabilidad | `google-agents-cli-observability` | — |

La skill se carga ANTES de empezar la fase, no cuando el problema ya aparecio.

### Reglas duras

1. **No cambiar el modelo si nadie lo pidio.** El modelo del scaffold se eligio deliberadamente.
2. **Cirugia.** Se toca solo lo que la peticion nombra, preservando configuracion (`model`, `version`, claves), comentarios y formato del entorno.
3. **Nunca escribir pruebas unitarias que afirmen el contenido de una respuesta del LLM.** La salida es no determinista: el comportamiento se valida con `agents-cli eval` y un caso de evalset, y ese caso es la guarda que cierra el protocolo de depuracion.
4. **Un repositorio por tecnologia. Monorepo prohibido.** El agente vive en `<proyecto>-adk`: `agents-cli scaffold create` se ejecuta en su propio repositorio, nunca dentro del repositorio de front (`<proyecto>-front`) ni del de back (`<proyecto>-back`). Proyecto nuevo planteado como monorepo: bloqueado. Proyecto existente que ya es monorepo: no bloquea el trabajo, pero se declara no conformidad y se registra la deuda de separacion en TASKS.md.

### Prohibiciones

- Crear la estructura del proyecto a mano en lugar de usar `scaffold`: se pierden el boilerplate de eval, la configuracion de CI/CD y las convenciones del manifiesto.
- Sustituir la fase de evaluacion por un unico `agents-cli run`: una sola respuesta correcta no es una suite de pruebas.
- Desplegar sin aprobacion humana explicita.

## Reglas de despliegue

Resumen de las reglas duras de despliegue de la Fabrica de Software CUN. Para el detalle completo consulta `reference/politica-despliegue.md`.

- **R1 - Ventana de PRO:** unicamente en **lunes habil**; si el lunes no es habil, el siguiente dia habil. Martes a viernes, fines de semana y festivos requieren excepcion autorizada por el Vicerrector de Servicios Digitales.
- **R2 - Autorizaciones:** QA y STG se solicitan al Tech Lead. PRO lunes habil requiere aprobacion del QA en el hilo de correo y checklist aprobado por el Tech Lead, o solicitud directa del Coordinador de la Fabrica por el canal debido. PRO martes a viernes: Vicerrector de Servicios Digitales. PRO sabado, domingo o festivo: autorizacion correspondiente (§28), bajo la autorizacion general del Vicerrector (§11). Hotfix critico lo autoriza el Coordinador de la Fabrica.
- **R4 - Ramas:** `develop`, `qa`, `stg`, `main`. Promocion progresiva y unidireccional por PR.
- **R5 - Ramas efimeras:** `<tipo>/<ID_HU>-<slug-kebab>`. Tipos: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`.
- **R6 - Origen y destino:** ramas efimeras salen de `develop` y vuelven a `develop` por PR; `hotfix` sale de `main` y vuelve a `main` y `develop`.
- **R7 - Requisitos de PR:** al menos un revisor del equipo; Tech Lead obligatorio en cambios de arquitectura y en todo PR hacia `stg` y `main`; CI en verde.
- **R8 - Versionamiento:** SemVer `X.Y.Z` con sufijos por rama (`-alpha`, `-beta`, `-rc.N`). Tag `vX.Y.Z` en `main` creado automaticamente por CI. `CHANGELOG.md` en formato Keep a Changelog.
- **R10 - `.gitignore`:** no versionar `docker-compose.yml`, `docker-compose.*.yml`, `compose.yml`, `compose.*.yml`, `*.sh`, `.env`, `.env.*`.
- **R11 - Variables de entorno:** `SNAKE_CASE`, adjuntas como `.txt` con bloques `ENVS NUEVAS / ENVS MODIFICADAS / ENVS ELIMINADAS`. Nunca en el repositorio.
- **R12 - Observabilidad:** si el agente sirve HTTP custom, exponer `GET /metrics` en formato Prometheus; si no, usar `google-agents-cli-observability`.
- **Eval suite:** `agents-cli eval run` debe estar en verde antes de solicitar QA/STG/PRO.
- **Despliegue (R24):** la solicitud va por correo (PROC-DEP); lo ejecuta DevOps o el Tech Lead con `agents-cli deploy` (Cloud Run o Agent Engine segun el proyecto defina) o con el job de despliegue de `main.yml` protegido por aprobacion manual, siempre con aprobacion humana explicita. El equipo de desarrollo solo usa `agents-cli deploy` contra su entorno de desarrollo, nunca contra QA, STG ni PRO.

## Versiones del stack

| Componente | Version estable | Piso exigido |
|---|---|---|
| `google-adk` (Python) | 2.15.1 (verificada 2026-11-25) | 2.x |
| `google-agents-cli` | 1.16.0 | 1.16 |

Regla transversal: verificar la version exacta mas reciente con `pip index versions google-adk` o `pip index versions google-agents-cli` antes de instalar; fijar la version exacta en el manifiesto y lockfile.

## Regla de consulta obligatoria

Antes de codificar cualquier componente ADK, sigue este flujo:

0. Cargar la skill `google-agents-cli-workflow` y ejecutar `agents-cli info`. Sin este paso no se escribe codigo ADK.
1. Listar las fuentes de documentacion disponibles (secciones tematicas de esta skill).
2. Cargar `llms.txt` o `llms-full.txt` de adk.dev segun la profundidad requerida.
3. Consultar las paginas puntuales del tema (agentes, tools, callbacks, memory, eval, deploy).
4. Implementar solo despues de validar en la documentacion oficial.

Esta regla aplica cuando exista incertidumbre sobre APIs, compatibilidad de versiones, comportamiento de callbacks o patrones de integracion.

Gate de especificacion: si la tarea introduce o modifica capacidad funcional del agente, exige antes PRD, historia de usuario o especificacion escrita, y aplica Spec-Driven Development conforme a la skill `spec-driven-dev`.

## Temas

### 1. Primeros pasos

Instalacion, guias rapidas y configuracion basica de agentes.

- **Documentacion**: https://adk.dev/get-started/index.md
- **Quickstart Python**: https://adk.dev/get-started/python/index.md
- **Vision general tecnica**: https://adk.dev/get-started/about/index.md

### 2. Agentes

Tipos de agentes: LLM, Workflow (Sequential, Parallel, Loop), Custom y Routed. Configuracion, routing y delegacion.

- **Referencia de agentes**: https://adk.dev/agents/index.md
- **Agentes LLM**: https://adk.dev/agents/llm-agents/index.md
- **Agentes Workflow**: https://adk.dev/agents/workflow-agents/index.md
  - Sequential: https://adk.dev/agents/workflow-agents/sequential-agents/index.md
  - Parallel: https://adk.dev/agents/workflow-agents/parallel-agents/index.md
  - Loop: https://adk.dev/agents/workflow-agents/loop-agents/index.md
- **Agentes Custom**: https://adk.dev/agents/custom-agents/index.md
- **Routing de agentes**: https://adk.dev/agents/routing/index.md
- **Configuracion**: https://adk.dev/agents/config/index.md

### 3. Modelos

Configuracion de modelos LLM: Gemini, LiteLLM y routing de modelos.

- **Referencia de modelos**: https://adk.dev/agents/models/index.md
- **Gemini**: https://adk.dev/agents/models/google-gemini/index.md
- **LiteLLM**: https://adk.dev/agents/models/litellm/index.md
- **Routing de modelos**: https://adk.dev/agents/models/routing/index.md

### 4. Herramientas

Herramientas integradas, MCP tools, herramientas personalizadas (FunctionTool, AgentTool) y herramientas de terceros.

- **Herramientas custom**: https://adk.dev/tools-custom/index.md
- **Herramientas MCP**: https://adk.dev/tools-custom/mcp-tools/index.md
- **Integraciones**: https://adk.dev/integrations/index.md

### 5. Callbacks

Hooks del ciclo de vida: before/after de agente, modelo y herramientas. Control de flujo, logging y modificacion de comportamiento.

- **Referencia**: https://adk.dev/callbacks/index.md

### 6. Runtime y arquitectura

Sessions, State, Memory, Context, Events y Artifacts. Manejo de estado entre agentes y persistencia.

- **Runtime (InvocationContext)**: https://adk.dev/runtime/index.md
- **Sessions y State**: https://adk.dev/sessions/state/index.md
- **Events**: https://adk.dev/events/index.md
- **Documentacion completa**: https://adk.dev/llms-full.txt

### 7. Streaming

Streaming bidireccional de audio y texto con Gemini Live API.

- **Referencia**: https://adk.dev/live/index.md
- **Quickstart Python**: https://adk.dev/live/get-started/index.md
- **Guia de desarrollo**: https://adk.dev/live/get-started/streaming-python/index.md

### 8. Graphs y Workflows

Workflows basados en grafos: rutas, datos, workflows dinamicos e input humano.

- **Grafos**: https://adk.dev/graphs/index.md
- **Rutas**: https://adk.dev/graphs/routes/index.md
- **Manejo de datos**: https://adk.dev/graphs/data-handling/index.md
- **Workflows dinamicos**: https://adk.dev/graphs/dynamic/index.md
- **Input humano**: https://adk.dev/graphs/human-input/index.md
- **Patrones de workflow**: https://adk.dev/workflows/patterns/index.md
- **Workflows colaborativos**: https://adk.dev/workflows/collaboration/index.md

### 9. Tutoriales y ejemplos

Tutoriales paso a paso, ejemplos base y muestras de agentes.

- **Tutoriales**: https://adk.dev/tutorials/index.md
- **Multi-tool agent**: https://adk.dev/tutorials/multi-tool-agent/index.md
- **Agent team**: https://adk.dev/tutorials/agent-team/index.md
- **Code with AI**: https://adk.dev/tutorials/coding-with-ai/index.md

### 10. Referencia de API

Detalles de la API REST del ADK.

- **Referencia**: https://adk.dev/api-reference/index.md

### 11. Informacion general

Indice general de documentacion para agentes LLM.

- **llms.txt**: https://adk.dev/llms.txt
- **llms-full.txt**: https://adk.dev/llms-full.txt

## Comandos rapidos

Comandos de `agents-cli` verificados contra el binario:

| Comando | Proposito |
|---|---|
| `info` | Configuracion del proyecto, rutas y version del CLI |
| `setup` | Instala el CLI y las skills en los agentes de codigo detectados |
| `create` | Crea un proyecto de agente desde plantilla |
| `scaffold` | Crea, mejora (`enhance`) o actualiza (`upgrade`) un proyecto |
| `install` | Instala las dependencias del proyecto |
| `lint` | Verificaciones de calidad de codigo |
| `run` | Ejecuta el agente con un solo prompt, no interactivo |
| `playground` | Playground local para conversar con el agente |
| `eval` | Evalua agentes y compara resultados |
| `infra` | Aprovisiona infraestructura del proyecto |
| `deploy` | Despliega el agente |
| `publish` | Publica el agente en el destino configurado |
| `login` | Autenticacion con Google Cloud o AI Studio |
| `update` | Reinstala las skills en los agentes detectados |

Ante el fallo de un comando: `agents-cli <comando> --help` termina con una linea `Source:` que apunta al archivo fuente exacto que lo implementa. Leerlo es mas rapido que adivinar.

## Referencia local

| Archivo | Descripcion |
|---------|-------------|
| [agente-base.md](./reference/agente-base.md) | Contexto operativo para la plantilla base de agente ADK (mesa de ayuda con Zoho Desk). Estructura, stack, variables de entorno, flujo de despliegue y convenciones. |
| [buenas-practicas.md](./reference/buenas-practicas.md) | Anti-patrones prohibidos, convenciones para subagentes y checklist de aceptacion para cualquier agente ADK. |
| [politica-despliegue.md](./reference/politica-despliegue.md) | Politica de despliegue de la Fabrica de Software CUN adaptada a agentes ADK. Flujo de ambientes, calendario PRO, hotfix, rollback, checklists, matriz de autorizaciones y proceso de solicitud. |
