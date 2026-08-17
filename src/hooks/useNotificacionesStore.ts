import { useDispatch, useSelector } from 'react-redux';
import bancoApi from '../api/bancoApi';
import type { AppDispatch, RootState } from '../store';
import { onNotificacionesLoaded, onSetNotificacionesLoading, onSetNotificacionesError } from '../store';
import { extractErrorMessage } from '../helpers';
import type { Notificacion } from '../types';

export const useNotificacionesStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notificaciones, isLoading, errorMessage } = useSelector((state: RootState) => state.notificaciones);

  const startLoadNotificacionesPorCliente = async (clienteId: string) => {
    dispatch(onSetNotificacionesLoading(true));
    try {
      const { data } = await bancoApi.get<Notificacion[]>(`/api/notificaciones/cliente/${clienteId}`);
      dispatch(onNotificacionesLoaded(data));
    } catch (error) {
      dispatch(onSetNotificacionesError(extractErrorMessage(error, 'No se pudieron cargar las notificaciones')));
    }
  };

  return {
    // Propiedades
    notificaciones,
    isLoading,
    errorMessage,

    // Metodos
    startLoadNotificacionesPorCliente,
  };
};
