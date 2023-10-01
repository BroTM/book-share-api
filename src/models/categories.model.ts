import { Model, Table, Column, DataType, HasMany, IsUUID, Length, IsNumeric, BelongsTo, ForeignKey } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Post from "./posts.model";
import Utils from "../utils/utils";
import Admin from "./admins.model";

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

    @ForeignKey(() => Admin)
    @Column({
        type: DataType.STRING(45),
        allowNull: false
    })
    declare created_by: string;

    @BelongsTo(() => Admin, 'created_by')
    declare created_user: Admin;

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

    @ForeignKey(() => Admin)
    @Column({
        type: DataType.STRING(45)
    })
    declare updated_by?: string;

    @BelongsTo(() => Admin, 'updated_by')
    declare updated_user: Admin;

    @IsNumeric
    @Column({
        type: DataType.BIGINT,
        validate: {
            isCustomDate: Utils.validateDateFormat
        }
    })
    declare updated_at?: number;

    @HasMany(()=>Post, 'category_id')
    declare posts?: Post[]
}

export default Category;