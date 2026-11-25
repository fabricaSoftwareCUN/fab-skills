# 09 - Politica de despliegue para aplicaciones frontend

> Fuentes normativas: POL-DEP (POLITICA DE DESPLIEGUES DE SOFTWARE, POL-FSW-DEP-001, v1.0, 2026-09-14), PROC-DEP (Politica de despliegue para aplicaciones, 2026-09-14), VER (Politica de Versionamiento, v1.0.0, 2025-12-09), CHECK (Checklist - Paso a produccion de App, 2026-05-21), QA-MET (QA: Metodologia de Trabajo, 2026-07-30), STACK (Estandares, Arquitectura y Stack Tecnologico, v2.0, 2026-07-29), INV (Lista de aplicaciones).
>
> Fecha de alineacion: 2026-11-25.
>
> **Precedencia**: la normativa Outline gobierna despliegue, ramas, versiones, cobertura y estructura. La skill `front-angular-fab` gobierna unicamente lo que la normativa Outline no regula. Si el desarrollador tiene acceso a Outline y detecta una version posterior, manda Outline y se abre una tarea para actualizar esta referencia.

---

## 1. Fuentes normativas

| Codigo | Documento | URL | Ultima edicion |
|---|---|---|---|
| POL-DEP | POLITICA DE DESPLIEGUES DE SOFTWARE (POL-FSW-DEP-001, v1.0) | https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU | 2026-09-14 |
| PROC-DEP | Politica de despliegue para aplicaciones | https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw | 2026-11-25 |
| VER | Politica de Versionamiento (v1.0.0) | https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC | 2025-12-09 |
| CHECK | Checklist - Paso a produccion de App | https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP | 2026-05-21 |
| QA-MET | QA: Metodologia de Trabajo | https://vsdocs.cunapp.pro/doc/qa-metodologia-de-trabajo-JGQS4SnlYm | 2026-07-30 |
| STACK | Estandares, Arquitectura y Stack Tecnologico (v2.0) | https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ | 2026-07-29 |
| INV | Lista de aplicaciones (inventario) | https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm | — |

---

## 2. Flujo estandar y definiciones

### Flujo estandar

El flujo estandar de despliegue es:

**DESARROLLO -> QA -> STG -> PRO**

Cada transicion debe cumplir las condiciones establecidas para el ambiente correspondiente. El avance entre ambientes no se realiza unicamente por disponibilidad tecnica; tambien deben cumplirse las condiciones funcionales, tecnicas y de negocio.

### Definiciones (POL-DEP 3.x)

- **Desarrollo (3.1)**: ambiente o etapa en la cual se construyen, modifican o corrigen los componentes de software.
- **QA (3.2)**: ambiente destinado a pruebas tecnicas y funcionales. Su proposito es identificar errores antes de avanzar a un ambiente de validacion integral.
- **STG (3.3)**: ambiente de staging o preproduccion, utilizado para validaciones integrales antes del paso a PRO. Debe representar, en la medida de lo posible, las condiciones relevantes del ambiente productivo.
- **PRO (3.4)**: ambiente de produccion, donde la solucion esta disponible para los usuarios finales y cualquier cambio puede generar impacto sobre la operacion institucional.
- **Despliegue (3.5)**: actividad mediante la cual una version, componente, configuracion o cambio de software es trasladado de un ambiente a otro.
- **Rollback (3.6)**: procedimiento mediante el cual se revierte un despliegue a una version previamente estable cuando el nuevo cambio genera una afectacion no controlada.
- **Hotfix (3.7)**: correccion excepcional destinada a solucionar un problema critico que impide el correcto funcionamiento de una solucion o afecta directamente la utilizacion normal de la misma por parte del usuario final. Un Hotfix tiene como finalidad recuperar o mantener la operacion correcta de una funcionalidad existente.
  - **No se considera Hotfix**: una nueva funcionalidad, una mejora funcional, un cambio de diseno, un ajuste estetico, un cambio de alcance, una optimizacion que no sea critica, una solicitud de conveniencia, una modificacion solicitada para acelerar una entrega, un desarrollo que pueda esperar el ciclo normal de despliegue.
- **Despliegue urgente (3.8)**: cambio que requiere atencion prioritaria por circunstancias particulares, pero que no necesariamente cumple las condiciones de criticidad establecidas para un Hotfix. Su tratamiento se sujeta al esquema de autorizaciones establecido.
- **Ventana de despliegue (3.9)**: periodo autorizado para ejecutar despliegues en un ambiente determinado.
- **Freeze o congelamiento (3.10)**: periodo durante el cual se restringen o suspenden despliegues debido a eventos institucionales, auditorias, actividades criticas, cierres operativos, riesgos tecnologicos u otras circunstancias previamente identificadas.

---

## 3. Modelo de ramas y versionamiento

### Ramas por ambiente (R4, VER 5.1)

| Rama | Ambiente | Proposito | Version |
|---|---|---|---|
| `develop` | Desarrollo (DEV) | Integracion de todas las features. Base para `qa`. | `-alpha` |
| `qa` | Pruebas (QA) | Version estable para el equipo de QA. | `-beta` |
| `stg` | Staging (STG) | Clon de produccion para pruebas finales y checklist DevOps. | `-rc.N` |
| `main` | Produccion (PRO) | Solo codigo de produccion. Solo merge desde `stg` o `hotfix`. | `X.Y.Z` estable |

### Ramas efimeras (R5, R6, VER 5.2)

| Tipo | Convencion | Origen | Retorno | Proposito |
|---|---|---|---|---|
| `feature` | `feature/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Nuevas funcionalidades (MENOR o MAYOR) |
| `bugfix` | `bugfix/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Correcciones menores del ciclo actual |
| `hotfix` | `hotfix/<ID_HU>-<slug-kebab>` | `main` | `main` y `develop` | Correcciones criticas en produccion (PARCHE) |
| `refactor` | `refactor/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Reestructuracion sin nuevas funcionalidades |
| `docs` | `docs/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Documentacion |
| `style` | `style/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Estilos y correcciones menores visuales |
| `test` | `test/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Pruebas nuevas o modificadas |
| `chore` | `chore/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Mantenimiento de dependencias |
| `config` | `config/<ID_HU>-<slug-kebab>` | `develop` | `develop` | Configuracion y variables de entorno |

Ejemplo: `feature/HU-123-login-google`.

Equivalencias (R5): `epic` -> `feature`; `fix`, `bug`, `improve` -> `bugfix`.

### Promocion (R6, VER 5.3)

El flujo de codigo es progresivo y unidireccional, siempre por Pull Request:

1. `feature/bugfix/...` -> `develop` (PR)
2. `develop` -> `qa` (PR)
3. `qa` -> `stg` (PR)
4. `stg` -> `main` (PR)

Ramas permanentes protegidas, sin commits directos. Rama efimera se elimina tras el merge.

### Requisitos de PR (R7)

- Al menos un revisor del equipo.
- Tech Lead obligatorio en cambios de arquitectura y en todo PR hacia `stg` y `main`.
- CI en verde (lint, unitarias, SonarQube).
- Descripcion con el que y el porque, enlazada a la HU.
- DevOps verifica el checklist antes de `stg` y `main`.

### Versionamiento (R8, VER 1-4)

- Formato: SemVer `X.Y.Z` (MAYOR.MENOR.PARCHE).
- **MAYOR (X.0.0)**: cambios que rompen compatibilidad. Reinicia MENOR y PARCHE a 0.
- **MENOR (0.X.0)**: funcionalidades compatibles. Reinicia PARCHE a 0.
- **PARCHE (0.0.X)**: correcciones sin afectar funcionalidades.
- Sufijos por rama: `-alpha` en `develop`, `-beta` en `qa`, `-rc.N` en `stg`, estable en `main`.
- Proyecto nuevo inicia en `0.1.0`; primer release publico `1.0.0`.
- Tag `vX.Y.Z` en `main` creado automaticamente por CI al hacer merge desde `stg` o `hotfix`.
- `CHANGELOG.md` en formato Keep a Changelog.

### Responsabilidades (VER 9)

- **Desarrolladores**: incrementos correctos, actualizar CHANGELOG, PRs a las ramas correctas.
- **Lider Tecnico**: validar cambios MAYOR y aprobar releases (PRs a `stg` y `main`).
- **QA**: verificar versiones pre-release (`-alpha`, `-beta` en `develop` y `qa`).
- **DevOps**: verificar checklist antes de subir a `stg` y `main`.

---

## 4. Requisitos tecnicos obligatorios antes de solicitar despliegue

### Dockerfile (PROC-DEP)

El proyecto debe contar con un `Dockerfile` funcional y probado, usando la imagen publica de AWS suministrada por el **Tech Lead**.

```dockerfile
# Dockerfile frontend Angular — build multi-etapa
# El Tech Lead proporciona ambas imagenes publicas AWS
FROM <imagen-aws-node-tech-lead> AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NG_APP_API_URL
ENV NG_APP_API_URL=$NG_APP_API_URL
# Un ARG/ENV por cada variable NG_APP_*
RUN npm run build -- --configuration production

FROM <imagen-aws-nginx-tech-lead> AS runtime
COPY --from=build /app/dist/<nombre-proyecto>/browser /usr/share/nginx/html/
EXPOSE 80
```

### SonarQube (PROC-DEP)

`sonar-project.properties` en la raiz:

```properties
sonar.projectKey=<proyecto>-front
sonar.projectName=<Proyecto> Frontend
sonar.projectVersion=1.0.0
sonar.sourceEncoding=UTF-8
sonar.sources=src
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.spec.ts,**/*.mock.ts
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.tsconfigPaths=tsconfig.json
```

### main.yml (GitHub Actions)

```yaml
name: CI/CD Frontend

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
          node-version: 26
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 26
      - run: npm ci
      - run: npm run test:coverage

  sonarqube:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 26
      - run: npm ci
      - run: npm run test:coverage
      - uses: sonarsource/sonarqube-scan-action@v2
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

  build:
    runs-on: ubuntu-latest
    needs: [sonarqube]
    env:
      NG_APP_API_URL: ${{ vars.NG_APP_API_URL }}
      NG_APP_GA_ID: ${{ vars.NG_APP_GA_ID }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 26
      - run: npm ci
      - run: node scripts/set-envs.mjs --check
      - run: npm run build -- --configuration production

  e2e:
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 26
      - run: npm ci
      - uses: cypress-io/github-action@v6
        with:
          start: npx ng serve --configuration production
          wait-on: http://localhost:4200
          run: npx cypress run

  docker:
    runs-on: ubuntu-latest
    needs: [e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - run: docker build --build-arg NG_APP_API_URL=${{ vars.NG_APP_API_URL }} --build-arg NG_APP_GA_ID=${{ vars.NG_APP_GA_ID }} -t <proyecto>-front:${{ github.sha }} .
      # Un --build-arg por cada variable NG_APP_*

  tag:
    runs-on: ubuntu-latest
    needs: [docker]
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Create version tag
        run: |
          VERSION=$(node -p "require('./package.json').version")
          git tag "v${VERSION}"
          git push origin "v${VERSION}"
```

### .gitignore (R10)

```gitignore
# Politica de despliegue CUN — R10
docker-compose.yml
docker-compose.*.yml
compose.yml
compose.*.yml
*.sh
.env
.env.*
!.env.example
# Environments generados por npm run envs
src/environments/environment.ts
src/environments/environment.prod.ts
```

### Variables de entorno (R11)

- Angular usa environments generados por `npm run envs`; solo variables publicas `NG_APP_*` (R28). Los archivos `environment.ts` y `environment.prod.ts` no se versionan.
- Variables de contenedor/CI en formato `SNAKE_CASE`, sin espacios, sin comillas innecesarias, ordenadas por categoria.
- Envio como adjunto `.txt` con tres bloques:

```text
ENVS NUEVAS:
NOMBRE_VARIABLE_1=valor_1
NOMBRE_VARIABLE_2=valor_2

ENVS MODIFICADAS:
NOMBRE_VARIABLE_EXISTENTE=nuevo_valor

ENVS ELIMINADAS:
NOMBRE_VARIABLE_A_REMOVER
```

- Nunca en el repositorio.

### Inventario (INV)

La URL del frontend debe estar registrada en el inventario de aplicaciones: https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm. El inventario debe estar actualizado para agilizar despliegue y pruebas.

### Observabilidad (R12)

- Frontend: eventos de telemetria (Google Analytics / GTM) y Core Web Vitals conforme a STACK 7.3 y CHECK 4.
- Servicio de telemetria en `core/services/telemetry.service.ts`.

---

## 5. Condiciones por ambiente (POL-DEP 6-8)

### QA (POL-DEP 6)

**Condiciones para desplegar en QA**: version o cambio identificado, desarrollo finalizado para el alcance, informacion minima para pruebas, identificacion de funcionalidades modificadas, responsable tecnico, responsable funcional cuando aplique.

**Validaciones en QA**: pruebas funcionales, tecnicas, de integracion, validacion de errores, formularios, permisos, servicios, APIs, regresion, validaciones de interfaz, pruebas basicas de rendimiento cuando aplique.

**Resultado de QA (POL-DEP 6.4)**: `Aprobado` (avanza a STG), `Aprobado con observaciones` (avanza si las observaciones no representan riesgo y existe aprobacion), `Rechazado` (retorna a desarrollo).

> R23: `Aprobado` / `Aprobado con observaciones` / `Rechazado` se aplica unicamente a los resultados de los ambientes QA y STG. No se aplica al handoff de features.

### STG (POL-DEP 7)

**Condiciones para desplegar en STG**: resultado satisfactorio de QA, version identificada, alcance definido, correcciones criticas de QA solucionadas, evidencia de pruebas cuando aplique, responsables de validacion identificados.

**Validaciones en STG**: pruebas integrales, validacion de procesos completos, integraciones, funcional, datos, permisos, comunicaciones entre sistemas, regresion, validaciones de negocio, validaciones finales previas a produccion.

**Resultado de STG (POL-DEP 7.4)**: `Aprobado` (habilita programacion para PRO), `Aprobado con observaciones` (requiere evaluacion del riesgo y aceptacion), `Rechazado` (retorna al ciclo de correccion).

### PRO (POL-DEP 8)

**Condiciones generales para PRO**: validacion satisfactoria en QA, validacion satisfactoria en STG, version identificada, alcance definido, responsable tecnico, responsable funcional cuando aplique, validacion o aprobacion correspondiente, identificacion de riesgos, estrategia de rollback cuando tecnicamente sea viable, comunicacion a las partes involucradas, confirmacion de que no existe restriccion o congelamiento vigente.

---

## 6. Calendario, excepciones, hotfix, freeze y bloqueo

### Calendario (R1, POL-DEP 9-10)

- **QA**: dias habiles, segun planificacion del proyecto.
- **STG**: dias habiles, segun actividades de validacion.
- **PRO**: unicamente **lunes habil**. Si el lunes no es habil, el siguiente dia habil.
- No se considera ventana estandar de PRO: martes, miercoles, jueves, viernes, sabados, domingos, festivos.
- No se realizan despliegues programados en sabados, domingos ni festivos.

> **Nota de precedencia**: POL-DEP (politica formal, 2026-09-14) sustituye la disposicion horaria de PROC-DEP; la ventana de PRO es la de R1.

### Excepciones al calendario de PRO (POL-DEP 11)

Cualquier despliegue a PRO fuera del lunes habil o siguiente dia habil requiere justificacion y autorizacion previa del **Vicerrector de Servicios Digitales**. La solicitud debe incluir: proyecto o solucion, cambio a desplegar, motivo de la excepcion, riesgo de no realizar el despliegue, fecha y hora propuesta, impacto esperado, responsable tecnico, responsable funcional cuando aplique, validaciones realizadas, plan de rollback cuando aplique.

### Hotfix (POL-DEP 12)

**Condicion de criticidad**: solo cuando exista un problema critico que impida el correcto funcionamiento o afecte directamente el uso normal por parte del usuario final.

**Autorizacion**: el **Coordinador de la Fabrica de Software** aprueba el tratamiento como Hotfix. Esta autorizacion es una excepcion especial al ciclo y ventana ordinaria.

**La autorizacion del Hotfix no elimina la obligacion de**: evaluar el riesgo, realizar pruebas minimas, registrar el cambio, identificar la version, ejecutar el despliegue de forma controlada, realizar validacion posterior, documentar la situacion.

**Informacion minima para un Hotfix**: problema identificado, funcionalidad afectada, impacto sobre usuarios, evidencia de la afectacion cuando aplique, causa identificada o hipotesis tecnica, correccion propuesta, responsable tecnico, riesgo asociado, pruebas minimas realizadas, version a desplegar, plan de rollback cuando sea viable, responsable de validacion posterior.

**Flujo del Hotfix**: Incidente critico -> Identificacion -> Evaluacion tecnica -> Validacion de criticidad -> Clasificacion como Hotfix -> Aprobacion del Coordinador -> Correccion -> Pruebas minimas -> Despliegue -> Validacion en PRO -> Monitoreo -> Documentacion y cierre.

### Hotfix vs despliegue urgente (POL-DEP 13)

| Criterio | Hotfix | Despliegue urgente |
|---|---|---|
| Objetivo | Corregir un problema critico existente | Atender una necesidad urgente |
| Impacto | Afecta directamente el funcionamiento o uso normal | Puede o no afectar la operacion |
| Funcionalidad nueva | No | Puede aplicar |
| Correccion critica | Si | Puede aplicar |
| Tratamiento excepcional | Si | Segun autorizacion |
| Autorizacion especial | Coordinador de la Fabrica | Segun la excepcion correspondiente |
| Uso para acelerar proyectos | No | No debe utilizarse para evadir planificacion |

### Freeze (POL-DEP 15)

La Fabrica de Software podra establecer periodos de congelamiento cuando exista riesgo operativo considerable. Durante un freeze podran restringirse: nuevas funcionalidades, cambios estructurales, migraciones, actualizaciones de alto riesgo, cambios de infraestructura, cambios sobre servicios criticos. Los Hotfixes podran ser atendidos durante un freeze cuando exista condicion critica que afecte la operacion.

### Bloqueo automatico (POL-DEP 33)

Un despliegue se considera bloqueado cuando exista cualquiera de las siguientes condiciones:

- **Bloqueo critico**: error que impide el funcionamiento, riesgo alto de indisponibilidad, perdida o inconsistencia potencial de informacion, integracion critica caida, falta de estrategia minima de recuperacion cuando sea necesaria.
- **Bloqueo funcional**: falta de validacion funcional, alcance no definido, resultado de pruebas no satisfactorio.
- **Bloqueo institucional**: auditoria, evento institucional, actividad de alta criticidad, freeze, restriccion comunicada por un area responsable.

---

## 7. Proceso de solicitud por correo (PROC-DEP)

### Primera vez (implementacion de ambiente nuevo)

Correo electronico con:

- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno (sanitizadas, en adjunto `.txt` con bloques `ENVS NUEVAS / ENVS MODIFICADAS / ENVS ELIMINADAS`). Las `NG_APP_*` del frontend se incluyen en el mismo `.txt`.
- Ambiente destino.
- Requisitos tecnicos.
- Enlace del Pull Request (PR).

### Despliegues subsiguientes

Correo con:

- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno (adjuntas unicamente si requieren creacion o modificacion, en `.txt`). Las `NG_APP_*` del frontend van en el mismo `.txt`.
- Enlace del Pull Request (PR) hacia la rama del ambiente destino.
- Ambiente destino.
- Descripcion de cambios.
- Version a desplegar (obligatorio para produccion).

### Reglas por ambiente (R2)

| Ambiente | Proceso |
|---|---|
| DEV, QA, STG | Solicitud directa al **Tech Lead** |
| PRO (lunes habil) | Flujo estandar con aprobacion del **QA** en el hilo de correo y checklist aprobado por el **Tech Lead**, o solicitud directa del **Coordinador** por el canal debido. |
| PRO (martes a viernes) | **Excepcion**: autorizacion del **Vicerrector de Servicios Digitales**. |
| PRO (sabado, domingo o festivo) | **Excepcion**: autorizacion correspondiente (POL-DEP 28), bajo la autorizacion general del **Vicerrector** para toda excepcion al calendario (POL-DEP 11). |
| Hotfix PRO | Puede ser aprobado directamente por el **Coordinador de la Fabrica de Software**. |

### Horario de solicitud (R25)

- Las solicitudes se envian en dia habil entre las 8:00 y las 17:00 (PROC-DEP).
- Tiempos orientativos de atencion: DEV, QA y STG de 1 h a 36 h; PRO de 2 h a 24 h, segun disponibilidad, priorizacion y criticidad.
- La ejecucion en PRO se programa siempre segun R1 (lunes habil o siguiente dia habil); la hora exacta se define por caso (POL-DEP 19).
- Tras un despliegue productivo, el desarrollador valida que la funcionalidad este completa y reporta cualquier novedad de inmediato al DevOps encargado.

---

## 8. Rollback y validacion posterior a PRO

### Rollback (POL-DEP 20)

Cuando tecnicamente sea viable, los despliegues deben contar con estrategia de rollback. El rollback podra ejecutarse cuando: el cambio genere una afectacion critica, la solucion presente comportamiento inesperado, se afecten funcionalidades esenciales, el impacto supere el riesgo aceptado, no sea posible estabilizar la solucion dentro de un periodo razonable.

La decision debe considerar: impacto del error, impacto de regresar a la version anterior, integridad de datos, dependencias, estado de las integraciones, capacidad tecnica para revertir.

Despues de un rollback debe registrarse: motivo, version desplegada, version restaurada, impacto, responsable, acciones posteriores.

### Validacion posterior a PRO (POL-DEP 21)

Todo despliegue a PRO debe contar con validacion posterior: verificacion de disponibilidad, prueba funcional principal, validacion de integraciones, revision de logs, monitoreo de errores, validacion con usuario funcional cuando aplique. Para cambios criticos debe existir un responsable claramente identificado para confirmar el correcto funcionamiento.

---

## 9. Checklist previo a PRO y checklist de hotfix

### Checklist previo a PRO (POL-DEP 36 + CHECK, filtrado por rol)

#### POL-DEP 36

##### Funcional

- [ ] Alcance validado.
- [ ] QA aprobado.
- [ ] STG aprobado.
- [ ] Pruebas funcionales completadas.
- [ ] Observaciones criticas cerradas.

##### Tecnico

- [ ] Version identificada.
- [ ] Codigo disponible.
- [ ] Dependencias verificadas.
- [ ] Integraciones verificadas.
- [ ] Configuraciones verificadas.
- [ ] Plan de rollback definido cuando aplique.

##### Operativo

- [ ] Fecha validada.
- [ ] Lunes habil o siguiente dia habil cuando corresponda.
- [ ] No existe freeze.
- [ ] No existe evento o restriccion institucional conocida.
- [ ] Responsables disponibles.
- [ ] Comunicacion realizada.

##### Post-despliegue

- [ ] Responsable de validacion identificado.
- [ ] Monitoreo definido.
- [ ] Validacion funcional definida.
- [ ] Registro de resultado.

#### CHECK por rol

#### Desarrollador

- [ ] Variables de entorno configuradas para PRO (`npm run envs` genera `environment.prod.ts`; solo variables publicas `NG_APP_*`).
- [ ] Configuraciones sensibles (API keys, BD) no en codigo.
- [ ] Modo produccion activado (`aot`, `optimization` en `angular.json`).
- [ ] Cache habilitado (CDN, navegador, servidor).
- [ ] Assets optimizados: imagenes comprimidas (WebP, lazy loading, `NgOptimizedImage`).
- [ ] CSS/JS minificados y combinados.
- [ ] Uso de HTTP/2 o HTTP/3.
- [ ] Tiempo de respuesta bajo carga aceptable (<2 segundos).
- [ ] Cobertura: 70% minimo en codigo nuevo (gate SonarQube); objetivo 85% global.
- [ ] Contenerizacion: Dockerfile funcional y probado.
- [ ] Pruebas locales: contenedor verificado antes de solicitar despliegue.
- [ ] Criterio de entrega: producto funcional y estable, pruebas funcionales exhaustivas previas al PR.
- [ ] SEO basico: indexacion configurada, metatags optimizados, sitemap.xml, Google Analytics/GTM integrado, Core Web Vitals verificados.

#### Equipo QA

- [ ] Pruebas unitarias y de integracion ejecutadas y aprobadas.
- [ ] Pruebas E2E (Cypress) ejecutadas y aprobadas.
- [ ] Pruebas de carga y estres para validar escalabilidad.
- [ ] Pruebas de compatibilidad: navegadores (Chrome, Firefox, Safari, Edge), dispositivos moviles (iOS, Android), sistemas operativos.
- [ ] Pruebas de usabilidad con usuarios reales.
- [ ] Pruebas de seguridad: penetracion o auditoria basica.
- [ ] Monitoreo: telemetria (Google Analytics / GTM) y Core Web Vitals configurados.
- [ ] Paginas de error personalizadas (404, 500, mantenimiento).
- [ ] Documentacion tecnica actualizada.
- [ ] Procedimientos de despliegue (rollback, actualizaciones) documentados.

#### DevOps

- [ ] HTTPS: certificado SSL/TLS instalado y configurado.
- [ ] Headers de seguridad configurados (CSP, HSTS, X-Content-Type-Options).
- [ ] Librerias/frameworks actualizados (sin vulnerabilidades conocidas).
- [ ] Autenticacion y autorizacion: roles y permisos implementados correctamente.
- [ ] Entorno de staging identico a produccion.
- [ ] CI/CD configurado (GitHub Actions).
- [ ] Plan de rollback en caso de fallo.
- [ ] DNS y redirecciones configuradas correctamente.
- [ ] Entregar disponibilidad de los datos al area de Analitica.

#### Product Owner

- [ ] Politicas de privacidad y terminos de servicio visibles.
- [ ] Cookies: banner de consentimiento.
- [ ] Accesibilidad (WCAG 2.2 — CHECK cita 2.1; se adopta 2.2 por R22): contraste, ARIA labels, navegacion por teclado.
- [ ] Licencias: uso correcto de software de terceros.
- [ ] Notificaciones a usuarios sobre el lanzamiento.
- [ ] Canales de soporte activos.
- [ ] Changelog publico con novedades y correcciones.
- [ ] Socializacion y transferencia de conocimiento con la EFI.

#### Revision final (CHECK 12, sin rol asignado)

- [ ] Checklist firmada por el coordinador, el equipo de desarrollo, QA y DevOps.
- [ ] Prueba de humo (smoke test) en produccion.
- [ ] Verificacion de backups recientes.

#### Extra: Contingencias (CHECK)

- [ ] Plan de respuesta ante incidentes (ej: caida de servidor).
- [ ] Equipo de guardia asignado para las primeras 24-48 horas.

### Checklist de Hotfix (POL-DEP 37)

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

### Matriz de autorizaciones (POL-DEP 28)

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

### Matriz de calendario (POL-DEP 29)

| Ambiente | Dias estandar | Fin de semana | Festivos | Excepcion |
|---|---|---|---|---|
| QA | Dias habiles | No estandar | No estandar | Segun necesidad y autorizacion |
| STG | Dias habiles | No estandar | No estandar | Segun necesidad y autorizacion |
| PRO | Lunes habil | No | No | Si, segun autorizacion |
| PRO cuando lunes es festivo | Siguiente dia habil | No | No | Segun calendario |
| Hotfix critico | Segun criticidad | Puede requerir excepcion | Puede requerir excepcion | Coordinador Fabrica |

### Reglas de programacion de PRO (POL-DEP 30)

1. El dia estandar de despliegue en PRO es **lunes habil**.
2. Si el lunes es festivo o no habil, el despliegue estandar podra realizarse el **siguiente dia habil**.
3. Martes, miercoles, jueves y viernes no hacen parte de la ventana estandar de PRO.
4. Sabados, domingos y festivos no hacen parte de la ventana estandar de despliegue.
5. Cualquier excepcion debe contar con la autorizacion correspondiente.
6. Los Hotfixes criticos constituyen una excepcion especial.
