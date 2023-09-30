export class paginateDto {
    declare limit: number; // page size
    declare start: number; // offset
}

export class filterDto {
    declare search_key?: string;
    declare date_between?: readonly [Date, Date]
}
