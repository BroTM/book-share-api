import { NextFunction, Request, Response } from "express";
import adminRepository from "../../repositories/admins/admins.repository";
import Utils from "../../utils/utils";
import message from "../../../config/response_message";
import Admin from "@models/admins.model";

export function login(req: Request, res: Response, next: NextFunction) {

  let login_id = req.body?.login_id;

  // prevent sql injection
  if (!Utils.isNoSpecialWithLenght8(login_id)) {
    return res.status(405).send({ message: message.req_err.err_405 })
  }

  adminRepository.login(req.body!)
    .then((data: any) => {
      res.json({ 
        admin: { ...data } 
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.login.incorrect_userid;
      else if (err == "INCORRECT_PASSWORD")
        msg = message.login.incorrect_password;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}


export function logout(req: Request | any, res: Response, next: NextFunction) {

  const { id, auth_type, token_status } = req.decoded;

  //if the token is gotten by users, prevent the token
  if (token_status == 'LOGOUT')
    return res.send({ message: message.login.already_logout });

  // prevent calling from register state
  if (token_status == 'REGISTER')
    return res.send({ message: message.login.please_login });

  // prevent user token
  if (!Utils.isNoSpecialWithLenght8(id)) {
    return res.status(405).send({ message: message.req_err.err_405 })
  }

  adminRepository.logout(id)
    .then((data: any) => {
      res.json({
        // 'status': "success",
        'message': message.login.logout_success
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.login.no_user;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}

export async function register(req: Request | any, res: Response, next: NextFunction) {

  req.body.token = "pass the validation";

  let admin = await Admin.build(req.body);

  await admin.validate()
    .then((result: any) => {

      return adminRepository.register(admin);
    })
    .then((data: any) => {
      res.json({
        // 'status': "success",
        'admin': {...data, created_name: req.decoded.name},
        // 'message': message.general.create_success
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);
      res.json({
        status: "fail",
        data: process.env.NODE_ENV == "development"? err : {},
        message: message.general.create_fail
      })
    });
}
