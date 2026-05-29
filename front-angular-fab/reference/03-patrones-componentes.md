# Patrones Avanzados de Componentes Angular

Referencia de patrones avanzados para componentes Angular en la Fabrica de Software CUN.
Basada en `component-patterns.md` de `angular-component` y traducida al espanol.

## Tabla de contenidos

- [Model inputs (two-way binding)](#model-inputs-two-way-binding)
- [View queries](#view-queries)
- [Content queries](#content-queries)
- [Inyeccion de dependencias en componentes](#inyeccion-de-dependencias-en-componentes)
- [Comunicacion entre componentes](#comunicacion-entre-componentes)
- [Patron de servicio compartido](#patron-de-servicio-compartido)
- [Componentes dinamicos](#componentes-dinamicos)
- [Directivas de atributo](#directivas-de-atributo)
- [Error boundaries](#error-boundaries)

---

## Model inputs (two-way binding)

Para enlace bidireccional con la sintaxis `[(value)]`, usar `model()`:

```typescript
import { Component, model, input } from '@angular/core';

@Component({
  selector: 'app-slider',
  host: {
    '(input)': 'onInput($event)',
  },
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {
  // model() crea tanto un input como un output automaticamente
  value = model(0);
  min = input(0);
  max = input(100);

  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
  }
}
```

```html
<!-- slider.component.html -->
<input
  type="range"
  [value]="value()"
  [min]="min()"
  [max]="max()"
/>
<span>{{ value() }}</span>
```

### Uso en el componente padre

```html
<!-- El padre usa la sintaxis banana-in-a-box para enlace bidireccional -->
<app-slider [(value)]="sliderValue" />
```

### Model requerido

```typescript
// El padre debe proporcionar el valor obligatoriamente
value = model.required<number>();
```

---

## View queries

Consultar elementos y componentes dentro de la plantilla del propio componente.

```typescript
import { Component, viewChild, viewChildren, ElementRef, input } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  images = input.required<Image[]>();

  // Consultar un solo elemento por variable de referencia
  container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  // Consultar un solo componente hijo (opcional, puede no existir)
  firstCard = viewChild(ImageCardComponent);

  // Consultar todos los componentes hijos que coincidan
  allCards = viewChildren(ImageCardComponent);
}
```

```html
<!-- gallery.component.html -->
<div #container class="gallery">
  @for (image of images(); track image.id) {
    <app-image-card [image]="image" />
  }
</div>
```

### Diferencias clave

| API | Resultado | Obligatoriedad |
|---|---|---|
| `viewChild.required()` | Un solo elemento, garantizado | Lanza error si no existe |
| `viewChild()` | Un solo elemento o `undefined` | Opcional |
| `viewChildren()` | Lista de todos los elementos coincidentes | Siempre retorna array |

---

## Content queries

Consultar contenido proyectado desde el componente padre.

```typescript
import { Component, contentChild, contentChildren, effect, signal, input } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  // Consultar todos los hijos Tab proyectados
  tabs = contentChildren(TabComponent);

  // Consultar un solo elemento proyectado por referencia
  header = contentChild('tabHeader');

  activeTab = signal<TabComponent | undefined>(undefined);

  constructor() {
    // Establecer la primera pestana como activa cuando estan disponibles
    effect(() => {
      const firstTab = this.tabs()[0];
      if (firstTab && !this.activeTab()) {
        this.activeTab.set(firstTab);
      }
    });
  }

  selectTab(tab: TabComponent) {
    this.activeTab.set(tab);
  }
}
```

```html
<!-- tabs.component.html -->
<div class="tab-headers">
  @for (tab of tabs(); track tab.label()) {
    <button
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

### Componente Tab

```typescript
@Component({
  selector: 'app-tab',
  template: `<ng-content />`,
  host: {
    '[class.active]': 'isActive()',
    '[style.display]': 'isActive() ? "block" : "none"',
  },
})
export class TabComponent {
  label = input.required<string>();
  isActive = input(false);
}
```

### Uso de tabs con proyeccion

```html
<app-tabs>
  <app-tab label="General">
    <p>Contenido de la pestana general</p>
  </app-tab>
  <app-tab label="Configuracion">
    <p>Contenido de configuracion</p>
  </app-tab>
  <app-tab label="Avanzado">
    <p>Opciones avanzadas</p>
  </app-tab>
</app-tabs>
```

---

## Inyeccion de dependencias en componentes

Usar siempre la funcion `inject()` en lugar de inyeccion por constructor.

### Ejemplo basico con dashboard

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private config = inject(APP_CONFIG);

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
```

### Inyeccion opcional

Cuando el servicio puede no estar disponible en el arbol de inyectores:

```typescript
// Retorna null si el servicio no esta registrado
private analytics = inject(AnalyticsService, { optional: true });

// Uso seguro
trackEvent(event: string) {
  this.analytics?.track(event);
}
```

### Inyeccion con scope restringido

```typescript
// Solo busca en el inyector del propio componente
private localService = inject(LocalService, { self: true });

// Solo busca en inyectores ancestros, no en el propio
private parentService = inject(ParentService, { skipSelf: true });

// Solo busca en el inyector del host
private hostService = inject(HostService, { host: true });
```

---

## Comunicacion entre componentes

### Padre a hijo (inputs)

```typescript
// Componente padre
@Component({
  templateUrl: './parent.component.html',
})
export class ParentComponent {
  parentData = signal({ name: 'Test' });
  config = { theme: 'dark' };
}
```

```html
<!-- parent.component.html -->
<app-child [data]="parentData()" [config]="config" />
```

```typescript
// Componente hijo
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
})
export class ChildComponent {
  data = input.required<Data>();
  config = input<Config>();
}
```

### Hijo a padre (outputs)

```typescript
// Componente hijo
@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
})
export class ChildComponent {
  saved = output<Data>();

  save() {
    this.saved.emit({ id: 1, name: 'Item' });
  }
}
```

```html
<!-- child.component.html -->
<button (click)="save()">Guardar</button>
```

```typescript
// Componente padre
@Component({
  templateUrl: './parent.component.html',
})
export class ParentComponent {
  onSaved(data: Data) {
    console.log('Guardado:', data);
  }
}
```

```html
<!-- parent.component.html -->
<app-child (saved)="onSaved($event)" />
```

---

## Patron de servicio compartido

Para comunicacion entre componentes que no tienen relacion padre-hijo directa.

### Servicio de estado compartido

```typescript
import { Injectable, signal, computed } from '@angular/core';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  // Exposicion publica de solo lectura
  readonly cartItems = this.items.asReadonly();

  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  readonly itemCount = computed(() =>
    this.items().reduce((count, item) => count + item.quantity, 0)
  );

  addItem(item: CartItem) {
    this.items.update(items => [...items, item]);
  }

  removeItem(id: string) {
    this.items.update(items => items.filter(i => i.id !== id));
  }

  updateQuantity(id: string, quantity: number) {
    this.items.update(items =>
      items.map(item => item.id === id ? { ...item, quantity } : item)
    );
  }

  clearCart() {
    this.items.set([]);
  }
}
```

### Componente productor

```typescript
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
})
export class ProductComponent {
  private cart = inject(CartService);
  product = input.required<Product>();

  addToCart() {
    this.cart.addItem({
      id: this.product().id,
      name: this.product().name,
      price: this.product().price,
      quantity: 1,
    });
  }
}
```

```html
<!-- product.component.html -->
<div class="product">
  <h3>{{ product().name }}</h3>
  <p>{{ product().price | currency }}</p>
  <button (click)="addToCart()">Agregar al carrito</button>
</div>
```

### Componente consumidor

```typescript
@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
})
export class CartSummaryComponent {
  protected cart = inject(CartService);
}
```

```html
<!-- cart-summary.component.html -->
<div class="cart-summary">
  <span>Articulos: {{ cart.itemCount() }}</span>
  <span>Total: {{ cart.total() | currency }}</span>
</div>
```

---

## Componentes dinamicos

Usar `@defer` para carga diferida de componentes pesados.

### Triggers disponibles

| Trigger | Descripcion |
|---|---|
| `on viewport` | Cuando el elemento entra en el viewport del navegador |
| `on idle` | Cuando el navegador esta inactivo (requestIdleCallback) |
| `on interaction` | Al interactuar el usuario (click, focus) |
| `on hover` | Al pasar el mouse sobre el elemento |
| `on immediate` | Inmediatamente despues del contenido no diferido |
| `on timer(500ms)` | Despues del tiempo especificado |
| `when condition` | Cuando la expresion se evalua como `true` |

### Ejemplo con viewport

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-placeholder">Cargando grafico...</div>
} @loading (minimum 500ms) {
  <app-spinner />
} @error {
  <p>Error al cargar el grafico</p>
}
```

### Ejemplo con interaccion y prefetch

```html
@defer (on interaction; prefetch on idle) {
  <app-comments [postId]="postId()" />
} @placeholder {
  <button>Cargar comentarios</button>
}
```

### Ejemplo con condicion

```html
@defer (when showAdvancedOptions()) {
  <app-advanced-settings [config]="config()" />
} @placeholder {
  <p>Las opciones avanzadas se cargaran cuando se activen</p>
}
```

### Ejemplo con timer

```html
@defer (on timer(2s)) {
  <app-recommendations [userId]="userId()" />
} @placeholder {
  <div class="skeleton-loader"></div>
}
```

### Bloques del defer

| Bloque | Proposito |
|---|---|
| `@defer` | Contenido que se carga de forma diferida |
| `@placeholder` | Contenido mostrado antes de que inicie la carga |
| `@loading` | Contenido mostrado mientras se carga (acepta `minimum` y `after`) |
| `@error` | Contenido mostrado si la carga falla |

---

## Directivas de atributo

Directivas que modifican la apariencia o comportamiento de un elemento.

### Directiva Highlight

```typescript
import { Directive, input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'color()',
  },
})
export class HighlightDirective {
  color = input('yellow', { alias: 'appHighlight' });
}
```

### Uso en componentes

```typescript
@Component({
  imports: [HighlightDirective],
  templateUrl: './page.component.html',
})
export class PageComponent {}
```

```html
<!-- page.component.html -->
<app-card appHighlight="lightblue" />
<p appHighlight="#f0f0f0">Texto resaltado</p>
<span appHighlight>Resaltado con color por defecto (amarillo)</span>
```

### Directiva con multiples propiedades

```typescript
import { Directive, input, computed } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  host: {
    '[attr.data-tooltip]': 'text()',
    '[attr.data-tooltip-position]': 'position()',
    '[class.has-tooltip]': 'true',
  },
})
export class TooltipDirective {
  text = input.required<string>({ alias: 'appTooltip' });
  position = input<'top' | 'bottom' | 'left' | 'right'>('top', {
    alias: 'appTooltipPosition',
  });
}
```

```html
<button appTooltip="Guardar cambios" appTooltipPosition="bottom">
  Guardar
</button>
```

---

## Error boundaries

Componente que atrapa errores de sus hijos y muestra una interfaz de recuperacion.

### Componente ErrorBoundary

```typescript
import { Component, signal, inject, input } from '@angular/core';
import { ErrorHandler } from '@angular/core';

@Component({
  selector: 'app-error-boundary',
  templateUrl: './error-boundary.component.html',
  styleUrl: './error-boundary.component.scss',
})
export class ErrorBoundaryComponent {
  hasError = signal(false);
  errorMessage = signal('');

  fallbackMessage = input('Algo salio mal');

  private errorHandler = inject(ErrorHandler);

  handleError(error: unknown) {
    this.hasError.set(true);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    this.errorMessage.set(message);
    this.errorHandler.handleError(error);
  }

  retry() {
    this.hasError.set(false);
    this.errorMessage.set('');
  }
}
```

```html
<!-- error-boundary.component.html -->
@if (hasError()) {
  <div class="error-boundary">
    <div class="error-boundary__icon">
      <mat-icon>error_outline</mat-icon>
    </div>
    <h3 class="error-boundary__title">{{ fallbackMessage() }}</h3>
    @if (errorMessage()) {
      <p class="error-boundary__message">{{ errorMessage() }}</p>
    }
    <button mat-raised-button color="primary" (click)="retry()">
      Reintentar
    </button>
  </div>
} @else {
  <ng-content />
}
```

```scss
// error-boundary.component.scss
.error-boundary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  min-height: 200px;

  &__icon {
    font-size: 3rem;
    color: #f44336;
    margin-bottom: 1rem;

    mat-icon {
      font-size: inherit;
      width: auto;
      height: auto;
    }
  }

  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
    color: #333;
  }

  &__message {
    font-size: 0.875rem;
    color: #666;
    margin: 0 0 1.5rem;
    max-width: 400px;
  }
}
```

### Uso del error boundary

```html
<app-error-boundary fallbackMessage="Error al cargar el panel">
  <app-dashboard-panel [data]="panelData()" />
</app-error-boundary>

<app-error-boundary>
  <app-user-list />
</app-error-boundary>
```
