import { Model, Table, Column, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Category from "./categories.model";
import User from "./users.model";

@Table({
    tableName: 'posts',
    timestamps: false
})
class Post extends Model {

    @Column({
        type: DataType.STRING(45),
        primaryKey: true,
        defaultValue: DataType.UUIDV4
    })
    declare post_id?: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false

    })
    declare title: string;

    @Column({
        type: DataType.STRING(600),
        allowNull: false
    })
    declare content: string;

    @Column({
        type: DataType.ENUM('draft', 'published', 'reported'),
        allowNull: false,
        defaultValue: 'draft'
    })
    declare status: 'draft' | 'published' | 'reported';

    @Column({
        type: DataType.JSON,
        allowNull: false,
        defaultValue: {}
    })
    declare reported_user_ids: string; // json array

    // association with category
    @ForeignKey(() => Category)
    @Column
    declare category_id: string;

    @BelongsTo(() => Category)
    declare category: Category;

    // association with User
    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING(45),
        allowNull: false
    })
    declare created_by: string;

    @BelongsTo(() => User)
    declare created_user: User;

    @Column({
        type: DataType.BIGINT,
        allowNull: false,
        defaultValue: () => current_timestamp()
    })
    declare created_at: number;

    @Column({
        type: DataType.STRING(45)
    })
    declare updated_by?: string;

    @Column({
        type: DataType.BIGINT
    })
    declare updated_at?: number;

}
export default Post;