---
name: qa-and-testing
description: |
  Protocolo de pruebas y calidad del codigo para proyectos CUN.
  Actua como Ingeniero de QA Senior y Arquitecto de Pruebas Automatizadas:
  genera pruebas, valida cobertura, documenta componentes y devuelve handoff
  estructurado al agente de desarrollo.
  Es de uso obligatorio al cerrar cada feature (gate de cierre) y antes de
  solicitar un PR (gate pre-PR). Se activa en cuanto la implementacion del
  feature esta lista para verificacion, sin importar el framework.
license: MIT
metadata:
  version: "1.0.0"
  category: calidad
  sources:
    - https://testing.google.com/
    - https://martinfowler.com/testing/
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

## Activacion obligatoria

Esta skill no es opcional. Se activa en dos puntos del ciclo de vida del feature, sin importar framework ni lenguaje:

1. **Gate de cierre de feature**: cuando la implementacion del feature esta lista y antes de marcarla como `done` en el sistema de tareas.
2. **Gate pre-PR**: antes de ejecutar `git push` de la rama del feature o de solicitar code review.

Son gates duros: no se cierra la tarea ni se abre el PR hasta que el agente QA devuelva el handoff del paso 3 con cobertura, lint y validacion de contratos en verde.

### Disparadores

Se activa cuando se cumple **al menos uno**:

- La tarea pasa a estado `review`.
- Se ejecuta `git push` de la rama del feature.
- Se solicita abrir un PR (manual, CLI o MCP `github-mia`).
- Se ejecuta cualquier comando de pruebas del proyecto (`npm test`, `ng test`, `jest`, `vitest`, `pytest`, `go test`, `cargo test`, etc.).

### Exenciones

Quedan exentos unicamente los cambios que no cierran funcionalidad ni requieren revision:

- Cambios de documentacion (`*.md`, README, CHANGELOG) sin tocar codigo.
- Cambios cosmeticos que no modifican logica (formato, identacion, comentarios).
- Scripts one-shot o utilitarios desechables fuera del arbol del proyecto.

Un fix puntual, una refactorizacion o cualquier cambio que toque logica **no** queda exento: el disparador 1 o el 3 aplica.

### Insumo previo

Antes de ejecutar la skill, el agente debe tener disponibles:

- Codigo fuente del feature en el directorio de trabajo.
- `git diff` contra la rama base o ultimo commit estable.
- Spec funcional del feature (`specs/<feature>/spec.md` si se uso `spec-driven-dev`, o historia de usuario equivalente).
- Configuracion del proyecto para identificar framework de pruebas y comandos de validacion.

Si falta alguno: detener la ejecucion, marcar la tarea como bloqueada y notificar al usuario con la lista exacta de lo que falta.

### Contrato de salida del gate

El handoff devuelto por esta skill debe contener, en este orden:

1. Veredicto: `APTO` o `NO APTO` para cerrar feature / abrir PR.
2. Cobertura alcanzada vs objetivo del proyecto (default 85%).
3. Resultado del linter y de las pruebas.
4. Lista de Action Items si el veredicto es `NO APTO`, con archivo, linea y correccion exacta.
5. Si el veredicto es `APTO`: firma del agente QA y autorizacion para cerrar la tarea y abrir el PR.

Un veredicto `APTO` sin firma explicita no es valido: la tarea permanece en `review` y el PR no se abre.

## Referencia local

| Archivo | Descripcion |
|---------|-------------|
| [qa-checklist-cierre.md](./reference/qa-checklist-cierre.md) | Checklist operativo del gate de cierre de feature y del gate pre-PR: cobertura, lint, build, contratos, sincronizacion documental, secretos y comandos de validacion. |
