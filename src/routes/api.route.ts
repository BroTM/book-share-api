
import verifyToken from "../middlewares/verify-token.middleware";
import authorize from "../middlewares/authorize.middleware";
import Role from "../_helper/role";
import * as AdminController from "../controllers/api/admins.controller";
import * as UserController from "../controllers/api/users.controller";
import * as PostController from "../controllers/api/posts.controller";

import { Router } from "express";
const apiRouter = Router();

/** user auth */
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

/** posts */
/** posts by users*/
apiRouter.post("/users/posts", verifyToken, authorize(Role.User), PostController.create);
apiRouter.get("/users/posts", verifyToken, authorize(Role.User), PostController.allPostsForUsers);
apiRouter.get("/users/posts/:post_id", verifyToken, authorize(Role.User), PostController.detailForUser);
apiRouter.get("/users/me/posts", verifyToken, authorize(Role.User), PostController.allPostsByUserIdForUsers);
apiRouter.get("/users/me/posts/:post_id", verifyToken, authorize(Role.User), PostController.detailByUserIdForUser);
apiRouter.put("/users/me/posts/:post_id", verifyToken, authorize(Role.User), PostController.publish);
apiRouter.delete("/users/me/posts/:post_id", verifyToken, authorize(Role.User), PostController.destroy);
apiRouter.post("/users/posts/:post_id/report", verifyToken, authorize(Role.User), PostController.report);

/** posts by admins */
apiRouter.get("/admins/users/:user_id/posts", verifyToken, authorize(Role.Admin), PostController.allPostsByUserIdForAdmin);
apiRouter.get("/admins/users/:user_id/posts/:post_id", verifyToken, authorize(Role.Admin), PostController.detailByUserIdForAdmin);

export default apiRouter;