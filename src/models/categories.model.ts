import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Post from "./posts.model";

@Table({
    tableName: "categories",
    timestamps: false
})
class Category extends Model {
    @Column({
        type: DataType.STRING(45),
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        allowNull: false,
    })
    category_id?: string;

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

    @HasMany(()=>Post)
    declare posts?: Post[]
}

export default Category;