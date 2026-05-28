## Separation of Concerns Rule in Angular Components

### Objective

Maintain a clean, scalable, and maintainable architecture by properly separating the logic, visual structure, and styles of each component.

---

### Mandatory Rules

#### `.ts` file → Logic and behavior only

The component's TypeScript file should contain only the following:

- Component logic
- Signals, observables, and state
- Methods
- Event handling
- Dependency injection
- Data transformation
- Validations
- Communication with services

##### Not allowed in `.ts`

- Extensive inline HTML templates
- Inline CSS styles
- Complex visual layout
- HTML within strings
- Use of `styles` within the decorator, except in very rare cases

---

#### 2. `.html` file → Structure and layout only

The HTML file must contain:

- Visual structure of the component
- Use of Angular directives
- Data binding
- Child components
- Visual semantics

##### Not allowed in `.html`

- Complex logic
- Excessively long expressions
- Heavy computations
- Extensive data transformations
- Complex inline functions

If an expression becomes complex, it should be moved to `.ts`.

---

#### 3. `.css` / `.scss` file → Styles only

Visual styles must be declared in the component's styles file.

##### Priorities

- Use reusable CSS classes
- Keep styles decoupled
- Avoid inline styles in HTML
- Avoid manually manipulating styles from TypeScript

##### Not allowed

- Large blocks of styles within the component decorator
- Excessive use of `[style]`
- Embedded CSS in templates

---

### Expected structure

```txt
component/
│
├── component.ts      → lógica
├── component.html    → estructura visual
├── component.scss    → estilos
├── component.spec.ts    → Pruebas
```

---

### Special Rule

The agent MUST NOT generate components using:

```ts
@Component({
  template: `...`,
  styles: [`...`]
})
```

except in very small examples, quick demos, or temporary tests.

For actual development, you should always use:

```ts
templateUrl;
styleUrl / styleUrls;
```

---

### General Principle

> “Logic resides in TypeScript, layout resides in HTML, and styling resides in CSS/SCSS.”

---

You can also add a stricter enforcement policy for agents:

```md
CRITICAL:
Never combine logic, HTML, and styles in a single TS file.
Each responsibility must be kept separate:

- TS → logic
- HTML → structure
- SCSS/CSS → styles

This separation is mandatory even for small components.
```
