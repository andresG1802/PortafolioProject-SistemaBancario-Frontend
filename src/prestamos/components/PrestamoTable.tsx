import { motion } from 'framer-motion';

import { Badge } from '../../components';
import { useAuthStore, usePrestamosStore } from '../../hooks';
import { esStaff, formatCurrency } from '../../helpers';
import { listContainer, listItem } from '../../styles/motion';
import type { EstadoPrestamo } from '../../types';

const tonoPorEstado: Record<EstadoPrestamo, 'warning' | 'success' | 'danger' | 'primary'> = {
  SOLICITADO: 'warning',
  APROBADO: 'primary',
  RECHAZADO: 'danger',
  DESEMBOLSADO: 'success',
};

export const PrestamoTable = () => {
  const { roles } = useAuthStore();
  const {
    prestamos,
    activePrestamo,
    isLoading,
    setActivePrestamo,
    startLoadCronograma,
    startDecidirPrestamo,
    startDesembolsarPrestamo,
  } = usePrestamosStore();

  const verCronograma = (id: string) => {
    const prestamo = prestamos.find((p) => p.id === id) ?? null;
    setActivePrestamo(prestamo);
    startLoadCronograma(id);
  };

  const rechazar = (id: string) => {
    const motivo = window.prompt('Motivo del rechazo (opcional):') ?? undefined;
    startDecidirPrestamo(id, { aprobado: false, motivoRechazo: motivo || undefined });
  };

  if (isLoading && prestamos.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">
          <span className="spinner spinner-dark" />
        </div>
      </div>
    );
  }

  if (prestamos.length === 0) {
    return (
      <div className="table-wrap">
        <div className="empty-row">Este cliente todavia no tiene prestamos.</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Monto</th>
            <th>Tasa anual</th>
            <th>Plazo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <motion.tbody variants={listContainer} initial="initial" animate="animate">
          {prestamos.map((prestamo) => (
            <motion.tr
              key={prestamo.id}
              variants={listItem}
              className={prestamo.id === activePrestamo?.id ? 'row-active' : undefined}
            >
              <td>{formatCurrency(prestamo.monto, 'PEN')}</td>
              <td>{(prestamo.tasaInteresAnual * 100).toFixed(2)}%</td>
              <td>{prestamo.plazoMeses} meses</td>
              <td>
                <Badge tone={tonoPorEstado[prestamo.estado]}>{prestamo.estado}</Badge>
              </td>
              <td>
                <div className="transaccion-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => verCronograma(prestamo.id)}>
                    Cronograma
                  </button>
                  {esStaff(roles) && prestamo.estado === 'SOLICITADO' && (
                    <>
                      <button
                        type="button"
                        className="btn btn-accent btn-sm"
                        onClick={() => startDecidirPrestamo(prestamo.id, { aprobado: true })}
                      >
                        Aprobar
                      </button>
                      <button type="button" className="btn btn-danger btn-sm" onClick={() => rechazar(prestamo.id)}>
                        Rechazar
                      </button>
                    </>
                  )}
                  {esStaff(roles) && prestamo.estado === 'APROBADO' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => startDesembolsarPrestamo(prestamo.id)}
                    >
                      Desembolsar
                    </button>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};
