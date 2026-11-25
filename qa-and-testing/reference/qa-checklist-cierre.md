# QA Checklist de Cierre

Checklist operativo para los tres gates de la skill `qa-and-testing`: cierre de feature, pre-PR y promocion entre ambientes. El agente debe ejecutar todas las verificaciones de cada gate antes de emitir el veredicto del contrato de salida del SKILL.md.

## Gate 1: Cierre de feature

Se ejecuta cuando la implementacion del feature esta lista y antes de marcar la tarea como `done`. Equivale al estado `review` del flujo de tareas.

### Cobertura y pruebas

- [ ] Cobertura de codigo nuevo >= 70 % (gate bloqueante R9, medido por SonarQube en la canalizacion).
- [ ] Cobertura global reportada: objetivo 85 % en lineas y ramas.
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

## Gate 2: Pre-PR hacia `develop`

Se ejecuta antes de `git push` de la rama del feature o antes de solicitar code review. Verifica que el cambio esta listo para ser revisado e integrado en `develop`.

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
- [ ] Rama del feature: commiteada en su totalidad (sin cambios locales sin commitear).
- [ ] Nombre de rama conforme a R5: `<tipo>/<ID_HU>-<slug-kebab>` (ejemplo: `feature/HU-123-login-google`). Tipos: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`. Equivalencias R5: `epic`->`feature`; `fix`, `bug`, `improve`->`bugfix`.
- [ ] Reglas R6: ramas permanentes (`develop`, `qa`, `stg`, `main`) protegidas, sin commits directos; rama efimera eliminada tras el merge.
- [ ] Mensajes de commit: en espanol, en formato imperativo, sin atribuciones de IA, sin trailers `Co-Authored-By` de agentes.

### Validaciones externas

- [ ] Validador o linter estructural del proyecto (si existe) en verde.
- [ ] Pipeline de CI (si existe): verde en la rama del feature.
- [ ] SonarQube: sin issues bloqueantes nuevos; cobertura de codigo nuevo >= 70 %.

### Seguridad y compliance

- [ ] Sin secretos en el historial de la rama (`git diff main...HEAD -- ':!*.md'` revisado).
- [ ] Variables de entorno nuevas: documentadas en `.env.example` o seccion equivalente; las reales siguen fuera del repo.
- [ ] Dependencias nuevas o actualizadas: aviso de vulnerabilidad verificado en GitHub Advisories, `npm audit`, `pip-audit` o equivalente para la version exacta instalada.

### Handoff al PR

- [ ] Descripcion del PR redactada con: proposito, scope, criterios de aceptacion cumplidos, pruebas ejecutadas, screenshots o logs relevantes.
- [ ] Reviewers asignados (si aplica).
- [ ] Veredicto del Gate 1 (cierre de feature): `APTO` y firmado por el agente QA.

## Gate 3: Promocion entre ambientes

Se ejecuta para PRs de promocion entre ramas permanentes: `develop -> qa`, `qa -> stg`, `stg -> main`. Aplica el checklist CHECK por rol. Los PRs hacia `stg` y `main` requieren aprobacion del Tech Lead (VER seccion 9).

### Clasificacion del resultado por ambiente

Segun POL-DEP, la clasificacion `Aprobado` / `Aprobado con observaciones` / `Rechazado` aplica a los resultados de los ambientes QA y STG, no al handoff de feature (que mantiene `APTO` / `NO APTO`).

#### Resultado de QA (POL-DEP 6.4)

- **Aprobado**: puede avanzar a STG.
- **Aprobado con observaciones**: puede avanzar cuando las observaciones no representen un riesgo para la siguiente etapa y exista aprobacion correspondiente.
- **Rechazado**: debe retornar a desarrollo para correccion.

#### Resultado de STG (POL-DEP 7.4)

- **Aprobado**: habilita la programacion para PRO.
- **Aprobado con observaciones**: requiere evaluacion del riesgo y aceptacion correspondiente.
- **Rechazado**: debe retornar al ciclo de correccion.

### Checklist por rol

#### Desarrollador

**Configuracion del entorno**
- [ ] Variables de entorno: configuradas para el ambiente destino.
- [ ] Configuraciones sensibles (API keys, BD) no en codigo.
- [ ] Modo produccion activado.
- [ ] Backups automatizados: base de datos, archivos estaticos y medios.
- [ ] Escalabilidad: balanceadores de carga configurados, autoescalado (si aplica).

**Rendimiento y optimizacion**
- [ ] Cache habilitado (CDN, navegador, servidor).
- [ ] Assets optimizados: imagenes comprimidas (WebP, lazy loading), CSS/JS minificados, HTTP/2 o HTTP/3.
- [ ] Base de datos: indices correctamente configurados, queries optimizados (evitar N+1), tiempo de respuesta bajo carga aceptable (<2 segundos).

**Estandares de pruebas y calidad**
- [ ] Todo nuevo desarrollo (feature) debe incluir un set de pruebas unitarias (CHECK 3.1).
- [ ] Cobertura de codigo nuevo >= 70 % (SonarQube).
- [ ] Contenerizacion: Dockerfile funcional, contenedor verificado localmente.
- [ ] Calidad funcional: pruebas funcionales exhaustivas previas al PR.

**SEO basico**
- [ ] Indexacion configurada (si Google / no indexar).
- [ ] Metatags optimizados (titulo, descripcion, Open Graph).
- [ ] Sitemap.xml generado y enviado a Google Search Console.
- [ ] Google Analytics/GTM integrado.
- [ ] Pruebas de rendimiento SEO (Core Web Vitals).

#### Equipo QA

**Pruebas**
- [ ] Pruebas unitarias y de integracion ejecutadas y aprobadas.
- [ ] Pruebas de carga y estres para validar escalabilidad.
- [ ] Pruebas de compatibilidad: navegadores (Chrome, Firefox, Safari, Edge), dispositivos moviles (iOS, Android), sistemas operativos.
- [ ] Pruebas de usabilidad con usuarios reales.
- [ ] Pruebas de seguridad: penetracion o auditoria basica.

**Monitoreo y errores**
- [ ] Endpoint `/metrics` expuesto en formato Prometheus (backend).
- [ ] Grafana configurado para visualizacion de metricas.
- [ ] Logs centralizados configurados.
- [ ] Alertas para caidas o errores criticos.
- [ ] Paginas de error personalizadas (404, 500, mantenimiento).
- [ ] Health checks para servicios criticos.

**Documentacion**
- [ ] Documentacion tecnica actualizada (APIs, arquitectura, MER).
- [ ] Manual de usuario o guias de inicio rapido.
- [ ] Procedimientos de despliegue (rollback, actualizaciones).

#### DevOps

**Seguridad**
- [ ] HTTPS: certificado SSL/TLS instalado y configurado.
- [ ] Proteccion contra vulnerabilidades: validacion de entradas (SQL Injection, XSS, CSRF), headers de seguridad (CSP, HSTS, X-Content-Type-Options), librerias/frameworks actualizados.
- [ ] Autenticacion y autorizacion: contrasenas con hash seguro (bcrypt, Argon2), recuperacion segura, roles y permisos implementados.
- [ ] Proteccion de APIs: rate limiting, tokens de acceso (JWT, OAuth) con expiracion, endpoints sensibles protegidos.
- [ ] Entregar disponibilidad de los datos al area de Analitica.

**Despliegue**
- [ ] Entorno de staging identico a produccion.
- [ ] CI/CD configurado (GitHub Actions).
- [ ] Plan de rollback en caso de fallo.
- [ ] DNS y redirecciones configuradas correctamente.

#### Product Owner

**Cumplimiento legal**
- [ ] Politicas de privacidad y terminos de servicio visibles.
- [ ] Cookies: banner de consentimiento (GDPR, CCPA).
- [ ] Accesibilidad (WCAG 2.2): contraste, ARIA labels, navegacion por teclado. (CHECK cita 2.1; se adopta 2.2 por R22)
- [ ] Licencias: uso correcto de software de terceros.

**Comunicacion pre-lanzamiento**
- [ ] Notificaciones a usuarios (email, in-app) sobre el lanzamiento.
- [ ] Canales de soporte activos (chat, email, redes).
- [ ] Changelog publico con novedades y correcciones.
- [ ] Socializacion y transferencia de conocimiento con la EFI.

#### Revision final

- [ ] Checklist firmada por el coordinador, el equipo de desarrollo, QA y DevOps.
- [ ] Prueba de humo (smoke test) en produccion.
- [ ] Verificacion de backups recientes.

**Contingencias**
- [ ] Plan de respuesta ante incidentes.
- [ ] Equipo de guardia asignado para las primeras 24-48 horas.

## Plan de pruebas por tipo

Segun QA-MET seccion 5:

| Prueba | Objetivo | Herramienta | Encargado |
|--------|----------|-------------|-----------|
| Unitarias (Backend) | Validar metodos de logica de negocio, funcionalidades y CRUD de datos. | Depende del lenguaje de programacion | Backend a Cargo |
| Unitarias (FrontEnd) | Probar componentes individuales (interfaz de usuario y gestion del estado). | Depende del lenguaje de programacion | FrontEnd a Cargo |
| Integracion | Comprobar comunicacion entre componentes, servicios, bases de datos, configuracion y entornos. | Segun proyecto | QA |
| Funcionales | Asegurar que el sistema cumpla con los requisitos de diseno y funcionalidad. | Segun proyecto | QA |
| Aceptacion | Determinar si el software y sus funcionalidades cumplen con las necesidades de los usuarios. | Segun proyecto | QA |
| Regresion | Verificar y corregir posibles errores despues de anadir nuevas funciones creadas. | Segun proyecto | QA |
| Rendimiento | Evaluar la velocidad, capacidad de respuesta y estabilidad. | JMeter o K6 | QA |
| Rendimiento (Web) | Mide la velocidad de carga y descarga en paginas web en el navegador del usuario. | GTmetrix | UI/UX |
| Accesibilidad | Garantizar que la aplicacion sea accesible para todos los usuarios. | WCAG 2.2 | Externo |
| Accesibilidad (Web) | Garantizar que la aplicacion sea accesible para todos los usuarios. | PageSpeed Insights, A-Checks | UI/UX |
| Medicion | Verificar que las herramientas de medicion esten conectadas correctamente. | Google Analytics, Zoho PageSense | UI/UX |

## Estimacion de pruebas

Segun QA-MET, se dividen los casos de prueba por nivel de dificultad:

| Nivel | Tiempo | Descripcion |
|-------|--------|-------------|
| Baja | 5 min | Flujo simple, pocos pasos, sin dependencias externas. |
| Media | 10 min | Flujo completo con logica basica, validaciones multiples o interaccion entre pantallas. |
| Alta | 15 min | Flujos complejos, multiples modulos, datos especiales o pasos con logica de profundidad. |

**Formula**: Tiempo estimado total = (Numero de casos de prueba) x (Tiempo promedio por caso) + Margen extra (20 %)

**Ejemplo trabajado**:

| Tipo de Caso | Casos | Tiempo Promedio | Total estimado | Con margen (20 %) |
|--------------|-------|-----------------|----------------|-------------------|
| Funcional | 30 | 15 min | 450 min | 540 min (9 h) |
| Integracion | 15 | 10 min | 150 min | 180 min (3 h) |
| Aceptacion | 10 | 5 min | 50 min | 60 min (1 h) |
| Regresion | 50 | 5 min | 250 min | 300 min (5 h) |

**Tiempo sin margen**: 900 minutos = 15 horas. **Tiempo con 20 % extra**: 1.080 minutos = 18 horas.

## Flujo operativo

1. Ejecutar Gate 1 al terminar la implementacion. Si el veredicto es `NO APTO`, ejecutar el handoff del paso 3 de la skill (Action Items) y esperar correcciones. Repetir hasta `APTO`.
2. Marcar la tarea como `done` solo con Gate 1 `APTO`.
3. Ejecutar Gate 2 antes de `git push` o de abrir el PR hacia `develop`. Si el veredicto es `NO APTO`, corregir los puntos del checklist y volver a evaluar.
4. Abrir el PR solo con Gate 2 `APTO` y Gate 1 firmado.
5. Ejecutar Gate 3 para cada PR de promocion (`develop -> qa`, `qa -> stg`, `stg -> main`). Verificar el checklist por rol y obtener aprobacion del Tech Lead para PRs hacia `stg` y `main`.

## Relacion con otras skills

- `spec-driven-dev`: este checklist valida los criterios de aceptacion de la spec producida por esa skill. Si no hay spec, los criterios de aceptacion provienen del insumo funcional (historia de usuario, PRD).
- `front-angular-fab`, `backend-nest-hexagonal-cun`, `google-adk-cun`: las verificaciones de build, lint y compilacion de tipos usan los comandos definidos en cada skill. La cobertura y los gates de QA son comunes a todos los dominios.
- `memoria`: registrar en el medio de memoria activo las decisiones de calidad que se vuelvan convencion del proyecto (umbrales, exclusiones, anti-patrones recurrentes).
