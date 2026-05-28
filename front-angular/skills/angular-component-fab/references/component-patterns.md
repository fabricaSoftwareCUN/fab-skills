# Angular Component Patterns

## Table of Contents

- [Model Inputs (Two-Way Binding)](#model-inputs-two-way-binding)
- [View Queries](#view-queries)
- [Content Queries](#content-queries)
- [Dependency Injection in Components](#dependency-injection-in-components)
- [Component Communication Patterns](#component-communication-patterns)
- [Dynamic Components](#dynamic-components)

## Model Inputs (Two-Way Binding)

Use `model()` for Angular two-way binding with the `[(value)]` syntax.

Always maintain strict separation of concerns:

- `.ts` → logic and state management
- `.html` → template structure
- `.css` / `.scss` → visual styles

Avoid inline templates, inline styles, and excessive logic inside decorators.

## Recommended Structure

### slider.ts

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from "@angular/core";

@Component({
  selector: "app-slider",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./slider.html",
  styleUrl: "./slider.css",
})
export class Slider {
  // Model creates both input and output
  value = model(0);

  // Inputs
  min = input(0);
  max = input(100);

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    this.value.set(Number(target.value));
  }
}
```

### slider.html

```html id="m3ljn0"
<div class="slider">
  <input
    type="range"
    [value]="value()"
    [min]="min()"
    [max]="max()"
    (input)="onInput($event)"
  />

  <span>{{ value() }}</span>
</div>
```

### slider.css

```css id="59xcm7"
:host {
  display: block;
}

.slider {
  display: flex;
  align-items: center;
  gap: 1rem;
}
```

## Usage Example

```html id="r7vdbv"
<app-slider [(value)]="sliderValue" />
```

## Required Model

```typescript id="op0ls5"
value = model.required<number>();
```

## Rules

Prefer template event bindings instead of placing interaction logic inside `host`.

AVOID:

```typescript id="5rcr0k"
host: {
  '(input)': 'onInput($event)',
},
```

PREFER:

```html id="f93m06"
(input)="onInput($event)"
```

inside the HTML template for better readability and separation of concerns.

## View Queries

Use Angular view queries to access template elements and child components when necessary.

Always maintain separation of concerns:

- `.ts` → component logic and queries
- `.html` → template structure
- `.css` / `.scss` → styles

Avoid inline templates and inline styles.

## Recommended Structure

### gallery.ts

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  viewChild,
  viewChildren,
} from "@angular/core";

import { ImageCard } from "./image-card";

@Component({
  selector: "app-gallery",
  imports: [ImageCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./gallery.html",
  styleUrl: "./gallery.css",
})
export class Gallery {
  images = input.required<Image[]>();

  // Query single element
  container = viewChild.required<ElementRef<HTMLDivElement>>("container");

  // Query single component (optional)
  firstCard = viewChild(ImageCard);

  // Query all matching components
  allCards = viewChildren(ImageCard);
}
```

### gallery.html

```html id="exfeh8"
<div #container class="gallery">
  @for (image of images(); track image.id) {
  <app-image-card [image]="image" />
  }
</div>
```

### gallery.css

```css id="sgf15x"
:host {
  display: block;
}

.gallery {
  display: grid;
  gap: 1rem;
}
```

## Rules

Use view queries only when direct interaction with:

- DOM elements
- child components
- template references

is truly necessary.

Avoid excessive usage of:

- `viewChild`
- `viewChildren`
- direct DOM manipulation

Prefer:

- inputs
- outputs
- signals
- computed state
- template bindings

before querying the DOM.

## Recommended Usage

Use queries for:

- focus management
- measurements
- scrolling
- integrations with external libraries
- controlled access to child components

Avoid using queries as a replacement for proper data flow.

## Content Queries

Use content queries to interact with projected content only when component composition truly requires it.

Always maintain separation of concerns:

- `.ts` → logic, state, and queries
- `.html` → template structure
- `.css` / `.scss` → styles

Avoid inline templates, inline styles, and excessive logic inside decorators.

## Recommended Structure

### tabs.ts

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  contentChildren,
  effect,
  signal,
} from "@angular/core";

import { Tab } from "./tab";

@Component({
  selector: "app-tabs",
  imports: [Tab],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./tabs.html",
  styleUrl: "./tabs.css",
})
export class Tabs {
  // Query all projected Tab children
  tabs = contentChildren(Tab);

  // Query single projected element
  header = contentChild("tabHeader");

  activeTab = signal<Tab | undefined>(undefined);

  constructor() {
    // Set first tab as active when tabs are available
    effect(() => {
      const firstTab = this.tabs()[0];

      if (firstTab && !this.activeTab()) {
        this.activeTab.set(firstTab);
      }
    });
  }

  selectTab(tab: Tab): void {
    this.activeTab.set(tab);
  }
}
```

### tabs.html

```html id="dqjlwm"
<div class="tab-headers">
  @for (tab of tabs(); track tab.label()) {
  <button
    type="button"
    class="tab-button"
    [class.active]="tab === activeTab()"
    (click)="selectTab(tab)"
  >
    {{ tab.label() }}
  </button>
  }
</div>

<div class="tab-content">
  <ng-content />
</div>
```

### tabs.css

```css id="8awjwv"
:host {
  display: block;
}

.tab-headers {
  display: flex;
  gap: 0.5rem;
}

.tab-button.active {
  font-weight: bold;
}

.tab-content {
  margin-top: 1rem;
}
```

---

## Tab Component

### tab.ts

```typescript
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-tab",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./tab.html",
  styleUrl: "./tab.css",
})
export class Tab {
  label = input.required<string>();

  isActive = input(false);
}
```

### tab.html

```html id="w29v4j"
<div class="tab-panel" [class.active]="isActive()">
  <ng-content />
</div>
```

### tab.css

```css id="q3cn5m"
:host {
  display: block;
}

.tab-panel {
  display: none;
}

.tab-panel.active {
  display: block;
}
```

## Rules

Use content queries only when projected content requires:

- parent-child coordination
- dynamic registration
- layout composition
- advanced reusable containers

Examples:

- tabs
- accordions
- steppers
- menus
- complex layout containers

Avoid using:

- `contentChild`
- `contentChildren`

for simple data communication where:

- inputs
- outputs
- signals

would be sufficient.

## Content Projection Guidance

Do NOT use content projection and content queries for every component by default.

Prefer simpler component APIs when possible.

Use projected content only when it improves:

- flexibility
- reusability
- composition

without introducing unnecessary complexity.

## Dependency Injection in Components

Use the `inject()` function instead of constructor injection in Angular components.

Always maintain separation of concerns:

- `.ts` → logic and dependency injection
- `.html` → template structure
- `.css` / `.scss` → styles

Avoid inline templates and inline styles.

## Recommended Structure

### dashboard.ts

```typescript
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { Router } from "@angular/router";

import { APP_CONFIG } from "./app.config";
import { Analytics } from "./analytics.service";
import { Local } from "./local.service";
import { User } from "./user.service";

@Component({
  selector: "app-dashboard",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard {
  // Dependency injection
  private readonly router = inject(Router);

  private readonly userService = inject(User);

  private readonly config = inject(APP_CONFIG);

  // Optional injection
  private readonly analytics = inject(Analytics, {
    optional: true,
  });

  // Self-only injection
  private readonly localService = inject(Local, {
    self: true,
  });

  navigateToProfile(): void {
    this.router.navigate(["/profile"]);
  }
}
```

### dashboard.html

```html id="plav7i"
<section class="dashboard">
  <button type="button" (click)="navigateToProfile()">Go to profile</button>
</section>
```

### dashboard.css

```css id="6f7c8y"
:host {
  display: block;
}

.dashboard {
  padding: 1rem;
}
```

## Rules

Prefer:

```typescript id="mq6tnf"
private readonly router = inject(Router);
```

Instead of:

```typescript id="qjlwmc"
constructor(
  private router: Router
) {}
```

## Recommended Injection Practices

Use:

- `private readonly`
- grouped injections
- clear dependency organization

Prefer `inject()` for:

- cleaner class structure
- improved readability
- better compatibility with modern Angular APIs
- easier testing
- reduced constructor boilerplate

## Optional Injection

Use optional injection only when the dependency is truly optional:

```typescript id="9tkv1z"
private readonly analytics = inject(Analytics, {
  optional: true,
});
```

## Scoped Injection

Use scoped injection intentionally:

```typescript id="5jdxo9"
private readonly localService = inject(Local, {
  self: true,
});
```

Avoid unnecessary injection modifiers unless component scope behavior requires them.

## Component Communication Patterns

Use Angular component communication patterns with clear separation of concerns.

Always maintain:

- `.ts` → logic and state
- `.html` → template structure
- `.css` / `.scss` → styles

Avoid inline templates and inline styles.

---

# Parent to Child (Inputs)

Use `input()` for data received from parent components.

## Recommended Structure

### parent.ts

```typescript
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

import { Child } from "./child";

@Component({
  selector: "app-parent",
  imports: [Child],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./parent.html",
  styleUrl: "./parent.css",
})
export class Parent {
  parentData = signal({
    name: "Test",
  });

  config = {
    theme: "dark",
  };
}
```

### parent.html

```html id="yc0wy5"
<app-child [data]="parentData()" [config]="config" />
```

### parent.css

```css id="6m3pvx"
:host {
  display: block;
}
```

---

### child.ts

```typescript id="sk0x1z"
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./child.html",
  styleUrl: "./child.css",
})
export class Child {
  data = input.required<Data>();

  config = input<Config>();
}
```

### child.html

```html id="6ob5o4"
<section class="child">
  <h2>{{ data().name }}</h2>

  <p>Theme: {{ config()?.theme }}</p>
</section>
```

### child.css

```css id="u2w0w6"
:host {
  display: block;
}
```

---

# Child to Parent (Outputs)

Use `output()` for communication from child components to parent components.

## Recommended Structure

### child.ts

```typescript id="a3k9w0"
import { ChangeDetectionStrategy, Component, output } from "@angular/core";

@Component({
  selector: "app-child",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./child.html",
  styleUrl: "./child.css",
})
export class Child {
  saved = output<Data>();

  save(): void {
    this.saved.emit({
      id: 1,
      name: "Item",
    });
  }
}
```

### child.html

```html id="n9x4bz"
<button type="button" (click)="save()">Save</button>
```

### child.css

```css id="1m9nvt"
:host {
  display: block;
}
```

---

### parent.ts

```typescript id="s1wtlu"
import { ChangeDetectionStrategy, Component } from "@angular/core";

import { Child } from "./child";

@Component({
  selector: "app-parent",
  imports: [Child],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./parent.html",
  styleUrl: "./parent.css",
})
export class Parent {
  onSaved(data: Data): void {
    console.log("Saved:", data);
  }
}
```

### parent.html

```html id="yoz34t"
<app-child (saved)="onSaved($event)" />
```

### parent.css

```css id="84y8ri"
:host {
  display: block;
}
```

---

## Rules

Prefer:

- `input()`
- `output()`
- signals
- computed values

for component communication.

Avoid:

- unnecessary shared mutable state
- deep component coupling
- excessive service communication between direct parent/child components

## Communication Guidelines

Use:

- Inputs → parent to child data flow
- Outputs → child to parent events

Prefer explicit and predictable communication patterns.

Avoid overly complex event chains between nested components.

## Shared Service Pattern

Use shared services for application state that must be accessed by multiple unrelated components.

Prefer signals and computed state for reactive shared state management.

Always maintain separation of concerns:

- services → shared state and business logic
- `.ts` → component behavior
- `.html` → template structure
- `.css` / `.scss` → styles

Avoid inline templates and inline styles.

---

# Shared State Service

### cart.service.ts

```typescript
import { Injectable, computed, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class Cart {
  private readonly items = signal<CartItem[]>([]);

  readonly items$ = this.items.asReadonly();

  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0),
  );

  addItem(item: CartItem): void {
    this.items.update((items) => [...items, item]);
  }

  removeItem(id: string): void {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }
}
```

---

# Component A

### product.ts

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";

import { Cart } from "./cart.service";

@Component({
  selector: "app-product",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./product.html",
  styleUrl: "./product.css",
})
export class Product {
  private readonly cart = inject(Cart);

  product = input.required<Product>();

  add(): void {
    this.cart.addItem({
      ...this.product(),
      quantity: 1,
    });
  }
}
```

### product.html

```html id="pnwjlwm"
<button type="button" (click)="add()">Add</button>
```

### product.css

```css id="4j3m18"
:host {
  display: block;
}
```

---

# Component B

### cart-summary.ts

```typescript id="2n1p5m"
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { Cart } from "./cart.service";

@Component({
  selector: "app-cart-summary",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./cart-summary.html",
  styleUrl: "./cart-summary.css",
})
export class CartSummary {
  readonly cart = inject(Cart);
}
```

### cart-summary.html

```html id="jlwm0z"
<span> Total: {{ cart.total() }} </span>
```

### cart-summary.css

```css id="l9t4fs"
:host {
  display: block;
}
```

---

## Rules

Use shared services when:

- multiple unrelated components share state
- state must persist across views
- business logic should be centralized
- components should remain decoupled

Prefer:

- signals
- computed
- readonly state exposure

Avoid:

- unnecessary global mutable state
- direct component-to-component communication
- duplicating business logic across components

## Service Responsibilities

Services should contain:

- shared state
- business rules
- state transformations
- reusable domain logic

Components should contain:

- UI behavior
- user interactions
- presentation logic

Avoid placing business logic directly inside components.

## Dynamic Components

Use `@defer` for lazy loading heavy or non-critical UI sections.

Always maintain separation of concerns:

- `.ts` → logic and state
- `.html` → template structure
- `.css` / `.scss` → styles

Avoid inline templates and inline styles.

Use deferred loading intentionally to improve:

- performance
- initial rendering
- Core Web Vitals
- user experience

Avoid overusing `@defer` for small or lightweight components.

---

# Recommended Structure

### dashboard.ts

```typescript
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-dashboard",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard {
  chartData = input.required<ChartData>();
}
```

### dashboard.html

```html id="yjlwm4"
@defer (on viewport) {
<app-heavy-chart [data]="chartData()" />
} @placeholder {
<div class="chart-placeholder">Loading chart...</div>
} @loading (minimum 500ms) {
<app-spinner />
} @error {
<p>Failed to load chart</p>
}
```

### dashboard.css

```css id="jlwm61"
:host {
  display: block;
}

.chart-placeholder {
  min-height: 200px;
}
```

---

# Defer Triggers

Use defer triggers according to the component behavior and UX requirements.

## Available Triggers

- `on viewport`
  → when the element enters the viewport

- `on idle`
  → when the browser becomes idle

- `on interaction`
  → after user interaction such as click or focus

- `on hover`
  → when the user hovers the element

- `on immediate`
  → immediately after non-deferred content renders

- `on timer(500ms)`
  → after a specific delay

- `when condition`
  → when an expression becomes true

---

# Interaction Example

### post.ts

```typescript id="q9mwjl"
import { ChangeDetectionStrategy, Component, input } from "@angular/core";

@Component({
  selector: "app-post",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./post.html",
  styleUrl: "./post.css",
})
export class Post {
  postId = input.required<string>();
}
```

### post.html

```html id="jlwmce"
@defer ( on interaction; prefetch on idle ) {
<app-comments [postId]="postId()" />
} @placeholder {
<button type="button">Load Comments</button>
}
```

### post.css

```css id="jlwmxl"
:host {
  display: block;
}
```

---

## Rules

Use `@defer` for:

- heavy components
- charts
- dashboards
- large lists
- comments sections
- secondary content
- below-the-fold content

Avoid deferring:

- critical UI
- primary navigation
- immediately required content
- lightweight components

## Placeholder and Loading States

Always provide:

- meaningful placeholders
- loading states
- graceful error handling

Avoid blank deferred areas without user feedback.

## Attribute Directives on Components

Use attribute directives to add reusable UI behavior or visual enhancements to components and elements.

Always maintain separation of concerns:

- directives → reusable behavior and host interaction
- `.ts` → logic
- `.html` → structure
- `.css` / `.scss` → styles

Avoid inline templates and inline styles inside components.

Use attribute directives only when behavior or styling must be reusable across multiple components.

Avoid creating directives for highly specific or one-off use cases.

---

# Recommended Structure

### highlight.directive.ts

```typescript
import { Directive, HostBinding, input } from "@angular/core";

@Directive({
  selector: "[appHighlight]",
})
export class Highlight {
  color = input("yellow", {
    alias: "appHighlight",
  });

  @HostBinding("style.backgroundColor")
  get backgroundColor(): string {
    return this.color();
  }
}
```

---

# Usage on Component

### page.ts

```typescript id="7jlwm9"
import { ChangeDetectionStrategy, Component } from "@angular/core";

import { Highlight } from "./highlight.directive";

@Component({
  selector: "app-page",
  imports: [Highlight],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./page.html",
  styleUrl: "./page.css",
})
export class Page {}
```

### page.html

```html id="jlwm4a"
<app-card appHighlight="lightblue" />
```

### page.css

```css id="jlwm6u"
:host {
  display: block;
}
```

---

## Rules

Use attribute directives for:

- reusable visual behaviors
- DOM interaction
- reusable UI enhancements
- accessibility improvements
- state-based styling

Examples:

- highlight
- tooltip
- autofocus
- permissions
- hover states
- loading indicators

Avoid using attribute directives:

- for complex business logic
- when a component is more appropriate
- for one-time styling needs

## Host Bindings

Prefer:

- `@HostBinding`
- `@HostListener`

for directive host interaction.

Avoid excessive logic inside:

- `host`
- inline decorator bindings

PREFER:

```typescript id="jlwm1q"
@HostBinding('style.backgroundColor')
```

Instead of:

```typescript id="jlwm5r"
host: {
  '[style.backgroundColor]': 'color()',
}
```

when readability and maintainability improve.

## Error Boundaries

Use error boundary components to gracefully handle UI failures and provide recovery mechanisms.

Always maintain separation of concerns:

- `.ts` → state management and error handling
- `.html` → template structure
- `.css` / `.scss` → styles

Avoid inline templates and inline styles.

Use error boundaries for:

- isolated UI recovery
- resilient layouts
- async feature containers
- lazy-loaded sections
- complex reusable components

Avoid wrapping every small component with an error boundary unnecessarily.

---

# Recommended Structure

### error-boundary.ts

```typescript
import {
  ChangeDetectionStrategy,
  Component,
  ErrorHandler,
  inject,
  signal,
} from "@angular/core";

@Component({
  selector: "app-error-boundary",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./error-boundary.html",
  styleUrl: "./error-boundary.css",
})
export class ErrorBoundary {
  hasError = signal(false);

  private readonly errorHandler = inject(ErrorHandler);

  retry(): void {
    this.hasError.set(false);
  }
}
```

### error-boundary.html

```html id="jlwm4p"
@if (hasError()) {
<div class="error">
  <h3>Something went wrong</h3>

  <button type="button" (click)="retry()">Retry</button>
</div>
} @else {
<ng-content />
}
```

### error-boundary.css

```css id="jlwm7t"
:host {
  display: block;
}

.error {
  padding: 1rem;
  border-radius: 0.5rem;
}
```

---

## Rules

Use error boundaries for:

- async rendering sections
- deferred content
- dashboards
- widgets
- external integrations
- unstable or isolated UI areas

Avoid using error boundaries:

- around every small component
- as a replacement for proper validation
- to hide application-wide errors silently

## Error Handling Guidelines

Error boundaries should:

- provide user feedback
- allow retry mechanisms
- isolate failures
- prevent full UI crashes

Prefer clear recovery flows over generic hidden failures.

## Content Projection

Use `<ng-content />` inside error boundaries to wrap reusable content containers.

Example use cases:

- dashboards
- lazy modules
- dynamic widgets
- feature shells

## Separation of Concerns

NEVER inline templates or styles inside the TypeScript component.

AVOID:

```typescript id="rxn6b7"
@Component({
  template: `...`,
  styles: [`...`]
})
```

ALWAYS use:

```typescript id="bvbj3p"
@Component({
  templateUrl: './component.html',
  styleUrl: './component.css',
})
```

This structure is mandatory for clean and maintainable Angular architecture.
