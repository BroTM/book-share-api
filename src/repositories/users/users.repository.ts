import User from "@models/users.model";
import { loginUserDto, changePasswordDto, resetPasswordDto, signUpConfirmDto, bioUpdateDto } from "@dtos/users.dto";
import bcrypt from "bcrypt";

import { IUserRepository } from "./users.interface";
import adminsRepository from "../admins/admins.repository";

class UserRepository implements IUserRepository {

    public async me(id: string): Promise<User> {
        return new User;
    }

    public async login(_data: loginUserDto): Promise<User> {
        try {
            let user = await User.findOne({ where: { email: _data.email } });

            if (!user) return Promise.reject("NO_TRANSACTION");

            let match = await bcrypt.compareSync(_data.password, user.password);

            if (!match)
                return Promise.reject("INCORRECT_PASSWORD");

            const _token = await adminsRepository.generateToken(user.user_id, 'USER', 'LOGIN', user.user_name);
            const affectedRows = await User.update({ token: _token }, { where: { user_id: user.user_id } })
            
            const { password, user_type, created_by, updated_by, ...withoutSomeAttribute } = user.dataValues;
            withoutSomeAttribute.token = _token;

            return withoutSomeAttribute;

        } catch (err: any) {
            return Promise.reject(err);
        }
    }
    public async bioUpdate(data: bioUpdateDto): Promise<User> {

        return new User;
    }

    /**
     * when signup, store email in token
     * @param _data 
     * @returns 
     */
    public async signup(_data: User): Promise<void> {

        try {
            //hash the password
            const salt = bcrypt.genSaltSync(10);

            const hash_password = await bcrypt.hashSync(_data.password!, salt);

            const _token = await adminsRepository.generateToken(_data.email!, 'USER', 'REGISTER', _data.user_name);

            let user = await User.create({
                email: _data.email,
                user_name: _data.user_name,
                password: hash_password,
                token: _token
            })

            return;
        } catch (err: any) {

            return Promise.reject(err);
        }
    }

    /**
     * after confirm, store user_id
     * confirm with token and email and status is verified, generate jwt with new token
     * @param _data signUpComfirmDto
     * @returns data without password
     */
    public async signupConfirm(_data: signUpConfirmDto): Promise<User | any> {

        try {

            let user = await User.findOne({ where: { email: _data.email, token: _data.token, status: 'verified' } });

            if (!user) return Promise.reject("NO_TRANSACTION");

            const _token = await adminsRepository.generateToken(user.user_id!, 'USER', 'REGISTER', user.user_name);
            // const affectedRows = await User.update({ token: _token }, { where: { user_id: user.user_id } })

            const { password, user_type, created_by, updated_by, ...withoutPassword } = user.dataValues;
            withoutPassword.token = _token;

            return withoutPassword;
        } catch (err: any) {

            return Promise.reject(err);
        }
    }
    public async changePassword(data: changePasswordDto): Promise<void> {

    }
    public async forgetPassword(email: string): Promise<void> {

    }
    public async resetPassword(data: resetPasswordDto): Promise<void> {

    }
    public async logout(id: string): Promise<void> {
        try {
            let user= await User.findOne({ where: { user_id: id } });
      
            if (!user) return Promise.reject("NO_TRANSACTION");
      
            //   const token = await adminsRepository.generateToken(id, 'USER', 'LOGOUT', user.user_name);
            //   const affectedRows = await User.update({token: token}, {where: {login_id: user.user_id}});
      
              return;
          } catch (err: any) {
            return Promise.reject(err);
          }
    }
    public async register(data: User): Promise<User> {
        return new User;
    }
}

export default new UserRepository();