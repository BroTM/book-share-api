import { DataTypes, Sequelize, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Association } from "sequelize";
import Project from "./projects.model";
import sequelize from "../database/mysql";

class User extends Model<InferAttributes<User, { omit: 'projects' }>, InferCreationAttributes<User>> {
  declare user_id: CreationOptional<Number>;

  declare first_name: string;
  declare last_name: string | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare projects?: NonAttribute<Project[]>;

  get fullName(): NonAttribute<string> {
    return [this.first_name, this.last_name].join(' ');
  }

  declare static associations: {
    projects: Association<User, Project>;
  };
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: {
      type: new DataTypes.STRING(25),
      allowNull: false
    },
    last_name: {
      type: new DataTypes.STRING(25),
      defaultValue: null,
      allowNull: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: 'users',
    sequelize // passing the `sequelize` instance is required
  }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
User.hasMany(Project, {
  sourceKey: 'user_id',
  foreignKey: 'ownerId',
  as: 'projects' // this determines the name in `associations`!
});

export default User;