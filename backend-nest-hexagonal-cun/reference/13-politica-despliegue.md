# 13 - Politica de despliegue para aplicaciones backend

> Fuente: [Politica de despliegue para aplicaciones](https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw) en Outline.

---

## Requisitos obligatorios antes de solicitar despliegue

### Dockerizacion

- El proyecto DEBE contar con un `Dockerfile` funcional y probado.
- Usar la imagen publica de AWS suministrada por el **Tech Lead**.
- Las implementaciones con conexion a **Oracle** deben incluir `instant-client` en el Dockerfile y apuntar el host al DNS `cundb01`.

```dockerfile
# Ejemplo base backend NestJS con Oracle
FROM <imagen-publica-aws-tech-lead>

# Solo si el proyecto conecta a Oracle
RUN apt-get update && apt-get install -y libaio1 && \
    # Instalar Oracle Instant Client
    ...

ENV ORACLE_HOST=cundb01
```

### CI/CD y calidad

- Incluir archivos de configuracion de **SonarQube** (`sonar-project.properties`).
- Incluir el archivo `main.yml` para la integracion del CI/CD (GitHub Actions).

### Seguridad y Git

| Archivo/patron | Regla |
|---|---|
| `docker-compose.yml` | **NO** debe subirse al repositorio |
| `*.sh` | Agregar al `.gitignore` |
| Variables de entorno | NUNCA en el repositorio; usar archivos de configuracion o secrets |

Ejemplo minimo de `.gitignore` para cumplir la politica:

```gitignore
# Politica de despliegue CUN
docker-compose.yml
docker-compose.*.yml
*.sh
.env
.env.*
```

### Gestion de ramas

El codigo a implementar debe estar en la rama correspondiente al ambiente solicitado:

| Ambiente | Rama esperada |
|---|---|
| DEV | `develop` o `dev` |
| QA | `qa` |
| STG | `staging` |
| PRO | `main` o `master` |

---

## Sanitizacion de variables de entorno

Para garantizar estabilidad en entornos Linux, las variables de entorno deben cumplir:

1. **Formato**: `SNAKE_CASE` (mayusculas y guiones bajos).
2. **Sin espacios** ni saltos de linea que rompan la interpretacion.
3. **Sin comillas innecesarias** que Docker o Linux procesen como parte del valor.
4. **Orden logico por categorias**: Configuracion de Red, Credenciales de DB, Keys de API, etc.
5. **Legibilidad**: las variables deben ser claras y autoexplicativas.

Ejemplo correcto:

```env
# Configuracion de red
APP_PORT=3000
APP_HOST=0.0.0.0

# Base de datos
DB_HOST=cundb01
DB_PORT=1521
DB_NAME=mi_base
DB_USER=app_user
DB_PASSWORD=secreto

# APIs externas
API_KEY_SERVICIO_X=abc123
API_TIMEOUT_MS=5000
```

---

## Proceso de solicitud

### Primera vez (implementacion de ambiente nuevo)

Enviar **correo electronico** con:

- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno (sanitizadas segun la seccion anterior).
- Ambiente destino.
- Requisitos tecnicos (Oracle, Redis, etc.).
- Enlace del Pull Request (PR).

### Despliegues subsiguientes

Correo con:

- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno (solo si requieren creacion o modificacion).
- Enlace del Pull Request (PR) hacia la rama del ambiente destino.
- Ambiente destino.
- Descripcion de cambios.
- Version a desplegar (obligatorio para produccion).

### Reglas por ambiente

| Ambiente | Proceso |
|---|---|
| DEV, QA, STG | Solicitud directa al **Tech Lead** |
| PRO | Copiar al **QA** en el correo. Requiere **respuesta de aprobacion** del QA en el mismo hilo |
| Hotfix PRO | Puede ser aprobado directamente por el **Coordinador de la Fabrica de Software** |

---

## Disposicion horaria

| Ambiente | Dias | Horario | Tiempo estimado |
|---|---|---|---|
| Desarrollo (DEV, QA, STG) | Lunes a viernes | 8:00 - 17:00 | 1h a 36h |
| Produccion (PRO) | Lunes a jueves | 8:00 - 17:00 | 2h a 24h |

**NO se realizan despliegues productivos los viernes**, salvo aprobacion extraordinaria del Coordinador de la Fabrica de Software y/o el DevOps encargado.

---

## Notas adicionales

- No se despliegan aplicaciones en produccion sin el [checklist de paso a produccion](https://vsdocs.cunapp.pro/doc/checklist-paso-a-produccion-de-app-oLfWOcIlSP) aprobado por el lider tecnico.
- El enlace al **Swagger** de la aplicacion debe estar registrado en el [inventario de aplicaciones](https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm).
- El inventario debe estar actualizado para agilizar despliegue y pruebas.
- El desarrollador debe validar que la funcionalidad este completa y exitosa tras el despliegue productivo; cualquier novedad se reporta inmediatamente al DevOps encargado.

---

## Checklist rapido pre-despliegue backend

- [ ] `Dockerfile` funcional con imagen AWS del Tech Lead.
- [ ] Oracle: `instant-client` incluido, host apuntando a `cundb01` (si aplica).
- [ ] `sonar-project.properties` presente.
- [ ] `main.yml` de CI/CD presente.
- [ ] `docker-compose.yml` excluido del repositorio.
- [ ] `*.sh` en `.gitignore`.
- [ ] Variables de entorno sanitizadas (SNAKE_CASE, sin comillas, ordenadas).
- [ ] Codigo en la rama correcta segun el ambiente.
- [ ] PR creado hacia la rama destino.
- [ ] Swagger registrado en inventario de aplicaciones.
- [ ] Checklist de paso a produccion aprobado (solo para PRO).
