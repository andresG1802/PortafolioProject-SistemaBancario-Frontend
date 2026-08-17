import { useEffect } from 'react';

import { ClienteTable } from '../components/ClienteTable';
import { ClienteFormModal } from '../components/ClienteFormModal';
import { useAuthStore, useClientesStore } from '../../hooks';
import { esStaff } from '../../helpers';

export const ClientesPage = () => {
  const { roles } = useAuthStore();
  const { startLoadClientes, openClienteModal } = useClientesStore();

  useEffect(() => {
    startLoadClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Clientes</h1>
        {esStaff(roles) && (
          <button className="btn btn-primary" onClick={openClienteModal}>
            + Nuevo cliente
          </button>
        )}
      </div>

      <ClienteTable />
      <ClienteFormModal />
    </div>
  );
};
