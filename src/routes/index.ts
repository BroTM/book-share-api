import apiRouter from './api.route';
import userRouter from "./web/user.route";

import {Router} from 'express';
const router = Router();


router.use("/api/v1/", apiRouter);
router.use("/users", userRouter);

export default router;

