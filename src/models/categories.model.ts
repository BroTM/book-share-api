import { Model, Table, Column, DataType, HasMany, IsUUID, Length, IsNumeric } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Post from "./posts.model";
import Utils from "../utils/utils";

@Table({
    tableName: "categories",
    timestamps: false
})
class Category extends Model {
    @IsUUID(4)
    @Column({
        type: DataType.STRING(45),
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    category_id?: string;

    @Length({min: 2, max: 45, msg: "min:2 and max:45"})
    @Column({
        type: DataType.STRING(45),
        unique: 'name_UNIQUE',
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING(45),
        allowNull: false
    })
    declare created_by: string;

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

    @Column({
        type: DataType.STRING(45)
    })
    declare updated_by?: string;

    @IsNumeric
    @Column({
        type: DataType.BIGINT,
        validate: {
            isCustomDate: Utils.validateDateFormat
        }
    })
    declare updated_at?: number;

    @HasMany(()=>Post)
    declare posts?: Post[]
}

export default Category;