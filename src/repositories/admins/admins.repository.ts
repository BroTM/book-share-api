import Admin from "@models/admins.model";
import { loginAdminDto } from "@dtos/admins.dto";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import authConfig from "../../../config/auth.config";

import { IAdminRepository } from "./admins.interface";
import { DataStoredInToken } from "@dtos/common.dto";

class AdminRepository implements IAdminRepository {

  public async login(_data: loginAdminDto): Promise<Admin | any> {

    try {
      let admin= await Admin.findOne({ where: { login_id: _data.login_id } });

      if (!admin) return Promise.reject("NO_TRANSACTION");

      let match = await bcrypt.compareSync(_data.password, admin.password);

      if (!match)
        return Promise.reject("INCORRECT_PASSWORD");

        const token = await this.generateToken(_data.login_id, 'ADMIN', 'LOGIN', admin.name);
        const affectedRows = await Admin.update({token: token}, {where: {login_id: admin.login_id}})

        const { password, ...withoutPassword } = admin.dataValues;
        withoutPassword.token = token;

        return withoutPassword;
      
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  public async logout(id: string): Promise<void> {

    try {
      let admin= await Admin.findOne({ where: { login_id: id } });

      if (!admin) return Promise.reject("NO_TRANSACTION");


        const token = await this.generateToken(id, 'ADMIN', 'LOGOUT', admin.name);
        const affectedRows = await Admin.update({token: token}, {where: {login_id: admin.login_id}});

        return;
    } catch (err: any) {
      return Promise.reject(err);
    }
  }

  public async register(_data: Admin): Promise<Admin | any> {

    //hash the password
    const salt = bcrypt.genSaltSync(10);

    try {

      const hash_password = await bcrypt.hashSync(_data.password!, salt);

      const _token = await this.generateToken(_data.login_id!, 'ADMIN', 'REGISTER', _data.name);

      let admin = await Admin.create({
        login_id: _data.login_id,
        name: _data.name,
        password: hash_password,
        token: _token
      })
      const {password, token, ...withoutCredential} = admin.dataValues;

      return withoutCredential;
    } catch (err: any) {

      return Promise.reject(err);
    }
  }
  public async generateToken (_login_id: string, _auth_type: "USER" | "ADMIN", _token_status: "REGISTER" | "LOGIN" | "LOGOUT", _name: string) {
    const dataStoredInToken: DataStoredInToken = {
      id: _login_id,
      name: _name,
      auth_type: _auth_type,
      token_status: _token_status
    };
    const secretKey: string = authConfig.secret_key!;
    const expiresIn: number = 60 * 60 * 24;
  
    return await sign(dataStoredInToken, secretKey, { expiresIn });
  };
}

export default new AdminRepository();