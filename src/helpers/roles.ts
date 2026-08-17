import type { Role } from '../types';

// La UI solo oculta botones para roles que el backend igual rechazaria con 403 (RBAC real
// vive en api-gateway/SecurityConfig); esto es puramente cosmetico.
export function esStaff(roles: Role[]): boolean {
  return roles.includes('CAJERO') || roles.includes('ADMIN');
}
