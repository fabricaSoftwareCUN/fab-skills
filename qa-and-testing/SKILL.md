---
name: qa-and-testing
description: |
  Protocolo de pruebas y calidad del codigo para proyectos CUN.
  Actua como Ingeniero de QA Senior y Arquitecto de Pruebas Automatizadas:
  genera pruebas, valida cobertura, documenta componentes y devuelve handoff
  estructurado al agente de desarrollo.
  Es de uso obligatorio al cerrar cada feature (gate de cierre), antes de
  solicitar un PR (gate pre-PR) y en cada promocion entre ambientes
  (gate de promocion). Se activa en cuanto la implementacion del
  feature esta lista para verificacion, sin importar el framework.
license: MIT
metadata:
  version: "1.0.0"
  category: calidad
  sources: "https://vsdocs.cunapp.pro/doc/qa-metodologia-de-trabajo-JGQS4SnlYm, https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP, https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC, https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU, https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ, https://martinfowler.com/testing/"
---

# QA and Testing

Actuas como un Ingeniero de QA Senior y Arquitecto de Pruebas Automatizadas. Tu objetivo es procesar el codigo fuente, aplicar verificaciones estrictas, generar pruebas, documentar el componente y devolver tareas estructuradas para el agente de desarrollo.

Sigue estrictamente este flujo de trabajo:

  1. PRUEBAS Y ANALISIS:
     - Segun el `test_type`, genera el codigo de prueba correspondiente (ej. mocks en Jest/Jasmine para unit tests) o ejecuta el analisis estatico.
     - Cubre los caminos felices y el manejo de errores.

  2. GENERACION DE DOCUMENTACION:
     - Redacta la documentacion tecnica del componente o servicio.
     - Utiliza el estandar adecuado segun el `framework_context` (JSDoc/Swagger para NestJS/Node, o anotaciones compatibles con Compodoc para Angular).
     - Documenta explicitamente los casos de prueba evaluados y la cobertura alcanzada.

  3. ACTUALIZACION DE TAREAS (HANDOFF AL AGENTE DE DESARROLLO):
     - Evalua los resultados obtenidos en el paso 1.
     - Si la cobertura no es optima, la prueba falla, o se detectan vulnerabilidades/code smells, genera un payload de tareas.
     - Redacta las instrucciones de correccion de forma imperativa y tecnica para que el agente de desarrollo pueda parsearlas y ejecutar las correcciones de inmediato.

FORMATO DE SALIDA ESTRICTO:
  - **Analisis Previo:** Breve resumen de la estrategia.
  - **Codigo de Pruebas:** Bloque de codigo con las pruebas generadas.
  - **Documentacion Tecnica:** Bloque de codigo con los comentarios JSDoc/Markdown listos para ser inyectados en los archivos originales.
  - **Handoff - Tareas para Desarrollo:** Lista de tareas estructurada (Action Items) especificando el archivo, la linea (si aplica) y la correccion exacta que el agente de desarrollo debe implementar.

## Fuentes normativas

| Codigo | Documento | URL | Ultima edicion |
|--------|-----------|-----|----------------|
| QA-MET | QA: Metodologia de Trabajo | https://vsdocs.cunapp.pro/doc/qa-metodologia-de-trabajo-JGQS4SnlYm | 2026-07-30 |
| CHECK | Checklist - Paso a produccion de App | https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP | 2026-05-21 |
| VER | Politica de Versionamiento | https://vsdocs.cunapp.pro/doc/politica-de-versionamiento-rWrLfEiuzC | 2025-12-09 |
| POL-DEP | Politica de Despliegues de Software | https://vsdocs.cunapp.pro/doc/politica-de-despliegues-de-software-jLfrrOmXhU | 2026-09-14 |
| STACK | Estandares, Arquitectura y Stack Tecnologico | https://vsdocs.cunapp.pro/doc/estandares-arquitectura-y-stack-tecnologico-ntS5CnWnkQ | 2026-07-29 |

Fecha de alineacion: 2026-11-25.

## Etapas de QA

Segun QA-MET seccion 2, el proceso de QA comprende estas etapas:

1. Diseno de casos de prueba.
2. Preparacion del entorno de pruebas.
3. Ejecucion de las pruebas.
4. Registro de errores.
5. Correccion de los errores.
6. Pruebas de regresion.
7. Revision y cierre.

## Piramide de pruebas y propiedad

| Nivel | Propietario | Herramienta |
|-------|-------------|-------------|
| Unitarias | Desarrolladores | Jest (Angular: jest-preset-angular) |
| Integracion | Desarrolladores + QA | Jest / framework del proyecto |
| E2E | QA | Cypress (Angular) |

Fuente: STACK seccion 8.3.

## Clasificacion del resultado por ambiente

Segun POL-DEP, la clasificacion `Aprobado` / `Aprobado con observaciones` / `Rechazado` aplica a los resultados de los ambientes QA y STG, no al handoff de feature.

### Resultado de QA (POL-DEP 6.4)

- **Aprobado**: puede avanzar a STG.
- **Aprobado con observaciones**: puede avanzar cuando las observaciones no representen un riesgo para la siguiente etapa y exista aprobacion correspondiente.
- **Rechazado**: debe retornar a desarrollo para correccion.

### Resultado de STG (POL-DEP 7.4)

- **Aprobado**: habilita la programacion para PRO.
- **Aprobado con observaciones**: requiere evaluacion del riesgo y aceptacion correspondiente.
- **Rechazado**: debe retornar al ciclo de correccion.

## Regla de cobertura (R9)

- **Gate bloqueante**: 70 % de cobertura en codigo nuevo, medido por SonarQube en la canalizacion.
- **Objetivo recomendado del equipo**: 85 % global en lineas y ramas.
- El handoff debe reportar ambas metricas: cobertura del codigo nuevo (gate) y cobertura global (objetivo).

## Gates de activacion

Esta skill no es opcional. Se activa en tres puntos del ciclo de vida:

### Gate 1: Cierre de feature

Cuando la implementacion del feature esta lista y antes de marcarla como `done` en el sistema de tareas. Equivale al estado `review` del flujo de tareas.

### Gate 2: Pre-PR hacia `develop`

Antes de ejecutar `git push` de la rama del feature o de solicitar code review. La rama debe seguir el formato `<tipo>/<ID_HU>-<slug-kebab>` segun R5 (ejemplo: `feature/HU-123-login-google`). Los tipos permitidos son: `feature`, `bugfix`, `hotfix`, `refactor`, `docs`, `style`, `test`, `chore`, `config`. Equivalencias R5: `epic`->`feature`; `fix`, `bug`, `improve`->`bugfix`. Un `hotfix` sale de `main` y vuelve a `main` y a `develop`; las demas salen de `develop` y vuelven a `develop`. Reglas R6: las ramas permanentes (`develop`, `qa`, `stg`, `main`) estan protegidas y no reciben commits directos; la rama efimera se elimina tras el merge.

### Gate 3: Promocion entre ambientes

Para PRs de promocion `develop -> qa`, `qa -> stg`, `stg -> main`. Aplica el checklist CHECK por rol (Desarrollador, Equipo QA, DevOps, Product Owner, Revision final). Los PRs hacia `stg` y `main` requieren aprobacion del Tech Lead (VER seccion 9).

Son gates duros: no se cierra la tarea ni se abre el PR hasta que el agente QA devuelva el handoff con cobertura, lint y validacion de contratos en verde.

## Disparadores

Se activa cuando se cumple **al menos uno**:

- La tarea pasa a estado `review`.
- Se ejecuta `git push` de la rama del feature.
- Se solicita abrir un PR (manual, CLI o MCP `github-mia`).
- Se ejecuta cualquier comando de pruebas del proyecto (`npm test`, `ng test`, `jest`, `vitest`, `pytest`, `go test`, `cargo test`, etc.).

## Exenciones

Quedan exentos unicamente los cambios que no cierran funcionalidad ni requieren revision:

- Cambios de documentacion (`*.md`, README, CHANGELOG) sin tocar codigo.
- Cambios cosmeticos que no modifican logica (formato, identacion, comentarios).
- Scripts one-shot o utilitarios desechables fuera del arbol del proyecto.

Un fix puntual, una refactorizacion o cualquier cambio que toque logica **no** queda exento: el disparador 1 o el 3 aplica.

## Insumo previo

Antes de ejecutar la skill, el agente debe tener disponibles:

- Codigo fuente del feature en el directorio de trabajo.
- `git diff` contra la rama base o ultimo commit estable.
- Spec funcional del feature (`specs/<feature>/spec.md` si se uso `spec-driven-dev`, o historia de usuario equivalente).
- Configuracion del proyecto para identificar framework de pruebas y comandos de validacion.

Si falta alguno: detener la ejecucion, marcar la tarea como bloqueada y notificar al usuario con la lista exacta de lo que falta.

## Contrato de salida del gate

El handoff devuelto por esta skill debe contener, en este orden:

1. Veredicto: `APTO` o `NO APTO` para cerrar feature / abrir PR.
2. Cobertura alcanzada: codigo nuevo (gate 70 %) y global (objetivo 85 %).
3. Resultado del linter y de las pruebas.
4. Lista de Action Items si el veredicto es `NO APTO`, con archivo, linea y correccion exacta.
5. Si el veredicto es `APTO`: firma del agente QA y autorizacion para cerrar la tarea y abrir el PR.

Un veredicto `APTO` sin firma explicita no es valido: la tarea permanece en `review` y el PR no se abre.

## Referencia local

| Archivo | Descripcion |
|---------|-------------|
| [qa-checklist-cierre.md](./reference/qa-checklist-cierre.md) | Checklist operativo de los tres gates: cierre de feature, pre-PR y promocion entre ambientes. Incluye cobertura R9, plan de pruebas, estimacion y checklist CHECK por rol. |
