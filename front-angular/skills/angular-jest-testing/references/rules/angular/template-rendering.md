# Template Rendering Validation (Jest)

When a component receives data via:

- `@Input`
- `MAT_DIALOG_DATA`
- Signals
- Services

Tests MUST validate rendered HTML

---

## Incorrect

```ts
expect(component.data.title).toBe(mockAlert.title);
```

---

## Correct

```ts
fixture.detectChanges();

expect(element.textContent).toContain(mockAlert.title);
```

---

## Preferred (Selectors)

### Template

```html
<h2 data-testid="alert-title">{{ data.title }}</h2>
<p data-testid="alert-message">{{ data.text }}</p>
```

### Test

```ts
const title = fixture.nativeElement.querySelector(
  '[data-testid="alert-title"]',
);
const message = fixture.nativeElement.querySelector(
  '[data-testid="alert-message"]',
);

expect(title.textContent).toContain(mockAlert.title);
expect(message.textContent).toContain(mockAlert.text);
```

---

## Purpose

Ensure UI renders correctly, not just component state.
