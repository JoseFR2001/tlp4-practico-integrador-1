import express, { Express } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';

interface AppRoutes {
  authRouter: express.Router;
  userRouter: express.Router;
  libroRouter: express.Router;
  subscriptionRouter: express.Router;
  notificationRouter: express.Router;
}

export function createApp(routes: AppRoutes): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Rutas de los módulos
  app.use('/api/auth', routes.authRouter);
  app.use('/api/users', routes.userRouter);
  app.use('/api/libros', routes.libroRouter);
  app.use('/api/subscriptions', routes.subscriptionRouter);
  app.use('/api/notifications', routes.notificationRouter);

  // Healthcheck
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', domain: 'Biblioteca', timestamp: new Date() });
  });

  // Manejador centralizado de errores
  app.use(errorHandler);

  return app;
}

