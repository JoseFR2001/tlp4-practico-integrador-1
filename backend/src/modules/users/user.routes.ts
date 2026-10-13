import { Router } from "express";
import { UserController } from "./UserController";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  router.use(authenticate);
  router.get("/", authorize("user:read"), userController.getAll);
  router.patch(
    "/:id/role",
    authorize("user:assign-role"),
    userController.assignRole,
  );

  return router;
};
