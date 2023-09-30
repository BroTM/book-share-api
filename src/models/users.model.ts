import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, Association, ForeignKey } from "sequelize";
import Post from "./posts.model";
import sequelize from "../database/mysql";

class User extends Model<InferAttributes<User, { omit: 'posts' }>, InferCreationAttributes<User>> {
  declare user_id: CreationOptional<string>;

  declare user_name: string;

  declare email: string;
  declare password: string;
  declare bio: CreationOptional<String>;
  declare token: string;
  declare user_type: 'normal' | 'premium';
  declare status: 'no_verify' | 'verified' | 'suspended';

  declare created_at: CreationOptional<Number>;
  declare updated_at: CreationOptional<Number>;

  declare updated_by: ForeignKey<User['user_id']>;
  declare updated_user?: NonAttribute<User>

  declare posts?: NonAttribute<Post[]>;

  declare static associations: {
    posts: Association<User, Post>;
  };
}

sequelize.define('User',
  {
    user_id: {
      type: DataTypes.STRING(45),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "email_UNIQUE"
    },
    password: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    bio: {
      type: DataTypes.STRING(400),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(400),
      allowNull: false
    },
    user_type: {
      type: DataTypes.ENUM('normal', 'premium'),
      allowNull: false,
      defaultValue: 'normal'
    },
    status: {
      type: DataTypes.ENUM('no_verify', 'verified', 'suspended'),
      allowNull: false,
      defaultValue: 'no_verify'
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
    tableName: 'users',
    timestamps: false
  }
);

// Here we associate which actually populates out pre-declared `association` static and other methods.
// User.hasMany(Post, {
//   sourceKey: 'user_id',
//   foreignKey: 'created_by',
//   as: 'posts' // this determines the name in `associations`!
// });

export default User;