import Admin from "@models/admins.model";
import { loginAdminDto } from "@dtos/admins.dto";

export interface IAdminRepository {
    login: (data: loginAdminDto) => Promise<Admin>;
    logout: (id: string) => Promise<void>;
    register: (data: Admin) => Promise<Admin>;
}