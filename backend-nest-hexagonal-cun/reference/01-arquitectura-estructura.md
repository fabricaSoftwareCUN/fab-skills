# Arquitectura y estructura base

## Objetivo

Definir la organización principal de un backend NestJS usando Arquitectura Hexagonal.

## Capas principales

### Domain

Es el núcleo del sistema. Contiene reglas de negocio, entidades, DTOs internos, enums, types e interfaces de repositorio.

No debe depender de tecnologías externas.

### Application

Contiene los casos de uso. Orquesta el flujo de negocio usando entidades, DTOs del dominio, puertos e interfaces.

No debe conocer implementaciones concretas.

### Infrastructure

Contiene los detalles técnicos del sistema: HTTP, controladores, validaciones, Swagger, persistencia, adaptadores, configuración, logger y conexiones externas.

## Regla de dependencias

Las dependencias deben apuntar siempre hacia el centro:

```text
Infrastructure → Application → Domain
```

Reglas:

- Infrastructure puede importar Application y Domain.
- Application puede importar Domain.
- Domain no puede importar Application ni Infrastructure.
- Los detalles técnicos deben permanecer fuera de Domain.

## Estructura base obligatoria

```text
src/
├── domain/
├── application/
└── infrastructure/
    ├── settings/
    └── common/
```

## Módulos principales

### AppModule

Responsabilidades:

- Importar `InfrastructureModule` primero.
- Importar `ApplicationModule` después.
- No configurar `ConfigModule` directamente.

### InfrastructureModule

Responsabilidades:

- Ser global.
- Configurar `ConfigModule` con `isGlobal: true`.
- Registrar providers de base de datos.
- Cargar configuración global.
- Importar y exportar módulos de infraestructura.

### ApplicationModule

Responsabilidades:

- Ser global.
- Importar módulos de aplicación.
- Exportar servicios de aplicación.
- Mantener disponibles los casos de uso para infraestructura.

## Carpetas obligatorias

Deben existir siempre:

```text
src/domain
src/application
src/infrastructure
src/infrastructure/settings
src/infrastructure/common
src/infrastructure/common/adapters
src/infrastructure/common/decorators
src/infrastructure/common/guards
src/infrastructure/common/interceptors
src/infrastructure/common/utils
```

## Reglas críticas

- `InfrastructureModule` y `ApplicationModule` deben estar disponibles globalmente cuando el proyecto lo requiera.
- `ConfigModule.forRoot()` debe estar únicamente en infraestructura.
- `AppModule` no debe configurar variables de entorno.
- `InfrastructureModule` debe importarse antes que `ApplicationModule`.
- Los módulos específicos deben exportarse cuando otros módulos los necesiten.
