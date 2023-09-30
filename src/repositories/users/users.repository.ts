import User from "../../models/users.model";
import { createUserDto, deleteUserDto, updateUserDto } from "../../dtos/users.dto";
import { filterDto, paginateDto } from "../../dtos/common.dto";

import {IUserRepository} from "./users.interface";

class UserRepository implements IUserRepository {

    public async getOne(id: number) : Promise<User | null> {

        let user = await User.findByPk(id);

        if(!user) return Promise.reject("NO_TRANSACTION");

        return user;
    }
    
    public async findAll({limit=10, start}: paginateDto, filter_args?: filterDto ): Promise<User[] | []> {
        return [];
    }

    public async add(data: createUserDto): Promise<User> {

        const user = await User.create();

        return user;
    }
    
    public async update(id: number, data: updateUserDto): Promise<User> {
        return new User;
    }
    
    public async delete(id: number, data: deleteUserDto): Promise<User> {
        return new User;
    }
}

export default new UserRepository();