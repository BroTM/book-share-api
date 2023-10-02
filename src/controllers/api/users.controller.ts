import { NextFunction, Request, Response } from "express";
import userRepository from "../../repositories/users/users.repository";
import Utils from "../../utils/utils";
import message from "../../../config/response_message";
import User from "@models/users.model";

export function me(req: Request | any, res: Response, next: NextFunction) {

  const { id } = req.decoded;

  userRepository.me(id)
    .then((data: any) => {
      res.json({
        user: data
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.login.incorrect_userid;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}

export function bioUpdate(req: Request | any, res: Response, next: NextFunction) {

  const { id } = req.decoded;
  const { user_name, bio } = req.body;

  // prevent special character
  if (!Utils.isNoSpecialChar(user_name)) {
    return res.status(405).send({ message: message.req_err.err_405 })
  }

  userRepository.bioUpdate(id, { user_name, bio })
    .then((data: any) => {
      res.json({
        user: data
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.login.incorrect_userid;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}

export function changePassword(req: Request | any, res: Response, next: NextFunction) {

  const { current_password, new_password, confirm_password } = req.body;
  const { id } = req.decoded;

  userRepository.changePassword(id, { current_password, new_password, confirm_password })
    .then((data: any) => {
      res.json({
        message: message.login.success_change_password
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.login.incorrect_userid;
      else if (err == "INCORRECT_PASSWORD")
        msg = message.login.incorrect_password;
      else if (err == "DO_NOT_MATCH_PASSWORD")
        msg = message.login.donot_match
      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}

export function login(req: Request, res: Response, next: NextFunction) {

  const { email, password } = req.body;

  userRepository.login({ email, password })
    .then((data: any) => {
      res.json({
        user: data
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

  const { id, token_status } = req.decoded;

  // prevent calling from register state
  if (token_status == 'REGISTER')
    return res.send({ message: message.login.please_login });

  // prevent user token
  if (!Utils.isUUid(id)) {
    return res.status(405).send({ message: message.req_err.err_405 })
  }

  userRepository.logout(id)
    .then((data: any) => {
      res.json({
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

export async function signup(req: Request | any, res: Response, next: NextFunction) {

  req.body.token = "pass the validation";

  let user = await User.build(req.body);

  await user.validate()
    .then((result: any) => {

      return userRepository.signup(user);
    })
    .then((data: any) => {
      res.json({
        message: `Verfification has been sent to ${user.email}`
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.login.signup_fail;
      if (err == "DUPLICATE_EMAIL")
        msg = message.register.duplicate_email;

      res.json({
        status: "fail",
        data: process.env.NODE_ENV == "development" ? err : {},
        message: msg
      })
    });
}


export async function signupConfirm(req: Request | any, res: Response, next: NextFunction) {

  const { email, token } = req.body;
  userRepository.signupConfirm({ email, token })
    .then((data: any) => {
      res.json({
        'user': data,
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.login.signup_fail;
      if (err == "NO_TRANSACTION")
        msg = message.login.no_user;
      else if (err == "ALREADY_VERIFIED")
        msg = message.login.already_verified;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}

export async function forgetPassword(req: Request | any, res: Response, next: NextFunction) {

  const { email } = req.body;

  userRepository.forgetPassword(email)
    .then((data: any) => {
      res.json({
        message: `Verfification has been sent to ${email}`
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

export function resetPassword(req: Request | any, res: Response, next: NextFunction) {

  const { token, new_password, confirm_password } = req.body;

  userRepository.resetPassword({ token, new_password, confirm_password })
    .then((data: any) => {
      res.json({
        user: data
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.login.incorrect_userid;
      else if (err == "DO_NOT_MATCH_PASSWORD")
        msg = message.login.donot_match
      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}

////////////////////////// manage user by admin //////////////////////////

/** @route /admin/users */
export async function allUsersForAdmin(req: Request | any, res: Response, next: NextFunction) {

  const { page, limit, status, user_type } = req.query;

  // prevent sql injection
  if (!Utils.isNumber(page) || !Utils.isNumber(limit)) {
    return res.status(405).send({ message: message.req_err.err_405 });
  }

  if (!['no_verify', 'verified', 'suspended'].includes(status)) {
    return res.status(405).send({ message: message.req_err.err_405 });
  }

  if (!['normal', 'premium'].includes(user_type)) {
    return res.status(405).send({ message: message.req_err.err_405 });
  }

  userRepository.allUsersForAdmin({ page: parseInt(page), limit: parseInt(limit) }, { status, user_type })
    .then((data: any) => {
      res.json({
        'users': data.users,
        'pagination': {
          'page': page,
          'limit': limit,
          'total': data.total
        }
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      res.json({
        status: "fail",
        data: err,
        message: message.other.something_wrong
      })
    });
}

/** @route /admins/users/{user_id} */
export async function getOne(req: Request | any, res: Response, next: NextFunction) {
  let user_id = req.params.user_id

  // prevent sql injection
  if (!Utils.isUUid(user_id)) {
    return res.status(405).send({ message: message.req_err.err_405 })
  }

  userRepository.getOne(user_id)
    .then((data: any) => {
      res.json({
        'user': data,
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.general.no_transaction;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}


/*** @PUT @route /admins/users/{user_id/status*/
export async function suspend(req: Request | any, res: Response, next: NextFunction) {

  const user_id = req.params.user_id;

  // prevent sql injection
  if (!Utils.isUUid(user_id)) {
    return res.status(405).send({ message: message.req_err.err_405 })
  }

  let { id, name } = req.decoded;

  userRepository.suspend(user_id, { id, name })
    .then((data: any) => {
      res.json({
        'user': data,
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.general.no_transaction;
      else if (err == "ALREADY_SUSPENDED")
        msg = message.user.already_suspended;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}

/*** @route /admins/users/{user_id}} */
export async function destroy(req: Request | any, res: Response, next: NextFunction) {

  const user_id = req.params.user_id;

  // prevent sql injection
  if (!Utils.isUUid(user_id)) {
    return res.status(405).send({ message: message.req_err.err_405 })
  }

  userRepository.destroy(user_id)
    .then((data: any) => {
      res.json({
        message: message.user.delete_success
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`);

      let msg = message.other.something_wrong;
      if (err == "NO_TRANSACTION")
        msg = message.general.no_transaction;

      res.json({
        status: "fail",
        data: err,
        message: msg
      })
    });
}