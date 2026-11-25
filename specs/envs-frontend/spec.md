# Spec: generacion de `environments/` desde `.env` en proyectos Angular (`npm run envs`)

Fecha: 2026-11-25. Extiende `specs/alineacion-outline/spec.md` (R10, R11, R14).

## 1. Objetivo

Todo proyecto `<proyecto>-front` genera sus archivos `src/environments/environment.ts` y `environment.prod.ts` a partir de variables de entorno, con un script Node incluido en el proyecto desde su creacion:

- `npm run envs` genera los archivos.
- `npm run build` lo ejecuta como fase previa (`prebuild`), de modo que ningun build parte de un `environment` desactualizado.
- `npm start` tambien lo ejecuta (`prestart`) para que `ng serve` use la misma fuente.

## 2. Restriccion de seguridad (R28)

Lo que entra en `environments/` se compila dentro del bundle y es legible por cualquier usuario del navegador. Por tanto:

- Solo se inyectan variables **publicas** con prefijo `NG_APP_` (URLs de API, identificadores de analitica, claves publicas, flags). El prefijo es la lista blanca: cualquier otra variable del `.env` se ignora.
- El script termina con codigo 1 si, al dividir el nombre por `_` tras quitar el prefijo, alguno de los tokens es exactamente `SECRET`, `PASSWORD`, `PRIVATE`, `TOKEN` o `KEY` y el ultimo token no es `PUBLIC` (por ejemplo `NG_APP_API_KEY` falla; `NG_APP_GA_ID`, `NG_APP_KEYCLOAK_URL` y `NG_APP_MAPS_KEY_PUBLIC` pasan). Ver D5. El bloqueo se puede desactivar solo con `--allow-sensitive-names`, y esa decision se documenta en el README del proyecto.
- Los secretos reales (credenciales de servicios, tokens de servidor) nunca pasan por el frontend: viven en el backend o en el gateway.

## 3. Fuentes y precedencia de valores

1. `process.env` (CI/CD, Docker `--build-arg`, variables del contenedor): manda.
2. Archivo `.env` en la raiz del proyecto (desarrollo local; nunca versionado, ya cubierto por R10).
3. Archivo `.env.example` versionado con todas las claves `NG_APP_*` y valores de ejemplo no sensibles: documenta el contrato y permite que `npm run envs` funcione en un clon limpio.

El parser de `.env` es propio (sin dependencia `dotenv`): elimina un BOM inicial, ignora lineas vacias y lineas que empiezan por `#` (un `#` dentro del valor forma parte del valor), admite `KEY=valor`, `KEY="valor"`, `KEY='valor'`, recorta espacios y trata `KEY=` vacio como ausente. Ver D6.

## 4. Artefactos del proyecto

| Ruta en el proyecto | Versionado | Contenido |
|---|---|---|
| `scripts/set-envs.mjs` | si | Script Node (ESM, sin dependencias). No es `.sh`, asi que no lo afecta la regla `*.sh` de R10. |
| `.env.example` | si | Claves `NG_APP_*` con valores de ejemplo. |
| `.env` | **no** | Valores locales. |
| `src/environments/environment.ts` | **no** | Generado, `production: false`. |
| `src/environments/environment.prod.ts` | **no** | Generado, `production: true`. |
| `src/environments/environment.model.ts` | si | Interfaz `AppEnvironment` con las claves tipadas; el script la lee para validar que no falte ninguna. |

Mapeo de nombres: `NG_APP_API_URL` -> `apiUrl` (se quita el prefijo y se convierte a camelCase); el script construye el mapa `camel(variable) -> variable` y busca cada propiedad del modelo en ese mapa, de modo que `NG_APP_FEATURE_2FA` -> `feature2fa` resuelve sin ambiguedad. Los tipos los dicta `environment.model.ts` (D3): `boolean` exige `true`/`false`, `number` exige `^-?(0|[1-9]\d*)(\.\d+)?$`, `string` se emite con `JSON.stringify`; cualquier otro tipo declarado en el modelo (uniones, arrays, objetos) hace fallar el script con un mensaje que nombra la propiedad.

`package.json`:

```json
{
  "scripts": {
    "envs": "node scripts/set-envs.mjs",
    "prebuild": "npm run envs",
    "prestart": "npm run envs",
    "build": "ng build",
    "start": "ng serve"
  }
}
```

`.gitignore` anade (la excepcion `!.env.example` complementa R10, ver D1):

```gitignore
.env
.env.*
!.env.example
src/environments/environment.ts
src/environments/environment.prod.ts
```

## 5. Comportamiento del script

- `node scripts/set-envs.mjs` genera ambos archivos. `--check` ejecuta exactamente las mismas validaciones (claves, R28, tipos) y solo omite la escritura.
- Falla con codigo 1 y mensaje claro si: falta una clave declarada en `environment.model.ts`; un nombre viola R28; un valor no encaja con el tipo declarado; el modelo declara un tipo no soportado o no declara ninguna clave; no existe `.env` ni `.env.example` y faltan valores en `process.env`. Los mensajes de error nombran la variable y el tipo esperado, nunca el valor.
- Escribe los archivos con cabecera `// Generado por scripts/set-envs.mjs. No editar a mano.` y finales de linea LF.
- Salida: lista de claves inyectadas (nunca los valores).

## 6. CI/CD y Docker

- `main.yml`: el job de build recibe las `NG_APP_*` como `env:` desde los secrets o variables del repositorio; `npm run build` las toma via `prebuild`.
- Dockerfile (etapa build): `ARG NG_APP_API_URL` ... `ENV NG_APP_API_URL=$NG_APP_API_URL` antes de `RUN npm run build`. La imagen de runtime (nginx) no recibe variables.
- Solicitud de despliegue (PROC-DEP): las `NG_APP_*` se envian en el `.txt` con los tres bloques, como cualquier otra variable.

## 7. Cambios en `fab-skills`

| Archivo | Cambio |
|---|---|
| `front-angular-fab/scripts/set-envs.mjs` (nuevo) | Script de referencia que el agente copia al proyecto. |
| `front-angular-fab/reference/10-envs-environments.md` (nuevo) | Procedimiento completo: por que, R28, artefactos, script, `package.json`, `.env.example`, `environment.model.ts`, CI y Docker, errores frecuentes. |
| `front-angular-fab/SKILL.md` | Paso obligatorio en "Flujo de trabajo" (0.d) al crear un proyecto; regla en "Reglas de despliegue"; criterio de calidad; fila en la tabla de referencia; arbol con `scripts/set-envs.mjs` y `environment.model.ts`. |
| `front-angular-fab/reference/01-arquitectura-proyecto.md` | Seccion de environments reescrita; checklist de nuevo proyecto con los pasos `npm run envs`. |
| `front-angular-fab/reference/09-politica-despliegue.md` | `.gitignore`, Dockerfile con `ARG`/`ENV`, `main.yml` con `env:`, variables en la solicitud. |
| `README.md`, `CHANGELOG.md` (0.18.0) | Documentar. |
| `specs/envs-frontend/outline-politica.md` (nuevo) | Texto listo para pegar en Outline (seccion nueva de PROC-DEP "Variables de entorno en frontend Angular"). |

## 8. Texto propuesto para Outline (PROC-DEP, nueva subseccion)

> ### Variables de entorno en frontend Angular
> Los proyectos Angular no versionan `environment.ts` ni `environment.prod.ts`. Ambos se generan con `npm run envs` (script `scripts/set-envs.mjs` incluido en la plantilla del proyecto) a partir de las variables `NG_APP_*` del entorno o del archivo `.env` local. `npm run build` ejecuta `npm run envs` como fase previa; por tanto, el build de CI/CD y el de Docker reciben las variables `NG_APP_*` y nunca un archivo de environment escrito a mano. Solo se admiten variables publicas (el bundle es visible en el navegador): URLs, identificadores y claves publicas. Cualquier credencial de servicio permanece en el backend. El `.env.example` versionado declara las claves esperadas. Las `NG_APP_*` se solicitan a DevOps en el mismo `.txt` de variables de entorno.

## 8b. Decisiones tras revision (2026-11-25)

- **D1. `.gitignore`:** R10 mantiene `.env` y `.env.*`, y se anade la excepcion `!.env.example` justo despues, en todos los bloques `.gitignore` de la skill. La excepcion queda registrada aqui como complemento de R10.
- **D2. Cadena vacia = ausente.** Un valor `''` procedente de `process.env` no sobrescribe: se trata como no definido (asi `ENV X=$X` con `ARG` sin valor no produce `apiUrl: ''`). El job `docker` de `main.yml` pasa cada `NG_APP_*` con `--build-arg` desde `vars`/`secrets`.
- **D3. El modelo manda.** `environment.model.ts` es la fuente de claves y de tipos. El script lee cada propiedad con su tipo (`string`, `number`, `boolean`) tolerando `readonly`, `?`, comentarios `//` y `/* */`, y convierte el valor al tipo declarado: `number` exige `^-?(0|[1-9]\d*)(\.\d+)?$`, `boolean` exige `true`/`false`; si no encaja, falla con codigo 1. Cadenas se emiten con `JSON.stringify`. El archivo generado se anota: `import type { AppEnvironment } from './environment.model'; export const environment: AppEnvironment = {...}`. Si el modelo no aporta ninguna clave, el script falla.
- **D4. Claves desconocidas.** Variables `NG_APP_*` presentes en el entorno pero ausentes del modelo se ignoran con una advertencia por nombre (nunca el valor).
- **D5. R28 por tokens.** El nombre se divide por `_` tras quitar el prefijo; se bloquea si alguno de los tokens es exactamente `SECRET`, `PASSWORD`, `PRIVATE`, `TOKEN` o `KEY`, salvo que el ultimo token sea `PUBLIC`. `NG_APP_KEYCLOAK_URL` y `NG_APP_TOKENIZER_URL` pasan; `NG_APP_API_KEY` falla; `NG_APP_MAPS_KEY_PUBLIC` pasa.
- **D6. Parser `.env`:** se elimina un BOM inicial; los comentarios solo se reconocen al inicio de linea (un `#` dentro del valor forma parte del valor); `KEY=` vacio equivale a ausente.
- **D7. CI:** el job `build` ejecuta `node scripts/set-envs.mjs --check` antes de `npm run build` para fallar temprano con mensaje claro.

## 9. Criterios de aceptacion

1. `node front-angular-fab/scripts/set-envs.mjs` ejecutado en un directorio de prueba con `.env.example`, `.env` y `src/environments/environment.model.ts` genera `environment.ts` y `environment.prod.ts` con `production` correcto, camelCase y tipos; `process.env` sobreescribe `.env`; `--check` no escribe; una clave `NG_APP_API_KEY` hace fallar con codigo 1; una clave faltante hace fallar con codigo 1. Estas pruebas se ejecutan y su salida se reporta.
2. `front-angular-fab/SKILL.md` <= 500 lineas, `name`/`license` intactos, nueva referencia enlazada, LF, sin acentos.
3. `README.md`, `CHANGELOG.md` actualizados; `specs/envs-frontend/outline-politica.md` contiene el texto de la seccion 8.
4. Ninguna regla contradice R10 (`.env` fuera del repo) ni R11 (`.txt` de variables).
