import { NextFunction, Request, Response } from "express";
import userRepository from "../../repositories/users/users.repository";
import Utils from "../../utils/utils";
import message from "../../../config/response_message";

export function getOne (req: Request, res: Response, next: NextFunction) {

  let user_id = req.params?.id;

  if(!Utils.isNumber(user_id)) {
    return res.status(405).send({message: message.req_err.err_405})
  }

  userRepository.getOne(parseInt(user_id))
    .then((data: any )=> {
      res.json({
        'status': "success",
        'data': data.data
      });
    })
    .catch((err: any) => {
      console.log(`Error ${err}`)
      res.json({
        status: "fail",
        data: err,
        message: err == 'NO_TRANSACTION'? message.general.no_transaction : message.other.something_wrong
      })
    });
  }
