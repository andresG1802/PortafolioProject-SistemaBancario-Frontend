import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Transaccion, TipoTransaccion } from '../../types';

interface TransaccionesState {
  historial: Transaccion[];
  modalTipo: TipoTransaccion | null;
  isLoading: boolean;
  errorMessage?: string;
}

const initialState: TransaccionesState = {
  historial: [],
  modalTipo: null,
  isLoading: false,
};

export const transaccionesSlice = createSlice({
  name: 'transacciones',
  initialState,
  reducers: {
    onHistorialLoaded: (state, { payload }: PayloadAction<Transaccion[]>) => {
      state.historial = payload;
      state.isLoading = false;
    },
    onTransaccionCreada: (state, { payload }: PayloadAction<Transaccion>) => {
      state.historial.unshift(payload);
      state.modalTipo = null;
      state.isLoading = false;
    },
    onOpenTransaccionModal: (state, { payload }: PayloadAction<TipoTransaccion>) => {
      state.modalTipo = payload;
      state.errorMessage = undefined;
    },
    onCloseTransaccionModal: (state) => {
      state.modalTipo = null;
      state.errorMessage = undefined;
    },
    onSetTransaccionesLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    onSetTransaccionesError: (state, { payload }: PayloadAction<string | undefined>) => {
      state.errorMessage = payload;
      state.isLoading = false;
    },
  },
});

export const {
  onHistorialLoaded,
  onTransaccionCreada,
  onOpenTransaccionModal,
  onCloseTransaccionModal,
  onSetTransaccionesLoading,
  onSetTransaccionesError,
} = transaccionesSlice.actions;
