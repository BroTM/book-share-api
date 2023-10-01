export class loginUserDto {
    declare email: string;
    declare password: string;
}

export class changePasswordDto {
    declare current_password: string;
    declare new_password: string;
    declare confirm_password: string;
}

export class signUpConfirmDto {
    declare token: string;
    declare email: string;
}

export class resetPasswordDto {
    declare token: string;
    declare new_password: string;
    declare confirm_password: string;
}

export class bioUpdateDto {
    declare user_name: string;
    declare bio: string;
}