import { useEffect } from 'react';

import { ClienteSelector } from '../../clientes';
import { PrestamoTable } from '../components/PrestamoTable';
import { PrestamoFormModal } from '../components/PrestamoFormModal';
import { CronogramaTable } from '../components/CronogramaTable';
import { useClientesStore, usePrestamosStore } from '../../hooks';

export const PrestamosPage = () => {
  const { activeCliente } = useClientesStore();
  const { startLoadPrestamosPorCliente, openPrestamoModal } = usePrestamosStore();

  useEffect(() => {
    if (activeCliente) startLoadPrestamosPorCliente(activeCliente.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCliente?.id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Prestamos</h1>
        {activeCliente && (
          <button type="button" className="btn btn-primary" onClick={openPrestamoModal}>
            + Solicitar prestamo
          </button>
        )}
      </div>

      <ClienteSelector />

      {activeCliente ? (
        <>
          <PrestamoTable />
          <CronogramaTable />
        </>
      ) : (
        <div className="card">Selecciona un cliente para ver sus prestamos.</div>
      )}

      <PrestamoFormModal />
    </div>
  );
};
