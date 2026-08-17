import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Cronograma, Prestamo } from '../../types';

interface PrestamosState {
  prestamos: Prestamo[];
  activePrestamo: Prestamo | null;
  cronograma: Cronograma | null;
  isModalOpen: boolean;
  isLoading: boolean;
  errorMessage?: string;
}

const initialState: PrestamosState = {
  prestamos: [],
  activePrestamo: null,
  cronograma: null,
  isModalOpen: false,
  isLoading: false,
};

export const prestamosSlice = createSlice({
  name: 'prestamos',
  initialState,
  reducers: {
    onPrestamosLoaded: (state, { payload }: PayloadAction<Prestamo[]>) => {
      state.prestamos = payload;
      state.isLoading = false;
    },
    onPrestamoAdded: (state, { payload }: PayloadAction<Prestamo>) => {
      state.prestamos.unshift(payload);
      state.isModalOpen = false;
      state.isLoading = false;
    },
    onPrestamoUpdated: (state, { payload }: PayloadAction<Prestamo>) => {
      state.prestamos = state.prestamos.map((p) => (p.id === payload.id ? payload : p));
      if (state.activePrestamo?.id === payload.id) {
        state.activePrestamo = payload;
      }
    },
    onSetActivePrestamo: (state, { payload }: PayloadAction<Prestamo | null>) => {
      state.activePrestamo = payload;
      state.cronograma = null;
    },
    onCronogramaLoaded: (state, { payload }: PayloadAction<Cronograma>) => {
      state.cronograma = payload;
    },
    onOpenPrestamoModal: (state) => {
      state.isModalOpen = true;
      state.errorMessage = undefined;
    },
    onClosePrestamoModal: (state) => {
      state.isModalOpen = false;
      state.errorMessage = undefined;
    },
    onSetPrestamosLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    onSetPrestamosError: (state, { payload }: PayloadAction<string | undefined>) => {
      state.errorMessage = payload;
      state.isLoading = false;
    },
  },
});

export const {
  onPrestamosLoaded,
  onPrestamoAdded,
  onPrestamoUpdated,
  onSetActivePrestamo,
  onCronogramaLoaded,
  onOpenPrestamoModal,
  onClosePrestamoModal,
  onSetPrestamosLoading,
  onSetPrestamosError,
} = prestamosSlice.actions;
