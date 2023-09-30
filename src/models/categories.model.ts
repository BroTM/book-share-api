import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Association } from "sequelize";
import Post from "./posts.model";
import sequelize from "../database/mysql";

class Category extends Model<InferAttributes<Category, { omit: 'posts' }>, InferCreationAttributes<Category>> {
    declare category_id: CreationOptional<String>;

    declare name: string;

    declare created_at: CreationOptional<Number>;
    declare created_by: String;
    declare updated_at: CreationOptional<Number>;
    declare updated_by: CreationOptional<String>;

    declare posts?: NonAttribute<Post[]>;

    declare static associations: {
        posts: Association<Category, Post>;
    };
}

sequelize.define('Category',
    {
        category_id: {
            type: DataTypes.STRING(45),
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            unique: 'name_UNIQUE',
            allowNull: false
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
        tableName: 'categories',
        timestamps: false
    }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
Category.hasMany(Post, {
    sourceKey: 'category_id',
    foreignKey: 'category_id',
    as: 'posts' // this determines the name in `associations`!
});

export default Category;