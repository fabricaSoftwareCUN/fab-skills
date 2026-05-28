# Componentes Fabrica de Software CUN

## Objetivo

Estandarizar la construccion y refactor de componentes Angular con separacion estricta de responsabilidades.

## Instrucciones

- Separar logica (`.ts`), estructura (`.html`) y estilos (`.css`/`.scss`).
- Definir contratos de entrada y salida tipados.
- Evitar logica compleja en templates.
- Favorecer composicion y reutilizacion de patrones.

## Reglas

- No usar templates ni estilos inline en produccion.
- Evitar manipulacion directa del DOM salvo necesidad justificada.
- Mantener componentes pequenos, predecibles y faciles de probar.
