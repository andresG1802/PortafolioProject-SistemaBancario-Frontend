import { motion } from 'framer-motion';

import { Badge } from '../../components';
import { useTransaccionesStore } from '../../hooks';
import { formatCurrency, formatDate } from '../../helpers';
import { listContainer, listItem } from '../../styles/motion';
import type { EstadoTransaccion } from '../../types';

const tonoPorEstado: Record<EstadoTransaccion, 'success' | 'warning' | 'danger'> = {
  PENDIENTE: 'warning',
  COMPLETADA: 'success',
  FALLIDA: 'danger',
  REVERTIDA: 'danger',
};

export const HistorialTable = () => {
  const { historial, isLoading } = useTransaccionesStore();

  if (isLoading && historial.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">
          <span className="spinner spinner-dark" />
        </div>
      </div>
    );
  }

  if (historial.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">Esta cuenta todavia no tiene movimientos.</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Detalle</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <motion.tbody variants={listContainer} initial="initial" animate="animate">
          {historial.map((transaccion) => (
            <motion.tr key={transaccion.id} variants={listItem}>
              <td>{transaccion.tipo}</td>
              <td>{formatCurrency(transaccion.monto, transaccion.moneda)}</td>
              <td>
                <Badge tone={tonoPorEstado[transaccion.estado]}>{transaccion.estado}</Badge>
              </td>
              <td>{transaccion.motivoFallo ?? '—'}</td>
              <td>{formatDate(transaccion.createdAt)}</td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};
