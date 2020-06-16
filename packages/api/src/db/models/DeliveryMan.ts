import { Model, Sequelize, DataTypes } from 'sequelize';

import { SequelizeStaticType } from '..';

export interface DeliveryMan extends Model {
  readonly id: string;
  name: string;
  avatar_id?: string | null;
  email: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export type DeliveryManStatic = SequelizeStaticType<DeliveryMan>;

export function build(sequelize: Sequelize) {
  const DeliveryMan = sequelize.define(
    'delivery_man',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      avatar_id: {
        type: DataTypes.UUID,
        references: {
          model: 'avatars',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      email: {
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
  ) as DeliveryManStatic;

  DeliveryMan.associate = models => {
    models.DeliveryMan.belongsTo(models.Avatar, {
      foreignKey: 'avatar_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET_NULL',
    });
  };

  return DeliveryMan;
}
