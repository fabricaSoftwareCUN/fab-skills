# Componentes Angular - Fabrica de Software CUN

Referencia para la creacion de componentes Angular siguiendo las mejores practicas de la Fabrica de Software CUN.
Basada en `angular-component-fab` y adaptada al contexto institucional.

## Regla principal

Los componentes son **standalone por defecto** en Angular v22+. No usar `standalone: true` explicitamente en el decorador `@Component`.

## Generacion de componentes

```bash
ng generate component feature/component-name
```

El CLI genera automaticamente:
- `component-name.component.ts` - Logica y comportamiento
- `component-name.component.html` - Plantilla y estructura
- `component-name.component.scss` - Estilos visuales
- `component-name.component.spec.ts` - Pruebas unitarias

## Separacion de responsabilidades

Cada componente se divide en archivos independientes segun su responsabilidad:

| Archivo | Responsabilidad |
|---|---|
| `.ts` | Logica, estado, inyeccion de dependencias, eventos |
| `.html` | Plantilla declarativa, estructura del DOM |
| `.scss` | Estilos visuales, encapsulados por componente |
| `.spec.ts` | Pruebas unitarias con Jest |

## Reglas estrictas

- **NUNCA** usar inline HTML/CSS dentro del archivo `.ts`
- **SIEMPRE** usar `templateUrl` y `styleUrl` para referenciar archivos externos
- **SIEMPRE** usar `ChangeDetectionStrategy.OnPush`
- **SIEMPRE** usar `inject()` en lugar de inyeccion por constructor

```typescript
// CORRECTO
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
})
export class ExampleComponent {}

// INCORRECTO - No usar template/styles inline
@Component({
  selector: 'app-example',
  template: `<div>NO HACER ESTO</div>`,       // NO
  styles: [`:host { display: block; }`],       // NO
})
export class ExampleComponent {}
```

## Ejemplo completo: user-card

### user-card.component.ts

```typescript
import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  booleanAttribute,
} from '@angular/core';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'user-card',
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
  },
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
})
export class UserCardComponent {
  // Input requerido
  name = input.required<string>();

  // Input opcional con valor por defecto
  email = input<string>('');
  showEmail = input(false);

  // Input con transformacion
  isActive = input(false, { transform: booleanAttribute });

  // Valor computado derivado de inputs
  avatarUrl = computed(() => `https://api.example.com/avatar/${this.name()}`);

  // Output
  selected = output<string>();

  handleClick() {
    this.selected.emit(this.name());
  }
}
```

### user-card.component.html

```html
<div class="user-card__avatar">
  <img [src]="avatarUrl()" [alt]="name() + ' avatar'" />
</div>
<h2 class="user-card__name">{{ name() }}</h2>
@if (showEmail()) {
  <p class="user-card__email">{{ email() }}</p>
}
```

### user-card.component.scss

```scss
:host {
  display: block;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }

  &.active {
    border-color: #1976d2;
    box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  }
}

.user-card {
  &__avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 0.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__name {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }

  &__email {
    font-size: 0.875rem;
    color: #666;
    margin: 0;
  }
}
```

## Signal inputs

```typescript
import { input, booleanAttribute, numberAttribute } from '@angular/core';

// Requerido - el padre debe proporcionarlo
name = input.required<string>();

// Opcional con valor por defecto
count = input(0);

// Opcional sin valor por defecto (permite undefined)
label = input<string>();

// Con alias para el binding en la plantilla
size = input('medium', { alias: 'buttonSize' });

// Con funcion de transformacion
disabled = input(false, { transform: booleanAttribute });
value = input(0, { transform: numberAttribute });
```

### Uso en la plantilla del padre

```html
<!-- Input requerido -->
<app-user-card [name]="userName()" />

<!-- Input con alias -->
<app-button buttonSize="large" />

<!-- Input con transform (acepta string del DOM como atributo) -->
<app-toggle disabled />
```

## Signal outputs

```typescript
import { output, outputFromObservable } from '@angular/core';
import { Subject } from 'rxjs';

// Output basico
clicked = output<void>();
selected = output<Item>();

// Con alias
valueChange = output<number>({ alias: 'change' });

// Desde Observable (interoperabilidad con RxJS)
scroll$ = new Subject<number>();
scrolled = outputFromObservable(this.scroll$);

// Emitir valores
this.clicked.emit();
this.selected.emit(item);
```

### Uso en la plantilla del padre

```html
<app-item-list (selected)="onItemSelected($event)" />
<app-slider (change)="onValueChange($event)" />
```

## Proyeccion de contenido

Usar `<ng-content />` para proyectar contenido del padre al hijo.

### Componente card con proyeccion

```typescript
// card.component.ts
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  title = input.required<string>();
}
```

```html
<!-- card.component.html -->
<div class="card">
  <div class="card__header">
    <h3>{{ title() }}</h3>
    <ng-content select="[card-actions]" />
  </div>
  <div class="card__body">
    <ng-content />
  </div>
  <div class="card__footer">
    <ng-content select="[card-footer]" />
  </div>
</div>
```

```html
<!-- Uso del componente card -->
<app-card title="Informacion del usuario">
  <button card-actions>Editar</button>

  <p>Contenido principal del card</p>

  <span card-footer>Ultima actualizacion: hace 5 minutos</span>
</app-card>
```

## Hooks de ciclo de vida

### afterNextRender y afterRender

Para logica que requiere acceso al DOM. Solo se ejecutan en el navegador (no en SSR).

```typescript
import { Component, afterNextRender, afterRender, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');

  constructor() {
    // Se ejecuta una sola vez despues del primer render
    afterNextRender(() => {
      this.initChart(this.canvas().nativeElement);
    });

    // Se ejecuta despues de cada render
    afterRender(() => {
      this.updateChartDimensions();
    });
  }

  private initChart(canvas: HTMLCanvasElement) {
    // Inicializacion del grafico
  }

  private updateChartDimensions() {
    // Actualizacion de dimensiones
  }
}
```

### ngOnInit y ngOnDestroy

```typescript
import { Component, OnInit, OnDestroy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-data-feed',
  templateUrl: './data-feed.component.html',
  styleUrl: './data-feed.component.scss',
})
export class DataFeedComponent implements OnInit {
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.dataService.stream$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.processData(data));
  }

  private processData(data: unknown) {
    // Procesar datos del stream
  }
}
```

## Sintaxis de plantilla

Usar la nueva sintaxis de control de flujo. **NO** usar las directivas estructurales legacy.

### @if (reemplaza *ngIf)

```html
@if (user()) {
  <app-user-profile [user]="user()!" />
} @else if (isLoading()) {
  <app-spinner />
} @else {
  <p>No se encontro el usuario</p>
}
```

### @for (reemplaza *ngFor)

```html
@for (item of items(); track item.id) {
  <app-item-card [item]="item" />
} @empty {
  <p>No hay elementos para mostrar</p>
}
```

### @switch (reemplaza *ngSwitch)

```html
@switch (status()) {
  @case ('active') {
    <span class="badge badge--success">Activo</span>
  }
  @case ('inactive') {
    <span class="badge badge--warning">Inactivo</span>
  }
  @case ('blocked') {
    <span class="badge badge--danger">Bloqueado</span>
  }
  @default {
    <span class="badge">Desconocido</span>
  }
}
```

### Prohibido: directivas legacy

```html
<!-- NO USAR -->
<div *ngIf="condition">...</div>
<div *ngFor="let item of items">...</div>
<div [ngSwitch]="value">...</div>

<!-- USAR EN SU LUGAR -->
@if (condition) { ... }
@for (item of items; track item.id) { ... }
@switch (value) { ... }
```

## Bindings de clase y estilo

No usar `ngClass` ni `ngStyle`. Usar bindings directos.

```html
<!-- CORRECTO: binding directo de clase -->
<div [class.active]="isActive()" [class.disabled]="isDisabled()">
  Contenido
</div>

<!-- CORRECTO: binding directo de estilo -->
<div [style.width.px]="width()" [style.color]="textColor()">
  Contenido
</div>

<!-- INCORRECTO: no usar ngClass ni ngStyle -->
<div [ngClass]="{'active': isActive()}">NO</div>
<div [ngStyle]="{'width.px': width()}">NO</div>
```

## NgOptimizedImage

Usar `NgOptimizedImage` para optimizacion automatica de imagenes.

### hero.component.ts

```typescript
import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [NgOptimizedImage],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  title = input.required<string>();
  imageUrl = input.required<string>();
}
```

### hero.component.html

```html
<section class="hero">
  <img
    [ngSrc]="imageUrl()"
    [alt]="title()"
    width="1200"
    height="600"
    priority
  />
  <h1>{{ title() }}</h1>
</section>
```

Beneficios de `NgOptimizedImage`:
- Carga diferida automatica (lazy loading nativo)
- Prevencion de layout shift (requiere width y height)
- Prioridad de carga para imagenes above-the-fold (`priority`)
- Generacion automatica de `srcset` con loaders configurados
