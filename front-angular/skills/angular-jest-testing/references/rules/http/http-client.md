# HttpClient Testing Modern Rule (Angular ≥16)

## Deprecated APIs

The following API is deprecated and MUST NOT be used:

```ts
import { HttpClientTestingModule } from "@angular/common/http/testing";
```

DO NOT use:

```ts
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});
```

### Reason

- `HttpClientTestingModule` is deprecated
- Angular now uses **standalone providers**
- Using deprecated modules may cause warnings and future incompatibility

## Required Modern Approach

Tests MUST use:

```ts
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
```

## Correct Configuration

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});
```

## HttpTestingController Usage

```ts
const httpMock = TestBed.inject(HttpTestingController);

const req = httpMock.expectOne("/api/test");
req.flush(mockData);

httpMock.verify();
```

## Mandatory Rule

- `provideHttpClientTesting()` MUST always be used together with `provideHttpClient()`
- Tests MUST inject `HttpTestingController` to handle requests
- Tests MUST NOT leave pending HTTP requests

## Forbidden Patterns

### Using deprecated module

```ts
imports: [HttpClientTestingModule];
```

### Mixing old and new APIs

```ts
imports: [HttpClientTestingModule],
providers: [provideHttpClientTesting()]
```

## Goal

Ensure:

- Compatibility with modern Angular
- Clean and future-proof tests
- No deprecated API usage
