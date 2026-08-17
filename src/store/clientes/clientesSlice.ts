import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cliente } from '../../types';

interface ClientesState {
  clientes: Cliente[];
  activeCliente: Cliente | null;
  isModalOpen: boolean;
  isLoading: boolean;
  errorMessage?: string;
}

const initialState: ClientesState = {
  clientes: [],
  activeCliente: null,
  isModalOpen: false,
  isLoading: false,
};

export const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    onClientesLoaded: (state, { payload }: PayloadAction<Cliente[]>) => {
      state.clientes = payload;
      state.isLoading = false;
    },
    onClienteAdded: (state, { payload }: PayloadAction<Cliente>) => {
      state.clientes.unshift(payload);
      state.isModalOpen = false;
      state.isLoading = false;
    },
    onSetActiveCliente: (state, { payload }: PayloadAction<Cliente | null>) => {
      state.activeCliente = payload;
    },
    onOpenClienteModal: (state) => {
      state.isModalOpen = true;
      state.errorMessage = undefined;
    },
    onCloseClienteModal: (state) => {
      state.isModalOpen = false;
      state.errorMessage = undefined;
    },
    onSetClientesLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    onSetClientesError: (state, { payload }: PayloadAction<string | undefined>) => {
      state.errorMessage = payload;
      state.isLoading = false;
    },
  },
});

export const {
  onClientesLoaded,
  onClienteAdded,
  onSetActiveCliente,
  onOpenClienteModal,
  onCloseClienteModal,
  onSetClientesLoading,
  onSetClientesError,
} = clientesSlice.actions;
