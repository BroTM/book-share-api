export class paginateDto {
    declare limit: number; // page size
    declare page: number; // page no
}

export class filterDto {
    declare search_key?: string;
    declare date_between?: readonly [Date, Date]
}

export class DataStoredInToken {
    declare id: string;
    declare auth_type: "USER" | "ADMIN";
    declare token_status: "REGISTER" | "LOGIN" | "LOGOUT";
}