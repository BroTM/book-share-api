import { Model, Table, Column, DataType, HasMany, IsUUID, Length, Is, IsEmail, IsIn, IsNumeric } from "sequelize-typescript";
import { current_timestamp } from "../utils/common";
import Post from "./posts.model";
import Utils from "../utils/utils";

@Table({
  tableName: "users",
  timestamps: false
})
class User extends Model {

  @IsUUID(4)
  @Column({
    type: DataType.STRING(45),
    primaryKey: true,
    defaultValue: DataType.UUIDV4
  })
  declare user_id: string;

  @Length({min: 4, max: 45})
  @Is(/^[a-zA-Z0-9]+$/i) //no special character
  @Column({
    type: DataType.STRING(45),
    allowNull: false
  })
  declare user_name: string;

  @IsEmail
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

  @Length({max: 400})
  @Column({
    type: DataType.STRING(400)
  })
  declare bio?: string;

  @Column({
    type: DataType.STRING(400),
    allowNull: false
  })
  declare token: string;

  @IsIn([['normal', 'premium']])
  @Column({
    type: DataType.ENUM('normal', 'premium'),
    allowNull: false,
    defaultValue: 'normal'
  })
  declare user_type: 'normal' | 'premium';

  @IsIn([['no_verify', 'verified']])
  @Column({
    type: DataType.ENUM('no_verify', 'verified', 'suspended'),
    allowNull: false,
    defaultValue: 'no_verify'
  })
  declare status: 'no_verify' | 'verified' | 'suspended';

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

  @Column({
    type: DataType.STRING(45)
  })
  declare updated_by?: string;

  @IsNumeric
  @Column({
    type: DataType.BIGINT,
    validate: {
      isCustomDate: Utils.validateDateFormat
  }
  })
  declare updated_at?: number;

  @HasMany(()=>Post, "created_by")
  declare posts?: Post[]
}

export default User;
