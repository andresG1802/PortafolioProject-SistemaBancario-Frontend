// Espejo de los DTOs del backend (api-gateway -> clientes/cuentas/transacciones/prestamos/notificaciones-service).
// Los campos BigDecimal de Java (monto, saldo, tasaInteresAnual) llegan como number: Jackson
// serializa BigDecimal como numero JSON plano.

export type Role = 'ADMIN' | 'CAJERO' | 'CLIENTE';

// ----- clientes-service -----

export type TipoDocumento = 'DNI' | 'PASAPORTE' | 'CARNET_EXTRANJERIA';
export type EstadoCliente = 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';

export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  fechaNacimiento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado: EstadoCliente;
  createdAt: string;
  updatedAt: string;
}

export interface ClienteRequest {
  nombres: string;
  apellidos: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  fechaNacimiento: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}

// ----- cuentas-service -----

export type TipoCuenta = 'AHORRO' | 'CORRIENTE';
export type EstadoCuenta = 'ACTIVA' | 'BLOQUEADA' | 'CERRADA';

export interface Cuenta {
  id: string;
  numeroCuenta: string;
  clienteId: string;
  tipo: TipoCuenta;
  moneda: string;
  saldo: number;
  estado: EstadoCuenta;
  createdAt: string;
  updatedAt: string;
}

export interface AbrirCuentaRequest {
  clienteId: string;
  tipo: TipoCuenta;
  moneda: string;
  saldoInicial?: number;
}

// ----- transacciones-service -----

export type TipoTransaccion = 'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA';
export type EstadoTransaccion = 'PENDIENTE' | 'COMPLETADA' | 'FALLIDA' | 'REVERTIDA';

export interface Transaccion {
  id: string;
  tipo: TipoTransaccion;
  cuentaOrigenId?: string;
  cuentaDestinoId?: string;
  monto: number;
  moneda: string;
  estado: EstadoTransaccion;
  motivoFallo?: string;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface DepositoRequest {
  cuentaDestinoId: string;
  monto: number;
  moneda: string;
}

export interface RetiroRequest {
  cuentaOrigenId: string;
  monto: number;
  moneda: string;
}

export interface TransferenciaRequest {
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
  moneda: string;
}

// ----- prestamos-service -----

export type EstadoPrestamo = 'SOLICITADO' | 'APROBADO' | 'RECHAZADO' | 'DESEMBOLSADO';

export interface Prestamo {
  id: string;
  clienteId: string;
  cuentaDesembolsoId: string;
  monto: number;
  tasaInteresAnual: number;
  plazoMeses: number;
  estado: EstadoPrestamo;
  motivoRechazo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolicitudPrestamoRequest {
  clienteId: string;
  cuentaDesembolsoId: string;
  monto: number;
  tasaInteresAnual: number;
  plazoMeses: number;
}

export interface DecisionPrestamoRequest {
  aprobado: boolean;
  motivoRechazo?: string;
}

export interface Cuota {
  numero: number;
  saldoInicial: number;
  cuota: number;
  interes: number;
  amortizacion: number;
  saldoFinal: number;
}

export interface Cronograma {
  prestamoId: string;
  cuotaMensual: number;
  cuotas: Cuota[];
}

// ----- notificaciones-service -----

export type TipoNotificacion =
  | 'TRANSACCION_COMPLETADA'
  | 'TRANSACCION_REVERTIDA'
  | 'PRESTAMO_APROBADO'
  | 'PRESTAMO_RECHAZADO'
  | 'PRESTAMO_DESEMBOLSADO';
export type CanalNotificacion = 'EMAIL' | 'SMS';
export type EstadoNotificacion = 'ENVIADA' | 'FALLIDA';

export interface Notificacion {
  id: string;
  clienteId: string;
  tipo: TipoNotificacion;
  canal: CanalNotificacion;
  asunto: string;
  mensaje: string;
  estado: EstadoNotificacion;
  referenciaId?: string;
  createdAt: string;
}

// ----- error generico del backend (GlobalExceptionHandler de cada servicio) -----

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errores?: Record<string, string>;
}
