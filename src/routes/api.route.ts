
import verifyToken from "../middlewares/verify-token.middleware";
import authorize from "../middlewares/authorize.middleware";
import Role from "../_helper/role";
import * as AdminController from "../controllers/api/admins.controller";
import * as UserController from "../controllers/api/users.controller";

import { Router } from "express";
const apiRouter = Router();

apiRouter.get("/users/me",verifyToken, authorize(Role.User), UserController.me);
apiRouter.put("/users/me", verifyToken, authorize(Role.User), UserController.bioUpdate);
apiRouter.put("/users/change-password", verifyToken, authorize(Role.User), UserController.changePassword);

apiRouter.post("/users/signup", UserController.signup);
apiRouter.post("/users/signup-confirm", UserController.signupConfirm);
apiRouter.post("/users/forget-password", UserController.forgetPassword);
apiRouter.put("/users/reset-password", UserController.resetPassword);

apiRouter.post("/users/login", UserController.login);
apiRouter.post("/users/logout", verifyToken, authorize(Role.User), UserController.logout);

/** admins */
apiRouter.post("/admins/login", AdminController.login);
apiRouter.post("/admins/register", verifyToken, authorize(Role.Admin), AdminController.register);
apiRouter.post("/admins/logout", verifyToken, authorize(Role.Admin), AdminController.logout);

export default apiRouter;