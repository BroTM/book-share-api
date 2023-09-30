import { Model, Table, Column, DataType } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";

@Table({
    tableName: "admins",
    timestamps: false
})
export class Admin extends Model {
    @Column({
        type: DataType.STRING(8),
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        field: "login_id"
    })
    login_id?: string;

    @Column({
        type: DataType.STRING(45),
        unique: 'name_UNIQUE',
        allowNull: false,
        field: "name"
    })
    declare name: string;

    @Column({
        type: DataType.STRING(300),
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.STRING(400),
        allowNull: false
    })
    declare token: string;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        defaultValue: () => current_timestamp()
    })
    declare created_at: number;
}
export default Admin;