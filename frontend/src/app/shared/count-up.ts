import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';

/** Anima un número desde 0 hasta su valor (formato entero o dinero en quetzales). */
@Directive({ selector: '[appCountUp]' })
export class CountUp implements OnChanges {
  @Input('appCountUp') valor = 0;
  @Input() dinero = false;
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngOnChanges() {
    const meta = Number(this.valor) || 0;
    const fmt = (n: number) => this.dinero
      ? 'Q' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(n).toLocaleString('en-US');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { this.el.nativeElement.textContent = fmt(meta); return; }
    const t0 = performance.now(), dur = 800;
    const paso = (t: number) => {
      const p = Math.min((t - t0) / dur, 1);
      this.el.nativeElement.textContent = fmt(meta * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }
}
