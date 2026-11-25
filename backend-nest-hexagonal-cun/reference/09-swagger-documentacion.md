# Swagger y documentación API

## Responsabilidad

Documentar la API HTTP desde la capa Infrastructure, conforme a STACK §3.3 y R15.

## Ubicación

Swagger se usa en los controladores de infraestructura y en los DTOs de `application/dtos/<modulo>/` (R27):

```text
infrastructure/controllers/
application/dtos/<modulo>/
infrastructure/settings/docs/
```

## Configuración global

En `main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  // Prefijo global obligatorio; /metrics y /health quedan excluidos
  app.setGlobalPrefix('api/v1', { exclude: ['metrics', 'health'] });

  // Swagger UI en /docs/dev-only/swagger (R15)
  const config = new DocumentBuilder()
    .setTitle('API de la Fabrica de Software CUN')
    .setDescription('Documentacion de los servicios de la CUN')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/dev-only/swagger', app, document);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
```

Reglas:

- Prefijo global: `app.setGlobalPrefix('api/v1', { exclude: ['metrics', 'health'] })`.
- Swagger UI en `/docs/dev-only/swagger` via `SwaggerModule.setup('docs/dev-only/swagger', app, document)`.
- La URL de Swagger debe registrarse en el inventario de aplicaciones (INV).

## Decoradores obligatorios (R15)

| Decorador | Uso |
|---|---|
| `@ApiTags('Usuarios')` | Agrupar endpoints por recurso en el controlador |
| `@ApiOperation({ summary: 'Crea un nuevo usuario' })` | Describir la acción del endpoint |
| `@ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })` | Documentar las posibles respuestas HTTP |
| `@ApiProperty()` | En los DTOs para describir cada campo y sus validaciones |

## DTOs

Los DTOs viven en `application/dtos/<modulo>/` y son decorados con `@ApiProperty` para documentar cada campo (R27). Los controladores de infraestructura reutilizan estos DTOs.

Deben documentar:

- Descripción de campos.
- Ejemplos.
- Formatos.
- Restricciones.
- Campos obligatorios.
- Campos opcionales.
- Validaciones esperadas.

## Controladores

Deben documentar:

- Agrupación por tags.
- Operación de cada endpoint.
- Respuestas exitosas.
- Respuestas de error.
- Estados HTTP.
- Autenticación cuando aplique.
- Versionamiento del endpoint.

## Reglas

- Swagger no debe usarse en Domain.
- La documentación debe reflejar los DTOs de `application/dtos/<modulo>/` (R27).
- Los errores esperados deben estar documentados.
- Los endpoints deben tener descripción funcional clara.
