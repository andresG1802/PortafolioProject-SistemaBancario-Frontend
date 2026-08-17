import { motion } from 'framer-motion';

import { usePrestamosStore } from '../../hooks';
import { formatCurrency } from '../../helpers';
import { listContainer, listItem } from '../../styles/motion';

export const CronogramaTable = () => {
  const { activePrestamo, cronograma } = usePrestamosStore();

  if (!activePrestamo || !cronograma) return null;

  return (
    <div className="card cronograma-card">
      <h2 className="section-title">
        Cronograma de {activePrestamo.plazoMeses} cuotas — cuota mensual {formatCurrency(cronograma.cuotaMensual, 'PEN')}
      </h2>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Saldo inicial</th>
              <th>Cuota</th>
              <th>Interes</th>
              <th>Amortizacion</th>
              <th>Saldo final</th>
            </tr>
          </thead>
          <motion.tbody variants={listContainer} initial="initial" animate="animate">
            {cronograma.cuotas.map((cuota) => (
              <motion.tr key={cuota.numero} variants={listItem}>
                <td>{cuota.numero}</td>
                <td>{formatCurrency(cuota.saldoInicial, 'PEN')}</td>
                <td>{formatCurrency(cuota.cuota, 'PEN')}</td>
                <td>{formatCurrency(cuota.interes, 'PEN')}</td>
                <td>{formatCurrency(cuota.amortizacion, 'PEN')}</td>
                <td>{formatCurrency(cuota.saldoFinal, 'PEN')}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
};
