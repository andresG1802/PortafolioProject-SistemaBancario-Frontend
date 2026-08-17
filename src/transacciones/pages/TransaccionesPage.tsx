import { useEffect, useState, type ChangeEvent } from 'react';

import { ClienteSelector } from '../../clientes';
import { HistorialTable } from '../components/HistorialTable';
import { TransaccionModal } from '../components/TransaccionModal';
import { useClientesStore, useCuentasStore, useTransaccionesStore } from '../../hooks';

export const TransaccionesPage = () => {
  const { activeCliente } = useClientesStore();
  const { cuentas, startLoadCuentasPorCliente } = useCuentasStore();
  const { startLoadHistorial, openTransaccionModal } = useTransaccionesStore();
  const [cuentaId, setCuentaId] = useState('');

  useEffect(() => {
    setCuentaId('');
    if (activeCliente) startLoadCuentasPorCliente(activeCliente.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCliente?.id]);

  useEffect(() => {
    if (cuentaId) startLoadHistorial(cuentaId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cuentaId]);

  const onChangeCuenta = (event: ChangeEvent<HTMLSelectElement>) => setCuentaId(event.target.value);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Transacciones</h1>
      </div>

      <ClienteSelector />

      {activeCliente && (
        <div className="field cliente-selector">
          <label htmlFor="cuentaTrabajo">Cuenta</label>
          <select id="cuentaTrabajo" value={cuentaId} onChange={onChangeCuenta}>
            <option value="">Selecciona una cuenta…</option>
            {cuentas.map((cuenta) => (
              <option key={cuenta.id} value={cuenta.id}>
                {cuenta.numeroCuenta} — {cuenta.tipo} ({cuenta.moneda})
              </option>
            ))}
          </select>
        </div>
      )}

      {!activeCliente && <div className="card">Selecciona un cliente para operar sus cuentas.</div>}
      {activeCliente && !cuentaId && <div className="card">Selecciona una cuenta para ver su historial.</div>}

      {cuentaId && (
        <>
          <div className="transaccion-actions">
            <button type="button" className="btn btn-accent" onClick={() => openTransaccionModal('DEPOSITO')}>
              Depositar
            </button>
            <button type="button" className="btn btn-danger" onClick={() => openTransaccionModal('RETIRO')}>
              Retirar
            </button>
            <button type="button" className="btn btn-primary" onClick={() => openTransaccionModal('TRANSFERENCIA')}>
              Transferir
            </button>
          </div>

          <HistorialTable />
          <TransaccionModal cuentaId={cuentaId} />
        </>
      )}
    </div>
  );
};
