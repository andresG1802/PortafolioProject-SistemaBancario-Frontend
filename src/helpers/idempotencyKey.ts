// Cada operacion de dinero (deposito/retiro/transferencia) manda esta clave en el header
// Idempotency-Key: si el usuario reenvia el formulario (doble click, reintento de red),
// transacciones-service devuelve la transaccion ya creada en vez de duplicar el movimiento.
export function generarIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
