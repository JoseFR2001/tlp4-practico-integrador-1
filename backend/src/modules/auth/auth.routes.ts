import { Router } from 'express';
import { AuthController } from './AuthController';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();
  router.post('/register', authController.register);
  router.post('/login', authController.login);
  return router;
};

