import jwt from 'jsonwebtoken';
import config from '../../config/auth.config';

let verifyToken = (req: any, res: any, next: any) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {
        jwt.verify(token, config.secret_key!, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({
                    status: "fail",
                    message: 'Auth token is not valid'
                });
            }
            else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else {
        return res.status(400).json({
            status: "fail",
            message: 'Auth token is not supplied'
        });
    }
};

export default verifyToken;