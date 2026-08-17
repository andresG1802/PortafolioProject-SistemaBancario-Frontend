import axios from 'axios';

// Instancia unica hacia el api-gateway (puerto 8080): el gateway enruta por Path hacia
// clientes/cuentas/transacciones/prestamos/notificaciones-service, asi que un solo baseURL
// alcanza para todo el frontend.
const bancoApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

bancoApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default bancoApi;
