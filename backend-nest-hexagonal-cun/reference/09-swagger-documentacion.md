# Swagger y documentación API

## Responsabilidad

Documentar la API HTTP desde la capa Infrastructure.

## Ubicación

Swagger debe usarse únicamente en infraestructura, principalmente en:

```text
infrastructure/{module}/controllers/
infrastructure/{module}/controllers/dto/
infrastructure/settings/docs/
```

## DTOs de infraestructura

Deben documentar:

- Descripción de campos.
- Ejemplos.
- Formatos.
- Restricciones.
- Campos obligatorios.
- Campos opcionales.
- Validaciones esperadas.

## Controladores

Deben documentar:

- Agrupación por tags.
- Operación de cada endpoint.
- Respuestas exitosas.
- Respuestas de error.
- Estados HTTP.
- Autenticación cuando aplique.
- Versionamiento del endpoint.

## Reglas

- Swagger no debe usarse en Domain.
- Swagger no debe usarse en Application.
- La documentación debe reflejar los DTOs de infraestructura.
- Los errores esperados deben estar documentados.
- Los endpoints deben tener descripción funcional clara.

## Configuración global de Swagger

Debe ubicarse en:

```text
infrastructure/settings/docs/
```

Debe definir:

- Título de la API.
- Descripción.
- Versión.
- Seguridad.
- Prefijo global si aplica.
- Ruta de documentación.
