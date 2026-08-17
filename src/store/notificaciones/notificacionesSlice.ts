import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Notificacion } from '../../types';

interface NotificacionesState {
  notificaciones: Notificacion[];
  isLoading: boolean;
  errorMessage?: string;
}

const initialState: NotificacionesState = {
  notificaciones: [],
  isLoading: false,
};

export const notificacionesSlice = createSlice({
  name: 'notificaciones',
  initialState,
  reducers: {
    onNotificacionesLoaded: (state, { payload }: PayloadAction<Notificacion[]>) => {
      state.notificaciones = payload;
      state.isLoading = false;
    },
    onSetNotificacionesLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isLoading = payload;
    },
    onSetNotificacionesError: (state, { payload }: PayloadAction<string | undefined>) => {
      state.errorMessage = payload;
      state.isLoading = false;
    },
  },
});

export const { onNotificacionesLoaded, onSetNotificacionesLoading, onSetNotificacionesError } =
  notificacionesSlice.actions;
