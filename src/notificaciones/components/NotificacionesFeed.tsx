import { motion } from 'framer-motion';

import { Badge } from '../../components';
import { useNotificacionesStore } from '../../hooks';
import { formatDate } from '../../helpers';
import { listContainer, listItem } from '../../styles/motion';
import type { TipoNotificacion } from '../../types';

const iconoPorTipo: Record<TipoNotificacion, string> = {
  TRANSACCION_COMPLETADA: '💸',
  TRANSACCION_REVERTIDA: '↩️',
  PRESTAMO_APROBADO: '✅',
  PRESTAMO_RECHAZADO: '⛔',
  PRESTAMO_DESEMBOLSADO: '🏦',
};

export const NotificacionesFeed = () => {
  const { notificaciones, isLoading } = useNotificacionesStore();

  if (isLoading && notificaciones.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">
          <span className="spinner spinner-dark" />
        </div>
      </div>
    );
  }

  if (notificaciones.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">Este cliente todavia no tiene notificaciones.</div>
      </div>
    );
  }

  return (
    <motion.ul className="notif-feed" variants={listContainer} initial="initial" animate="animate">
      {notificaciones.map((notificacion) => (
        <motion.li key={notificacion.id} className="notif-item" variants={listItem}>
          <span className="notif-icon">{iconoPorTipo[notificacion.tipo]}</span>
          <div className="notif-body">
            <div className="notif-header">
              <strong>{notificacion.asunto}</strong>
              <Badge tone={notificacion.estado === 'ENVIADA' ? 'success' : 'danger'}>{notificacion.estado}</Badge>
            </div>
            <p>{notificacion.mensaje}</p>
            <span className="notif-meta">
              {notificacion.canal} · {formatDate(notificacion.createdAt)}
            </span>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
};
