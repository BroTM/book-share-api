
// import * as UserController from "../controllers/api/users.controller";
import * as AdminController from "../controllers/api/admins.controller";

import { Router } from "express";
const apiRouter = Router();

// apiRouter.get("/users/:id", UserController.getOne);

/** admins */
apiRouter.post("/admins/login", AdminController.login);
apiRouter.post("/admins/register", AdminController.register);
apiRouter.post("/admins/logout", AdminController.logout);

export default apiRouter;