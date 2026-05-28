# Dependency Mocking Rules (Services)

## Mandatory Mocking

If a service injects dependencies:

```ts
private errorService = inject(ErrorService);
```

### Then:

- MUST be mocked
- MUST NOT use real implementations

---

## Why

- Prevent side effects
- Avoid external calls
- Ensure deterministic tests
- Improve performance

---

## Example

```ts
providers: [
  {
    provide: ErrorService,
    useValue: {
      handleAlertError: jest.fn(),
    },
  },
];
```

---

## Forbidden

```ts
providers: [ErrorService];
```

---

## Advanced Rule

If a dependency triggers HTTP calls:

- MUST be mocked OR
- ALL its HTTP requests MUST be handled

---

## Optional Helper

```ts
function flushAllRequests(httpMock: HttpTestingController) {
  httpMock.match(() => true).forEach((req) => req.flush([]));
}
```

Use ONLY when endpoint validation is not required
