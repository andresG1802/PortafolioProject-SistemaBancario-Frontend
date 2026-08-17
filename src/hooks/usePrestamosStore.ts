import { useDispatch, useSelector } from 'react-redux';
import bancoApi from '../api/bancoApi';
import type { AppDispatch, RootState } from '../store';
import {
  onPrestamosLoaded,
  onPrestamoAdded,
  onPrestamoUpdated,
  onSetActivePrestamo,
  onCronogramaLoaded,
  onOpenPrestamoModal,
  onClosePrestamoModal,
  onSetPrestamosLoading,
  onSetPrestamosError,
  showToast,
} from '../store';
import { extractErrorMessage } from '../helpers';
import type { Cronograma, DecisionPrestamoRequest, Prestamo, SolicitudPrestamoRequest } from '../types';

export const usePrestamosStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { prestamos, activePrestamo, cronograma, isModalOpen, isLoading, errorMessage } = useSelector(
    (state: RootState) => state.prestamos
  );

  const startLoadPrestamosPorCliente = async (clienteId: string) => {
    dispatch(onSetPrestamosLoading(true));
    try {
      const { data } = await bancoApi.get<Prestamo[]>(`/api/prestamos/cliente/${clienteId}`);
      dispatch(onPrestamosLoaded(data));
    } catch (error) {
      dispatch(onSetPrestamosError(extractErrorMessage(error, 'No se pudieron cargar los prestamos')));
    }
  };

  const startSolicitarPrestamo = async (request: SolicitudPrestamoRequest) => {
    dispatch(onSetPrestamosLoading(true));
    try {
      const { data } = await bancoApi.post<Prestamo>('/api/prestamos', request);
      dispatch(onPrestamoAdded(data));
      dispatch(showToast({ type: 'success', message: 'Prestamo solicitado' }));
    } catch (error) {
      dispatch(onSetPrestamosError(extractErrorMessage(error, 'No se pudo solicitar el prestamo')));
    }
  };

  const startDecidirPrestamo = async (id: string, request: DecisionPrestamoRequest) => {
    try {
      const { data } = await bancoApi.patch<Prestamo>(`/api/prestamos/${id}/decision`, request);
      dispatch(onPrestamoUpdated(data));
      dispatch(showToast({ type: 'success', message: `Prestamo ${data.estado.toLowerCase()}` }));
    } catch (error) {
      dispatch(showToast({ type: 'error', message: extractErrorMessage(error, 'No se pudo decidir sobre el prestamo') }));
    }
  };

  const startDesembolsarPrestamo = async (id: string) => {
    try {
      const { data } = await bancoApi.post<Prestamo>(`/api/prestamos/${id}/desembolsar`);
      dispatch(onPrestamoUpdated(data));
      dispatch(showToast({ type: 'success', message: 'Prestamo desembolsado' }));
    } catch (error) {
      dispatch(showToast({ type: 'error', message: extractErrorMessage(error, 'No se pudo desembolsar el prestamo') }));
    }
  };

  const startLoadCronograma = async (id: string) => {
    try {
      const { data } = await bancoApi.get<Cronograma>(`/api/prestamos/${id}/cronograma`);
      dispatch(onCronogramaLoaded(data));
    } catch (error) {
      dispatch(showToast({ type: 'error', message: extractErrorMessage(error, 'No se pudo cargar el cronograma') }));
    }
  };

  const setActivePrestamo = (prestamo: Prestamo | null) => dispatch(onSetActivePrestamo(prestamo));
  const openPrestamoModal = () => dispatch(onOpenPrestamoModal());
  const closePrestamoModal = () => dispatch(onClosePrestamoModal());

  return {
    // Propiedades
    prestamos,
    activePrestamo,
    cronograma,
    isModalOpen,
    isLoading,
    errorMessage,

    // Metodos
    startLoadPrestamosPorCliente,
    startSolicitarPrestamo,
    startDecidirPrestamo,
    startDesembolsarPrestamo,
    startLoadCronograma,
    setActivePrestamo,
    openPrestamoModal,
    closePrestamoModal,
  };
};
