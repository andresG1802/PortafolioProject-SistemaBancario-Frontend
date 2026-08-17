import { motion } from 'framer-motion';

import { Badge } from '../../components';
import { useClientesStore } from '../../hooks';
import { formatDate } from '../../helpers';
import { listContainer, listItem } from '../../styles/motion';
import type { EstadoCliente } from '../../types';

const tonoPorEstado: Record<EstadoCliente, 'success' | 'neutral' | 'danger'> = {
  ACTIVO: 'success',
  INACTIVO: 'neutral',
  BLOQUEADO: 'danger',
};

export const ClienteTable = () => {
  const { clientes, activeCliente, isLoading, setActiveCliente } = useClientesStore();

  if (isLoading && clientes.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">
          <span className="spinner spinner-dark" />
        </div>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">Todavia no hay clientes registrados.</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Contacto</th>
            <th>Estado</th>
            <th>Alta</th>
          </tr>
        </thead>
        <motion.tbody variants={listContainer} initial="initial" animate="animate">
          {clientes.map((cliente) => (
            <motion.tr
              key={cliente.id}
              variants={listItem}
              className={cliente.id === activeCliente?.id ? 'row-active' : undefined}
              onClick={() => setActiveCliente(cliente)}
              style={{ cursor: 'pointer' }}
            >
              <td>
                {cliente.nombres} {cliente.apellidos}
              </td>
              <td>
                {cliente.tipoDocumento} {cliente.numeroDocumento}
              </td>
              <td>{cliente.email || cliente.telefono || '—'}</td>
              <td>
                <Badge tone={tonoPorEstado[cliente.estado]}>{cliente.estado}</Badge>
              </td>
              <td>{formatDate(cliente.createdAt)}</td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};
