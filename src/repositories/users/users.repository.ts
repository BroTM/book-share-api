import User from "@models/users.model";
import { loginUserDto, changePasswordDto, resetPasswordDto, signUpConfirmDto, bioUpdateDto } from "@dtos/users.dto";
import bcrypt from "bcrypt";

import { IUserRepository } from "./users.interface";
import adminsRepository from "../admins/admins.repository";
import { current_timestamp } from "../../utils/common";

class UserRepository implements IUserRepository {

    /**
     * 
     * @param id 
     * @returns User Info
     */
    public async me(id: string): Promise<User> {

        try{
          
        let user = await User.findOne({ 
            attributes: { exclude: ['password', 'user_type', 'created_by', 'updated_by', 'token']},
            where: { user_id: id } });

        if (!user) return Promise.reject("NO_TRANSACTION");

        return user;
        } catch(err: any) {

            return Promise.reject(err);
        }
    }

    /**
     * updateAt, updated_by
     * @param id 
     * @param _data 
     * @returns 
     */
    public async bioUpdate(id: string, _data: bioUpdateDto): Promise<User> {
        try{
            let updatedAt = current_timestamp();
            const affectedRows = await User.update(
                {bio: _data.bio, user_name: _data.user_name, updated_at: updatedAt, updated_by: id}, 
                {where: { user_id: id }}
                );

            if(!affectedRows)
                return Promise.reject("UPDATE_FAIL");

            const user = await User.findOne({
                attributes: { exclude: ['password', 'user_type', 'created_by', 'updated_by', 'token']},
                where: { user_id: id } 
            });

            return user!;
        } catch(err: any) {
            
            return Promise.reject(err);
        }
    }

    public async changePassword(_id: string, _data: changePasswordDto): Promise<void> {
        try {
            if(_data.new_password !== _data.confirm_password)
                return Promise.reject("DO_NOT_MATCH_PASSWORD");

            let user = await User.findOne({ attributes: ['password', 'user_id'], where: { user_id: _id } });

            if (!user) return Promise.reject("NO_TRANSACTION");

            //check old password
            let match = await bcrypt.compareSync(_data.current_password, user.password);

            if (!match)
                return Promise.reject("INCORRECT_PASSWORD");

            //new password
            const salt = bcrypt.genSaltSync(10);

            let hashPassword = await bcrypt.hashSync(_data.new_password, salt);
            
            user.password = hashPassword;
            user.updated_at = current_timestamp();
            user.updated_by = _id;

            let affectedRows = await user.save();

            return;
        } catch (err: any) {
            return Promise.reject(err);
        }
    }

    public async login(_data: loginUserDto): Promise<User> {
        try {
            let user = await User.findOne({ where: { email: _data.email } });

            if (!user) return Promise.reject("NO_TRANSACTION");

            let match = await bcrypt.compareSync(_data.password, user.password);

            if (!match)
                return Promise.reject("INCORRECT_PASSWORD");

            const _token = await adminsRepository.generateToken(user.user_id, 'USER', 'LOGIN', user.user_name);
            // const affectedRows = await User.update({ token: _token }, { where: { user_id: user.user_id } })
            
            const { password, user_type, created_by, updated_by, ...withoutSomeAttribute } = user.dataValues;
            withoutSomeAttribute.token = _token;

            return withoutSomeAttribute;

        } catch (err: any) {
            return Promise.reject(err);
        }
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

            // smtp service here
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

    public async forgetPassword(email: string): Promise<void> {
        
        try{
          
            let user = await User.findOne({ attributes: ['user_id', 'user_name'], where: { email: email } });
    
            if (!user) return Promise.reject("NO_TRANSACTION");
    
            const _token = await adminsRepository.generateToken(email!, 'USER', 'REGISTER', user.user_name);

            // update with confirmation token
            user.token = _token;
            let affectedRows = await user.save();

            //smtp service here

            return;
            } catch(err: any) {

                return Promise.reject(err);
            }
    }

    /**
     * reset password with token from email service
     * @param _data 
     * @returns User
     */
    public async resetPassword(_data: resetPasswordDto): Promise<User> {
        try {
            if(_data.new_password !== _data.confirm_password)
                return Promise.reject("DO_NOT_MATCH_PASSWORD");

            let user = await User.findOne({ 
                attributes: {exclude: ['password', 'user_type', 'created_by', 'updated_by']},
                where: { token: _data.token } 
            });

            if (!user) return Promise.reject("NO_TRANSACTION");

            //new password
            const salt = bcrypt.genSaltSync(10);

            let hashPassword = await bcrypt.hashSync(_data.new_password, salt);

            user.password = hashPassword;
            user.updated_at = current_timestamp();
            user.updated_by = user.user_id;

            let affectedRows = await user.save();

            //for user login
            const _token = await adminsRepository.generateToken(user.user_id!, 'USER', 'LOGIN', user.user_name);

            const { password, token, updated_by, ...withoutPassword } = user.dataValues;
            withoutPassword.token = _token;

            return withoutPassword;
        } catch (err: any) {

            return Promise.reject(err);
        }
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