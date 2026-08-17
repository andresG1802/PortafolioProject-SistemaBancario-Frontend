import { motion } from 'framer-motion';

import { Badge } from '../../components';
import { useAuthStore, useCuentasStore } from '../../hooks';
import { esStaff, formatCurrency } from '../../helpers';
import { listContainer, listItem } from '../../styles/motion';
import type { EstadoCuenta } from '../../types';

const tonoPorEstado: Record<EstadoCuenta, 'success' | 'warning' | 'neutral'> = {
  ACTIVA: 'success',
  BLOQUEADA: 'warning',
  CERRADA: 'neutral',
};

export const CuentaTable = () => {
  const { roles } = useAuthStore();
  const { cuentas, isLoading, startCambiarEstadoCuenta } = useCuentasStore();

  const copiarId = async (id: string) => {
    await navigator.clipboard.writeText(id);
  };

  if (isLoading && cuentas.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">
          <span className="spinner spinner-dark" />
        </div>
      </div>
    );
  }

  if (cuentas.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">Este cliente todavia no tiene cuentas.</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Numero</th>
            <th>Id (para transferencias/prestamos)</th>
            <th>Tipo</th>
            <th>Saldo</th>
            <th>Estado</th>
            {esStaff(roles) && <th>Acciones</th>}
          </tr>
        </thead>
        <motion.tbody variants={listContainer} initial="initial" animate="animate">
          {cuentas.map((cuenta) => (
            <motion.tr key={cuenta.id} variants={listItem}>
              <td>{cuenta.numeroCuenta}</td>
              <td>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => copiarId(cuenta.id)}>
                  {cuenta.id.slice(0, 8)}… copiar
                </button>
              </td>
              <td>{cuenta.tipo}</td>
              <td>{formatCurrency(cuenta.saldo, cuenta.moneda)}</td>
              <td>
                <Badge tone={tonoPorEstado[cuenta.estado]}>{cuenta.estado}</Badge>
              </td>
              {esStaff(roles) && (
                <td>
                  {cuenta.estado === 'ACTIVA' && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => startCambiarEstadoCuenta(cuenta.id, 'BLOQUEADA')}
                    >
                      Bloquear
                    </button>
                  )}
                  {cuenta.estado === 'BLOQUEADA' && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => startCambiarEstadoCuenta(cuenta.id, 'ACTIVA')}
                    >
                      Activar
                    </button>
                  )}
                </td>
              )}
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};
