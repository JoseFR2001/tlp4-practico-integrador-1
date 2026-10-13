import { Router } from 'express';
import { LibroController } from './LibroController';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

export const createLibroRoutes = (libroController: LibroController): Router => {
  const router = Router();

  router.use(authenticate);

  router.get('/', authorize('libro:read'), libroController.getAll);
  router.get('/:id', authorize('libro:read'), libroController.getById);
  router.post('/', authorize('libro:create'), libroController.create);
  router.put('/:id', authorize('libro:update'), libroController.update);
  router.patch('/:id/status', authorize('libro:change-status'), libroController.changeStatus);
  router.delete('/:id', authorize('libro:delete'), libroController.delete);

  return router;
};

