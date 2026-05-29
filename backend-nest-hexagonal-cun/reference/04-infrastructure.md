# Capa Infrastructure

## Responsabilidad

La capa Infrastructure adapta tecnologías externas hacia la aplicación. Contiene HTTP, persistencia, validaciones, documentación, configuración, repositorios concretos y adaptadores.

## Estructura por módulo

```text
infrastructure/{module}/
├── controllers/
├── persistence/
├── adapters/
└── infra-{module}.module.ts
```

## Controladores

Ubicación:

```text
infrastructure/{module}/controllers/
```

Reglas:

- Reciben solicitudes HTTP.
- Usan DTOs de infraestructura para entrada y salida.
- Delegan la ejecución a servicios de aplicación.
- Usan mappers para transformar datos.
- Documentan endpoints con Swagger.
- No contienen lógica de negocio.
- No acceden directamente a repositorios si el caso de uso pertenece a Application.

## DTOs de infraestructura

Ubicación:

```text
infrastructure/{module}/controllers/dto/
```

Reglas:

- Representan contratos HTTP.
- Usan validaciones con `class-validator`.
- Usan documentación con Swagger.
- Pueden diferir de los DTOs de dominio.
- Funcionan como primera línea de validación.

## Persistencia

Estructura recomendada:

```text
persistence/
├── entities/
├── mappers/
├── providers/
└── repositories/
```

## Entidades de persistencia

Reglas:

- Representan tablas, columnas y relaciones.
- Usan decoradores de TypeORM.
- No deben usarse como entidades de dominio.
- No deben retornarse directamente desde servicios de aplicación.
- Deben mapearse hacia entidades de dominio.

## Repositorios de infraestructura

Reglas:

- Implementan interfaces definidas hacia el centro.
- Usan TypeORM u otra tecnología concreta de persistencia.
- Transforman entidades de persistencia a entidades de dominio.
- Encapsulan consultas y detalles de almacenamiento.
- No exponen detalles técnicos a Application o Domain.

## Mappers de infraestructura

Reglas:

- Transforman persistencia hacia dominio.
- Transforman dominio hacia persistencia.
- No contienen reglas de negocio.
- Deben mantener aislados los modelos de base de datos.

## Adaptadores

Reglas:

- Implementan puertos definidos en Application.
- Encapsulan SDKs, APIs externas, servicios cloud o librerías técnicas.
- Deben ubicarse en infraestructura.
- Deben evitar que Application conozca detalles externos.

## Módulos de infraestructura

Reglas:

- Importan el módulo de aplicación correspondiente.
- Declaran controladores.
- Registran providers concretos.
- Vinculan interfaces con implementaciones.
- Exportan providers cuando otros módulos los necesitan.

## Prohibiciones

- Colocar reglas de negocio en controladores.
- Retornar entidades de persistencia directamente.
- Saltarse mappers.
- Hacer que Application dependa de infraestructura.
- Duplicar lógica de casos de uso en controladores.
