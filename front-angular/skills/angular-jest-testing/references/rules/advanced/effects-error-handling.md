## Effects & Error Handling Testing (httpResource)

When a service uses `effect()` to react to `httpResource.error()`, tests MUST explicitly validate error handling behavior.

---

### Rule

- Effects triggered by `httpResource.error()` MUST be tested
- Tests MUST simulate HTTP errors using `req.flush(..., { status })`
- Tests MUST verify side effects (e.g., calls to injected services)

---

### Example Implementation

```ts
constructor() {
  effect(() => {
    const modalityErr = this.educationModalityResource.error();
    const shiftsErr = this.academicShiftsResource.error();

    const handleError = (err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status !== 401 && err.status < 500) {
        this.errorService.handleAlertError(err);
      }
    };

    if (modalityErr) handleError(modalityErr);
    if (shiftsErr) handleError(shiftsErr);
  });
}
```

---

### Required Test (Error Handling)

```ts
it("should call handleAlertError when academicShifts request fails with non-401/500 error", async () => {
  const errorService = TestBed.inject(ErrorService);
  const service = TestBed.inject(AcademicProductsService);
  const httpMock = TestBed.inject(HttpTestingController);

  const spy = jest.spyOn(errorService, "handleAlertError");

  TestBed.tick();

  httpMock
    .expectOne(
      `${service["marketPlaceUrl"]}/products/programs/education-modalities`,
    )
    .flush([]);

  const req = httpMock.expectOne(
    `${service["marketPlaceUrl"]}/products/programs/academic-shifts`,
  );

  req.flush("Error", {
    status: 400,
    statusText: "Bad Request",
  });

  await TestBed.inject(ApplicationRef).whenStable();

  expect(spy).toHaveBeenCalled();
});
```

---

### Negative Cases (Must be tested)

Tests MUST also verify that certain errors DO NOT trigger handlers:

```ts
it('should NOT call handleAlertError for 401 error', async () => {
  const errorService = TestBed.inject(ErrorService);
  const spy = jest.spyOn(errorService, 'handleAlertError');

  const service = TestBed.inject(AcademicProductsService);
  const httpMock = TestBed.inject(HttpTestingController);

  TestBed.tick();

  httpMock.expectOne(...).flush([]);

  const req = httpMock.expectOne(...);

  req.flush('Error', { status: 401, statusText: 'Unauthorized' });

  await TestBed.inject(ApplicationRef).whenStable();

  expect(spy).not.toHaveBeenCalled();
});
```

---

### Important Notes

- Effects run automatically → do NOT call them manually
- Errors MUST be triggered via HTTP mocks
- Always use:
  - `TestBed.tick()`
  - `req.flush(...)`
  - `await whenStable()`

---

### Forbidden

- Do NOT skip testing effects
- Do NOT mock `httpResource` directly
- Do NOT replace with `HttpClient` spies when `httpResource` is used

---

### Goal

Ensure that:

- Reactive error handling is fully tested
- Side effects are validated
- Behavior matches real runtime conditions
