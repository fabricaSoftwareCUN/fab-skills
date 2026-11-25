# Common, adaptadores y recursos compartidos

## Responsabilidad

Centralizar recursos técnicos compartidos de infraestructura para evitar duplicación y mantener consistencia.

## Ubicación obligatoria

```text
infrastructure/common/
```

## Estructura recomendada

```text
common/
├── adapters/
├── decorators/
├── guards/
├── health/           # health check endpoint
├── interceptors/
├── metrics/          # Prometheus metrics
├── middleware/
├── pipes/
├── template/
├── utils/
└── infra-common.module.ts
```

## Adaptadores comunes

Ubicación:

```text
infrastructure/common/adapters/
```

Responsabilidad:

- Implementar puertos de `domain/ports/out/`.
- Encapsular integraciones técnicas reutilizables.
- Exponer servicios técnicos sin filtrar detalles hacia Application.

Ejemplos conceptuales:

- JWT.
- Cifrado.
- Correo.
- Almacenamiento de archivos.
- Clientes HTTP.
- Servicios cloud.

## Decoradores

Responsabilidad:

- Centralizar decoradores personalizados de infraestructura.
- Evitar repetir metadatos técnicos en controladores.
- Mantener separados los decoradores del dominio.

## Guards

Responsabilidad:

- Controlar autorización y autenticación.
- Proteger rutas.
- Validar permisos técnicos desde infraestructura.

## Interceptors

Responsabilidad:

- Manejar logging transversal.
- Transformar respuestas.
- Estandarizar errores.
- Medir tiempos o enriquecer contexto técnico.

## Middleware

Responsabilidad:

- Ejecutar lógica previa o transversal en solicitudes HTTP.
- Manejar trazabilidad, headers, contexto o procesamiento técnico.

## Pipes

Responsabilidad:

- Transformar y validar datos de entrada en controladores.
- Encapsular lógica de parseo y validación técnica reutilizable.

## Templates

Responsabilidad:

- Centralizar plantillas técnicas reutilizables.
- Usar principalmente para correos, reportes o respuestas externas.

## Utils

Responsabilidad:

- Alojar utilidades técnicas compartidas.
- Evitar que utilidades de infraestructura se mezclen con lógica de dominio.

## Módulo común

Reglas:

- Debe existir un módulo común de infraestructura.
- Debe registrar providers compartidos cuando aplique.
- Debe exportar componentes reutilizables que otros módulos necesiten.

---

## Métricas Prometheus (`common/metrics`)

### Configuración obligatoria

Todo backend debe exponer `GET /metrics` en formato Prometheus con las cuatro señales de oro y métricas de negocio (STACK §7, R12).

```typescript
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  PrometheusModule,
  makeCounterProvider,
  makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
import { MetricsInterceptor } from './metrics.interceptor';

@Module({
  imports: [
    PrometheusModule.register({
      path: '/metrics',
      defaultMetrics: { enabled: true },
    }),
  ],
  providers: [
    makeCounterProvider({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    }),
    makeHistogramProvider({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
    }),
    {
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
})
export class MetricsModule {}
```

Reglas:

- Usar `@willsoto/nestjs-prometheus` versión 7 con peer `@prometheus-io/client` 0.16.
- **No usar `prom-client`** directamente.
- El endpoint `/metrics` debe estar disponible para que Prometheus lo scrapee.
- Las métricas son parte de la Definition of Done; una funcionalidad no está completa hasta que su impacto pueda ser medido.

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Counter, Histogram } from '@prometheus-io/client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_requests_total')
    private readonly httpRequestsTotal: Counter,
    @InjectMetric('http_request_duration_seconds')
    private readonly httpRequestDuration: Histogram,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    // Fastify: request.routeOptions?.url; Express fallback: request.route?.path
    const route = request.routeOptions?.url ?? request.route?.path ?? 'unknown';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => this.recordMetrics(method, route, context, start)),
      catchError((error) => {
        this.recordMetrics(method, route, context, start, error);
        return throwError(() => error);
      }),
    );
  }

  private recordMetrics(
    method: string,
    route: string,
    context: ExecutionContext,
    start: number,
    error?: unknown,
  ): void {
    let statusCode = context.switchToHttp().getResponse().statusCode ?? 200;
    if (error) {
      statusCode = error instanceof HttpException ? error.getStatus() : 500;
    }
    const duration = (Date.now() - start) / 1000;
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
    this.httpRequestDuration.observe({ method, route, status_code: statusCode }, duration);
  }
}
```

### Cuatro señales de oro (STACK §7.2)

| Señal | Métrica | PromQL |
|---|---|---|
| Tráfico | `http_requests_total` | `sum(rate(http_requests_total[5m])) by (job, route)` |
| Errores (5xx) | `http_requests_total{status_code=~"5.."}` | `sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (job, route)` |
| Latencia p95/p99 | `http_request_duration_seconds` | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job, route))` |
| Saturación | `node_cpu_seconds_total`, `node_memory_MemAvailable_bytes` | desde `node_exporter` |

### Métricas de negocio (STACK §7.3)

Utilizar `Counter`, `Gauge` e `Histogram` de `@prometheus-io/client` para registrar eventos de negocio significativos.

Ejemplos:

```typescript
import { Counter, Gauge, Histogram } from '@prometheus-io/client';

// Counter: se incrementa con cada nuevo registro
export const usuariosRegistradosTotal = new Counter({
  name: 'usuarios_registrados_total',
  help: 'Total de usuarios registrados',
});

// Gauge: refleja el número total de cursos activos
export const cursosActivosActuales = new Gauge({
  name: 'cursos_activos_actuales',
  help: 'Número de cursos activos actualmente',
});

// Histogram: distribución de latencia en procesamiento de pagos
export const tiempoProcesamientoPagoSeconds = new Histogram({
  name: 'tiempo_procesamiento_pago_seconds',
  help: 'Tiempo de procesamiento de pagos en segundos',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});
```

### Dashboard de Métricas Estándar de CUN (STACK §7.3)

| Métrica | PromQL / Fuente | Tipo | Nivel | Objetivo / Alerta |
|---|---|---|---|---|
| Tasa de Peticiones | `sum(rate(http_requests_total[5m])) by (job)` | Counter | Sistema/APM | Alerta si cae un 50 % por debajo de la media de la semana anterior |
| Tasa de Errores (5xx) | `sum(rate(http_requests_total{status_code=~"5.."}[5m])) by (job)` | Counter | Sistema/APM | Alerta si es > 1 % del total de peticiones durante 5 minutos |
| Latencia P95 | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))` | Histogram | Sistema/APM | Alerta si > 500 ms durante 10 minutos |
| Uso de CPU | `100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[2m])) * 100)` | Gauge | Sistema/APM | Alerta si > 80 % sostenido durante 15 minutos |
| Tasa de Registros | `rate(usuarios_registrados_total[10m])` | Counter | Negocio/UX | Informativo. Monitorear tendencias |
| Finalización de Matrícula | (Eventos Frontend) / (Eventos Frontend) | Ratio | Negocio/UX | Alerta si la tasa cae un 20 % respecto a la línea base |
| Adopción de Nueva Feature | (Usuarios únicos de la feature) / (Usuarios activos totales) | Gauge | Negocio/UX | Objetivo: alcanzar un 15 % de adopción en el primer mes |

---

## Health check (`common/health`)

Todo backend debe exponer un endpoint de health check para verificación de disponibilidad (CHECK §6). Se usa `@nestjs/terminus` con `TerminusModule`, `HealthCheckService` e indicadores de dependencias críticas. El endpoint vive en `GET /health`, fuera del prefijo `/api/v1` (igual que `/metrics`).

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, TypeOrmModule],
  controllers: [HealthController],
})
export class HealthModule {}
```

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis-health.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.isHealthy('redis'),
    ]);
  }
}
```

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  private readonly redis: Redis;

  constructor(private readonly configService: ConfigService) {
    super();
    this.redis = new Redis({
      host: this.configService.get<string>('REDIS_HOST', 'localhost'),
      port: this.configService.get<number>('REDIS_PORT', 6379),
    });
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.redis.ping();
      return this.getStatus(key, true);
    } catch {
      return this.getStatus(key, false, { message: 'Redis not reachable' });
    }
  }
}
```

> Nota: `HealthIndicator` base class esta deprecada en Terminus 11 en favor de `HealthIndicatorService`.

Reglas:

- El endpoint debe verificar disponibilidad del servicio y sus dependencias críticas (base de datos, Redis).
- Debe ser liviano y no exponer información sensible.
- Debe estar registrado para monitoreo por Prometheus/Grafana.
- `GET /health` y `GET /metrics` quedan excluidos del prefijo global `/api/v1` via `app.setGlobalPrefix('api/v1', { exclude: ['metrics', 'health'] })` (ver 09-swagger-documentacion.md).
