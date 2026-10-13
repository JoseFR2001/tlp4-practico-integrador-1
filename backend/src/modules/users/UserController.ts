import { Response } from "express";
import { UserService } from "./UserService";
import { AuthenticatedRequest } from "../../middlewares/authenticate";

export class UserController {
  constructor(private userService: UserService) {}

  public getAll = async (
    _req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error: unknown) {
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Error al obtener usuarios",
      });
    }
  };

  public assignRole = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { rol } = req.body;
      if (!rol || !["admin", "operador", "usuario"].includes(rol)) {
        res.status(400).json({ message: "Rol inválido" });
        return;
      }
      const updated = await this.userService.assignRole(id, rol);
      if (!updated) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      res.json(updated);
    } catch (error: unknown) {
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Error al asignar rol",
      });
    }
  };
}
