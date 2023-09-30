import {NextFunction, Request, Response, Router} from 'express';
import sequelize from '../../database/mysql';
const router = Router();

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.render('index', { title: 'Express' });
});

router.get('/checking_db_connection', (req: Request, res: Response, next: NextFunction) => {
  console.log(sequelize);
})
export default router;
