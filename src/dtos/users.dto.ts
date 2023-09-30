export class createUserDto {
    declare first_name: string;
    declare last_name: string | null;
}

export class updateUserDto {
    declare first_name: string;
    declare last_name: string | null;
    declare updated_by: number;
}

export class deleteUserDto {
    declare deleted_by: number;
}
