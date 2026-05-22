# Buenas Practicas ADK

Guia de anti-patrones, convenciones y checklist de aceptacion para proyectos basados en Google ADK.

---

## Anti-patrones prohibidos

Evitar siempre los siguientes patrones al trabajar con agentes ADK:

- **Hardcodear credenciales o API keys**: usar variables de entorno o archivos de configuracion.
- **Meter logica de negocio compleja dentro de prompts**: si la logica requiere condicionales, bucles o transformaciones, implementarla en Python.
- **Ejecutar side-effects sin validacion previa de contexto**: verificar estado y precondiciones antes de llamadas externas.
- **Operaciones criticas sin guardas de idempotencia**: cierre de tickets, envio de correos, comentarios publicos y llamadas a APIs externas deben tener mecanismos para evitar ejecucion duplicada.
- **Refactors amplios no solicitados**: modificar solo lo necesario para la tarea en curso.
- **Cambiar el modelo LLM por defecto sin requerimiento explicito**: el modelo esta definido en configuracion por una razon.
- **Introducir logica duplicada sin justificacion**: reutilizar funciones y herramientas existentes.
- **Eliminar comportamiento existente sin solicitud explicita**: los cambios deben ser aditivos salvo indicacion contraria.

---

## Convenciones para subagentes

Al crear o modificar subagentes en un proyecto ADK:

### Estructura de archivos
- Ubicacion: `agents/<agente_raiz>/subagents/<nombre>.py`
- Builder: funcion `build_agente_<nombre>(deps)` que retorna el agente configurado.

### Patrones de implementacion
- Para agentes condicionales, preferir patron `BaseAgent` wrapper con subagente interno `LlmAgent`.
- Para side-effects criticos, usar callbacks o capa de tools con guardas de idempotencia.
- Registrar trazas en el logger del pipeline con prefijo consistente (`PIPELINE_*`).

### Integracion con orquestador
- Definir claramente la posicion del agente en la cadena secuencial.
- Documentar por que va antes o despues de cada etapa.
- Asegurar que no rompa agentes posteriores (especialmente cierre).
- Mantener `before_agent_callback` y `after_agent_callback` del pipeline existente.

### Criterio de ubicacion
- Si el agente solo enriquece contexto: ubicarlo antes de cierre.
- Si ejecuta side-effects de negocio: ubicarlo antes de cierre y con guardas.

---

## Contrato de estado entre agentes

Usar `session.state` como contrato entre subagentes. Para cada agente nuevo documentar:

- `input_state_keys`: claves de estado que consume.
- `output_state_keys`: claves de estado que escribe.
- `side_effects`: acciones externas que ejecuta (comentarios, cierres, emails, API calls).

---

## Reglas de calidad

- Mantener side-effects en `tools/`, no en prompts largos.
- Agregar logs de pipeline con prefijos estables (`PIPELINE_*`).
- Aplicar idempotencia en operaciones criticas.
- No instalar dependencias nuevas sin justificacion y aprobacion.
- Mantener codigo en espanol para instrucciones y comentarios de negocio.
- Mantener nombres tecnicos en ingles cuando aplique.

---

## Checklist de aceptacion (Definition of Done)

Antes de considerar un agente ADK como terminado:

- [ ] El agente compila y se integra en el flujo ADK sin errores.
- [ ] Consume y escribe claves de estado documentadas.
- [ ] No rompe agentes existentes ni el flujo secuencial.
- [ ] Tiene validaciones de entrada minimas.
- [ ] Registra eventos de pipeline utiles con prefijo `PIPELINE_*`.
- [ ] No contiene secretos hardcodeados.
- [ ] Documentacion afectada actualizada (README, AGENTS, referencias).
- [ ] Incluye pasos claros de prueba manual o local.
- [ ] Side-effects criticos tienen guardas de idempotencia.

---

## Plantilla de implementacion sugerida

```text
1) Analizar objetivo del nuevo agente
2) Disenar contrato de estado (inputs/outputs/side-effects)
3) Implementar subagente en subagents/<nombre>.py
4) Integrar builder en orchestrator.py
5) Ajustar dependencies/tools si aplica
6) Anadir/actualizar logs PIPELINE_*
7) Ejecutar validacion local y revisar riesgos
```
