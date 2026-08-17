import type { Role } from '../types';

export interface DecodedToken {
  sub: string;
  preferred_username: string;
  email?: string;
  realm_access?: { roles: string[] };
  exp: number;
}

// Solo lectura del payload, sin verificar la firma: la autoridad real la valida el
// api-gateway en cada request. Aqui solo se usa para pintar la UI (nombre, roles visibles).
export function decodeJwt(token: string): DecodedToken {
  const payload = token.split('.')[1];
  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  );
  return JSON.parse(json) as DecodedToken;
}

export function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeJwt(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

export function extraerRoles(token: string): Role[] {
  try {
    const { realm_access } = decodeJwt(token);
    return (realm_access?.roles ?? []).filter((rol): rol is Role =>
      rol === 'ADMIN' || rol === 'CAJERO' || rol === 'CLIENTE'
    );
  } catch {
    return [];
  }
}
