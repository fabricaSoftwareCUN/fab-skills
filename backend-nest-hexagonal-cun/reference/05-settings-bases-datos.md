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
├── env.validation.ts      # clase de validación con class-validator/class-transformer
├── interfaces/
├── databases/
├── docs/
└── logger/
```

## Configuración general

Reglas:

- Las variables de entorno deben centralizarse en settings.
- `ConfigModule.forRoot({ isGlobal: true })` debe configurarse solo en `InfrastructureModule`.
- La configuración debe estar disponible globalmente cuando aplique.
- `AppModule` no debe gestionar configuración de entorno.
- Las interfaces de configuración deben tipar los valores usados por la aplicación.
- Validación al arranque con `@nestjs/config` + clase de validación que usa `class-validator` y `class-transformer` (STACK §3.4).

Ejemplo de clase de validación:

```typescript
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;
}
```

## Bases de datos soportadas

La skill contempla:

- PostgreSQL 19 (estándar principal).
- Oracle (integraciones corporativas).
- Múltiples conexiones de base de datos.

## PostgreSQL 19

Uso recomendado:

- Nuevos proyectos.
- Servicios transaccionales modernos.
- Backends donde se requiera estabilidad y compatibilidad amplia con TypeORM.

Reglas:

- Configurar host, puerto, usuario, contraseña y base de datos por variables de entorno.
- Mantener entidades de persistencia separadas del dominio.
- Evitar sincronización automática en producción (`synchronize: false` siempre).
- TypeORM 1.x con `@nestjs/typeorm` 12.

### Migraciones TypeORM

El esquema de la base de datos debe gestionarse exclusivamente a través de migraciones de TypeORM. La opción `synchronize: true` está estrictamente prohibida en todos los entornos.

Flujo de trabajo obligatorio:

1. **Generar** migración: `npx typeorm migration:generate src/infrastructure/persistence/postgres/migrations/<NombreMigracion> -d src/infrastructure/settings/databases/data-source.ts`.
2. **Revisar** la migración generada antes de aplicarla.
3. **Aplicar** en el despliegue: `npx typeorm migration:run -d src/infrastructure/settings/databases/data-source.ts`.
4. **Revertir** cuando sea necesario: `npx typeorm migration:revert -d src/infrastructure/settings/databases/data-source.ts`.

### Parámetros de producción PostgreSQL (STACK §6.1)

Los parámetros clave en `postgresql.conf` que deben ajustarse para entornos de producción:

- `shared_buffers`: valor inicial del **25 % de la RAM total** del servidor para el caché de PostgreSQL.
- `work_mem`: aumentar para permitir que operaciones complejas de ordenamiento y joins se realicen en memoria, evitando escrituras lentas a disco.
- `maintenance_work_mem`: asignar una cantidad generosa de memoria para operaciones de mantenimiento como `VACUUM` y `CREATE INDEX`.

### Optimización de consultas

- Hacer uso de índices en columnas utilizadas frecuentemente en cláusulas `WHERE`, `JOIN` y `ORDER BY`.
- Para consultas complejas, es obligatorio analizar su plan de ejecución utilizando `EXPLAIN ANALYZE`.

## Redis (cache)

Para mejorar el rendimiento y reducir la carga sobre la base de datos, se utiliza Redis como sistema de caché en memoria (STACK §6.2).

- Casos de uso: datos que se leen con mucha frecuencia pero cambian con poca frecuencia (configuraciones, catálogos, perfiles de usuario, resultados de consultas pesadas).
- Implementación en NestJS: `CacheModule` de `@nestjs/cache-manager` configurado con el driver de Redis.
- Decoradores: `@CacheTTL` y `@CacheKey` para gestionar el ciclo de vida de los datos en caché de forma declarativa.

## Seguridad de la base de datos (STACK §6.3)

- **Principio de mínimo privilegio:** los roles de base de datos deben tener únicamente los permisos estrictamente necesarios para operar. Un servicio que solo lee datos no debe tener permisos de `INSERT`, `UPDATE` o `DELETE`.
- **Encriptación en tránsito:** todas las conexiones a la base de datos deben ser obligatoriamente encriptadas usando SSL/TLS.
- **Encriptación en reposo:** para datos altamente sensibles (información personal identificable, credenciales), utilizar la extensión `pgcrypto` de PostgreSQL para encriptar los datos a nivel de columna.
- **Plan de respaldo y recuperación:** respaldos lógicos regulares con `pg_dump` y archivado continuo de Write-Ahead Logging (WAL) para permitir Point-in-Time Recovery (PITR).

## Oracle

Uso recomendado:

- Integraciones corporativas.
- Sistemas institucionales o legados que usen Oracle.

Reglas:

- Usar driver compatible de Oracle.
- Configurar `SERVICE_NAME` cuando aplique.
- Considerar nombres en mayúscula por defecto.
- Usar tipos propios de Oracle cuando sea necesario.
- Incluir `instant-client` en el Dockerfile y apuntar el host al DNS `cundb01` (PROC-DEP).

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
- Swagger UI en `/docs/dev-only/swagger` con prefijo global `/api/v1`.
