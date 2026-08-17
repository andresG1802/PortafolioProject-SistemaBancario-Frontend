import { NavLink } from 'react-router-dom';

const links = [
  { to: '/clientes', label: 'Clientes' },
  { to: '/cuentas', label: 'Cuentas' },
  { to: '/transacciones', label: 'Transacciones' },
  { to: '/prestamos', label: 'Prestamos' },
  { to: '/notificaciones', label: 'Notificaciones' },
];

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">🏦 Banco</div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
