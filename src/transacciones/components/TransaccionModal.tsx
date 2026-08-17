import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import { Modal } from '../../components';
import { useTransaccionesStore } from '../../hooks';
import type { TipoTransaccion } from '../../types';

interface TransaccionModalProps {
  cuentaId: string;
}

interface FormState {
  monto: string;
  moneda: string;
  cuentaDestinoId: string;
}

const initialForm: FormState = { monto: '', moneda: 'PEN', cuentaDestinoId: '' };

const titulos: Record<TipoTransaccion, string> = {
  DEPOSITO: 'Depositar',
  RETIRO: 'Retirar',
  TRANSFERENCIA: 'Transferir',
};

export const TransaccionModal = ({ cuentaId }: TransaccionModalProps) => {
  const { modalTipo, isLoading, errorMessage, closeTransaccionModal, startDepositar, startRetirar, startTransferir } =
    useTransaccionesStore();
  const [form, setForm] = useState<FormState>(initialForm);

  useEffect(() => {
    if (!modalTipo) setForm(initialForm);
  }, [modalTipo]);

  // modalTipo es null mientras el modal esta cerrado/animando su salida; se usa DEPOSITO
  // como valor de respaldo solo para decidir que campos mostrar durante esa animacion.
  const tipo = modalTipo ?? 'DEPOSITO';

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const monto = Number(form.monto);

    if (tipo === 'DEPOSITO') {
      startDepositar({ cuentaDestinoId: cuentaId, monto, moneda: form.moneda.toUpperCase() });
    } else if (tipo === 'RETIRO') {
      startRetirar({ cuentaOrigenId: cuentaId, monto, moneda: form.moneda.toUpperCase() });
    } else {
      startTransferir({
        cuentaOrigenId: cuentaId,
        cuentaDestinoId: form.cuentaDestinoId,
        monto,
        moneda: form.moneda.toUpperCase(),
      });
    }
  };

  return (
    <Modal isOpen={!!modalTipo} onClose={closeTransaccionModal} title={titulos[tipo]}>
      {errorMessage && <div className="banner banner-error">{errorMessage}</div>}

      <form onSubmit={onSubmit}>
        {tipo === 'TRANSFERENCIA' && (
          <div className="field">
            <label htmlFor="cuentaDestinoId">Cuenta destino (id)</label>
            <input
              id="cuentaDestinoId"
              name="cuentaDestinoId"
              value={form.cuentaDestinoId}
              onChange={onChange}
              placeholder="UUID de la cuenta destino"
              required
            />
          </div>
        )}

        <div className="field">
          <label htmlFor="monto">Monto</label>
          <input
            id="monto"
            type="number"
            min="0.01"
            step="0.01"
            name="monto"
            value={form.monto}
            onChange={onChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="moneda">Moneda</label>
          <input id="moneda" name="moneda" value={form.moneda} onChange={onChange} maxLength={3} required />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={closeTransaccionModal}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading && <span className="spinner" />}
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
};
