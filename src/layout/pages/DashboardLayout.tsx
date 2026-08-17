import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Toast } from '../components/Toast';
import { fadeInUp } from '../../styles/motion';

import { ClientesPage } from '../../clientes';
import { CuentasPage } from '../../cuentas';
import { TransaccionesPage } from '../../transacciones';
import { PrestamosPage } from '../../prestamos';
import { NotificacionesPage } from '../../notificaciones';

export const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-content">
        <Navbar />
        <Toast />

        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={fadeInUp} initial="initial" animate="animate" exit="exit">
            <Routes location={location}>
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/cuentas" element={<CuentasPage />} />
              <Route path="/transacciones" element={<TransaccionesPage />} />
              <Route path="/prestamos" element={<PrestamosPage />} />
              <Route path="/notificaciones" element={<NotificacionesPage />} />
              <Route path="*" element={<Navigate to="/clientes" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
