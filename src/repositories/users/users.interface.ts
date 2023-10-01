import { filterDto, paginateDto } from "@dtos/common.dto";
import User from "@models/users.model";
import { createUserDto, updateUserDto, deleteUserDto } from "@dtos/users.dto";

export interface IUserRepository {
    getOne: (id: number) => Promise<User | null>;
    findAll: ({limit=10, page}: paginateDto, filter_args?: filterDto ) => Promise<User[] | []>;
    add: (data: createUserDto) => Promise<User>;
    update: (id: number, data: updateUserDto) => Promise<User>;
    delete: (id: number, data: deleteUserDto) => Promise<User>;
}