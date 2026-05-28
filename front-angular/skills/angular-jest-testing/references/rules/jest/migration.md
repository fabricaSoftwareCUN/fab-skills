# Jasmine + Karma to Jest Migration Guide (Angular 17+)

## Overview

This guide covers migrating an Angular 17+ project from Jasmine + Karma to Jest.

---

## Dependencies to Remove

Remove from `package.json`:

```json
{
  "karma": "^6.x.x",
  "karma-chrome-launcher": "^3.x.x",
  "karma-coverage": "^2.x.x",
  "karma-jasmine": "^5.x.x",
  "karma-jasmine-html-reporter": "^2.x.x",
  "jasmine-core": "^5.x.x",
  "jasmine-spec-reporter": "^7.x.x"
}
```

---

## Dependencies to Add

Add to `package.json` devDependencies:

```json
{
  "@types/jest": "^30.0.0",
  "jest": "^30.2.0",
  "jest-environment-jsdom": "^30.2.0",
  "jest-preset-angular": "^16.1.1",
  "@testing-library/angular": "^18.1.1",
  "@testing-library/jest-dom": "^6.9.1",
  "@testing-library/dom": "^10.4.1"
}
```

---

## Configuration Files

### 1. Create `jest.config.ts` in project root

```ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$|@faker-js/faker)'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/main.ts', '!src/setup-jest.ts'],
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '^jest-preset-angular/setup-env$': 'jest-preset-angular/setup-jest',
  },
};
export default config;
```

### 2. Create `src/setup-jest.ts`

```ts
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();
```

### 3. Update `angular.json` test configuration

Change from:

```json
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "main": "src/test.ts",
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json",
    "karmaConfig": "karma.conf.js",
    ...
  }
}
```

To:

```json
"test": {
  "builder": "@angular-devkit/build-angular:jest",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json",
    "assets": [{ "glob": "**/*", "input": "public" }],
    "styles": ["src/styles.css"]
  }
}
```

### 4. Update `package.json` scripts

Replace Karma scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## Jasmine to Jest Patterns

### 1. Global Setup

Replace `test.ts` imports (Jasmine):

```ts
// REMOVE (Jasmine)
import 'zone.js/testing';
import '@angular-devkit/build-angular/src/tools/bazel';
import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot-0.js';
```

With `src/setup-jest.ts`:

```ts
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
setupZonelessTestEnv();
```

### 2. Spies

Replace Jasmine spies:

```ts
// JASMINE (old)
const spy = spyOn(service, 'methodName').and.returnValue(of(data));
spy.calls.reset();
```

```ts
// JEST (new)
const spy = jest.spyOn(service, 'methodName').mockReturnValue(of(data));
spy.mockClear(); // or jest.clearAllMocks() in afterEach
```

### 3. Async Testing

Replace Jasmine async:

```ts
// JASMINE (old)
it('should do something', async(() => {
  service.method().subscribe(result => {
    expect(result).toBe(expected);
  });
}));
```

```ts
// JEST (new)
it('should do something', async () => {
  service.method().subscribe(result => {
    expect(result).toBe(expected);
  });
});
```

### 4. beforeEach/afterEach

```ts
// JASMINE (old)
beforeEach(async(() => {
  TestBed.configureTestingModule({...}).compileComponents();
}));
afterEach(() => {
  TestBed.resetTestingModule();
});
```

```ts
// JEST (new)
beforeEach(async () => {
  await TestBed.configureTestingModule({...}).compileComponents();
});
afterEach(() => {
  jest.clearAllMocks(); // instead of spy.calls.reset()
});
```

### 5. Done Callback

Replace Jasmine done:

```ts
// JASMINE (old)
it('should handle async', (done) => {
  service.method().subscribe(() => {
    expect(...);
    done();
  });
});
```

```ts
// JEST (new) - use async/await instead
it('should handle async', async () => {
  await service.method().toPromise();
  expect(...);
});
```

---

## HTTP Testing Migration

### Old (Jasmine + HttpClientTestingModule)

```ts
// REMOVE
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});
const httpMock = TestBed.inject(HttpTestingController);
```

### New (Jest + Provider-based API)

```ts
import { provideHttpClient, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';

TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});
const httpMock = TestBed.inject(HttpTestingController);

// After each test
afterEach(() => {
  httpMock.verify();
  jest.clearAllMocks();
});
```

---

## Files to Delete After Migration

1. `karma.conf.js`
2. `src/test.ts` (replaced by `src/setup-jest.ts`)
3. Any `jasmine` or `karma` configuration files

---

## Important Notes

### DO NOT use NoopAnimationsModule or BrowserAnimationsModule

Jest cannot resolve `@angular/animations/browser`. Use mocks instead:

```ts
providers: [{ provide: AnimationBuilder, useValue: {} }];
```

### DO NOT use Jasmine-specific matchers

Jest has built-in matchers. If you need Jasmine matchers:

```ts
// Instead of jasmine.any(String), use:
expect(spy).toHaveBeenCalledWith(expect.any(String));
```

### Clear mocks in afterEach

```ts
afterEach(() => {
  jest.clearAllMocks();
  httpMock.verify(); // for HTTP tests
});
```

### Zone.js Setup

Ensure `setup-jest.ts` calls `setupZonelessTestEnv()` for zoneless Angular or `setupAngularTestEnv()` for zone-based.

---

## Example Full Migration

### Before (Jasmine)

```ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService]
    }).compileComponents();
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should get data', () => {
    const spy = spyOn(service, 'getData').and.returnValue(of({}));
    // ...
  });
});
```

### After (Jest)

```ts
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MyService,
      ],
    }).compileComponents();
    service = TestBed.inject(MyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    jest.clearAllMocks();
  });

  it('should get data', () => {
    const spy = jest.spyOn(service, 'getData').mockReturnValue(of({}));
    // ...
  });
});
```
