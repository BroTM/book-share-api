
// import * as UserController from "../controllers/api/users.controller";
import verifyToken from "../middlewares/auth.middleware";
import * as AdminController from "../controllers/api/admins.controller";

import { Router } from "express";
const apiRouter = Router();

// apiRouter.get("/users/:id", UserController.getOne);

/** admins */
apiRouter.post("/admins/login", AdminController.login);
apiRouter.post("/admins/register", verifyToken, AdminController.register);
apiRouter.post("/admins/logout", AdminController.logout);

export default apiRouter;