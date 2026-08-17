import { useEffect } from 'react';

import { ClienteSelector } from '../../clientes';
import { CuentaTable } from '../components/CuentaTable';
import { CuentaFormModal } from '../components/CuentaFormModal';
import { useAuthStore, useClientesStore, useCuentasStore } from '../../hooks';
import { esStaff } from '../../helpers';

export const CuentasPage = () => {
  const { roles } = useAuthStore();
  const { activeCliente } = useClientesStore();
  const { startLoadCuentasPorCliente, openCuentaModal } = useCuentasStore();

  useEffect(() => {
    if (activeCliente) startLoadCuentasPorCliente(activeCliente.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCliente?.id]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Cuentas</h1>
        {activeCliente && esStaff(roles) && (
          <button className="btn btn-primary" onClick={openCuentaModal}>
            + Abrir cuenta
          </button>
        )}
      </div>

      <ClienteSelector />

      {activeCliente ? <CuentaTable /> : <div className="card">Selecciona un cliente para ver sus cuentas.</div>}

      <CuentaFormModal />
    </div>
  );
};
