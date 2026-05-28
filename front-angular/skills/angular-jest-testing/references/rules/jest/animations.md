# Angular Animations Rule (Jest)

DO NOT import:

```ts
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
```

DO NOT use:

```ts
TestBed.configureTestingModule({
  imports: [NoopAnimationsModule, BrowserAnimationsModule],
});
```

### Reason

Jest cannot resolve `@angular/animations/browser`, causing runtime errors.

### Instead

- Do NOT import animation modules unless strictly required
- If Angular Material requires animations, mock them

```ts
providers: [{ provide: AnimationBuilder, useValue: {} }];
```
