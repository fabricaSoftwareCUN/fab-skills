# Capa Application

## Responsabilidad

La capa Application contiene los casos de uso del sistema. Su función es coordinar el dominio, ejecutar flujos de negocio y depender únicamente de contratos abstractos.

## Estructura por módulo

```text
application/{module}/
├── {action}.service.ts
├── app-{module}.module.ts
├── ports/
└── mappers/
```

## Servicios de aplicación

Reglas:

- Un servicio debe representar un caso de uso.
- El nombre debe expresar una acción del negocio.
- Debe aplicar responsabilidad única.
- Debe inyectar interfaces, no implementaciones concretas.
- Puede usar entidades, DTOs e interfaces del dominio.
- Puede usar puertos para capacidades externas.
- No debe conocer controladores, entidades TypeORM, SDKs o APIs concretas.
- Debe retornar DTOs del dominio o respuestas propias del caso de uso.

## Puertos

Ubicación recomendada:

```text
application/{module}/ports/
application/common/ports/
```

Reglas:

- Definen contratos abstractos para servicios externos o capacidades técnicas.
- Se nombran por lo que hacen, no por la tecnología usada.
- No deben incluir detalles de implementación.
- Deben permitir que infraestructura implemente el comportamiento.

Ejemplos conceptuales de puertos:

- Servicio de autenticación de tokens.
- Servicio de cifrado.
- Servicio de correo.
- Servicio de almacenamiento.
- Cliente HTTP externo.
- Publicador de eventos.

## Mappers de aplicación

Ubicación:

```text
application/{module}/mappers/
```

Reglas:

- Transforman datos entre la frontera de infraestructura y el dominio.
- No contienen lógica de negocio.
- No deben consultar bases de datos.
- No deben llamar servicios externos.
- Deben hacer conversiones explícitas y controladas.

## Módulos de aplicación

Reglas:

- Deben registrar servicios de casos de uso.
- Deben exportar los servicios que infraestructura necesite.
- No deben declarar controladores.
- No deben configurar base de datos.
- No deben importar módulos de infraestructura.

## Dependencias permitidas

Application puede depender de:

- Domain.
- Puertos propios.
- Mappers de aplicación.
- Decoradores mínimos de NestJS para inyección.

## Prohibiciones

- Inyectar repositorios concretos.
- Importar entidades de persistencia.
- Usar TypeORM directamente.
- Implementar lógica HTTP.
- Manejar validaciones de entrada propias de controladores.
- Consumir SDKs externos directamente.
