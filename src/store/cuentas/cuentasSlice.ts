import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cuenta } from '../../types';

interface CuentasState {
  cuentas: Cuenta[];
  activeCuenta: Cuenta | null;
  isModalOpen: boolean;
  isLoading: boolean;
  errorMessage?: string;
}

const initialState: CuentasState = {
  cuentas: [],
  activeCuenta: null,
  isModalOpen: false,
  isLoading: false,
};

export const cuentasSlice = createSlice({
  name: 'cuentas',
  initialState,
  reducers: {
    onCuentasLoaded: (state, { payload }: PayloadAction<Cuenta[]>) => {
      state.cuentas = payload;
      state.isLoading = false;
    },
    onCuentaAdded: (state, { payload }: PayloadAction<Cuenta>) => {
      state.cuentas.unshift(payload);
      state.isModalOpen = false;
      state.isLoading = false;
    },
    onCuentaUpdated: (state, { payload }: PayloadAction<Cuenta>) => {
      state.cuentas = state.cuentas.map((c) => (c.id === payload.id ? payload : c));
    },
    onSetActiveCuenta: (state, { payload }: PayloadAction<Cuenta | null>) => {
      state.activeCuenta = payload;
    },
    onOpenCuentaModal: (state) => {
      state.isModalOpen = true;
      state.errorMessage = undefined;
    },
    onCloseCuentaModal: (state) => {
      state.isModalOpen = false;
      state.errorMessage = undefined;
    },
    onSetCuentasLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    onSetCuentasError: (state, { payload }: PayloadAction<string | undefined>) => {
      state.errorMessage = payload;
      state.isLoading = false;
    },
  },
});

export const {
  onCuentasLoaded,
  onCuentaAdded,
  onCuentaUpdated,
  onSetActiveCuenta,
  onOpenCuentaModal,
  onCloseCuentaModal,
  onSetCuentasLoading,
  onSetCuentasError,
} = cuentasSlice.actions;
