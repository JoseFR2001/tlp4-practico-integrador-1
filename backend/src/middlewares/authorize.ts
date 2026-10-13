import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';

export type Permission =
  | 'libro:read'
  | 'libro:create'
  | 'libro:update'
  | 'libro:change-status'
  | 'libro:delete'
  | 'subscription:create'
  | 'subscription:delete'
  | 'notification:read'
  | 'user:read'
  | 'user:assign-role';

const ROLE_PERMISSIONS: Record<'admin' | 'operador' | 'usuario', Permission[]> = {
  admin: [
    'libro:read',
    'libro:create',
    'libro:update',
    'libro:change-status',
    'libro:delete',
    'subscription:create',
    'subscription:delete',
    'notification:read',
    'user:read',
    'user:assign-role',
  ],
  operador: [
    'libro:read',
    'libro:create',
    'libro:update',
    'libro:change-status',
    'subscription:create',
    'subscription:delete',
    'notification:read',
  ],
  usuario: [
    'libro:read',
    'subscription:create',
    'subscription:delete',
    'notification:read',
  ],
};

export const authorize = (requiredPermission: Permission) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !req.user.rol) {
      res.status(401).json({ message: 'Usuario no autenticado' });
      return;
    }

    const userRole = req.user.rol;
    const permissions = ROLE_PERMISSIONS[userRole] || [];

    if (!permissions.includes(requiredPermission)) {
      res.status(403).json({
        message: `Acceso denegado: no tienes el permiso '${requiredPermission}'`,
      });
      return;
    }

    next();
  };
};

