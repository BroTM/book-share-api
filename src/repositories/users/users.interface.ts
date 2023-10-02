import { updateUserInfoDto, paginateDto } from "@dtos/common.dto";
import User from "@models/users.model";
import { loginUserDto, changePasswordDto, resetPasswordDto, signUpConfirmDto, bioUpdateDto, filterForAdminDto } from "@dtos/users.dto";

export interface IUserRepository {
    login: (data: loginUserDto) => Promise<User>;
    bioUpdate: (id: string, data: bioUpdateDto) => Promise<User>;
    signup: (data: User) => Promise<void>;
    signupConfirm: (data: signUpConfirmDto) => Promise<User>;
    changePassword: (id: string, data: changePasswordDto) => Promise<void>;
    forgetPassword: (email: string) => Promise<void>;
    resetPassword: (data: resetPasswordDto) => Promise<User>;
    logout: (id: string) => Promise<void>;
    me: (id: string) => Promise<User>;

    /** @route /admin/users */
    allUsersForAdmin: (args: paginateDto, filter_args: filterForAdminDto) => Promise<User[]>;

    /** @route /admin/categories/{category_id} */
    getOne: (id: string) => Promise<User>;

    /**
     * if user provide status, status update 
     * @route /admin/users/{user_id}/status */
    suspend: (id: string, updated_user: updateUserInfoDto) => Promise<User>;

    /** @route /admin/users/{user_id} */
    destroy: (id: string) => Promise<void>;
}