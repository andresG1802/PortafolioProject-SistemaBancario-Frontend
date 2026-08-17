import { useDispatch, useSelector } from 'react-redux';
import { isAxiosError } from 'axios';
import bancoApi from '../api/bancoApi';
import type { AppDispatch, RootState } from '../store';
import {
  onHistorialLoaded,
  onTransaccionCreada,
  onOpenTransaccionModal,
  onCloseTransaccionModal,
  onSetTransaccionesLoading,
  onSetTransaccionesError,
  showToast,
} from '../store';
import { extractErrorMessage, generarIdempotencyKey } from '../helpers';
import type {
  DepositoRequest,
  RetiroRequest,
  Transaccion,
  TransferenciaRequest,
  TipoTransaccion,
} from '../types';

export const useTransaccionesStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { historial, modalTipo, isLoading, errorMessage } = useSelector(
    (state: RootState) => state.transacciones
  );

  const startLoadHistorial = async (cuentaId: string) => {
    dispatch(onSetTransaccionesLoading(true));
    try {
      const { data } = await bancoApi.get<Transaccion[]>(`/api/transacciones/cuenta/${cuentaId}`);
      dispatch(onHistorialLoaded(data));
    } catch (error) {
      dispatch(onSetTransaccionesError(extractErrorMessage(error, 'No se pudo cargar el historial')));
    }
  };

  // El backend responde 201 si la transaccion quedo COMPLETADA, pero 422 si quedo
  // FALLIDA/REVERTIDA (con el cuerpo de la transaccion igual en ambos casos): en los dos
  // casos hay que agregarla al historial, solo cambia si el toast es de exito o de error.
  const ejecutarOperacion = async (peticion: () => Promise<{ data: Transaccion }>, mensajeError: string) => {
    dispatch(onSetTransaccionesLoading(true));
    try {
      const { data } = await peticion();
      dispatch(onTransaccionCreada(data));
      dispatch(showToast({ type: 'success', message: `${data.tipo} completada` }));
    } catch (error) {
      if (isAxiosError<Transaccion>(error) && error.response?.data?.estado) {
        const data = error.response.data;
        dispatch(onTransaccionCreada(data));
        dispatch(showToast({ type: 'error', message: data.motivoFallo ?? `${data.tipo} ${data.estado}` }));
      } else {
        dispatch(onSetTransaccionesError(extractErrorMessage(error, mensajeError)));
      }
    }
  };

  const startDepositar = (request: DepositoRequest) =>
    ejecutarOperacion(
      () =>
        bancoApi.post<Transaccion>('/api/transacciones/depositos', request, {
          headers: { 'Idempotency-Key': generarIdempotencyKey() },
        }),
      'No se pudo procesar el deposito'
    );

  const startRetirar = (request: RetiroRequest) =>
    ejecutarOperacion(
      () =>
        bancoApi.post<Transaccion>('/api/transacciones/retiros', request, {
          headers: { 'Idempotency-Key': generarIdempotencyKey() },
        }),
      'No se pudo procesar el retiro'
    );

  const startTransferir = (request: TransferenciaRequest) =>
    ejecutarOperacion(
      () =>
        bancoApi.post<Transaccion>('/api/transacciones/transferencias', request, {
          headers: { 'Idempotency-Key': generarIdempotencyKey() },
        }),
      'No se pudo procesar la transferencia'
    );

  const openTransaccionModal = (tipo: TipoTransaccion) => dispatch(onOpenTransaccionModal(tipo));
  const closeTransaccionModal = () => dispatch(onCloseTransaccionModal());

  return {
    // Propiedades
    historial,
    modalTipo,
    isLoading,
    errorMessage,

    // Metodos
    startLoadHistorial,
    startDepositar,
    startRetirar,
    startTransferir,
    openTransaccionModal,
    closeTransaccionModal,
  };
};
