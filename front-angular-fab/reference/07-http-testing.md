# Testing HTTP - Fabrica de Software CUN

Referencia completa para testing de peticiones HTTP en proyectos Angular con Jest.

---

## HttpClient (Angular 16+)

### API deprecada

| Elemento                      | Estado     |
|-------------------------------|------------|
| `HttpClientTestingModule`     | PROHIBIDO  |
| `import ... from '@angular/common/http/testing'` (modulo) | PROHIBIDO |

> `HttpClientTestingModule` esta deprecado desde Angular 16. No usarlo en ningun test
> nuevo ni existente.

### Enfoque moderno

Usar providers funcionales en lugar de modulos:

```typescript
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
```

### Configuracion del TestBed

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      MiServicio,
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
  });

  service = TestBed.inject(MiServicio);
  httpMock = TestBed.inject(HttpTestingController);
});

afterEach(() => {
  httpMock.verify();
});
```

### Uso de HttpTestingController

#### Ejemplo completo — GET

```typescript
it('debe obtener la lista de productos', () => {
  const mockProducts = createMockProducts(3);

  service.getProducts().subscribe(products => {
    expect(products).toEqual(mockProducts);
    expect(products.length).toBe(3);
  });

  const req = httpMock.expectOne('/api/products');
  expect(req.request.method).toBe('GET');
  req.flush(mockProducts);
});
```

#### Ejemplo completo — POST

```typescript
it('debe crear un producto', () => {
  const newProduct = createMockProduct({ name: 'Producto nuevo' });

  service.createProduct(newProduct).subscribe(result => {
    expect(result.id).toBeDefined();
  });

  const req = httpMock.expectOne('/api/products');
  expect(req.request.method).toBe('POST');
  expect(req.request.body).toEqual(newProduct);
  req.flush({ ...newProduct, id: 42 });
});
```

#### Ejemplo completo — Error HTTP

```typescript
it('debe propagar error HTTP 404', () => {
  service.getProduct(999).subscribe({
    next: () => fail('No deberia emitir valor'),
    error: (err) => {
      expect(err.status).toBe(404);
    },
  });

  const req = httpMock.expectOne('/api/products/999');
  req.flush(
    { message: 'Producto no encontrado' },
    { status: 404, statusText: 'Not Found' }
  );
});
```

---

## httpResource

### Comportamiento

`httpResource` **NO** ejecuta la peticion HTTP inmediatamente al inyectar el servicio.
Requiere un ciclo de deteccion de cambios para disparar la peticion.

### Flujo requerido

El orden de operaciones es estricto y debe seguirse siempre:

```typescript
it('debe cargar datos via httpResource', async () => {
  // 1. Avanzar la deteccion de cambios — dispara la peticion
  TestBed.tick();

  // 2. Capturar la peticion y verificar metodo/URL
  const req = httpMock.expectOne('/api/items');
  expect(req.request.method).toBe('GET');

  // 3. Responder con datos simulados
  req.flush(mockItems);

  // 4. Esperar estabilizacion del framework
  await TestBed.inject(ApplicationRef).whenStable();

  // 5. Verificar el valor del resource
  expect(service.itemsResource.value()).toEqual(mockItems);
  expect(service.itemsResource.isLoading()).toBe(false);
});
```

### Diagrama del flujo

```
TestBed.tick()
    |
    v
httpResource dispara GET /api/items
    |
    v
httpMock.expectOne('/api/items')
    |
    v
req.flush(mockData)
    |
    v
await whenStable()
    |
    v
resource.value() contiene los datos
```

### Regla de multiples resources

Cuando un servicio tiene multiples `httpResource`, **TODOS** los requests deben manejarse
en cada test. Si no se manejan, `httpMock.verify()` fallara.

#### Estrategia 1 — Manejar cada request individualmente

```typescript
it('debe cargar usuarios y roles', async () => {
  TestBed.tick();

  // Manejar AMBOS requests
  const usersReq = httpMock.expectOne('/api/users');
  usersReq.flush(createMockUsers(2));

  const rolesReq = httpMock.expectOne('/api/roles');
  rolesReq.flush([{ id: 1, name: 'admin' }]);

  await TestBed.inject(ApplicationRef).whenStable();

  expect(service.usersResource.value()?.length).toBe(2);
  expect(service.rolesResource.value()?.length).toBe(1);
});
```

#### Estrategia 2 — Usar helper flushAllRequests

```typescript
import { flushAllRequests } from '@shared/mocks/http-helpers.mock';

afterEach(() => {
  flushAllRequests(httpMock, {
    '/api/users': createMockUsers(2),
    '/api/roles': [{ id: 1, name: 'admin' }],
  });
  httpMock.verify();
});
```

---

## Effects y manejo de errores

### Contexto

En servicios que usan `effect()` combinado con `httpResource.error()`, los errores HTTP
deben testearse de forma reactiva. El `effect()` reacciona automaticamente cuando el
resource entra en estado de error.

### Reglas

| Regla                                                        | Estado     |
|--------------------------------------------------------------|------------|
| Effects se ejecutan automaticamente al cambiar senales        | Obligatorio entender |
| Errores via HTTP: `req.flush(..., { status })`               | Obligatorio |
| Secuencia: `TestBed.tick()` + `flush()` + `await whenStable()` | Obligatorio |
| Tests de casos positivos Y negativos                          | Obligatorio |

### Ejemplo completo — Error 400 que dispara handleAlertError

```typescript
describe('effect de manejo de errores', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

    // Espiar el metodo de manejo de errores
    jest.spyOn(service, 'handleAlertError');
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Limpiar requests pendientes antes de verify
    httpMock.match(() => true).forEach(req => req.flush([]));
    httpMock.verify();
  });

  it('debe activar handleAlertError ante HTTP 400', async () => {
    // 1. Disparar la peticion del httpResource
    TestBed.tick();

    // 2. Responder con error 400
    const req = httpMock.expectOne('/api/products');
    req.flush(
      { message: 'Datos invalidos', errors: ['nombre requerido'] },
      { status: 400, statusText: 'Bad Request' }
    );

    // 3. Esperar estabilizacion — el effect reacciona al error
    await TestBed.inject(ApplicationRef).whenStable();

    // 4. Verificar que el handler fue invocado
    expect(service.handleAlertError).toHaveBeenCalledTimes(1);
    expect(service.handleAlertError).toHaveBeenCalledWith(
      expect.objectContaining({ status: 400 })
    );
  });

  it('debe incluir detalles del error en la alerta', async () => {
    TestBed.tick();

    const req = httpMock.expectOne('/api/products');
    req.flush(
      { message: 'Campo obligatorio', field: 'price' },
      { status: 422, statusText: 'Unprocessable Entity' }
    );

    await TestBed.inject(ApplicationRef).whenStable();

    expect(service.handleAlertError).toHaveBeenCalled();
    expect(service.productsResource.error()).toBeTruthy();
  });
});
```

### Casos negativos obligatorios

Siempre incluir tests que verifiquen que el handler **NO** se activa en casos exitosos
o con codigos de error no manejados.

#### Test de exito — NO dispara handler

```typescript
it('NO debe activar handleAlertError ante HTTP 200', async () => {
  TestBed.tick();

  const req = httpMock.expectOne('/api/products');
  req.flush(createMockProducts(3));

  await TestBed.inject(ApplicationRef).whenStable();

  expect(service.handleAlertError).not.toHaveBeenCalled();
  expect(service.productsResource.value()?.length).toBe(3);
});
```

#### Test de error no manejado — NO dispara handler (si aplica)

```typescript
it('NO debe activar handleAlertError ante HTTP 401 (manejado por interceptor)', async () => {
  TestBed.tick();

  const req = httpMock.expectOne('/api/products');
  req.flush(
    { message: 'No autorizado' },
    { status: 401, statusText: 'Unauthorized' }
  );

  await TestBed.inject(ApplicationRef).whenStable();

  // El 401 lo maneja el interceptor de autenticacion, no el effect del servicio
  expect(service.handleAlertError).not.toHaveBeenCalled();
});
```

### Resumen del flujo de testing de effects

```
1. TestBed.tick()           — Dispara httpResource
2. req.flush(data/error)    — Simula respuesta del servidor
3. await whenStable()       — Espera que el effect reaccione
4. expect(handler)          — Verifica comportamiento esperado
```
