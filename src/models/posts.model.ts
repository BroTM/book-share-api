import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, DataTypes } from "sequelize";
import Category from "./categories.model";
import User from "./users.model";
import sequelize from "../database/mysql";

class Post extends Model<InferAttributes<Post, { omit: "category" }>, InferCreationAttributes<Post>> {

    declare post_id: CreationOptional<String>;
    declare title: string;
    declare content: string;
    declare status: 'draft' | 'published' | 'reported';
    declare reported_user_ids: string; // json array

    declare category_id: ForeignKey<Category['category_id']>;
    declare category?: NonAttribute<Category>;

    declare created_at: CreationOptional<Number>;
    declare created_by: ForeignKey<User['user_id']>;
    declare created_user?: NonAttribute<User>;

    declare updated_at: CreationOptional<Number>;
    declare updated_by: ForeignKey<User['user_id']>;
    declare updated_user?: NonAttribute<User>

}

sequelize.define('Post',
    {
        post_id: {
            type: DataTypes.STRING(45),
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        content: {
            type: DataTypes.STRING(600),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('draft', 'published', 'reported'),
            allowNull: false,
            defaultValue: 'draft'
        },
        reported_user_ids: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}
        },
        created_by: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        created_at: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_by: {
            type: DataTypes.STRING(45),
            allowNull: true
        },
        updated_at: {
            type: DataTypes.BIGINT,
            allowNull: true
        }
    },
    {
        tableName: "posts",
        timestamps: false
    });

export default Post;