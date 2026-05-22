---
name: google-adk-cun
description: Guia sobre el Google Agent Development Kit (ADK). Usa esta skill cuando el usuario pregunte sobre creacion de agentes, uso de herramientas, streaming, callbacks, tutoriales, despliegue o arquitectura con Google ADK.
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

## Temas

### 1. Primeros pasos

Instalacion, guias rapidas y configuracion basica de agentes.

- **Documentacion**: https://adk.dev/get-started/index.md
- **Quickstart Python**: https://adk.dev/get-started/python/index.md
- **Quickstart TypeScript**: https://adk.dev/get-started/typescript/index.md
- **Quickstart Go**: https://adk.dev/get-started/go/index.md
- **Quickstart Java**: https://adk.dev/get-started/java/index.md
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

Configuracion de modelos LLM: Gemini, Claude, LiteLLM, Ollama, vLLM, Gemma y routing de modelos.

- **Referencia de modelos**: https://adk.dev/agents/models/index.md
- **Gemini**: https://adk.dev/agents/models/google-gemini/index.md
- **Claude (Anthropic)**: https://adk.dev/agents/models/anthropic/index.md
- **LiteLLM**: https://adk.dev/agents/models/litellm/index.md
- **Ollama**: https://adk.dev/agents/models/ollama/index.md
- **vLLM**: https://adk.dev/agents/models/vllm/index.md
- **Gemma**: https://adk.dev/agents/models/google-gemma/index.md
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

- **Referencia**: https://adk.dev/get-started/streaming/index.md
- **Quickstart Python**: https://adk.dev/get-started/streaming/quickstart-streaming/index.md
- **Guia de desarrollo**: https://adk.dev/streaming/dev-guide/part1/index.md

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

## Referencia local

| Archivo | Descripcion |
|---------|-------------|
| [agente-base.md](./reference/agente-base.md) | Contexto operativo para la plantilla base de agente ADK (mesa de ayuda con Zoho Desk). Estructura, stack, variables de entorno, flujo de despliegue y convenciones. |
