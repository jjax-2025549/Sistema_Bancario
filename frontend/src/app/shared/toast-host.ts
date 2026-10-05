import { Component, inject } from '@angular/core';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast-host',
  template: `
    <div class="toasts" role="status" aria-live="polite">
      @for (t of toast.items(); track t.id) {
        <div class="toast" [class.success]="t.tipo === 'success'" [class.error]="t.tipo === 'error'" [class.warn]="t.tipo === 'warn'">
          <span class="toast-dot" aria-hidden="true"></span>
          <p>{{ t.texto }}</p>
          <button type="button" (click)="toast.close(t.id)" aria-label="Cerrar notificación">✕</button>
        </div>
      }
    </div>
  `,
})
export class ToastHost { toast = inject(ToastService); }
