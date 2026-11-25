# 10 - Variables de entorno y environments en Angular

> Fuente normativa: PROC-DEP (Politica de despliegue para aplicaciones, subseccion "Variables de entorno en frontend Angular", 2026-11-25), R10, R11, R14, R28.
>
> Fecha de alineacion: 2026-11-25.

---

## 1. Por que

Todo proyecto `<proyecto>-front` genera sus archivos `src/environments/environment.ts` y `environment.prod.ts` a partir de variables de entorno, con un script Node incluido en el proyecto desde su creacion. Esto garantiza que:

- Ningun build parte de un `environment` desactualizado.
- Los valores de produccion llegan via CI/CD o Docker, nunca escritos a mano.
- El contrato de variables queda versionado en `.env.example`.

## 2. Regla de seguridad (R28)

Lo que entra en `environments/` se compila dentro del bundle y es legible por cualquier usuario del navegador. Por tanto:

- Solo se inyectan variables **publicas** con prefijo `NG_APP_` (URLs de API, identificadores de analitica, claves publicas, flags). El prefijo es la lista blanca: cualquier otra variable del `.env` se ignora.
- El script emite error y termina con codigo 1 si al dividir el nombre por `_` (tras quitar el prefijo) algun token es exactamente `SECRET`, `PASSWORD`, `PRIVATE`, `TOKEN` o `KEY`, salvo que el ultimo token sea `PUBLIC`. Ejemplos: `NG_APP_API_KEY` falla; `NG_APP_GA_ID`, `NG_APP_MAPS_KEY_PUBLIC`, `NG_APP_KEYCLOAK_URL` y `NG_APP_TOKENIZER_URL` pasan. El bloqueo se desactiva solo con `--allow-sensitive-names`, y esa decision se documenta en el README del proyecto.
- Los secretos reales (credenciales de servicios, tokens de servidor) nunca pasan por el frontend: viven en el backend o en el gateway.

## 3. Fuentes y precedencia de valores

1. `process.env` (CI/CD, Docker `--build-arg`, variables del contenedor): manda.
2. Archivo `.env` en la raiz del proyecto (desarrollo local; nunca versionado, ya cubierto por R10).
3. Archivo `.env.example` versionado con todas las claves `NG_APP_*` y valores de ejemplo no sensibles: documenta el contrato y permite que `npm run envs` funcione en un clon limpio.

El parser de `.env` es propio (sin dependencia `dotenv`): ignora lineas vacias y comentarios `#` al inicio de linea (un `#` dentro del valor forma parte del valor), admite `KEY=valor`, `KEY="valor"`, `KEY='valor'` y recorta espacios. Se elimina un BOM inicial si esta presente. `KEY=` vacio equivale a ausente.

## 4. Artefactos del proyecto

| Ruta en el proyecto | Versionado | Contenido |
|---|---|---|
| `scripts/set-envs.mjs` | si | Script Node (ESM, sin dependencias). No es `.sh`, asi que no lo afecta la regla `*.sh` de R10. |
| `.env.example` | si | Claves `NG_APP_*` con valores de ejemplo. |
| `.env` | **no** | Valores locales. |
| `src/environments/environment.ts` | **no** | Generado, `production: false`. |
| `src/environments/environment.prod.ts` | **no** | Generado, `production: true`. |
| `src/environments/environment.model.ts` | si | Interfaz `AppEnvironment` con las claves tipadas; el script la lee para validar que no falte ninguna. |

Mapeo de nombres: el script construye el mapa `camel(variable) -> variable` desde las entradas `NG_APP_*` y busca cada propiedad del modelo en ese mapa, de modo que `NG_APP_FEATURE_2FA` -> `feature2fa` resuelve sin ambiguedad. Los tipos los dicta `environment.model.ts` (D3): `boolean` exige `true`/`false`, `number` exige `^-?(0|[1-9]\d*)(\.\d+)?$` (decimales permitidos), `string` se emite con `JSON.stringify`; cualquier otro tipo declarado en el modelo (uniones, arrays, objetos) hace fallar el script con un mensaje que nombra la propiedad.

## 5. Script de referencia

El script de referencia vive en esta skill en `scripts/set-envs.mjs`. Al crear un proyecto nuevo, copiarlo:

```bash
mkdir -p scripts
cp <ruta-a-la-skill>/front-angular-fab/scripts/set-envs.mjs scripts/set-envs.mjs
```

Comportamiento:

- `node scripts/set-envs.mjs` genera ambos archivos. `--check` solo valida (para CI) sin escribir.
- `--root <dir>` permite ejecutarlo desde fuera del proyecto (default `process.cwd()`).
- Falla con codigo 1 y mensaje claro si: falta una clave declarada en `environment.model.ts`; un nombre viola R28; un valor no encaja en el tipo declarado; no existe `.env` ni `.env.example` y faltan valores en `process.env`.
- Un valor vacio (`KEY=` o `process.env` con cadena vacia) se trata como ausente.
- Escribe los archivos con cabecera `// Generado por scripts/set-envs.mjs. No editar a mano.`, import type de `AppEnvironment` y finales de linea LF.
- Salida: lista de claves inyectadas (nunca los valores). Claves `NG_APP_*` no declaradas en el modelo se ignoran con advertencia.

## 6. package.json

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

`prebuild` garantiza que ningun build parte de un `environment` desactualizado. `prestart` hace que `ng serve` use la misma fuente.

## 7. .env.example

```bash
NG_APP_API_URL=https://api.example.com
NG_APP_GA_ID=G-XXXXXXXXXX
NG_APP_FEATURE_X=false
NG_APP_PAGE_SIZE=20
```

## 8. environment.model.ts

```typescript
export interface AppEnvironment {
  production: boolean;
  apiUrl: string;
  readonly gaId: string;
  featureX: boolean;
  pageSize: number;
}
```

El script lee esta interfaz para saber que claves esperar y con que tipo. Tolera `readonly`, `?` y comentarios `//` y `/* */`. `production` siempre lo anade el script; no hace falta declararla en `.env.example`. El archivo generado incluye `import type { AppEnvironment } from './environment.model';` y `export const environment: AppEnvironment = {...}`.

## 9. .gitignore

Anadir a las lineas de R10:

```gitignore
.env
.env.*
!.env.example
src/environments/environment.ts
src/environments/environment.prod.ts
```

## 10. CI/CD (main.yml)

El job de build recibe las `NG_APP_*` como `env:` desde los secrets o variables del repositorio; `npm run build` las toma via `prebuild`.

```yaml
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
```

El paso `--check` falla temprano si falta alguna clave o algun valor no encaja en su tipo, antes de compilar.

## 11. Dockerfile

Etapa build: un `ARG` / `ENV` por cada variable `NG_APP_*` antes de `RUN npm run build`. La imagen de runtime (nginx) no recibe variables.

```dockerfile
FROM <imagen-aws-node-tech-lead> AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG NG_APP_API_URL
ENV NG_APP_API_URL=$NG_APP_API_URL
# Un ARG/ENV por cada variable NG_APP_*
RUN npm run build -- --configuration production
```

El job `docker` de `main.yml` pasa cada variable con `--build-arg`:

```yaml
  docker:
    runs-on: ubuntu-latest
    needs: [e2e]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - run: docker build --build-arg NG_APP_API_URL=${{ vars.NG_APP_API_URL }} --build-arg NG_APP_GA_ID=${{ vars.NG_APP_GA_ID }} -t <proyecto>-front:${{ github.sha }} .
      # Un --build-arg por cada variable NG_APP_*
```

## 12. Solicitud de despliegue (PROC-DEP)

Las `NG_APP_*` se envian en el `.txt` con los tres bloques (`ENVS NUEVAS`, `ENVS MODIFICADAS`, `ENVS ELIMINADAS`), como cualquier otra variable de entorno conforme a R11.

## 13. Errores frecuentes

| Error | Causa | Solucion |
|---|---|---|
| `ERROR: Faltan claves en .env / .env.example / process.env: NG_APP_X` | Falta la clave en todas las fuentes o el valor es vacio (`KEY=` o `process.env` con `''`) | Anadirla a `.env.example` (valor de ejemplo) y a `.env` o `process.env` con valor no vacio |
| `ERROR: NG_APP_API_KEY viola R28` | Token del nombre es `SECRET`/`PASSWORD`/`PRIVATE`/`TOKEN`/`KEY` sin `_PUBLIC` final | Renombrar con sufijo `_PUBLIC` o usar `--allow-sensitive-names` documentado en README |
| `ERROR: NG_APP_X: se esperaba boolean (true/false)` | El tipo declarado es `boolean` y el valor no es `true`/`false` | Corregir el valor en `.env` o `process.env` |
| `ERROR: NG_APP_X: se esperaba number` | El tipo declarado es `number` y el valor no es un numero valido | Corregir el valor (enteros o decimales, sin ceros a la izquierda) |
| `ERROR: <prop>: tipo no soportado en environment.model.ts (solo string, number, boolean)` | El modelo declara un tipo no soportado (union, array, objeto) | Cambiar el tipo de la propiedad a `string`, `number` o `boolean` |
| `ADVERTENCIA: NG_APP_X no esta en el modelo, se ignora` | La clave no esta en `environment.model.ts` | Anadirla al modelo o eliminarla de `.env` |
| `ERROR: No existe src/environments/environment.model.ts` | No se copio el modelo | Crear `environment.model.ts` con la interfaz `AppEnvironment` |
| `ERROR: No se encontraron propiedades en environment.model.ts` | El modelo no tiene propiedades parseables | Verificar que el modelo tiene propiedades con tipo `string`, `number` o `boolean` |
| El build usa valores viejos | No se ejecuto `npm run envs` | `prebuild`/`prestart` lo ejecutan automaticamente; verificar que los scripts existen en `package.json` |
