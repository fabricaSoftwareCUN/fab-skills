# Flujo de petición y mapeo entre capas

## Objetivo

Definir cómo debe circular una solicitud desde HTTP hasta el dominio y de regreso a la respuesta.

## Flujo estándar

```text
HTTP Request
↓
Controller
↓
DTO de infraestructura
↓
Mapper hacia dominio
↓
Application Service
↓
Domain / Ports / Repository Interfaces
↓
Infrastructure Adapter o Repository Implementation
↓
Mapper hacia dominio o respuesta
↓
HTTP Response
```

## Reglas del flujo

- El controlador solo recibe, valida y delega.
- La validación técnica ocurre en DTOs de infraestructura.
- La transformación de datos ocurre en mappers.
- El caso de uso se ejecuta en Application.
- Las reglas del negocio viven en Domain y Application.
- La persistencia concreta se ejecuta en Infrastructure.
- La respuesta debe pasar por un modelo controlado, no por entidades de base de datos.

## Mappers entre capas

Los mappers son obligatorios para evitar acoplamiento.

Deben existir cuando se transformen:

- DTO HTTP a DTO de dominio.
- Entidad de persistencia a entidad de dominio.
- Entidad de dominio a entidad de persistencia.
- Resultado del caso de uso a DTO de respuesta.

## Reglas para mappers

- No contienen reglas de negocio.
- No consultan bases de datos.
- No consumen APIs externas.
- No validan permisos.
- Solo transforman estructuras de datos.

## Flujo para creación de entidad

Secuencia conceptual:

1. Solicitud HTTP de creación.
2. Controlador recibe DTO de infraestructura.
3. DTO valida forma y tipos de entrada.
4. Mapper convierte a DTO de dominio.
5. Servicio de aplicación ejecuta el caso de uso.
6. Servicio consulta repositorios o puertos mediante interfaces.
7. Dominio aplica reglas de creación.
8. Repositorio concreto persiste datos.
9. Mapper transforma resultado.
10. Controlador responde.

## Flujo para consultas paginadas o filtradas

Secuencia conceptual:

1. Solicitud HTTP con query params.
2. Controlador recibe filtros.
3. DTO valida filtros de entrada.
4. Mapper convierte filtros a tipos de dominio.
5. Servicio de aplicación aplica caso de uso.
6. Repositorio ejecuta consulta concreta.
7. Infraestructura mapea resultados a dominio.
8. Mapper transforma dominio a respuesta.
9. Controlador retorna respuesta paginada.
