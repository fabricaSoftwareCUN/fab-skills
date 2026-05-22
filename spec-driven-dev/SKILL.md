---
name: spec-driven-dev
description: |
  Guía de Spec-Driven Development (SDD) basada en GitHub Spec Kit.
  Convierte ideas en especificaciones ejecutables, plan técnico y tareas trazables.
  Use when: crear features nuevas, cambios grandes, refactors complejos, o cuando se requiera alinear negocio + arquitectura + implementacion.
license: MIT
metadata:
  version: "1.1.0"
  category: metodologia
  sources:
    - https://github.com/github/spec-kit/blob/main/spec-driven.md
---

# Spec-Driven Development

Esta skill aplica SDD: la especificación es la fuente de verdad y el código es su expresión.

Referencia completa del documento original: `reference/spec-driven-original.md`.

## Cuando usar

- Features nuevas con alcance mediano o grande
- Requisitos ambiguos que necesitan refinamiento
- Cambios que impactan varias capas (API, datos, UI, integraciones)
- Trabajo en equipo donde se necesita trazabilidad clara entre negocio y código

## Cuando NO usar

- Tareas estimadas en menos de 4 horas de trabajo
- Fixes puntuales, bugs con causa conocida y solucion directa
- Cambios cosmeticos (estilos, textos, formatos)
- Scripts one-shot o utilitarios desechables
- Ajustes de configuracion sin impacto funcional

En estos casos, aplicar directamente las reglas de la skill `desarrollo` sin generar artefactos SDD.

## Principios centrales

1. Spec como lingua franca: se mantiene la intención en `spec.md`.
2. Spec ejecutable: requisitos claros, medibles y sin ambiguedad.
3. Refinamiento continuo: validar consistencia de forma iterativa.
4. Contexto por investigación: decisiones técnicas con evidencia.
5. Feedback bidireccional: produccion y pruebas actualizan la spec.
6. Exploración por ramas: comparar enfoques sin romper la base.

## Integracion con artefactos nativos

El agente puede operar con dos sistemas de artefactos. La eleccion depende del alcance:

| Escenario | Artefactos a usar | Ubicacion |
|---|---|---|
| Feature individual dentro de una sesion | Nativos: `implementation_plan.md`, `task.md`, `walkthrough.md` | Directorio de artefactos del agente |
| Feature compleja o proyecto multi-feature | SDD: `spec.md`, `plan.md`, `tasks.md` | `specs/<feature>/` en el repositorio |
| Proyecto CUN con trazabilidad formal | SDD obligatorio | `specs/<feature>/` en el repositorio |

Reglas de convivencia:
- Si se usa SDD, los artefactos nativos (`implementation_plan.md`, `task.md`) se generan **a partir** de los artefactos SDD, no en paralelo.
- `spec.md` alimenta `implementation_plan.md`. `tasks.md` alimenta `task.md`. `walkthrough.md` se genera al finalizar.
- No duplicar informacion entre ambos sistemas. Un solo flujo por feature.

## Flujo SDD en 3 fases

### Fase 1: Especificar (Specify)

Objetivo: definir **QUE** y **POR QUE**, no el **COMO**.

Pasos:
- Capturar problema, usuarios, objetivos y criterios de éxito.
- Escribir historias de usuario y escenarios de aceptación.
- Marcar ambiguedades con `[NEEDS CLARIFICATION: pregunta concreta]`.
- Evitar stack técnico, endpoints concretos o detalles de implementación.

Salida:
- `specs/<feature>/spec.md`

### Fase 2: Planificar (Plan)

Objetivo: traducir la spec a arquitectura y estrategia de implementación.

Pasos:
- Mapear cada requisito a decisiones técnicas trazables.
- Definir modelo de datos, contratos y estrategia de pruebas.
- Ejecutar gates de simplicidad y anti-sobre-ingenieria.
- Justificar complejidad extra cuando sea necesaria.

Salidas obligatorias:
- `specs/<feature>/plan.md`
- `specs/<feature>/contracts/` (ver formato abajo)

Salidas condicionales (solo si la complejidad lo justifica):
- `specs/<feature>/research.md` — cuando hay decisiones tecnicas con multiples opciones o tecnologias desconocidas.
- `specs/<feature>/data-model.md` — cuando el feature introduce o modifica entidades de datos.

### Fase 3: Tareas (Tasks)

Objetivo: derivar trabajo ejecutable en orden correcto.

Pasos:
- Convertir contratos, entidades y escenarios en tareas atómicas.
- Marcar tareas paralelizables con `[P]`.
- Priorizar secuencia: contratos -> pruebas -> implementacion.
- Definir criterio de terminado por tarea.

Salida:
- `specs/<feature>/tasks.md`

## Formato de contratos

El directorio `contracts/` contiene la definicion formal de interfaces entre componentes. El formato depende del tipo de proyecto:

| Tipo de proyecto | Formato de contrato | Ejemplo |
|---|---|---|
| API REST | OpenAPI 3.x (YAML) | `contracts/api.yaml` |
| API GraphQL | Schema SDL | `contracts/schema.graphql` |
| Frontend TypeScript | Interfaces/Types TS | `contracts/types.ts` |
| Base de datos | SQL DDL o migraciones | `contracts/schema.sql` |
| Mensajeria/eventos | JSON Schema o Avro | `contracts/events.json` |
| gRPC | Protocol Buffers | `contracts/service.proto` |

Reglas:
- Minimo un archivo de contrato por limite de sistema (API publica, esquema de datos, etc.).
- El contrato debe ser validable mecanicamente (parseable, compilable o verificable con herramientas).
- Si el proyecto mezcla tipos, usar multiples archivos con el formato correspondiente.

## Reglas operativas para el agente

- No implementar código si la spec aun tiene ambiguedades criticas.
- No inventar detalles faltantes: pedir aclaración o marcarlo explícitamente.
- Mantener trazabilidad requisito -> decision -> tarea -> prueba.
- Aplicar enfoque test-first: contratos y pruebas antes de código final.
- Ante cambios de alcance, actualizar `spec.md` y regenerar `plan.md`/`tasks.md`.
- Ejecutar el flujo manual creando los artefactos definidos en cada fase.

## Gates de calidad (checklist rapido)

### Gate de especificación
- [ ] Sin ambiguedades no resueltas relevantes
- [ ] Criterios de éxito medibles
- [ ] Escenarios de aceptación verificables

### Gate de plan
- [ ] Toda decision técnica referencia requisitos
- [ ] Riesgos y tradeoffs documentados
- [ ] Complejidad extra justificada
- [ ] Contratos definidos y parseables

### Gate de ejecución
- [ ] Tareas pequeñas, claras y con salida verificable
- [ ] Dependencias y paralelizacion explicitas
- [ ] Pruebas definidas antes de cerrar implementación

## Plantilla minima: `spec.md`

```md
# <Feature>

## Contexto
- Problema:
- Usuarios:
- Objetivo de negocio:

## Historias de usuario
- Como <rol>, quiero <necesidad>, para <beneficio>.

## Requisitos
- R1:
- R2:

## Criterios de aceptacion
- CA1:
- CA2:

## Dudas abiertas
- [NEEDS CLARIFICATION: ...]
```

## Plantilla minima: `plan.md`

```md
# Plan de implementacion: <Feature>

## Mapeo requisito -> decision tecnica
- R1 -> D1
- R2 -> D2

## Arquitectura propuesta
- Componentes:
- Integraciones:
- Datos:

## Estrategia de pruebas
- Contrato:
- Integracion:
- E2E:

## Riesgos y mitigaciones
- Riesgo 1:
- Mitigacion 1:
```

## Plantilla minima: `tasks.md`

```md
# Tareas: <Feature>

## Leyenda
- [P] = paralelizable con otras tareas marcadas [P]
- depends: T00x = requiere completar T00x antes de iniciar
- Done when: = criterio de terminado verificable

## Tareas

- [ ] T001 Definir/validar contratos
  - Done when: contratos parsean sin errores y cubren todos los limites de sistema
- [ ] [P] T002 Crear fixtures y datos de prueba
  - Done when: fixtures cargables en entorno de test
- [ ] T003 Escribir pruebas de contrato
  - depends: T001
  - Done when: pruebas ejecutan y fallan (red) contra implementacion vacia
- [ ] T004 Escribir pruebas de integracion
  - depends: T001
  - Done when: pruebas ejecutan y fallan (red) contra implementacion vacia
- [ ] T005 Implementar servicio principal
  - depends: T003, T004
  - Done when: todas las pruebas de T003 y T004 pasan (green)
- [ ] T006 Verificar criterios de aceptacion
  - depends: T005
  - Done when: todos los CA de spec.md verificados y documentados
```

## Resultado esperado

Con esta skill, opera en modo SDD: menos ambiguedad, mejor trazabilidad y mayor velocidad para iterar sin perder alineacion entre negocio y codigo.