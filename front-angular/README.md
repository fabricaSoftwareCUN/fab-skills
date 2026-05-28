# fab-soft-front-skills

Repositorio de skills y guías de referencia para el equipo Front Angular de la Fábrica de Software.

## Propósito

Este repositorio centraliza las convenciones, reglas de código, guías de testing y arquitecturas de referencia para asegurar consistencia y calidad en los proyectos Angular del equipo.

## Stack Tecnológico

- **Framework**: Angular 17+ (standalone components)
- **UI**: Angular Material + Bootstrap 5
- **Testing**: Jest
- **Estado**: Signals
- **TypeScript**: Strict mode

---

## Skills Disponibles

### angular-architect-fab

Guía de arquitectura para crear proyectos Angular con la **Arquitectura FAB** (Fábrica Architecture Base).

**Patrones incluidos:**

- Estructura de carpetas: `core/` + `shared/` + `modules/`
- Signal-based state management
- Functional HTTP interceptors
- Lazy loading con `loadComponent`
- inject() sobre constructor
- Guards de autenticación
- Mocks con Faker-js

**Contenido:**

- `skills/angular-architect-fab/SKILL.md` - Guía completa para agentes

### angular-jest-testing

Guías y reglas para testing unitario con Jest en Angular 17+.

**Incluye:**

- Configuración de tests
- Patrones de mocks y data generators con `@faker-js/faker`
- HTTP testing (HttpClient, httpResource)
- Validación de templates y formularios
- Manejo de efectos y errores reactivos
- Patrón `provideHttpClient()` + `provideHttpClientTesting()`

---

## Uso para Agentes

Consulta `AGENTS.md` para las convenciones que deben seguir los agentes de código en este workspace.

### Cargar una Skill

```bash
# En opencode, usar el comando /skill:
/skill angular-architect-fab
/skill angular-jest-testing
```

### Crear Nuevo Proyecto

1. Cargar skill `angular-architect-fab`
2. Proporcionar contexto del proyecto (APIs, módulos, integraciones)
3. El agente generará la estructura completa

---

## Comandos Comunes

```bash
npm run test          # Ejecutar tests
npm run lint         # Verificar código
npm run build        # Build de producción
npm run typecheck    # Verificación de tipos
```
