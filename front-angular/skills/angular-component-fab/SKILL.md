---
name: angular-component-fab
description: Create modern Angular standalone components following v20+ best practices. Use for building UI components with signal-based inputs/outputs, OnPush change detection, host bindings, content projection, and lifecycle hooks. Triggers on component creation, refactoring class-based inputs to signals, adding host bindings, or implementing accessible interactive components.
---

# Angular Component

Create Angular v20+ standalone components following a strict separation of concerns architecture.

Components are standalone by default in Angular v20+, therefore:

- Do NOT explicitly set `standalone: true`.

## Component Generation Rules

Always generate components using separate files:

```bash
ng generate component feature/component-name
```

The component structure must always include:

```txt
component-name/
│
├── component-name.ts
├── component-name.html
├── component-name.css (or .scss)
├── component-name.spec.ts
```

## Separation of Concerns

Each file has a single responsibility:

- `.ts` → component logic and behavior
- `.html` → template and markup structure
- `.css` / `.scss` → styles and visual presentation
- `.spec.ts` → unit tests

## Strict Rules

NEVER:

- Inline HTML inside the TypeScript component
- Inline CSS/styles inside the TypeScript component
- Use large template strings in `template`
- Use large style blocks in `styles`

AVOID:

```ts
@Component({
  template: `...`,
  styles: [`...`]
})
```

ALWAYS prefer:

```ts
@Component({
  templateUrl: './component-name.html',
  styleUrl: './component-name.css'
})
```

## Component Structure

Always separate component logic, template, and styles into independent files.

### user-card.ts

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  booleanAttribute,
} from "@angular/core";

@Component({
  selector: "app-user-card",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "user-card",
    "[class.active]": "isActive()",
    "(click)": "handleClick()",
  },
  templateUrl: "./user-card.html",
  styleUrl: "./user-card.css",
})
export class UserCard {
  // Required input
  name = input.required<string>();

  // Optional input with default
  email = input<string>("");
  showEmail = input(false);

  // Input with transform
  isActive = input(false, { transform: booleanAttribute });

  // Computed from inputs
  avatarUrl = computed(() => `https://api.example.com/avatar/${this.name()}`);

  // Output
  selected = output<string>();

  handleClick(): void {
    this.selected.emit(this.name());
  }
}
```

### user-card.html

```html
<img [src]="avatarUrl()" [alt]="name() + ' avatar'" />

<h2>{{ name() }}</h2>

@if (showEmail()) {
<p>{{ email() }}</p>
}
```

### user-card.css

```css
:host {
  display: block;
}

:host.active {
  border: 2px solid blue;
}
```

## Rules

NEVER use inline templates or inline styles:

```typescript
@Component({
  template: `...`,
  styles: [`...`]
})
```

ALWAYS use:

```typescript
@Component({
  templateUrl: './component.html',
  styleUrl: './component.css'
})
```

Prefer minimal usage of the `host` property.

Use `host` only for:

- host element attributes
- accessibility attributes
- host state classes
- true host bindings

Avoid placing component interaction logic or large event handling inside `host`.

Prefer template event bindings in the HTML file to maintain clearer separation of concerns.

## Signal Inputs

```typescript
// Required - must be provided by parent
name = input.required<string>();

// Optional with default value
count = input(0);

// Optional without default (undefined allowed)
label = input<string>();

// With alias for template binding
size = input("medium", { alias: "buttonSize" });

// With transform function
disabled = input(false, { transform: booleanAttribute });
value = input(0, { transform: numberAttribute });
```

## Signal Outputs

```typescript
import { output, outputFromObservable } from "@angular/core";

// Basic output
clicked = output<void>();
selected = output<Item>();

// With alias
valueChange = output<number>({ alias: "change" });

// From Observable (for RxJS interop)
scroll$ = new Subject<number>();
scrolled = outputFromObservable(this.scroll$);

// Emit values
this.clicked.emit();
this.selected.emit(item);
```

## Content Projection

Use content projection (`ng-content`) only for simple and reusable layout components such as:

- cards
- modals
- layouts
- wrappers
- containers
- panels

Avoid excessive or unnecessary content projection in complex business components.

## Recommended Structure

### card.ts

```typescript
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-card",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./card.html",
  styleUrl: "./card.css",
})
export class Card {}
```

### card.html

```html id="cxmjlwm"
<header class="card-header">
  <ng-content select="[card-header]" />
</header>

<main class="card-content">
  <ng-content />
</main>

<footer class="card-footer">
  <ng-content select="[card-footer]" />
</footer>
```

### card.css

```css id="jlwm9n"
:host {
  display: block;
}
```

## Usage Example

```html id="jlwmza"
<app-card>
  <h2 card-header>Title</h2>

  <p>Main content</p>

  <button card-footer>Action</button>
</app-card>
```

## Rules

Use content projection only when it improves:

- reusability
- layout flexibility
- component composition

DO NOT use `ng-content` for every component by default.

Avoid overengineering simple business components with unnecessary projection slots.

## Separation of Concerns

NEVER inline templates or styles inside the component TypeScript file.

AVOID:

```typescript id="a85mca"
@Component({
  template: `...`,
  styles: [`...`]
})
```

ALWAYS use:

```typescript id="6a7v0k"
@Component({
  templateUrl: './component.html',
  styleUrl: './component.css'
})
```

## Lifecycle Hooks

```typescript
import { OnDestroy, OnInit, afterNextRender, afterRender } from "@angular/core";

export class My implements OnInit, OnDestroy {
  constructor() {
    // For DOM manipulation after render (SSR-safe)
    afterNextRender(() => {
      // Runs once after first render
    });

    afterRender(() => {
      // Runs after every render
    });
  }

  ngOnInit() {
    /* Component initialized */
  }
  ngOnDestroy() {
    /* Cleanup */
  }
}
```

## Template Syntax

Use native control flow—do NOT use `*ngIf`, `*ngFor`, `*ngSwitch`.

```html
<!-- Conditionals -->
@if (isLoading()) {
<app-spinner />
} @else if (error()) {
<app-error [message]="error()" />
} @else {
<app-content [data]="data()" />
}

<!-- Loops -->
@for (item of items(); track item.id) {
<app-item [item]="item" />
} @empty {
<p>No items found</p>
}

<!-- Switch -->
@switch (status()) { @case ('pending') { <span>Pending</span> } @case ('active')
{ <span>Active</span> } @default { <span>Unknown</span> } }
```

## Class and Style Bindings

Do NOT use `ngClass` or `ngStyle`. Use direct bindings:

```html
<!-- Class bindings -->
<div [class.active]="isActive()">Single class</div>
<div [class]="classString()">Class string</div>

<!-- Style bindings -->
<div [style.color]="textColor()">Styled text</div>
<div [style.width.px]="width()">With unit</div>
```

Use `NgOptimizedImage` for static and optimized images.

Always maintain separation of concerns between:

- component logic (`.ts`)
- template structure (`.html`)
- styles (`.css` / `.scss`)

Avoid inline templates and inline styles for image components.

## Recommended Structure

### hero.ts

```typescript
import { NgOptimizedImage } from "@angular/common";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-hero",
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./hero.html",
  styleUrl: "./hero.css",
})
export class Hero {
  imageUrl = input.required<string>();
}
```

### hero.html

```html id="4s2kbw"
<img
  ngSrc="/assets/hero.jpg"
  width="800"
  height="600"
  priority
  alt="Hero image"
/>

<img [ngSrc]="imageUrl()" width="200" height="200" alt="Dynamic image" />
```

### hero.css

```css id="skntr5"
:host {
  display: block;
}

img {
  max-width: 100%;
  height: auto;
}
```

## Rules

Always use `NgOptimizedImage` for:

- static assets
- optimized image loading
- better performance
- lazy loading support
- improved Core Web Vitals

Prefer:

```html id="t5j0ih"
<img ngSrc="/assets/image.jpg" />
```

Instead of:

```html id="zuwb7p"
<img src="/assets/image.jpg" />
```

For detailed patterns, see [references/component-patterns.md](references/component-patterns.md).
