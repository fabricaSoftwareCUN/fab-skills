# Capa Application

## Responsabilidad

La capa Application contiene los casos de uso del sistema. Su función es coordinar el dominio, ejecutar flujos de negocio y depender únicamente de contratos abstractos.

## Estructura

Conforme a STACK §3.2:

```text
application/
├── use-cases/<modulo>/
│   └── <accion>.use-case.ts
├── dtos/<modulo>/
│   └── <nombre>.dto.ts
└── mappers/
    └── <nombre>.mapper.ts
```

## Casos de uso

Ubicación:

```text
application/use-cases/<modulo>/
```

Reglas:

- Un caso de uso representa una acción del negocio.
- El nombre debe expresar una acción del negocio.
- Se nombran con sufijo `.use-case.ts` (por ejemplo: `create-user.use-case.ts`).
- Debe aplicar responsabilidad única.
- Debe inyectar interfaces, no implementaciones concretas.
- Puede usar entidades, DTOs e interfaces del dominio.
- Puede usar puertos para capacidades externas.
- No debe conocer controladores, entidades TypeORM, SDKs o APIs concretas.
- Debe retornar DTOs del dominio o respuestas propias del caso de uso.

## DTOs de aplicación

Ubicación:

```text
application/dtos/<modulo>/
```

Reglas:

- Unico juego de DTOs para toda la aplicacion (R27); los controladores de infraestructura reutilizan estos DTOs, no se duplican en infraestructura.
- Representan estructuras de datos para la comunicación entre capas.
- Decorados con `class-validator` y `class-transformer` para validación técnica.
- Decorados con `@ApiProperty` de `@nestjs/swagger` para documentación.
- Deben incluir solo propiedades necesarias para el caso de uso.
- Se nombran con sufijo `.dto.ts`.

## Mappers de aplicación

Ubicación:

```text
application/mappers/
```

Reglas:

- Transforman datos entre la frontera de infraestructura y el dominio.
- No contienen lógica de negocio.
- No deben consultar bases de datos.
- No deben llamar servicios externos.
- Deben hacer conversiones explícitas y controladas.
- Se nombran con sufijo `.mapper.ts`.

## Dependencias permitidas

Application puede depender de:

- Domain.
- Puertos propios (definidos en `domain/ports/out/` o `domain/ports/in/`).
- Mappers de aplicación.
- Decoradores mínimos de NestJS para inyección.

## Prohibiciones

- Inyectar repositorios concretos.
- Importar entidades de persistencia.
- Usar TypeORM directamente.
- Implementar lógica HTTP.
- Manejar validaciones de entrada propias de controladores.
- Consumir SDKs externos directamente.
