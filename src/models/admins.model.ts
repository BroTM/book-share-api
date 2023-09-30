import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import sequelize from "../database/mysql";

class Admin extends Model<InferAttributes<Admin>, InferCreationAttributes<Admin>> {
    declare login_id: CreationOptional<string>;

    declare name: string;

    declare password: string;
    declare token: string;

    declare created_at: CreationOptional<Number>;
}

sequelize.define('Admin',
    {
        login_id: {
            type: DataTypes.STRING(8),
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING(45),
            unique: 'name_UNIQUE',
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        token: {
            type: DataTypes.STRING(400),
            allowNull: false
        },
        created_at: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: 'admins',
        timestamps: false
    }
);

export default Admin;