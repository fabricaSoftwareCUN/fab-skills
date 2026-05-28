---
name: angular-jest-testing
description: Generate unit tests with Jest for Angular 17+ projects, including components, services, interceptors, guards, pipes, directives, and utilities. This service is activated for requests related to unit testing, test creation, improvement, or correction. Tests must follow best practices, cover both successful and error cases, use appropriate mocks, and ensure a minimum coverage of 85% of the code under test.
---

# Angular Testing Guidelines (Jest)

## Testing

Testing framework: **Jest**

Write unit tests for:

- Components
- Services
- Pipes
- Guards
- Interceptors

# Testing Rules

## Test Generation Workflow

Before generating any unit test, the AI agent MUST analyze the source files of the unit under test.

### Step 1 — Read the implementation

The agent must read the implementation file before writing tests.

#### For components:

- Read the `.ts` file of the component.
- Read the `.html` template of the component.

#### For other:

- Read the `.ts` file of the service.

### Purpose of this step

- Understand inputs, outputs, signals, and dependencies
- Identify business logic
- Detect form controls, validators, and events
- Detect template interactions (click, input, submit, etc.)

The agent must NOT generate tests without first analyzing these files.

## Coverage Checks

- All components/services must maintain **≥ 85% coverage**

Run tests:

```bash
npm run test -- --coverage --collectCoverageFrom="**/file-name.ts" file-name.spec.ts
```

## Animation Import Rules

Avoid importing `NoopAnimationsModule` and `BrowserAnimationsModule` in unit tests with Jest, as they can cause resolution errors related to `@angular/animations/browser`.

When Angular Material requires animations, use mocks or minimal providers instead of actual animation modules.

For detailed patterns, see [references/rules/jest/animations.md](references/rules/jest/animations.md).

## Migration from Jasmine + Karma to Jest

When migrating existing Angular 17+ projects from Jasmine + Karma to Jest, follow the migration guide:

For migration patterns and configuration, see: [references/rules/jest/migration.md](references/rules/jest/migration.md)

## General Rules For Angular

Reactive forms MUST reuse the shared validation utilities defined by the project instead of creating custom validation logic or directly accessing control errors in templates.

Unit tests MUST validate rendered HTML output when components receive data through `@Input`, `MAT_DIALOG_DATA`, signals or services, ensuring the UI is correctly rendered and not only the internal component state.

For detailed form validation patterns, see: [references/rules/angular/forms.md](references/rules/angular/forms.md).

For template rendering validation patterns, see: [references/rules/angular/template-rendering.md](references/rules/angular/template-rendering.md).

## HTTP Rules

HTTP unit tests MUST use the modern provider-based testing APIs introduced in Angular 16+ instead of deprecated module-based configurations.

Tests using `HttpClient` MUST configure `provideHttpClient()` together with `provideHttpClientTesting()`, properly inject `HttpTestingController`, and ensure that no pending HTTP requests remain unresolved.

Tests using `httpResource` MUST follow Angular’s reactive execution model by triggering effects with `TestBed.tick()`, resolving all expected HTTP requests, and waiting for application stability before asserting signal values or rendered state.

Avoid deprecated APIs, mixed testing strategies, and incomplete request handling.

For validation patterns, see: [references/rules/http/http-client.md](references/rules/http/http-client.md).

For validation patterns, see: [references/rules/http/http-resource.md](references/rules/http/http-resource.md).

## Advanced rules

Services using Angular reactive primitives such as `effect()` together with `httpResource` MUST include explicit tests for reactive error handling behavior.

Tests MUST validate that HTTP errors correctly trigger reactive side effects, including calls to injected services, alert handlers, logging mechanisms or state updates.

Error scenarios MUST be simulated using real `HttpTestingController` request flushing instead of mocking `httpResource` directly, ensuring behavior matches Angular runtime execution.

Tests MUST also validate negative cases where specific HTTP errors should NOT trigger side effects.

Reactive effect execution MUST follow Angular’s testing lifecycle using:
- `TestBed.tick()`
- `req.flush(...)`
- `await whenStable()`

Avoid bypassing Angular reactive execution, manually invoking effects, or replacing `httpResource` behavior with `HttpClient` spies.

For validation patterns, see: [references/rules/advanced/effects-error-handling.md](references/rules/advanced/effects-error-handling.md).

## Mocking Rules

All unit tests MUST use reusable, strongly typed, and deterministic mock data instead of inline hardcoded objects or real dependency implementations.

Mocks MUST be centralized in `src/app/shared/mocks`, generated through reusable factory functions, and support override patterns to simplify custom test scenarios while maintaining consistency across the application.

Dependencies injected into services or components MUST be mocked to prevent side effects, external calls, unstable behavior, and unnecessary HTTP execution during tests.

When using Faker, generated values SHOULD remain deterministic and controlled to ensure stable and predictable test results.

Avoid duplicated mock structures, random-only data generation, inline mocks inside test files, usage of `any`, or mixing real implementations with mocked dependencies.

If a dependency internally performs HTTP requests, tests MUST either:
- mock the dependency completely, OR
- explicitly handle all generated HTTP requests

For reusable mock data generation patterns, see:
[references/rules/mocking/data-generators.md](references/rules/mocking/data-generators.md)

For dependency mocking rules and side effect prevention, see:
[references/rules/mocking/dependencies.md](references/rules/mocking/dependencies.md)

For advanced mock factory patterns and Faker usage, see:
[references/rules/mocking/mock-generator.md](references/rules/mocking/mock-generator.md)