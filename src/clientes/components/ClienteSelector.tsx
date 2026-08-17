import { useEffect, type ChangeEvent } from 'react';

import { useClientesStore } from '../../hooks';

// Compartido por cuentas/transacciones/prestamos/notificaciones: esos dominios estan
// escopeados a un cliente, y este selector es la unica forma de elegir cual en la UI.
export const ClienteSelector = () => {
  const { clientes, activeCliente, isLoading, startLoadClientes, setActiveCliente } = useClientesStore();

  useEffect(() => {
    if (clientes.length === 0) startLoadClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const cliente = clientes.find((c) => c.id === event.target.value) ?? null;
    setActiveCliente(cliente);
  };

  return (
    <div className="field cliente-selector">
      <label htmlFor="clienteSelector">Cliente</label>
      <select id="clienteSelector" value={activeCliente?.id ?? ''} onChange={onChange} disabled={isLoading}>
        <option value="">Selecciona un cliente…</option>
        {clientes.map((cliente) => (
          <option key={cliente.id} value={cliente.id}>
            {cliente.nombres} {cliente.apellidos} — {cliente.numeroDocumento}
          </option>
        ))}
      </select>
    </div>
  );
};
