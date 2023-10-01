import { filterDto, paginateDto } from "@dtos/common.dto";
import User from "@models/users.model";
import { loginUserDto, changePasswordDto, resetPasswordDto, signUpConfirmDto, bioUpdateDto } from "@dtos/users.dto";

export interface IUserRepository {
    login: (data: loginUserDto) => Promise<User>;
    bioUpdate: (id: string, data: bioUpdateDto) => Promise<User>;
    signup: (data: User) => Promise<void>;
    signupConfirm: (data: signUpConfirmDto) => Promise<User>;
    changePassword: (data: changePasswordDto) => Promise<void>;
    forgetPassword: (email: string) => Promise<void>;
    resetPassword: (data: resetPasswordDto) => Promise<void>;
    logout: (id: string) => Promise<void>;
    me: (id: string) => Promise<User>;
}