# AGENTS.md - Angular Testing Workspace

## Project Overview

This workspace contains Angular testing guidelines and rules for Jest-based unit testing. All agents working in this repository must follow these conventions.

---

## Build & Test Commands

### Run All Tests
```bash
npm run test
```

### Run Single Test File
```bash
npm run test -- file-name.spec.ts
```

### Run Tests with Coverage
```bash
npm run test -- --coverage --collectCoverageFrom="**/file-name.ts" file-name.spec.ts
```

### Run Tests in Watch Mode
```bash
npm run test -- --watch
```

### Lint
```bash
npm run lint
```

### Build
```bash
npm run build
```

### Type Check
```bash
npm run typecheck
```

---

## Code Style Guidelines

### TypeScript

- **Strict Typing**: Never use `any`. Always define proper types.
- **Interfaces**: Define interfaces for all data structures in `src/app/shared/interfaces/`
- **Imports**: Use absolute paths with `@/` alias when available

### Naming Conventions

- **Components**: `feature-name.component.ts`
- **Services**: `feature-name.service.ts`
- **Mocks**: `<feature-or-entity>.mock.ts` (e.g., `user.mock.ts`)
- **Test Files**: `*.spec.ts`
- **Interfaces**: `*.interface.ts`

### Imports Order

1. Angular core imports
2. Third-party imports
3. Internal imports (@shared, @core, @features)
4. Relative imports

### Error Handling

- Always handle errors in services using proper error types
- Use `HttpErrorResponse` for HTTP errors
- Never swallow errors silently

---

## Angular Best Practices

### Architecture

- **Components**: Presentation only - no HTTP calls in components
- **Services**: Business logic - all HTTP calls go through services
- **Signals**: Prefer signal-based state management over BehaviorSubject
- **OnPush**: Use `ChangeDetectionStrategy.OnPush` for all components

### Signal Usage

```ts
// Signal creation
const count = signal(0);
const user = signal<User | null>(null);

// Computed
const double = computed(() => count() * 2);

// Effects
effect(() => {
  console.log('Count changed:', count());
});
```

### Dependency Injection

Use `inject()` function instead of constructor injection:

```ts
export class MyService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
}
```

---

## Form Validation Rules

All reactive form validation MUST use shared utilities:

```ts
// Location: src/app/shared/utils/form/form-error.utils.ts
import { isInvalidField, getFieldError } from '@shared/utils/form/form-error.utils';
```

**Available Helpers**:
- `isInvalidField(field, form)`
- `isInvalidFieldControl(control)`
- `isRequired(control)`
- `getFieldError(field, form)`

**Forbidden**: Do NOT access `control.errors` directly in templates or create custom validation helpers.

---

## Template Rendering Tests

When components receive data via `@Input`, `MAT_DIALOG_DATA`, signals, or services, tests MUST validate rendered HTML:

```ts
// Correct
fixture.detectChanges();
expect(element.textContent).toContain(mockAlert.title);

// Use data-testid attributes
const title = fixture.nativeElement.querySelector('[data-testid="alert-title"]');
expect(title.textContent).toContain(mockAlert.title);
```

---

## HTTP Testing Rules (Angular ≥16)

### Use Modern Provider-Based APIs

```ts
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
```

### Deprecated (DO NOT USE)

```ts
// FORBIDDEN
import { HttpClientTestingModule } from "@angular/common/http/testing";
TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
```

### HttpTestingController Pattern

```ts
const httpMock = TestBed.inject(HttpTestingController);
const req = httpMock.expectOne("/api/test");
req.flush(mockData);
httpMock.verify();
```

---

## httpResource Testing

httpResource does NOT execute immediately. Use Angular's reactive execution model:

```ts
TestBed.tick();                      // Trigger reactive effects
httpMock.expectOne(...);            // Capture HTTP request
req.flush(mockData);                 // Resolve request
await whenStable();                 // Wait for signal propagation
```

**Important**: If a service defines multiple `httpResource` instances, ALL requests MUST be handled.

---

## Effects & Error Handling

When a service uses `effect()` to react to `httpResource.error()`:

1. Effects run automatically - do NOT call them manually
2. Errors MUST be triggered via HTTP mocks using `req.flush(..., { status })`
3. Always use `TestBed.tick()`, `req.flush(...)`, and `await whenStable()`

```ts
it("should call handleAlertError when request fails with non-401/500 error", async () => {
  const errorService = TestBed.inject(ErrorService);
  const spy = jest.spyOn(errorService, "handleAlertError");

  TestBed.tick();

  const req = httpMock.expectOne("/api/endpoint");
  req.flush("Error", { status: 400, statusText: "Bad Request" });

  await TestBed.inject(ApplicationRef).whenStable();
  expect(spy).toHaveBeenCalled();
});
```

**Negative cases MUST also be tested** (e.g., 401 should NOT trigger handler).

---

## Mocking Rules

### File Location

All mocks MUST live in: `src/app/shared/mocks/`

### Factory Functions (REQUIRED)

```ts
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: "user-1",
  name: "John Doe",
  email: "john.doe@test.com",
  ...overrides,
});
```

### Faker Usage

```ts
import { faker } from "@faker-js/faker";

faker.seed(123); // Deterministic when needed
```

### Dependencies in Services

All injected dependencies MUST be mocked:

```ts
providers: [
  {
    provide: ErrorService,
    useValue: { handleAlertError: jest.fn() },
  },
],
```

---

## Animation Testing (Jest)

DO NOT import animation modules in Jest tests:

```ts
// FORBIDDEN
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
```

Use mocks instead:

```ts
providers: [{ provide: AnimationBuilder, useValue: {} }];
```

---

## Coverage Requirements

- All components/services must maintain **≥ 85% coverage**
- All dependencies MUST be mocked
- NO real HTTP calls in tests
- Tests MUST be deterministic

---

## Testing Checklist

- [ ] Read implementation file before writing tests
- [ ] Mock all injected dependencies
- [ ] Use `provideHttpClient()` + `provideHttpClientTesting()` (not deprecated modules)
- [ ] Handle ALL HTTP requests in tests
- [ ] Call `fixture.detectChanges()` before asserting rendered HTML
- [ ] Use `data-testid` attributes for template queries
- [ ] Use `TestBed.tick()` when testing `httpResource` effects
- [ ] Wait for stability with `await whenStable()`
- [ ] Test error handling paths (positive and negative cases)
- [ ] Reuse shared form validation utilities
