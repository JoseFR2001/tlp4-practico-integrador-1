import { Request, Response } from 'express';
import { AuthService } from './AuthService';

export class AuthController {
  constructor(private authService: AuthService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, nombre } = req.body;
      if (!email || !password || !nombre) {
        res.status(400).json({ message: 'Todos los campos son obligatorios' });
        return;
      }
      const result = await this.authService.register(email, password, nombre);
      res.status(201).json(result);
    } catch (error: unknown) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Error en el registro' });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email y contraseña requeridos' });
        return;
      }
      const result = await this.authService.login(email, password);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Credenciales inválidas' });
    }
  };
}

