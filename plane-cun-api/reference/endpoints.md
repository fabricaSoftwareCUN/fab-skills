# Endpoints - Plane API (workspace vsd)

Referencia completa de endpoints organizados alfabéticamente por recurso.
Base URL: `https://proyectos.cunapp.pro/api/v1/`

---

## Attachments

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar adjuntos | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/attachments/` | GET |
| Obtener credenciales de upload | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/attachments/upload-credentials/` | GET |

---

## Comments

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar comentarios | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/comments/` | GET |
| Crear comentario | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/comments/` | POST |
| Actualizar comentario | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/comments/{comment_id}/` | PATCH |
| Eliminar comentario | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/comments/{comment_id}/` | DELETE |

---

## Cycles

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar ciclos | `/workspaces/{workspace_slug}/projects/{project_id}/cycles/` | GET |
| Crear ciclo | `/workspaces/{workspace_slug}/projects/{project_id}/cycles/` | POST |
| Obtener ciclo | `/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/` | GET |
| Actualizar ciclo | `/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/` | PATCH |
| Eliminar ciclo | `/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/` | DELETE |
| Agregar items a ciclo | `/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/cycle-issues/` | POST |
| Archivar ciclo | `/workspaces/{workspace_slug}/projects/{project_id}/cycles/{cycle_id}/archive/` | POST |

---

## Epics

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar epics | `/workspaces/{workspace_slug}/projects/{project_id}/epics/` | GET |
| Crear epic | `/workspaces/{workspace_slug}/projects/{project_id}/epics/` | POST |
| Obtener epic | `/workspaces/{workspace_slug}/projects/{project_id}/epics/{epic_id}/` | GET |
| Actualizar epic | `/workspaces/{workspace_slug}/projects/{project_id}/epics/{epic_id}/` | PATCH |
| Eliminar epic | `/workspaces/{workspace_slug}/projects/{project_id}/epics/{epic_id}/` | DELETE |

---

## Labels

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar labels | `/workspaces/{workspace_slug}/projects/{project_id}/labels/` | GET |
| Crear label | `/workspaces/{workspace_slug}/projects/{project_id}/labels/` | POST |
| Obtener label | `/workspaces/{workspace_slug}/projects/{project_id}/labels/{label_id}/` | GET |
| Actualizar label | `/workspaces/{workspace_slug}/projects/{project_id}/labels/{label_id}/` | PATCH |
| Eliminar label | `/workspaces/{workspace_slug}/projects/{project_id}/labels/{label_id}/` | DELETE |

---

## Members

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar miembros del workspace | `/workspaces/{workspace_slug}/members/` | GET |
| Listar miembros de proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/members/` | GET |

---

## Milestones

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar milestones | `/workspaces/{workspace_slug}/projects/{project_id}/milestones/` | GET |
| Crear milestone | `/workspaces/{workspace_slug}/projects/{project_id}/milestones/` | POST |
| Obtener milestone | `/workspaces/{workspace_slug}/projects/{project_id}/milestones/{milestone_id}/` | GET |
| Actualizar milestone | `/workspaces/{workspace_slug}/projects/{project_id}/milestones/{milestone_id}/` | PATCH |
| Eliminar milestone | `/workspaces/{workspace_slug}/projects/{project_id}/milestones/{milestone_id}/` | DELETE |

---

## Modules

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar módulos | `/workspaces/{workspace_slug}/projects/{project_id}/modules/` | GET |
| Crear módulo | `/workspaces/{workspace_slug}/projects/{project_id}/modules/` | POST |
| Obtener módulo | `/workspaces/{workspace_slug}/projects/{project_id}/modules/{module_id}/` | GET |
| Actualizar módulo | `/workspaces/{workspace_slug}/projects/{project_id}/modules/{module_id}/` | PATCH |
| Eliminar módulo | `/workspaces/{workspace_slug}/projects/{project_id}/modules/{module_id}/` | DELETE |
| Agregar items a módulo | `/workspaces/{workspace_slug}/projects/{project_id}/modules/{module_id}/module-issues/` | POST |

---

## Pages

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar páginas del workspace | `/workspaces/{workspace_slug}/pages/` | GET |
| Crear página del workspace | `/workspaces/{workspace_slug}/pages/` | POST |
| Listar páginas de proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/pages/` | GET |
| Crear página de proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/pages/` | POST |

---

## Projects

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar proyectos | `/workspaces/{workspace_slug}/projects/` | GET |
| Crear proyecto | `/workspaces/{workspace_slug}/projects/` | POST |
| Obtener proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/` | GET |
| Actualizar proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/` | PATCH |
| Archivar proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/archive/` | POST |
| Desarchivar proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/unarchive/` | POST |
| Eliminar proyecto | `/workspaces/{workspace_slug}/projects/{project_id}/` | DELETE |

---

## States

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar estados | `/workspaces/{workspace_slug}/projects/{project_id}/states/` | GET |
| Crear estado | `/workspaces/{workspace_slug}/projects/{project_id}/states/` | POST |
| Obtener estado | `/workspaces/{workspace_slug}/projects/{project_id}/states/{state_id}/` | GET |
| Actualizar estado | `/workspaces/{workspace_slug}/projects/{project_id}/states/{state_id}/` | PATCH |
| Eliminar estado | `/workspaces/{workspace_slug}/projects/{project_id}/states/{state_id}/` | DELETE |

---

## Work Item Types

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar tipos | `/workspaces/{workspace_slug}/projects/{project_id}/work-item-types/` | GET |
| Crear tipo | `/workspaces/{workspace_slug}/projects/{project_id}/work-item-types/` | POST |

---

## Work Items (Issues)

| Operación | Endpoint | Método |
|-----------|----------|--------|
| Listar work items | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/` | GET |
| Crear work item | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/` | POST |
| Obtener work item | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/` | GET |
| Actualizar work item | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/` | PATCH |
| Eliminar work item | `/workspaces/{workspace_slug}/projects/{project_id}/work-items/{work_item_id}/` | DELETE |
| Buscar work items | `/workspaces/{workspace_slug}/search-work-items/` | GET |
