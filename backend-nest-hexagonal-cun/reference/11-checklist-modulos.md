# Checklist de creación de módulos

## Objetivo

Verificar que cada nuevo módulo respete la arquitectura hexagonal.

## Domain

Validar:

- Existe carpeta del módulo en `domain`.
- Existe entidad o clase de dominio cuando el caso lo requiere.
- Existen DTOs internos del dominio.
- Existen enums o types si el negocio los necesita.
- Existe interfaz de repositorio si hay persistencia.
- La capa no importa frameworks ni infraestructura.

## Application

Validar:

- Existe carpeta del módulo en `application`.
- Existe servicio por cada caso de uso.
- Cada servicio tiene una única responsabilidad.
- Los servicios inyectan interfaces, no implementaciones.
- Existen puertos para capacidades externas.
- Existen mappers si se requiere transformación.
- Existe módulo de aplicación.
- El módulo exporta los servicios necesarios.

## Infrastructure

Validar:

- Existe carpeta del módulo en `infrastructure`.
- Existe controlador si el módulo expone HTTP.
- Existen DTOs de infraestructura con validaciones.
- Los DTOs están documentados con Swagger.
- Existen entidades de persistencia si hay base de datos.
- Existe repositorio concreto si hay persistencia.
- El repositorio implementa la interfaz del dominio.
- Existen mappers entre persistencia y dominio.
- Existen adaptadores si se implementan puertos externos.
- Existe módulo de infraestructura.
- El módulo importa el módulo de aplicación correspondiente.
- El módulo registra providers concretos.

## Flujo

Validar:

- El controlador delega al servicio de aplicación.
- El servicio ejecuta el caso de uso.
- El dominio contiene las reglas esenciales.
- La infraestructura implementa detalles técnicos.
- La respuesta no expone entidades de persistencia.
- No se saltan mappers entre capas.

## Configuración

Validar:

- Las variables de entorno están centralizadas.
- La base de datos se configura desde `settings`.
- Swagger se configura desde infraestructura.
- Logger se configura desde infraestructura.

## Resultado esperado

El módulo debe poder evolucionar sin que cambios en base de datos, HTTP o SDKs externos obliguen a modificar el dominio.
