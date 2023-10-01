import { Model, Table, Column, DataType, ForeignKey, BelongsTo, IsUUID, Length, IsIn, AllowNull, IsNumeric } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Category from "./categories.model";
import User from "./users.model";
import Utils from "../utils/utils";

@Table({
    tableName: 'posts',
    timestamps: false
})
class Post extends Model {

    @IsUUID(4)
    @Column({
        type: DataType.STRING(45),
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    declare post_id?: string;

    @Length({min: 2, max: 100})
    @Column({
        type: DataType.STRING(100),
        allowNull: false

    })
    declare title: string;

    @Length({min: 4, max: 600})
    @Column({
        type: DataType.STRING(600),
        allowNull: false
    })
    declare content: string;

    @IsIn([['draft', 'published']])
    @Column({
        type: DataType.ENUM('draft', 'published', 'reported'),
        allowNull: false,
        defaultValue: 'draft'
    })
    declare status: 'draft' | 'published' | 'reported';

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: "[]",
        validate: {
            mustBeArray: (val: string) => {
                if(!Array.isArray(JSON.parse(val)))
                throw new Error('must be type of json array');
            }
        }
    })
    declare reported_user_ids: string; // json array

    // association with category
    @ForeignKey(() => Category)
    @AllowNull(false)
    @Column({type: DataType.STRING(45)})
    declare category_id: string;

    @BelongsTo(() => Category, "category_id")
    declare category: Category;

    // association with User
    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING(45),
        allowNull: false
    })
    declare created_by: string;

    @BelongsTo(() => User, 'created_by')
    declare created_user: User;

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

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING(45)
    })
    declare updated_by?: string;

    
    @BelongsTo(() => User, 'updated_by')
    declare updated_user: User;

    @IsNumeric
    @Column({
        type: DataType.BIGINT,
        validate: {
            isCustomDate: Utils.validateDateFormat
        }
    })
    declare updated_at?: number;

}
export default Post;