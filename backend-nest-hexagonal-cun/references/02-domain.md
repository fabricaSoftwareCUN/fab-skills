# Capa Domain

## Responsabilidad

La capa Domain representa el negocio puro. Debe contener las reglas, entidades y contratos esenciales del sistema sin depender de frameworks ni infraestructura.

## Estructura por módulo

```text
domain/{module}/
├── class/
├── dto/
├── enums/
├── repositories/
└── types/
```

## Entidades de dominio

Ubicación:

```text
domain/{module}/class/
```

Reglas:

- Usar clases puras de TypeScript.
- Usar PascalCase en nombres de clases y archivos.
- No usar decoradores de TypeORM.
- No usar decoradores de validación.
- No usar decoradores de Swagger.
- No inyectar dependencias.
- Encapsular propiedades cuando aplique.
- Usar métodos de creación para controlar instanciación.
- Incluir reglas propias del dominio.
- Usar getters para propiedades calculadas o controladas.

## DTOs de dominio

Ubicación:

```text
domain/{module}/dto/
```

Reglas:

- Representan estructuras internas del negocio.
- No contienen validaciones técnicas.
- No contienen documentación Swagger.
- Deben ser interfaces o type aliases cuando sea posible.
- Deben incluir solo propiedades necesarias para el dominio.
- No deben representar directamente contratos HTTP.

## Enums de dominio

Ubicación:

```text
domain/{module}/enums/
```

Reglas:

- Representan estados, tipos o categorías del negocio.
- No deben depender de valores técnicos externos.
- Deben tener nombres claros y asociados al lenguaje del dominio.

## Types auxiliares

Ubicación:

```text
domain/{module}/types/
```

Reglas:

- Definen tipos internos reutilizables.
- Pueden representar filtros, criterios de búsqueda o estructuras del dominio.
- No deben contener detalles de infraestructura.

## Interfaces de repositorio

Ubicación:

```text
domain/{module}/repositories/
```

Reglas:

- Usar prefijo `I`.
- Definir contratos de persistencia desde la perspectiva del dominio.
- Retornar entidades o DTOs del dominio.
- No mencionar TypeORM, SQL, HTTP, SDKs ni tecnología concreta.
- No retornar entidades de infraestructura.

## Prohibiciones

- Importar NestJS.
- Importar TypeORM.
- Importar Swagger.
- Importar class-validator.
- Usar entidades de base de datos como entidades de dominio.
- Incluir lógica de infraestructura.
