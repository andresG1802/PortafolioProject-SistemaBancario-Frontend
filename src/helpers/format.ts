import { format as formatDateFns } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatCurrency(monto: number, moneda: string): string {
  try {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: moneda }).format(monto);
  } catch {
    return `${monto.toFixed(2)} ${moneda}`;
  }
}

export function formatDate(iso: string): string {
  return formatDateFns(new Date(iso), 'dd/MM/yyyy HH:mm', { locale: es });
}
