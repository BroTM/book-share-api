
import * as UserController from "../controllers/api/users.controller";

import { Router } from "express";
const apiRouter = Router();

apiRouter.get("/users/:id", UserController.getOne);

export default apiRouter;