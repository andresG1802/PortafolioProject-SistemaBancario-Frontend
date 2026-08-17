import { useDispatch, useSelector } from 'react-redux';
import bancoApi from '../api/bancoApi';
import type { AppDispatch, RootState } from '../store';
import {
  onCuentasLoaded,
  onCuentaAdded,
  onCuentaUpdated,
  onSetActiveCuenta,
  onOpenCuentaModal,
  onCloseCuentaModal,
  onSetCuentasLoading,
  onSetCuentasError,
  showToast,
} from '../store';
import { extractErrorMessage } from '../helpers';
import type { AbrirCuentaRequest, Cuenta, EstadoCuenta } from '../types';

export const useCuentasStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cuentas, activeCuenta, isModalOpen, isLoading, errorMessage } = useSelector(
    (state: RootState) => state.cuentas
  );

  const startLoadCuentasPorCliente = async (clienteId: string) => {
    dispatch(onSetCuentasLoading(true));
    try {
      const { data } = await bancoApi.get<Cuenta[]>(`/api/cuentas/cliente/${clienteId}`);
      dispatch(onCuentasLoaded(data));
    } catch (error) {
      dispatch(onSetCuentasError(extractErrorMessage(error, 'No se pudieron cargar las cuentas')));
    }
  };

  const startAbrirCuenta = async (request: AbrirCuentaRequest) => {
    dispatch(onSetCuentasLoading(true));
    try {
      const { data } = await bancoApi.post<Cuenta>('/api/cuentas', request);
      dispatch(onCuentaAdded(data));
      dispatch(showToast({ type: 'success', message: `Cuenta ${data.numeroCuenta} abierta` }));
    } catch (error) {
      dispatch(onSetCuentasError(extractErrorMessage(error, 'No se pudo abrir la cuenta')));
    }
  };

  const startCambiarEstadoCuenta = async (id: string, estado: EstadoCuenta) => {
    try {
      const { data } = await bancoApi.patch<Cuenta>(`/api/cuentas/${id}/estado`, { estado });
      dispatch(onCuentaUpdated(data));
      dispatch(showToast({ type: 'success', message: `Cuenta ${data.numeroCuenta} ahora esta ${data.estado}` }));
    } catch (error) {
      dispatch(showToast({ type: 'error', message: extractErrorMessage(error, 'No se pudo cambiar el estado') }));
    }
  };

  const setActiveCuenta = (cuenta: Cuenta | null) => dispatch(onSetActiveCuenta(cuenta));
  const openCuentaModal = () => dispatch(onOpenCuentaModal());
  const closeCuentaModal = () => dispatch(onCloseCuentaModal());

  return {
    // Propiedades
    cuentas,
    activeCuenta,
    isModalOpen,
    isLoading,
    errorMessage,

    // Metodos
    startLoadCuentasPorCliente,
    startAbrirCuenta,
    startCambiarEstadoCuenta,
    setActiveCuenta,
    openCuentaModal,
    closeCuentaModal,
  };
};
