# Flujo de petición y mapeo entre capas

## Objetivo

Definir cómo debe circular una solicitud desde HTTP hasta el dominio y de regreso a la respuesta, usando la estructura de STACK §3.2.

## Flujo estándar

```text
HTTP Request
↓
Controller (infrastructure/controllers/)
↓
DTO (application/dtos/<modulo>/)  ← unico juego de DTOs (R27)
↓
Mapper hacia dominio (application/mappers/)
↓
Use Case (application/use-cases/<modulo>/)
↓
Domain Service / Domain Entity (domain/services/, domain/entities/)
↓
Port Out (domain/ports/out/)
↓
Adapter / Repository Implementation (infrastructure/adapters/)
↓
ORM Entity (infrastructure/persistence/<motor>/entities/)
↓
Mapper hacia dominio o respuesta (application/mappers/)
↓
HTTP Response
```

## Reglas del flujo

- El controlador solo recibe, valida y delega.
- La validación técnica ocurre en DTOs (decorados con `class-validator`/`class-transformer`).
- La transformación de datos ocurre en mappers.
- El caso de uso se ejecuta en Application.
- Las reglas del negocio viven en Domain y Application.
- La persistencia concreta se ejecuta en Infrastructure.
- La respuesta debe pasar por un modelo controlado, no por entidades de base de datos.

## Mappers entre capas

Los mappers son obligatorios para evitar acoplamiento.

Deben existir cuando se transformen:

- DTO HTTP a DTO de dominio.
- Entidad de persistencia (`.orm-entity.ts`) a entidad de dominio.
- Entidad de dominio a entidad de persistencia.
- Resultado del caso de uso a DTO de respuesta.

## Reglas para mappers

- No contienen reglas de negocio.
- No consultan bases de datos.
- No consumen APIs externas.
- No validan permisos.
- Solo transforman estructuras de datos.
- Se nombran con sufijo `.mapper.ts` y viven en `application/mappers/`.

## Flujo para creación de entidad

Secuencia conceptual:

1. Solicitud HTTP de creación.
2. Controlador recibe DTO de `application/dtos/<modulo>/` (R27).
3. DTO valida forma y tipos de entrada.
4. Mapper convierte a DTO de dominio.
5. Caso de uso ejecuta la lógica de aplicación.
6. Caso de uso consulta puertos de salida mediante interfaces.
7. Dominio aplica reglas de creación.
8. Adaptador de repositorio persiste datos (vía ORM entity).
9. Mapper transforma resultado.
10. Controlador responde.

## Flujo para consultas paginadas o filtradas

Secuencia conceptual:

1. Solicitud HTTP con query params.
2. Controlador recibe filtros.
3. DTO valida filtros de entrada.
4. Mapper convierte filtros a tipos de dominio.
5. Caso de uso aplica lógica de aplicación.
6. Adaptador de repositorio ejecuta consulta concreta.
7. Infraestructura mapea resultados a dominio.
8. Mapper transforma dominio a respuesta.
9. Controlador retorna respuesta paginada.
