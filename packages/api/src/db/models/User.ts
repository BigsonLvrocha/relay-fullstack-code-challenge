import { Model, Sequelize, DataTypes, BuildOptions } from 'sequelize';

export interface User extends Model {
  readonly id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export type UserStatic = typeof Model & {
  new (values?: Partial<User>, options?: BuildOptions): User;
};

export function build(sequelize: Sequelize) {
  const User = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  ) as UserStatic;
  return User;
}
