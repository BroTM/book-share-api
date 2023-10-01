
// import * as UserController from "../controllers/api/users.controller";
import verifyToken from "../middlewares/verify-token.middleware";
import authorize from "../middlewares/authorize.middleware";
import Role from "../_helper/role";
import * as AdminController from "../controllers/api/admins.controller";

import { Router } from "express";
const apiRouter = Router();

// apiRouter.get("/users/:id", UserController.getOne);

/** admins */
apiRouter.post("/admins/login", AdminController.login);
apiRouter.post("/admins/register", verifyToken, authorize(Role.Admin), AdminController.register);
apiRouter.post("/admins/logout", verifyToken, authorize(Role.Admin), AdminController.logout);

export default apiRouter;