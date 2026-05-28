# Settings, configuración y bases de datos

## Responsabilidad

Centralizar configuración global, variables de entorno, conexiones de base de datos, logger y documentación técnica.

## Ubicación obligatoria

```text
infrastructure/settings/
```

## Estructura recomendada

```text
settings/
├── config.ts
├── interfaces/
├── databases/
├── docs/
└── logger/
```

## Configuración general

Reglas:

- Las variables de entorno deben centralizarse en settings.
- `ConfigModule.forRoot()` debe configurarse solo en `InfrastructureModule`.
- La configuración debe estar disponible globalmente cuando aplique.
- `AppModule` no debe gestionar configuración de entorno.
- Las interfaces de configuración deben tipar los valores usados por la aplicación.

## Bases de datos soportadas

La skill contempla:

- PostgreSQL.
- MSSQL.
- Oracle.
- Múltiples conexiones de base de datos.

## PostgreSQL

Uso recomendado:

- Nuevos proyectos.
- Servicios transaccionales modernos.
- Backends donde se requiera estabilidad y compatibilidad amplia con TypeORM.

Reglas:

- Configurar host, puerto, usuario, contraseña y base de datos por variables de entorno.
- Mantener entidades de persistencia separadas del dominio.
- Evitar sincronización automática en producción.

## MSSQL

Uso recomendado:

- Integración con sistemas heredados.
- Ambientes corporativos que ya usan SQL Server.

Reglas:

- Considerar configuración de certificados.
- Usar tipos compatibles con SQL Server.
- Declarar esquemas cuando aplique.

## Oracle

Uso recomendado:

- Integraciones corporativas.
- Sistemas institucionales o legados que usen Oracle.

Reglas:

- Usar driver compatible de Oracle.
- Configurar `SERVICE_NAME` cuando aplique.
- Considerar nombres en mayúscula por defecto.
- Usar tipos propios de Oracle cuando sea necesario.

## Múltiples bases de datos

Reglas:

- Centralizar la selección de conexión en settings.
- Usar variables de entorno para definir el tipo de base de datos.
- Evitar que Domain y Application conozcan la base de datos concreta.
- Mantener entidades específicas por motor si los tipos o esquemas cambian.

## Logger

Reglas:

- La configuración de logger debe vivir en `settings/logger`.
- Debe ser reusable por infraestructura.
- No debe contaminar el dominio.

## Documentación técnica

Reglas:

- La configuración de Swagger debe vivir en `settings/docs`.
- Debe configurarse desde infraestructura.
- No debe estar en Domain ni Application.
