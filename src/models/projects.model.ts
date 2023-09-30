import { Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, ForeignKey, DataTypes } from "sequelize";
import User from "./users.model";
import sequelize from "../database/mysql";

class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {

    declare project_id: CreationOptional<Number>;
    declare owner_id: ForeignKey<User['user_id']>;
    declare name: string;

    declare owner?: NonAttribute<User>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare projects?: NonAttribute<Project[]>;
}

Project.init({
    project_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: new DataTypes.STRING(128),
        allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
},
{
    tableName: "projects",
    sequelize
});

export default Project;