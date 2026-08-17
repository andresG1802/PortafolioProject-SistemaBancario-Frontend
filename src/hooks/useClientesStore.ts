import { useDispatch, useSelector } from 'react-redux';
import bancoApi from '../api/bancoApi';
import type { AppDispatch, RootState } from '../store';
import {
  onClientesLoaded,
  onClienteAdded,
  onSetActiveCliente,
  onOpenClienteModal,
  onCloseClienteModal,
  onSetClientesLoading,
  onSetClientesError,
  showToast,
} from '../store';
import { extractErrorMessage } from '../helpers';
import type { Cliente, ClienteRequest } from '../types';

export const useClientesStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { clientes, activeCliente, isModalOpen, isLoading, errorMessage } = useSelector(
    (state: RootState) => state.clientes
  );

  const startLoadClientes = async () => {
    dispatch(onSetClientesLoading(true));
    try {
      const { data } = await bancoApi.get<Cliente[]>('/api/clientes');
      dispatch(onClientesLoaded(data));
    } catch (error) {
      dispatch(onSetClientesError(extractErrorMessage(error, 'No se pudieron cargar los clientes')));
    }
  };

  const startCreateCliente = async (request: ClienteRequest) => {
    dispatch(onSetClientesLoading(true));
    try {
      const { data } = await bancoApi.post<Cliente>('/api/clientes', request);
      dispatch(onClienteAdded(data));
      dispatch(showToast({ type: 'success', message: `Cliente ${data.nombres} ${data.apellidos} creado` }));
    } catch (error) {
      dispatch(onSetClientesError(extractErrorMessage(error, 'No se pudo crear el cliente')));
    }
  };

  const setActiveCliente = (cliente: Cliente | null) => {
    dispatch(onSetActiveCliente(cliente));
  };

  const openClienteModal = () => dispatch(onOpenClienteModal());
  const closeClienteModal = () => dispatch(onCloseClienteModal());

  return {
    // Propiedades
    clientes,
    activeCliente,
    isModalOpen,
    isLoading,
    errorMessage,

    // Metodos
    startLoadClientes,
    startCreateCliente,
    setActiveCliente,
    openClienteModal,
    closeClienteModal,
  };
};
