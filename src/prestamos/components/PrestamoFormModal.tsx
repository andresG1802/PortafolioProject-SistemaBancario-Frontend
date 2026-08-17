import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import { Modal } from '../../components';
import { useClientesStore, usePrestamosStore } from '../../hooks';

interface FormState {
  cuentaDesembolsoId: string;
  monto: string;
  tasaInteresAnualPorcentaje: string;
  plazoMeses: string;
}

const initialForm: FormState = {
  cuentaDesembolsoId: '',
  monto: '',
  tasaInteresAnualPorcentaje: '18',
  plazoMeses: '12',
};

export const PrestamoFormModal = () => {
  const { activeCliente } = useClientesStore();
  const { isModalOpen, isLoading, errorMessage, closePrestamoModal, startSolicitarPrestamo } = usePrestamosStore();
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!isModalOpen) setForm(initialForm);
  }, [isModalOpen]);

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!activeCliente) return;
    startSolicitarPrestamo({
      clienteId: activeCliente.id,
      cuentaDesembolsoId: form.cuentaDesembolsoId,
      monto: Number(form.monto),
      tasaInteresAnual: Number(form.tasaInteresAnualPorcentaje) / 100,
      plazoMeses: Number(form.plazoMeses),
    });
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closePrestamoModal} title={`Solicitar prestamo para ${activeCliente?.nombres ?? ''}`}>
      {errorMessage && <div className="banner banner-error">{errorMessage}</div>}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="cuentaDesembolsoId">Cuenta de desembolso (id)</label>
          <input
            id="cuentaDesembolsoId"
            name="cuentaDesembolsoId"
            value={form.cuentaDesembolsoId}
            onChange={onChange}
            placeholder="UUID de la cuenta donde se desembolsa"
            required
          />
        </div>

        <div className="form-grid">
          <div className="field">
            <label htmlFor="monto">Monto</label>
            <input id="monto" type="number" min="0.01" step="0.01" name="monto" value={form.monto} onChange={onChange} required />
          </div>

          <div className="field">
            <label htmlFor="tasaInteresAnualPorcentaje">Tasa de interes anual (%)</label>
            <input
              id="tasaInteresAnualPorcentaje"
              type="number"
              min="0"
              max="100"
              step="0.01"
              name="tasaInteresAnualPorcentaje"
              value={form.tasaInteresAnualPorcentaje}
              onChange={onChange}
              required
            />
          </div>

          <div className="field field-full">
            <label htmlFor="plazoMeses">Plazo (meses)</label>
            <input
              id="plazoMeses"
              type="number"
              min="1"
              max="360"
              name="plazoMeses"
              value={form.plazoMeses}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={closePrestamoModal}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading && <span className="spinner" />}
            Solicitar
          </button>
        </div>
      </form>
    </Modal>
  );
};
