import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import { Modal } from '../../components';
import { useClientesStore, useCuentasStore } from '../../hooks';
import type { TipoCuenta } from '../../types';

interface FormState {
  tipo: TipoCuenta;
  moneda: string;
  saldoInicial: string;
}

const initialForm: FormState = { tipo: 'AHORRO', moneda: 'PEN', saldoInicial: '' };

export const CuentaFormModal = () => {
  const { activeCliente } = useClientesStore();
  const { isModalOpen, isLoading, errorMessage, closeCuentaModal, startAbrirCuenta } = useCuentasStore();
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!isModalOpen) setForm(initialForm);
  }, [isModalOpen]);

  const onChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!activeCliente) return;
    startAbrirCuenta({
      clienteId: activeCliente.id,
      tipo: form.tipo,
      moneda: form.moneda.toUpperCase(),
      saldoInicial: form.saldoInicial ? Number(form.saldoInicial) : undefined,
    });
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeCuentaModal} title={`Abrir cuenta para ${activeCliente?.nombres ?? ''}`}>
      {errorMessage && <div className="banner banner-error">{errorMessage}</div>}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="tipo">Tipo de cuenta</label>
          <select id="tipo" name="tipo" value={form.tipo} onChange={onChange}>
            <option value="AHORRO">Ahorro</option>
            <option value="CORRIENTE">Corriente</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="moneda">Moneda</label>
          <input id="moneda" name="moneda" value={form.moneda} onChange={onChange} maxLength={3} required />
          <span className="field-hint">Codigo de 3 letras, ej. PEN, USD</span>
        </div>

        <div className="field">
          <label htmlFor="saldoInicial">Saldo inicial (opcional)</label>
          <input
            id="saldoInicial"
            type="number"
            min="0"
            step="0.01"
            name="saldoInicial"
            value={form.saldoInicial}
            onChange={onChange}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={closeCuentaModal}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading && <span className="spinner" />}
            Abrir cuenta
          </button>
        </div>
      </form>
    </Modal>
  );
};
