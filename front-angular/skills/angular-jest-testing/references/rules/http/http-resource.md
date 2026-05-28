# Angular httpResource Testing Rules

When a service uses `httpResource`, unit tests MUST follow Angular’s reactive execution model.

---

## Core Behavior

- `httpResource` does NOT execute immediately
- Requests are triggered by Angular reactive effects
- These effects are executed in tests using:

```ts
TestBed.tick();
```

---

## Required Testing Flow

```ts
TestBed.tick();                // Trigger reactive effects
httpMock.expectOne(...);       // Capture HTTP request
req.flush(mockData);           // Resolve request
await whenStable();            // Wait for signal propagation
```

---

## Multiple Resources Rule

If a service defines multiple `httpResource` instances:

```ts
httpResource A
httpResource B
```

### Rules

- ALL requests MUST be handled
- Tests MUST NOT leave pending HTTP requests

---

### Incorrect

```ts
httpMock.expectOne("/academic-shifts");
```

---

### Correct

```ts
httpMock.expectOne("/education-modalities").flush([]);
httpMock.expectOne("/academic-shifts").flush(mockData);
```

---

## Stability Requirement

```ts
await TestBed.inject(ApplicationRef).whenStable();
```

### Reason

- Signals update asynchronously after HTTP resolution
- Without this step, tests may fail or hang

---

## Default Value Validation

```ts
expect(service.signal()).toEqual(defaultValue);
```
