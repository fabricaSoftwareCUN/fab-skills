# 13 - Politica de despliegue para aplicaciones backend

> Fuentes normativas:
> - [POL-DEP: POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001, v1.0)](https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU) (2026-09-14)
> - [PROC-DEP: Politica de despliegue para aplicaciones](https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw) (2026-09-14)
> - [CHECK: Checklist - Paso a produccion de App](https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP) (2026-05-21)
> - [VER: Politica de Versionamiento (v1.0.0)](https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC) (2025-12-09)
> - [STACK: Estandares, Arquitectura y Stack Tecnologico (v2.0)](https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ) (2026-07-29)
> - [INV: Lista de aplicaciones (inventario)](https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm)
>
> Fecha de alineacion: 2026-11-25.
>
> **Nota de precedencia:** PROC-DEP contiene un criterio de calendario anterior; gobierna POL-DEP (R1). La ventana de PRO es **lunes habil o siguiente dia habil**.

---

## 1. Flujo estandar y definiciones

### Flujo estandar

**DESARROLLO -> QA -> STG -> PRO**

Cada transicion debe cumplir las condiciones establecidas para el ambiente correspondiente. El avance entre ambientes no debe realizarse unicamente por disponibilidad tecnica; tambien deben cumplirse las condiciones funcionales, tecnicas y de negocio.

### Definiciones (POL-DEP §3)

- **Desarrollo:** ambiente o etapa en la cual se construyen, modifican o corrigen los componentes de software.
- **QA:** ambiente destinado a realizar pruebas tecnicas y funcionales sobre los cambios desarrollados. Su proposito principal es identificar errores antes de avanzar a un ambiente de validacion integral.
- **STG:** ambiente de staging o preproduccion, utilizado para realizar validaciones integrales de la solucion antes de su paso a produccion. Debe representar, en la medida de lo posible, las condiciones relevantes del ambiente productivo.
- **PRO:** ambiente de produccion, donde se encuentra disponible la solucion para los usuarios finales y donde cualquier cambio puede generar impacto sobre la operacion institucional.
- **Despliegue:** actividad mediante la cual una version, componente, configuracion o cambio de software es trasladado de un ambiente a otro.
- **Rollback:** procedimiento mediante el cual se revierte un despliegue a una version previamente estable cuando el nuevo cambio genera una afectacion no controlada.
- **Hotfix:** correccion excepcional destinada a solucionar un **problema critico que impide el correcto funcionamiento de una solucion o afecta directamente la utilizacion normal de la misma por parte del usuario final**. Un Hotfix tiene como finalidad recuperar o mantener la operacion correcta de una funcionalidad existente.
- **Despliegue urgente:** cambio que requiere atencion prioritaria por circunstancias particulares, pero que no necesariamente cumple las condiciones de criticidad establecidas para un Hotfix.
- **Ventana de despliegue:** periodo autorizado para ejecutar despliegues en un ambiente determinado.
- **Freeze o congelamiento:** periodo durante el cual se restringen o suspenden despliegues debido a eventos institucionales, auditorias, actividades criticas, cierres operativos, riesgos tecnologicos u otras circunstancias previamente identificadas.

### No se considera Hotfix (POL-DEP §3.7)

- Una nueva funcionalidad.
- Una mejora funcional.
- Un cambio de diseno.
- Un ajuste estetico.
- Un cambio de alcance.
- Una optimizacion que no sea critica.
- Una solicitud de conveniencia.
- Una modificacion solicitada para acelerar una entrega.
- Un desarrollo que pueda esperar el ciclo normal de despliegue.

---

## 2. Modelo de ramas y versionamiento (R4-R8)

### Ramas principales (VER §5.1)

| Rama | Ambiente | Proposito | Version |
|---|---|---|---|
| `develop` | Desarrollo (DEV) | Integracion de todas las features. Base para `qa`. | `-alpha` |
| `qa` | Pruebas (QA) | Version estable para el equipo de QA. | `-beta` |
| `stg` | Staging (STG) | Clon de produccion para pruebas finales y DevOps checklist. | `-rc.N` |
| `main` | Produccion (PRO) | Solo codigo de produccion. Solo merge desde `stg` o `hotfix`. | Estable `X.Y.Z` |

### Ramas efimeras (VER §5.2, R5, R6)

| Tipo | Convencion | Origen | Retorno |
|---|---|---|---|
| `feature` | `feature/<ID_HU>-<slug-kebab>` | `develop` | `develop` |
| `bugfix` | `bugfix/<ID_HU>-<slug-kebab>` | `develop` | `develop` |
| `hotfix` | `hotfix/<ID_HU>-<slug-kebab>` | `main` | `main` **y** `develop` |
| `refactor` | `refactor/<ID_HU>-<slug-kebab>` | `develop` | `develop` |
| `docs` | `docs/<ID_HU>-<slug-kebab>` | `develop` | `develop` |
| `style` | `style/<ID_HU>-<slug-kebab>` | `develop` | `develop` |
| `test` | `test/<ID_HU>-<slug-kebab>` | `develop` | `develop` |
| `chore` | `chore/<ID_HU>-<slug-kebab>` | `develop` | `develop` |
| `config` | `config/<ID_HU>-<slug-kebab>` | `develop` | `develop` |

Tipos adicionales y equivalencias (R5): `epic` -> `feature`; `fix`, `bug`, `improve` -> `bugfix`.

Ejemplo: `feature/HU-123-login-google`.

### Promocion (VER §5.3, R6)

El flujo de codigo siempre es progresivo y unidireccional:

- Feature/Bugfix -> `develop` (Pull Request).
- `develop` -> `qa` (Integracion para pruebas).
- `qa` -> `stg` (Candidato a lanzamiento).
- `stg` -> `main` (Lanzamiento de produccion).

Ramas permanentes protegidas, sin commits directos. Rama efimera se elimina tras el merge.

### Requisitos de PR (R7)

- Al menos un revisor del equipo.
- Tech Lead obligatorio en cambios de arquitectura y en todo PR hacia `stg` y `main`.
- CI en verde (lint, unitarias, SonarQube).
- Descripcion con el que y el porque, enlazada a la HU.
- DevOps verifica el checklist antes de `stg` y `main`.

### Versionamiento SemVer (VER §1-#4, R8)

- Formato: **MAYOR.MENOR.PARCHE** (`X.Y.Z`).
- **MAYOR (X.0.0):** cambios que rompen compatibilidad.
- **MENOR (0.X.0):** funcionalidades compatibles.
- **PARCHE (0.0.X):** correcciones de errores.
- Sufijos por rama: `-alpha` en `develop`, `-beta` en `qa`, `-rc.N` en `stg`, estable en `main`.
- Proyecto nuevo inicia en `0.1.0`; primer release publico `1.0.0`.
- Tag `vX.Y.Z` en `main` creado automaticamente por CI al hacer merge desde `stg` o `hotfix`.
- `CHANGELOG.md` en formato Keep a Changelog.

### Responsabilidades (VER §9)

- **Desarrolladores:** asegurar incrementos correctos, actualizar el CHANGELOG y seguir el flujo de Pull Requests (PRs) a las ramas correctas.
- **Lider Tecnico:** validar cambios MAYOR y aprobar releases (PRs a `STG` y `MAIN`).
- **QA:** verificar versiones pre-release (`-alpha`, `-beta` en `Develop` y `QA`).
- **DevOps:** verificar checklist antes de subir los cambios a `STG` y `MAIN`.

---

## 3. Requisitos tecnicos obligatorios antes de solicitar despliegue

### Dockerfile (PROC-DEP)

- `Dockerfile` funcional y probado, usando la imagen publica de AWS suministrada por el **Tech Lead**.
- Build multi-etapa para reducir el tamano de la imagen final.
- Proyectos con conexion a **Oracle**: incluir `instant-client` en el Dockerfile y apuntar el host al DNS `cundb01`.

```dockerfile
# Stage 1: build
FROM <imagen-publica-aws-tech-lead> AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: runtime
FROM <imagen-publica-aws-tech-lead> AS runtime
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist

# Solo si el proyecto conecta a Oracle
RUN apt-get update && apt-get install -y libaio1 && \
    # Instalar Oracle Instant Client
    ...

ENV ORACLE_HOST=cundb01

EXPOSE 3000
CMD ["node", "dist/main"]
```

### CI/CD y calidad (PROC-DEP, R9)

- `sonar-project.properties` presente.
- `main.yml` (GitHub Actions) con lint, unitarias con cobertura y analisis SonarQube.
- Gate bloqueante: **70 % de cobertura en codigo nuevo** (SonarQube).
- Objetivo recomendado del equipo: **85 % global** en lineas y ramas.

Ejemplo minimo de `main.yml`:

```yaml
name: CI/CD Backend

on:
  push:
    branches: [develop, qa, stg, main]
  pull_request:
    branches: [develop, qa, stg, main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '26'
      - run: npm ci
      - run: npm run lint

  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '26'
      - run: npm ci
      - run: npm run test:cov

  sonarqube:
    runs-on: ubuntu-latest
    needs: [lint, unit-tests]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '26'
      - run: npm ci
      - run: npm run test:cov
      - name: SonarQube Scan
        uses: SonarSource/sonarqube-scan-action@v2
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

  docker-build:
    runs-on: ubuntu-latest
    needs: [sonarqube]
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t ${{ github.event.repository.name }}:latest .

  tag-release:
    runs-on: ubuntu-latest
    needs: [docker-build]
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Get version from package.json
        id: version
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT
      - name: Create tag v${version}
        run: |
          git tag v${{ steps.version.outputs.version }}
          git push origin v${{ steps.version.outputs.version }}
```

Ejemplo minimo de `sonar-project.properties`:

```properties
sonar.projectKey=mi-proyecto-back
sonar.projectName=Mi Proyecto Backend
sonar.projectVersion=1.0.0
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts
sonar.exclusions=**/*.spec.ts,**/node_modules/**
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.coverage.exclusions=**/*.spec.ts,**/*.module.ts,src/main.ts
sonar.typescript.tsconfigPaths=tsconfig.json
```

### .gitignore (R10)

```gitignore
# Politica de despliegue CUN
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
- Nunca en el repositorio.
- Se envian como adjunto `.txt` con tres bloques: `ENVS NUEVAS`, `ENVS MODIFICADAS`, `ENVS ELIMINADAS`.
- Backend: validacion al arranque con `@nestjs/config` + clase de validacion con `class-validator`/`class-transformer`.

### Inventario (INV)

- El enlace al **Swagger** de la aplicacion debe estar registrado en el [inventario de aplicaciones](https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm).
- El inventario debe estar actualizado para agilizar despliegue y pruebas.

### Observabilidad (R12)

- Endpoint `GET /metrics` con Prometheus (cuatro senales de oro + metricas de negocio).
- Grafana para visualizacion.
- Health check endpoint para servicios criticos.

---

## 4. Condiciones por ambiente (POL-DEP §6-§8)

### QA (POL-DEP §6)

**Condiciones para desplegar en QA:**

- Version o cambio identificado.
- Desarrollo finalizado para el alcance correspondiente.
- Informacion minima para realizar las pruebas.
- Identificacion de funcionalidades modificadas.
- Responsable tecnico.
- Responsable funcional cuando aplique.

**Validaciones en QA:**

- Pruebas funcionales, tecnicas, de integracion.
- Validacion de errores, formularios, permisos, servicios, APIs.
- Pruebas de regresion.
- Validaciones de interfaz.
- Pruebas basicas de rendimiento cuando aplique.

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

**Validaciones en STG:**

- Pruebas integrales.
- Validacion de procesos completos.
- Validacion con integraciones.
- Validacion funcional, de datos, de permisos.
- Validacion de comunicaciones entre sistemas.
- Pruebas de regresion.
- Validaciones de negocio.
- Validaciones finales previas a produccion.

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

## 5. Calendario (R1, POL-DEP §9-§10)

### QA

Despliegues a QA: dias habiles, segun la planificacion del proyecto y disponibilidad de los responsables.

### STG

Despliegues a STG: dias habiles, teniendo en cuenta las actividades de validacion requeridas.

### PRO

Despliegues estandar a PRO: **unicamente los dias lunes habiles**.

Cuando el lunes sea un dia no habil debido a festivo u otra condicion institucional, el despliegue podra programarse para el **siguiente dia habil**.

**No se considera parte de la ventana estandar de produccion:**

- Martes.
- Miercoles.
- Jueves.
- Viernes.
- Sabados.
- Domingos.
- Festivos.

Los despliegues realizados fuera de esta ventana deberan tratarse como una excepcion.

### Fines de semana y festivos (POL-DEP §10)

No se realizaran despliegues programados en sabados, domingos ni festivos. Cualquier despliegue requerido durante estos periodos debera corresponder a una situacion excepcional debidamente justificada y autorizada. Los Hotfix criticos podran recibir un tratamiento excepcional.

---

## 6. Excepciones, hotfix, freeze y bloqueo

### Excepciones al calendario de PRO (POL-DEP §11)

Cualquier despliegue a PRO fuera del lunes habil o del siguiente dia habil requiere justificacion y autorizacion previa del **Vicerrector de Servicios Digitales**.

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

### Hotfix - Tratamiento especial (POL-DEP §12)

**Condicion de criticidad:** un Hotfix unicamente podra clasificarse como tal cuando exista un **problema critico que impida el correcto funcionamiento de la solucion o afecte directamente la utilizacion normal de esta por parte del usuario final**. La criticidad debera poder demostrarse mediante un impacto operativo verificable.

**Situaciones que pueden justificar un Hotfix:**

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

**Autorizacion de Hotfix:** el **Coordinador de la Fabrica de Software** podra aprobar el tratamiento como Hotfix. Esta autorizacion constituye una **excepcion especial al ciclo y ventana ordinaria de despliegue**.

La autorizacion del Hotfix no elimina la obligacion de:

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

**Incidente critico -> Identificacion -> Evaluacion tecnica -> Validacion de criticidad -> Clasificacion como Hotfix -> Aprobacion del Coordinador -> Correccion -> Pruebas minimas -> Despliegue -> Validacion en PRO -> Monitoreo -> Documentacion y cierre.**

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

## 7. Proceso de solicitud por correo (PROC-DEP)

### Primera vez (implementacion de ambiente nuevo)

Enviar **correo electronico** que incluya:

- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno (adjunto `.txt` con los tres bloques).
- Ambiente destino.
- Requisitos tecnicos (Oracle, Redis, etc.).
- Enlace del Pull Request (PR).

### Despliegues subsiguientes

Correo con:

- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno (adjunto `.txt` solo si requieren creacion o modificacion).
- Enlace del Pull Request (PR) hacia la rama del ambiente destino.
- Ambiente destino.
- Descripcion de cambios.
- Version a desplegar (obligatorio para produccion).

### Formato de envio de variables de entorno (R11)

Todas las variables de entorno requeridas deben enviarse exclusivamente mediante un archivo adjunto de texto plano (`.txt`) estructurado bajo las siguientes tres categorias:

```text
ENVS NUEVAS:
NOMBRE_VARIABLE_1=valor_1
NOMBRE_VARIABLE_2=valor_2

ENVS MODIFICADAS:
NOMBRE_VARIABLE_EXISTENTE=nuevo_valor

ENVS ELIMINADAS:
NOMBRE_VARIABLE_A_REMOVER
```

### Reglas por ambiente (R2)

| Ambiente | Proceso |
|---|---|
| DEV, QA, STG | Solicitud directa al **Tech Lead** |
| PRO lunes habil | Copiar al **QA** en el correo. Requiere **respuesta de aprobacion** del QA en el mismo hilo. Checklist aprobado por el Tech Lead, o solicitud directa del Coordinador por el canal debido. |
| PRO martes a viernes | Excepcion autorizada por el **Vicerrector de Servicios Digitales** |
| PRO sabado, domingo o festivo | Excepcion con **autorizacion correspondiente** (bajo la autorizacion general del Vicerrector para toda excepcion al calendario, POL-DEP §11) |
| Hotfix PRO | Puede ser aprobado directamente por el **Coordinador de la Fabrica de Software** |

### Horario de solicitud (R25)

- Las solicitudes se envian en **dia habil entre las 8:00 y las 17:00** (PROC-DEP).
- Tiempos orientativos de atencion:
  - DEV, QA y STG: de **1 h a 36 h**.
  - PRO: de **2 h a 24 h**.
- La **ejecucion** en PRO se programa siempre segun R1 (lunes habil o siguiente dia habil); la hora exacta se define por caso (POL-DEP §19).
- Despues de un despliegue a PRO, el desarrollador debe validar que la funcionalidad este completa y exitosa; cualquier novedad se reporta inmediatamente al DevOps encargado.

---

## 8. Rollback y validacion posterior a PRO

### Rollback (POL-DEP §20)

Cuando tecnicamente sea viable, los despliegues deben contar con una estrategia de rollback.

El rollback podra ejecutarse cuando:

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
- Monitoreo de errores (Prometheus/Grafana).
- Validacion con usuario funcional cuando aplique.

Para cambios criticos debera existir un responsable claramente identificado para confirmar el correcto funcionamiento de la solucion.

---

## 9. Checklist previo a PRO y checklist de hotfix

### Checklist previo a PRO (POL-DEP §36 + CHECK por rol)

#### Funcional

- [ ] Alcance validado.
- [ ] QA aprobado.
- [ ] STG aprobado.
- [ ] Pruebas funcionales completadas.
- [ ] Observaciones criticas cerradas.

#### Tecnico

- [ ] Version identificada (SemVer).
- [ ] Codigo disponible.
- [ ] Dependencias verificadas.
- [ ] Integraciones verificadas.
- [ ] Configuraciones verificadas.
- [ ] Plan de rollback definido cuando aplique.
- [ ] Cobertura de codigo nuevo >= 70 % (SonarQube).

> Nota: segun R4, el codigo de PRO vive en la rama `main`.

#### Operativo

- [ ] Fecha validada (lunes habil o siguiente dia habil).
- [ ] No existe freeze.
- [ ] No existe evento o restriccion institucional conocida.
- [ ] Responsables disponibles.
- [ ] Comunicacion realizada.

#### Post-despliegue

- [ ] Responsable de validacion identificado.
- [ ] Monitoreo definido (Prometheus/Grafana).
- [ ] Validacion funcional definida.
- [ ] Registro de resultado.

#### Desarrollador (CHECK §1-#3)

- [ ] Variables de entorno: configuraciones sensibles (API keys, BD) no en codigo.
- [ ] Modo produccion activado.
- [ ] Backups automatizados: base de datos, archivos estaticos.
- [ ] Cache habilitado (Redis).
- [ ] Base de datos: indices correctamente configurados, queries optimizados (evitar N+1).
- [ ] Tiempo de respuesta bajo carga aceptable (< 2 segundos).
- [ ] Cobertura de codigo nuevo >= 70 % (SonarQube).
- [ ] Contenedor Docker funcional probado localmente.

#### QA (CHECK §5-#7)

- [ ] Pruebas unitarias y de integracion ejecutadas y aprobadas.
- [ ] Pruebas de carga y estres para validar escalabilidad.
- [ ] Pruebas de seguridad: penetracion o auditoria basica.
- [ ] Herramientas de monitoreo: Prometheus/Grafana configurados.
- [ ] Logs centralizados.
- [ ] Alertas para caidas o errores criticos.
- [ ] Health checks para servicios criticos.
- [ ] Documentacion tecnica actualizada (APIs, arquitectura, MER).
- [ ] Manual de usuario o guias de inicio rapido.
- [ ] Procedimientos de despliegue (rollback, actualizaciones).

#### DevOps (CHECK §8-#9)

- [ ] HTTPS: certificado SSL/TLS instalado y configurado.
- [ ] Proteccion contra vulnerabilidades: validacion de entradas, headers de seguridad.
- [ ] Librerias/frameworks actualizados (sin vulnerabilidades conocidas).
- [ ] Autenticacion y autorizacion: contrasenas con hash seguro, roles y permisos.
- [ ] Mecanismos de recuperacion de contrasena seguros.
- [ ] Proteccion de APIs: rate limiting, tokens con expiracion, endpoints sensibles protegidos.
- [ ] Entregar disponibilidad de los datos al area de Analitica.
- [ ] Entorno de staging identico a produccion.
- [ ] CI/CD configurado (GitHub Actions).
- [ ] Plan de rollback en caso de fallo.
- [ ] DNS y redirecciones configuradas correctamente.

#### Product Owner (CHECK §10-#12)

- [ ] Politicas de privacidad y terminos de servicio visibles.
- [ ] Accesibilidad (WCAG 2.2; CHECK cita 2.1, se adopta 2.2 por R22).
- [ ] Licencias: uso correcto de software de terceros.
- [ ] Notificaciones a usuarios sobre el lanzamiento.
- [ ] Canales de soporte activos.
- [ ] Changelog publico con novedades y correcciones.
- [ ] Socializacion y transferencia de conocimiento con la EFI.

#### Revision final (CHECK §12, sin rol especifico)

- [ ] Checklist firmada por el coordinador, desarrollo, QA y DevOps.
- [ ] Prueba de humo (smoke test) en produccion.
- [ ] Verificacion de backups recientes.

#### Extra: Contingencias (CHECK)

- [ ] Plan de respuesta ante incidentes (ej: caida de servidor).
- [ ] Equipo de guardia asignado para las primeras 24-48 horas.

### Checklist de hotfix (POL-DEP §37)

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

## 10. Matriz de autorizaciones y matriz de calendario

### Matriz de autorizaciones (POL-DEP §28, R2)

| Situacion | Tratamiento | Autorizacion |
|---|---|---|
| QA estandar | Flujo normal | Responsable del proceso |
| STG estandar | Flujo normal | Responsable correspondiente |
| PRO lunes habil | Flujo estandar | Segun control del proyecto (aprobacion QA en hilo + checklist Tech Lead) |
| PRO siguiente dia habil cuando lunes es festivo | Flujo estandar | Segun control del proyecto |
| PRO en martes a viernes | Excepcion | Vicerrector de Servicios Digitales |
| PRO sabado, domingo o festivo | Excepcion | Autorizacion correspondiente |
| Hotfix critico | Excepcion especial | Coordinador de la Fabrica |
| Cambio no critico presentado como Hotfix | No aplica | Debe seguir flujo normal |
| Freeze institucional | Restringido | Segun condicion establecida |

### Matriz de calendario (POL-DEP §29)

| Ambiente | Dias estandar | Fin de semana | Festivos | Excepcion |
|---|---|---|---|---|
| QA | Dias habiles | No estandar | No estandar | Segun necesidad y autorizacion |
| STG | Dias habiles | No estandar | No estandar | Segun necesidad y autorizacion |
| PRO | Lunes habil | No | No | Si, segun autorizacion |
| PRO cuando lunes es festivo | Siguiente dia habil | No | No | Segun calendario |
| Hotfix critico | Segun criticidad | Puede requerir excepcion | Puede requerir excepcion | Coordinador Fabrica |

### Regla de programacion de PRO (POL-DEP §30)

1. El dia estandar de despliegue en PRO es **lunes habil**.
2. Si el lunes es festivo o no habil, el despliegue estandar podra realizarse el **siguiente dia habil**.
3. Martes, miercoles, jueves y viernes no hacen parte de la ventana estandar de PRO.
4. Sabados, domingos y festivos no hacen parte de la ventana estandar de despliegue.
5. Cualquier excepcion debera contar con la autorizacion correspondiente.
6. Los Hotfix criticos constituyen una excepcion especial y podran recibir tratamiento extraordinario conforme a esta politica.

---

## Checklist rapido pre-despliegue backend

- [ ] `Dockerfile` funcional con imagen AWS del Tech Lead, build multi-etapa.
- [ ] Oracle: `instant-client` incluido, host apuntando a `cundb01` (si aplica).
- [ ] `sonar-project.properties` presente.
- [ ] `main.yml` de CI/CD presente (lint, unitarias, SonarQube, Docker build, tag en `main`).
- [ ] `.gitignore` conforme a R10 (`docker-compose.yml`, `docker-compose.*.yml`, `compose.yml`, `compose.*.yml`, `*.sh`, `.env`, `.env.*`).
- [ ] Variables de entorno sanitizadas y enviadas como adjunto `.txt` con los tres bloques.
- [ ] Codigo en la rama correcta segun el ambiente (`develop`/`qa`/`stg`/`main`).
- [ ] PR creado hacia la rama destino.
- [ ] Swagger registrado en inventario de aplicaciones.
- [ ] Endpoint `/metrics` expuesto con Prometheus.
- [ ] Health check endpoint disponible.
- [ ] Cobertura de codigo nuevo >= 70 % (gate SonarQube).
- [ ] Checklist de paso a produccion aprobado (solo para PRO).
