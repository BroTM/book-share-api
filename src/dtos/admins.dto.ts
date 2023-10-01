export class loginAdminDto {
    declare login_id: string;
    declare password: string;
}

export class filterBy {
    declare status?: 'no_verify' | 'verified' | 'suspended';
    declare user_type?: 'normal' | 'premium';
}

// export class updateAdminDto {
//     declare first_name: string;
//     declare last_name: string | null;
//     declare updated_by: number;
// }
