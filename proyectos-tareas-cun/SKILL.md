---
name: proyectos-tareas-cun
description: Administración de workspaces en la instancia Plane de proyectos.cunapp.pro. Usa esta skill para gestionar proyectos, work items, ciclos, módulos, páginas, epics, labels, estados, y demás recursos del workspace.
license: MIT
---

## Prerequisitos

> **IMPORTANTE**: Esta skill requiere dos variables de entorno configuradas para funcionar.
>
> 1. **`PLANE_API_KEY`**: API Key válida de Plane.
> 2. **`PLANE_WORKSPACE_SLUG`**: Slug del workspace a administrar (ejemplo: `vsd`).
> 3. Sin ambos valores, **ninguna operación de esta skill funcionará**.

---

## Instancia self-hosted

> **ADVERTENCIA**: Esta instancia es self-hosted en `proyectos.cunapp.pro`.
>
> - **NO** usar `api.plane.so` ni ninguna URL del SaaS oficial de Plane. El token no funcionará.
> - **NO** existen endpoints de work-items a nivel workspace. Rutas como `/workspaces/{slug}/issues/` o `/workspaces/{slug}/work-items/` devuelven `Page not found`.
> - Los work-items **siempre** requieren un `project_id` en la ruta: `/workspaces/{slug}/projects/{project_id}/work-items/`.

---

## Configuración

| Parámetro | Valor |
|-----------|-------|
| Base URL  | `https://proyectos.cunapp.pro/api/v1/` |
| Workspace | Variable de entorno `PLANE_WORKSPACE_SLUG` |
| API Key   | Variable de entorno `PLANE_API_KEY` |

Antes de ejecutar cualquier operación, verifica que ambas variables estén definidas en este documento en la seccion de configuracion. Si alguna falta o es generica, solicítala al usuario.

---

## Reglas de uso estrictas

* Si falta alguno de estos datos (Responsable, Fechas, Módulo, Etiquetas), detén el proceso y pregunta al usuario.
* Al redactar la Descripción, utiliza un tono profesional y desglosa la tarea en puntos clave. El objetivo es que cualquier persona ajena al contexto pueda entender qué se debe hacer solo con leer el texto generado.

---

## Autenticación

Incluir en el header de cada request:

```
X-API-Key: $PLANE_API_KEY
```

---

## Verificación de conexión

Antes de cualquier operación, validar que la API key y la URL son correctas:

```bash
curl -s -o /dev/null -w "%{http_code}" \
  -H "X-API-Key: $PLANE_API_KEY" \
  "https://proyectos.cunapp.pro/api/v1/users/me/"
```

- **200**: conexión válida, proceder.
- **401/403**: token inválido o expirado. Solicitar una nueva API key al usuario.
- **Otro código**: problema de red o URL incorrecta.

Si la verificación falla, **no continuar** con otras operaciones.

---

## Flujo operativo recomendado

Para consultar tareas asignadas al usuario:

1. Verificar conexión con `GET /api/v1/users/me/` (obtiene `id` del usuario).
2. Listar proyectos con `GET /api/v1/workspaces/{slug}/projects/`.
3. Para cada proyecto, listar work-items: `GET /api/v1/workspaces/{slug}/projects/{project_id}/work-items/`.
4. Filtrar por `assignees` que contenga el `id` del usuario.

No existe un endpoint global para "todas las tareas del workspace". Siempre se itera por proyecto.

---

## Paginación

Parámetros opcionales:

* `per_page`: Número de items por página (default 100, max 100).
* `cursor`: Cursor para navegación entre páginas.

---

## Rate Limiting

* 60 requests por minuto.
* Headers de respuesta: `X-RateLimit-Remaining` y `X-RateLimit-Reset`.

---

## Ejemplos Rápidos

### Listar todos los proyectos del workspace

```bash
curl -X GET "https://proyectos.cunapp.pro/api/v1/workspaces/$PLANE_WORKSPACE_SLUG/projects/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

### Crear un proyecto

```bash
curl -X POST "https://proyectos.cunapp.pro/api/v1/workspaces/$PLANE_WORKSPACE_SLUG/projects/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Mi Proyecto", "identifier": "MP", "description": "Descripción del proyecto"}'
```

### Crear un work item

```bash
curl -X POST "https://proyectos.cunapp.pro/api/v1/workspaces/$PLANE_WORKSPACE_SLUG/projects/{project_id}/work-items/" \
  -H "X-API-Key: $PLANE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Nueva tarea", "description_html": "<p>Descripción</p>", "priority": "high"}'
```

### Listar ciclos de un proyecto

```bash
curl -X GET "https://proyectos.cunapp.pro/api/v1/workspaces/$PLANE_WORKSPACE_SLUG/projects/{project_id}/cycles/" \
  -H "X-API-Key: $PLANE_API_KEY"
```

---

## Referencia local

| Archivo | Descripción |
|---------|-------------|
| [endpoints.md](./reference/endpoints.md) | Referencia completa de endpoints organizados por recurso. |

## Referencia externa

Documentación oficial: https://developers.plane.so/api-reference/introduction
