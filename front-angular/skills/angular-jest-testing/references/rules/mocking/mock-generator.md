# Mock Data Generator (Angular + Jest)

## Purpose

Provide consistent, reusable, and deterministic mock data for unit tests.

---

## File Location Rules

- All mocks MUST live in:

```
src/app/shared/mocks/
```

- File naming convention:

```
<feature-or-entity>.mock.ts
```

### Examples

- `user.mock.ts`
- `ui-select.mock.ts`
- `product.mock.ts`

---

## Mock Types

### 1. Factory Functions (REQUIRED)

Mocks MUST be generated using factory functions.

```ts
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: "user-1",
  name: "John Doe",
  email: "john.doe@test.com",
  ...overrides,
});
```

---

### 2. Collections

```ts
export const createMockUsers = (count = 5): User[] =>
  Array.from({ length: count }, (_, index) =>
    createMockUser({ id: `user-${index + 1}` }),
  );
```

---

## Faker Usage Rules

- Faker MAY be used, but:

### MUST be deterministic when needed

```ts
import { faker } from "@faker-js/faker";

faker.seed(123);
```

---

### Avoid random-only mocks

```ts
// Bad
name: faker.person.fullName();
```

### Prefer controlled randomness

```ts
name: faker.person.fullName({ sex: "male" });
```

OR fallback to static values for critical tests.

---

## Strong Typing (MANDATORY)

Mocks MUST always match interfaces:

```ts
import { User } from "../interfaces/user.interface";
```

DO NOT use `any`

---

## Override Pattern (VERY IMPORTANT)

All factories MUST allow overrides:

```ts
createMockUser({ name: "Custom Name" });
```

This enables flexible test scenarios.

---

## Component-Specific Mocks

If mocking data for a specific component:

1. Check if mock already exists in `/shared/mocks`
2. If NOT → create new file
3. Keep it reusable (avoid component-specific naming if possible)

---

## Example (UI Select)

```ts
import { faker } from "@faker-js/faker";

export interface SelectOption {
  value: string;
  label: string;
}

export const createMockOption = (
  overrides?: Partial<SelectOption>,
): SelectOption => ({
  value: faker.string.uuid(),
  label: faker.person.fullName(),
  ...overrides,
});

export const createMockOptions = (count = 10): SelectOption[] =>
  Array.from({ length: count }, () => createMockOption());
```

---

## Anti-Patterns (FORBIDDEN)

- Hardcoding mocks inside test files
- Using `any`
- Creating duplicated mock structures
- Not allowing overrides
- Pure randomness without control

---

## Goal

- Reusable mocks across tests
- Predictable and stable test behavior
- Strong typing and maintainability
- Easy customization per test case
