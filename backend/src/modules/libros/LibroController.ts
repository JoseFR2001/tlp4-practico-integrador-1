import { Response } from 'express';
import { LibroService } from './LibroService';
import { AuthenticatedRequest } from '../../middlewares/authenticate';

export class LibroController {
  constructor(private libroService: LibroService) {}

  public getAll = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const libros = await this.libroService.getAll();
      res.json(libros);
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al obtener libros' });
    }
  };

  public getById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const libro = await this.libroService.getById(id);
      if (!libro) {
        res.status(404).json({ message: 'Libro no encontrado' });
        return;
      }
      res.json(libro);
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al obtener libro' });
    }
  };

  public create = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { titulo, autor, descripcion, estado } = req.body;
      if (!titulo || !autor || !descripcion) {
        res.status(400).json({ message: 'Título, autor y descripción son requeridos' });
        return;
      }
      const nuevoLibro = await this.libroService.create({ titulo, autor, descripcion, estado });
      res.status(201).json(nuevoLibro);
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al crear libro' });
    }
  };

  public update = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const updated = await this.libroService.update(id, req.body);
      if (!updated) {
        res.status(404).json({ message: 'Libro no encontrado' });
        return;
      }
      res.json(updated);
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al actualizar libro' });
    }
  };

  public changeStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { estado } = req.body;
      if (!estado) {
        res.status(400).json({ message: 'El campo estado es requerido' });
        return;
      }
      const libroActualizado = await this.libroService.changeStatus(id, estado);
      res.json(libroActualizado);
    } catch (error: unknown) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Error al cambiar estado' });
    }
  };

  public delete = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const deleted = await this.libroService.delete(id);
      if (!deleted) {
        res.status(404).json({ message: 'Libro no encontrado' });
        return;
      }
      res.json({ message: 'Libro eliminado con éxito' });
    } catch (error: unknown) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Error al eliminar libro' });
    }
  };
}

