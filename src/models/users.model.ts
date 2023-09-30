import { Model, Table, Column, DataType, HasMany } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Post from "./posts.model";

@Table({
  tableName: "users",
  timestamps: false
})
class User extends Model {

  @Column({
    type: DataType.STRING(45),
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  declare user_id: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: false
  })
  declare user_name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: "email_UNIQUE"
  })
  declare email: string;

  @Column({
    type: DataType.STRING(300),
    allowNull: false
  })
  declare password: string;

  @Column({
    type: DataType.STRING(400)
  })
  declare bio?: string;

  @Column({
    type: DataType.STRING(400),
    allowNull: false
  })
  declare token: string;

  @Column({
    type: DataType.ENUM('normal', 'premium'),
    allowNull: false,
    defaultValue: 'normal'
  })
  declare user_type: 'normal' | 'premium';

  @Column({
    type: DataType.ENUM('no_verify', 'verified', 'suspended'),
    allowNull: false,
    defaultValue: 'no_verify'
  })
  declare status: 'no_verify' | 'verified' | 'suspended';

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

export default User;
