import { Pipe, PipeTransform } from '@angular/core';

const ETIQUETAS: Record<string, string> = {
  DEPOSITO: 'Depósito',
  RETIRO: 'Retiro',
  TRANSFERENCIA_ENVIADA: 'Transferencia enviada',
  TRANSFERENCIA_RECIBIDA: 'Transferencia recibida',
};

@Pipe({ name: 'tipoMov' })
export class TipoMovPipe implements PipeTransform {
  transform(valor: string | null | undefined): string { return valor ? (ETIQUETAS[valor] ?? valor) : ''; }
}

export const esEntrada = (t: string) => t === 'DEPOSITO' || t === 'TRANSFERENCIA_RECIBIDA';
