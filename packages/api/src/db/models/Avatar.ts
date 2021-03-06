import { Model, Sequelize, DataTypes } from 'sequelize';

import { SequelizeStaticType } from '..';

export interface Avatar extends Model {
  readonly id: string;
  original_name: string;
  path: string;
  created_at: Date;
  updated_at: Date;
}

export type AvatarStatic = SequelizeStaticType<Avatar>;

export function build(sequelize: Sequelize) {
  const Avatar = sequelize.define(
    'avatar',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      original_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  ) as AvatarStatic;
  return Avatar;
}
