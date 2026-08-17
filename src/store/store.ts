import { configureStore } from '@reduxjs/toolkit';
import {
  authSlice,
  uiSlice,
  clientesSlice,
  cuentasSlice,
  transaccionesSlice,
  prestamosSlice,
  notificacionesSlice,
} from './';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    clientes: clientesSlice.reducer,
    cuentas: cuentasSlice.reducer,
    transacciones: transaccionesSlice.reducer,
    prestamos: prestamosSlice.reducer,
    notificaciones: notificacionesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
