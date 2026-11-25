# Politica de Despliegue - ADK

Fecha de alineacion: 2026-11-25

## Fuentes

| Codigo | Documento | URL | Ultima edicion |
|---|---|---|---|
| POL-DEP | POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001, v1.0, Vigente) | https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU | 2026-09-14 |
| PROC-DEP | Politica de despliegue para aplicaciones (procedimiento tecnico de solicitud) | https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw | 2026-11-25 |
| CHECK | Checklist - Paso a produccion de App | https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP | 2026-05-21 |
| VER | Politica de Versionamiento (v1.0.0) | https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC | 2025-12-09 |
| INV | Lista de aplicaciones (inventario) | https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm | — |

---

## 1. Flujo estandar y definiciones

Flujo estandar: **DESARROLLO -> QA -> STG -> PRO**. Cada transicion debe cumplir las condiciones establecidas para el ambiente correspondiente. El avance entre ambientes no se realiza unicamente por disponibilidad tecnica; tambien deben cumplirse las condiciones funcionales, tecnicas y de negocio.

### Definiciones

- **3.1 Desarrollo:** Ambiente o etapa en la cual se construyen, modifican o corrigen los componentes de software.
- **3.2 QA:** Ambiente destinado a realizar pruebas tecnicas y funcionales sobre los cambios desarrollados. Su proposito principal es identificar errores antes de avanzar a un ambiente de validacion integral.
- **3.3 STG:** Ambiente de Staging o preproduccion, utilizado para realizar validaciones integrales de la solucion antes de su paso a produccion. Debe representar, en la medida de lo posible, las condiciones relevantes del ambiente productivo.
- **3.4 PRO:** Ambiente de Produccion, donde se encuentra disponible la solucion para los usuarios finales y donde cualquier cambio puede generar impacto sobre la operacion institucional.
- **3.5 Despliegue:** Actividad mediante la cual una version, componente, configuracion o cambio de software es trasladado de un ambiente a otro.
- **3.6 Rollback:** Procedimiento mediante el cual se revierte un despliegue a una version previamente estable cuando el nuevo cambio genera una afectacion no controlada.
- **3.7 Hotfix:** Correccion excepcional destinada a solucionar un problema critico que impide el correcto funcionamiento de una solucion o afecta directamente la utilizacion normal de la misma por parte del usuario final. Un Hotfix tiene como finalidad recuperar o mantener la operacion correcta de una funcionalidad existente.
  - **No se considera Hotfix:**
    - Una nueva funcionalidad.
    - Una mejora funcional.
    - Un cambio de diseno.
    - Un ajuste estetico.
    - Un cambio de alcance.
    - Una optimizacion que no sea critica.
    - Una solicitud de conveniencia.
    - Una modificacion solicitada para acelerar una entrega.
    - Un desarrollo que pueda esperar el ciclo normal de despliegue.
- **3.8 Despliegue urgente:** Cambio que requiere atencion prioritaria por circunstancias particulares, pero que no necesariamente cumple las condiciones de criticidad establecidas para un Hotfix. Su tratamiento debera sujetarse al esquema de autorizaciones establecido en esta politica.
- **3.9 Ventana de despliegue:** Periodo autorizado para ejecutar despliegues en un ambiente determinado.
- **3.10 Freeze o congelamiento:** Periodo durante el cual se restringen o suspenden despliegues debido a eventos institucionales, auditorias, actividades criticas, cierres operativos, riesgos tecnologicos u otras circunstancias previamente identificadas.

---

## 2. Modelo de ramas y versionamiento

### Ramas principales (larga duracion)

| Rama | Ambiente | Proposito | Version |
|---|---|---|---|
| `develop` | Desarrollo (DEV) | Integracion de todas las features. Base para `qa`. | Sufijo `-alpha` |
| `qa` | Pruebas (QA) | Version estable para el equipo de QA o pruebas de aceptacion. | Sufijo `-beta` |
| `stg` | Staging (STG) | Clon de produccion para pruebas finales y DevOps checklist. | Sufijo `-rc.N` |
| `main` | Produccion (PRO) | Solo codigo de produccion liberado. Solo merge desde `stg` o `hotfix`. | Version estable `X.Y.Z` |

### Ramas efimeras (corta duracion)

Formato: `<tipo>/<ID_HU>-<slug-kebab>`. Ejemplo: `feature/HU-123-login-google`.

Tipos permitidos: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`.

Equivalencias: `epic` -> `feature`; `fix`, `bug`, `improve` -> `bugfix`.

| Tipo | Sale de | Vuelve a |
|---|---|---|
| `feature`, `bugfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config` | `develop` | `develop` |
| `hotfix` | `main` | `main` **y** `develop` |

### Promocion

`develop -> qa -> stg -> main`, siempre por PR. Ramas permanentes protegidas, sin commits directos. Rama efimera se elimina tras el merge.

### Versionamiento (SemVer)

Formato: `X.Y.Z` (MAYOR.MENOR.PARCHE).

- **MAYOR:** cambios que rompen compatibilidad.
- **MENOR:** funcionalidades compatibles hacia atras.
- **PARCHE:** correcciones sin afectar funcionalidades existentes.

Sufijos por rama: `-alpha` en `develop`, `-beta` en `qa`, `-rc.N` en `stg`, estable en `main`.

Proyecto nuevo inicia en `0.1.0`; primer release publico `1.0.0`.

Tag `vX.Y.Z` en `main` creado automaticamente por CI al hacer merge desde `stg` o `hotfix`.

`CHANGELOG.md` en formato Keep a Changelog.

### Responsabilidades

- **Desarrolladores:** asegurar incrementos correctos, actualizar CHANGELOG y seguir el flujo de PRs a las ramas correctas.
- **Lider Tecnico:** validar cambios MAYOR y aprobar releases (PRs a `stg` y `main`).
- **QA:** verificar versiones pre-release (`-alpha`, `-beta` en `develop` y `qa`).
- **DevOps:** verificar checklist antes de subir los cambios a `stg` y `main`.

---

## 3. Requisitos tecnicos obligatorios antes de solicitar despliegue

### Dockerfile

El proyecto debe contar con un `Dockerfile` funcional y probado, utilizando la imagen publica de AWS suministrada por el **Tech Lead**. Build multi-etapa.

### SonarQube y CI/CD

Debe incluir `sonar-project.properties` y `main.yml` (GitHub Actions) con lint, unitarias, cobertura y analisis Sonar; tag automatico `vX.Y.Z` en `main`.

### .gitignore (R10)

No se versiona `docker-compose.yml`. `.gitignore` incluye:

```
docker-compose.yml
docker-compose.*.yml
compose.yml
compose.*.yml
*.sh
.env
.env.*
```

### Variables de entorno (R11)

- Formato `SNAKE_CASE`, sin espacios, sin comillas innecesarias, ordenadas por categoria.
- Se envian como adjunto `.txt` con tres bloques: `ENVS NUEVAS`, `ENVS MODIFICADAS`, `ENVS ELIMINADAS`.
- Nunca en el repositorio.

Formato del archivo `.txt`:

```
ENVS NUEVAS:
NOMBRE_VARIABLE_1=valor_1
NOMBRE_VARIABLE_2=valor_2

ENVS MODIFICADAS:
NOMBRE_VARIABLE_EXISTENTE=nuevo_valor

ENVS ELIMINADAS:
NOMBRE_VARIABLE_A_REMOVER
```

### Registro en inventario (INV)

El endpoint del agente debe estar registrado en el inventario de aplicaciones para agilizar el proceso de despliegue y pruebas.

### Observabilidad (R12)

Si el agente sirve HTTP a traves de un servidor custom, debe exponer `GET /metrics` en formato Prometheus con las cuatro senales de oro (trafico, errores 5xx, latencia p95/p99, saturacion) y metricas de negocio. Si no sirve HTTP custom, usar la skill `google-agents-cli-observability` (Cloud Trace, logging).

### Cobertura (R9)

Gate bloqueante: **70 % en codigo nuevo**, medido por SonarQube en la canalizacion. Objetivo recomendado del equipo: 85 % global en lineas y ramas.

### Particularidades ADK (R24)

- La solicitud sigue PROC-DEP: correo con PR, variables, ambiente.
- La ejecucion la realiza **DevOps o el Tech Lead**, bien con `agents-cli deploy`, bien con el workflow `main.yml` cuyo job de despliegue esta protegido por un **GitHub Environment con aprobacion manual**.
- El equipo de desarrollo **no ejecuta `agents-cli deploy` contra QA, STG ni PRO** por su cuenta; puede usarlo contra su entorno de desarrollo.
- Despliegue siempre con aprobacion humana explicita.
- Suite de evaluacion (`agents-cli eval run`) debe estar en verde antes de solicitar QA/STG/PRO.

---

## 4. Condiciones por ambiente

### QA (POL-DEP §6)

**Condiciones para desplegar en QA:**
- Version o cambio identificado.
- Desarrollo finalizado para el alcance correspondiente.
- Informacion minima para realizar las pruebas.
- Identificacion de funcionalidades modificadas.
- Responsable tecnico.
- Responsable funcional cuando aplique.

**Validaciones en QA:** pruebas funcionales, tecnicas, de integracion, validacion de errores, formularios, permisos, servicios, APIs, regresion, validaciones de interfaz, pruebas basicas de rendimiento cuando aplique.

**Resultado de QA:**
- **Aprobado:** puede avanzar a STG.
- **Aprobado con observaciones:** puede avanzar cuando las observaciones no representen un riesgo para la siguiente etapa y exista aprobacion correspondiente.
- **Rechazado:** debe retornar a desarrollo para correccion.

### STG (POL-DEP §7)

**Condiciones para desplegar en STG:**
- Resultado satisfactorio de QA.
- Version identificada.
- Alcance definido.
- Correcciones criticas de QA solucionadas.
- Evidencia de pruebas cuando aplique.
- Responsables de validacion identificados.

**Validaciones en STG:** pruebas integrales, validacion de procesos completos, con integraciones, funcional, de datos, de permisos, de comunicaciones entre sistemas, regresion, de negocio, validaciones finales previas a produccion.

**Resultado de STG:**
- **Aprobado:** habilita la programacion para PRO.
- **Aprobado con observaciones:** requiere evaluacion del riesgo y aceptacion correspondiente.
- **Rechazado:** debe retornar al ciclo de correccion.

### PRO (POL-DEP §8)

**Condiciones generales para PRO:**
- Validacion satisfactoria en QA.
- Validacion satisfactoria en STG.
- Version identificada.
- Alcance definido.
- Responsable tecnico.
- Responsable funcional cuando aplique.
- Validacion o aprobacion correspondiente.
- Identificacion de riesgos.
- Estrategia de rollback cuando tecnicamente sea viable.
- Comunicacion a las partes involucradas.
- Confirmacion de que no existe una restriccion o congelamiento vigente.

---

## 5. Calendario, excepciones, hotfix, freeze y bloqueo

### Calendario (POL-DEP §9-10, R1)

- **QA:** dias habiles, segun planificacion del proyecto y disponibilidad de responsables.
- **STG:** dias habiles, teniendo en cuenta las actividades de validacion requeridas.
- **PRO:** unicamente los dias **lunes habiles**. Cuando el lunes sea un dia no habil debido a festivo u otra condicion institucional, el despliegue podra programarse para el **siguiente dia habil**.

**Regla general (R1):** PRO = lunes habil o siguiente dia habil cuando el lunes no sea habil.

No se considera parte de la ventana estandar de produccion: martes, miercoles, jueves, viernes, sabados, domingos ni festivos. Los despliegues realizados fuera de esta ventana deberan tratarse como una excepcion.

**Nota:** POL-DEP (2026-09-14) sustituye el calendario de dias de PROC-DEP; el horario de solicitud y los tiempos orientativos de PROC-DEP se conservan (R25). R1 gobierna: PRO solo en lunes habil o siguiente dia habil.

No se realizaran despliegues programados en sabados, domingos ni festivos. Estos dias estaran restringidos para despliegues ordinarios. Cualquier despliegue requerido durante estos periodos debera corresponder a una situacion excepcional debidamente justificada y autorizada. Los Hotfixes criticos podran recibir un tratamiento excepcional.

### Excepciones al calendario de PRO (POL-DEP §11)

Cualquier despliegue a PRO que se pretenda realizar fuera del lunes habil o del siguiente dia habil cuando el lunes sea no habil debera contar con una justificacion y autorizacion previa.

La autorizacion general para una excepcion al calendario de PRO corresponde al: **Vicerrector de Servicios Digitales.**

La solicitud de excepcion debera incluir como minimo:
- Proyecto o solucion.
- Cambio a desplegar.
- Motivo de la excepcion.
- Riesgo de no realizar el despliegue.
- Fecha y hora propuesta.
- Impacto esperado.
- Responsable tecnico.
- Responsable funcional cuando aplique.
- Validaciones realizadas.
- Plan de rollback cuando aplique.

### Hotfix (POL-DEP §12)

**Condicion de criticidad:** un Hotfix unicamente podra clasificarse como tal cuando exista un problema critico que impida el correcto funcionamiento de la solucion o afecte directamente la utilizacion normal de esta por parte del usuario final. La criticidad debera poder demostrarse mediante un impacto operativo verificable.

**Ejemplos que justifican un Hotfix:**
- Una funcionalidad critica deja de funcionar.
- Los usuarios no pueden acceder a una funcionalidad esencial.
- Un proceso principal queda bloqueado.
- Una integracion indispensable deja de funcionar.
- Un error impide completar un proceso institucional.
- Una actualizacion genera un error critico.
- Se presenta una afectacion significativa sobre el servicio.
- Una funcionalidad previamente operativa deja de permitir el uso normal de la solucion.

**Situaciones que NO justifican un Hotfix:**
- Acelerar una entrega.
- Adelantar una funcionalidad.
- Incorporar una nueva funcionalidad.
- Resolver cambios de alcance.
- Cambiar disenos.
- Ajustar estilos visuales.
- Incorporar mejoras no criticas.
- Resolver solicitudes de conveniencia.
- Evitar el proceso normal de QA y STG.
- Resolver una solicitud que pueda esperar al siguiente ciclo de despliegue.

**Autorizacion de Hotfix:** el **Coordinador de la Fabrica de Software** podra aprobar el tratamiento como Hotfix. Esta autorizacion constituye una excepcion especial al ciclo y ventana ordinaria de despliegue. La autorizacion del Hotfix no elimina la obligacion de:
- Evaluar el riesgo.
- Realizar pruebas minimas.
- Registrar el cambio.
- Identificar la version.
- Ejecutar el despliegue de forma controlada.
- Realizar validacion posterior.
- Documentar la situacion.

**Informacion minima para un Hotfix:**
- Problema identificado.
- Funcionalidad afectada.
- Impacto sobre usuarios.
- Evidencia de la afectacion cuando aplique.
- Causa identificada o hipotesis tecnica.
- Correccion propuesta.
- Responsable tecnico.
- Riesgo asociado.
- Pruebas minimas realizadas.
- Version a desplegar.
- Plan de rollback cuando sea viable.
- Responsable de validacion posterior.

**Flujo del Hotfix:**
Incidente critico -> Identificacion -> Evaluacion tecnica -> Validacion de criticidad -> Clasificacion como Hotfix -> Aprobacion del Coordinador -> Correccion -> Pruebas minimas -> Despliegue -> Validacion en PRO -> Monitoreo -> Documentacion y cierre.

### Diferencia entre Hotfix y despliegue urgente (POL-DEP §13)

| Criterio | Hotfix | Despliegue urgente |
|---|---|---|
| Objetivo | Corregir un problema critico existente | Atender una necesidad urgente |
| Impacto | Afecta directamente el funcionamiento o uso normal | Puede o no afectar la operacion |
| Funcionalidad nueva | No | Puede aplicar |
| Correccion critica | Si | Puede aplicar |
| Tratamiento excepcional | Si | Segun autorizacion |
| Autorizacion especial | Coordinador de la Fabrica | Segun la excepcion correspondiente |
| Uso para acelerar proyectos | No | No debe utilizarse para evadir planificacion |

La clasificacion como Hotfix debera estar sustentada en la criticidad real del problema, no unicamente en la urgencia percibida por el solicitante.

### Freeze (POL-DEP §15)

La Fabrica de Software podra establecer periodos de congelamiento de despliegues cuando exista un riesgo operativo considerable. Durante un periodo de freeze podran restringirse:
- Nuevas funcionalidades.
- Cambios estructurales.
- Migraciones.
- Actualizaciones de alto riesgo.
- Cambios de infraestructura.
- Cambios sobre servicios criticos.

Los Hotfixes podran ser atendidos durante un periodo de congelamiento cuando exista una condicion critica que afecte la operacion, aplicando el procedimiento de excepcion correspondiente.

### Criterios de bloqueo automatico (POL-DEP §33)

Un despliegue debera considerarse bloqueado cuando exista cualquiera de las siguientes condiciones:

**Bloqueo critico:**
- Error que impide el funcionamiento.
- Riesgo alto de indisponibilidad.
- Perdida o inconsistencia potencial de informacion.
- Integracion critica caida.
- Falta de estrategia minima de recuperacion cuando sea necesaria.

**Bloqueo funcional:**
- Falta de validacion funcional.
- Alcance no definido.
- Resultado de pruebas no satisfactorio.

**Bloqueo institucional:**
- Auditoria.
- Evento institucional.
- Actividad de alta criticidad.
- Freeze.
- Restriccion comunicada por un area responsable.

---

## 6. Proceso de solicitud por correo (PROC-DEP)

### Primera vez en un entorno nuevo

Se debe enviar un **correo electronico** que incluya:
- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno.
- Ambiente.
- Requisitos tecnicos.
- Enlace del Pull Request (PR).

### Solicitud de despliegue (cualquier entorno)

El correo de solicitud debe incluir obligatoriamente:
- **Nombre del proyecto.**
- **Nombre del repositorio.**
- **Variables de entorno:** adjuntas unicamente si requieren creacion o modificacion (formato `.txt` descrito en la seccion 3).
- **Enlace del Pull Request (PR):** correspondiente a la rama del ambiente destino.
- **Ambiente destino.**
- **Descripcion de cambios.**
- **Version a desplegar** (para produccion).

**Ejecucion (R24):** la solicitud se envia por correo; la ejecucion la realiza DevOps o el Tech Lead con `agents-cli deploy` o mediante el job de despliegue de `main.yml` protegido por GitHub Environment con aprobacion manual. El equipo de desarrollo no ejecuta `agents-cli deploy` contra QA/STG/PRO.

### Reglas especificas por ambiente (R2)

- **Despliegue a Desarrollo (DEV, QA, STG):** solicitud directa al Tech Lead con la informacion anterior.
- **Despliegue a Produccion (PRO) lunes habil:**
  - Se debe copiar al **QA** en la solicitud.
  - El despliegue queda condicionado a la **respuesta de aprobacion** del QA en el mismo hilo de correo.
  - Requiere **checklist de paso a produccion aprobado por el Tech Lead**, o **solicitud directa del Coordinador de la Fabrica por el canal debido**.
- **Despliegue a PRO martes a viernes:** excepcion autorizada por el **Vicerrector de Servicios Digitales**.
- **Despliegue a PRO sabado, domingo o festivo:** excepcion con **autorizacion correspondiente** (POL-DEP §28), bajo la autorizacion general del Vicerrector para toda excepcion al calendario (POL-DEP §11).
- **Hotfix critico:** el despliegue podra ser aprobado directamente por el **Coordinador de la Fabrica de Software**.

### Disposicion horaria (R25)

Las solicitudes se envian en **dia habil entre las 8:00 y las 17:00** (PROC-DEP).

Tiempos orientativos de atencion:
- **DEV, QA y STG:** de 1 h a 36 h.
- **PRO:** de 2 h a 24 h.

La **ejecucion** en PRO se programa siempre segun R1 (lunes habil o siguiente dia habil); la hora exacta se define por caso (POL-DEP §19).

**Nota:** POL-DEP (2026-09-14) sustituye el calendario de dias de PROC-DEP; el horario de solicitud y los tiempos orientativos de PROC-DEP se conservan (R25).

---

## 7. Rollback y validacion posterior a PRO

### Rollback (POL-DEP §20)

Cuando tecnicamente sea viable, los despliegues deberan contar con una estrategia de rollback. El rollback podra ejecutarse cuando:
- El cambio genere una afectacion critica.
- La solucion presente comportamiento inesperado.
- Se afecten funcionalidades esenciales.
- El impacto supere el riesgo aceptado.
- No sea posible estabilizar la solucion dentro de un periodo razonable.

La decision debera considerar:
- Impacto del error.
- Impacto de regresar a la version anterior.
- Integridad de datos.
- Dependencias.
- Estado de las integraciones.
- Capacidad tecnica para revertir.

Despues de un rollback debera registrarse:
- Motivo.
- Version desplegada.
- Version restaurada.
- Impacto.
- Responsable.
- Acciones posteriores.

### Validacion posterior a PRO (POL-DEP §21)

Todo despliegue a PRO debera contar con una validacion posterior. Esta podra incluir:
- Verificacion de disponibilidad.
- Prueba funcional principal.
- Validacion de integraciones.
- Revision de logs.
- Monitoreo de errores.
- Validacion con usuario funcional cuando aplique.

Para cambios criticos debera existir un responsable claramente identificado para confirmar el correcto funcionamiento de la solucion.

---

## 8. Checklists

### Checklist previo a PRO (POL-DEP §36 + CHECK, filtrado por rol)

#### Funcional
- [ ] Alcance validado.
- [ ] QA aprobado.
- [ ] STG aprobado.
- [ ] Pruebas funcionales completadas.
- [ ] Observaciones criticas cerradas.

#### Tecnico
- [ ] Version identificada.
- [ ] Codigo disponible.
- [ ] Dependencias verificadas.
- [ ] Integraciones verificadas.
- [ ] Configuraciones verificadas.
- [ ] Plan de rollback definido cuando aplique.
- [ ] Cobertura de codigo nuevo >= 70 % (SonarQube).
- [ ] Suite de evaluacion ADK en verde (`agents-cli eval run`).
- [ ] Dockerfile funcional con imagen AWS del Tech Lead.
- [ ] `sonar-project.properties` y `main.yml` configurados.
- [ ] `.gitignore` conforme a R10.

#### Operativo
- [ ] Fecha validada.
- [ ] Lunes habil o siguiente dia habil cuando corresponda.
- [ ] No existe freeze.
- [ ] No existe evento o restriccion institucional conocida.
- [ ] Responsables disponibles.
- [ ] Comunicacion realizada.

#### Post-despliegue
- [ ] Responsable de validacion identificado.
- [ ] Monitoreo definido.
- [ ] Validacion funcional definida.
- [ ] Registro de resultado.

#### Checklist por rol (CHECK)

**Desarrollador:**
- [ ] Variables de entorno configuradas; secretos no en codigo.
- [ ] Modo produccion activado.
- [ ] Backups automatizados (base de datos, archivos).
- [ ] Escalabilidad: balanceadores de carga configurados; autoescalado si aplica.
- [ ] Cache habilitado.
- [ ] Assets optimizados.
- [ ] Uso de HTTP/2 o HTTP/3.
- [ ] Base de datos: indices correctamente configurados; queries optimizados (evitar N+1); tiempo de respuesta bajo carga aceptable (<2 segundos).
- [ ] SEO basico (si aplica): indexacion, metatags, sitemap.xml, Google Analytics/GTM, Core Web Vitals.
- [ ] Cobertura de codigo nuevo >= 70 %.
- [ ] Contenedor Docker funcional y probado localmente.
- [ ] Pruebas funcionales exhaustivas previas al PR.

**Equipo QA:**
- [ ] Pruebas unitarias y de integracion ejecutadas y aprobadas.
- [ ] Pruebas de carga y estres para validar escalabilidad.
- [ ] Pruebas de compatibilidad (navegadores, moviles, SOs).
- [ ] Pruebas de usabilidad con usuarios reales.
- [ ] Pruebas de seguridad: penetracion o auditoria basica.
- [ ] Herramientas de monitoreo configuradas.
- [ ] Paginas de error personalizadas (404, 500, mantenimiento).
- [ ] Health checks para servicios criticos.
- [ ] Documentacion tecnica actualizada (APIs, arquitectura, MER).
- [ ] Manual de usuario o guias de inicio rapido.
- [ ] Procedimientos de despliegue (rollback, actualizaciones).

**DevOps:**
- [ ] HTTPS: certificado SSL/TLS instalado.
- [ ] Proteccion contra vulnerabilidades (SQL Injection, XSS, CSRF).
- [ ] Headers de seguridad configurados.
- [ ] Librerias/frameworks actualizados (sin vulnerabilidades conocidas).
- [ ] Autenticacion y autorizacion implementadas.
- [ ] Proteccion de APIs: rate limiting; tokens de acceso (JWT, OAuth) con expiracion; endpoints sensibles protegidos.
- [ ] Entregar disponibilidad de los datos al area de Analitica.
- [ ] Entorno de staging identico a produccion.
- [ ] CI/CD configurado.
- [ ] Plan de rollback en caso de fallo.
- [ ] DNS y redirecciones configuradas.

**Product Owner:**
- [ ] Politicas de privacidad y terminos de servicio visibles.
- [ ] Cookies: banner de consentimiento.
- [ ] Accesibilidad (WCAG 2.2; CHECK cita 2.1, se adopta 2.2 por R22).
- [ ] Licencias de terceros correctas.
- [ ] Notificaciones a usuarios sobre el lanzamiento.
- [ ] Canales de soporte activos.
- [ ] Changelog publico con novedades.
- [ ] Socializacion y transferencia de conocimiento con la EFI.

**Revision final (sin rol, CHECK §12):**
- [ ] Checklist firmada por el coordinador, el equipo de desarrollo, QA y DevOps.
- [ ] Prueba de humo (smoke test) en produccion.
- [ ] Verificacion de backups recientes.

**Extra: Contingencias:**
- [ ] Plan de respuesta ante incidentes (ej: caida de servidor).
- [ ] Equipo de guardia asignado para las primeras 24-48 horas.

### Checklist de Hotfix (POL-DEP §37)

- [ ] Existe un problema critico.
- [ ] El problema impide el correcto funcionamiento o uso normal de la solucion.
- [ ] Existe afectacion directa al usuario final.
- [ ] La funcionalidad afectada esta identificada.
- [ ] La solucion propuesta esta identificada.
- [ ] Se realizo evaluacion tecnica.
- [ ] Se realizaron pruebas minimas.
- [ ] Se evaluo el riesgo.
- [ ] Se definio rollback cuando sea viable.
- [ ] Existe responsable tecnico.
- [ ] Existe responsable de validacion posterior.
- [ ] El Coordinador de la Fabrica autorizo el tratamiento como Hotfix.

---

## 9. Matriz de autorizaciones (POL-DEP §28)

| Situacion | Tratamiento | Autorizacion |
|---|---|---|
| QA estandar | Flujo normal | Responsable del proceso |
| STG estandar | Flujo normal | Responsable correspondiente |
| PRO lunes habil | Flujo estandar | Segun control del proyecto |
| PRO siguiente dia habil cuando lunes es festivo | Flujo estandar | Segun control del proyecto |
| PRO en martes a viernes | Excepcion | Vicerrector de Servicios Digitales |
| PRO sabado, domingo o festivo | Excepcion | Autorizacion correspondiente |
| Hotfix critico | Excepcion especial | Coordinador de la Fabrica |
| Cambio no critico presentado como Hotfix | No aplica | Debe seguir flujo normal |
| Freeze institucional | Restringido | Segun condicion establecida |

**Nota:** la autorizacion de un Hotfix constituye una excepcion especifica por criticidad operativa y no debera utilizarse para reemplazar el mecanismo ordinario de autorizacion de cambios no criticos.

---

## 10. Matriz de calendario (POL-DEP §29)

| Ambiente | Dias estandar | Fin de semana | Festivos | Excepcion |
|---|---|---|---|---|
| QA | Dias habiles | No estandar | No estandar | Segun necesidad y autorizacion |
| STG | Dias habiles | No estandar | No estandar | Segun necesidad y autorizacion |
| PRO | Lunes habil | No | No | Si, segun autorizacion |
| PRO cuando lunes es festivo | Siguiente dia habil | No | No | Segun calendario |
| Hotfix critico | Segun criticidad | Puede requerir excepcion | Puede requerir excepcion | Coordinador Fabrica |

---

## 11. Reglas de programacion de PRO (POL-DEP §30)

1. El dia estandar de despliegue en PRO es **lunes habil**.
2. Si el lunes es festivo o no habil, el despliegue estandar podra realizarse el **siguiente dia habil**.
3. Martes, miercoles, jueves y viernes no hacen parte de la ventana estandar de PRO.
4. Sabados, domingos y festivos no hacen parte de la ventana estandar de despliegue.
5. Cualquier excepcion debera contar con la autorizacion correspondiente.
6. Los Hotfixes criticos constituyen una excepcion especial y podran recibir tratamiento extraordinario conforme a esta politica.
