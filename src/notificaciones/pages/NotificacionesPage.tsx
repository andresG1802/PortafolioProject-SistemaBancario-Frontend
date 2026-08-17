import { useEffect } from 'react';

import { ClienteSelector } from '../../clientes';
import { NotificacionesFeed } from '../components/NotificacionesFeed';
import { useClientesStore, useNotificacionesStore } from '../../hooks';

export const NotificacionesPage = () => {
  const { activeCliente } = useClientesStore();
  const { startLoadNotificacionesPorCliente } = useNotificacionesStore();

  useEffect(() => {
    if (activeCliente) startLoadNotificacionesPorCliente(activeCliente.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCliente?.id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Notificaciones</h1>
      </div>

      <ClienteSelector />

      {activeCliente ? (
        <NotificacionesFeed />
      ) : (
        <div className="card">Selecciona un cliente para ver sus notificaciones.</div>
      )}
    </div>
  );
};
