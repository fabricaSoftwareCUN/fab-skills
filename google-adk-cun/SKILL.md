---
name: google-adk-cun
description: Guía sobre el Google Agent Development Kit (ADK). Usa esta skill cuando el usuario pregunte sobre creación de agentes, uso de herramientas, streaming, callbacks, tutoriales, despliegue o arquitectura avanzada con Google ADK.
---

# Skill de Google ADK

Esta skill referencia los recursos oficiales para el Google Agent Development Kit (ADK). Aquí se relacionan los temas de la documentación con sus links a los recursos.

## Cómo usarla

Identifica el interés o la tarea específica del usuario y consulta el archivo de referencia relevante que aparece a continuación.

## Instrucciones

- Cuando un usuario pregunte sobre un tema específico, carga el archivo de referencia correspondiente para obtener las URL de la documentación y del código de ejemplo.
- Puedes leer el contenido de los archivos enlazados usando `web_fetch` o `run_shell_command` con `curl` si necesitas proporcionar el contenido real al usuario.
- Prioriza siempre proporcionar el código de ejemplo en Python al explicar un concepto.

## Temas

### 1. Primeros pasos

Para instalación, guías rápidas y configuración básica de agentes.

- **Referencia**: https://adk.dev/get-started/python/index.md

### 2. Agentes y modelos

Para crear diferentes tipos de agentes —LLM, Workflow, Loop, Parallel y Sequential, y configurar modelos específicos como Gemini, Anthropic, entre otros.

- **Referencia de agentes**: https://adk.dev/agents/index.md
- **Referencia de modelos**: https://adk.dev/agents/models/index.md

### 3. Herramientas básicas y avanzadas

Para integrar herramientas mcp y herramientas personalizadas que puedes crear tú mismo, como herramientas de Python, herramientas de shell, herramientas de API, entre otras.

- **Referencia de herramientas básicas**: https://adk.dev/tools-custom/mcp-tools/index.md
- **Referencia de herramientas avanzadas**: https://adk.dev/tools-custom/index.md

### 5. Callbacks

Para conectarse a eventos del ciclo de vida del agente, como antes o después de la ejecución del agente, del modelo o de herramientas.

- **Referencia**: https://adk.dev/callbacks/index.md

### 6. Runtime y arquitectura CUN

Para profundizar en Runtime, Sessions, Memory, Context, Events, Artifacts y Plugins.

- **Referencia**: 

### 7. Despliegue y operaciones

Para desplegar agentes ?????

- **Referencia**: 

### 8. Tutoriales y ejemplos

Para tutoriales, ejemplos base y muestras de agentes.

- **Referencia**: https://adk.dev/tutorials/index.md

### 9. Referencia de API

Para detalles de la API REST.

- **Referencia**: https://adk.dev/api-reference/index.md

### 10. Información general

Otros agentes, componentes, ejemplos y referencias generales sobre el ADK.

- **Referencia**: https://adk.dev/llms.txt
