import {NextFunction, Request, Response, Router} from 'express';
const userRouter = Router();

/* GET users listing. */
userRouter.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});

export default userRouter;
