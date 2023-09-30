import { Model, Table, Column, DataType, IsUUID, Length, Is, IsDate, IsNumeric } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Utils from "../utils/utils";

@Table({
    tableName: "admins",
    timestamps: false
})
export class Admin extends Model {
    
    @Is(/^[a-zA-Z0-9]+$/i) //no special character
    @Length({min:8, max:8, msg:"login_id must be length 8!"})
    @Column({
        type: DataType.STRING(8),
        primaryKey: true,
        field: "login_id"
    })
    login_id?: string;

    @Is(/^[a-zA-Z0-9]+$/i) //no special character
    @Length({min: 2, max: 45, msg: "4<=x<=45"})
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

    @IsNumeric
    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        defaultValue: () => current_timestamp(),
        validate: {
            isCustomDate: Utils.validateDateFormat
        }
    })
    declare created_at: number;
}
export default Admin;