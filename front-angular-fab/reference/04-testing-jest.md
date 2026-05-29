# Testing con Jest - Fabrica de Software CUN

## Framework: Jest

Todas las pruebas unitarias del proyecto se escriben con **Jest** (no Jasmine ni Karma).
Cubrir los siguientes artefactos:

- Componentes (standalone)
- Servicios
- Pipes
- Guards
- Interceptores

---

## Flujo de generacion de tests

### Paso 1 - Leer la implementacion

El agente **DEBE** leer el archivo de implementacion antes de escribir cualquier test.

| Artefacto   | Archivos a leer          |
|-------------|--------------------------|
| Componente  | `.component.ts` y `.html` |
| Servicio    | `.service.ts`            |
| Pipe        | `.pipe.ts`               |
| Guard       | `.guard.ts`              |
| Interceptor | `.interceptor.ts`        |

> **PROHIBIDO** generar tests sin haber analizado estos archivos primero.

### Paso 2 - Identificar dependencias

- Listar todas las dependencias inyectadas.
- Determinar cuales requieren mock y cuales pueden usar la implementacion real.
- Verificar si el artefacto usa `httpResource`, `effect()`, senales u observables.

### Paso 3 - Escribir tests

- Seguir las convenciones de archivo: `<nombre>.spec.ts`.
- Usar `describe` / `it` con descripciones en **espanol**.
- Cubrir caminos exitosos y de error.

---

## Cobertura

Minimo **85%** de cobertura por archivo.

Comando para verificar cobertura individual:

```bash
npm run test -- --coverage --collectCoverageFrom="**/file-name.ts" file-name.spec.ts
```

Comando para cobertura global:

```bash
npm run test:coverage
```

---

## Regla de animaciones

**NO** importar `NoopAnimationsModule` ni `BrowserAnimationsModule` en tests Jest.
Estos modulos dependen del DOM del navegador y fallan en el entorno de Jest.

Solucion — usar un mock directo:

```typescript
// En el TestBed del test
providers: [
  { provide: AnimationBuilder, useValue: {} }
]
```

---

## Reglas HTTP

Usar APIs modernas basadas en providers (Angular 16+).

### Configuracion correcta del TestBed

```typescript
TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    // ... otros providers
  ]
});
```

### Inyeccion del controlador

```typescript
const httpMock = TestBed.inject(HttpTestingController);
```

### Reglas estrictas

| Regla                                          | Estado     |
|------------------------------------------------|------------|
| Usar `provideHttpClient()`                     | Obligatorio |
| Usar `provideHttpClientTesting()`              | Obligatorio |
| Usar `HttpClientTestingModule`                 | PROHIBIDO  |
| Llamar `httpMock.verify()` en `afterEach`      | Obligatorio |

```typescript
afterEach(() => {
  httpMock.verify();
});
```

---

## Testing de httpResource

`httpResource` **NO** ejecuta la peticion inmediatamente. Requiere un ciclo de deteccion
de cambios y estabilizacion.

### Flujo requerido

```typescript
it('debe cargar los datos via httpResource', async () => {
  // 1. Avanzar la deteccion de cambios para que httpResource dispare la peticion
  TestBed.tick();

  // 2. Capturar la peticion pendiente
  const req = httpMock.expectOne('/api/endpoint');
  expect(req.request.method).toBe('GET');

  // 3. Responder con datos simulados
  req.flush(mockData);

  // 4. Esperar estabilizacion
  await TestBed.inject(ApplicationRef).whenStable();

  // 5. Verificar el estado del resource
  expect(service.myResource.value()).toEqual(mockData);
});
```

### Errores comunes

- Olvidar `TestBed.tick()` antes de `expectOne()` — la peticion nunca se emite.
- No llamar `whenStable()` — el valor del resource no se actualiza.
- No manejar multiples resources — `httpMock.verify()` falla.

---

## Reglas avanzadas

### Servicios con `effect()` + `httpResource.error()`

Estos servicios **DEBEN** incluir tests de manejo de errores reactivos.

#### Simular errores HTTP

```typescript
// Simular error 400
const req = httpMock.expectOne('/api/endpoint');
req.flush(
  { message: 'Solicitud invalida' },
  { status: 400, statusText: 'Bad Request' }
);
```

#### Probar casos positivos Y negativos

```typescript
describe('manejo de errores', () => {
  it('debe activar el handler de error ante HTTP 400', async () => {
    TestBed.tick();
    const req = httpMock.expectOne('/api/endpoint');
    req.flush({ message: 'Error' }, { status: 400, statusText: 'Bad Request' });
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.handleAlertError).toHaveBeenCalled();
  });

  it('NO debe activar el handler ante HTTP 200', async () => {
    TestBed.tick();
    const req = httpMock.expectOne('/api/endpoint');
    req.flush(mockData);
    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.handleAlertError).not.toHaveBeenCalled();
  });
});
```

---

## Reglas de mocking

### Ubicacion

Todos los mocks centralizados en `src/app/shared/mocks/`.

### Factory functions (obligatorio)

```typescript
// src/app/shared/mocks/user.mock.ts
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: faker.number.int(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  ...overrides,
});
```

### Faker determinista

```typescript
import { faker } from '@faker-js/faker';

// Inicializar seed para reproducibilidad
faker.seed(123);
```

### Reglas estrictas de mocking

| Regla                                           | Estado     |
|-------------------------------------------------|------------|
| Factory functions con patron overrides           | Obligatorio |
| Faker con `seed()` determinista                  | Obligatorio |
| Tipado fuerte (sin `any`)                        | Obligatorio |
| Dependencias inyectadas mockeadas                | Obligatorio |
| Mocks hardcodeados dentro de tests               | PROHIBIDO  |
| Uso de `any` en mocks                            | PROHIBIDO  |
| Duplicar estructuras de mock entre archivos      | PROHIBIDO  |
