# QA Checklist de Cierre

Checklist operativo para los dos gates de la skill `qa-and-testing`: cierre de feature y pre-PR. El agente debe ejecutar todas las verificaciones de cada gate antes de emitir el veredicto del contrato de salida del SKILL.md.

## Gate 1: Cierre de feature

Se ejecuta cuando la implementacion del feature esta lista y antes de marcar la tarea como `done`. Equivale al estado `review` del flujo de tareas.

### Cobertura y pruebas

- [ ] Cobertura de pruebas >= al objetivo del proyecto (default 85% en lineas y ramas).
- [ ] Pruebas unitarias del modulo o servicio afectado: escritas y ejecutadas.
- [ ] Pruebas de integracion de los limites del feature (HTTP, DB, MCP, eventos): escritas y ejecutadas.
- [ ] Pruebas de contrato: validadas contra el contrato definido en `specs/<feature>/contracts/` o equivalente.
- [ ] Caminos felices cubiertos.
- [ ] Manejo de errores cubierto (entradas invalidas, fallos externos, timeouts).
- [ ] Casos limite documentados en la spec: cubiertos o marcados como fuera de alcance con justificacion.
- [ ] Sin pruebas que afirmen contenido textual de respuestas de LLM (regla dura `google-agents-cli-adk-code`; esa conducta se valida con `adk eval`).

### Calidad de codigo

- [ ] Linter del proyecto ejecutado y sin errores (no warnings nuevos respecto a la rama base).
- [ ] Formateador aplicado (Prettier, Black, gofmt, etc.).
- [ ] Sin codigo comentado muerto, `console.log`, `print` de depuracion o `TODO` sin ticket asociado.
- [ ] Sin secretos en el diff (API keys, passwords, tokens, certificados). Verificar tambien archivos `.env.example` o similares.
- [ ] Dependencias nuevas o actualizadas: declaradas en el manifiesto y en el lockfile, con aviso de vulnerabilidad verificado para la version exacta.

### Build y ejecucion

- [ ] Build de produccion del proyecto: verde.
- [ ] Compilacion de tipos: verde (`tsc --noEmit`, `mypy`, `cargo check`, etc.).
- [ ] Migraciones de base de datos: aplicadas en entorno de pruebas y reversibles documentadas.

### Criterios de aceptacion

- [ ] Todos los criterios de aceptacion de `spec.md` verificados uno a uno.
- [ ] Escenarios de error contemplados en la spec: cubiertos o con desviacion documentada y aprobada.

### Trazabilidad

- [ ] Cada requisito de la spec mapeado a su implementacion y a sus pruebas.
- [ ] Logs de ejecucion de pruebas adjuntos al handoff.

## Gate 2: Pre-PR

Se ejecuta antes de `git push` de la rama del feature o antes de solicitar code review. Verifica que el cambio esta listo para ser revisado e integrado.

### Sincronizacion documental

- [ ] `CHANGELOG.md` actualizado con el cambio funcional.
- [ ] `AGENTS.md` del proyecto refleja nuevas convenciones, dependencias obligatorias o reglas operativas (si aplica).
- [ ] `README.md` actualizado si el feature agrega comandos, endpoints, variables de entorno o cambios visibles al usuario.
- [ ] Docs tecnicas del componente o servicio: actualizadas (JSDoc, Swagger, Compodoc, OpenAPI).
- [ ] Sin archivos `*.md` o `*.txt` residuales de la implementacion (notas, borradores).

### Estado del repositorio

- [ ] `git status` limpio para los archivos intencionalmente modificados.
- [ ] Sin archivos sin rastrear que deberian ir al commit (`.env`, `.DS_Store`, `node_modules`, builds).
- [ ] `.gitignore` del proyecto: vigente; si se detectan archivos ignorables, agregarlos en este mismo cambio.
- [ ] Ramal del feature: commiteada en su totalidad (sin cambios locales sin commitear).
- [ ] Mensajes de commit: en espanol, en formato imperativo, sin atribuciones de IA, sin trailers `Co-Authored-By` de agentes.

### Validaciones externas

- [ ] Validador del repositorio (`scripts/validate.sh` o equivalente) en verde.
- [ ] Pipeline de CI (si existe): verde en la rama del feature.
- [ ] SonarQube o herramienta de calidad equivalente (si aplica): sin issues bloqueantes nuevos.

### Seguridad y compliance

- [ ] Sin secretos en el historial de la rama (`git diff main...HEAD -- ':!*.md'` revisado).
- [ ] Variables de entorno nuevas: documentadas en `.env.example` o seccion equivalente; las reales siguen fuera del repo.
- [ ] Dependencias nuevas o actualizadas: aviso de vulnerabilidad verificado en GitHub Advisories, `npm audit`, `pip-audit` o equivalente para la version exacta instalada.

### Handoff al PR

- [ ] Descripcion del PR redactada con: proposito, scope, criterios de aceptacion cumplidos, pruebas ejecutadas, screenshots o logs relevantes.
- [ ] Reviewers asignados (si aplica).
- [ ] Veredicto del Gate 1 (cierre de feature): `APTO` y firmado por el agente QA.

## Flujo operativo

1. Ejecutar Gate 1 al terminar la implementacion. Si el veredicto es `NO APTO`, ejecutar el handoff del paso 3 de la skill (Action Items) y esperar correcciones. Repetir hasta `APTO`.
2. Marcar la tarea como `done` solo con Gate 1 `APTO`.
3. Ejecutar Gate 2 antes de `git push` o de abrir el PR. Si el veredicto es `NO APTO`, corregir los puntos del checklist (sincronizacion documental, mensajes de commit, secretos, etc.) y volver a evaluar.
4. Abrir el PR solo con Gate 2 `APTO` y Gate 1 firmado.

## Relacion con otras skills

- `spec-driven-dev`: este checklist valida los criterios de aceptacion de la spec producida por esa skill. Si no hay spec, los criterios de aceptacion provienen del insumo funcional (historia de usuario, PRD).
- `front-angular-fab`, `backend-nest-hexagonal-cun`, `google-adk-cun`: las verificaciones de build, lint y compilacion de tipos usan los comandos definidos en cada skill.
- `memoria`: registrar en el medio de memoria activo las decisiones de calidad que se vuelvan convencion del proyecto (umbrales, exclusiones, anti-patrones recurrentes).
