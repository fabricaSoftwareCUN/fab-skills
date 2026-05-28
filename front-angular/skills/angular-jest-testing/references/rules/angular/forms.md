# Angular Form Validation Rules

All reactive form validation MUST use shared utilities.

Location:

```
src/app/shared/utils/form/form-error.utils.ts
```

---

## Required Helpers

- `isInvalidField(field, form)`
- `isInvalidFieldControl(control)`
- `isRequired(control)`
- `getFieldError(field, form)`

---

## Rules

- Do NOT create custom validation helpers
- Always reuse shared utilities
- Use `getFieldError` for messages
- Do NOT access `control.errors` directly in templates
