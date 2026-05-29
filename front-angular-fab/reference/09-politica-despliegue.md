# 09 - Politica de despliegue para aplicaciones frontend

> Fuente: [Politica de despliegue para aplicaciones](https://vsdocs.cunapp.pro/doc/politica-de-despliegue-para-aplicaciones-BvLUFkkCQw) en Outline.

---

## Requisitos obligatorios antes de solicitar despliegue

### Dockerizacion

- El proyecto DEBE contar con un `Dockerfile` funcional y probado.
- Usar la imagen publica de AWS suministrada por el **Tech Lead**.

```dockerfile
# Ejemplo base frontend Angular
FROM <imagen-publica-aws-tech-lead>

COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

### CI/CD y calidad

- Incluir archivos de configuracion de **SonarQube** (`sonar-project.properties`).
- Incluir el archivo `main.yml` para la integracion del CI/CD (GitHub Actions).

### Seguridad y Git

| Archivo/patron | Regla |
|---|---|
| `docker-compose.yml` | **NO** debe subirse al repositorio |
| `*.sh` | Agregar al `.gitignore` |
| Variables de entorno | Gestionadas via `environments/` de Angular, NUNCA hardcodeadas |

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

Aunque en Angular las variables se manejan a traves de `environments/`, cuando se requieran variables de entorno a nivel de contenedor o CI/CD deben cumplir:

1. **Formato**: `SNAKE_CASE` (mayusculas y guiones bajos).
2. **Sin espacios** ni saltos de linea que rompan la interpretacion.
3. **Sin comillas innecesarias** que Docker o Linux procesen como parte del valor.
4. **Orden logico por categorias**: Configuracion de Red, URLs de APIs, Keys, etc.
5. **Legibilidad**: las variables deben ser claras y autoexplicativas.

Ejemplo correcto:

```env
# Configuracion del build
NODE_ENV=production
APP_BASE_HREF=/

# URLs de APIs
API_BASE_URL=https://api.cunapp.pro
API_TIMEOUT_MS=10000

# Feature flags
ENABLE_ANALYTICS=true
```

---

## Proceso de solicitud

### Primera vez (implementacion de ambiente nuevo)

Enviar **correo electronico** con:

- Nombre del proyecto.
- Nombre del repositorio.
- Variables de entorno (sanitizadas segun la seccion anterior).
- Ambiente destino.
- Requisitos tecnicos.
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
- La URL del frontend debe estar registrada en el [inventario de aplicaciones](https://vsdocs.cunapp.pro/doc/lista-de-aplicaciones-RDVFHUzKnm).
- El inventario debe estar actualizado para agilizar despliegue y pruebas.
- El desarrollador debe validar que la funcionalidad este completa y exitosa tras el despliegue productivo; cualquier novedad se reporta inmediatamente al DevOps encargado.

---

## Checklist rapido pre-despliegue frontend

- [ ] `Dockerfile` funcional con imagen AWS del Tech Lead.
- [ ] `sonar-project.properties` presente.
- [ ] `main.yml` de CI/CD presente.
- [ ] `docker-compose.yml` excluido del repositorio.
- [ ] `*.sh` en `.gitignore`.
- [ ] Variables de entorno sanitizadas (SNAKE_CASE, sin comillas, ordenadas).
- [ ] Environments de Angular configurados para el ambiente destino.
- [ ] Codigo en la rama correcta segun el ambiente.
- [ ] PR creado hacia la rama destino.
- [ ] URL del frontend registrada en inventario de aplicaciones.
- [ ] Checklist de paso a produccion aprobado (solo para PRO).
