# Convenciones de Codigo - Fabrica de Software CUN

Reglas obligatorias de estilo, estructura y calidad para todos los proyectos Angular
de la Fabrica de Software CUN.

---

## TypeScript

### Configuracion estricta obligatoria

El `tsconfig.json` debe incluir las siguientes opciones:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "angularCompilerOptions": {
    "strictTemplates": true,
    "strictInjectionParameters": true
  }
}
```

### Reglas de tipado

| Regla                                          | Estado     |
|------------------------------------------------|------------|
| `strict: true`                                 | Obligatorio |
| `noImplicitOverride: true`                     | Obligatorio |
| `strictTemplates: true`                        | Obligatorio |
| Uso de `any`                                   | PROHIBIDO  |
| Uso de `unknown` cuando el tipo es incierto    | Permitido  |
| Funciones sin tipo de retorno explicito         | PROHIBIDO  |

### Prefijo para miembros privados mutables

Los miembros privados que mutan estado interno deben usar el prefijo `_`:

```typescript
export class ItemListComponent {
  // Senal privada mutable — prefijo _
  private readonly _itemsControl = signal<Item[]>([]);

  // Senal publica de solo lectura — sin prefijo
  readonly items = this._itemsControl.asReadonly();

  // Propiedad publica inmutable — sin prefijo
  readonly pageSize = 10;
}
```

### Interfaces sin prefijo `I`

```typescript
// PROHIBIDO
interface IUser {
  id: number;
  name: string;
}

// CORRECTO
interface User {
  id: number;
  name: string;
}
```

---

## Convencion de archivos

Patron general: `feature.type.ts` en kebab-case, consistente con `--file-name-style-guide=2016`.

| Tipo        | Convencion                | Ejemplo                          |
|-------------|---------------------------|----------------------------------|
| Componentes | kebab-case.component.ts   | `my-component.component.ts`      |
| Servicios   | kebab-case.service.ts     | `auth.service.ts`                |
| Interfaces  | kebab-case.interface.ts   | `user.interface.ts`              |
| Mocks       | kebab-case.mock.ts        | `user.mock.ts`                   |
| Utils       | kebab-case.utils.ts       | `form-errors.utils.ts`           |
| Pipes       | kebab-case.pipe.ts        | `form-control.pipe.ts`           |
| Tests       | kebab-case.spec.ts        | `auth.service.spec.ts`           |
| Plantillas  | kebab-case.component.html | `my-component.component.html`    |
| Estilos     | kebab-case.component.scss | `my-component.component.scss`    |
| Guards      | kebab-case.guard.ts       | `auth.guard.ts`                  |
| Interceptores | kebab-case.interceptor.ts | `error.interceptor.ts`         |

### Clases y decoradores

| Tipo        | Convencion                | Ejemplo                          |
|-------------|---------------------------|----------------------------------|
| Componentes | PascalCase + Component    | `MyComponentComponent`           |
| Servicios   | PascalCase + Service      | `AuthService`                    |
| Pipes       | PascalCase + Pipe         | `FormControlPipe`                |
| Guards      | camelCase (funcional)     | `authGuard`                      |
| Interceptores | camelCase (funcional)   | `errorInterceptor`               |

---

## ESLint (flat config obligatoria)

ESLint 10 no soporta `.eslintrc.json`. Todos los proyectos usan `eslint.config.js` con `angular-eslint` 22.

### eslint.config.js

```javascript
// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
```

### Scripts en package.json

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

---

## Orden de imports

Los imports deben organizarse en el siguiente orden, separados por linea en blanco:

```typescript
// 1. Angular core y modulos del framework
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// 2. Componentes, pipes y directivas standalone de Angular
import { RouterLink } from '@angular/router';

// 3. Librerias de terceros
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

// 4. Imports internos del proyecto (@shared, @core)
import { AuthService } from '@core/services/auth.service';
import { User } from '@shared/interfaces/user.interface';
import { isInvalidField, getFieldError } from '@shared/utils/form/form-errors';

// 5. Imports relativos (mismo feature o carpeta)
import { ItemDetailComponent } from './item-detail/item-detail.component';
```

### Reglas de imports

| Regla                                             | Estado     |
|---------------------------------------------------|------------|
| Separar grupos con linea en blanco                | Obligatorio |
| Usar alias `@shared` y `@core` para paths internos | Obligatorio |
| Imports relativos solo dentro del mismo feature    | Obligatorio |
| Imports circulares                                 | PROHIBIDO  |
| Imports de barrel (`index.ts`) excesivos           | Evitar     |

---

## Control de flujo en plantillas

Usar la sintaxis nativa de control de flujo. PROHIBIDO `*ngIf`, `*ngFor` (deprecados desde Angular 20).

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

### @for con track (reemplaza *ngFor + trackBy)

`@for` con `track` cumple el requisito de `trackBy` de STACK 4.4.

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
  @default {
    <span class="badge">Desconocido</span>
  }
}
```

---

## Formularios

### Utilidades compartidas

Usar las utilidades compartidas en `@shared/utils/form/form-errors.ts` para manejar
la validacion y los mensajes de error en formularios reactivos.

#### Helpers disponibles

```typescript
// @shared/utils/form/form-errors.ts

/**
 * Verifica si un campo del formulario es invalido y ha sido tocado.
 * Retorna true si el campo tiene errores y debe mostrar feedback visual.
 */
export const isInvalidField = (
  form: FormGroup,
  fieldName: string
): boolean => {
  const control = form.get(fieldName);
  return !!control && control.invalid && (control.dirty || control.touched);
};

/**
 * Obtiene el mensaje de error legible para un campo del formulario.
 * Retorna null si el campo no tiene errores.
 */
export const getFieldError = (
  form: FormGroup,
  fieldName: string
): string | null => {
  const control = form.get(fieldName);
  if (!control || !control.errors) return null;

  const errors = control.errors;

  if (errors['required']) return 'Este campo es obligatorio';
  if (errors['minlength']) {
    const min = errors['minlength'].requiredLength;
    return `Minimo ${min} caracteres`;
  }
  if (errors['maxlength']) {
    const max = errors['maxlength'].requiredLength;
    return `Maximo ${max} caracteres`;
  }
  if (errors['email']) return 'Correo electronico invalido';
  if (errors['pattern']) return 'Formato invalido';

  return 'Campo invalido';
};
```

### Reglas de formularios

| Regla                                                    | Estado     |
|----------------------------------------------------------|------------|
| Usar `isInvalidField()` y `getFieldError()` de @shared  | Obligatorio |
| Acceder a `control.errors` directamente en templates     | PROHIBIDO  |
| Acceder a `control.errors` directamente en componentes   | PROHIBIDO  |
| Formularios reactivos (`FormGroup`, `FormControl`)       | Obligatorio |
| Template-driven forms (`ngModel`)                        | PROHIBIDO  |

### Uso en templates

```html
<!-- PROHIBIDO — acceso directo a errores -->
<small *ngIf="form.get('email')?.errors?.['required']">
  Campo requerido
</small>

<!-- CORRECTO — usar helpers compartidos -->
@if (isInvalidField(form, 'email')) {
  <small mat-error>{{ getFieldError(form, 'email') }}</small>
}
```

---

## Validacion de templates en tests

### Usar `data-testid` para selectores

Los tests que validan HTML renderizado deben usar el atributo `data-testid`
como selector principal:

```html
<!-- En el template del componente -->
<h1 data-testid="page-title">{{ title() }}</h1>
<button data-testid="submit-btn" (click)="onSubmit()">Guardar</button>
```

### Verificar rendering con fixture.detectChanges()

```typescript
it('debe renderizar el titulo del componente', () => {
  // Ejecutar deteccion de cambios
  fixture.detectChanges();

  // Seleccionar por data-testid
  const titleElement = fixture.debugElement.query(
    By.css('[data-testid="page-title"]')
  );

  expect(titleElement).toBeTruthy();
  expect(titleElement.nativeElement.textContent).toContain('Mis Productos');
});
```

### Verificar elementos condicionales

```typescript
it('debe mostrar mensaje de error cuando el formulario es invalido', () => {
  // Configurar estado invalido
  component.form.get('email')?.setValue('');
  component.form.get('email')?.markAsTouched();

  // Detectar cambios para que el template se actualice
  fixture.detectChanges();

  // Verificar que el mensaje de error se renderizo
  const errorElement = fixture.debugElement.query(
    By.css('[data-testid="email-error"]')
  );

  expect(errorElement).toBeTruthy();
  expect(errorElement.nativeElement.textContent).toContain('obligatorio');
});
```

### Reglas de testing de templates

| Regla                                                | Estado     |
|------------------------------------------------------|------------|
| Usar `data-testid` como selector principal           | Obligatorio |
| Llamar `fixture.detectChanges()` antes de consultar  | Obligatorio |
| Selectores por clase CSS o ID para testing           | PROHIBIDO  |
| Selectores por estructura del DOM                    | Evitar     |
| Verificar texto visible con `textContent`            | Recomendado |
| Verificar atributos con `getAttribute()`             | Permitido  |
