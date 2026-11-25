# Capa Domain

## Responsabilidad

La capa Domain representa el negocio puro. Debe contener las reglas, entidades y contratos esenciales del sistema sin depender de frameworks ni infraestructura.

## Estructura

Conforme a STACK §3.2, el arbol minimo obligatorio es:

```text
domain/
├── entities/            # clases puras, sin decoradores de ORM
├── ports/
│   ├── in/              # opcional: contratos de casos de uso
│   └── out/             # contratos de repositorios y servicios externos
└── services/            # lógica de dominio pura
```

Cuando el proyecto tiene varios modulos se permiten subcarpetas por modulo (R26):

```text
domain/entities/<modulo>/
domain/services/<modulo>/
domain/ports/out/<modulo>/
application/use-cases/<modulo>/
application/dtos/<modulo>/
infrastructure/adapters/<tipo>/<modulo>/
infrastructure/controllers/<modulo>/
```

## Entidades de dominio

Ubicación:

```text
domain/entities/<modulo>/
```

Reglas:

- Usar clases puras de TypeScript.
- Los archivos usan kebab-case; las clases usan PascalCase.
- No usar decoradores de TypeORM.
- No usar decoradores de validación.
- No usar decoradores de Swagger.
- No inyectar dependencias.
- Encapsular propiedades cuando aplique.
- Usar métodos de creación para controlar instanciación.
- Incluir reglas propias del dominio.
- Usar getters para propiedades calculadas o controladas.

## Enums y types de dominio

Ubicación:

```text
domain/entities/<modulo>/
```

Reglas:

- Representan estados, tipos o categorías del negocio.
- No deben depender de valores técnicos externos.
- Deben tener nombres claros y asociados al lenguaje del dominio.
- Los types auxiliares definen estructuras internas reutilizables, filtros o criterios de búsqueda.
- No deben contener detalles de infraestructura.

## Puertos de salida (contratos de repositorio)

Ubicación:

```text
domain/ports/out/
```

Reglas:

- Definir contratos de persistencia desde la perspectiva del dominio.
- Retornar entidades o DTOs del dominio.
- No mencionar TypeORM, SQL, HTTP, SDKs ni tecnología concreta.
- No retornar entidades de infraestructura.
- Se nombran con sufijo `.repository.port.ts` (por ejemplo: `user.repository.port.ts`).

## Puertos de entrada (opcional)

Ubicación:

```text
domain/ports/in/
```

Reglas:

- Definen contratos de casos de uso cuando el proyecto los requiera.
- Son opcionales; la mayoría de proyectos solo necesitan puertos de salida.

## Servicios de dominio

Ubicación:

```text
domain/services/<modulo>/
```

Reglas:

- Contienen lógica de dominio pura que opera sobre las entidades.
- No dependen de frameworks, ORM, validadores ni Swagger.
- Se nombran con sufijo `.domain-service.ts` (por ejemplo: `user.domain-service.ts`).

## Prohibiciones

- Importar NestJS.
- Importar TypeORM.
- Importar Swagger.
- Importar class-validator.
- Usar entidades de base de datos como entidades de dominio.
- Incluir lógica de infraestructura.
