---
name: google-adk-cun-agente-base
description: Contexto mínimo y operativo para trabajar con proyectos de Google ADK en la CUN sin perder tiempo explorando desde cero.
---

## Objetivo
Este documento le da a un agente de IA el contexto mínimo y operativo para trabajar sin perder tiempo explorando desde cero. Es una guía de contexto del proyecto, no reemplaza especificaciones funcionales detalladas ni pruebas automatizadas.


## Resumen del Proyecto
- Tipo: plantilla de agente ADK para mesa de ayuda con Zoho Desk.
- Lenguaje principal: Python
- Framework de agentes: `google-adk`.
- Modelo LLM por defecto: Gemini (`AGENT_MODEL`, default `gemini-2.5-pro`).
- Integración externa principal: MCP remoto (`streamable_http`).
- Runtime: Docker (local) y Cloud Run o Agent Engine (producción, según defina el proyecto).

## Estructura Relevante
```text
.
├── agents/
│   └── base_agent_example/
│       ├── agent.py
│       ├── subagents/
│       │   ├── orchestrator.py
│       │   ├── cierre.py
│       │   ├── common.py
│       │   └── logging_hooks.py
│       ├── tools/
│       │   ├── zoho_actions.py
│       │   ├── zoho_attachments.py
│       │   ├── zoho_tools.py
│       │   ├── student_profile.py
│       │   └── cedula_verifier.py
│       ├── templates/
│       │   └── ticket_reply_email.html
│       └── integrations/mcp/
│           ├── config.py
│           └── toolset_factory.py
├── config/mcp/servers.yaml
├── Dockerfile
├── docker-compose.yml          # local only, not versioned (R10)
├── requirements.txt
└── .github/workflows/main.yml
```

## Arquitectura Operativa para servicio
- `agent.py` expone `root_agent` desde `subagents.build_root_agent()`.
- `orchestrator.py` usa `SequentialAgent` para encadenar subagentes.
- `cierre.py` centraliza cierre del ticket, comentario publico y reply por email con guardas de idempotencia.
- `tools/*.py` encapsulan side-effects externos (Zoho MCP, API perfil estudiante, adjuntos, verificación multimodal).

## Stack y Dependencias
- Python: `3.11-slim-bookworm` en contenedor.
- Dependencias relevantes (`requirements.txt`):
  - `google-adk==2.15.1`
  - `mcp>=1.23.0`
  - `python-dotenv`
  - `litellm`
  - `psycopg[binary]>=3.2.0`

**Nota:** la plantilla fue elevada al piso 2.x (`google-adk==2.15.1`, estable verificada 2026-11-25). Tras actualizar la dependencia se debe re-validar el agente con `agents-cli eval run`.

## Configuración y Variables de Entorno
Variables esperadas:
- `AGENT_MODEL`
- `GEMINI_API_KEY`
- `ZOHO_MCP_URL`
- `ZOHO_ORG_ID`

Configuración MCP:
- Archivo: `config/mcp/servers.yaml`.
- Servidor activo: `zoho`.
- Transporte: `streamable_http`.
- URL: `${ZOHO_MCP_URL}`.

## Flujo de Despliegue
- Local:
  - `docker-compose up --build` (desarrollo local; `docker-compose.yml` no se versiona, R10)
  - Servicio dev: `adk web` en `:8000`
  - Servicio API: `adk api_server` en `:8001`
- QA/STG/PRO:
  - Solicitud por correo al Tech Lead (PROC-DEP); ver `politica-despliegue.md`.
  - Ejecucion por DevOps o el Tech Lead: `agents-cli deploy` o el job de despliegue de `.github/workflows/main.yml` protegido por GitHub Environment con aprobacion manual.
  - El equipo de desarrollo no ejecuta `agents-cli deploy` contra QA/STG/PRO.
  - Deploy a Google Cloud Run (`us-central1`, servicio `agente-servicios`) o Agent Engine segun el proyecto defina.

### Nota sobre CI y ramas

El workflow `.github/workflows/main.yml` debe satisfacer lo requerido por la politica de despliegue: lint, pruebas/eval, SonarQube, build de Docker y tag automatico `vX.Y.Z` en `main`. El job de despliegue esta protegido por un GitHub Environment con aprobacion manual. Las ramas siguen el modelo `develop/qa/stg/main` conforme a la politica de versionamiento. Ver `politica-despliegue.md` para el detalle completo.

## Convenciones de Desarrollo
- Mantener side-effects en `tools/`, no en prompts largos.
- Usar `session.state` como contrato entre subagentes.
- Agregar logs de pipeline con prefijos estables (`PIPELINE_*`).
- Aplicar idempotencia en operaciones criticas (cierre, comentarios, reply).
- Evitar cambios de modelo sin requerimiento explicito.

## Checklist para un Agente IA antes de Modificar
1. Leer `README.md` y este documento.
2. Confirmar estructura actual en `agents/base_agent_example`.
3. Verificar variables de entorno requeridas.
4. Evitar exponer secretos o agregar hardcodes.
5. Si toca orquestación, validar imports y orden de subagentes.
6. Proponer pruebas de humo al final (arranque ADK + flujo basico).