# Mocking Avanzado - Fabrica de Software CUN

Guia de referencia para la generacion y gestion de mocks en proyectos Angular con Jest.

---

## Ubicacion de mocks

Todos los mocks deben estar centralizados en:

```
src/app/shared/mocks/
```

Convencion de nombres: `<nombre>.mock.ts`

| Tipo de mock       | Archivo                          |
|--------------------|----------------------------------|
| Usuario            | `src/app/shared/mocks/user.mock.ts` |
| Producto           | `src/app/shared/mocks/product.mock.ts` |
| Respuesta HTTP     | `src/app/shared/mocks/http-response.mock.ts` |
| Formulario         | `src/app/shared/mocks/form-data.mock.ts` |

> **PROHIBIDO** crear mocks dentro de archivos `.spec.ts`. Siempre centralizar.

---

## Factory functions (obligatorio)

Cada mock debe implementarse como una funcion fabrica que retorne una instancia completa
del tipo correspondiente.

### Ejemplo basico

```typescript
// src/app/shared/mocks/user.mock.ts
import { faker } from '@faker-js/faker';
import { User } from '@shared/interfaces/user.interface';

// Seed para reproducibilidad
faker.seed(123);

/**
 * Crea un mock de User con datos deterministas.
 * Acepta overrides parciales para personalizar campos especificos.
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: faker.number.int({ min: 1, max: 10000 }),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: 'student',
  isActive: true,
  createdAt: faker.date.past().toISOString(),
  ...overrides,
});
```

### Reglas de factory functions

- **DEBE** aceptar `overrides: Partial<T> = {}` como parametro.
- **DEBE** retornar el tipo completo `T`, no `Partial<T>`.
- **DEBE** usar `faker` con seed para datos deterministas.
- **DEBE** aplicar `...overrides` al final para permitir sobreescritura.

---

## Colecciones

Para generar listas de mocks, crear funciones de coleccion:

```typescript
// src/app/shared/mocks/user.mock.ts

/**
 * Crea una lista de usuarios mock.
 * @param count Cantidad de usuarios a generar (por defecto 5).
 * @param overrides Campos comunes aplicados a todos los usuarios.
 */
export const createMockUsers = (
  count: number = 5,
  overrides: Partial<User> = {}
): User[] =>
  Array.from({ length: count }, (_, index) =>
    createMockUser({ id: index + 1, ...overrides })
  );
```

### Uso en tests

```typescript
// Generar 3 usuarios activos
const activeUsers = createMockUsers(3, { isActive: true });

// Generar un usuario especifico
const adminUser = createMockUser({ role: 'admin', name: 'Carlos Admin' });
```

---

## Uso de Faker

### Determinismo obligatorio

Faker **DEBE** inicializarse con seed para garantizar reproducibilidad en los tests:

```typescript
import { faker } from '@faker-js/faker';

// Ejecutar UNA vez al inicio del archivo mock
faker.seed(123);
```

### Reglas de uso

| Regla                                   | Estado     |
|-----------------------------------------|------------|
| Usar `faker.seed()` en cada archivo mock | Obligatorio |
| Aleatoriedad sin seed                    | PROHIBIDO  |
| Tipado fuerte en retorno de factories    | Obligatorio |
| Uso de `any`                             | PROHIBIDO  |

### Metodos frecuentes de Faker

```typescript
faker.number.int({ min: 1, max: 1000 })   // Entero en rango
faker.person.fullName()                     // Nombre completo
faker.internet.email()                      // Correo electronico
faker.lorem.sentence()                      // Oracion aleatoria
faker.date.past().toISOString()             // Fecha pasada ISO
faker.string.uuid()                         // UUID
faker.datatype.boolean()                    // Booleano
```

---

## Patron de override

Todas las factory functions **DEBEN** permitir overrides mediante `Partial<T>`.

### Motivacion

- Permite personalizar solo los campos relevantes para cada test.
- Evita repeticion de datos irrelevantes.
- Mantiene los tests legibles y enfocados.

### Ejemplo de uso con override

```typescript
// Solo me interesa testear el rol, el resto son datos mock por defecto
const user = createMockUser({ role: 'admin' });

// Solo me interesa testear el estado inactivo
const inactiveUser = createMockUser({ isActive: false });
```

---

## Mocking de dependencias

### Regla principal

Las dependencias inyectadas **DEBEN** ser mockeadas en los tests unitarios.

> **PROHIBIDO** usar implementaciones reales de dependencias en tests unitarios.
> Si la dependencia hace peticiones HTTP, se debe mockear o manejar todos sus requests.

### Patron para mockear servicios

```typescript
// Crear el mock del servicio
const mockAuthService = {
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: jest.fn().mockReturnValue(true),
  currentUser: jest.fn().mockReturnValue(createMockUser()),
};

// Proveer en TestBed
TestBed.configureTestingModule({
  providers: [
    ComponenteBajoTest,
    { provide: AuthService, useValue: mockAuthService },
  ],
});
```

### Patron para mockear Router

```typescript
const mockRouter = {
  navigate: jest.fn(),
  navigateByUrl: jest.fn(),
};

providers: [
  { provide: Router, useValue: mockRouter },
]
```

---

## Helper opcional

Para tests que involucran multiples `httpResource` en un mismo servicio, usar un helper
que maneje todas las peticiones pendientes:

```typescript
// src/app/shared/mocks/http-helpers.mock.ts
import { HttpTestingController } from '@angular/common/http/testing';

/**
 * Responde a todas las peticiones HTTP pendientes con datos vacios.
 * Util para tests donde solo interesa verificar un endpoint especifico
 * pero el servicio tiene multiples httpResource activos.
 */
export const flushAllRequests = (
  httpMock: HttpTestingController,
  defaultResponses: Record<string, unknown> = {}
): void => {
  const openRequests = httpMock.match(() => true);
  openRequests.forEach(req => {
    const url = req.request.url;
    const response = defaultResponses[url] ?? [];
    req.flush(response);
  });
};
```

### Uso del helper

```typescript
afterEach(() => {
  flushAllRequests(httpMock, {
    '/api/users': createMockUsers(2),
    '/api/roles': [{ id: 1, name: 'admin' }],
  });
  httpMock.verify();
});
```

---

## Anti-patrones (prohibidos)

Los siguientes patrones estan **estrictamente prohibidos** en el proyecto:

### 1. Hardcodear mocks dentro de tests

```typescript
// PROHIBIDO
it('debe mostrar el usuario', () => {
  const user = { id: 1, name: 'Juan', email: 'juan@test.com', role: 'student' };
  // ...
});

// CORRECTO — usar factory
it('debe mostrar el usuario', () => {
  const user = createMockUser({ name: 'Juan' });
  // ...
});
```

### 2. Usar `any`

```typescript
// PROHIBIDO
const mockService: any = { getData: jest.fn() };

// CORRECTO — tipado explicito
const mockService: Pick<DataService, 'getData'> = { getData: jest.fn() };
```

### 3. Duplicar estructuras de mock

```typescript
// PROHIBIDO — mismo mock definido en multiples .spec.ts
// archivo-a.spec.ts
const mockUser = { id: 1, name: 'Test' };
// archivo-b.spec.ts
const mockUser = { id: 1, name: 'Test' };

// CORRECTO — centralizar en shared/mocks/
import { createMockUser } from '@shared/mocks/user.mock';
```

### 4. No permitir overrides

```typescript
// PROHIBIDO — factory sin parametro de overrides
export const createMockUser = (): User => ({
  id: 1,
  name: 'Fixed Name',
  email: 'fixed@test.com',
});

// CORRECTO — con overrides
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: faker.number.int(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  ...overrides,
});
```

### 5. Aleatoriedad sin control

```typescript
// PROHIBIDO — sin seed, resultados impredecibles entre ejecuciones
export const createMockUser = (): User => ({
  id: Math.random(),
  name: faker.person.fullName(), // sin seed previo
});

// CORRECTO — seed al inicio del archivo
faker.seed(123);
```
